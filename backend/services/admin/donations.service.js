// ADMIN READ

import { pool } from "../../db/db.js";

// ADMIN READ 
// STRIPE INDEPENDENT
export async function listDonations() {
  const { rows } = await pool.query(`
    SELECT
      id,
      amount_cents,
      currency,
      status,
      donor_email,
      created_at
    FROM donations
    ORDER BY created_at DESC;
  `);
  return rows;
}

// WHERE status != 'succeeded' → idempotent
// retrying dose nothing if already succeeded
// safe to call mulitle times 
