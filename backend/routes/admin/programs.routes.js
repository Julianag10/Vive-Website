// ADMIN WRITE

import express from "express";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import upload from "../../middleware/upload.js";
import {
  listAdminProgramsController,
  createProgramController,
  updateProgramController,
  toggleProgramController,
  deleteProgramController,
} from "../../controllers/admin/programs.controller.js";

const router = express.Router();

// 🔐 Protect everything below
router.use(requireAdmin);

// GET /admin/programs
router.get("/", listAdminProgramsController);

// POST = create somthing new
// no :id -> create a NEW program
// no id yet bc the thing (url ) dosent exist yet, POST creates the thing (url)
router.post(
  "/",
  upload.any(),
  createProgramController,
);

// PUT = replcae/ update content of existing THING
// PUT /admin/programs/:id
// PUT --> replce /edit program
// :id -> update THIS progrma
router.put(
  "/:id",
  upload.any(),
  updateProgramController,
);

// PATHC = change on sepcific PROPERTY
// PATCH /admin/programs/:id/active
// :id -> change 1 field in  THIS program
router.patch("/:id/active", toggleProgramController);

router.delete("/:id", deleteProgramController);

export default router;
