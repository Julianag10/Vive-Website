// PUBLIC READS + REGISTRATIONS
// ROUTES: "Which function handles this URL?"
// CONTROLLERS: "What does this URL do?": extract data from REQ, call service, format the RES
// SERVICES: "How does this URL do what it does?", buiness logic
import express from "express";
import {
  listProgramsController,
  listFeaturedProgramsController,
  getProgramByIdController,
} from "../controllers/programs.controller.js";

const router = express.Router();

// no :id -> give me ALL progrmas (not one specific porgram)
router.get("/", listProgramsController);


router.get("/featured", listFeaturedProgramsController);

router.get("/:id", getProgramByIdController);
export default router;

