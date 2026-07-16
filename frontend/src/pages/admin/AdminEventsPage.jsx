import { useState, useEffect, useMemo } from "react";
import EventService from "../../features/EventCalander/EventService";

import Calander from "../../features/EventCalander/components/Calander";
import EditEventModal from "../../features/EventCalander/admin/EditEventModal";
import CreateEventModal from "../../features/EventCalander/admin/CreateEventModal";
import DeleteConfirmModal from "../../features/EventCalander/admin/DeleteConfirmModal";
import { formatMonthYear } from "../../utils/dateFormat";

// ADMIN EVENTS PAGE
// view events
// click event → edit details
// create events
// delete events
// toggle visibility

// OWNS STATE -> contols edit/delete/create modals/ events
// - selectedEvent
// - creatingEvent
// - events

// create ONE service instance (not every render)
const eventService = new EventService();

export default function AdminEventsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // month is 0-indexed

  const [events, setEvents] = useState([]);

  const [expandedDay, setExpandedDay] = useState(null);   
  const [editingEvent, setEditingEvent] = useState(null);   

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventPendingDelete, setEventPendingDelete] = useState(null);

  const monthLabel = useMemo(() => {
    return formatMonthYear(year, month);
  }, [year, month]);

  // fetch ALL events (including inactive) + store in state
  // runs whenever month/year state changes
  useEffect(() => {
    async function fetchEvents() {
      const events = await eventService.getAllEventsForMonth(month, year);
      setEvents(events);
    }

    fetchEvents();
  }, [year, month]); 


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

  // CALLBACK
  async function handleCreate(createdEvent) {
    // update state -> rerender -> display new program
    // creates a brand new array with all old items plus the new one at the end
    setEvents((prevArray) => [...prevArray, createdEvent]);

    // Create modal should close after save
    setShowCreateModal(false);
  }


  // CALLBACK
  function handleSave(editedEvent) {
    // update state -> render with edited events details
    // state are const -> so one pointer -> so new memory address 
    // create new pointer whole array so react can recognize the array changed
    setEvents((events) => 
      events.map((event) =>
        event.id == editedEvent.id ? editedEvent : event
    ));
  }


  // CALLBACK: changes event state to removed event from events list
  async function handleDelete(id) {
    await eventService.deleteEvent(id);

    setEvents(events => 
      events.filter(event => event.id !== id)
    );

    // closes confirm delete and  edit modal 
    setEditingEvent(null);
    setEventPendingDelete(null);
  }

  // toggle visibility
  // NAVIGATE MONTHS 
  return (
    <section className="admin-events-page">
      <div className="admin-events-header">
        <h1>Events</h1>
      </div>

      <div className="events-controls">
        <button
          type="button"
          className="calendar-nav-button"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          ←
        </button>
        <strong>{monthLabel}</strong>
        <button
          type="button"
          className="calendar-nav-button"
          onClick={nextMonth}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="admin-events-actions">
        <button
          className="admin-create-event-button"
          onClick={() => setShowCreateModal(true)}
        >
          Create Event
        </button>
      </div>
    
      <Calander
        events={events}
        year={year}
        month={month}
        expandedDay={expandedDay}
        setExpandedDay={setExpandedDay}
        onEventSelect={setEditingEvent}
      />

      {/* ---- EDIT EVENT MODAL RENDERING -------- */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onSave={handleSave}
          onClose={() => setEditingEvent(null)}
          onDelete={() => setEventPendingDelete(editingEvent)}
        />
      )}

      {eventPendingDelete && (
        <DeleteConfirmModal
          event={eventPendingDelete}
          onConfirm={() => handleDelete(eventPendingDelete.id)}
          onClose={() => setEventPendingDelete(null)}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </section>
  );
}
