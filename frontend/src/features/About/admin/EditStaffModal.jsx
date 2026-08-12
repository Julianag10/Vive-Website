import { useState } from "react";
import { compressStaffImage } from "../imageCompression";
import { DEFAULT_STAFF_GROUP, STAFF_GROUPS } from "../staffGroups";

const STAFF_PLACEHOLDER_IMAGE = "/uploads/staff/StaffPlaceHolder.png";

function imageSrc(imageUrl) {
  if (!imageUrl) {
    return `http://localhost:3000${STAFF_PLACEHOLDER_IMAGE}`;
  }

  if (imageUrl.startsWith("blob:") || imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `http://localhost:3000${imageUrl}`;
}

export default function EditStaffModal({
  staffMember,
  onSaveUpdate,
  onClose,
}) {
  const [form, setForm] = useState({
    ...staffMember,
    staff_group: staffMember.staff_group || DEFAULT_STAFF_GROUP,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(staffMember.image_url || STAFF_PLACEHOLDER_IMAGE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();

    formData.append("id", staffMember.id);
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("staff_group", form.staff_group);
    formData.append("bio", form.bio);
    formData.append("display_order", form.display_order);

    if (image) {
      formData.append("image", await compressStaffImage(image, form.name));
    }

    try {
      await onSaveUpdate(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="staff-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="staff-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-staff-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="edit-staff-title">Edit Staff</h3>

        {preview && (
          <img
            className="staff-modal-preview"
            src={imageSrc(preview)}
            alt={`${form.name} preview`}
          />
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="edit-staff-name">Name</label>
          <input
            id="edit-staff-name"
            name="name"
            value={form.name}
            placeholder="Enter staff member name"
            onChange={handleChange}
            required
          />

          <label htmlFor="edit-staff-role">Role</label>
          <input
            id="edit-staff-role"
            name="role"
            value={form.role}
            placeholder="Enter staff member role"
            onChange={handleChange}
            required
          />

          <label htmlFor="edit-staff-group">Staff Group</label>
          <select
            id="edit-staff-group"
            name="staff_group"
            value={form.staff_group}
            onChange={handleChange}
          >
            {STAFF_GROUPS.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>

          <label htmlFor="edit-staff-bio">Bio</label>
          <textarea
            id="edit-staff-bio"
            name="bio"
            value={form.bio}
            placeholder="Enter staff member bio"
            onChange={handleChange}
          />

          <label htmlFor="edit-staff-image">Staff Photo</label>
          <input
            id="edit-staff-image"
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {error && <p className="staff-action-error">{error}</p>}

          <div className="staff-modal-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
