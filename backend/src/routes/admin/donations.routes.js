// file is ONLY for admin donation analytics.
// ONLY READS THE DATABASE
// GET /admin/donations  → list all donations
// GET /admin/donations/stats → charts + insights

// avoids importing the entire Express object
// only importing the one function you need (Router)
import { Router } from "express";

const router = Router();

// Admin Endpoints (READ Donations)
// GET /admin/donations → return all donations

export default router;
