// PUBLIC 
import { pool } from "../db/db.js";


export async function getAllEventsForMonth(month, year) {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // last day of month

  const { rows } = await pool.query(`
    SELECT *
    FROM events
    WHERE start_date <= $1
    AND end_date >= $2
    AND is_active = true
  `, [endOfMonth, startOfMonth]);

  // start_date <= end_of_range
// AND end_date >= start_of_range
  return rows;
}


