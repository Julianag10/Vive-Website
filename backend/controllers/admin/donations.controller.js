// ADMIN READ

import { listDonations} from "../../services/admin/donations.service.js";

// GET /admin/donations → return/list all donations from db
export async function listDonationsController(_req, res) {
    try {
        // Lists all donations
        const donations = await listDonations();

        // IN EXPRESS: res.json(donations); -> sends JSON
        // Sends an HTTP response as a JSON object to the client
        res.json(donations);
    } catch (err) {
        console.error("❌ Error fetching donations:", err);
        res.status(500).json({ error: err.message });
    }
}

