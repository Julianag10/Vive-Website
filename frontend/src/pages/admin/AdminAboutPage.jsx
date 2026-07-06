import { useEffect, useState } from "react";

import CreateStaffModal from "../../features/About/admin/CreateStaffModal";
import EditStaffModal from "../../features/About/admin/EditStaffModal";
import ConfirmStaffDeleteModal from "../../features/About/admin/ConfirmStaffDeleteModal";

import StaffGrid from "../../features/About/StaffGrid";

import {
  getStaff,
  deleteStaff, 
  updateStaff, 
  createStaff
} from "../../features/About/StaffService";
 
function addStaffFields(formData, staffMember) {
  formData.append("id", staffMember.id);
  formData.append("name", staffMember.name);
  formData.append("role", staffMember.role);
  formData.append("bio", staffMember.bio || "");
  formData.append("display_order", staffMember.display_order);
}


export default function AdminAboutPage() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);

  useEffect(() => {
    async function fetchStaffMembers() {
      try {
        const response = await getStaff();
        setStaffMembers(response.staff || response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStaffMembers();
  }, []);
  
  if (loading) return <p>Loading staff members…</p>;
  if (error) return <p>Error: {error}</p>;

  async function onSaveCreate(newStaffData) {
    try {
      setActionError(null);
      newStaffData.set("display_order", staffMembers.length + 1);
      const createdStaff = await createStaff(newStaffData);
      setStaffMembers((prev) => [...prev, createdStaff]);
    } catch (err) {
      setActionError(err.message);
      throw err;
    }
  }

  async function onReorderStaff(sourceStaffId, targetStaffId) {
    if (sourceStaffId === targetStaffId) return;

    const sourceIndex = staffMembers.findIndex((staff) => staff.id === sourceStaffId);
    const targetIndex = staffMembers.findIndex((staff) => staff.id === targetStaffId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const previousStaffMembers = staffMembers;
    const nextStaffMembers = [...staffMembers];
    const [movedStaff] = nextStaffMembers.splice(sourceIndex, 1);
    nextStaffMembers.splice(targetIndex, 0, movedStaff);

    const reorderedStaffMembers = nextStaffMembers.map((staff, index) => ({
      ...staff,
      display_order: index + 1,
    }));

    setActionError(null);
    setStaffMembers(reorderedStaffMembers);

    try {
      const changedStaffMembers = reorderedStaffMembers.filter((staff) => {
        const previousStaff = previousStaffMembers.find((item) => item.id === staff.id);
        return previousStaff?.display_order !== staff.display_order;
      });

      await Promise.all(
        changedStaffMembers.map((staff) => {
          const formData = new FormData();
          addStaffFields(formData, staff);
          return updateStaff(staff.id, formData);
        })
      );
    } catch (err) {
      setStaffMembers(previousStaffMembers);
      setActionError(`Failed to save staff order: ${err.message}`);
    }
  }

  async function onSaveUpdate(formData) {
    try {
      setActionError(null);
      const id = formData.get("id");
      const updated = await updateStaff(id, formData);

      setStaffMembers((prev) =>
        prev.map((staff) => (staff.id === updated.id ? updated : staff))
      );

      setEditingStaff(null);
    } catch (err) {
      setActionError(err.message);
      throw err;
    }
  }

  async function onDelete(staffId) {
    try {
      setActionError(null);
      await deleteStaff(staffId);

      setStaffMembers((prev) => prev.filter((staff) => staff.id !== staffId));
      setDeletingStaff(null);
    } catch (err) {
      setActionError(err.message);
      throw err;
    }
  }


  return (
    <div className="admin-about-page">
      <h1>Staff Management</h1>
      {actionError && <p className="staff-action-error">{actionError}</p>}
  
      <div>
        <h2>Add New Staff Member</h2>
  
        <CreateStaffModal onSaveCreate={onSaveCreate} />
      </div>
  
      <div className="staff-grid">
        <StaffGrid
          staff={staffMembers}
          isAdmin={true}
          onEdit={(staffMember) => {
            setActionError(null);
            setEditingStaff(staffMember);
          }}
          onDelete={(staffMember) => {
            setActionError(null);
            setDeletingStaff(staffMember);
          }}
          onReorder={onReorderStaff}
        />
      </div>
  
      {editingStaff && (
        <EditStaffModal
          staffMember={editingStaff}
          onSaveUpdate={onSaveUpdate}
          onClose={() => setEditingStaff(null)}
        />
      )}
  
      {deletingStaff && (
        <ConfirmStaffDeleteModal
          staffMember={deletingStaff}
          onConfirmDelete={() => onDelete(deletingStaff.id)}
          onClose={() => setDeletingStaff(null)}
        />
      )}
    </div>
  );
}
