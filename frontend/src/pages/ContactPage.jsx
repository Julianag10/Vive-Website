import { useState } from "react";
import SuccessModal from "../components/SuccessModal";
import { ContactInfoList, SocialLinks } from "../components/PublicContactSections";
import "../styles/contact.css";

function RequiredMark() {
  return <span className="required-mark" aria-hidden="true">*</span>;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          organization: formData.get("organization"),
          message: formData.get("message"),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Unable to submit contact message.");
      }

      form.reset();
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-page">
      <h1 className="contact-page-title">Contact Us</h1>

      <section className="contact-copy">
        <div className="contact-copy-text">
          <p>
            Please contact us for more information about our programs, to inquire
            about partnerships, to offer ViVe programs to people in your
            community, school or organization, or if you have a grievance you'd
            like to report.
          </p>
        </div>

        <ContactInfoList showLabels />
        <SocialLinks />
      </section>

      <section className="contact-form-panel">
        <h2>Send Us a Message</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span className="contact-label-text">
              First Name <RequiredMark />
            </span>
            <input name="firstName" type="text" required />
          </label>

          <label>
            <span className="contact-label-text">
              Last Name <RequiredMark />
            </span>
            <input name="lastName" type="text" required />
          </label>

          <label>
            <span className="contact-label-text">
              Email <RequiredMark />
            </span>
            <input name="email" type="email" required />
          </label>

          <label>
            <span className="contact-label-text">
              Phone <RequiredMark />
            </span>
            <input name="phone" type="tel" required />
          </label>

          <label className="contact-form-full">
            Organization (if applicable)
            <input name="organization" type="text" />
          </label>

          <label className="contact-form-full">
            <span className="contact-label-text">
              How can we help you? Are there any issues you want to share with us? <RequiredMark />
            </span>
            <textarea name="message" rows="6" required />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>

      {submitted && (
        <SuccessModal
          onClose={() => setSubmitted(false)}
          title="Thank you for contacting us!"
        >
          <p>Your message has been submitted.</p>
          <p>We will review your message and follow up when needed.</p>
        </SuccessModal>
      )}
    </div>
  );
}
