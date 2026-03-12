import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/program-register.css";

// TODO UNDERSTAND
// TODO CHANEG NAEM TO PAGE OR MAKE COMPONENT

export default function ProgramRegister() {
  const { id } = useParams(); // program ID from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/programs/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Registration failed");
      }

      // success → back to programs list
      navigate("/programs");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="program-register">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
