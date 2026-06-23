import DayCell from "./DayCell";
import groupEventsByDate from "../groupEventsByDate";
import { 
  getMonthGridDates, 
  formatDateKey
} from "../dateUtils";

// SHARED COMPONENT - PUBLIC + ADMIN 
// see events immediately (not after clicking day)
// click/hover day → expand day (DayCell detects click , call i selectDay))
// click/hover event → open eventDetailsModal
// groups events by date -> each DayCell receives its events -> events appear immediately

// RESPONSIBEL FOR 
// month grid
// grouping events by date 
// rendering DayCells


export default function EventCalendar({ events, year, month, expandedDay, setExpandedDay, onEventSelect }) {
  // TODO how to deal with mulit day events?
  // TODO show on all days?
  const groupedEvents = groupEventsByDate(events);
  const days = getMonthGridDates(year, month);

  // const days = getMonthDays(new Date().getFullYear(), new Date().getMonth() + 1);

  return (
    // TODO fix map: where is day 
    // TODO day.date shdoul be grouped events
    <div className="calander-grid">
      {days.map((date, i) => (
        <DayCell
          key={i}
          date={date}
          dayEvents={date ? groupedEvents[formatDateKey(date)] || [] : []}
          expandedDay={expandedDay}
          setExpandedDay={setExpandedDay}
          onEventSelect={onEventSelect}
        />
      ))}
    </div>
  );
}

