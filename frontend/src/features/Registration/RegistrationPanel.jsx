import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import RegistrationService from "./RegistrationService";
import useRegistrationStats from "./useRegistrationStats";

const registrationService = new RegistrationService();

export default function RegistrationPanel({ type, item }) {
  const [status, setStatus] = useState(null);
  const { stats, loading, error } = useRegistrationStats(type, item.id);

  async function handleRegister(formData) {
    const name = [formData.firstName, formData.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const result = await registrationService.register(type, item.id, {
      ...formData,
      name,
    });
    setStatus(result.status);
  }

  if (status === "registered") {
    return (
      <section className="registration-panel" id="registration">
        <h3>Thank you!</h3>
        <p>You are registered.</p>
      </section>
    );
  }

  if (status === "waitlisted") {
    return (
      <section className="registration-panel" id="registration">
        <h3>You are on the waitlist</h3>
        <p>A spot will open if capacity becomes available.</p>
      </section>
    );
  }

  return (
    <section className="registration-panel" id="registration">
      <h2>Register for {item.title}</h2>

      {loading && <p>Loading registration details…</p>}

      {error && <p className="error">{error}</p>}

      {stats && stats.remaining === 0 && (
        <p>
          This {type} is at capacity. If you submit this form, you will be
          automatically added to the waitlist and emailed if a spot opens up.
        </p>
      )}

      {stats && stats.remaining > 0 && (
        <p>
          {stats.registered} of {stats.capacity} spots filled.
        </p>
      )}

      {stats && stats.remaining === 0 && (
        <p>
          Join the waitlist below. If a spot opens up, you will be emailed automatically.
        </p>
      )}

      <RegistrationForm
        onSubmit={handleRegister}
        submitLabel={stats && stats.remaining === 0 ? "Join Waitlist" : "Register"}
      />
    </section>
  );
}