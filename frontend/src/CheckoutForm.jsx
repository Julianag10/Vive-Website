import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { useState } from "react";

export default function CheckoutForm() {
  const checkoutState = useCheckout();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (checkoutState.type === "loading") return <p>Loading checkout…</p>;
  if (checkoutState.type === "error") return <p>{checkoutState.error.message}</p>;

  const { checkout } = checkoutState;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ✅ THIS IS THE MISSING PIECE
    const update = await checkout.updateEmail(email);
    if (update.type === "error") {
      setError(update.error.message);
      setLoading(false);
      return;
    }

    const result = await checkout.confirm();

    // Only reached on error
    if (result.type === "error") {
      setError(result.error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <PaymentElement />

      <button disabled={loading}>
        {loading ? "Processing…" : "Pay now"}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
}
