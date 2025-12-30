// == checkout.js
import { useState } from "react";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";

export default function StripePayment({ amount }) {
    // This hook works only because:
        // You wrapped this component in <CheckoutProvider>
        // That provider was given a valid clientSecret
    const checkoutState = useCheckout();
    
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (checkoutState.type === "loading") 
        return <p>Loading payment…</p>;
    if (checkoutState.type === "error") 
        return <p>{checkoutState.error.message}</p>;

    const { checkout } = checkoutState;

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const emailResult = await checkout.updateEmail(email);
        if (emailResult.type === "error") {
            setError(emailResult.error.message);
            setLoading(false);
            return;
        }

        const result = await checkout.confirm();

        if (result.type === "error") {
            setError(result.error.message);
            setLoading(false);
        }
    };

    return (
        // intercept submit -> calls checkout.confirm()
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {/* renders card input, validation, wallets */}
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
