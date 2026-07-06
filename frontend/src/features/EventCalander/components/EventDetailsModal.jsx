import { useEffect, useState } from "react";
import RegistrationPanel from "../../Registration/RegistrationPanel";
import RegistrationLookupPanel from "../../Registration/RegistrationLookup";
import useRegistrationStats from "../../Registration/useRegistrationStats";
// DISPLAYS selectedEvent
// close modal
// fill in just with “event details”


//INSIDE EVENT DETAIL MODAL 
// title
// description
// date/time
// location
// instructor
// register link
// program link (optional)

// DETIL MODAL FOR ADMIN:
// title field
// date picker
// description editor
// location editor
// instructor editor
// register link editor
// visibility toggle editor
// delete button
// save button
// cancel button
export default function EventDetailsModal({event, onClose}) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLookup, setShowLookup] = useState(false);
  const { stats, loading: loadingStats } = useRegistrationStats("event", event?.id);

  const [isClosing, setIsClosing] = useState(false);

  if (!event) return null;

  const isRegisterable = event.isRegisterable ?? false;

  function handleClose() {
    if (isClosing) return;

    setIsClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 180);
  }

  useEffect(() => {
    setIsClosing(false);
  }, [event]);


  return (
    <div
      className={`modal-overlay ${isClosing ? "is-closing" : "is-open"}`}
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
      onClick={handleClose}
    >
      <div
        className="modal event-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={handleClose} aria-label="Close event details">
          ×
        </button>

        <h2>{event.title}</h2>

        {event.description && <p>{event.description}</p>}

        <p>
          <strong>Starts:</strong> {event.startDate.toLocaleDateString()}
        </p>

        <p>
          <strong>Ends:</strong> {event.endDate.toLocaleDateString()}
        </p>

        {event.location && <p>{event.location}</p>}

        {stats && (
          <p>
            {stats.remaining === 0
              ? "This event is at capacity. Joining will place you on the waitlist and you will be emailed if a spot opens up."
              : `${stats.remaining} spots left`}
          </p>
        )}

        {event.isRegisterable ? (
          <>
              {!showRegistration && (
                <button
                  onClick={() => setShowRegistration(true)}
                >
                  {loadingStats
                    ? "Register"
                    : stats && stats.remaining === 0
                      ? "Join Waitlist"
                      : "Register"}
                </button>
              )}

              <button
                onClick={() => setShowLookup((current) => !current)}
              >
                  Already Registered?
              </button>

          </>
        ) : (
          <button disabled>
            Registration Closed
          </button>
        )}
        
        {showLookup && (
          <RegistrationLookupPanel
              type="event"
              item={event}
          />
        )}

        {showRegistration && (
          <RegistrationPanel
            type="event"
            item={event}
          />
        )}
        
        
      </div>
    </div>
  );
}
