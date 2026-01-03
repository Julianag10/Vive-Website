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
    createCheckoutSession,
    getCheckoutSessionStatus,
} from "../services/stripe.service.js";


// POST /checkout/create-checkout-session
export async function createCheckoutSessionController(req, res) {
    try {
        console.log("➡️ /create-checkout-session hit");
        console.log("📥 Body received:", req.body);

        const result = await createCheckoutSession(req.body);
        res.json(result);
    } catch (err) { // catches the error thown by service
        
        console.error("❌ Error creating sesion: ",  err);
        res.status(400).json({ error: err.message });
    }
}

// GET /checkout/session-status
export async function getSessionStatusController(req, res) {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ error: "session_id required" });
        }

        const status = await getCheckoutSessionStatus(session_id);
        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
