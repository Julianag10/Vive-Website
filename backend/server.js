import "./config/env.js";
import express from "express";
import cors from "cors";


// ROUTERS
import webhookRouter from "./routes/webhook.routes.js";
import checkoutRouter from "./routes/checkout.routes.js";

import adminDonationsRouter from "./routes/admin/donations.routes.js";
import adminResourcesRouter from "./routes/admin/resources.routes.js";
import adminWorkflowsRouter from "./routes/admin/workflows.routes.js";

// ---------- EXPRESS APP SETUP ----------------------------------------
const app = express(); 

const PORT = process.env.PORT || 3000;

// ---------- STRIPE WEBHOOK API -------------------------------
// must come before JSON
// wehooks needs keep req.body as the raw body so that stripes signatiure check dosent fail 
// mount webhook route(POST /webhook) as a path(webhookRouter)
// POST /webhook -> gose to webhookRouter -> router.post("/") 
// The webhook route must use express.raw() at the APP LEVEL
app.use(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookRouter
);

// ---------- MIDDLE WARE/ BODY PARSESR ----------------------------------------
app.use(express.json()); // allows backend read JSON body from requesets
app.use(express.urlencoded({ extended: true })); // allow HTML form bodies from requesrs

// ---------- LOGGIN MIDDLEWARE ------------------------------
// log every request
app.use((req, res, next) => {
  console.log("➡️ INCOMING: ", req.method, req.url);
  next();
});

// ---------- CORS CONFIG ----------------------------------------
const allowedOrigins = [
    "https://non-profit-frontend.onrender.com", // <-- your live frontend
    "http://localhost:5173",   // React dev server
    "http://localhost:3000" // <-- dev environment
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);


// ---------- API ROUTES(JSON ONLY) --------------------------------------------
// These routes must:
// - return JSON only
// - contain business logic
// - be usable by React, admin, or any client
app.use("/checkout", checkoutRouter); // reutens pure JSON

app.use("/admin/donations", adminDonationsRouter);
app.use("/admin/resources", adminResourcesRouter);
app.use("/admin/workflows", adminWorkflowsRouter);

// ---------- HEALTH API ROUTE ----------------------------------------
// checks :
// - React test endpoint
// - AWS load balancer health check later

// VISIT: http://localhost:3000/api/health

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        environment: process.env.NODE_ENV || "development",
    });
});

// ---------- START SERVER --------------------

app.listen(PORT, () => {
    console.log("🚀 Server started");
    console.log("Environment:", process.env.NODE_ENV || "development");
    console.log("Base URL:", process.env.BASE_URL);
    console.log("Listening on port:", PORT);
});
