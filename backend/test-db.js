import dotenv from "dotenv";
dotenv.config();

import { pool } from "./db/db.js";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

try {
  const res = await pool.query("SELECT NOW()");
  console.log("✅ Postgres reachable:", res.rows[0]);
} catch (err) {
  console.error("❌ Postgres NOT reachable");
  console.error("Error message:", err.message);
  console.error("Error code:", err.code);
} finally {
  process.exit();
}
