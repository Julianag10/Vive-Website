import { useState } from "react";

// NOT ANY WHERE NEAR DONE - JUST PALCE HOLDER IMPLEMENTATION
const INITIAL_FORM = {
  title: "",
  // TODO ...
};

export default function CreateEventModal({onSaveCreate, onCancelCreate}) {
  const [form, setForm] = useState(INITIAL_FORM);

  // dont need a use effect here because we only want to post to backend when user clicks save button -> so we can put the use effect in the parent component and pass down the callback to this component
  async function handleSubmitForm() {
    // post new event to backend -> get back created event with id
    const createdEvent = await eventService.postCreatedEvent(FormData);

    onSaveCreate(createdEvent);
  };


  onCancelCreate();
}