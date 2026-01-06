// PUBLIC READ

import { pool } from "../db/db.js";

// Public: list active programs
export async function listActivePrograms() {
  const { rows } = await pool.query(`
    SELECT *
    FROM programs
    WHERE is_active = true
    ORDER BY created_at DESC;
  `);

  return rows;
}
