// PUBLIC
import {getEventsForMonth} from "../services/events.service";

export async function getEventsForMonthController(req, res) {
  const { month, year } = req.query;

  const events = await getEventsForMonth(
    Number(month),
    Number(year),
  );

  res.json(events);
}