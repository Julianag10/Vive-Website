import { useState } from "react";

import RegistrationService from "./RegistrationService";
import SuccessModal from "../../components/SuccessModal";

const registrationService = new RegistrationService();

export default function UnregisterModal({
  registration,
  type,
  item,
  registrationData = {},
  onClose,
}) {

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setLoading(true);
    setError("");

    try{
      await registrationService.unregister(type, item.id, registration.email, {
        eventOccurrenceId: registrationData.eventOccurrenceId || registration.eventOccurrenceId,
        registrationId: registration.id,
      });
      setComplete(true);
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
  }

  if (complete) {
    return (
      <SuccessModal
        onClose={onClose}
        title="Registration Removed"
      >
        <p>You have been successfully unregistered.</p>
      </SuccessModal>
    );
  }

  return(
    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="modal unregister-modal"
        onClick={(e)=>e.stopPropagation()}
      >
        <button
          aria-label="Close cancel registration modal"
          className="unregister-modal-close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        {!complete && (
          <>
            <h2>
              Cancel Registration?
            </h2>

            <p>
              This cannot be undone.
            </p>

            <p>
              {registration.name || `${registration.firstName || ""} ${registration.lastName || ""}`.trim()}
            </p>

            {error && <p className="error">{error}</p>}

            <div className="unregister-modal-actions">
              <button
                className="unregister-confirm-button"
                onClick={handleConfirm}
                disabled={loading}
                type="button"
              >
                {loading
                  ? "Removing..."
                  : "Yes, Unregister"}
              </button>

              <button
                className="unregister-keep-button"
                onClick={onClose}
                type="button"
              >
                Keep Registration
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
