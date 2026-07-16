export default class Registration {

  constructor({
    id,
    type,
    resource_id,
    resource_title,
    name,
    firstName,
    lastName,
    email,
    notes,
    created_at,
    program_id,
    event_id,
    event_occurrence_id,
    occurrence_date,
    start_time,
    end_time,
    event_start_date,
    event_end_date,
    capacity,
    waitlist_position,
    status,
  }) {
    this.id = id;
    this.type = type;
    this.resourceId = resource_id;
    this.resourceTitle = resource_title;
    this.name = name;

  const fallbackName = name || [firstName, lastName].filter(Boolean).join(" ").trim();
  const [derivedFirstName = "", ...derivedLastNameParts] = fallbackName.split(/\s+/);

  this.firstName = firstName || derivedFirstName;
  this.lastName = lastName || derivedLastNameParts.join(" ");
  this.email = email;
  this.notes = notes;
  this.programId = program_id;
  this.eventId = event_id;
  this.eventOccurrenceId = event_occurrence_id;
  this.occurrenceDate = occurrence_date;
  this.startTime = start_time;
  this.endTime = end_time;
  this.eventStartDate = event_start_date;
  this.eventEndDate = event_end_date;
  this.capacity = capacity;
  this.waitlistPosition = waitlist_position;
  this.createdAt = new Date(created_at);
  this.status = status; // registered or waitlisted
  }
}
