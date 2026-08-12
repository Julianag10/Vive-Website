import { useState } from "react";
import StaffCard from "./StaffCard";
import { DEFAULT_STAFF_GROUP, STAFF_GROUPS } from "./staffGroups";
import "../../styles/admin-aboutUS.css";

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

function groupPublicStaff(staff) {
  const groups = Object.fromEntries(STAFF_GROUPS.map((group) => [group.value, []]));

  staff.forEach((staffMember) => {
    const group = staffMember.staff_group || DEFAULT_STAFF_GROUP;
    const groupKey = groups[group] ? group : DEFAULT_STAFF_GROUP;
    groups[groupKey].push(staffMember);
  });

  return groups;
}

function StaffDetailModal({ staffMember, onClose }) {
  if (!staffMember) return null;

  return (
    <div className="staff-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="staff-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="staff-modal-close"
          aria-label="Close staff details"
          onClick={onClose}
        >
          <span aria-hidden="true" />
        </button>

        <div className="staff-modal-header">
          <h3 id="staff-detail-title">{staffMember.name}</h3>
          <h4>{staffMember.role}</h4>
        </div>

        <div className="staff-modal-body">
          <img
            className="staff-modal-photo"
            src={staffImageSrc(staffMember.image_url)}
            alt={staffMember.name}
          />

          <div className="staff-modal-copy">
            {staffMember.bio && <p>{staffMember.bio}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function PublicStaffGroup({ title, staff, className = "", onSelect }) {
  if (staff.length === 0) return null;

  return (
    <section className={`staff-public-group ${className}`.trim()}>
      <h3>{title}</h3>
      <div className="staff-card-grid">
        {staff.map((staffMember) => (
          <StaffCard
            key={staffMember.id}
            staffMember={staffMember}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

export default function StaffGrid({
  staff, 
  isAdmin = false,
  onEdit,
  onDelete,
}) {
  const [selectedStaffMember, setSelectedStaffMember] = useState(null);

  if (!isAdmin) {
    const groupedStaff = groupPublicStaff(staff);

    return (
      <section className="staff-section staff-section-public">
        <h2>Meet The Team</h2>
        <p className="staff-section-help">
          Click on their photo to learn more about each team member!
        </p>

        {STAFF_GROUPS.map((group) => (
          <PublicStaffGroup
            key={group.value}
            title={group.label}
            staff={groupedStaff[group.value]}
            className={group.value === "founder" ? "staff-group-founder" : ""}
            onSelect={setSelectedStaffMember}
          />
        ))}

        <StaffDetailModal
          staffMember={selectedStaffMember}
          onClose={() => setSelectedStaffMember(null)}
        />
      </section>
    );
  }

  return (
    <section className="staff-section">
      <div className="staff-card-grid">
        {staff.map((staffMember) => (
          <StaffCard 
            key={staffMember.id} 
            staffMember={staffMember} 
            isAdmin={isAdmin}
            onEdit={() => onEdit(staffMember)}
            onDelete={() => onDelete(staffMember)}
          />
        ))}
      </div>
    </section>
  );
}
