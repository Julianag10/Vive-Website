// server.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

// load environment variables
dotenv.config();

// create express app
const app = express(); // creates express server
app.use(express.json()); // lets backend read JSON from requesets

// log every request
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

// serve static files in /public (index.html, success.html, cancel.html)
app.use(express.static("public"));

// simple test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Stripe setup
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_REPLACE_ME";
const stripe = new Stripe(STRIPE_SECRET_KEY);


// allow a POST/create-checkout-session request
// add a new POST endpoint for creating checkout sessions
// now backend knows how to ask Stripe for a payment page.
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    // req.body = donation info sent from your frontend
    const { amount_cents = 2500, email = "test@example.com" } = req.body || {};
    console.log("➡️ Body:", req.body);

    // create checkout session
    // calls stripes API to create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "link"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Donation" },
            unit_amount: amount_cents,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html",
    });

    // session is stripes response after calling the stripe API, Stripe sends back a checkout URL as a response 
    // then server.js sends the session.url as a response to front end
    // res.json({ url: session.url }) = respond with the checkout URL
    console.log("✅ Created session:", session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
