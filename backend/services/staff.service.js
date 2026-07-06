import { pool } from "../db/db.js";

// GET ALL
export async function getAllStaff() {
  const result = await pool.query(
    `SELECT * FROM staff ORDER BY display_order ASC`
  );
  return result.rows;
}

// CREATE
export async function createStaff(data) {
  const { name, role, bio, display_order, image_url } = data;

  const result = await pool.query(
    `INSERT INTO staff (name, role, bio, display_order, image_url)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [name, role, bio, display_order, image_url]
  );

  return result.rows[0];
}

// UPDATE
export async function updateStaff(id, data) {
  const { name, role, bio, display_order, image_url } = data;

  const result = await pool.query(
    `UPDATE staff
     SET name = COALESCE($1,name),
         role = COALESCE($2,role),
         bio = COALESCE($3,bio),
         display_order = COALESCE($4,display_order),
         image_url = COALESCE($5,image_url)
     WHERE id = $6
     RETURNING *`,
    [name, role, bio, display_order, image_url, id]
  );

  return result.rows[0];
}

// DELETE
export async function deleteStaff(id) {
  await pool.query(`DELETE FROM staff WHERE id = $1`, [id]);
}