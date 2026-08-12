export default function SuccessModal({
  title,
  children,
  actions = [],
  onClose,
  closeLabel = "Close",
  className = "",
}) {
  const modalClassName = ["modal", "success-modal", className]
    .filter(Boolean)
    .join(" ");

  const buttons = actions.length > 0
    ? actions
    : [{ label: closeLabel, onClick: onClose }];

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        aria-modal="true"
        className={modalClassName}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        {onClose && (
          <button
            aria-label="Close"
            className="success-modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        )}
        <h2>{title}</h2>
        <div className="success-modal-body">
          {children}
        </div>
        <div className="success-modal-actions">
          {buttons.map((action) => (
            <button
              className={action.className}
              disabled={action.disabled}
              key={action.label}
              onClick={action.onClick}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
