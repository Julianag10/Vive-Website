import { useEffect, useState } from "react";

import CreateStaffModal from "../../features/About/admin/CreateStaffModal";
import EditStaffModal from "../../features/About/admin/EditStaffModal";
import ConfirmStaffDeleteModal from "../../features/About/admin/ConfirmStaffDeleteModal";

import StaffGrid from "../../features/About/StaffGrid";

import {
  getStaff,
  deleteStaff,
  updateStaff,
  createStaff,
} from "../../features/About/StaffService";


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
