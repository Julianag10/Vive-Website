import { useState } from "react";

// HELPER
function parseActivities(text) {
  return text
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}


export default function EditProgramForm({program, onSaveEdit, onCancleEdit}) {
  // start form filled w/ editing progrma info
  const [form, setEditForm] = useState({
    title: program.title,
    description: program.description,
    start_date: program.start_date,
    end_date: program.end_date,
    capacity: program.capacity,
    is_active: program.is_active ?? true,
    image_url: program.image_url ?? "",
    activities_text: Array.isArray(program.activities) ? program.activities.join("\n") : "",
  });

  //e = change in the input field object
  async function handleChange(e) {
    // save a input fields data on change
    const { name, value, type, checked } = e.target;

    // rerenders input field on
    setEditForm((prev) => ({
      ...prev, // keep all old fields

      // overwrite only the input fields that user types
      // [name] is a dynamic object key: changes at runtime
      // “update field name with the UPDATED value”
      // but if the field has a checkbox type, update the checked value
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // changes in form -> only change a certain field?
  async function handleSubmit(e) {
    // stops page refresh on evnet change
    e.preventDefault();

    // await bc -> form could reset or close before the save finished
    // onSaveEdit(program.id, newData)
    await onSaveEdit(program.id, {
      title: form.title,
      description: form.description,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      capacity: Number(form.capacity),
      is_active: form.is_active,
      image_url: form.image_url || null,
      activities: parseActivities(form.activities_text),
    });
  }

  // render form UI
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} required />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
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

      <div className="admin-edit-from-buttons">
        <button type="submit"> save </button>
        <button type="button" onClick={onCancleEdit}>
          {" "}
          cancel{" "}
        </button>
      </div>
    </form>
  );
}
