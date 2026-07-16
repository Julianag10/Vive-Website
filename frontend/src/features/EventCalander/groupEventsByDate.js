import { formatDateKey } from "./dateUtils";

// backend returns array of events that have a date
// but calander renders DAyS not EVENTS
// os reorganixe data from events to events grouped by day
export default function groupEventsByDate(events) {
  const grouped = {};

  // loop througth every event sent from backend
  for (const event of events) {
    if (Array.isArray(event.occurrences) && event.occurrences.length > 0) {
      for (const occurrence of event.occurrences) {
        const key = occurrence.occurrence_date
          ? String(occurrence.occurrence_date).slice(0, 10)
          : null;

        if (!key) continue;

        if (!grouped[key]) grouped[key] = [];

        grouped[key].push({
          ...event,
          occurrence,
        });
      }

      continue;
    }

    // extract start and end date BC event might span multiple days
    // TODO where is Date class?? 
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    // This removes time-of-day from date
    const current = new Date(
      start.getFullYear(),
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

  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => {
      const aTime = a.occurrence?.start_time || a.startDate?.toTimeString?.().slice(0, 5) || "99:99";
      const bTime = b.occurrence?.start_time || b.startDate?.toTimeString?.().slice(0, 5) || "99:99";
      return aTime.localeCompare(bTime);
    });
  }

  return grouped;
}
