import { act, useState } from "react";

const INITIAL_FORM = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  capacity: "",
  is_active: true,
  image_url: "",
  activities_text: "",
};

// HELPER
function parseActivities(text) {
  return text
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CreateProgramForm({onSaveCreate}) {
  const [form, setForm] = useState(INITIAL_FORM);

  function handleChange(e) {
    // e -> USER CHANGED input field object
    const { name, value, type, checked } = e.target;

    setForm((prevForm) => ({
      ...prevForm,

      // match the change input filds name 
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // pass form data up to AdminPrograms -> postCreatedProgram() -> backend
    await onSaveCreate({
      title: form.title,
      description: form.description,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      capacity: Number(form.capacity),
      is_active: form.is_active,
      image_url: form.image_url || null,
      activities: parseActivities(form.activities_text),
    });

    // reset form to blank form
    setForm(INITIAL_FORM);
  }


  return (
    <form className="create-program-form" onSubmit={handleSubmit}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="date"
        name="start_date"
        value={form.start_date}
        onChange={handleChange}
      />
      <input
        type="date"
        name="end_date"
        value={form.end_date}
        onChange={handleChange}
      />
      <input
        type="number"
        name="capacity"
        value={form.capacity}
        onChange={handleChange}
        placeholder="Capacity"
        min="0"
      />
      <input
        name="image_url"
        value={form.image_url}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <textarea
        name="activities_text"
        value={form.activities_text}
        onChange={handleChange}
        placeholder="One per line or comma-separated"
      />
      <label>
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />
        Active
      </label>
      <button type="submit">Create Program</button>
    </form>
  );

}
