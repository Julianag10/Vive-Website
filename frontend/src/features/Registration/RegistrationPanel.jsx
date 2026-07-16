import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import RegistrationService from "./RegistrationService";
import useRegistrationStats from "./useRegistrationStats";

const registrationService = new RegistrationService();

function waitlistText(count = 0) {
  return count === 1
    ? "1 person is currently on the waitlist."
    : `${count} people are currently on the waitlist.`;
}

export default function RegistrationPanel({
  type,
  item,
  registrationData = {},
  stats: providedStats = null,
  loading: providedLoading = false,
  error: providedError = null,
  onRegistrationChange,
}) {
  const [status, setStatus] = useState(null);
  const [submittedStats, setSubmittedStats] = useState(null);
  const registrationStatsOptions = registrationData.eventOccurrenceId
    ? { occurrenceId: registrationData.eventOccurrenceId }
    : {};
  const {
    stats: localStats,
    loading: localLoading,
    error: localError,
    refreshStats,
  } = useRegistrationStats(
    type,
    item.id,
    registrationStatsOptions
  );
  const stats = submittedStats || providedStats || localStats;
  const loading = providedStats ? providedLoading : localLoading;
  const error = providedStats ? providedError : localError;
  const resourceLabel = type === "event" ? "event" : "program";

  async function handleRegister(formData) {
    const name = [formData.firstName, formData.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const result = await registrationService.register(type, item.id, {
      ...formData,
      ...registrationData,
      name,
    });

    if (onRegistrationChange) {
      const refreshedStats = await onRegistrationChange();
      setSubmittedStats(refreshedStats);
    } else {
      const refreshedStats = await refreshStats();
      setSubmittedStats(refreshedStats);
    }

    setStatus(result.status);
  }

  if (status === "registered") {
    return (
      <section className="registration-panel registration-panel-success" id="registration">
        <h3>Thank you!</h3>
        <p>You are registered.</p>
        <p>An email has been sent with confirmation details and further emails regarding your registration.</p>
        {stats && stats.remaining === 0 ? (
          <>
            <p>
              This {resourceLabel} is now at capacity. New submissions will join
              the waitlist.
            </p>
            <button
              className="register-another-person-btn"
              type="button"
              onClick={() => setStatus(null)}
            >
              Join waitlist
            </button>
          </>
        ) : (
          <button
            className="register-another-person-btn"
            type="button"
            onClick={() => setStatus(null)}
          >
            Register someone else
          </button>
        )}
      </section>
    );
  }

  if (status === "waitlisted") {
    return (
      <section className="registration-panel" id="registration">
        <h3>You are now on the waitlist</h3>
        <p>
          If a spot opens up you will be notified via email and automatically
          registered for the {resourceLabel}.
        </p>
        {stats && (
          <p>{waitlistText(stats.waitlisted)}</p>
        )}
        <button
          className="register-another-person-btn"
          type="button"
          onClick={() => setStatus(null)}
        >
          Add someone else to waitlist
        </button>
      </section>
    );
  }

  return (
    <section className="registration-panel" id="registration">
      <h2>
        {stats && stats.remaining === 0
          ? `Join the waitlist for ${item.title}`
          : `Register for ${item.title}`}
      </h2>

      {loading && <p>Loading registration details…</p>}

      {error && <p className="error">{error}</p>}

      {stats && stats.remaining === 0 && (
        <>
          <p>
            This {resourceLabel} is at capacity. If you submit this form, you will be
            automatically added to the waitlist and emailed if a spot opens up.
          </p>
          <p>{waitlistText(stats.waitlisted)}</p>
        </>
      )}

      {stats && stats.capacity === null && (
        <p>
          {stats.registered} registered. No capacity limit.
        </p>
      )}

      {stats && stats.capacity !== null && stats.remaining >= 0 && (
        <p>
          {stats.registered} of {stats.capacity} spots filled.
        </p>
      )}

    

      <RegistrationForm
        onSubmit={handleRegister}
        submitLabel={stats && stats.remaining === 0 ? "Join Waitlist" : "Register"}
      />
    </section>
  );
}
