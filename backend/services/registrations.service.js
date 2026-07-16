// PUBLIC WRITE

import { pool } from "../db/db.js";
import { sendEmail } from "./email.service.js";

const REGISTRATION_RESOURCES = {
  program: {
    parentTable: "programs",
    registrationsTable: "program_registrations",
    parentIdColumn: "program_id",
    notFoundMessage: "Program not found",
  },
  event: {
    parentTable: "events",
    registrationsTable: "event_registrations",
    parentIdColumn: "event_id",
    occurrenceColumn: "event_occurrence_id",
    notFoundMessage: "Event not found",
  },
};

function getResourceConfig(type) {
  const config = REGISTRATION_RESOURCES[type];

  if (!config) {
    throw new Error(`Unsupported registration type: ${type}`);
  }

  return config;
}

function buildNotFoundError(type) {
  const config = getResourceConfig(type);
  return new Error(config.notFoundMessage);
}

export async function registerForResource(type, resourceId, registrationData) {
  const { parentTable, registrationsTable, parentIdColumn, occurrenceColumn } = getResourceConfig(type);
  const name =
    registrationData.name ||
    [registrationData.firstName, registrationData.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
  const email = registrationData.email;
  const occurrenceId = type === "event" ? registrationData.eventOccurrenceId || null : null;
  const notes = registrationData.notes?.trim() || null;

  const { rows: parentRows } = await pool.query(
    `SELECT capacity FROM ${parentTable} WHERE id = $1`,
    [resourceId]
  );

  const parentResource = parentRows[0];

  if (!parentResource) {
    throw buildNotFoundError(type);
  }

  const capacity = parentResource.capacity;

  const countQuery = occurrenceColumn && occurrenceId
    ? {
        text: `SELECT COUNT(*)::int AS count
               FROM ${registrationsTable}
               WHERE ${parentIdColumn} = $1
               AND ${occurrenceColumn} = $2
               AND status = 'registered'`,
        values: [resourceId, occurrenceId],
      }
    : {
        text: `SELECT COUNT(*)::int AS count
               FROM ${registrationsTable}
               WHERE ${parentIdColumn} = $1
               AND status = 'registered'`,
        values: [resourceId],
      };

  const { rows: countRows } = await pool.query(countQuery.text, countQuery.values);

  const currentCount = Number(countRows[0].count);

  const status = capacity === null || capacity === undefined || currentCount < capacity
    ? "registered"
    : "waitlisted";

  if (occurrenceColumn) {
    await pool.query(
      `
      INSERT INTO ${registrationsTable} (${parentIdColumn}, ${occurrenceColumn}, name, email, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [resourceId, occurrenceId, name, email, notes, status]
    );
  } else {
    await pool.query(
      `
      INSERT INTO ${registrationsTable} (${parentIdColumn}, name, email, notes, status)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [resourceId, name, email, notes, status]
    );
  }

  return { status };
}

export const unregisterFromResource = async (
  type,
  resourceId,
  email,
  { occurrenceId = null, registrationId = null } = {}
) => {
  const { parentTable, registrationsTable, parentIdColumn, occurrenceColumn } = getResourceConfig(type);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const occurrenceFilter = occurrenceColumn && occurrenceId
      ? `AND ${occurrenceColumn} = $3`
      : "";
    const deleteQuery = registrationId
      ? {
          text: `
            DELETE FROM ${registrationsTable}
            WHERE ${parentIdColumn} = $1 AND id = $2
            RETURNING status
          `,
          values: [resourceId, registrationId],
        }
      : {
          text: `
            DELETE FROM ${registrationsTable}
            WHERE ${parentIdColumn} = $1 AND email = $2 ${occurrenceFilter}
            RETURNING status
          `,
          values: occurrenceColumn && occurrenceId
            ? [resourceId, email, occurrenceId]
            : [resourceId, email],
        };

    const { rows: deletedRows } = await client.query(deleteQuery.text, deleteQuery.values);
    const removedRegistered = deletedRows.some((registration) => registration.status === "registered");

    if (!removedRegistered) {
      await client.query("COMMIT");
      return { removed: deletedRows.length > 0 };
    }

    const { rows: parentRows } = await client.query(
      `SELECT capacity FROM ${parentTable} WHERE id = $1`,
      [resourceId]
    );
    const capacity = parentRows[0]?.capacity;

    if (capacity !== null && capacity !== undefined) {
      const registeredCountQuery = occurrenceColumn && occurrenceId
        ? {
            text: `
              SELECT COUNT(*)::int AS count
              FROM ${registrationsTable}
              WHERE ${parentIdColumn} = $1
                AND ${occurrenceColumn} = $2
                AND status = 'registered'
            `,
            values: [resourceId, occurrenceId],
          }
        : {
            text: `
              SELECT COUNT(*)::int AS count
              FROM ${registrationsTable}
              WHERE ${parentIdColumn} = $1
                AND status = 'registered'
            `,
            values: [resourceId],
          };

      const { rows: registeredCountRows } = await client.query(
        registeredCountQuery.text,
        registeredCountQuery.values
      );

      if (Number(registeredCountRows[0].count) >= capacity) {
        await client.query("COMMIT");
        return { removed: true };
      }
    }

    const waitlistOccurrenceFilter = occurrenceColumn && occurrenceId
      ? `AND ${occurrenceColumn} = $2`
      : "";
    const waitlistValues = occurrenceColumn && occurrenceId
      ? [resourceId, occurrenceId]
      : [resourceId];

    const next = await client.query(
      `SELECT id, name, email
       FROM ${registrationsTable}
       WHERE ${parentIdColumn} = $1
       ${waitlistOccurrenceFilter}
       AND status = 'waitlisted'
       ORDER BY created_at ASC
       LIMIT 1`,
      waitlistValues
    );

    const nextRegistration = next.rows[0];

    if (nextRegistration) {
      await client.query(
        `UPDATE ${registrationsTable}
         SET status = 'registered'
         WHERE id = $1`,
        [nextRegistration.id]
      );

      await sendEmail(
        nextRegistration.email,
        nextRegistration.name,
        "You're off the waitlist!",
        "A spot opened up and you are now registered."
      );
    }

    await client.query("COMMIT");

    return { removed: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export async function getRegistrationStats(type, resourceId, { occurrenceId = null } = {}) {
  const { parentTable, registrationsTable, parentIdColumn, occurrenceColumn } = getResourceConfig(type);

  const occurrenceJoinFilter = occurrenceColumn && occurrenceId
    ? `AND r.${occurrenceColumn} = $2`
    : "";

  const { rows } = await pool.query(
    `
    SELECT
      p.capacity,
      COUNT(*) FILTER (WHERE r.status = 'registered')::int AS registered,
      COUNT(*) FILTER (WHERE r.status = 'waitlisted')::int AS waitlisted
    FROM ${parentTable} p
    LEFT JOIN ${registrationsTable} r
      ON r.${parentIdColumn} = p.id
      ${occurrenceJoinFilter}
    WHERE p.id = $1
    GROUP BY p.capacity
    `,
    occurrenceColumn && occurrenceId ? [resourceId, occurrenceId] : [resourceId]
  );

  const stats = rows[0];

  if (!stats) {
    return null;
  }

  const capacity = stats.capacity;
  const registered = Number(stats.registered);
  const waitlisted = Number(stats.waitlisted);

  return {
    capacity,
    registered,
    waitlisted,
    remaining: capacity === null || capacity === undefined
      ? null
      : Math.max(capacity - registered, 0),
  };
}

export async function lookupRegistration(type, resourceId, email, { occurrenceId = null } = {}) {
  const { parentTable, registrationsTable, parentIdColumn, occurrenceColumn } = getResourceConfig(type);
  const occurrenceFilter = occurrenceColumn && occurrenceId
    ? `AND r.${occurrenceColumn} = $3`
    : "";
  const queryValues = occurrenceColumn && occurrenceId
    ? [resourceId, email, occurrenceId]
    : [resourceId, email];

  const { rows } = await pool.query(
    `
    SELECT r.*, p.capacity
    FROM ${registrationsTable} r
    JOIN ${parentTable} p
      ON p.id = r.${parentIdColumn}
    WHERE r.${parentIdColumn} = $1 AND LOWER(r.email) = LOWER($2) ${occurrenceFilter}
    LIMIT 1
    `,
    queryValues
  );

  const registration = rows[0];

  if (!registration) {
    return null;
  }

  if (registration.status !== "waitlisted") {
    return {
      ...registration,
      waitlist_position: null,
    };
  }

  const scopedOccurrenceId = occurrenceColumn
    ? occurrenceId || registration[occurrenceColumn] || null
    : null;
  const waitlistOccurrenceFilter = occurrenceColumn && scopedOccurrenceId
    ? `AND ${occurrenceColumn} = $4`
    : "";
  const waitlistPositionValues = occurrenceColumn && scopedOccurrenceId
    ? [resourceId, registration.created_at, registration.id, scopedOccurrenceId]
    : [resourceId, registration.created_at, registration.id];

  const { rows: waitlistRows } = await pool.query(
    `
    SELECT COUNT(*)::int AS position
    FROM ${registrationsTable}
    WHERE ${parentIdColumn} = $1
      AND status = 'waitlisted'
      AND (
        created_at < $2
        OR (created_at = $2 AND id <= $3)
      )
      ${waitlistOccurrenceFilter}
    `,
    waitlistPositionValues
  );

  return {
    ...registration,
    waitlist_position: Number(waitlistRows[0].position),
  };
}

export async function lookupRegistrationsByEmail(email) {
  const normalizedEmail = String(email || "").trim();

  if (!normalizedEmail) {
    return [];
  }

  const { rows } = await pool.query(
    `
    SELECT *
    FROM (
      SELECT
        program_registrations.id,
        'program' AS type,
        program_registrations.program_id AS resource_id,
        programs.title AS resource_title,
        program_registrations.name,
        program_registrations.email,
        program_registrations.created_at,
        program_registrations.status,
        NULL::uuid AS event_occurrence_id,
        NULL::date AS occurrence_date,
        NULL::time AS start_time,
        NULL::time AS end_time,
        programs.capacity,
        CASE
          WHEN program_registrations.status = 'waitlisted' THEN (
            SELECT COUNT(*)::int
            FROM program_registrations waitlist_rows
            WHERE waitlist_rows.program_id = program_registrations.program_id
              AND waitlist_rows.status = 'waitlisted'
              AND (
                waitlist_rows.created_at < program_registrations.created_at
                OR (
                  waitlist_rows.created_at = program_registrations.created_at
                  AND waitlist_rows.id <= program_registrations.id
                )
              )
          )
          ELSE NULL
        END AS waitlist_position
      FROM program_registrations
      JOIN programs
        ON programs.id = program_registrations.program_id
      WHERE LOWER(program_registrations.email) = LOWER($1)

      UNION ALL

      SELECT
        event_registrations.id,
        'event' AS type,
        event_registrations.event_id AS resource_id,
        events.title AS resource_title,
        event_registrations.name,
        event_registrations.email,
        event_registrations.created_at,
        event_registrations.status,
        event_registrations.event_occurrence_id,
        event_occurrences.occurrence_date,
        event_occurrences.start_time,
        event_occurrences.end_time,
        events.capacity,
        CASE
          WHEN event_registrations.status = 'waitlisted' THEN (
            SELECT COUNT(*)::int
            FROM event_registrations waitlist_rows
            WHERE waitlist_rows.event_id = event_registrations.event_id
              AND waitlist_rows.event_occurrence_id IS NOT DISTINCT FROM event_registrations.event_occurrence_id
              AND waitlist_rows.status = 'waitlisted'
              AND (
                waitlist_rows.created_at < event_registrations.created_at
                OR (
                  waitlist_rows.created_at = event_registrations.created_at
                  AND waitlist_rows.id <= event_registrations.id
                )
              )
          )
          ELSE NULL
        END AS waitlist_position
      FROM event_registrations
      JOIN events
        ON events.id = event_registrations.event_id
      LEFT JOIN event_occurrences
        ON event_occurrences.id = event_registrations.event_occurrence_id
      WHERE LOWER(event_registrations.email) = LOWER($1)
    ) registrations
    ORDER BY created_at DESC;
    `,
    [normalizedEmail]
  );

  return rows;
}
