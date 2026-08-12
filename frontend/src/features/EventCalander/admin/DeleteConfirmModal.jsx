export default function DeleteConfirmModal({
  event,
  onConfirm,
  onClose,
}) {
  if (!event) return null;

  return ( 
    <div className="modal-backdrop"> 
    <div className="modal admin-event-delete-modal">

    <h2>Delete Event "{event.title}"</h2>

    <p>
      Are you sure you want to delete this event ?
    </p>

    <div className="modal-actions">
      <button
        className="admin-event-delete-confirm-button"
        type="button"
        onClick={onConfirm}
      >
        Delete
      </button>

      <button
        className="admin-event-delete-cancel-button"
        type="button"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>

  </div>
  </div>
);
}
