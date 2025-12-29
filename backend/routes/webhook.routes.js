import express from "express";
import { Router } from "express";
import { handleStripeWebhook } from "../controllers/webhook.controller.js";


// router is a mini express app
// "routers" handels a subset of routes
const router = Router();

// ---------------- STRIPE WEBHOOK ENDPOINT----------------------------------
// express.raw({ type: "application/json" }) is middleware just for this route.
// express.raw(...) tells Express: do not parse the body into JSON yet.
// instead keep req.body as the raw body so that stripes signatiure check dosent fail 
router.post("/", express.raw({ type: "application/json" }), handleStripeWebhook );
    

export default router;


