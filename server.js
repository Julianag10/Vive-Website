import express from "express";
import Stripe from "stripe";
import { engine } from "express-handlebars";
import dotenv from "dotenv";

// import email function
import { sendConfirmationEmail } from "./sendReceipt.js";

// load environment variables
dotenv.config();

// create express app/creates express server
const app = express(); 

// ---------- Stripe setup ----------
// lets your server talk to Stripe’s API (create PaymentIntents, verify webhooks, etc.)
// creats a strip client(server side)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// -----------------------------------------
// WEBHOOK ROUTE + SETUP — MUST COME BEFORE JSON
// -----------------------------------------

// express.raw({ type: "application/json" }) is middleware just for this route.
// express.raw(...) tells Express: do not parse the body into JSON yet.
// instead keep req.body as the raw body so that stripes signatiure check dosent fail 
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) =>{
  console.log("Webhook secret:", process.env.STRIPE_WEBHOOK_SECRET);

  // in stripes req is header called "stripe-signature"
  const signature = req.headers["stripe-signature"]; 

  // Need signatre to verify the event was really signed by Stripe
  let event; // will holds verified event

  // TRY BLOCK : Verifying the webhook is really from Stripe
  try{
    // stripe's helper .constructEvent() checks if signature matches what stripe expects
    // thows an error if payload(req.body) was modified
    // throws an erro if signatire is missing/wrnog
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // after TRY BLOCK, event is now a trusted, parsed Stripe event object.
  console.log("📩 Webhook Event Received:", event.type)
  // STRIPE REQ.BODY
  //  { "type": "checkout.session.completed",
  // "data": { "object": { ... checkout session ... } } }

  // handel the event
  // event.type tells you what just happened
  // checkout.session.completed is an event type checkout session finsihed and payment successful
  if (event.type === "checkout.session.completed") {
    // event.data.object is actualy thing the event is about
    // for this event.type the event is about Checkout Session object
    const session = event.data.object;
    console.log("✅ Payment completed for:", session.customer_details.email);
    // checkout session object has porperites 
    const name = session.customer_details?.name;
    const email = session.customer_details?.email;
    const amount = session.amount_total / 100; 

    console.log("🔔 Sending receipt email to:", email);

    try {
      await sendConfirmationEmail({ name, email, amount });
      console.log("✅ Email sent");
    } catch (err) {
      console.error("❌ Error sending email:", err);
    }
  }
  // sends stipe a HTTPS 200 so stripe know s the weebhook was succesully porcessed
  res.status(200).send("Received"); 
});

// -------------------------------------------------------

// ----------- Middleware -----------
//express.json() middleware automatically parses JSON request bodies into req.body.
app.use(express.json()); // lets backend read JSON from requesets

// ---------- Handlebars setup ----------
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

// ---------- Static files ----------
// serve static files in /public folder
app.use(express.static("public"));

// ---------- Logging middleware ----------
// log every request
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

// ---------- Routes ------------------------------

// Home page
app.get("/", (req, res) => {
  // "home" name of the .hbs file that will be turned into a html file 
  // then send that HTML back to the browser
  // express will look for views/donate.hbs and render it inside my layout mian.hbs
  res.render("home", {
    title: "Home",
    stylesheet: "home.css",
    stripe: true,
    donation: true
  });
});

// donate page
app.get("/donate", (req, res) => {
  res.render("donate", {
    title: "Donate",
    stylesheet: "donate.css",
    stripe: true,
    donation: true
  });
});

// complete page
app.get("/complete", (req, res) => {
  res.render("complete", {
    title: "Payment Complete",
    stylesheet: "complete.css",
    script: "complete.js",
    stripe: true,
    complete: true
  });
});


// ---------- API ENPOINTS --------------------

// publishable key to front end
app.get("/config", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY});
});

app.post("/create-checkout-session" , async (req, res) =>  {
  try {
    console.log("📥 Body received:", req.body);
    // req.body = donation info sent from your frontend
    const { priceID, amountCents} = req.body || {};

    let lineItem;

    if(priceID) {
      // donor clicked a fixed button wiht a strip price Id
      lineItem = {
        price: priceID,
        quantity: 1,
      };
    } else if (amountCents) {
      // donor type d a cousome amont
      lineItem = {
        price_data: {
          product_data: {
            name: "custom donation", 
          }, 
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
    
    // sends res back to front end 
    res.json({ clientSecret: session.client_secret });
    console.log("✅ Created session:", session.id);

  } catch (err) {
    console.error("❌ Error creating sesion: ",  err);
    res.status(500).json({ error: err.message });
  }
});

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






// -------------------- Start server --------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});