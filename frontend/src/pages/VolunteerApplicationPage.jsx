import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import VolunteerService from "../features/Volunteer/VolunteerService";
import {
  AVAILABILITY_OPTIONS,
  INITIAL_VOLUNTEER_FORM,
  ROLE_OPTIONS,
} from "../features/Volunteer/VolunteerForm";
import "../features/Volunteer/volunteer.css";

const volunteerService = new VolunteerService();

function RequiredMark() {
  return <span className="required-mark" aria-hidden="true">*</span>;
}

function CheckboxGroup({ legend, name, options, selectedValues, onChange, required = false, disabled = false }) {
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
              checked={selectedValues.includes(option)}
              disabled={disabled}
              name={name}
              onChange={() => handleChange(option)}
              type="checkbox"
              value={option}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function toFormData(application) {
  return {
    firstName: application.firstName || "",
    lastName: application.lastName || "",
    email: application.email || "",
    phone: application.phone || "",
    roles: application.roles || [],
    availability: application.availability || [],
    skills: application.skills || "",
    motivation: application.motivation || "",
  };
}

export default function VolunteerApplicationPage() {
  const { token } = useParams();
  const [formData, setFormData] = useState(INITIAL_VOLUNTEER_FORM);
  const [applicationStatus, setApplicationStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const isWithdrawn = applicationStatus === "withdrawn";

  useEffect(() => {
    async function loadApplication() {
      try {
        const application = await volunteerService.getApplication(token);
        setFormData(toFormData(application));
        setApplicationStatus(application.status || "active");
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [token]);

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

    setSaving(true);

    try {
      const application = await volunteerService.updateApplication(token, formData);
      setFormData(toFormData(application));
      setApplicationStatus(application.status || "active");
      setSuccessMessage("Your volunteer application was updated.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleWithdraw() {
    setError("");
    setWithdrawing(true);

    try {
      const application = await volunteerService.withdrawApplication(token);
      setApplicationStatus(application.status || "withdrawn");
      setShowWithdrawConfirm(false);
      setSuccessMessage("Your volunteer application was withdrawn.");
    } catch (withdrawError) {
      setError(withdrawError.message);
    } finally {
      setWithdrawing(false);
    }
  }

  if (loading) {
    return (
      <section className="volunteer-application-page">
        <div className="volunteer-form-panel volunteer-application-panel">
          <h1>Edit Volunteer Application</h1>
          <p>Loading your application...</p>
        </div>
      </section>
    );
  }

  if (error && !formData.email) {
    return (
      <section className="volunteer-application-page">
        <div className="volunteer-form-panel volunteer-application-panel">
          <h1>Edit Volunteer Application</h1>
          <p className="error">{error}</p>
          <Link className="volunteer-application-link" to="/volunteer">
            Submit a new volunteer application
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="volunteer-application-page">
      <div className="volunteer-form-panel volunteer-application-panel">
        <h1>Edit Volunteer Application</h1>
        <p>
          Use this private page to edit or withdraw your volunteer application.
        </p>

        {isWithdrawn && (
          <p className="volunteer-application-status">
            This volunteer application has been withdrawn.
          </p>
        )}

        {error && <p className="error">{error}</p>}

        <form className="volunteer-form" onSubmit={handleSubmit}>
          <label>
            <span className="volunteer-label-text">
              First name <RequiredMark />
            </span>
            <input
              disabled={isWithdrawn}
              name="firstName"
              onChange={handleInputChange}
              placeholder="First name"
              required
              type="text"
              value={formData.firstName}
            />
          </label>

          <label>
            <span className="volunteer-label-text">
              Last name <RequiredMark />
            </span>
            <input
              disabled={isWithdrawn}
              name="lastName"
              onChange={handleInputChange}
              placeholder="Last name"
              required
              type="text"
              value={formData.lastName}
            />
          </label>

          <label>
            <span className="volunteer-label-text">
              Email <RequiredMark />
            </span>
            <input
              disabled={isWithdrawn}
              name="email"
              onChange={handleInputChange}
              placeholder="name@example.com"
              required
              type="email"
              value={formData.email}
            />
          </label>

          <label>
            <span className="volunteer-label-text">
              Phone <RequiredMark />
            </span>
            <input
              disabled={isWithdrawn}
              name="phone"
              onChange={handleInputChange}
              placeholder="(720) 555-1234"
              required
              type="tel"
              value={formData.phone}
            />
          </label>

          <div className="volunteer-checkbox-columns">
            <CheckboxGroup
              disabled={isWithdrawn}
              legend="Volunteer roles"
              name="roles"
              onChange={updateField}
              options={ROLE_OPTIONS}
              required
              selectedValues={formData.roles}
            />

            <CheckboxGroup
              disabled={isWithdrawn}
              legend="Availability"
              name="availability"
              onChange={updateField}
              options={AVAILABILITY_OPTIONS}
              required
              selectedValues={formData.availability}
            />
          </div>

          <label className="volunteer-full-field">
            Skills
            <textarea
              disabled={isWithdrawn}
              name="skills"
              onChange={handleInputChange}
              placeholder="Separate skills with commas, periods, new lines, or dash marks"
              value={formData.skills}
            />
          </label>

          <label className="volunteer-full-field">
            Why would you like to volunteer with us?
            <textarea
              disabled={isWithdrawn}
              name="motivation"
              onChange={handleInputChange}
              placeholder="Tell us why you would like to volunteer with ViVe"
              value={formData.motivation}
            />
          </label>

          {!isWithdrawn && (
            <div className="volunteer-application-actions">
              <button disabled={saving} type="submit">
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                className="volunteer-withdraw-button"
                disabled={withdrawing}
                onClick={() => setShowWithdrawConfirm(true)}
                type="button"
              >
                Withdraw Application
              </button>
            </div>
          )}
        </form>
      </div>

      {successMessage && (
        <SuccessModal
          onClose={() => setSuccessMessage("")}
          title="Application updated"
        >
          <p>{successMessage}</p>
        </SuccessModal>
      )}

      {showWithdrawConfirm && (
        <SuccessModal
          actions={[
            {
              label: withdrawing ? "Withdrawing..." : "Yes, withdraw application",
              onClick: handleWithdraw,
              disabled: withdrawing,
              className: "volunteer-withdraw-confirm-button",
            },
            {
              label: "Keep application",
              onClick: () => setShowWithdrawConfirm(false),
              disabled: withdrawing,
            },
          ]}
          onClose={() => setShowWithdrawConfirm(false)}
          title="Withdraw application?"
        >
          <p>
            This will mark your volunteer application as withdrawn. You can submit
            a new application later if you want to volunteer again.
          </p>
        </SuccessModal>
      )}
    </section>
  );
}
