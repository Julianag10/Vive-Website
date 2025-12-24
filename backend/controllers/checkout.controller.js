// routes → define API endpoints
// controllers → return JSON
// React → consumes JSON

// Controllers translate:
// HTTP → business logic → HTTP

// Controller responsibilities:
// - Reads req.body
// - Handles errors
// - Sends JSON

import { 
    // getStripeConfig, 
    createCheckoutSession,
    getCheckoutSessionStatus,
} from "../services/stripe.service.js";

// GET /checkout/config
// export function getCheckoutConfig(req, res) {
//     res.json(getStripeConfig());
// }

// POST /checkout/create-checkout-session
export async function createCheckoutSessionController(req, res) {
    try {
        console.log("➡️ /create-checkout-session hit");
        console.log("📥 Body received:", req.body);

        const result = await createCheckoutSession(req.body);
        res.json(result);
    } catch (err) {
        console.error("❌ Error creating sesion: ",  err);
        res.status(400).json({ error: err.message });
    }
}

// GET /checkout/session-status
export async function getSessionStatusController(req, res) {
    try {
        const { session_id } = req.query;
        // const session_id  = req.query.session_id;

        if (!session_id) {
            return res.status(400).json({ error: "session_id required" });
        }

        const status = await getCheckoutSessionStatus(session_id);
        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}