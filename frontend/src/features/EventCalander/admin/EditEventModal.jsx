import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import EventService from "../EventService";

const eventService = new EventService();

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// HAS DELET EVENT MODAL 
// edit title
// edit date
// edit time
// edit description
// toggle active
export default function EditEventModal({ event, onSave, onClose, onDelete}) {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: event.title || "",
    description: event.description || "",
    location: event.location || "",
    capacity: event.capacity ?? "",
    start_date: event.startDate
    ? formatDateTimeLocal(event.startDate)
    : "",
    end_date: event.endDate
    ? formatDateTimeLocal(event.endDate)
    : "",
    is_active: event.isActive,
    isRegisterable: event.isRegisterable ?? false,
    });

  useEffect(() => {
    setIsClosing(false);
  }, [event]);

  // DELETE CONFIRMATION MODAL STATE 
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // how dose handleChange save the isREgisterable value to the formData state?
  // how dose setFormData work with the handleChange function to update the formData state when the user interacts with the form inputs?
  // how dose updating state cause the information to save in the backend and database
  // updating the state 
  function handleChange(event) {
    const { name, value, type, checked } =
    event.target;
    
    setFormData(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
    
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // update backend with updated event
    const updatedEvent =
      await eventService.putUpdatedEvent(
        event.id,
        formData
      );
    
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
    
        <form onSubmit={handleSubmit}>
          <label>
            Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>
            Location
          </label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <label>
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            min="0"
            value={formData.capacity}
            onChange={handleChange}
          />
    
          <label>
            Start Date
          </label>
    
          <input
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
      
          <label>
            End Date
          </label>
    
          <input
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
      
          <label>
            Active
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
          </label>

          <label>
            Registerable
            <input
              type="checkbox"
              name="isRegisterable"
              checked={Boolean(formData.isRegisterable)}
              onChange={handleChange}
            />
          </label>
      
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
              onClick={onClose}
            >
              Cancel
            </button>
    
          </div>
        </form>
      </div>
    </div>
     
  );
}

