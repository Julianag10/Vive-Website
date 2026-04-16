import { formatDateKey } from "./dateUtils";

// backend returns array of events that have a date
// but calander renders DAyS not EVENTS
// os reorganixe data from events to events grouped by day
export default function groupEventsByDate(events) {
  const grouped = {};

  // loop througth every event sent from backend
  for (const event of events) {
    // extract start and end date BC event might span multiple days
    // TODO where is Date class?? 
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    // This removes time-of-day from date
    const current = new Date(
      start.getFullYear() 
      start.getMonth(),
      start.getDate()
    );

    // This removes time-of-day from date
    const last = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    );

    // Walk day-by-day through event duration: Loop runs once per day
    while (current <= last) {
      // genrate key for this day (e.g. "2024-06-01")
      const key = formatDateKey(current);

      // if day does not exist yet
      // create empty event list
      if (!grouped[key]) 
        grouped[key] = [];
      
      // add event to that day
      grouped[key].push(event);

      // move to next day
      current.setDate(current.getDate() + 1);
    }
  }

  return grouped;
}