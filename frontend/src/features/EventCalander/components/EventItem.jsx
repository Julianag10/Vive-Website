// SHARED PUBLIC + ADMIN COMPONENT
// FIRES CALL BACKS
// DISPLAYS THE EVENT IN A CALANDER CELL 

// PublicEventsPage -> EventDetailsModal
// AdminEventsPage	-> EditEventModal

// HANDLES
// display event title
// opening event modals


// event item click -> set selectedEvent -> edit event form recives event 
export default function EventItem({event, onClick, onMouseEnter}) {

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
    >
      {event.title}
    </div>
  );
}
