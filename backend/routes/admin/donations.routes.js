// ADMIN READ

// avoids importing the entire Express object
// only importing the one function you need (Router)

import { Router } from "express";
import {listDonationsController} from "../../controllers/admin/donations.controller.js";

const router = Router();

// file is ONLY for admin donation analytics.
// ONLY READS THE DATABASE

// ---------- Admin Endpoints (READ Donations) ---------

// GET /admin/donations → return/list all donations from db
router.get("/", listDonationsController);


//
export default router;

