// Extract business logic into a service
// Because “how to create a checkout session” is not an HTTP concern.

// No req
// No res
// No Express

// This file could be reused by:
// - API
// - Admin scripts
// - Tests
// - Background jobs

import { stripe } from "../utils/stripe.js";

// CREATE A STRIPE CHECKOUTSESSION 
// req.body = donation info sent from your frontend
export async function createCheckoutSession({ priceID, amountCents }) {

    let lineItem;

    if(priceID) {
        lineItem = { price: priceID, quantity: 1};
    } else if (amountCents) {
        lineItem = {
            price_data: {
                product_data: { name: "custom donation" }, 
                currency: "USD",
                unit_amount: amountCents,
            },
            quantity: 1,
        };
    } else {
        throw new Error("Must provide priceID or amountCents");
    }

    // calls stripes API to create a checkout session object on stripes servers
    // strip automatically links a paymetn inetnt
    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        mode: "payment",
        billing_address_collection: 'auto',
        line_items: [lineItem],
        return_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
        // return_url: "http://localhost:5173/complete?session_id={CHECKOUT_SESSION_ID}",
    });

    // sends res back to frontend 
    return {clientSecret: session.client_secret};
}

// GET checkout + payment status 
// CONFIRMS PAYMENT STATUS, SESSION STATUS 
// since my broweser can talk to stripes secret API directly , server must do it and report bakc a safe summary
// the browser needs to knwo if the donation succeeeded, right now only stripe knows. and only server wuth the secret key can securley cas stripe for the real ressult
export async function getCheckoutSessionStatus(sessionId) {
    // stripe.checkout.sessions.retrieve(...) server calls stripes APU using secret key(already configured in stripe client) to fetch the checkout session object for that session id
    const session = await stripe.checkout.sessions.retrieve(
        // req.query.session_id reads the session_id query param from the URL 
        // req query param is set in complete.js
        sessionId, 
        // expand: ["payment_intent"]sesion.paymetn_intetn woudljust be an ID string
        // exand tells stripe "inline the fill Payment INtent objecgt right in teh response"
        {expand: ["payment_intent"]},
    );

    if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: 'Payment not completed' });
    }

    // return stable response:
    return res.json({ success: true });


    return {
        status: session.status,
        payment_status: session.payment_status,
        payment_intent_id: session.payment_intent?.id,
        payment_intent_status: session.payment_intent?.status, // STATUS OF THE PAYMENT INTETN
    };
}
