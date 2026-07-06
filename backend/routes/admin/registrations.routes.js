import express from "express";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import { listRegistrationsController } from "../../controllers/admin/registrations.controller.js";

const router = express.Router();

router.use(requireAdmin);

router.get("/:type/:id", listRegistrationsController);

export default router;