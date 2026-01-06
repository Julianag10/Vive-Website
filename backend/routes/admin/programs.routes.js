// ADMIN WRITE

import express from "express";
import {
  createProgramController,
  updateProgramController,
  toggleProgramController,
} from "../../controllers/admin/programs.controller.js";

const router = express.Router();

// POST = create somthing new
// no :id -> create a NEW program 
// no id yet bc the thing (url ) dosent exist yet, POST creates the thing (url)
router.post("/", createProgramController);

// PUT = replcae/ update content of existing THING
// PUT /admin/programs/:id
// PUT --> replce /edit program
// :id -> update THIS progrma 
router.put("/:id", updateProgramController);

// PATHC = change on sepcific PROPERTY 
// PATCH /admin/programs/:id/active
// :id -> change 1 field in  THIS program 
router.patch("/:id/active", toggleProgramController);

export default router;

