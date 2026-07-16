import { useState } from "react";

import RegistrationService from "./RegistrationService";

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

  async function handleConfirm() {
    setLoading(true);

    try{
      await registrationService.unregister(type, item.id, registration.email, {
        eventOccurrenceId: registrationData.eventOccurrenceId || registration.eventOccurrenceId,
        registrationId: registration.id,
      });
      setComplete(true);
    }
    finally{
      setLoading(false);
    }
  }

  return(
    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="modal"
        onClick={(e)=>e.stopPropagation()}
      >

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

            <button
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading
                ? "Removing..."
                : "Yes, Unregister"}
            </button>

            <button
              onClick={onClose}
            >
              Keep Registration
            </button>
          </>
        )}

        {complete && (
          <>
            <h2>
              Registration Removed
            </h2>

            <p>
              You have been successfully
              unregistered.
            </p>

            <button
              onClick={onClose}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
