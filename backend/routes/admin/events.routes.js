// ADMIN
import express from "express";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import {
  getAllEventsController,
  getEventsForMonthController,
  postCreatedEventController, 
  putUpdatedEventController,
  patchToggledEventController,
  deleteEventController,
} from "../../controllers/admin/events.controller.js";

const router = express.Router();

router.use(requireAdmin);

router.get("/all", getAllEventsController);

router.get("/", getEventsForMonthController);

router.post("/createEvent", postCreatedEventController);

router.put("/:id", putUpdatedEventController);

router.patch("/:id/active", patchToggledEventController);

router.delete("/:id", deleteEventController);

export default router;
