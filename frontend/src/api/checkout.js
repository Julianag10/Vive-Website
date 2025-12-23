export async function createCheckoutSession(data) {
    const res = await fetch("http://localhost:3000/checkout/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(payload.error || "Failed to create checkout session");
    }

    return payload; // expected: { clientSecret: "..." }
}
