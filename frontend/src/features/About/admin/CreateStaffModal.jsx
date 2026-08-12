import { useRef, useState } from "react";
import { compressStaffImage } from "../imageCompression";
import { DEFAULT_STAFF_GROUP, STAFF_GROUPS } from "../staffGroups";

const STAFF_PLACEHOLDER_IMAGE = "/uploads/staff/StaffPlaceHolder.png";

const INITIAL = {
  name: "",
  role: "",
  bio: "",
  staff_group: DEFAULT_STAFF_GROUP,
};

export default function CreateStaffModal({ onSaveCreate }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    staff_group: DEFAULT_STAFF_GROUP,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(STAFF_PLACEHOLDER_IMAGE);

  function resetForm() {
    setForm(INITIAL);
    setImage(null);
    setPreview(STAFF_PLACEHOLDER_IMAGE);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(STAFF_PLACEHOLDER_IMAGE);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("bio", form.bio);
    formData.append("staff_group", form.staff_group);

    if (image) {
      formData.append("image", await compressStaffImage(image, form.name)); // MUST MATCH upload.single("image")
    }

    await onSaveCreate(formData);
    resetForm();
  }

  return (
    <div className="create-staff-modal">
      <h3>Create Staff</h3>

      <img
        className="staff-upload-preview"
        src={preview}
        alt="Staff preview"
      />

      <form onSubmit={handleSubmit}>
        <label htmlFor="create-staff-name">Name</label>
        <input
          id="create-staff-name"
          name="name"
          value={form.name}
          placeholder="Enter staff member name"
          onChange={handleChange}
        />

        <label htmlFor="create-staff-role">Role</label>
        <input
          id="create-staff-role"
          name="role"
          value={form.role}
          placeholder="Enter staff member role"
          onChange={handleChange}
        />

        <label htmlFor="create-staff-group">Staff Group</label>
        <select
          id="create-staff-group"
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

        <label htmlFor="create-staff-bio">Bio</label>
        <textarea
          id="create-staff-bio"
          name="bio"
          value={form.bio}
          placeholder="Enter staff member bio"
          onChange={handleChange}
        />

        <label htmlFor="create-staff-image">Staff Photo</label>
        <input
          id="create-staff-image"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        <div className="staff-modal-actions">
          <button type="submit">Create</button>
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
