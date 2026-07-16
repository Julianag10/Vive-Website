import { useEffect, useState } from "react";
import RegistrationPanel from "../../Registration/RegistrationPanel";
import RegistrationLookup from "../../Registration/RegistrationLookup";
import useRegistrationStats from "../../Registration/useRegistrationStats";
import { 
  formatTimeRange,
} from "../dateUtils";
import { formatDisplayDate } from "../../../utils/dateFormat";
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
  const occurrence = event?.occurrence || null;
  const isRegisterable = event?.isRegisterable ?? false;
  const {
    stats,
    loading: loadingStats,
    error: statsError,
    refreshStats,
  } = useRegistrationStats("event", isRegisterable ? event?.id : null, {
    occurrenceId: occurrence?.id,
  });

  const [isClosing, setIsClosing] = useState(false);

  if (!event) return null;

  const occurrenceDate = occurrence?.occurrence_date
    ? new Date(`${occurrence.occurrence_date}T00:00:00`)
    : event.startDate;

  const occurrenceStart = occurrence?.start_time
    ? new Date(`1970-01-01T${occurrence.start_time}`)
    : event.startDate;

  const occurrenceEnd = occurrence?.end_time
    ? new Date(`1970-01-01T${occurrence.end_time}`)
    : event.endDate;

  const availableSpotsLabel = stats
    ? stats.remaining === null || stats.remaining === undefined
      ? "Not set"
      : stats.remaining === 1
      ? "1 spot"
      : `${stats.remaining} spots`
    : "";
  const waitlistLabel = stats
    ? stats.waitlisted === 1
      ? "1 person is currently on the waitlist."
      : `${stats.waitlisted} people are currently on the waitlist.`
    : "";

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

        {Array.isArray(event.notes) && event.notes.length > 0 && (
          <section className="event-details-notes">
            <h3>Notes</h3>
            <ul>
              {event.notes.map((note, index) => (
                <li key={`${note}-${index}`}>{note}</li>
              ))}
            </ul>
          </section>
        )}

        <p>
          <strong>Date:</strong> {formatDisplayDate(occurrenceDate)}
        </p>

        <p>
          <strong>Time:</strong> {formatTimeRange(occurrenceStart, occurrenceEnd)}
        </p>

        {event.location && 
          <p> <strong>Location:</strong> {event.location}</p>
        }

        {isRegisterable && stats && (
          <>
            <p className="event-capacity-summary">
              <strong>Capacity:</strong> {stats.capacity ?? "Not set"}
              {" · "}
              <strong>Available spots:</strong> {availableSpotsLabel}
            </p>

            {stats.remaining === 0 && (
              <p className="event-registration-message">
                This event is at capacity. Joining will place you on the
                waitlist and you will be emailed if a spot opens up. {waitlistLabel}
              </p>
            )}
          </>
        )}



        {isRegisterable && (
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

          </>
        )}

        {isRegisterable && (
          <RegistrationLookup
            type="event"
            item={event}
            registrationData={{ eventOccurrenceId: occurrence?.id }}
          />
        )}

        {isRegisterable && showRegistration && (
          <RegistrationPanel
            type="event"
            item={event}
            registrationData={{ eventOccurrenceId: occurrence?.id }}
            stats={stats}
            loading={loadingStats}
            error={statsError}
            onRegistrationChange={refreshStats}
          />
        )}
        
        
      </div>
    </div>
  );
}
