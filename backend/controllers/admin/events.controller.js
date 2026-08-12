// ADMIN
import {
  getAllEvents,
  getAllEventsForMonth,
  postCreatedEvent, 
  putUpdatedEvent,
  patchToggledEvent,
  deleteEvent,
} from "../../services/admin/events.service.js";

export async function getAllEventsController(_req, res) {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}

export async function getEventsForMonthController(req, res) {
  try {
    // becuase month and year were sent in url 
    const { month, year } = req.query;
    const events = await getAllEventsForMonth(
      Number(month),
      Number(year),
    );

    res.json(events);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}


export async function postCreatedEventController(req, res) {

  const newEvent = await postCreatedEvent(
    req.body,
  );

  res.json(newEvent);
}


export async function putUpdatedEventController(req, res) {
  const updatedEvent = await putUpdatedEvent(
    req.params.id,
    req.body,
  );

  res.json(updatedEvent);
}


export async function patchToggledEventController(req, res) {
  const toggledProgram = await patchToggledEvent(
    req.params.id,
    req.body.is_active,
  );

  res.json(toggledProgram);
}


export async function deleteEventController(req, res) {
  try {
    const { id } = req.params;

    const success = await deleteEvent(id);

    if (!success) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
  
}
