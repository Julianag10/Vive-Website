// PUBLIC ENDPOINT CONTROLLERS

import { registerForProgram } from "../services/registrations.service.js";
import {
  listActivePrograms,
  listFeaturedPrograms,
} from "../services/programs.service.js";


// LIST ACTIVE PORGRMAS (public)
// TODO why not _req any more?
export async function listProgramsController(req, res) {
  const programs = await listActivePrograms();
  res.json(programs);
}

export async function listFeaturedProgramsController(req, res) {
  // format the response
  const featuredPrograms = await listFeaturedPrograms();
  res.json(featuredPrograms);
}

// REGISTER USER FOR PROGRAM
export async function registerController(req, res) {
  const registration = await registerForProgram(
    req.params.id,
    req.body.name,
    req.body.email,
  );

  res.json(registration);
}


