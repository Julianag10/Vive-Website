import express from "express";
import upload from "../../middleware/upload.js";
import {
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../controllers/admin/staff.controller.js";

import { requireAdmin } from "../../middleware/requireAdmin.js";

const router = express.Router();


// CREATE staff (admin)
router.post(
  "/",
  requireAdmin,
  // "image" -> react form must send a dile under the key "image"
  upload.single("image"),
  createStaff
);

// UPDATE staff (admin)
router.put(
  "/:id",
  requireAdmin,
  upload.single("image"),
  updateStaff
);

// DELETE staff (admin)
router.delete(
  "/:id",
  requireAdmin,
  deleteStaff
);

export default router;