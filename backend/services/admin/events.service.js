// ADMIN
import { pool } from "../../db/db.js";

async function replaceEventOccurrences(client, eventId, occurrences = []) {
  const retainedOccurrenceIds = [];

  for (const occurrence of occurrences) {
    if (occurrence.id) {
      const { rows } = await client.query(
        `
        UPDATE event_occurrences
        SET occurrence_date = $3,
            start_time = $4,
            end_time = $5
        WHERE id = $1 AND event_id = $2
        RETURNING id
        `,
        [occurrence.id, eventId, occurrence.date, occurrence.start_time, occurrence.end_time],
      );

      if (rows[0]) {
        retainedOccurrenceIds.push(rows[0].id);
        continue;
      }
    }

    const { rows } = await client.query(
      `
      INSERT INTO event_occurrences (event_id, occurrence_date, start_time, end_time)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [eventId, occurrence.date, occurrence.start_time, occurrence.end_time],
    );

    retainedOccurrenceIds.push(rows[0].id);
  }

  if (retainedOccurrenceIds.length > 0) {
    await client.query(
      "DELETE FROM event_occurrences WHERE event_id = $1 AND NOT (id = ANY($2::uuid[]))",
      [eventId, retainedOccurrenceIds]
    );
  } else {
    await client.query("DELETE FROM event_occurrences WHERE event_id = $1", [eventId]);
  }
}

function eventSelectSql(whereClause) {
  return `
    SELECT
      events.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', event_occurrences.id,
            'event_id', event_occurrences.event_id,
            'occurrence_date', event_occurrences.occurrence_date,
            'start_time', event_occurrences.start_time,
            'end_time', event_occurrences.end_time
          )
          ORDER BY event_occurrences.occurrence_date, event_occurrences.start_time
        ) FILTER (WHERE event_occurrences.id IS NOT NULL),
        '[]'
      ) AS occurrences
    FROM events
    LEFT JOIN event_occurrences
      ON event_occurrences.event_id = events.id
    ${whereClause}
    GROUP BY events.id
  `;
}

export async function getAllEventsForMonth(month, year) {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // last day of month

  const { rows } = await pool.query(`
    ${eventSelectSql(`
    WHERE (
      events.start_date <= $1
      AND events.end_date >= $2
    )
    OR event_occurrences.occurrence_date BETWEEN $2::date AND $1::date
    `)}
    ORDER BY events.start_date ASC
  `, [endOfMonth, startOfMonth]);

  return rows;
}

async function getAdminEventById(client, id) {
  const { rows } = await client.query(`
    ${eventSelectSql("WHERE events.id = $1")}
    LIMIT 1
  `, [id]);

  return rows[0];
}

export async function postCreatedEvent(eventData) {
  const {
    title,
    start_date,
    end_date,
    description,
    location,
    color,
    notes = [],
    capacity,
    is_active,
    is_registerable,
    occurrences = [],
  } = eventData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(`
      INSERT INTO events (title, start_date, end_date, description, location, color, notes, capacity, is_active, is_registerable)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      title,
      start_date,
      end_date,
      description,
      location,
      color || "#f0c15d",
      notes,
      is_registerable ? capacity ?? null : null,
      is_active ?? true,
      is_registerable ?? false,
    ]);

    await replaceEventOccurrences(client, rows[0].id, occurrences);

    const event = await getAdminEventById(client, rows[0].id);
    await client.query("COMMIT");

    return event;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function putUpdatedEvent(id, eventData) {
  const {
    title,
    start_date,
    end_date,
    description,
    location,
    color,
    notes = [],
    capacity,
    is_active,
    is_registerable,
    occurrences = [],
  } = eventData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      UPDATE events
      SET title = $1,
          start_date=$2,
          end_date = $3,
          description = $4,
          location = $5,
          color = $6,
          notes = $7,
          capacity = $8,
          is_active = $9,
          is_registerable = $10
      WHERE id = $11
    `, [
      title,
      start_date,
      end_date,
      description,
      location,
      color || "#f0c15d",
      notes,
      is_registerable ? capacity ?? null : null,
      is_active,
      is_registerable ?? false,
      id,
    ]);

    await replaceEventOccurrences(client, id, occurrences);

    const event = await getAdminEventById(client, id);
    await client.query("COMMIT");

    return event;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/*
export async function getAllEventsForMonth_old(month, year) {
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
*/


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
