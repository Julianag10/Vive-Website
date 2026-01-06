// PUBLIC 

// Controllers translate:
// HTTP → business logic → HTTP

// Controller responsibilities:
// - Reads req.body
// - Handles errors
// - Sends JSON

import { 
    createCheckoutSession,
    getCheckoutSessionStatus,
} from "../services/stripe.service.js";

import { 
    insertDonation,
    markDonationSucceeded,
} from "../services/donations.service.js";


// POST /checkout/create-checkout-session
// Creates Stripe session + inserts pending donation in DB
export async function createCheckoutSessionController(req, res) {
    try {
        console.log("➡️ /create-checkout-session hit");
        console.log("📥 Body received:", req.body);

        const {clientSecret, session} = await createCheckoutSession(req.body);

        // PENDING DONATION WRITE TO DB (idempotent)
        // insertDonation is a side effect because the main purpose of this endpoint is to create a stripe checkout session
        // so persistence is the side effect of creating the session
        await insertDonation({
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent ?? null,
            amountCents: session.amount_total,
            currency: session.currency,
            donorEmail: session.customer_details?.email ?? null,
            status: "pending",
        });

        // matches rhe frontend expectation
        res.json({clientSecret});

    } catch (err) { // catches the error thown by service
        
        console.error("❌ Error creating sesion: ",  err);
        res.status(400).json({ error: err.message });
    }
}


// GET /checkout/session-status
// Reads session status from Stripe  + marks donation succeded in DB
export async function getSessionStatusController(req, res) {
    try {
        // req.query is express object that holds query params from URL
        // express parses req.query automatically
        // req query param is set in complete.js
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ error: "session_id required" });
        }
        
        // 1. ask stripe for checkout session status
        const session = await getCheckoutSessionStatus(session_id);

        // verified that the payment_status is 'paid' FROM STRIPE 
        if (session.payment_status === "paid") {
            // 2. Update DB (idempotent)
            await markDonationSucceeded({
                stripeSessionId: session_id,
                stripePaymentIntentId: session.payment_intent_id,
            });
        }

        // return stats paid to front end
        // res.json({ status: "paid" });
        // res.json(session)
        res.json({
            payment_status: session.payment_status, // paid | unpaid
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}