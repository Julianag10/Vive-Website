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
  const { parentTable, registrationsTable, parentIdColumn } = getResourceConfig(type);
  const name =
    registrationData.name ||
    [registrationData.firstName, registrationData.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
  const email = registrationData.email;

  const { rows: parentRows } = await pool.query(
    `SELECT capacity FROM ${parentTable} WHERE id = $1`,
    [resourceId]
  );

  const parentResource = parentRows[0];

  if (!parentResource) {
    throw buildNotFoundError(type);
  }

  const capacity = parentResource.capacity ?? 0;

  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM ${registrationsTable}
     WHERE ${parentIdColumn} = $1 AND status = 'registered'`,
    [resourceId]
  );

  const currentCount = Number(countRows[0].count);

  const status = currentCount < capacity ? "registered" : "waitlisted";

  await pool.query(
    `
    INSERT INTO ${registrationsTable} (${parentIdColumn}, name, email, status)
    VALUES ($1, $2, $3, $4)
    `,
    [resourceId, name, email, status]
  );

  return { status };
}

export const unregisterFromResource = async (type, resourceId, email) => {
  const { registrationsTable, parentIdColumn } = getResourceConfig(type);

  await pool.query(
    `DELETE FROM ${registrationsTable}
     WHERE ${parentIdColumn} = $1 AND email = $2`,
    [resourceId, email]
  );

  const next = await pool.query(
    `SELECT name, email
     FROM ${registrationsTable}
     WHERE ${parentIdColumn} = $1 AND status = 'waitlisted'
     ORDER BY created_at ASC
     LIMIT 1`,
    [resourceId]
  );

  const nextRegistration = next.rows[0];

  if (nextRegistration) {
    await pool.query(
      `UPDATE ${registrationsTable}
       SET status = 'registered'
       WHERE ${parentIdColumn} = $1 AND email = $2`,
      [resourceId, nextRegistration.email]
    );

    await sendEmail(
      nextRegistration.email,
      nextRegistration.name,
      "You're off the waitlist!",
      "A spot opened up and you are now registered."
    );
  }

  return { removed: true };
};

export async function getRegistrationStats(type, resourceId) {
  const { parentTable, registrationsTable, parentIdColumn } = getResourceConfig(type);

  const { rows } = await pool.query(
    `
    SELECT
      p.capacity,
      COUNT(*) FILTER (WHERE r.status = 'registered')::int AS registered,
      COUNT(*) FILTER (WHERE r.status = 'waitlisted')::int AS waitlisted
    FROM ${parentTable} p
    LEFT JOIN ${registrationsTable} r
      ON r.${parentIdColumn} = p.id
    WHERE p.id = $1
    GROUP BY p.capacity
    `,
    [resourceId]
  );

  const stats = rows[0];

  if (!stats) {
    return null;
  }

  const capacity = stats.capacity ?? 0;
  const registered = Number(stats.registered);
  const waitlisted = Number(stats.waitlisted);

  return {
    capacity,
    registered,
    waitlisted,
    remaining: Math.max(capacity - registered, 0),
  };
}

export async function lookupRegistration(type, resourceId, email) {
  const { registrationsTable, parentIdColumn } = getResourceConfig(type);

  const { rows } = await pool.query(
    `
    SELECT *
    FROM ${registrationsTable}
    WHERE ${parentIdColumn} = $1 AND email = $2
    LIMIT 1
    `,
    [resourceId, email]
  );

  return rows[0] || null;
}