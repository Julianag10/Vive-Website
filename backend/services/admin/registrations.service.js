// ADMIN READS

import { pool } from "../../db/db.js";
import { sendAdminRegistrationMessageEmail } from "../email.service.js";

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
          events.title AS resource_title,
          events.capacity,
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
          events.title AS resource_title,
          events.capacity,
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
    SELECT
      program_registrations.id,
      program_registrations.name,
      program_registrations.email,
      program_registrations.notes,
      program_registrations.created_at,
      program_registrations.status,
      programs.title AS resource_title,
      programs.capacity
    FROM program_registrations
    JOIN programs
      ON programs.id = program_registrations.program_id
    WHERE program_registrations.program_id = $1
    ORDER BY program_registrations.created_at DESC;
    `,
    [resourceId]
  );

  return rows;
}

async function getResourceTitle(type, resourceId) {
  const table = type === "event" ? "events" : "programs";
  const { rows } = await pool.query(
    `SELECT title FROM ${table} WHERE id = $1 LIMIT 1`,
    [resourceId]
  );

  return rows[0]?.title || (type === "event" ? "Event" : "Program");
}

export async function emailRegisteredForResource(type, resourceId, { subject, message, occurrenceId = null }) {
  const { table, parentIdColumn } = getRegistrationConfig(type);
  const cleanSubject = String(subject || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanSubject || !cleanMessage) {
    const error = new Error("Subject and message are required.");
    error.status = 400;
    throw error;
  }

  const params = [resourceId];
  let occurrenceFilter = "";

  if (type === "event" && occurrenceId) {
    params.push(occurrenceId);
    occurrenceFilter = `AND event_occurrence_id = $${params.length}`;
  }

  const { rows } = await pool.query(
    `
    SELECT DISTINCT ON (LOWER(email))
      email,
      name
    FROM ${table}
    WHERE ${parentIdColumn} = $1
      ${occurrenceFilter}
      AND status = 'registered'
      AND email IS NOT NULL
      AND TRIM(email) != ''
    ORDER BY LOWER(email), created_at DESC;
    `,
    params
  );

  const resourceTitle = await getResourceTitle(type, resourceId);

  for (const registration of rows) {
    await sendAdminRegistrationMessageEmail({
      email: registration.email,
      subject: cleanSubject,
      resourceTitle,
      message: cleanMessage,
    });
  }

  return {
    sentCount: rows.length,
    resourceTitle,
  };
}

export async function emailRegistrationRecipientForResource(
  type,
  resourceId,
  registrationId,
  { subject, message }
) {
  const { table, parentIdColumn } = getRegistrationConfig(type);
  const cleanSubject = String(subject || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanSubject || !cleanMessage) {
    const error = new Error("Subject and message are required.");
    error.status = 400;
    throw error;
  }

  const { rows } = await pool.query(
    `
    SELECT
      email,
      name
    FROM ${table}
    WHERE id = $1
      AND ${parentIdColumn} = $2
      AND email IS NOT NULL
      AND TRIM(email) != ''
    LIMIT 1;
    `,
    [registrationId, resourceId]
  );

  if (!rows[0]) {
    const error = new Error("No email address found for this registration.");
    error.status = 404;
    throw error;
  }

  const resourceTitle = await getResourceTitle(type, resourceId);

  await sendAdminRegistrationMessageEmail({
    email: rows[0].email,
    subject: cleanSubject,
    resourceTitle,
    message: cleanMessage,
  });

  return {
    sentCount: 1,
    recipientEmail: rows[0].email,
    recipientName: rows[0].name,
    resourceTitle,
  };
}
