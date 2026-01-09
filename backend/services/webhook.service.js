import { pool } from "../db/db.js";
import {
    sendConfirmationEmail,
    sendPaymentFailedEmail,
    sendRefundEmail,
    sendDisputeAlertEmail,
    sendAbandonedCheckoutEmail,
} from "../utils/email.js";


// --------------  HANDELS EACH EVENT TYPE --------------

// GET OBJECT FROM EVENT:
// session = event.data.object
export async function handleCheckoutCompleted(session) {

    // checkout session object has porperites 
    const name = session.customer_details?.name;
    const email = session.customer_details?.email;
    const amount = session.amount_total / 100;
    const paymentIntentId = session.payment_intent;

    // SEND RECIPT / THANKYOU EMAIL 
    console.log("🔔 Sending receipt email to:", email);

    try {
        await sendConfirmationEmail({ name, email, amount });
        console.log("✅ Email sent");
    } catch (err) {
        console.error("❌ Error sending email:", err);
    }

    // INSERT DONATION INTO DB
    // .none bc not expexting any returned rows 
    await pool.query(
        `
        UPDATE donations
        SET
        donor_email = $2,
        stripe_payment_intent_id = $3,
        status = 'succeeded'
        WHERE stripe_session_id = $1;
        `,
        [session.id, email, paymentIntentId]
    );

    console.log("💾 Saved donation to DB:", session.id);
}

// -------------- PAYMENT FAILED AFTER LEAVING CHECOUT -------
export async function handlePaymentFailed(paymentIntent) {
    // 3 possible locations of the donors email, depending on why the paymetn failed
    const email =
        // possible location 1: email is in donatin form some where: elements( expressHcekoutelemnt, payment element)
        paymentIntent.last_payment_error?.payment_method?.billing_details?.email ||
        // possible location 2: Stripe attaches Charge object to PaymentIntent
        paymentIntent.charges?.data?.[0]?.billing_details?.email ||
        paymentIntent.receipt_email;

    const reason =
        paymentIntent.last_payment_error?.message ||
        "No Stripe last payment error message was found so, Your payment could not be completed.";

    const retryUrl =
        (process.env.BASE_URL || "http://localhost:3000") + "/donate";

    console.log("❌ Payment failed for:", email);

    if (email) {
        await sendPaymentFailedEmail({ email, reason, retryUrl });
    }

    // TODO: DB → record failure
    if (paymentIntent.id) {
    await pool.query(
        `
        UPDATE donations
        SET status = 'failed'
        WHERE stripe_payment_intent_id = $1
            AND status = 'pending';
        `,
        [paymentIntent.id]
    );
    }


}

// -------------- REFUND CREATED OR UPDATED --------------
export async function handleRefund(charge) {
    const email = charge.billing_details?.email;
    const amount = charge.amount_refunded / 100;
    const paymentIntentId = charge.payment_intent;

    if (email) {
        await sendRefundEmail({ email, amount });
    }

    if (paymentIntentId) {
        await pool.query(
            `
                UPDATE donations
                SET status = 'refunded'
                WHERE stripe_payment_intent_id = $1
                    AND status != 'refunded';
            `,
            [paymentIntentId]
        );
    }
}

// -------------- DISPUTE ----------------------------
export async function handleDispute(dispute) {
    const chargeId = dispute.charge;
    const amount = dispute.amount / 100;

    console.log("⚠️ Chargeback on:", chargeId);

    // email admin
    await sendDisputeAlertEmail({ chargeId, amount });
}

// -------------- ABANDOND CHECKOUT --------------
export async function handleAbandonedCheckout(session) {

    console.log("🚫 Checkout expired:", session.id);
    
    const email = session.customer_details?.email;
    const resumeUrl =
        (process.env.BASE_URL || "http://localhost:3000") + "/donate";

    if (email) {
        await sendAbandonedCheckoutEmail({ email, resumeUrl });
    }

    // TODO: DB → log abandoned session
    await pool.query(
    `
        UPDATE donations
        SET status = 'abandond'
        WHERE stripe_session_id = $1
        AND status = 'pending';
    `,
    [session.id]
    );

}
