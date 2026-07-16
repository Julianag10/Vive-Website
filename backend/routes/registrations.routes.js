import express from "express";
import {
  registerController,
  unregisterController,
  getRegistrationStatsController,
  lookupRegistrationController,
  lookupRegistrationsByEmailController,
} from "../controllers/registrations.controller.js";

const router = express.Router();

router.post("/:type/:id/register", registerController);
router.delete("/:type/:id/unregister", unregisterController);
router.get("/lookup", lookupRegistrationsByEmailController);
router.get("/:type/:id/registration-stats", getRegistrationStatsController);
router.get("/:type/:id/registration", lookupRegistrationController);

export default router;
