import { useEffect, useMemo, useState } from "react";

import EventService from "../features/calander/EventService";
import Calander from "../features/EventCalander/components/Calander";
import EventDetailsModal from "../features/EventCalander/components/EventDetailsModal";
// Fetch data (via service)
// OWNS + Manages all state for public EVENT CALANDER
// controls modal display
// Pass data down


// EVENT SERVICE instead of fetch call directly 
const eventService = new EventService();

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // month is 0-indexed

  const [selectedEvent, setSelectedEvent] = useState(null); // tracks which event is selected (for details modal)
  const [expandedDay, setExpandedDay] = useState(null); // tracks which day is expanded (for day expansion)

  // fetch events + store in state (stores selected event.hovered event when dayCell is clicked )
  useEffect(() => {
    async function fetchActiveEvents() {
      try {
        setLoading(true);

        const events = await eventService.getActiveEventsForMonth(
          year,
          month
        );

        setEvents(events);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchActiveEvents();
    
  }, [year, month]); // loads new active events whenever month or year changes

  const monthLabel = useMemo(() => {
    return new Date(year, month - 1, 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [year, month]);

  function goToPreviousMonth() {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
      return;
    }
    setMonth((prev) => prev - 1);
  }

  function goToNextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
      return;
    }
    setMonth((prev) => prev + 1);
  }

  // render the selected/hovered event/day
  return (
    <section className="events-page">
      <h1>Community Events</h1>

      <div className="events-controls">
        <button type="button" onClick={goToPreviousMonth}>
          Previous
        </button>
        <strong>{monthLabel}</strong>
        <button type="button" onClick={goToNextMonth}>
          Next
        </button>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && events.length === 0 && (
        <p>No events available for this month.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description || "No description provided."}</p>
            </li>
          ))}
        </ul>
      )}

      <>
        <Calander
          events={events}
          year={year}
          month={month}
          expandedDay={expandedDay}
          setExpandedDay={setExpandedDay}
          onEventSelect={setSelectedEvent}
        />

        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </>
      

    </section>
  );
}