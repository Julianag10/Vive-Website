// ADMIN READS

import { pool } from "../../db/db.js";

// ADMIN: view registrations for ONE program
export async function listRegistrationsForProgram(programId) {
  const { rows } = await pool.query(
    `
    SELECT name, email, created_at
    FROM registrations
    WHERE program_id = $1
    ORDER BY created_at DESC;
    `,
    [programId]
  );

  return rows;
}