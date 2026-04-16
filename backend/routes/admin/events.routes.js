// ADMIN
import express from "express";
import {
  getEventsForMonthController,
  postCreatedEventController, 
  putUpdatedEventController,
  patchToggledEventController,
  deleteEventController,
} from "../controllers/admin/events.controller.js";

const router = express.Router();

router.get("/", getEventsForMonthController);

router.post("/createEvent", postCreatedEventController);

router.put(`/${id}`, putUpdatedEventController);

router.patch(`/${id}/active`, patchToggledEventController);

router.delete(`/${id}`, deleteEventController);