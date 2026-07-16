// SHARED PUBLIC + ADMIN COMPONENT
// FIRES CALL BACKS
// DISPLAYS THE EVENT IN A CALANDER CELL 

// PublicEventsPage -> EventDetailsModal
// AdminEventsPage	-> EditEventModal

// HANDLES
// display event title
// opening event modals


// event item click -> set selectedEvent -> edit event form recives event 
import { formatDisplayTime } from "../../../utils/dateFormat";

function hexToRgba(hex, alpha) {
  const value = String(hex || "").replace("#", "");

  if (value.length !== 6) return `rgba(240, 193, 93, ${alpha})`;

  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function EventItem({event, onClick, onMouseEnter}) {
  const startTime = event.occurrence?.start_time
    ? formatDisplayTime(event.occurrence.start_time)
    : formatDisplayTime(event.startDate);

  return (
    // each event item is a div -> when Event div is clicked/hovered
    
    // only show event.title bc monthly calendars show compressed preview
    // EventItem = event preview
    // Modal = event details
    <div
      className="event-item"
      onMouseEnter={onMouseEnter}
      onPointerEnter={onMouseEnter}
      onFocus={onMouseEnter}
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{
        backgroundColor: hexToRgba(event.color, 0.22),
        borderColor: hexToRgba(event.color, 0.55),
        boxShadow: `inset 4px 0 0 ${event.color || "#f0c15d"}`,
      }}
    >
      <span className="event-item-time">{startTime}</span>
      <span>{event.title}</span>
    </div>
  );
}
