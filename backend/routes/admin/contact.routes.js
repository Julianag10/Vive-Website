import { Router } from "express";
import {
  emailContactMessageController,
  listContactMessagesController,
} from "../../controllers/admin/contact.controller.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";

const router = Router();

router.use(requireAdmin);

router.post("/:id/email", emailContactMessageController);
router.get("/", listContactMessagesController);

export default router;
