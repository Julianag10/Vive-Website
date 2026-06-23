// ADMIN READS + WRITE

import { pool } from "../../db/db.js";

// LIST ALL PROGRAMS (ADMIN)
export async function listAllPrograms() {
  const { rows } = await pool.query(`
        SELECT *
        FROM programs
        ORDER BY created_at DESC;
    `);
  return rows;
}

// CREATE A NEW PROGRAM
export async function createProgram({
  title,
  description = null,
  start_date = null,
  end_date = null,
  capacity = null,
  is_active = true,
  image_url = null,
  activities = [],
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO programs (
      title, description, start_date, end_date, capacity, is_active, image_url, activities
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
    `,
    [title, description, start_date, end_date, capacity, is_active, image_url, activities],
  );
  // RETURNING * → give me the row you just created

  // Return the created program to controller
  return rows[0];
}

// UPDATE PROGRAM DETAILS
export async function updateProgram(id, data) {
  const { 
    title, 
    description, 
    start_date, 
    end_date, 
    capacity, 
    is_active, 
    image_url, 
    activities = [],
  } = data;

  const { rows } = await pool.query(
    `
    UPDATE programs
    SET
      title = $2,
      description = $3,
      start_date = $4,
      end_date = $5,
      capacity = $6,
      is_active = $7,
      image_url = $8,
      activities = $9
    WHERE id = $1
    RETURNING *;
    `,
    [id, title, description, start_date, end_date, capacity, is_active, image_url, activities],
  );

  return rows[0];
}

// ENABLE / DISABLE PROGRAM
export async function toggleProgramActive(id, isActive) {
  const { rows } = await pool.query(
    `
    UPDATE programs
    SET is_active = $2
    WHERE id = $1
    RETURNING *;
    `,
    [id, isActive],
  );

  return rows[0];
}

