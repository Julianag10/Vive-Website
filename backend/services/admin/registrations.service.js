// ADMIN READS

import { pool } from "../../db/db.js";

const REGISTRATION_TABLES = {
  program: {
    table: "program_registrations",
    parentIdColumn: "program_id",
  },
  event: {
    table: "event_registrations",
    parentIdColumn: "event_id",
  },
};

function getRegistrationConfig(type) {
  const config = REGISTRATION_TABLES[type];

  if (!config) {
    throw new Error(`Unsupported registration type: ${type}`);
  }

  return config;
}

export async function listRegistrationsForResource(type, resourceId) {
  const { table, parentIdColumn } = getRegistrationConfig(type);

  if (type === "event") {
    const { rows } = await pool.query(
      `
      WITH occurrence_registration_rows AS (
        SELECT
          event_registrations.id,
          event_registrations.name,
          event_registrations.email,
          event_registrations.notes,
          event_registrations.created_at,
          event_registrations.status,
          event_occurrences.id AS event_occurrence_id,
          event_occurrences.occurrence_date,
          event_occurrences.start_time,
          event_occurrences.end_time,
          events.start_date AS event_start_date,
          events.end_date AS event_end_date
        FROM event_occurrences
        JOIN events
          ON events.id = event_occurrences.event_id
        LEFT JOIN event_registrations
          ON event_registrations.event_occurrence_id = event_occurrences.id
        WHERE event_occurrences.event_id = $1
      ),
      unassigned_registration_rows AS (
        SELECT
          event_registrations.id,
          event_registrations.name,
          event_registrations.email,
          event_registrations.notes,
          event_registrations.created_at,
          event_registrations.status,
          event_registrations.event_occurrence_id,
          NULL::date AS occurrence_date,
          NULL::time AS start_time,
          NULL::time AS end_time,
          events.start_date AS event_start_date,
          events.end_date AS event_end_date
        FROM event_registrations
        JOIN events
          ON events.id = event_registrations.event_id
        WHERE event_registrations.event_id = $1
          AND event_registrations.event_occurrence_id IS NULL
      )
      SELECT
        *
      FROM occurrence_registration_rows
      UNION ALL
      SELECT
        *
      FROM unassigned_registration_rows
      ORDER BY
        occurrence_date ASC NULLS LAST,
        start_time ASC NULLS LAST,
        created_at DESC NULLS LAST;
      `,
      [resourceId]
    );

    return rows;
  }

  const { rows } = await pool.query(
    `
    SELECT id, name, email, notes, created_at, status
    FROM ${table}
    WHERE ${parentIdColumn} = $1
    ORDER BY created_at DESC;
    `,
    [resourceId]
  );

  return rows;
}
