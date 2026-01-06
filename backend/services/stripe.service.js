// BUINESS LOGIC FOR STRIPE
// Because “how to create a checkout session” is not an HTTP concern.
// no req 
// no res

import { getStripe } from "../utils/stripe.js";
// const stripe = getStripe();

// CREATE A STRIPE CHECKOUTSESSION 
// req.body = donation info sent from your frontend
export async function createCheckoutSession({ priceID, amountCents }) {

    const stripe = getStripe();

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

    // 1. calls stripes API to create a CHECKOUT SESSION OBJECT on STRIPE servers
    // 2. stripe automatically creates + links a PAYMETN INTENT to the checkout session
    // 3. stripe genreates a CLIENT SECRET linked to the checkout session + payment intent
    // 4. stripe returns the checkout session object to my server
    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        mode: "payment",
        billing_address_collection: 'auto',
        line_items: [lineItem],
        // after payment, stripe redirects user to this URL
        return_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
    });

    // returns what the controller needs to send back to frontend
    return {
        // clinetSecret is used by frontend to confirm payment + render payment form
        clientSecret: session.client_secret,
        session, // expose session to controller
    };
}

// AFTER CHECKOUT IS COMPLETE (PAYMENT IS ATTEMPTED) fetch session + payment status from stripe 
// GETS FROM STIRPE payment + session status + chekout session status
// My browser(fronend) needs to knwo if the donation succeeeded, right now only stripe knows
// BUT only server with the stripe secret key can securley call stripe for the real status
export async function getCheckoutSessionStatus(sessionId) {
    // getStripe() returns the stripe client configured with my secret key
    // strpe client talks to stripe servers
    const stripe = getStripe();

    // stripe.checkout.sessions.retrieve(...) server calls stripes API using secret key(already configured in stripe client) to fetch the checkout session object for that session id
    const session = await stripe.checkout.sessions.retrieve(
        sessionId, 
        // expand: ["payment_intent"] -> expands the payment_intent field to be the full payment intent object instead of just the payment_intent id string
        {expand: ["payment_intent"]},
    );

    return {
        status: session.status,  // open | complete
        payment_status: session.payment_status, // paid | unpaid
        payment_intent_id: session.payment_intent?.id,
        // STATUS OF THE PAYMENT INTETN
        payment_intent_status: session.payment_intent?.status, // succeeded | processing | failed
    };
}
