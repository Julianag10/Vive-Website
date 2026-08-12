import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import RegistrationService from "./RegistrationService";
import useRegistrationStats from "./useRegistrationStats";
import SuccessModal from "../../components/SuccessModal";

const registrationService = new RegistrationService();

function waitlistText(count = 0, capacity = null) {
  const waitlistCountText = count === 1
    ? "1 person is currently on the waitlist"
    : `${count} people are currently on the waitlist`;
  const capacityText = capacity === null || capacity === undefined
    ? ""
    : ` for this capacity of ${capacity}`;

  return `${waitlistCountText}${capacityText}.`;
}

export default function RegistrationPanel({
  type,
  item,
  registrationData = {},
  stats: providedStats = null,
  loading: providedLoading = false,
  error: providedError = null,
  onRegistrationChange,
  onRegistrationSuccess,
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

    let refreshedStats;

    if (onRegistrationChange) {
      refreshedStats = await onRegistrationChange();
      setSubmittedStats(refreshedStats);
    } else {
      refreshedStats = await refreshStats();
      setSubmittedStats(refreshedStats);
    }

    if (onRegistrationSuccess) {
      onRegistrationSuccess({
        item,
        resourceLabel,
        stats: refreshedStats,
        status: result.status,
        type,
      });
      return;
    }

    setStatus(result.status);
  }

  if (status === "registered") {
    return (
      <SuccessModal
        actions={[
          {
            label: stats && stats.remaining === 0 ? "Join waitlist" : "Register someone else",
            onClick: () => setStatus(null),
            className: "register-another-person-btn",
          },
        ]}
        onClose={() => setStatus(null)}
        title="Thank you!"
      >
        <p>You are registered.</p>
        <p>An email has been sent with confirmation details and further emails regarding your registration.</p>
        {stats && stats.remaining === 0 && (
            <p>
              This {resourceLabel} is now at capacity. New submissions will join
              the waitlist.
            </p>
        )}
      </SuccessModal>
    );
  }

  if (status === "waitlisted") {
    return (
      <SuccessModal
        actions={[
          {
            label: "Add someone else to waitlist",
            onClick: () => setStatus(null),
            className: "register-another-person-btn",
          },
        ]}
        onClose={() => setStatus(null)}
        title="You are now on the waitlist"
      >
        <p>
          If a spot opens up you will be notified via email and automatically
          registered for the {resourceLabel}.
        </p>
        {stats && (
          <p>{waitlistText(stats.waitlisted, stats.capacity)}</p>
        )}
      </SuccessModal>
    );
  }

  return (
    <section className="registration-panel" id="registration">
      <h2 className="registration-panel-title">
        <span>
          {stats && stats.remaining === 0
            ? "Join the waitlist for"
            : "Register for"}
        </span>
        <span>{item.title}</span>
      </h2>

      {loading && <p>Loading registration details…</p>}

      {error && <p className="error">{error}</p>}

      {stats && stats.remaining === 0 && (
        <>
          <p className="registration-panel-message registration-panel-message-bold">
            This {resourceLabel} is at capacity. If you submit this form, you will be
            automatically added to the waitlist and emailed if a spot opens up.
          </p>
          <p className="registration-panel-message">{waitlistText(stats.waitlisted, stats.capacity)}</p>
        </>
      )}

      {stats && stats.capacity === null && (
        <p className="registration-panel-message">
          {stats.registered} registered. No capacity limit.
        </p>
      )}

      {stats && stats.capacity !== null && stats.remaining > 0 && (
        <p className="registration-panel-message">
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
