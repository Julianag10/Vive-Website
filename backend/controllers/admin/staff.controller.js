import * as staffService from "../../services/staff.service.js";
import fs from "fs/promises";
import path from "path";

const DEFAULT_STAFF_IMAGE_URL = "/uploads/staff/StaffPlaceHolder.png";

function staffImageFilename(name) {
  const slug = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "staff-photo"}.avif`;
}

async function staffImageUrlFromUpload(file, name) {
  if (!file) {
    return undefined;
  }

  const filename = staffImageFilename(name);
  const uploadDir = path.join(process.cwd(), "uploads", "staff");
  const destinationPath = path.join(uploadDir, filename);

  if (file.path !== destinationPath) {
    await fs.rename(file.path, destinationPath);
  }

  return `/uploads/staff/${filename}`;
}

// CREATE STAFF
export async function createStaff(req, res) {
  try {
    const { name, role, staff_group, bio, display_order } = req.body;

    const image_url =
      (await staffImageUrlFromUpload(req.file, name)) || DEFAULT_STAFF_IMAGE_URL;

    const newStaff = await staffService.createStaff({
      name,
      role,
      staff_group,
      bio,
      display_order: Number(display_order), // ✅ FIX
      image_url,
    });

    res.json(newStaff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE STAFF
export async function updateStaff(req, res) {
  try {
    const { id } = req.params;
    const { name, role, staff_group, bio, display_order } = req.body;

    const image_url = await staffImageUrlFromUpload(req.file, name);

    const updateData = {
      name,
      role,
      staff_group,
      bio,
      display_order: Number(display_order),
    };
    
    if (image_url !== undefined) {
      updateData.image_url = image_url;
    }
    
    const updated = await staffService.updateStaff(id, updateData);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE STAFF
export async function deleteStaff(req, res) {
  try {
    const { id } = req.params;

    await staffService.deleteStaff(id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
