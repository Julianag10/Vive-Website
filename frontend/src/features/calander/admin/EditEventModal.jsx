// import { useState} from "react";
import EventService from "../EventService";


// edit title
// edit date
// edit time
// edit description
// toggle active
export default function EditEventModal({ event, onSaveEdit, onDelete}) {
  const eventService = new EventService();

  // DELETE CONFIRMATION MODAL STATE 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleFormSubmit() {
    // update backend with updated event
    const updatedEvent = await eventService.putUpdatedEvent(event.id, ...updatedEventData);
    onSaveEdit(updatedEvent);
  }

  function handleDeleteClick() {
    // open delete confirmation modal
    setShowDeleteConfirm(true);
  }

  return (
    <DeleteConfirmModal
      onConfirmDelete={onDelete}
      onCancelDelete={() => setShowDeleteConfirm(false)}
    />
  )
}

DeleteConfirmModal({onConfirmDelete})
// confirm delte button
function handleClickConfirm() {
  onConfirmDelete
}