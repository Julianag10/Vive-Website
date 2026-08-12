import { Router } from "express";
import {
  emailVolunteerApplicationController,
  listVolunteerApplicationsController,
} from "../../controllers/admin/volunteers.controller.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";

const router = Router();

router.use(requireAdmin);

router.post("/:id/email", emailVolunteerApplicationController);
router.get("/", listVolunteerApplicationsController);

export default router;
