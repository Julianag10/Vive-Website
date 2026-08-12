import {
  emailVolunteerApplication,
  listVolunteerApplications,
} from "../../services/admin/volunteers.service.js";

export async function listVolunteerApplicationsController(_req, res) {
  try {
    const applications = await listVolunteerApplications();
    res.json(applications);
  } catch (error) {
    console.error("Failed to load volunteer applications:", error);
    res.status(500).json({ error: error.message || "Failed to load volunteer applications" });
  }
}

export async function emailVolunteerApplicationController(req, res) {
  try {
    const result = await emailVolunteerApplication(req.params.id, req.body);

    res.json({
      message: `Email sent to ${result.recipientEmail}.`,
      ...result,
    });
  } catch (error) {
    console.error("Failed to email volunteer application:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Failed to email volunteer application" });
  }
}
