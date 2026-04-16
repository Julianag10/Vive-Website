import { useState, useEffect } from "react";
import EventService from "../../features/calander/EventService";

import Calander from "../../features/calander/admin/AdminCalander";
import EditEventModal from "../../features/calander/admin/EditEventModal";
import CreateEventModal from "../../features/calander/admin/CreateEventModal";

// ADMIN EVENTS PAGE
// view events
// click event → edit details
// create events
// delete events
// toggle visibility

// create ONE service instance (not every render)
const eventService = new EventService();

function nextMonth() {
  if (month === 12) {
    setMonth(1);
    setYear(year + 1);
  } else {
    setMonth(month + 1);
  }
}

function prevMonth() {
  if (month === 1) {
    setMonth(12);
    setYear(year - 1);
  } else {
    setMonth(month - 1);
  }
}

export default function AdminEventsPage() {
  
  // calendar navigation state
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // month is 0-indexed

  const [events, setEvents] = useState([]);

  // tracks which day is expanded
  const [selectedDay, setSelectedDay] = useState(null);   
  const [hoveredDay, setHoveredDay] = useState(null);    // tracks which day is hovered (for hover effects)

  // tracks which event is being edited
  const [selectedEvent, setSelectedEvent] = useState(null); 

  // tracks create modal visibility
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // fetch ALL events (including inactive) + store in state
  // runs whenever month/year state changes
  useEffect(() => {
    async function fetchEvents() {
      const events = await eventService.getAllEventsForMonth(year, month);
      setEvents(events);
    }

    fetchEvents();

  }, [year, month]); 

  // CALLBACK
  async function handleCreate(createdEvent) {
    // update state -> rerender -> display new program
    // creates a brand new array with all old items plus the new one at the end
    setEvents((prevArray) => [...prevArray, createdEvent]);

    // Create modal should close after save
    setIsCreating(false);
  }


  // CALLBACK
  function handleUpdate(editedEvent) {
    // update state -> render with edited events details
    // state are const -> so one pointer -> so new memory address 
    // create new pointer whole array so react can recognize the array changed
    setEvents((events) => 
      events.map((event) =>
        event.id == editedEvent.id ? editedEvent : event
    ));
  }


  // CALLBACK
  async function handleDelete(id) {
    await eventService.deleteEvent(id);

    setEvents(events => 
      events.filter(event => event.id !== id)
    );

    // closes confirm delete and  edit modal 
    setSelectedEvent(null);
  }

 


  // toggle visibility
  // NAVIGATE MONTHS 
  return (
    // wrap all elemetns 
    <>
      {/* ---- CREATE EVENT --------------------- */}
      <button onClick={() => setIsCreating(true)}> 
        Create Event
      </button>
    
      {/* ---- CREATE EVENT MODAL RENDERING ----- */}
      {/* close create modal if isCreateing is false */}
      {isCreating && (
        <CreateEventModal
          onCreate={handleCreate}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {/* ---- EDIT EVENT MODAL RENDERING -------- */}
      {/* if admin clicks evnet: instead of eventdetail modal, open event edit modal */}
      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onUpdate={handleUpdate}
          onCancel={() => setSelectedEvent(false)}
          // edit modal has delete button
          onDelete={handleDelete}
        />
      )}


      <Calander
        events={events}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onSelectEvent={setSelectedEvent}
        onHoverDay={setHoveredDay}

      />
    </>
  );
}