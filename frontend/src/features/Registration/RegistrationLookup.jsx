import { useState } from "react";

import RegistrationService from "./RegistrationService";
import UnregisterModal from "./UnregisterModal";

const registrationService = new RegistrationService();

export default function RegistrationLookupPanel({ type, item }) {

  const [email, setEmail] = useState("");
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUnregister, setShowUnregister] = useState(false);

  async function handleLookup(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result =
        await registrationService.lookupRegistration(
          type,
          item.id,
          email
        );

      if (!result) {
        setError("No registration found.");
        return;
      }
      setRegistration(result);
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <section className="registration-lookup-panel">
      <h2>Find Your Registration</h2>

      {!registration && (
        <form onSubmit={handleLookup}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Searching..."
              : "Find Registration"}
          </button>
        </form>
      )}

      {registration && (
        <>
          <h3>
            Registration Found
          </h3>

          <p>
              {registration.name || `${registration.firstName || ""} ${registration.lastName || ""}`.trim()}
          </p>

          <p>
            {registration.email}
          </p>

          <button
            onClick={() =>
              setShowUnregister(true)
            }
          >
            Unregister
          </button>
        </>
      )}

      {showUnregister && (
        <UnregisterModal
          registration={registration}
          type={type}
          item={item}
          onClose={() =>
            setShowUnregister(false)
          }
        />
      )}
    </section>
  );
}