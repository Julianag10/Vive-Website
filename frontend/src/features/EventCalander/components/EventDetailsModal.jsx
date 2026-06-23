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
  if (!event) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <button onClick={onClose}>
          <X>X</X>
        </button>

        <h2>{event.title}</h2>

        <p>{event.description}</p>

        <p>{event.location}</p>

        <p>{event.date}</p>

      </div>
    </div>
  );
}
