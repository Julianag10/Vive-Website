import { useState } from "react";
import SuccessModal from "../../components/SuccessModal";
import VolunteerService from "./VolunteerService";
import "./volunteer.css";

const volunteerService = new VolunteerService();

export const ROLE_OPTIONS = [
  "Data input",
  "Swim instructor (experienced)",
  "Exercise instructor",
  "Kids play & exercise instructor",
  "Social media volunteer",
  "General/admin assistance",
];

export const AVAILABILITY_OPTIONS = [
  "Summer camp",
  "Weekend workshop (4 hour shift)",
  "Weekend workshop (8 hour shift)",
  "Weekday workshop",
  "Ongoing weekday commitment",
];

export const INITIAL_VOLUNTEER_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  roles: [],
  availability: [],
  skills: "",
  motivation: "",
};

function RequiredMark() {
  return <span className="required-mark" aria-hidden="true">*</span>;
}

function CheckboxGroup({ legend, name, options, selectedValues, onChange, required = false }) {
  function handleChange(value) {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];

    onChange(name, nextValues);
  }

  return (
    <fieldset className="volunteer-fieldset">
      <legend>
        {legend} {required && <RequiredMark />}
      </legend>
      <div className="volunteer-checkbox-grid">
        {options.map((option) => (
          <label className="volunteer-checkbox-label" key={option}>
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={selectedValues.includes(option)}
              onChange={() => handleChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function VolunteerForm({ title = "Volunteer With Us" }) {
  const [formData, setFormData] = useState(INITIAL_VOLUNTEER_FORM);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(name, value) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleInputChange(event) {
    updateField(event.target.name, event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (formData.roles.length === 0) {
      setError("Please select at least one volunteer role.");
      return;
    }

    if (formData.availability.length === 0) {
      setError("Please select at least one availability option.");
      return;
    }

    setSubmitting(true);

    try {
      await volunteerService.submitApplication(formData);
      setFormData(INITIAL_VOLUNTEER_FORM);
      setShowSuccessModal(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="volunteer-form-panel">
      <h2>{title}</h2>
      {error && <p className="error">{error}</p>}
      <form className="volunteer-form" onSubmit={handleSubmit}>
        <label>
          <span className="volunteer-label-text">
            First name <RequiredMark />
          </span>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            required
          />
        </label>

        <label>
          <span className="volunteer-label-text">
            Last name <RequiredMark />
          </span>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last name"
            required
          />
        </label>

        <label>
          <span className="volunteer-label-text">
            Email <RequiredMark />
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="name@example.com"
            required
          />
        </label>

        <label>
          <span className="volunteer-label-text">
            Phone <RequiredMark />
          </span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(720) 555-1234"
            required
          />
        </label>

        <div className="volunteer-checkbox-columns">
          <CheckboxGroup
            legend="Volunteer roles"
            name="roles"
            options={ROLE_OPTIONS}
            selectedValues={formData.roles}
            onChange={updateField}
            required
          />

          <CheckboxGroup
            legend="Availability"
            name="availability"
            options={AVAILABILITY_OPTIONS}
            selectedValues={formData.availability}
            onChange={updateField}
            required
          />
        </div>

        <label className="volunteer-full-field">
          Skills
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="Separate skills with commas, periods, new lines, or dash marks"
          />
        </label>

        <label className="volunteer-full-field">
          Why would you like to volunteer with us?
          <textarea
            name="motivation"
            value={formData.motivation}
            onChange={handleInputChange}
            placeholder="Tell us why you would like to volunteer with ViVe"
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {showSuccessModal && (
        <SuccessModal
          className="volunteer-success-modal"
          onClose={() => setShowSuccessModal(false)}
          title="Thank You for Volunteering!"
        >
          <p>Your volunteer application was submitted.</p>
          <p>
            <strong>If we are able to move forward with your volunteer application, we will follow up by email.</strong>
          </p>
        </SuccessModal>
      )}
    </div>
  );
}
