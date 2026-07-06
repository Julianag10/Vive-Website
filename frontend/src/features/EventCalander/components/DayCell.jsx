import EventItem from "./EventItem";
import { formatDateKey } from "../dateUtils";
import "./DayCell.css";

// HANDLES:
// display date number
// expand DAY 
// render EventItems


// WHY PASSING IN dayEvents, and selected day, and hovered day???
// WHY PASSINGIN onSelectDay, onHoverDay, onSelectEvent ????
export default function DayCell({ date, dayEvents, expandedDay, setExpandedDay, onEventSelect}) {

  // for empty calander days at the begginign or end of month
  if (!date) return <div className="day empty" />;

  // if expand on hover is enabled, expand if hovered day matches this day
  // else expand if selected day matches this day
  const isExpanded =
    expandedDay &&
    formatDateKey(expandedDay) === formatDateKey(date);

  function expandDay() {
    setExpandedDay(date);
  }

  return(
    <div
      className={`day-cell ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={expandDay}
      onClick={expandDay}
    >
      <div className="day-date"> {date.getDate()} </div>

      {dayEvents
        .slice(0, isExpanded ? dayEvents.length : 3)
        .map(event => (
          <EventItem
            key={event.id}
            event={event}
            onClick={() =>onEventSelect(event)}
          />
      ))}

      {!isExpanded && dayEvents.length > 3 && (
        <div className="more-events">+{dayEvents.length - 3} more</div>
      )}
    </div>
  );
}
