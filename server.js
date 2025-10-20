// server.js
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

// load environment variables
dotenv.config();

// create express app
const app = express();
app.use(cors());            // lets front end talk to back end
app.use(express.json());    // lets backend read JSON from requesets

// connect to Stripe with your secret key (from Stripe Dashboard → Developers → API keys)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// simple test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// POST endpoint fro creating checkout sessions
// allow a POST/create-checkout-session request
// add a new POST endpoint for creating checkout sessions
// now backend knows how to ask Stripe for a payment page.
// create a checkout session
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    // req.body = donation info sent from your frontend (amount + email)
    const { amount_cents, email } = req.body; // pull data from requests

    // stripe.checkout.sessions.create(...) = ask Stripe to make a secure payment pag
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "link"], // Apple Pay / Google Pay included
      customer_email: email,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Donation" },
          unit_amount: amount_cents, // e.g. 2500 = $25.00
        },
        quantity: 1,
      }],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    // session is the response after callling the stripe API, Stripe sends back a checkout URL as a response 
    // then server.js sends the session.url as a response to front end
    // res.json({ url: session.url }) = respond with the checkout URL
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//API

// mretrive order