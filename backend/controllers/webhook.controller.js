import { stripe } from "../utils/stripe.js";
import {
    handleCheckoutCompleted,
    handlePaymentFailed,
    handleRefund,
    handleDispute,
    handleAbandonedCheckout,
} from "../services/webhook.service.js";

export async function handleStripeWebhook(req, res) {
    // in stripes req is header called "stripe-signature"
    const signature = req.headers["stripe-signature"];

    // Need signatre to verify the event was really signed by Stripe
    let event; // will hold the verified event

    // -------------- 1. VERIFY WEEBHOOK IS FROM STRIPE/ VERIFY WEBHOOK SIGNATRE -------
    try{
        // stripe's helper .constructEvent() checks if:
        // signature matches what stripe expects
        // thows an error if payload(req.body) was modified
        // throws an erro if signatire is missing/wrnog
        event = stripe.webhooks.constructEvent(
            // STRIPE GIVES MY SERVER A PAYLOAD AND A SIGNATIRE
            req.body, // RAW JSON OBJECT , CONTAINS EVNET.OBJECT
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // after TRY BLOCK, event is now a trusted, parsed Stripe event object.
    // STRIPE REQ.BODY:
    // "type": "checkout.session.completed",
    // "data": { "object": { ... checkout session ... } } 
    console.log("📩 Webhook Event Received:", event.type);

    // GET OBJECT FROM EVENT
    const dataObject = event.data.object;
    // event.data.object is the actual thing the event is about
    // for event.type == checkout.session.completed, the event is about Checkout Session object

    // -------------- 2. HANDELS EACH EVENT TYPE --------------

    try {
        switch (event.type) {
            case "checkout.session.completed":
                console.log("📩 Webhook event:", event.type);
                await handleCheckoutCompleted(dataObject);
                break;

            case "payment_intent.payment_failed":
                console.log("📩 Webhook event:", event.type);
                await handlePaymentFailed(dataObject);
                break;

            case "charge.refunded":
            case "charge.refund.updated":
                console.log("📩 Webhook event:", event.type);
                await handleRefund(dataObject);
                break;

            case "charge.dispute.created":
                console.log("📩 Webhook event:", event.type);
                await handleDispute(dataObject);
                break;

            case "checkout.session.expired":
                console.log("📩 Webhook event:", event.type);
                await handleAbandonedCheckout(dataObject);
                break;

            default:
                console.log("ℹ️ Unhandled event:", event.type);
        }

        // sends stipe a HTTPS 200 so stripe knows the weebhook was succesully porcessed
        // Stripe MUST receive 200
        res.status(200).send("Webhookrecived &  processed");
    } catch (err) {
        console.error("❌ Webhook handling error:", err);
        // Still 200 so Stripe doesn’t retry forever
        res.status(200).send("Webhook handler error");
    }
}

