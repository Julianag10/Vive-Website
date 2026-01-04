import Stripe from "stripe";


// Defines the Stripe client
// Exports it for the rest of your backend to use:
// import { getStripe } from "../utils/stripe.js";
// const stripe = getStripe();

// STOP INITLIZING STRIPE AT IMPORT TIME:
let stripe;
export function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
  }

  return stripe;
}


