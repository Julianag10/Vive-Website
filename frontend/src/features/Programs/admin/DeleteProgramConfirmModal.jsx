export default function DeleteProgramConfirmModal({
  program,
  onConfirm,
  onClose,
}) {
  if (!program) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal admin-delete-program-modal">
        <h2>Delete Program "{program.title}"?</h2>

        <p>Are you sure you want to delete this program?</p>

        

        <div className="modal-actions">
          <button type="button" onClick={onConfirm}>
            Delete
          </button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
