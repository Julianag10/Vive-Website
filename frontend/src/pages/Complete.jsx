import { useEffect, useState } from "react";

export default function Complete() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (!sessionId) {
      setError("Missing session ID");
      return;
    }

    fetch(`/checkout/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("SESSION STATUS RESPONSE:", data);
        setStatus(data.payment_status);
      })
      .catch(() => setError("Failed to verify payment"));
  }, []);

  if (error) return <h2>❌ {error}</h2>;
  if (status === "loading") return <p>Checking payment…</p>;
  if (status === "paid") return <h2>✅ Payment successful</h2>;

  return <h2>❌ Payment failed</h2>;
}
