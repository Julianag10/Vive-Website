import { useState } from "react";
import { createCheckoutSession } from "../api/checkout";

function Donate() {
    const [amount, setAmount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setResult(null);

        const amountCents = Math.round(Number(amount) * 100);

        if (!Number.isFinite(amountCents) || amountCents < 50) {
            setError("Enter a valid amount (minimum $0.50).");
            return;
        }

        try {
            setLoading(true);
            const data = await createCheckoutSession({ amountCents });
            setResult(data);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: "2rem", maxWidth: 520 }}>
            <h1>Donate</h1>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                <label>
                    Amount (USD)
                    <input
                        type="number"
                        step="0.01"
                        min="0.50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating session..." : "Continue to payment"}
                </button>
            </form>

            {error ? (
                <p style={{ marginTop: "1rem" }}>{error}</p>
            ) : null}

            {result ? (
                <div style={{ marginTop: "1rem" }}>
                    <h3>Backend response</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            ) : null}
        </div>
    );
}

export default Donate;
