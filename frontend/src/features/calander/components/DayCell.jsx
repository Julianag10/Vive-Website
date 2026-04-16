
// redners events inside the day 
// display date number
// display events for that day (maybe just title + time)
// Represents ONE day

import EventItem from "./EventItem";
import "./DayCell.css";

// preview events for that day
// day expansion on
// hover logic
// click logic


export default function DayCell({ date, dayEvents, selectedDay, hoveredDay, onSelectDay, onHoverDay, onSelectEvent, expandOnHover}) {

  // for empty calnder days at the begginign or end of month
  if (!date) return <div style={{ minHeight: 120 }} />;

  // if expand on hover is enabled, expand if hovered day matches this day
  // else expand if selected day matches this day
  const expanded =
    expandOnHover
      ? isSameDay(date, hoveredDay)
      : isSameDay();

  // click day → expand day
  function handleClickDay() {
    // set state in events page -> calander will rerender with day expanded
    onSelectDay(date);
  }
  
  function handleHoverEnter() {
    onHoverDay(date);
  }


  return(
    <div 
      className={`day-cell ${isExpanded ? "expanded" : ""}`}
      onClick={handleClickDay}
    >
      {/* DATE NUMBER */}
      <div className="date-label">
        {date.getDate()}
      </div>

      {/* TODO understand */}
      {/* EVENTS ALWAYS VISIBLE */}
      <div className="events-preview">

        {events.slice(0, 3).map(event => (
          // click event inside day cell → opens event detail modal
          // TODO use good OOP practices to pass down event data + callback
          <div
            key={event.id}
            className="event-preview"
            onClick={(e) => {
              e.stopPropagation(); // prevents triggering day click
              onSelectEvent(event);
            }}
          >
            {event.title}
          </div>
        ))}

        {/* SHOW "+3 MORE" IF MANY EVENTS */}
        {events.length > 3 && (
          <div className="more-events">
            +{events.length - 3} more
          </div>
        )}

      </div>
    </div>
  );
}
