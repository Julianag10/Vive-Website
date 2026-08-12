import {
  formatDisplayDate,
  formatDisplayTimeRange,
} from "../../utils/dateFormat";

export function isSameDay(dateA, dateB) {
  if (!dateA || !dateB) return false;

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Calendars are rectangular grids: Sun Mon Tue Wed Thu Fri Sat
// But months don’t start on Sunday: March starts on Wednesday
// So grid must look like: _  _  _  1  2  3  4
// blank cells must exist : This function generates them
export function getMonthGridDates(year, month) {
  // find first day of month, result: March 1, 2026
  const firstOfMonth = new Date(year, month - 1, 1);
  // day = 0 -> means previous month’s last day
  // new Date(2026, 3, 0) = March 31
  const lastOfMonth = new Date(year, month, 0);

  // Find weekday index: 0 = Sunday, 1 = Monday, 2 = Tuesday, ...
  // wednesday = 3, So calendar needs 3 blank cells first.
  const startDayOfWeek = firstOfMonth.getDay();
  // Find number of days in month: March has 31 days
  const daysInMonth = lastOfMonth.getDate();

  const gridDates = [];

  // Insert blank cells -> [ null, null, null ]
  for (let i = 0; i < startDayOfWeek; i++) {
    gridDates.push(null);
  }

  // Insert actual days -> now -> [ null null null 1 2 3 4 5 ... ]
  for (let day = 1; day <= daysInMonth; day++) {
    gridDates.push(new Date(year, month - 1, day));
  }

  // Fill final row: Calendar rows must be multiples of 7
  // So add trailing blanks: 30 31 null null null
  while (gridDates.length % 7 !== 0) {
    gridDates.push(null);
  }

  return gridDates;
}

export function formatTimeRange(startDate, endDate) {
  return formatDisplayTimeRange(startDate, endDate);
}

function occurrenceScheduleRow(occurrence) {
  const date = formatDisplayDate(occurrence.occurrence_date || occurrence.date);
  const time = formatDisplayTimeRange(occurrence.start_time, occurrence.end_time);

  return { date, time };
}

export function getEventScheduleRows(event) {
  if (Array.isArray(event?.occurrences) && event.occurrences.length > 0) {
    return event.occurrences.map(occurrenceScheduleRow);
  }

  return [{
    date: formatDisplayDate(event?.startDate),
    time: formatDisplayTimeRange(event?.startDate, event?.endDate),
  }];
}

export function isMultiDayEvent(event) {
  return getEventScheduleRows(event).length > 1;
}
