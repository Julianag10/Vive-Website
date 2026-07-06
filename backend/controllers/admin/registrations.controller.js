// ADMIN
import { listRegistrationsForResource } from "../../services/admin/registrations.service.js";

export async function listRegistrationsController(req, res) {
  const registrationList = await listRegistrationsForResource(
    req.params.type,
    req.params.id
  );

  res.json(registrationList);
}