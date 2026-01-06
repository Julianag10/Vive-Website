// ADMIN READS + WRITE

import { pool } from "../../db/db.js";

// list all programs
export async function listAllPrograms() {
    const {rows} = await pool.query(`
        SELECT *
        FROM programs
        ORDER BY created_at DESC;
    `);
    return rows;
}


// Create a new program
export async function createProgram({
  title,
  description,
  start_date,
  end_date,
  capacity,
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO programs (
      title, description, start_date, end_date, capacity
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [title, description, start_date, end_date, capacity]
  );
  // RETURNING * → give me the row you just created

  // Return the created program to controller
  return rows[0];
}

// Update program details
export async function updateProgram(id, data) {
  const { title, description, start_date, end_date, capacity } = data;

  const { rows } = await pool.query(
    `
    UPDATE programs
    SET
      title = $2,
      description = $3,
      start_date = $4,
      end_date = $5,
      capacity = $6
    WHERE id = $1
    RETURNING *;
    `,
    [id, title, description, start_date, end_date, capacity]
  );

  return rows[0];
}

// Enable / disable program
export async function toggleProgramActive(id, isActive) {
  const { rows } = await pool.query(
    `
    UPDATE programs
    SET is_active = $2
    WHERE id = $1
    RETURNING *;
    `,
    [id, isActive]
  );

  return rows[0];
}

