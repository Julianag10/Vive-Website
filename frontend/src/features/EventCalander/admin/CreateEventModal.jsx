import EventService from "../EventService";
import EventForm, { createBlankEventForm } from "./EventForm";

const eventService = new EventService();

export default function CreateEventModal({ onClose, onCreate }) {
  async function handleSubmit(payload) {
    const createdEvent = await eventService.postCreatedEvent(payload);

    if (onCreate) {
      onCreate(createdEvent);
    }

    onClose();
  }

  return (
    <div className="modal-backdrop is-open" onClick={onClose}>
      <div className="modal admin-event-modal" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close create event modal"
        >
          ×
        </button>

        <h2>Create Event</h2>

        <EventForm
          initialForm={createBlankEventForm()}
          onSubmit={handleSubmit}
          actions={(
            <div className="modal-actions admin-event-modal-actions">
              <button type="submit">Save</button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
