import { useEffect, useState } from "react";
import EmailComposerModal from "../../features/Registration/admin/EmailComposerModal";
import "../../styles/admin-program-registrations.css";
import "../../styles/admin-contact.css";

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  return new Date(dateValue).toLocaleString();
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailTarget, setEmailTarget] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/admin/api/contact", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load contact messages.");
        }

        setMessages(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  async function handleSendContactEmail(emailData) {
    const res = await fetch(`/admin/api/contact/${emailTarget.id}/email`, {
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
      <div className="admin-contact">
        <p>Loading contact messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-contact">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-contact">
      <h1>Contact Us Responses</h1>

      {emailSuccess && (
        <p className="admin-contact-email-success">{emailSuccess}</p>
      )}

      {messages.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <div className="admin-contact-list">
          {messages.map((message) => {
            const contactName = [message.first_name, message.last_name]
              .filter(Boolean)
              .join(" ")
              .trim();

            return (
              <article className="admin-contact-card" key={message.id}>
                <div className="admin-contact-card-header">
                  <div>
                    <h2>{contactName}</h2>
                    <p>{formatDate(message.created_at)}</p>
                  </div>
                  <div className="admin-contact-card-actions">
                    {message.organization && (
                      <span>{message.organization}</span>
                    )}
                    <button
                      className="admin-contact-email-button"
                      disabled={!message.email}
                      onClick={() => {
                        setEmailSuccess("");
                        setEmailTarget({
                          ...message,
                          contactName,
                        });
                      }}
                      type="button"
                    >
                      Email back
                    </button>
                  </div>
                </div>

                <div className="admin-contact-meta">
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                  <a href={`tel:${message.phone}`}>{message.phone}</a>
                </div>

                <p className="admin-contact-message">{message.message}</p>
              </article>
            );
          })}
        </div>
      )}

      {emailTarget && (
        <EmailComposerModal
          modalTitle="Email Contact"
          onClose={() => setEmailTarget(null)}
          onSend={handleSendContactEmail}
          recipientCount={1}
          recipientDescription={`Sending to ${emailTarget.contactName || "this contact"} at ${emailTarget.email}.`}
          resourceTitle="Contact response"
        />
      )}
    </div>
  );
}
