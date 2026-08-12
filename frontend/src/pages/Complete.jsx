import { useEffect, useState } from "react";
import SuccessModal from "../components/SuccessModal";

export default function Complete() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const sessionId = new URLSearchParams(window.location.search).get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/checkout/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("SESSION STATUS RESPONSE:", data);
        setStatus(data.payment_status);
      })
      .catch(() => setError("Failed to verify payment"));
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="complete-page">
        <h2>Missing session ID</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complete-page">
        <h2>❌ {error}</h2>
      </div>
    );
  }
  if (status === "loading") {
    return (
      <div className="complete-page">
        <p>Checking payment…</p>
      </div>
    );
  }
  if (status === "paid") {
    return (
      <div className="complete-page">
        <h2>Payment successful</h2>
        <SuccessModal
          onClose={() => setStatus("paid-dismissed")}
          title="Thank you for your donation!"
        >
          <p>Your payment was successful.</p>
          <p>Your support helps ViVe Wellness continue serving our community.</p>
          <p>You will be emailed with your receipt.</p>
        </SuccessModal>
      </div>
    );
  }

  if (status === "paid-dismissed") {
    return (
      <div className="complete-page">
        <h2>Thank you for your donation!</h2>
      </div>
    );
  }

  return (
    <div className="complete-page">
      <h2>❌ Payment failed</h2>
    </div>
  );
}
