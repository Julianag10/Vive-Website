// ADMIN READ

// avoids importing the entire Express object
// only importing the one function you need (Router)

import { Router } from "express";
import {listDonationsController} from "../../controllers/admin/donations.controller.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";

const router = Router();


// 🔐 Protect everything below
router.use(requireAdmin);

// ---------- Admin Endpoints (READ Donations) ---------

// GET /admin/donations → return/list all donations from db
router.get("/", listDonationsController);


//
export default router;

