const DISPLAY_DATE_OPTIONS = {
  month: "long",
  day: "numeric",
  year: "numeric",
};

const DISPLAY_TIME_OPTIONS = {
  hour: "numeric",
  minute: "2-digit",
};

function parseDateOnly(value) {
  const datePart = String(value).slice(0, 10);
  if (!datePart) return null;

  const date = new Date(`${datePart}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseTimeOnly(value) {
  const timePart = String(value).slice(0, 8);
  if (!timePart) return null;

  const date = new Date(`1970-01-01T${timePart}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDateTime(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDisplayDate(value, fallback = "TBD") {
  if (!value) return fallback;

  const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)
    ? parseDateOnly(value)
    : parseDateTime(value);

  return date
    ? date.toLocaleDateString("en-US", DISPLAY_DATE_OPTIONS)
    : fallback;
}

export function formatDisplayDateTime(value, fallback = "TBD") {
  const date = parseDateTime(value);

  return date
    ? date.toLocaleString("en-US", {
        ...DISPLAY_DATE_OPTIONS,
        ...DISPLAY_TIME_OPTIONS,
      })
    : fallback;
}

export function formatDisplayTime(value, fallback = "TBD") {
  if (!value) return fallback;

  const date = typeof value === "string" && !value.includes("T")
    ? parseTimeOnly(value)
    : parseDateTime(value);

  return date
    ? date.toLocaleTimeString("en-US", DISPLAY_TIME_OPTIONS)
    : fallback;
}

export function formatDisplayTimeRange(startValue, endValue, fallback = "TBD") {
  const start = formatDisplayTime(startValue, "");
  const end = formatDisplayTime(endValue, "");

  if (start && end) return `${start} - ${end}`;
  return start || end || fallback;
}

export function formatMonthYear(year, month) {
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}
