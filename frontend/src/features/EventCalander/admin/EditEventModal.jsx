import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventService from "../EventService";
import EventForm, {
  formatDateInput,
  occurrenceFormValue,
} from "./EventForm";

const eventService = new EventService();

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function eventToForm(event) {
  return {
    title: event.title || "",
    description: event.description || "",
    location: event.location || "",
    color: event.color || "#f0c15d",
    notes_text: Array.isArray(event.notes) ? event.notes.join("\n") : "",
    capacity: event.capacity ?? "",
    start_date: event.startDate ? formatDateTimeLocal(event.startDate) : "",
    end_date: event.endDate ? formatDateTimeLocal(event.endDate) : "",
    is_active: event.isActive,
    isRegisterable: event.isRegisterable ?? false,
    occurrences: event.occurrences?.length
      ? event.occurrences.map(occurrenceFormValue)
      : [{
          date: formatDateInput(event.startDate || new Date()),
          start_time: event.startDate ? event.startDate.toTimeString().slice(0, 5) : "09:00",
          end_time: event.endDate ? event.endDate.toTimeString().slice(0, 5) : "10:00",
        }],
  };
}

export default function EditEventModal({ event, onSave, onClose, onDelete }) {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsClosing(false);
  }, [event]);

  async function handleSubmit(payload) {
    const updatedEvent = await eventService.putUpdatedEvent(event.id, payload);

    onSave(updatedEvent);
    handleClose();
  }

  function handleClose() {
    if (isClosing) return;

    setIsClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 180);
  }

  return (
    <div
      className={`modal-backdrop ${isClosing ? "is-closing" : "is-open"}`}
      onClick={handleClose}
    >
      <div className="modal admin-edit-modal admin-event-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={handleClose}
          aria-label="Close edit event modal"
        >
          ×
        </button>

        <h2>Edit Event</h2>

        <EventForm
          initialForm={eventToForm(event)}
          onSubmit={handleSubmit}
          actions={(
            <div className="modal-actions">
              <button type="submit">
                Save
              </button>

              <button
                type="button"
                onClick={() => navigate(`/admin/registrations/event/${event.id}`)}
              >
                View Registrations
              </button>

              <button
                type="button"
                onClick={onDelete}
              >
                Delete
              </button>

              <button
                type="button"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
