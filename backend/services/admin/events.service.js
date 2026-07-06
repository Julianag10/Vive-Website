// ADMIN
import { pool } from "../../db/db.js";

export async function getAllEventsForMonth(month, year) {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0); // last day of month

  const { rows } = await pool.query(`
    SELECT *
    FROM events
    WHERE start_date <= $1
    AND end_date >= $2
  `, [endOfMonth, startOfMonth]);

  return rows;
}

export async function postCreatedEvent(eventData) {
  const {
    title,
    start_date,
    end_date,
    description,
    location,
    capacity,
    is_active,
    is_registerable,
  } = eventData;

  const { rows } = await pool.query(`
    INSERT INTO events (title, start_date, end_date, description, location, capacity, is_active, is_registerable)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [
    title,
    start_date,
    end_date,
    description,
    location,
    capacity ?? null,
    is_active ?? true,
    is_registerable ?? false,
  ]);

  return rows[0];
}

export async function putUpdatedEvent(id, eventData) {
  const {
    title,
    start_date,
    end_date,
    description,
    location,
    capacity,
    is_active,
    is_registerable,
  } = eventData;

  const { rows } = await pool.query(`
    UPDATE events 
    SET title = $1,
        start_date=$2, 
        end_date = $3,
        description = $4,
        location = $5,
        capacity = $6,
        is_active = $7,
        is_registerable = $8
    WHERE id = $9
    RETURNING *
  `, [
    title,
    start_date,
    end_date,
    description,
    location,
    capacity ?? null,
    is_active,
    is_registerable ?? false,
    id,
  ]);

  return rows[0];
}


export async function patchToggledEvent(id, is_active) {
  const { rows } = await pool.query(`
    UPDATE events 
    SET is_active = $1
    WHERE id = $2
    RETURNING *
  `, [is_active, id]);

  return rows[0];
}

export async function deleteEvent(id) {
  const result = await pool.query(`
    DELETE FROM events 
    WHERE id = $1
  `, [id]);

  
  return result.rowCount > 0; 
}
