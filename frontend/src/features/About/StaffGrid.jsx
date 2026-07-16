import { useState } from "react";
import StaffCard from "./StaffCard";
import "../../styles/admin-aboutUS.css";

export default function StaffGrid({
  staff, 
  isAdmin = false,
  onEdit,
  onDelete,
  onReorder,
}) {
  const [draggedStaffId, setDraggedStaffId] = useState(null);
  const [dragOverStaffId, setDragOverStaffId] = useState(null);

  function handleDragStart(event, staffId) {
    setDraggedStaffId(staffId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(staffId));
  }

  function handleDragOver(event, staffId) {
    if (!isAdmin || !onReorder) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverStaffId(staffId);
  }

  function handleDrop(event, targetStaffId) {
    if (!isAdmin || !onReorder) return;

    event.preventDefault();
    const sourceStaffId = draggedStaffId ?? Number(event.dataTransfer.getData("text/plain"));

    setDraggedStaffId(null);
    setDragOverStaffId(null);
    onReorder(sourceStaffId, targetStaffId);
  }

  function handleDragEnd() {
    setDraggedStaffId(null);
    setDragOverStaffId(null);
  }

  return (
    <section className="staff-section">

      <h2> Meet Our Team</h2>

      <div className="staff-card-grid">
        {staff.map((staffMember) => (
          <StaffCard 
            key={staffMember.id} 
            staffMember={staffMember} 
            isAdmin={isAdmin}
            onEdit={() => onEdit(staffMember)}
            onDelete={() => onDelete(staffMember)}
            draggable={isAdmin && Boolean(onReorder)}
            isDragging={draggedStaffId === staffMember.id}
            isDragOver={dragOverStaffId === staffMember.id}
            onDragStart={(event) => handleDragStart(event, staffMember.id)}
            onDragOver={(event) => handleDragOver(event, staffMember.id)}
            onDrop={(event) => handleDrop(event, staffMember.id)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </section>
  );
}
