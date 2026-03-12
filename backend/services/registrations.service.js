// PUBLIC WRITE

import { pool } from "../db/db.js";

export async function registerForProgram(programId, name, email) {
  const { rows } = await pool.query(
    `
    INSERT INTO registrations (program_id, name, email)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,

    // programId -> bc cannot register for non-existent program
    [programId, name, email]
  );

  return rows[0];
}

