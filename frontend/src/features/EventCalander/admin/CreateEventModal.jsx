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
    <div className="modal-backdrop">
      <div className="modal admin-event-modal">
        <h2>Create Event</h2>

        <EventForm
          initialForm={createBlankEventForm()}
          onSubmit={handleSubmit}
          actions={(
            <>
              <button type="submit">Save</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </>
          )}
        />
      </div>
    </div>
  );
}
