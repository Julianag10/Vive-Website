import { useState } from "react";

export default function EmailComposerModal({
  modalTitle = "Email Participants",
  resourceTitle,
  recipientCount,
  recipientDescription,
  onClose,
  onSend,
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!subject.trim() || !message.trim()) {
      setError("Subject and message are required.");
      return;
    }

    setSending(true);
    setError("");

    try {
      await onSend({
        subject: subject.trim(),
        message: message.trim(),
      });
    } catch (err) {
      setError(err.message || "Failed to send email.");
      setSending(false);
    }
  }

  return (
    <div className="modal-overlay is-open" onClick={onClose}>
      <section
        aria-modal="true"
        className="modal admin-email-composer-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Close email composer"
          className="modal-close admin-email-composer-close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <h2>{modalTitle}</h2>
        <p>
          {recipientDescription ||
            `Sending to ${recipientCount} registered recipient${
              recipientCount === 1 ? "" : "s"
            } for ${resourceTitle}.`}
        </p>

        <form className="admin-email-composer-form" onSubmit={handleSubmit}>
          <label>
            Subject
            <input
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Email subject"
              required
              type="text"
              value={subject}
            />
          </label>

          <label>
            Message
            <textarea
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type the email message..."
              required
              rows={8}
              value={message}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <div className="modal-actions admin-email-composer-actions">
            <button disabled={sending || recipientCount === 0} type="submit">
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
