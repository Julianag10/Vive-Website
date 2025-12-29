/*

==express eoute ccreating session

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

import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import StripePayment from "./StripePayment";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export default function CheckoutWrapper({ priceID }) {
    const clientSecretPromise = useMemo(() => {
        return fetch("/checkout/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priceID }),
        })
            .then(res => res.json())
            .then(data => {
                if (!data.clientSecret) {
                    throw new Error(data.error || "No client secret returned");
                }
                return data.clientSecret;
            });
    }, [priceID]);

    return (
        <CheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: clientSecretPromise }}
        >
            <StripePayment />
        </CheckoutProvider>
    );
}
