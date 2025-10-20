// server.js
import express from "express";
import Stripe from "stripe";
import cors from "cors"; //allows your frontend page to talk to this server while you’re developing
import dotenv from "dotenv";

// load environment variables
dotenv.config();

// create express app
const app = express();      // creates express server
app.use(cors());            // lets front end talk to back end
app.use(express.json());    // lets backend read JSON from requesets

// serve static files like /success.html and /cancel.html
app.use(express.static("public"));

// ---- Stripe ----
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_REPLACE_ME";
const stripe = new Stripe(STRIPE_SECRET_KEY);

// simple test route
// app.get("/", (req, res) => {
//   res.send("Server is running ✅");
// });

// health check (optional)
app.get("/ping", (req, res) => {
  res.send("Server is alive ✅");
});


// Create a Stripe Checkout Session
// Create Checkout Session
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { amount_cents = 2500, email = "test@example.com" } = req.body || {};
    console.log("➡️  create-checkout-session body:", req.body);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "link"], // Apple/Google Pay auto-appear when supported
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Donation" },
            unit_amount: amount_cents
          },
          quantity: 1
        }
      ],
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html"
    });

    console.log("✅ Stripe session:", session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Session error:", err);
    res.status(500).json({ error: err.message });
  }
});


// // allow a POST/create-checkout-session request
// // add a new POST endpoint for creating checkout sessions
// // now backend knows how to ask Stripe for a payment page.
// app.post("/api/create-checkout-session", async (req, res) => {
//   try {
//     // req.body = donation info sent from your frontend (amount + email)
//     const { amount_cents, email } = req.body; // pull data from requests

//     // calls stripes API to create a checkout session
//     // stripe.checkout.sessions.create(...) = ask Stripe to make a secure payment pag
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       payment_method_types: ["card", "link"], // Apple Pay / Google Pay included
//       customer_email: email,
//       line_items: [{
//         price_data: {
//           currency: "usd",
//           product_data: { name: "Donation" },
//           unit_amount: amount_cents, // e.g. 2500 = $25.00
//         },
//         quantity: 1,
//       }],
//       success_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//     });

//     // session is stripes response after calling the stripe API, Stripe sends back a checkout URL as a response 
//     // then server.js sends the session.url as a response to front end
//     // res.json({ url: session.url }) = respond with the checkout URL
//     res.json({ url: session.url });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




// start server
// start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});