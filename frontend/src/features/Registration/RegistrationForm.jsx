// registrationService.register(
//   "program",
//   12,
//   formData
// )

// registrationService.register(
//   "event",
//   7,
//   formData
// )

// OWNS
// form state
// validation
// submit
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

    setSubmitting(true);

    setError("");

    try {
      await onSubmit(form);
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setSubmitting(false);
    }
  }

  return (

    <form onSubmit={handleSubmit}>

      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        required
      />

      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        name="emergencyContact"
        placeholder="Emergency Contact"
        value={form.emergencyContact}
        onChange={handleChange}
      />

      <input
        name="emergencyPhone"
        placeholder="Emergency Contact Phone"
        value={form.emergencyPhone}
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Anything you'd like us to know?"
        rows={4}
        value={form.notes}
        onChange={handleChange}
      />

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <button
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