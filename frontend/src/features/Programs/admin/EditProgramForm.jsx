import { useState } from "react";

// HELPER
function parseActivities(text) {
  return text
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function EditProgramForm({program, onSaveEdit, onCancleEdit, featuredProgramCount}) {
  // start form filled w/ editing progrma info
  const [form, setEditForm] = useState({
    title: program.title,
    description: program.description,
    start_date: formatDateInputValue(program.start_date),
    end_date: formatDateInputValue(program.end_date),
    capacity: program.capacity,
    is_active: program.is_active ?? true,
    is_featured: program.is_featured ?? false,
    image_url: program.image_url ?? "",
    activities_text: Array.isArray(program.activities) ? program.activities.join("\n") : "",
  });
  const [featuredError, setFeaturedError] = useState("");

  const wouldExceedFeaturedLimit = (isFeatured) =>
    isFeatured && !program.is_featured && featuredProgramCount >= 3;

  //e = change in the input field object
  async function handleChange(e) {
    // save a input fields data on change
    const { name, value, type, checked } = e.target;

    if (name === "is_featured") {
      setFeaturedError(
        wouldExceedFeaturedLimit(checked)
          ? "Only three featured programs allowed."
          : "",
      );
    }

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

    if (wouldExceedFeaturedLimit(form.is_featured)) {
      setFeaturedError("Only three featured programs allowed.");
      return;
    }

    try {
      // await bc -> form could reset or close before the save finished
      // onSaveEdit(program.id, newData)
      await onSaveEdit(program.id, {
        title: form.title,
        description: form.description,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        capacity: Number(form.capacity),
        is_active: form.is_active,
        is_featured: form.is_featured,
        image_url: form.image_url || null,
        activities: parseActivities(form.activities_text),
      });
    } catch (err) {
      setFeaturedError(err.message);
    }
  }

  // render form UI
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
      </label>
      <input name="title" value={form.title} onChange={handleChange} required />
      <label>
        Description
      </label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      <label>
        Start Date
      </label>
      <input
        type="date"
        name="start_date"
        value={form.start_date}
        onChange={handleChange}
      />
      <label>
        End Date
      </label>
      <input
        type="date"
        name="end_date"
        value={form.end_date}
        onChange={handleChange}
      />

      <label>
        Capacity
      </label>
      <input
        type="number"
        name="capacity"
        value={form.capacity}
        onChange={handleChange}
        min="0"
      />

      <label>
        Image Url
      </label>
      <input
        name="image_url"
        value={form.image_url}
        onChange={handleChange}
        placeholder="Image URL"
      />

      <label>
        Notes / Activities
      </label>
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
      <label>
        <input
          type="checkbox"
          name="is_featured"
          checked={form.is_featured}
          onChange={handleChange}
        />
        Featured Program
      </label>
      {featuredError && (
        <p className="admin-program-form-error">{featuredError}</p>
      )}

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
