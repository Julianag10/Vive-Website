// ADMIN READ

import { listDonations} from "../../services/admin/donations.service.js";

// GET /admin/donations → return/list all donations from db
export async function listDonationsController(req, res) {
    try {
        // Lists all donations
        const donations = await listDonations();
        res.json(donations);
    } catch (err) {
        console.error("❌ Error fetching donations:", err);
        res.status(500).json({ error: err.message });
    }
}

