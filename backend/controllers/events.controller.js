// PUBLIC
import { getAllEventsForMonth } from "../services/events.service.js";

export async function getEventsForMonthController(req, res) {
  const { month, year } = req.query;

  const events = await getAllEventsForMonth(
    Number(month),
    Number(year),
  );

  res.json(events);
}