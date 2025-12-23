import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
    console.warn("⚠️ PORT not set, defaulting to 3000");
}

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ STRIPE_SECRET_KEY not set");
}

// ❗ DO NOT throw
// ❗ DO NOT exit
// ❗ DO NOT import Stripe here
