import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistrationService from "../../features/Registration/RegistrationService";
import EmailComposerModal from "../../features/Registration/admin/EmailComposerModal";
import RegistrationTable from "../../features/Registration/admin/RegistrationTable";
import { getPrograms } from "../../features/Programs/ProgramService";
import "../../styles/admin-program-registrations.css";

const registrationService = new RegistrationService();

export default function AdminRegistrationsPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailComposerTarget, setEmailComposerTarget] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState("");

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const data = await registrationService.getAdminRegistrations(type, id);
        setRegistrations(data);

        if (type === "program") {
          const programs = await getPrograms();
          setResource(programs.find((program) => program.id === id) || null);
        } else if (data[0]?.resourceTitle || data[0]?.capacity !== undefined) {
          setResource({
            title: data[0].resourceTitle,
            capacity: data[0].capacity,
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, [type, id]);

  const resourceLabel = type === "event" ? "Event" : "Program";
  const resourceTitle =
    resource?.title ||
    registrations.find((registration) => registration.resourceTitle)?.resourceTitle ||
    resourceLabel;
  const pageTitle = `${resourceTitle} Registrations`;
  const capacity =
    resource?.capacity ??
    registrations.find((registration) => registration.capacity !== undefined)?.capacity ??
    null;
  const registeredRecipients = Array.from(
    new Map(
      registrations
        .filter(
          (registration) =>
            registration.id &&
            registration.status === "registered" &&
            registration.email
        )
        .map((registration) => [
          registration.email.toLowerCase(),
          registration,
        ])
    ).values()
  );

  async function handleEmailRegistered(emailData) {
    const result = await registrationService.emailRegistered(
      type,
      id,
      emailComposerTarget?.kind === "event-day"
        ? {
            ...emailData,
            occurrenceId: emailComposerTarget.occurrenceId,
          }
        : emailData
    );
    setEmailSuccess(result.message);
    setEmailComposerTarget(null);
  }

  async function handleEmailRegistrationRecipient(emailData) {
    const result = await registrationService.emailRegistrationRecipient(
      type,
      id,
      emailComposerTarget.registration.id,
      emailData
    );
    setEmailSuccess(result.message);
    setEmailComposerTarget(null);
  }

  function handleSendEmail(emailData) {
    if (emailComposerTarget?.kind === "single") {
      return handleEmailRegistrationRecipient(emailData);
    }

    return handleEmailRegistered(emailData);
  }

  if (loading) {
    return (
      <div className="admin-program-registrations">
        <p>Loading registrations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-program-registrations">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-program-registrations">
      <div className="admin-registration-top-actions">
        <button
          className="admin-registration-back-button"
          onClick={() => navigate(`/admin/${type === "event" ? "events" : "programs"}`)}
          type="button"
        >
          ← Back to {resourceLabel}s
        </button>

        <button
          className="admin-registration-email-all-button"
          disabled={registeredRecipients.length === 0}
          onClick={() => {
            setEmailSuccess("");
            setEmailComposerTarget({ kind: "all" });
          }}
          type="button"
        >
          Email All Registered
        </button>
      </div>

      <div className="admin-registration-heading">
        <h1>{pageTitle}</h1>
      </div>

      {emailSuccess && (
        <p className="admin-registration-email-success">{emailSuccess}</p>
      )}

      <RegistrationTable
        capacity={capacity}
        onEmailRegistrant={(target) => {
          setEmailSuccess("");
          setEmailComposerTarget(target);
        }}
        registrations={registrations}
        type={type}
      />

      {emailComposerTarget && (
        <EmailComposerModal
          modalTitle={
            emailComposerTarget.kind === "single"
              ? "Email Participant"
              : emailComposerTarget.kind === "event-day"
                ? "Email Event Day"
              : "Email Registered Participants"
          }
          onClose={() => setEmailComposerTarget(null)}
          onSend={handleSendEmail}
          recipientCount={
            emailComposerTarget.kind === "single"
              ? 1
              : emailComposerTarget.kind === "event-day"
                ? emailComposerTarget.recipientCount
                : registeredRecipients.length
          }
          recipientDescription={
            emailComposerTarget.kind === "single"
              ? `Sending to ${emailComposerTarget.registration.name || "this participant"} at ${emailComposerTarget.registration.email}.`
              : emailComposerTarget.kind === "event-day"
                ? `Sending to ${emailComposerTarget.recipientCount} registered recipient${emailComposerTarget.recipientCount === 1 ? "" : "s"} for ${emailComposerTarget.title}.`
              : undefined
          }
          resourceTitle={resourceTitle}
        />
      )}
    </div>
  );
}
