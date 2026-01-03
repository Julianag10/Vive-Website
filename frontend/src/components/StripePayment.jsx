// == checkout.js
import { useState } from "react";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";

export default function StripePayment({ amount }) {
    // useCheckout() works only because:
    // - <CheckoutProvider> wraps this compnonet
    // - That provider was intialized with a client sectret

    // useCheckout() gives access(via controller object) to the CURRENT STRIPE CHECKOUT SESSION
    // returns a controllerobject:
    // {
    //      type : "ready" || "erroor" || "loading"
    //      error ?: { messge: "..."}
    //      checkout?: { updateEmail(), confirm(), ... }
    // }


    // if <StripePayment> is remounted inside <CheckoutProvider> useCheckout() reconnects it to the same session
    // useCHEKOUT ALWAYS REFERES TO THE SAME SESSION (as long as checkoutProvider stays mounted)
    // useCheckout() DOSENT IMMEDITALY GIVE YOU A USABLE CHECKOUT CONTROLLER 
    const checkoutState = useCheckout();
    
    // states reset if StripePayment() UNMOUNTS (new paymetn attempt)
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);

    
    function onEmailChange(e) {
        setEmail(e.target.value);
        setEmailError(null); // clear as they type (your old input listener)
    }

    // Validate email with Stripe when input loses focus (old blur logic)
    async function onEmailBlur() {
        if (!email) return; // if the new email feild is empty do nothng

        const res = await checkout.updateEmail(email);
        if (res.type === "error") {
            setEmailError(res.error.message);
        }
    }

    // BRANCH ON checkouState.type REQUIRED
    // prevents:
    // - referencing / using checkout beofore it exists  
    // - calling checkout.confirm() before stripe is ready
    // - rendering PAymentELemnt before striep is ready

    // returns -> component renders a different JSX sub tree
    // .type is part of the checkout session controller object  
    if (checkoutState.type === "loading") 
        return <p>Loading payment…</p>;
    if (checkoutState.type === "error") 
        return <p>{checkoutState.error.message}</p>;

    // subtrees from brancing on checoutState.type unmounted from JSX when component re-renders
    // when a rerender finally hapens where the if statements are passed:
    // - know that stripe is ready -> get checkout objects from stripe (email validation card inputs) to use
    const { checkout } = checkoutState;

    // <StripePayment> can rerender saftly bc:
    // - rerenders do not unmount components 
    // - the <PaymentELment> iFrane stays mounted as long as <CheckoutProvider> remiand mounted w/ the smae client secrt
    // rerenders never call this, only triggered byt user sction
    // submitting form is just an EVENT -> donse not chngae the react tree
    async function handleSubmit(e) {
        // keeps react state + tree alive
        // keeps streip iframe alive -> keep ssession intact
        e.preventDefault(); 
        
        setLoading(true);

        // atach email to checkout session
        // stripe validates email server side
        const emailResult = await checkout.updateEmail(email);
        if (emailResult.type === "error") {
            // message is the error.message from updateEmail(email)
            setError(emailResult.error.message);
            setLoading(false);
            return;
        }

        // AT THIS POITN NO PAYMETN ATTEMP HAPPENED

        // stripe checks card complete, email set
        // stripe creats/updates payment intent
        // stripe ATTEMPTS to charge the payment method
        const result = await checkout.confirm();

        // only catches IMMEDIATE ERRORS (invlaid card, ..)
        if (result.type === "error") {
            setError(result.error.message);
            setLoading(false);
        }
    };

    return (
        // intercept submit (NO RELOAD)
        // HTML <form> browser default:
        // - send HTTP reuest
        // - navigate / RELOAD page
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
                required
                type="email"
                value={email}
                // onChange={(e) => setEmail(e.target.value)}
                onChange={ onEmailChange}
                onBlur={onEmailBlur}
                className={emailError ? "error" : ""}
            />

            {emailError && <p style={{ color: "red" }}>{emailError}</p>}


            {/* 
            STRIPE INJECTS iframe + SECURE FIELDS
            live outside JS: renders card input, validation, wallets 
            */}
            <PaymentElement />

            <button disabled={loading}>
                {loading 
                    ? "Processing…"
                    : `Donate $${amount}`}
            </button>

            {error && <p>{error}</p>}
        </form>
    );
}
