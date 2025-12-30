/*

== express route: creating session

stripes checkoutprovider API:
<CheckoutProvider
  stripe={stripePromise}
  options={{ clientSecret }}
>
Two critical things here:
clientSecret is required
clientSecret must exist BEFORE render
But:
clientSecret comes from your backend
which depends on donation tier
which depends on user action
which is async
So Stripe cannot be your wrapper — it’s missing logic.
----------------------------------------
Stripe Embedded Checkout is not static:
It is per-session
Per-payment
Per-donation
Per-user-action
--------------------------------
Old world (Express + Handlebars):
app.get("/donate", async (req, res) => {
  const session = await stripe.checkout.sessions.create(...)
  res.render("donate", { session })
})

Express:
created the session
injected it into the page
THEN rendered the template

New world (React + Stripe):
function CheckoutWrapper() {
  const clientSecret = fetchFromBackend()
  return (
    <CheckoutProvider options={{ clientSecret }}>
      <DonationForm />
    </CheckoutProvider>
  )
}
CheckoutWrapper = what Express used to do before rendering
*/

// create session
// provide Stripe context
// render StripePayment

import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import StripePayment from "./StripePayment";

// Promise cached
const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export default function CheckoutWrapper({ priceID, amountCents,  amount }) {
    // useMemo bc:
    // creating a checkout session is a side effect: thecompnet is changeing somthign other than the returned JSX
    // side effcect: fetch(), console.log(), local storage(), stripe
    // ONLY ONE checkout session per amount
    // react may re-run the component many times not just bc "user clicked" -> side effects can run mulitple times
    // if you do sideeffects during render -> create mulitple checkout sessions, or call your API mulitple times 
    // want fetch to run only when inputs(session params, priceIS, amountCents) change
    // useMemo ->Cache this computed value so React doesn’t redo it on every rerender
    const clientSecretPromise = useMemo(() => {
        // backend creates a stripe checkoutsession
        // stripe creats paymetn intent
        // retuns client secret
        return fetch("/checkout/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                priceID,
                amountCents,
            }),
        })  

            // fetch returns a promise -. "ill give you the reuslt later"
            // .then runs when promise finishes
            .then((res) => res.json())
            .then((data) => {
                if (!data.clientSecret) {
                    throw new Error(data.error || "No client secret returned");
                }
                return data.clientSecret;
            });
        // Only recompute the memoized value if priceID OR amountCents changed since last render.
        // compares current priceID & amountCents to previous priceID & amountCents
        // -> if both priceID and amountCents are the same, return the previous cached clnetSecret, dont run the useMemo function again
        // -> if they did change runt eh useEMO funtin again -> create a new checkout session
        // dependency array -> runs only when compnent mounts, if user changes amount and remounts
    }, [priceID, amountCents]);

    return (
        // initalizes stripes embeded checkout
        // stripe locks onto a checkoeut session, as long as client sectre dosent change, the component is not unmounted
        // because a remounting wuld cuase a new client secrete/ new cheout session (whcih isnt bad unless is more than one checkout session per client secrtr)
        // stripe breaks if:
        // ❌ Create a new clientSecret while old Elements are mounted
        // ❌ Mount CheckoutProvider twice for same payment
        // ❌ Recreate checkout session on every render
        // ❌ Let user click “Pay” twice before lock
        <CheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: clientSecretPromise }}
        >
            <StripePayment amount={amount} />
        </CheckoutProvider>
    );
}
