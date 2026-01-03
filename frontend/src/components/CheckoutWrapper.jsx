import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import StripePayment from "./StripePayment";

// returns a Stripe instance == loads STripe.js and publishable key 
const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export default function CheckoutWrapper({ priceID, amountCents,  amount, onError }) {
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
    // useMemo() -> Cache a computed value so React doesn’t redo it on every rerender
    // useMemo() -> reruns fetch (creates a checkout session) only when dependecies change
    // useMemo() -> DOSENT prevent RE-RENDERING
    // useMemo() -> prevents RE-MOUNTING bc react only remounts if the JSX changes (if client secrte changes)
    // useMemo() -> wont run on normal rerenders 
    const clientSecretPromise = useMemo(() => {
        // backend creates a stripe checkoutsession 
        // stripe creats payment intent
        // backend retuns client secret
        return fetch("/checkout/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // fetch only runs when these inputs (session params) change
            // IF inputs dont change -> client secret wont change -> checkoutsession dosen't change
            body: JSON.stringify({ 
                priceID,
                amountCents,
            }),
        })  
            // fetch() returns a promise(client sectert) -> "ill give you the reuslt later"
            // .then runs when promise finishes(after the HTTP request completes)
            .then((res) => res.json())
            .then((data) => {
                // data is the actual JS object frmo BACKEND
                // Backend has validation for !priceId, ect.
                // so errror mesage comes from backend 
                if (!data.clientSecret) {
                    // creates an error obejct and THROW it
                    throw new Error(data.error || "No client secret returned, failed to create checoutsessoin");
                }
                // client secret uniquly indentifies:
                // - ONE checkotu session
                // - ONE payment Intent
                // - ONE paymetn Attempt
                return data.clientSecret;
            })
            .catch((err) => {
                // err is error object from THROW OR a NETWROK error from fetch()
                // so render the error UI and never mount stripe -> triggers a re-render

                // calling the fucntion passed from parent 
                onError?.(err.message); // PARETN ERROR 

                // return so that clientSecrtePromise resolves to null
                return null;
            });
        // DEPENDENCY ARRAY
        // runs only when compnent mounts, ONLY IF user changes inputs and remounts
        // Only recompute the memoized value (priceID OR amountCents) IF values changed since last render
        // -> IF both priceID and amountCents are unchanged -> return the previous cached clnetSecret, dont run the useMemo function again
        // -> IF eihter changes run useMemo() again -> create a new checkout session
    }, [priceID, amountCents, onError]);

    if (!clientSecretPromise) return null;


    // STRIPE CHECKOUT PROVIDER 
    // <CheckoutProvider> is stripes secure container
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
        <CheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: clientSecretPromise }}
        >
            <StripePayment amount={amount} />
        </CheckoutProvider>
    );
}

/*

dom 
|
CheckoutProvider(stripePromise, options)
|


*/
