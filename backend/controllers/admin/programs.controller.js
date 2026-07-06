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
  try {
    const program = await createProgram(req.body);
    res.json(program);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateProgramController(req, res) {
  try {
    const program = await updateProgram(req.params.id, req.body);
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
