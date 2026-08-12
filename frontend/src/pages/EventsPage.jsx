import { useEffect, useMemo, useState } from "react";

import EventService from "../features/EventCalander/EventService";
import Calander from "../features/EventCalander/components/Calander";
import EventDetailsModal from "../features/EventCalander/components/EventDetailsModal";
import { getEventScheduleRows } from "../features/EventCalander/dateUtils";
import { formatMonthYear } from "../utils/dateFormat";
import SuccessModal from "../components/SuccessModal";
// Fetch data (via service)
// OWNS + Manages all state for public EVENT CALANDER
// controls modal display
// Pass data down


// EVENT SERVICE instead of fetch call directly 
const eventService = new EventService();

function hexToRgba(hex, alpha) {
  const value = String(hex || "").replace("#", "");

  if (value.length !== 6) return `rgba(240, 193, 93, ${alpha})`;

  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function eventColorStyle(event) {
  const color = event.color || "#f0c15d";

  return {
    backgroundColor: hexToRgba(color, 0.22),
    borderColor: hexToRgba(color, 0.55),
    boxShadow: `inset 4px 0 0 ${color}`,
  };
}

function waitlistText(count = 0) {
  return count === 1
    ? "1 person is currently on the waitlist."
    : `${count} people are currently on the waitlist.`;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // month is 0-indexed

  const [selectedEvent, setSelectedEvent] = useState(null); // tracks which event is selected (for details modal)
  const [expandedDay, setExpandedDay] = useState(null); // tracks which day is expanded (for day expansion)
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

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
    return formatMonthYear(year, month);
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

  function handleEventRegistrationSuccess(result) {
    setSelectedEvent(null);
    setRegistrationSuccess(result);
  }

  function reopenRegisteredEvent() {
    if (registrationSuccess?.item) {
      setSelectedEvent(registrationSuccess.item);
    }
    setRegistrationSuccess(null);
  }

  // render the selected/hovered event/day
  return (
    <section className="events-page">
      <h1 className="public-display-page-title">Community Events</h1>
      <p className="events-page-intro">
        Browse the month view, then click a day to expand it and inspect the events on that date.
      </p>

      <div className="events-controls">
        <button
          type="button"
          className="calendar-nav-button"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ←
        </button>
        <strong className="events-month-heading">{monthLabel}</strong>
        <button
          type="button"
          className="calendar-nav-button"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p>Error: {error}</p>}

      <div className="events-calendar-section">
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
            onRegistrationSuccess={handleEventRegistrationSuccess}
          />
        )}
      </div>

      {registrationSuccess?.status === "registered" && (
        <SuccessModal
          actions={[
            {
              label: registrationSuccess.stats?.remaining === 0
                ? "Join waitlist"
                : "Register someone else",
              onClick: reopenRegisteredEvent,
              className: "register-another-person-btn",
            },
          ]}
          onClose={() => setRegistrationSuccess(null)}
          title="Thank you!"
        >
          <p>You are registered.</p>
          <p>An email has been sent with confirmation details and further emails regarding your registration.</p>
          {registrationSuccess.stats?.remaining === 0 && (
            <p>
              This event is now at capacity. New submissions will join the
              waitlist.
            </p>
          )}
        </SuccessModal>
      )}

      {registrationSuccess?.status === "waitlisted" && (
        <SuccessModal
          actions={[
            {
              label: "Add someone else to waitlist",
              onClick: reopenRegisteredEvent,
              className: "register-another-person-btn",
            },
          ]}
          onClose={() => setRegistrationSuccess(null)}
          title="You are now on the waitlist"
        >
          <p>
            If a spot opens up you will be notified via email and automatically
            registered for the event.
          </p>
          {registrationSuccess.stats && (
            <p>{waitlistText(registrationSuccess.stats.waitlisted)}</p>
          )}
        </SuccessModal>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="events-empty-state">No events available for this month.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="events-agenda">
          <h2>This Month</h2>
          <ul className="events-list">
            {events.map((event) => (
              <li key={event.id} style={eventColorStyle(event)}>
                <h3>{event.title}</h3>
                <div className="events-list-schedule">
                  {getEventScheduleRows(event).map((row) => (
                    <p key={`${event.id}-${row.date}-${row.time}`}>
                      <strong>{row.date}</strong>
                      <span>{row.time}</span>
                    </p>
                  ))}
                </div>
                <button
                  className="events-list-details-button"
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                >
                  Event details
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      

    </section>
  );
}
