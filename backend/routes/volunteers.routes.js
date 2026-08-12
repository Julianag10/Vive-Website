import express from "express";
import {
  createVolunteerApplicationController,
  getVolunteerApplicationController,
  updateVolunteerApplicationController,
  withdrawVolunteerApplicationController,
} from "../controllers/volunteers.controller.js";

const router = express.Router();

router.post("/", createVolunteerApplicationController);
router.get("/application/:token", getVolunteerApplicationController);
router.put("/application/:token", updateVolunteerApplicationController);
router.post("/application/:token/withdraw", withdrawVolunteerApplicationController);

export default router;
