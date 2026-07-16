import { useState } from "react";
import { compressStaffImage } from "../../About/imageCompression";
import { programImageSrc } from "../programImages";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const BLANK_PROGRAM_FORM = {
  title: "",
  description: "",
  location: "",
  start_date: "",
  end_date: "",
  capacity: "",
  is_active: true,
  is_featured: false,
  activities_text: "",
  schedule_days: [],
  start_time: "",
  end_time: "",
};

export function parseActivities(text) {
  return text
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export function programToForm(program) {
  return {
    title: program.title,
    description: program.description,
    location: program.location || "",
    start_date: formatDateInputValue(program.start_date),
    end_date: formatDateInputValue(program.end_date),
    capacity: program.capacity,
    is_active: program.is_active ?? true,
    is_featured: program.is_featured ?? false,
    activities_text: Array.isArray(program.activities) ? program.activities.join("\n") : "",
    schedule_days: program.schedules?.map((schedule) => schedule.day_of_week) || [],
    start_time: program.schedules?.[0]?.start_time || "",
    end_time: program.schedules?.[0]?.end_time || "",
  };
}

export default function ProgramForm({
  initialForm,
  onSubmit,
  featuredProgramCount,
  isExistingFeatured = false,
  existingProgram = null,
  submitLabel,
  onCancel,
  formClassName,
}) {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(existingProgram?.image_url ?? null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [featuredError, setFeaturedError] = useState("");

  const wouldExceedFeaturedLimit = (isFeatured) =>
    isFeatured && !isExistingFeatured && featuredProgramCount >= 3;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === "is_featured") {
      setFeaturedError(
        wouldExceedFeaturedLimit(checked)
          ? "Only three featured programs allowed."
          : "",
      );
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : existingProgram?.image_url ?? null);
  }

  function handleGalleryImages(e) {
    const files = Array.from(e.target.files || []);
    setGalleryImages(files);
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  async function buildFormData() {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    formData.append("capacity", form.capacity);
    formData.append("is_active", form.is_active);
    formData.append("is_featured", form.is_featured);
    formData.append("activities", JSON.stringify(parseActivities(form.activities_text)));

    if (existingProgram) {
      formData.append("image_url", existingProgram.image_url || "");
      formData.append("gallery_images", JSON.stringify(existingProgram.gallery_images || []));
    }

    const schedule = form.schedule_days.map((day) => ({
      day,
      start_time: form.start_time,
      end_time: form.end_time,
    }));

    formData.append("schedule", JSON.stringify(schedule));

    if (image) {
      formData.append("image", await compressStaffImage(image));
    }

    for (const galleryImage of galleryImages) {
      formData.append("gallery_images", await compressStaffImage(galleryImage));
    }

    return formData;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (wouldExceedFeaturedLimit(form.is_featured)) {
      setFeaturedError("Only three featured programs allowed.");
      return;
    }

    try {
      await onSubmit(await buildFormData());

      if (!existingProgram) {
        setForm(BLANK_PROGRAM_FORM);
        setImage(null);
        setPreview(null);
        setGalleryImages([]);
        setGalleryPreviews([]);
      }

      setFeaturedError("");
    } catch (err) {
      setFeaturedError(err.message);
    }
  }

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <label> Title </label>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />

      <label> Description </label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <label> Location </label>
      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="e.g. Highlands Ranch Community Center"
      />

      <label> Start Date </label>
      <input
        type="date"
        name="start_date"
        value={form.start_date}
        onChange={handleChange}
      />

      <label> End Date </label>
      <input
        type="date"
        name="end_date"
        value={form.end_date}
        onChange={handleChange}
      />

      <div>
        <label>Program Days</label>
        {DAYS.map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={form.schedule_days.includes(day)}
              onChange={() => {
                setForm((prev) => ({
                  ...prev,
                  schedule_days: prev.schedule_days.includes(day)
                    ? prev.schedule_days.filter((selectedDay) => selectedDay !== day)
                    : [...prev.schedule_days, day],
                }));
              }}
            />
            {day}
          </label>
        ))}
      </div>

      <label> Start Time </label>
      <input
        type="time"
        name="start_time"
        value={form.start_time}
        onChange={handleChange}
      />

      <label> End Time </label>
      <input
        type="time"
        name="end_time"
        value={form.end_time}
        onChange={handleChange}
      />

      <label> Capacity </label>
      <input
        type="number"
        name="capacity"
        value={form.capacity}
        onChange={handleChange}
        placeholder="Capacity"
        min="0"
      />

      <label>{existingProgram ? "Program Photo" : "Main Program Photo"}</label>
      {preview && (
        <img
          className="admin-program-image-preview"
          src={programImageSrc(preview)}
          alt={existingProgram ? `${existingProgram.title} preview` : "Program preview"}
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      <label> Program Gallery Photos </label>
      {(existingProgram?.gallery_images?.length > 0 || galleryPreviews.length > 0) && (
        <div className="admin-program-gallery-preview">
          {(existingProgram?.gallery_images || []).map((galleryImage) => (
            <img
              key={galleryImage}
              src={programImageSrc(galleryImage)}
              alt={`${existingProgram.title} gallery`}
            />
          ))}
          {galleryPreviews.map((galleryPreview) => (
            <img
              key={galleryPreview}
              src={galleryPreview}
              alt={existingProgram ? `${existingProgram.title} new gallery preview` : "Program gallery preview"}
            />
          ))}
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryImages}
      />

      <label> Notes / Activities </label>
      <textarea
        name="activities_text"
        value={form.activities_text}
        onChange={handleChange}
        placeholder={"Creates a bulleted list\nOne phrase per line or comma-separated"}
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

      {onCancel ? (
        <div className="admin-edit-from-buttons">
          <button type="submit">{submitLabel}</button>
          <button type="button" onClick={onCancel}>cancel</button>
        </div>
      ) : (
        <button type="submit">{submitLabel}</button>
      )}
    </form>
  );
}
