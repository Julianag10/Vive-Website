// contains ONLY server-side logic.
import { Router } from "express";

import {
    getCheckoutConfig,
    createCheckoutSessionController,
    getSessionStatusController,
} from "../controllers/checkout.controller.js";

const router = Router();

// ---------- STRIPE API ENPOINTS --------------------

// SEND Stripe publishable key to frontend
// GET /checkout/config
router.get("/config", getCheckoutConfig);


// CREATE Stripe checkout session
// POST /checkout/create-checkout-session
router.post("/create-checkout-session", createCheckoutSessionController);
// router.post("/create-checkout-session", (req, res, next) => {
//     console.log("🟡 ROUTE HIT: /checkout/create-checkout-session");
//     next();
// }, createCheckoutSessionController);
// Now the route:
// - Defines URL
// - Calls controller

// CHECK session + payment status
// GET /checkout/session-status
// CONFIRMS PAYMENT STATUS, SESSION STATUS 
// since my broweser can talk to stripes secret API directly , server must do it and report bakc a safe summary
// the browser needs to knwo if the donation succeeeded, right now only stripe knows. and only server wuth the secret key can securley cas stripe for the real ressult
router.get("/session-status", getSessionStatusController );


export default router;