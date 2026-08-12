import express from "express";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import {
  emailRegistrationRecipientController,
  emailRegisteredController,
  listRegistrationsController,
} from "../../controllers/admin/registrations.controller.js";

const router = express.Router();

router.use(requireAdmin);

router.post("/:type/:id/email-all", emailRegisteredController);
router.post("/:type/:id/email/:registrationId", emailRegistrationRecipientController);
router.get("/:type/:id", listRegistrationsController);

export default router;
