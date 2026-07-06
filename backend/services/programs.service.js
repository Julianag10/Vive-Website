// PUBLIC READ

import { pool } from "../db/db.js";

// LIST ACTIVE PROGRAMS
export async function listActivePrograms() {
  const { rows } = await pool.query(`
    SELECT *
    FROM programs
    WHERE is_active = true
    ORDER BY created_at DESC;
  `);

  return rows;
}

// FRONTEND calls/api/programs?featured=true
// LIST FEATURED PROGRAMS:
export async function listFeaturedPrograms() {
  const { rows } = await pool.query(`
    SELECT *
    FROM programs
    WHERE is_active = true
    AND is_featured = true
    ORDER BY created_at DESC
    LIMIT 3;
  `);

  // returns all rows that were quried 
  return rows;
}

export async function getProgramById(id)  {
  const { rows } = await pool.query(
    `
    SELECT * 
    FROM programs 
    WHERE id = $1 
    AND is_active = true 
    LIMIT 1;
    `, 
    [id],
  );

  return rows[0] || null;
}
