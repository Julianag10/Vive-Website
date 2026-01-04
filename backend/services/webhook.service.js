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
    await pool.none(
        `INSERT INTO donations (session_id, email, name, amount, status)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT(session_id) DO NOTHING`,
        [session.id, email, name, amount, "completed"]
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

}

// -------------- REFUND CREATED OR UPDATED --------------
export async function handleRefund(charge) {
    const email = charge.billing_details?.email;
    const amount = charge.amount_refunded / 100;

    if (email) {
        await sendRefundEmail({ email, amount });
    }

    // TODO: DB → update donation refund status
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
}
