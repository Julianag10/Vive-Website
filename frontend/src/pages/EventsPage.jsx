import { useState } from "react";
import Calander from "../features/calander/components/Calander";
import EventDetailsModal from "../features/calander/components/EventDetailsModal";
import EventService from "../features/calander/EventService";

// Fetch data (via service)
// Manage state (month, selected day)
// Pass data down

// click day → expand day
// click event → open modal

export default function EventPage() {

  const eventService = new EventService();
  const [events, setEvents] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // month is 0-indexed
  const [selectedDay, setSelectedDay] = useState(null); // track modal state
  const [selectedEvent, setSelectedEvent] = useState(null); // track modal state

  // fetch events + store in state
  useEffect(() => {
    eventService.getActiveEventsForMonth(year, month).then(setEvents);
  }, [year, month]);


  // handle select day + event

  return (
    // ----- EVENT DETAILS MODAL RENDERING --------
    // if event is selected -> render show event modal
    {selectedEvent && (
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    )}


    <Calander
      events={events}
      onSelectDay={setSelectedDay}
      onSelectEvent={setSelectedEvent}
    />
  );
}
