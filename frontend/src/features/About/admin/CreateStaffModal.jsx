import { useState } from "react";

const INITIAL = {
  name: "",
  role: "",
  bio: "",
};

export default function CreateStaffModal({ onSaveCreate }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

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

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("bio", form.bio);

    if (image) {
      formData.append("image", image); // MUST MATCH upload.single("image")
    }

    await onSaveCreate(formData);
    setForm(INITIAL);
    setImage(null);
    setPreview(null);
  }

  return (
    <div className="create-staff-modal">
      <h3>Create Staff</h3>

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          name="role"
          value={form.role}
          placeholder="Role"
          onChange={handleChange}
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

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
