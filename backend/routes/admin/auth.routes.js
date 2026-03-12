import express from "express";
import {
    loginController,
    logoutController,
    meController,
} from "../../controllers/admin/auth.controller.js";

const router = express.Router();

// POST /admin/auth/login
router.post("/login", loginController);

// POST /admin/auth/logout
router.post("/logout", logoutController);

// GET /admin/auth/me
router.get("/me", meController);

export default router;

