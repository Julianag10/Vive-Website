import DayCell from "./DayCell";

// SHARED PUBLIC + ADMIN COMPONENT
// see events immediately (not after clicking day)
// click day → expand day (DayCell detects click , call i selectDay))
// click event → modal
// groups events by date -> each DayCell receives its events -> events appear immediately


// GROUP EVENTS BY DATE
function groupEventsByDate(events) {
  const grouped = {};

  events.forEach(event => {
    const key = new Date(event.start_date)
      .toDateString();

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(event);
  });

  return grouped;
}

export default function EventCalendar({ events, selectedDay,onSelectDay, onSelectEvent }) {
  // TODO sorts events by data into calander day ?????
  // TODO how to deal with mulit day events?
  // TODO show on all days?
  const groupedEvents = groupEventsByDate(events);


  return 
    // TODO fix map: where is day 
    // TODO day.date shdoul be grouped events
    <div className="calander-grid">
      {days.map(day => (
        <DayCell
          key={day.date}
          date={day.date}
          dayEvents={groupedEvents[date.toDateString()] || []}
          selectedDay={selectedDay}
          isAdmin={isAdmin}
          onSelectDay={onSelectDay}
          onSelectEvent={onSelectEvent}
        />
      ))}
    </div>
  );
}
