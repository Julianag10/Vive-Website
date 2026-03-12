// PUBLIC READS + REGISTRATIONS
// ROUTES: "Which function handles this URL?"
// CONTROLLERS: "What does this URL do?": extract data from REQ, call service, format the RES
// SERVICES: "How does this URL do what it does?", buiness logic
import express from "express";
import {
  listProgramsController,
  listFeaturedProgramsController,
  registerController,
} from "../controllers/programs.controller.js";

const router = express.Router();

// no :id -> give me ALL progrmas (not one specific porgram)
router.get("/", listProgramsController);


router.get("/featured", listFeaturedProgramsController);

// :id -> create a NEW REGISTRATION for THIS PRogram
// creating a NEW CHILD RESOURCE (registraton)
router.post("/:id/register", registerController);


export default router;

