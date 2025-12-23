import { db } from "../../db/db.js";

// READ all donations
export async function getAllDonations() {
  return db.any(`
    SELECT *
    FROM donations
    ORDER BY created_at DESC
  `);
}

// READ donation stats
export async function getDonationStats() {
  return db.one(`
    SELECT
      COUNT(*) AS total_count,
      SUM(amount) AS total_amount
    FROM donations
  `);
}
