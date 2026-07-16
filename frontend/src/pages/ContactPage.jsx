import { useState } from "react";
import {
  ContactInfoList,
  SocialLinks,
} from "../components/PublicContactSections";
import "../styles/contact.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="contact-page">
      <section className="contact-copy">
        <div className="contact-copy-text">
          <h1>Contact Us</h1>
          <p>
            Please contact us for more information about our programs, to inquire
            about partnerships, to offer ViVe programs to people in your
            community, school or organization, or if you have a grievance you'd
            like to report.
          </p>
        </div>

        <ContactInfoList />
        <SocialLinks />
      </section>

      <section className="contact-form-panel">
        <h2>Send Us a Message</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span className="contact-label-text">
              First Name <span aria-hidden="true">*</span>
            </span>
            <input name="firstName" type="text" required />
          </label>

          <label>
            <span className="contact-label-text">
              Last Name <span aria-hidden="true">*</span>
            </span>
            <input name="lastName" type="text" required />
          </label>

          <label>
            <span className="contact-label-text">
              Email <span aria-hidden="true">*</span>
            </span>
            <input name="email" type="email" required />
          </label>

          <label>
            <span className="contact-label-text">
              Phone <span aria-hidden="true">*</span>
            </span>
            <input name="phone" type="tel" required />
          </label>

          <label className="contact-form-full">
            Organization (if applicable)
            <input name="organization" type="text" />
          </label>

          <label className="contact-form-full">
            <span className="contact-label-text">
              How can we help you? Are there any issues you want to share with us? <span aria-hidden="true">*</span>
            </span>
            <textarea name="message" rows="6" required />
          </label>

          {submitted && (
            <p className="contact-form-success" role="status">
              Thank you. Your message has been prepared.
            </p>
          )}

          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}
