// PUBLIC
import express from "express";
import {getEventsForMonthController} from "../controllers/events.controller.js";

const router = express.Router();

router.get("/", getEventsForMonthController);

export default router;
