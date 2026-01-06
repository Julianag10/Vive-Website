// PUBLIC READS + REGISTRATIONS

import express from "express";
import {
  listProgramsController,
  registerController,
} from "../controllers/programs.controller.js";

const router = express.Router();

// GET /programs
// no :id -> give me ALL progrmas (not one specific porgram)
router.get("/", listProgramsController);

// POST /programs/:id/register
// :id -> create a NEW REGISTRATION for THIS PRogram 
// creating a NEW CHILD RESPURCE (registraton) 
router.post("/:id/register", registerController);

export default router;


