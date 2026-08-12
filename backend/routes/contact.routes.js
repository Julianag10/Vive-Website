import express from "express";
import { createContactMessageController } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", createContactMessageController);

export default router;
