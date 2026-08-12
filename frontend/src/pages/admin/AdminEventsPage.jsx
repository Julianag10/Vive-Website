import { useState, useEffect, useMemo } from "react";
import EventService from "../../features/EventCalander/EventService";

import Calander from "../../features/EventCalander/components/Calander";
import EditEventModal from "../../features/EventCalander/admin/EditEventModal";
import CreateEventModal from "../../features/EventCalander/admin/CreateEventModal";
import DeleteConfirmModal from "../../features/EventCalander/admin/DeleteConfirmModal";
import {
  formatDisplayDate,
  formatDisplayTime,
  formatMonthYear,
} from "../../utils/dateFormat";

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

function formatEventSchedule(event) {
  if (event.occurrences?.length) {
    const firstOccurrence = event.occurrences[0];
    const date = formatDisplayDate(firstOccurrence.occurrence_date, "");
    const start = formatDisplayTime(firstOccurrence.start_time, "");
    const end = formatDisplayTime(firstOccurrence.end_time, "");
    const time = [start, end].filter(Boolean).join(" - ");
    const extraDays = event.occurrences.length > 1
      ? ` + ${event.occurrences.length - 1} more day${event.occurrences.length === 2 ? "" : "s"}`
      : "";

    return [date, time].filter(Boolean).join(" · ") + extraDays;
  }

  const startDate = formatDisplayDate(event.startDate, "");
  const startTime = formatDisplayTime(event.startDate, "");
  const endTime = formatDisplayTime(event.endDate, "");
  const time = [startTime, endTime].filter(Boolean).join(" - ");

  return [startDate, time].filter(Boolean).join(" · ");
}

export default function AdminEventsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // month is 0-indexed

  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

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

  useEffect(() => {
    async function fetchAllEvents() {
      const events = await eventService.getAllAdminEvents();
      setAllEvents(events);
    }

    fetchAllEvents();
  }, []);


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
    setAllEvents((prevArray) => [createdEvent, ...prevArray]);

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
    setAllEvents((events) =>
      events.map((event) =>
        event.id == editedEvent.id ? editedEvent : event
      )
    );
  }


  // CALLBACK: changes event state to removed event from events list
  async function handleDelete(id) {
    await eventService.deleteEvent(id);

    setEvents(events => 
      events.filter(event => event.id !== id)
    );
    setAllEvents(events =>
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

      <section className="admin-events-quick-view">
        <div className="admin-events-quick-view-heading">
          <h2>All Events</h2>
          <p>
            {allEvents.length === 1
              ? "1 event has been created."
              : `${allEvents.length} events have been created.`}
          </p>
        </div>

        {allEvents.length === 0 ? (
          <p className="admin-events-empty">No events have been created yet.</p>
        ) : (
          <div className="admin-events-quick-list">
            {allEvents.map((event) => (
              <div
                className="admin-events-quick-item"
                key={event.id}
                role="button"
                tabIndex={0}
                onClick={() => setEditingEvent(event)}
                onKeyDown={(eventKey) => {
                  if (eventKey.key === "Enter" || eventKey.key === " ") {
                    eventKey.preventDefault();
                    setEditingEvent(event);
                  }
                }}
              >
                <span
                  className="admin-events-quick-color"
                  style={{ backgroundColor: event.color }}
                  aria-hidden="true"
                />
                <span className="admin-events-quick-copy">
                  <strong>{event.title}</strong>
                  <span>{formatEventSchedule(event) || "No date saved"}</span>
                </span>
                <span className="admin-events-quick-statuses">
                  <span className={`admin-program-status ${event.isActive ? "is-active" : "is-inactive"}`}>
                    {event.isActive ? "Active" : "Inactive"}
                  </span>
                  {event.isRegisterable && (
                    <span className="admin-program-status is-registerable">
                      Registerable
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

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
