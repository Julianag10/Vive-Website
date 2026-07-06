export default function DeleteConfirmModal({
  event,
  onConfirm,
  onClose,
}) {
  if (!event) return null;

  return ( 
    <div className="modal-backdrop"> 
    <div className="modal">

    <h2>Delete Event</h2>

    <p>
      Are you sure you want to delete:
    </p>

    <strong>{event.title}</strong>

    <div className="modal-actions">
      <button
        type="button"
        onClick={onConfirm}
      >
        Delete
      </button>

      <button
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
