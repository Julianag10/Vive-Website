import Event from "./Event";

// PUBLIC + ADMIN API CALLS:

// ABSTRACTIONLAYER
// LOGIC AND DATA FETCHING 
// HOW YOU GET OR PROCESS DATA
// WHERE DO EVENTS COME FROM ?

export default class EventService {
  normalizeOutgoingEvent(eventData) {
    const { isRegisterable, ...rest } = eventData;

    return {
      ...rest,
      is_registerable: isRegisterable ?? false,
    };
  }

  // --------------------------------------------------
  //             PUBLIC API CALLS
  // --------------------------------------------------

  async getActiveEventsForMonth(year,month){
    const res = await fetch(`/api/events?year=${year}&month=${month}`);

    if (!res.ok)
      throw new Error("Failed to fetch events");

    const data = await res.json();

    // convert to Event objects in fron end 
    // store in db in plain json
    const activeEvents = data.map(eventData => new Event(eventData));
    return activeEvents;
  }

// --------------------------------------------------
//             ADMIN API CALLS
// --------------------------------------------------

  // ADMIN - some events could be toggled, admin shoudl see all events even it toggled
  async getAllEventsForMonth(month, year) {
     const res = await fetch(`/admin/api/events?year=${year}&month=${month}`, {
      credentials: "include", // include cookies for authentication
    });

    if (!res.ok) 
      throw new Error("Failed to fetch events");
    
    const data = await res.json();

    // create new events with new porgram data
    const allPrograms = data.map(eventData => new Event(eventData));
    return allPrograms;  
  }

  // ADMIN
  async postCreatedEvent(eventData) {
    const payload = this.normalizeOutgoingEvent(eventData);
    // TODO FIX HERE
    const res = await fetch("/admin/api/events/createEvent", {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json",} ,
      body: JSON.stringify(payload),
    });

    if (!res.ok) 
      throw new Error("Failed to fetch events");
  
    const newEvent = await res.json();
    return new Event(newEvent); // convert to event object
  }

  // ADMIN
  async putUpdatedEvent(id, eventData) {
    const payload = this.normalizeOutgoingEvent(eventData);
    const res = await fetch(`/admin/api/events/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json",} ,
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) 
      throw new Error("Failed to fetch events");

    const updatedEvent = await res.json();
    return new Event(updatedEvent); // convert to event object
  }

  // ADMIN - toggle event?? 
  async patchToggledEvent(id, isActive) {
    const res = await fetch(`/admin/api/events/${id}/active`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json",} ,
      credentials: "include",
      // sending backend active status that should be stored 
      body: JSON.stringify({is_active: !isActive}),
    });

    if(!res.ok) {
      const errorData = await res.json(); //
      throw new Error(errorData.error || "failed to load featured programs");
    }

    const updatedEvent = await res.json();
    return new Event(updatedEvent); // convert to event object
  }

  // ADMIN
  async deleteEvent(id) {
    const res = await fetch(`/admin/api/events/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) 
      throw new Error("Failed to delete event");

    return true; // no event needed
  }

}