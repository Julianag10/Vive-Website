import express from "express";
import Stripe from "stripe";
import { engine } from "express-handlebars";
import dotenv from "dotenv";
import path from "path"; // builds safe file paths 
import { fileURLToPath } from "url"; // used to recreate __dirname
// import webhook router
import webhookRouter from "./routes/webhook.js";


// load environment variables
dotenv.config();

// ---------- EXPRESS SETUP ----------------------------------------
// create express app/server
const app = express(); 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- STRIPE SETUP ----------------------------------------
// Creates Stripe API client using your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------- WEBHOOK ROUTER -------------------------------
// must come before JSON
// wehooks needs keep req.body as the raw body so that stripes signatiure check dosent fail 
// mount webhook route(POST /webhook) as a path(webhookRouter)
// POST /webhook -> gose to webhookRouter -> router.post("/") 
app.use("/webhook", webhookRouter);

// ---------- NORMAL MIDDLEWARE -------------------------------
// express.json() middleware automatically parses JSON request bodies into req.body.
app.use(express.json()); // allows backend read JSON body from requesets
app.use(express.urlencoded({ extended: true })); // allow HTML form bodies from requesrs
app.use(express.static(path.join(__dirname, "public"))); // serve static files in /public folder

// ---------- HANDELBARS VIEW ENGINE --------------------
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
// path.join(__dirname, "views") == ./Vview folder
app.set("views", path.join(__dirname, "views"));

// ---------- LOGGIN MIDDLEWARE ------------------------------
// log every request
app.use((req, res, next) => {
  console.log("➡️ ", req.method, req.url);
  next();
});

// ---------- PAGE ROUTES ----------------------------------------
// HOME PAGE
app.get("/", (req, res) => {
  // "home" name of .hbs file that will turn into .html file 
  // then send that HTML back to the browser
  // express looks for views/donate.hbs and renders it inside main.hbs {{{body}}}
  res.render("home", {
    title: "Home",
    stylesheet: "home.css",
    donation: true
  });
});

// DONATE PAGE
app.get("/donate", (req, res) => {
  res.render("donate", {
    title: "Donate",
    stylesheet: "donate.css",
    donation: true
  });
});

// COMPLETE PAGE
app.get("/complete", (req, res) => {
  res.render("complete", {
    title: "Payment Complete",
    stylesheet: "complete.css",
    script: "complete.js",
  });
});

// ---------- STRIPE API ENPOINTS --------------------

// SEND publishable key to frontend
app.get("/config", (req, res) => {
  res.json({ 
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

// CREATE CHECKOUT SESSION
app.post("/create-checkout-session" , async (req, res) =>  {
  try {
    console.log("📥 Body received:", req.body);
    // req.body = donation info sent from your frontend
    const { priceID, amountCents} = req.body || {};

    let lineItem;

    if(priceID) {
      lineItem = { price: priceID, quantity: 1};
    } else if (amountCents) {
      lineItem = {
        price_data: {
          product_data: { name: "custom donation" }, 
          currency: "USD",
          unit_amount: amountCents,
        },
        quantity: 1,
      };
    } else {
        return res.status(400).json({ error: "Must provide priceId or amount" });
    }

    // calls stripes API to create a checkout session object on stripes servers
    // strip automatically links a paymetn inetnt
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      ui_mode: "custom",
      billing_address_collection: 'auto',
      line_items: [lineItem],
      mode: "payment",
      return_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
    });
    
    // sends res back to frontend 
    res.json({ clientSecret: session.client_secret });
    console.log("✅ Created session:", session.id);

  } catch (err) {
    console.error("❌ Error creating sesion: ",  err);
    res.status(500).json({ error: err.message });
  }
});

// CONFIRMS PAYMENT STATUS, SESSION STATUS 
// since my broweser can talk to stripes secret API directly , server must do it and report bakc a safe summary
// the browser needs to knwo if the donation succeeeded, right now only stripe knows. and only server wuth the secret key can securley cas stripe for the real ressult
app.get("/session-status", async (req, res) => {
  // stripe.checkout.sessions.retrieve(...) server calls stripes APU using secret key(already configured in stripe client) to fetch the checkout session object for that session id
  const session = await stripe.checkout.sessions.retrieve(
    // req.query.session_id reads the session_id query param from the URL 
    // req query param is set in complete.js
    req.query.session_id,
    // expand: ["payment_intent"]sesion.paymetn_intetn woudljust be an ID string
    // exand tells stripe "inline the fill Payment INtent objecgt right in teh response"
    {expand: ["payment_intent"]}
  );

  res.json({
    // status of the checkoutsession
    status: session.status,
    // paymentStatus Only present when session.type=complete
    // session.type=complete -> (Checkout Session is complete. Payment processing may still be in progres)
    payment_status: session.payment_status, // shoudlnt this be diffrent
    // payment_status: session.paymentStatus,
    payment_intent_id: session.payment_intent.id,
    payment_intent_status: session.payment_intent.status // STATUS OF THE PAYMENT INTETN
  });
});

// ---------- START SERVER --------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});