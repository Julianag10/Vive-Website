export default class Registration {

  constructor({
    id,
    name,
    firstName,
    lastName,
    email,
    created_at,
    program_id,
    event_id,
    status,
  }) {

    this.id = id;

    this.name = name;

  const fallbackName = name || [firstName, lastName].filter(Boolean).join(" ").trim();
  const [derivedFirstName = "", ...derivedLastNameParts] = fallbackName.split(/\s+/);

  this.firstName = firstName || derivedFirstName;

  this.lastName = lastName || derivedLastNameParts.join(" ");

    this.email = email;

  this.programId = program_id;

  this.eventId = event_id;

    this.createdAt = new Date(created_at);

    this.status = status; // registered or waitlisted
    // add form.emergencyPhone

  }

}