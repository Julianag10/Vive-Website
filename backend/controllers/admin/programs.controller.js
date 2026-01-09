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
    // service returned the row of the new prgram that was toggled
    // conteoller puts row into progrmanJS object
  const program = await toggleProgramActive(
    // bc progrma id is in req url pram
    req.params.id,
    req.body.is_active
  );

  res.json(program);
}



