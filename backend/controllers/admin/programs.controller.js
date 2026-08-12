// ADMIN ENDPOINT CONTROLLERS
// (HTTP → service translation for admin)

import path from "path";

import {
  listAllPrograms,
  createProgram,
  updateProgram,
  toggleProgramActive,
  deleteProgram,
} from "../../services/admin/programs.service.js";

function parseBoolean(value) {
  return value === true || value === "true";
}

function parseNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}

function parseActivities(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseGalleryImages(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function filesForField(req, fieldName) {
  if (Array.isArray(req.files)) {
    return req.files.filter((file) => file.fieldname === fieldName);
  }

  return req.files?.[fieldName] || [];
}

function uploadUrlFromFile(file) {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const relativePath = path.relative(uploadsDir, file.path).split(path.sep).join("/");

  return `/uploads/${relativePath}`;
}

// HELPER FuNCTION - schedule parser
function parseSchedule(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function programDataFromRequest(req) {
  const mainImage = filesForField(req, "image")[0];
  const uploadedGalleryImages = filesForField(req, "gallery_images");

  const image_url = mainImage
    ? uploadUrlFromFile(mainImage)
    : req.body.image_url || null;

  const gallery_images = [
    ...parseGalleryImages(req.body.gallery_images),
    ...uploadedGalleryImages.map((file) => uploadUrlFromFile(file)),
  ];

  return {
    title: req.body.title,
    description: req.body.description || null,
    location: req.body.location || null,
    start_date: req.body.start_date || null,
    end_date: req.body.end_date || null,
    capacity: parseNumber(req.body.capacity),
    is_active: parseBoolean(req.body.is_active),
    is_featured: parseBoolean(req.body.is_featured),
    image_url,
    gallery_images,
    activities: parseActivities(req.body.activities),

    schedule: parseSchedule(req.body.schedule),
  };
}

export async function listAdminProgramsController(_req, res) {
  const programs = await listAllPrograms();
  res.json(programs);
}

export async function createProgramController(req, res) {
  try {
    const program = await createProgram(programDataFromRequest(req));
    res.json(program);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateProgramController(req, res) {
  try {
    const program = await updateProgram(req.params.id, programDataFromRequest(req));
    res.json(program);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function toggleProgramController(req, res) {
  // service returned the row of the new prgram that was toggled
  // conteoller puts row into progrmanJS object
  const program = await toggleProgramActive(
    req.params.id,
    req.body.is_active,
  );

  res.json(program);
}

export async function deleteProgramController(req, res) {
  try {
    const deleted = await deleteProgram(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete program:", error);
    res.status(500).json({ error: "Failed to delete program" });
  }
}
