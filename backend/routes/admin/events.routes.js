// ADMIN
import express from "express";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import {
  getEventsForMonthController,
  postCreatedEventController, 
  putUpdatedEventController,
  patchToggledEventController,
  deleteEventController,
} from "../../controllers/admin/events.controller.js";

const router = express.Router();

router.use(requireAdmin);

router.get("/", getEventsForMonthController);

router.post("/createEvent", postCreatedEventController);

router.put("/:id", putUpdatedEventController);

router.patch("/:id/active", patchToggledEventController);

router.delete("/:id", deleteEventController);

export default router;
