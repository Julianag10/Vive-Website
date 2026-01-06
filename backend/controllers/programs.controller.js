// PUBLIC ENDPOINT CONTROLLERS

import { listActivePrograms } from "../services/programs.service.js";
import { registerForProgram } from "../services/registrations.service.js";

// List active programs (public)
// _req
export async function listProgramsController(_req, res) {
    const programs = await listActivePrograms();
    res.json(programs);
}

// Register user for a program
export async function registerController(req, res) {
  const registration = await registerForProgram(
    req.params.id,
    req.body.name,
    req.body.email
  );

  res.json(registration);
}



