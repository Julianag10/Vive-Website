// ADMIN 
import { listRegistrationsForProgram } from "../../services/admin/registrations.service.js";

export async function listProgramRegistrationsController(req, res) {
  const registrationList = await listRegistrationsForProgram(req.params.id);
  res.json(registrationList);
}