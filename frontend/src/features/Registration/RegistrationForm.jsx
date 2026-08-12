import { useState } from "react";

export default function RegistrationForm({
  onSubmit,
  submitLabel = "Register",
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("Participant first name, participant last name, and email are required.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      });
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setSubmitting(false);
    }
  }

  return (

    <form className="registration-form form-grid" onSubmit={handleSubmit}>

      <label className="field">
        <span className="registration-label-text">
          Participant First Name <span className="required-mark" aria-hidden="true">*</span>
        </span>
        <input
          name="firstName"
          placeholder="e.g. Maria"
          value={form.firstName}
          onChange={handleChange}
          required
        />
      </label>

      <label className="field">
        <span className="registration-label-text">
          Participant Last Name <span className="required-mark" aria-hidden="true">*</span>
        </span>
        <input
          name="lastName"
          placeholder="e.g. Garcia"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </label>

      <label className="field">
        <span className="registration-label-text">
          Email <span className="required-mark" aria-hidden="true">*</span>
        </span>
        <input
          name="email"
          type="email"
          placeholder="name@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>

      <label className="field">
        <span className="registration-label-text">Phone Number</span>
        <input
          name="phone"
          placeholder="Optional"
          value={form.phone}
          onChange={handleChange}
        />
      </label>

      <label className="field">
        <span className="registration-label-text">Emergency Contact</span>
        <input
          name="emergencyContact"
          placeholder="Optional"
          value={form.emergencyContact}
          onChange={handleChange}
        />
      </label>

      <label className="field">
        <span className="registration-label-text">Emergency Contact Phone</span>
        <input
          name="emergencyPhone"
          placeholder="Optional"
          value={form.emergencyPhone}
          onChange={handleChange}
        />
      </label>

      <label className="registration-notes-field field field-full">
        <span className="registration-label-text">Notes</span>
        <textarea
          name="notes"
          placeholder="Anything you'd like us to know?"
          rows={4}
          value={form.notes}
          onChange={handleChange}
        />
      </label>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        disabled={submitting}
      >
        {submitting
          ? submitLabel === "Join Waitlist"
            ? "Joining Waitlist..."
            : "Registering..."
          : submitLabel}
      </button>
    </form>
  );
}
