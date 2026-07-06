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

  const { rows } = await pool.query(
    `
    SELECT id, name, email, created_at, status
    FROM ${table}
    WHERE ${parentIdColumn} = $1
    ORDER BY created_at DESC;
    `,
    [resourceId]
  );

  return rows;
}