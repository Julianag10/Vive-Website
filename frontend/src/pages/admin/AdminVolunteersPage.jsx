import { useEffect, useState } from "react";
import EmailComposerModal from "../../features/Registration/admin/EmailComposerModal";
import "../../styles/admin-program-registrations.css";
import "../../styles/admin-volunteers.css";

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(dateValue).toLocaleString();
}

function ChoiceList({ values }) {
  if (!Array.isArray(values) || values.length === 0) {
    return <span className="admin-volunteer-empty">None selected</span>;
  }

  return (
    <ul className="admin-volunteer-choice-list">
      {values.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </ul>
  );
}

function splitSkills(skills) {
  if (!skills) {
    return [];
  }

  return skills
    .split(/\r?\n|,\s*|\.\s+|\s+-\s+|^\s*-\s*/gm)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function SkillsList({ skills }) {
  const skillItems = splitSkills(skills);

  if (skillItems.length === 0) {
    return "—";
  }

  return <ChoiceList values={skillItems} />;
}

export default function AdminVolunteersPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailTarget, setEmailTarget] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/admin/api/volunteers", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load volunteer applications.");
        }

        setApplications(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  async function handleSendVolunteerEmail(emailData) {
    const res = await fetch(`/admin/api/volunteers/${emailTarget.id}/email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to send email.");
    }

    setEmailSuccess(data.message);
    setEmailTarget(null);
  }

  if (loading) {
    return (
      <div className="admin-volunteers">
        <p>Loading volunteer applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-volunteers">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-volunteers">
      <h1>Volunteers</h1>

      {emailSuccess && (
        <p className="admin-volunteer-email-success">{emailSuccess}</p>
      )}

      {applications.length === 0 ? (
        <p>No volunteer applications found.</p>
      ) : (
        <div className="admin-volunteers-table-wrap">
          <table className="admin-volunteers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Roles</th>
                <th>Availability</th>
                <th>Skills</th>
                <th>Why Volunteer</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => {
                const volunteerName = [application.first_name, application.last_name]
                  .filter(Boolean)
                  .join(" ")
                  .trim();

                return (
                  <tr key={application.id}>
                    <td>
                      <strong>{volunteerName}</strong>
                    </td>
                    <td>
                      <div className="admin-volunteer-contact">
                        <a href={`mailto:${application.email}`}>{application.email}</a>
                        <a href={`tel:${application.phone}`}>{application.phone}</a>
                      </div>
                    </td>
                    <td>
                      <ChoiceList values={application.roles} />
                    </td>
                    <td>
                      <ChoiceList values={application.availability} />
                    </td>
                    <td>
                      <SkillsList skills={application.skills} />
                    </td>
                    <td>{application.motivation || "—"}</td>
                    <td>{application.status === "withdrawn" ? "Withdrawn" : "Active"}</td>
                    <td>{formatDate(application.created_at)}</td>
                    <td>
                      <button
                        className="admin-volunteer-email-button"
                        disabled={!application.email}
                        onClick={() => {
                          setEmailSuccess("");
                          setEmailTarget({
                            ...application,
                            volunteerName,
                          });
                        }}
                        type="button"
                      >
                        Email
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {emailTarget && (
        <EmailComposerModal
          modalTitle="Email Volunteer"
          onClose={() => setEmailTarget(null)}
          onSend={handleSendVolunteerEmail}
          recipientCount={1}
          recipientDescription={`Sending to ${emailTarget.volunteerName || "this volunteer"} at ${emailTarget.email}.`}
          resourceTitle="Volunteer application"
        />
      )}
    </div>
  );
}
