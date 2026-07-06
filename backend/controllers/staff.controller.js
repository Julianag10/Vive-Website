import * as staffService from "../services/staff.service.js";

// GET ALL STAFF (PUBLIC)
export async function getStaffController(req, res) {
  try {
    const staff = await staffService.getAllStaff();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
