// ADMIN ENDPOINT CONTROLLERS
// (HTTP → service translation for admin)

import {
  listAllPrograms,
  createProgram,
  updateProgram,
  toggleProgramActive,
} from "../../services/admin/programs.service.js";

export async function listAdminProgramsController(_req, res) {
  const programs = await listAllPrograms();
  res.json(programs);
}

export async function createProgramController(req, res) {
  const program = await createProgram(req.body);
  res.json(program);
}

export async function updateProgramController(req, res) {
  const program = await updateProgram(req.params.id, req.body);
  res.json(program);
}

export async function toggleProgramController(req, res) {
  const program = await toggleProgramActive(
    req.params.id,
    req.body.is_active
  );
  res.json(program);
}
