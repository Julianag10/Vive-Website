// PUBLIC
import { getAllEventsForMonth } from "../services/events.service.js";

export async function getEventsForMonthController(req, res) {
  const { month, year } = req.query;
  const now = new Date();
  const parsedMonth = Number(month);
  const parsedYear = Number(year);
  const requestedMonth = Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
    ? parsedMonth
    : now.getMonth() + 1;
  const requestedYear = Number.isInteger(parsedYear) && parsedYear >= 1900
    ? parsedYear
    : now.getFullYear();

  const events = await getAllEventsForMonth(
    requestedMonth,
    requestedYear,
  );

  res.json(events);
}
