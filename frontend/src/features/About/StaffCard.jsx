
export default function StaffCard({ 
  staffMember, 
  isAdmin = false, 
  onEdit, 
  onDelete, 
  draggable = false,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const className = [
    "staff-card",
    draggable ? "staff-card-draggable" : "",
    isDragging ? "staff-card-dragging" : "",
    isDragOver ? "staff-card-drag-over" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={className}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >

      <div className="staff-image-container">
        <img 
          src={`http://localhost:3000${staffMember.image_url}`}
          // src={staffMember.image_url} 
          // uploads/staff/xxxxxxxx.png
          alt={staffMember.name} 
        />
      </div>

      <div className="staff-card-content">
        <h3>{staffMember.name}</h3>
        <h4>{staffMember.role}</h4>
        <p>{staffMember.bio}</p>
      </div>

      {isAdmin && (
        <div className="staff-card-actions">
          {draggable && (
            <button
              type="button"
              className="staff-drag-button"
              aria-label="Drag to reorder"
              title="Drag to reorder"
              draggable
              onDragStart={onDragStart}
            >
              <span className="staff-drag-dots" aria-hidden="true" />
              Drag
            </button>
          )}
          <button type="button" onClick={onEdit}>Edit</button>
          <button type="button" onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
