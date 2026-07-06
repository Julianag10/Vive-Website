import { useState } from "react";
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

function createInitialForm() {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);

  return {
    title: "",
    description: "",
    location: "",
    capacity: "",
    start_date: formatDateTimeLocal(startDate),
    end_date: formatDateTimeLocal(endDate),
    is_active: true,
    isRegisterable: false,
  };
}

export default function CreateEventModal({onClose, onCreate}) {
  const [formData, setFormData] = useState(createInitialForm);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: 
        type === "checkbox" 
          ? checked 
          : value,
    }));
  }

  // dont need a use effect here because we only want to post to backend when user clicks save button -> so we can put the use effect in the parent component and pass down the callback to this component
  async function handleSubmitForm(event) {
    event.preventDefault();
    // post new event to backend -> get back created event with id
    const createdEvent = 
      await eventService.postCreatedEvent(formData);

    if (onCreate) {
      onCreate(createdEvent);
    }

    onClose();
  };


  return (
    <div className="modal-backdrop">
      <div className="modal admin-event-modal">
        <h2>Create Event</h2>

        <form onSubmit={handleSubmitForm}>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />

          <label>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <label>
            Location
          </label>
          <input 
            name="location" 
            placeholder="Location" 
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
            placeholder="Capacity"
          />
          
          <label> Start Date </label> 
          <input 
            type="datetime-local" 
            name="start_date" 
            value={formData.start_date} 
            onChange={handleChange} 
          /> 
        
          <label> End Date </label> 
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
          
          <button type="submit"> Save </button> 
          <button type="button" onClick={onClose} > Cancel </button>
        </form>
      </div>
    </div>
  );
}
