import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// returns a Stripe instance == loads STripe.js and publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutWrapper({ priceID, amountCents, onError }) {
  // onError is a variable, that holds a function passed from parent
  // calling onError() calls the parent function

  // Local error state ONLY for session creation
  const [sessionError, setSessionError] = useState(null);

  // creating a checkout session is a SIDE EFFECT:
  // - compnet is changing something other than the returned JSX
  // - it talks to backend
  // - creates a stripe checkocut session
  // - it links a paymenytIntent

  // react may re-run this compent many times due to:
  // - parent re-renders
  // - unrelted state updates
  // - reruns -> side effects can run mulitple times -> create mulitple checkoutsession per amount

  // BUT ONLY ONE checkout session per amount
  // MUST NOT create a new checkoutsesison on EVERY RE-RENDER:

  // want fetch to run only when inputs(session params, priceIS, amountCents) change
  // useCallback() ensures the function identity is stable unless depedencies change
  const fetchClientSecret = useCallback(async () => {
    try {
      // backend creates a stripe checkoutsession
      // stripe creats payment intent
      // backend retuns client secret
      const response = await fetch("/checkout/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // fetch only runs when these inputs (session params) change
        // IF inputs(session params)dont change
        // -> new clientSecret wont be fetched -> checkoutsession dosen't change
        body: JSON.stringify({ priceID, amountCents }),
      });

      // data is the actual JS object frmo BACKEND
      // inclueds error message if session creation failed
      // Backend has validation for !priceId, ect.
      // so errror mesage comes from backend
      const data = await response.json();

      // Handle backend / Stripe error
      // creates an error obejct and THROW it
      if (!response.ok || !data.clientSecret) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // client secret uniquly indentifies:
      // - ONE checkotu session
      // - ONE payment Intent
      // - ONE paymetn Attempt
      return data.clientSecret;
    } catch (err) {
      // catches errors from fetch(error message sent from backend) or from throw above

      // err is not gguaranteed to be an Error object:
      // throw new Error("Bad price");    // Error object
      // throw "Bad price";               // string
      // throw { code: 500 };             // plain object
      // throw null;
      const message =
        // Checks if err is an instance of Error (if err is an Error object)
        // IF yes -> safe to read and use err.message
        // IF no -> fallback to a SAFE message
        // guaruntees The UI always gets a string
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again.";

      // 1️⃣ Store locally so this component can render fallback UI
      setSessionError(message);

      // 2️⃣ Notify parent ( UI owner) so it can reset the flow n
      // If the parent gave a onError function, call it with message
      onError?.(message);

      // abrot stripe inti
      throw err;
    }
    // DEPENDENCY ARRAY
    // runs only when compnent mounts, ONLY IF user changes inputs and remounts
    // Only recompute the memoized value (priceID OR amountCents) IF values changed since last render
    // -> IF both priceID and amountCents are unchanged -> return the previous cached clnetSecret, dont run the useMemo function again
    // -> IF eihter changes run useMemo() again -> create a new checkout session
  }, [priceID, amountCents, onError]);

  // STRIPE CHECKOUT PROVIDER
  // <CheckoutProvider> is stripe secure container
  // MUST be mounted exactly once per clientSecret
  // MUST remain unmouted during user input -> lost input
  //
  // This component is SAFE bc:
  // 1. DonationForm controls WHEN it mounts
  // - normal rerenders DO NOT remount it
  // - only mounts if there is a change (but no change unless donation buton is clicked)
  //
  // 2. clientSecretPromise is stable
  // - useMemo() ensures checkoutsession is created once per (priceID, amountCents
  // - no duplicate stripe sessions are created on re render
  //
  // 3. <CheckoutProvider> stays mounted with the SAME clientSecret
  // - stripe initalizes its internal state once
  // - card input, vlaidation, and encryption stya alive
  //
  // 4. <StripePayment> can re-render freely inside
  // - bc rerenders != remounts
  // - children cannot recxrete or destory their parent -> stripe payment cant unmount checkoutWrapper
  return (
    // stripe ONLY breaks if:
    // ❌ Create NEW SECTRET while OLD ELEMENTS are MOUNTED
    // ❌ MOUNT <CHECKOUT PROVIDER> TWICE for SAME PAYMENT
    // ❌ Recreate checkout session on every render
    // ❌ Let user click “Pay” twice before lock

    // sends stripe client secret that matches checkoutsession
    // payment elemnt -> connected to the session
    // stripe session -> created once per intent
    // paymetn UI -> tied to the session
    // AS LONG AS CHECKUT PORVIDER STAYS MLUNTED -> client sectret DOSE NOT chANGE
    // <StripePayment> renders inside that provider -> provider instnace now exists in memory
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
