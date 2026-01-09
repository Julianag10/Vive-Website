import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
// express dose't knwo about session -> install session middle ware
// session is how server remembers accorss multiple reqs
// 1. server creates a session record
// 2. sends the browser a cookie with session id
// 3. next req, browser sends cookie back
// 4. server uses session id to load teh session data again

// ROUTERS
import webhookRouter from "./routes/webhook.routes.js";

import checkoutRouter from "./routes/checkout.routes.js";
import programsRouter from "./routes/programs.routes.js";

import adminAuthRouter from "./routes/admin/auth.routes.js";
import adminDonationsRouter from "./routes/admin/donations.routes.js";
import adminProgramsRouter from "./routes/admin/programs.routes.js";


// ---------- EXPRESS APP SETUP ----------------------------------------
const app = express(); 

// ---------- STRIPE WEBHOOK API -------------------------------
// wehooks needs keep req.body as the raw body
// JSON parsing changes teh body
// so weenbhool middleware must run before express.json()
app.use(
    "/webhook",
    express.raw({ type: "application/json" }),
    webhookRouter
);

// ---------- MIDDLE WARE/ BODY PARSESR ----------------------------------------
// app.use(function)
// middleware = fucntions that run for a req

// Middleware reads or modifies req / res

// app.use -> a hook to get attach onto reqs
// app.use(fn) without a path runs for EVERY request
app.use(express.json()); // parses JSON req into req.body
app.use(express.urlencoded({ extended: true })); // parses HTML form bodies

// attaches .session middleware that works on every req 
// req.session

// server memory (RAM): map of sessionId -> session 
// server needs to know which session the brower is using

// FOR EVERY INCOMING REQ:
// COOKIE: vive-admin-session = sessionID 
// 1. express-session reads cookie from req
// 1B. IF NO cookie = no session in RAM:
    // assigns new sessionID
    // req.session CREATES NEW empty object in RAM
// 2. looks for a session.name (vive-admin-session) in cookie 
// 3. IF cookie exits uses the sessionID to find session in RAM 
// 4. req.session ATTACHES the found session from RAM to req
// 5. prepares to send a cokie later (cookie has sessionID)
app.use(
  session({
    // cookie name 
    name: "vive-admin-session",

    // used to SIGN the SESSION COOKIE
    // SIGNING -> cookies can be tampered w/ w/out the secret
    secret: process.env.SESSION_SECRET,

    // prevents session from being saved back to the store on every req when nothing changed
    resave: false,
    saveUninitialized: false,
    cookie: {
        // prevents JS in browser from reading cookie (document.cookies cant see it)
        httpOnly: true,
        sameSite: "lax",
    },
  })
);
// ---------- LOGGIN MIDDLEWARE ------------------------------
// log every request
app.use((req, res, next) => {
    console.log("➡️ INCOMING: ", req.method, req.url);
    next();
});

// ---------- CORS CONFIG ----------------------------------------
// Allows requests from approved frontends
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
// routes are middleware  with a URL match
// middleware runs during a req before the final route handler 
// final route handler sends the response -> STOP Midlle ware
// Routes usually END the req by sending a response

// Public
app.use("/checkout", checkoutRouter); // reutens pure JSON
app.use("/programs", programsRouter);

// Admin
app.use("/admin/auth", adminAuthRouter);
app.use("/admin/api/donations", adminDonationsRouter);
app.use("/admin/api/programs", adminProgramsRouter);

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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server started");
    console.log("Environment:", process.env.NODE_ENV || "development");
    console.log("Base URL:", process.env.BASE_URL);
    console.log("Listening on port:", PORT);
});
