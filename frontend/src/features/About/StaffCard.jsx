
import { DEFAULT_STAFF_GROUP, STAFF_GROUPS } from "./staffGroups";

const STAFF_PLACEHOLDER_IMAGE = "/uploads/staff/StaffPlaceHolder.png";

function staffImageSrc(imageUrl) {
  if (!imageUrl) {
    return `http://localhost:3000${STAFF_PLACEHOLDER_IMAGE}`;
  }

  if (imageUrl.startsWith("blob:") || imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `http://localhost:3000${imageUrl}`;
}

export default function StaffCard({ 
  staffMember, 
  isAdmin = false, 
  onEdit, 
  onDelete, 
  onSelect,
}) {
  const staffGroup =
    STAFF_GROUPS.find((group) => group.value === staffMember.staff_group) ||
    STAFF_GROUPS.find((group) => group.value === DEFAULT_STAFF_GROUP);
  const className = [
    "staff-card",
    !isAdmin ? "staff-card-public" : "",
    onSelect ? "staff-card-clickable" : "",
  ].filter(Boolean).join(" ");

  function handleKeyDown(event) {
    if (!onSelect) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(staffMember);
    }
  }

  return (
    <div
      className={className}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? () => onSelect(staffMember) : undefined}
      onKeyDown={handleKeyDown}
    >

      <div className="staff-image-container">
        <img 
          src={staffImageSrc(staffMember.image_url)}
          alt={staffMember.name} 
        />
      </div>

      <div className="staff-card-content">
        <h3>{staffMember.name}</h3>
        <h4>{staffMember.role}</h4>
        {isAdmin && staffGroup && (
          <p className="staff-card-group">
            <span>Group</span>
            {staffGroup.label}
          </p>
        )}
      </div>

      {isAdmin && (
        <div className="staff-card-actions">
          <button type="button" onClick={onEdit}>Edit</button>
          <button type="button" onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
