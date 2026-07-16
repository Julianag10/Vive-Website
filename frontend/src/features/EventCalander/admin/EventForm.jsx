import { useState } from "react";
import EventColorChoices from "./EventColorChoices";

export function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

export function occurrenceFormValue(occurrence) {
  return {
    id: occurrence.id,
    date: String(occurrence.occurrence_date).slice(0, 10),
    start_time: String(occurrence.start_time).slice(0, 5),
    end_time: String(occurrence.end_time).slice(0, 5),
  };
}

export function sortOccurrences(occurrences) {
  return [...occurrences].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;

    return a.start_time.localeCompare(b.start_time);
  });
}

export function eventRangeFromOccurrences(occurrences) {
  const sorted = sortOccurrences(occurrences);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return {
    start_date: `${first.date}T${first.start_time}`,
    end_date: `${last.date}T${last.end_time}`,
  };
}

export function parseNotes(text) {
  return text
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function addDays(dateValue, days) {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
  date.setDate(date.getDate() + days);
  return formatDateInput(date);
}

export function createBlankEventForm() {
  const today = new Date();

  return {
    title: "",
    description: "",
    location: "",
    color: "#f0c15d",
    notes_text: "",
    capacity: "",
    is_active: true,
    isRegisterable: false,
    occurrences: [{
      date: formatDateInput(today),
      start_time: "09:00",
      end_time: "10:00",
    }],
  };
}

export function createEventPayload(formData) {
  const eventRange = eventRangeFromOccurrences(formData.occurrences);

  return {
    ...formData,
    ...eventRange,
    notes: parseNotes(formData.notes_text),
    capacity: formData.isRegisterable ? formData.capacity : "",
    occurrences: sortOccurrences(formData.occurrences),
  };
}

export default function EventForm({
  initialForm,
  onSubmit,
  submitLabel = "Save",
  actions = null,
}) {
  const [formData, setFormData] = useState(initialForm);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleColorChange(color) {
    setFormData((prevData) => ({
      ...prevData,
      color,
    }));
  }

  function handleOccurrenceChange(index, field, value) {
    setFormData((prevData) => ({
      ...prevData,
      occurrences: prevData.occurrences.map((occurrence, occurrenceIndex) =>
        occurrenceIndex === index
          ? { ...occurrence, [field]: value }
          : occurrence
      ),
    }));
  }

  function handleDeleteOccurrence(index) {
    setFormData((prevData) => {
      if (prevData.occurrences.length <= 1) return prevData;

      return {
        ...prevData,
        occurrences: prevData.occurrences.filter((_, occurrenceIndex) => occurrenceIndex !== index),
      };
    });
  }

  function handleAddOccurrence() {
    setFormData((prevData) => {
      const sorted = sortOccurrences(prevData.occurrences);
      const lastOccurrence = sorted[sorted.length - 1];
      const nextDate = addDays(lastOccurrence?.date, 1);

      return {
        ...prevData,
        occurrences: [
          ...prevData.occurrences,
          {
            date: nextDate,
            start_time: lastOccurrence?.start_time || "09:00",
            end_time: lastOccurrence?.end_time || "10:00",
          },
        ],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.occurrences.length === 0) return;

    await onSubmit(createEventPayload(formData));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />

      <label>
        Registerable
        <input
          type="checkbox"
          name="isRegisterable"
          checked={Boolean(formData.isRegisterable)}
          onChange={handleChange}
        />
      </label>

      <EventColorChoices
        value={formData.color}
        onChange={handleColorChange}
      />

      {formData.isRegisterable && (
        <>
          <label>
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            min="0"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
          />
        </>
      )}

      <label>
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <label>
        Location
      </label>
      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />

      <label>
        Notes
      </label>
      <textarea
        name="notes_text"
        value={formData.notes_text}
        onChange={handleChange}
        placeholder={"Creates a public bulleted list\nOne note per line or comma-separated"}
      />

      <label>Daily Times</label>
      <div className="event-occurrences-editor">
        {formData.occurrences.map((occurrence, index) => (
          <div className="event-occurrence-row" key={occurrence.id || occurrence.date}>
            <input
              className="event-occurrence-date-input"
              type="date"
              value={occurrence.date}
              title="Change this date. Use the delete button to remove this day from the event."
              onChange={(event) => handleOccurrenceChange(index, "date", event.target.value)}
            />
            <input
              type="time"
              value={occurrence.start_time}
              onChange={(event) => handleOccurrenceChange(index, "start_time", event.target.value)}
            />
            <input
              type="time"
              value={occurrence.end_time}
              onChange={(event) => handleOccurrenceChange(index, "end_time", event.target.value)}
            />
            <button
              className="event-occurrence-delete-button"
              type="button"
              title="Delete this day from the multi-day event"
              disabled={formData.occurrences.length <= 1}
              onClick={() => handleDeleteOccurrence(index)}
            >
              Delete day
            </button>
          </div>
        ))}
        <button
          className="event-occurrence-add-button"
          type="button"
          onClick={handleAddOccurrence}
          aria-label="Add another event date"
        >
          +
        </button>
      </div>

      <label>
        Active
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
        />
      </label>

      {actions || (
        <button type="submit">{submitLabel}</button>
      )}
    </form>
  );
}
