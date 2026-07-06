import * as staffService from "../../services/staff.service.js";

// CREATE STAFF
export async function createStaff(req, res) {
  try {
    const { name, role, bio, display_order } = req.body;

    const image_url = req.file
      ? `/uploads/staff/${req.file.filename}`
      // ? `http://localhost:5000/uploads/staff/${req.file.filename}`
      : null;

    const newStaff = await staffService.createStaff({
      name,
      role,
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
    const { name, role, bio, display_order } = req.body;

    const image_url = req.file
      ? `/uploads/staff/${req.file.filename}`
      : undefined;

    const updateData = {
      name,
      role,
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