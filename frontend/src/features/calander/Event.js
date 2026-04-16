// liek a class

//INSIDE EVENT DETAIL MODAL 
// title
// description
// date/time
// location
// instructor
// register link
// add 

export default class Event {

  // add location??
  // add date and time ??
  // add a type for filters: community event, fundraser??
  constructor({id, title, description, location, start_date, end_date, is_active}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.startDate = new Date(start_date);
    this.endDate = new Date(end_date);
    this.isActive = is_active;
  }

  isMultiDay() {
    return this.startDate.toDateString() !== this.endDate.toDateString();
  }
}