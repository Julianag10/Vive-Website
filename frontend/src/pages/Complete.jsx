// page
import { useEffect, useState } from "react";

export default function Complete() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const sessionId =
      new URLSearchParams(window.location.search)
        .get("session_id");

    fetch(`/checkout/session-status?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => setStatus(data.payment_status));
  }, []);

  if (status === "loading") return <p>Checking payment…</p>;
  if (status === "paid") return <h2>✅ Payment successful</h2>;

  return <h2>❌ Payment failed</h2>;
}
