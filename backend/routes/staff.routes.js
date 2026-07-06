import express from "express";
import { getStaffController } from "../controllers/staff.controller.js";
// import db from "../db/db.js";

const router = express.Router();

// GET ALL STAFF (PUBLIC)
router.get("/", getStaffController);

export default router;

