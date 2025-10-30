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
  // "home" name of the .hbs file that will be turned into a html file 
  // then send that HTML back to the browser
  // express will look for views/donate.hbs and render it inside my layout mian.hbs
  res.render("home", {
    title: "Home",
    stylesheet: "home.css"
  });
});

// donate page
app.get("/donate", (req, res) => {
  res.render("donate", {
    title: "Donate",
    stylesheet: "donate.css"
    // donate.js is a global script file
  });
});

// complete page
app.get("/complete", (req, res) => {
  res.render("complete", {
    title: "Payment Complete",
    stylesheet: "complete.css",
    scripts: "complete.js"
  });
});


// ---------- API ENPOINTS --------------------

// publishable key to front end
app.get("/config", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY});
});

// allow a POST /create-checkout-session request
// add a new POST endpoint for creating checkout sessions
// now backend knows how to ask Stripe for a payment page.
app.post("/create-checkout-session" , async (req, res) =>  {
  try {
    // req.body = donation info sent from your frontend
    const { priceID, amountCents, email} = req.body || {};

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
          unit_amount: amount,
        },
        quantity: 1,
      };
    } else {
        return res.status(400).json({ error: "Must provide priceId or amount" });
    }

    // calls stripes API to create a checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "custom",
      customer_email: email,
      billing_address_collection: 'auto',
      line_items: [lineItem],
      mode: "payment",
      // Stripe returns the session object (session.id, session.url, ect. )
      return_url: `http://localhost:3000/complete.html?session_id={CHECKOUT_SESSION_ID}`,
      // success_url: "http://localhost:3000/success.html",
      // cancel_url: "http://localhost:3000/cancel.html",
    });
    
    // sends res back to front end 
    res.json({ clientSecret: session.client_secret });
    console.log("✅ Created session:", session.id);
  } catch (err) {
    console.error("❌ Error creating sesion: ",  err);
    res.status(500).json({ error: err.message });
  }

});

// final truth check 
// since my broweser can talk to stripes secret API directly , server must do it and report bakc a safe summary
// the browser needs to knwo if the donation succeeeded, right now only stripe knows. and only server wuth the secret key can securley cas stripe for the real ressult
app.get("/session-status", async (req, res) => {
  // stripe.checkout.sessions.retrieve(...) server calls stripes APU using secret key(already configured in stripe client) to fetch the checkout session object for that session id
  const session = await stripe.checkout.sessions.retrieve(
    // req.query.session_id reads the session_is query param from teh URL 
    req.query.session_id,
    // expand: ["payment_intent"]sesion.paymetn_intetn woudljust be an ID string
    // exand tells stripe "inline the fill Payment INtent objecgt right in teh response"
    {expand: ["payment_intent"]}
  );

  res.json({
    status: session.status,
    payment_status: session.payment_status,
    payment_intent_id: session.payment_intent.id,
    payment_intent_status: session.payment_intent.status
  });

});



// app.post('/create-payment-intent', async(req,res) => {
//   try{
//     const { amount } = req.body; // from donation.js

//     // calls strip backend API with secrete key
//     // sends stripeAPI  payments.Inetns/create()
//     // paymentInents object lives on stripe servers, i get its id  and client scetr  back in my server
//     // creates a pi object
//     const pi = await stripe.paymentIntents.create({
//       amount, 
//       currency: 'usd',
//       // lets stripe decide the best payment methods
//       automatic_payment_methods: {enabled: true}
//     });

//     // sends a json response back to client 
//     res.json({
//       // payment inetnt id
//       clientSecret: pi.client_secret,
//       publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
//     })
//   } catch (e) { // if strip throws an error( like invalid currency), 
//     // cathces erros and sends an error response
//     res.status(400).json({error: e.message });
//   }
// })


// -------------------- Start server --------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});