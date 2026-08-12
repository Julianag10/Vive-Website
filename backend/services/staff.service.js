import { pool } from "../db/db.js";
import fs from "fs";
import path from "path";

const DEFAULT_STAFF_IMAGE_URL = "/uploads/staff/StaffPlaceHolder.png";

function staffImageExists(imageUrl) {
  if (!imageUrl || imageUrl.startsWith("http")) {
    return Boolean(imageUrl);
  }

  if (!imageUrl.startsWith("/uploads/")) {
    return false;
  }

  return fs.existsSync(path.join(process.cwd(), imageUrl.replace(/^\//, "")));
}

function withStaffImageFallback(staffMember) {
  if (staffImageExists(staffMember.image_url)) {
    return staffMember;
  }

  return {
    ...staffMember,
    image_url: DEFAULT_STAFF_IMAGE_URL,
  };
}

// GET ALL
export async function getAllStaff() {
  const result = await pool.query(
    `SELECT * FROM staff ORDER BY display_order ASC`
  );
  return result.rows.map(withStaffImageFallback);
}

// CREATE
export async function createStaff(data) {
  const { name, role, staff_group = "staff", bio, display_order, image_url } = data;

  const result = await pool.query(
    `INSERT INTO staff (name, role, staff_group, bio, display_order, image_url)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [name, role, staff_group, bio, display_order, image_url]
  );

  return result.rows[0];
}

// UPDATE
export async function updateStaff(id, data) {
  const { name, role, staff_group, bio, display_order, image_url } = data;

  const result = await pool.query(
    `UPDATE staff
     SET name = COALESCE($1,name),
         role = COALESCE($2,role),
         staff_group = COALESCE($3,staff_group),
         bio = COALESCE($4,bio),
         display_order = COALESCE($5,display_order),
         image_url = COALESCE($6,image_url)
     WHERE id = $7
     RETURNING *`,
    [name, role, staff_group, bio, display_order, image_url, id]
  );

  return result.rows[0];
}

// DELETE
export async function deleteStaff(id) {
  await pool.query(`DELETE FROM staff WHERE id = $1`, [id]);
}
