import { useState } from "react";
import { Link } from "react-router-dom";

import RegistrationService from "./RegistrationService";
import UnregisterModal from "./UnregisterModal";
import {
  formatDisplayDate,
  formatDisplayTimeRange,
} from "../../utils/dateFormat";

const registrationService = new RegistrationService();

function registrationTitle(registration) {
  return registration.resourceTitle || registration.name || "Registration";
}

function participantName(registration) {
  return registration.name || [registration.firstName, registration.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function detailsLink(registration) {
  if (registration.type === "event") {
    return {
      label: "View event details",
      to: "/events",
    };
  }

  return {
    label: "View program details",
    to: `/programs/${registration.resourceId}`,
  };
}

function RegistrationLookupResult({ registration, onUnregister }) {
  const details = detailsLink(registration);

  return (
    <div className="registration-lookup-result">
      <h4>{registrationTitle(registration)}</h4>
      {participantName(registration) && (
        <p className="registration-lookup-participant">
          <strong>Participant:</strong> {participantName(registration)}
        </p>
      )}
      {registration.occurrenceDate && (
        <p>
          {formatDisplayDate(registration.occurrenceDate, "")}
          {registration.startTime && registration.endTime
            ? `, ${formatDisplayTimeRange(registration.startTime, registration.endTime, "")}`
            : ""}
        </p>
      )}
      <p><strong>Status:</strong> {registration.status}</p>

      {registration.status === "waitlisted" && (
        <>
          <p>You are #{registration.waitlistPosition} on the waitlist.</p>
          <p>Capacity: {registration.capacity ?? "Not set"}</p>
        </>
      )}

      <button type="button" onClick={() => onUnregister(registration)}>
        Unregister
      </button>
      <Link className="registration-lookup-details-link" to={details.to}>
        {details.label}
      </Link>
    </div>
  );
}

export default function RegistrationLookup({ type, item, registrationData = {} }) {
  const [showLookup, setShowLookup] = useState(false);
  const [email, setEmail] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUnregisterRegistration, setSelectedUnregisterRegistration] = useState(null);
  const hasRegistrations = registrations.length > 0;

  async function handleLookup(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setRegistrations([]);

    try {
      const result =
        await registrationService.lookupRegistrationsByEmail(email);

      if (result.length === 0) {
        setError("No registration found.");
        return;
      }
      setRegistrations(result);
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
  }

  function resetLookup() {
    setEmail("");
    setRegistrations([]);
    setError("");
    setSelectedUnregisterRegistration(null);
  }

  return (
    <section className="registration-lookup-section">
      {!hasRegistrations && (
        <div className="registration-lookup-card">
          <h2>Look Up Registration</h2>
          <p>
            Confirm your registration, waitlist status, or current waitlist spot.
          </p>

          {showLookup ? (
            <form onSubmit={handleLookup}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />

              {error && (
                <p className="error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Searching..."
                  : "Find Registration"}
              </button>
            </form>
          ) : (
            <button
              className="already-registered-btn"
              type="button"
              onClick={() => setShowLookup(true)}
            >
              Confirm registration or waitlist spot
            </button>
          )}
        </div>
      )}

      {hasRegistrations && (
        <div className="registration-lookup-panel">
              <h3>Registrations Found</h3>
              <p>{email}</p>
              {registrations.map((registration) => (
                <RegistrationLookupResult
                  key={registration.id}
                  registration={registration}
                  onUnregister={setSelectedUnregisterRegistration}
                />
              ))}
              <button
                type="button"
                onClick={resetLookup}
              >
                Find another registration
              </button>
        </div>
      )}

      {selectedUnregisterRegistration && (
        <UnregisterModal
          registration={selectedUnregisterRegistration}
          type={selectedUnregisterRegistration.type || type}
          item={{
            id: selectedUnregisterRegistration.resourceId || item.id,
            title: selectedUnregisterRegistration.resourceTitle || item.title,
          }}
          registrationData={{
            eventOccurrenceId: selectedUnregisterRegistration.eventOccurrenceId || registrationData.eventOccurrenceId,
          }}
          onClose={() =>
            setSelectedUnregisterRegistration(null)
          }
        />
      )}
    </section>
  );
}
