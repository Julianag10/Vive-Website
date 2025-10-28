// server.js
import express from "express";
import Stripe from "stripe";
import { engine } from "express-handlebars";

import dotenv from "dotenv";

// load environment variables
dotenv.config();

// create express app
const app = express(); // creates express server
//express.json() middleware automatically parses JSON request bodies into req.body.
app.use(express.json()); // lets backend read JSON from requesets

// ---------- Handlebars setup ----------
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

// ---------- Static files ----------
// serve static files in /public (index.html, success.html, cancel.html)
app.use(express.static("public"));

// ---------- Stripe setup ----------
// lets your server talk to Stripe’s API (create PaymentIntents, verify webhooks, etc.)
// creats a strip client(server side)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------- Logging middleware ----------
// log every request
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});


// ---------- Routes ------------------------------

// Home page
app.get("/", (req, res) => {
  res.render("home", { title: "Welcome to Vive" });
});

// donate page
app.get("/donate", (req, res) => {
  //tells express/handelbard to render view.donate.hbs inside main,hbs
  res.render("donate", { 
    title: "Donate - Vive" ,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

// Success page (hbs or html, your choice)
// app.get("/success", (req, res) => {
//   res.render("success", { title: "Donation Successful" });
// });

// Cancel page
// app.get("/cancel", (req, res) => {
//   res.render("cancel", { title: "Donation Canceled" });
// });



// ---------- Stripe Checkout Session --------------------

// allow a POST/create-checkout-session request
// add a new POST endpoint for creating checkout sessions
// now backend knows how to ask Stripe for a payment page.
// app.post("/api/create-checkout-session", async (req, res) => {
//   try {
//     // req.body = donation info sent from your frontend
//     const { amount_cents = 2500, email = "test@example.com" } = req.body || {};
//     console.log("➡️ Body:", req.body);

//     // create checkout session
//     // calls stripes API to create a checkout session
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       payment_method_types: ["card", "link"],
//       customer_email: email,
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: "Donation" },
//             unit_amount: amount_cents,
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: "http://localhost:3000/success.html",
//       cancel_url: "http://localhost:3000/cancel.html",
//     });

//     // session is stripes response after calling the stripe API, Stripe sends back a checkout URL as a response 
//     // then server.js sends the session.url as a response to front end
//     // res.json({ url: session.url }) = respond with the checkout URL
//     console.log("✅ Created session:", session.id);
//     res.json({ url: session.url });
//   } catch (err) {
//     console.error("❌ Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


app.post('/create-payment-intent', async(req,res) => {
  try{
    const { amount } = req.body; // from donation.js

    // calls strip backend API with secrete key
    // sends stripeAPI  payments.Inetns/create()
    // paymentInents object lives on stripe servers, i get its id  and client scetr  back in my server
    // creates a pi object
    const pi = await stripe.paymentIntents.create({
      amount, 
      currency: 'usd',
      // lets stripe decide the best payment methods
      automatic_payment_methods: {enabled: true}
    });

    // sends a json response back to client 
    res.json({
      // payment inetnt id
      clientSecret: pi.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
  } catch (e) { // if strip throws an error( like invalid currency), 
    // cathces erros and sends an error response
    res.status(400).json({error: e.message });
  }
})


// -------------------- Start server --------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});