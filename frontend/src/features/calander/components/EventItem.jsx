// SHARED PUBLIC + ADMIN COMPONENT

// PublicEventsPage -> EventDetailsModal
// AdminEventsPage	-> EditEventModal

// event item click -> set selectedEvent -> edit event form recives event 
export default function EventItem({event, isAdmin, onSelectEvent}) {
  // click event → call back -> updates selected event state -> open modal
  function handleClick(e) {
    // Stops click from reaching DayCell, or else clic will go to all prarent divs
    // wihtout stopPropigation: click event CAUSES:
    // → event click fires
    // → day click fires
    // → expand day instead of modal
    e.stopPropagation(); 
    onSelectEvent(event);
  } 

  return (
    // each event item is a div -> when Event div is clicked
    
    // only show event.title bc monthly calendars show compressed preview
    // EventItem = preview
    // Modal = details
    <div 
      onClick={handleClick}

      style={{
        marginTop: "4px",
        padding: "4px 6px",
        borderRadius: "4px",
        background: isAdmin
          ? (event.isActive ? "#dbeafe" : "#fee2e2")
          : "#e5e7eb",
        fontSize: "12px",
        cursor: "pointer",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {event.title}

    </div>

  );
}
