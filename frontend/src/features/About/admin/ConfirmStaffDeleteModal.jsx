import { useState } from "react";

export default function ConfirmStaffDeleteModal({
  staffMember,
  onConfirmDelete,
  onClose,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      await onConfirmDelete();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="staff-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="staff-modal staff-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-staff-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="delete-staff-title">Delete Staff Member</h3>

        <p>
          Are you sure you want to delete{" "}
          <b>{staffMember.name}</b>?
        </p>

        {error && <p className="staff-action-error">{error}</p>}

        <div className="staff-modal-actions">
          <button type="button" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>

          <button type="button" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
