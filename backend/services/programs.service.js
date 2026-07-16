// PUBLIC READ

import { pool } from "../db/db.js";

// LIST ACTIVE PROGRAMS
export async function listActivePrograms() {
  const { rows } = await pool.query(`
    SELECT *
    FROM programs
    WHERE is_active = true
    ORDER BY created_at DESC;
  `);

  return rows;
}

// FRONTEND calls/api/programs?featured=true
// LIST FEATURED PROGRAMS:
export async function listFeaturedPrograms() {
  const { rows } = await pool.query(`
    SELECT *
    FROM programs
    WHERE is_active = true
    AND is_featured = true
    ORDER BY created_at DESC
    LIMIT 3;
  `);

  // returns all rows that were quried 
  return rows;
}

export async function getProgramById(id) {
  const { rows } = await pool.query(
    `
    SELECT 
      programs.*,

      COALESCE(
        json_agg(
          json_build_object(
            'day_of_week', program_schedules.day_of_week,
            'start_time', program_schedules.start_time,
            'end_time', program_schedules.end_time
          )
        ) FILTER (
          WHERE program_schedules.id IS NOT NULL
        ),
        '[]'
      ) AS schedules

    FROM programs

    LEFT JOIN program_schedules
      ON programs.id = program_schedules.program_id

    WHERE programs.id = $1
    AND programs.is_active = true

    GROUP BY programs.id

    LIMIT 1;
    `,
    [id]
  );

  return rows[0] || null;
}