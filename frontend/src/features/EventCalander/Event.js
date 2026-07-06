// I DONT THINK THIS IS DONE - JUST CHAT GBT IMPLEMNTATION
// like a class

// INSIDE EVENT DETAIL MODAL 
// title
// description
// date/time
// location
// instructor
// register link
// notes section .... (later)

// const event = new Event(...) ?????
export default class Event {

  // add location??
  // add date and time ??
  // add a type for filters: community event, fundraser??
  constructor({id, title, description, location, start_date, end_date, is_active, is_registerable}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.startDate = new Date(start_date);
    this.endDate = new Date(end_date);
    this.isActive = is_active;
    this.isRegisterable = is_registerable ?? false;
    // add notes section later
  }

  isMultiDay() {
    return this.startDate.toDateString() !== this.endDate.toDateString();
  }
}
