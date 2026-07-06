import { useState } from "react";

function imageSrc(imageUrl) {
  if (!imageUrl || imageUrl.startsWith("blob:") || imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `http://localhost:3000${imageUrl}`;
}

export default function EditStaffModal({
  staffMember,
  onSaveUpdate,
  onClose,
}) {
  const [form, setForm] = useState(staffMember);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(staffMember.image_url);
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
    formData.append("bio", form.bio);
    formData.append("display_order", form.display_order);

    if (image) {
      formData.append("image", image);
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
          <input
            name="name"
            value={form.name}
            placeholder="Name"
            onChange={handleChange}
            required
          />

          <input
            name="role"
            value={form.role}
            placeholder="Role"
            onChange={handleChange}
            required
          />

          <textarea
            name="bio"
            value={form.bio}
            placeholder="Bio"
            onChange={handleChange}
          />

          <input
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
