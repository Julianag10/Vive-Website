// ADMIN READS + WRITE

import { pool } from "../../db/db.js";


const FEATURED_PROGRAM_LIMIT = 3;

// SCHDULE INSERT HELPER
async function createProgramSchedules(programId, schedule = []) {
  for (const item of schedule) {
    await pool.query(
      `
      INSERT INTO program_schedules (
        program_id,
        day_of_week,
        start_time,
        end_time
      )
      VALUES ($1, $2, $3, $4);
      `,
      [
        programId,
        item.day,
        item.start_time,
        item.end_time,
      ],
    );
  }
}

function schedulesForResponse(schedule = []) {
  return schedule.map((item) => ({
    day_of_week: item.day,
    start_time: item.start_time,
    end_time: item.end_time,
  }));
}

async function assertFeaturedProgramLimit({ excludeId = null } = {}) {
  const { rows } = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM programs
    WHERE is_featured = true
    AND ($1::uuid IS NULL OR id <> $1::uuid);
    `,
    [excludeId],
  );

  if (rows[0].count >= FEATURED_PROGRAM_LIMIT) {
    const error = new Error("Only three featured programs allowed.");
    error.status = 400;
    throw error;
  }
}

// LIST ALL PROGRAMS (ADMIN)
export async function listAllPrograms() {
  const { rows } = await pool.query(`
    SELECT 
      programs.*,
      COALESCE(
        json_agg(
          json_build_object(
            'day_of_week', program_schedules.day_of_week,
            'start_time', program_schedules.start_time,
            'end_time', program_schedules.end_time
          )
        ) FILTER (WHERE program_schedules.id IS NOT NULL),
        '[]'
      ) AS schedules
    
    FROM programs
    
    LEFT JOIN program_schedules
    ON programs.id = program_schedules.program_id
    
    GROUP BY programs.id
    
    ORDER BY programs.created_at DESC;
  `);

  return rows;
}

// CREATE A NEW PROGRAM
export async function createProgram({
  title,
  description = null,
  location = null,
  start_date = null,
  end_date = null,
  capacity = null,
  is_active = true,
  is_featured = false,
  image_url = null,
  gallery_images = [],
  activities = [],
  schedule = [],
}) {
  if (is_featured) {
    await assertFeaturedProgramLimit();
  }

  const { rows } = await pool.query(
    `
    INSERT INTO programs (
      title, description, location, start_date, end_date, capacity, is_active, is_featured, image_url, gallery_images, activities
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
    `,
    [title, description, location, start_date, end_date, capacity, is_active, is_featured, image_url, gallery_images, activities],
  );
  // RETURNING * → give me the row you just created

  // Return the created program to controller
  const program = rows[0];

  await createProgramSchedules(
    program.id,
    schedule
  );

  return {
    ...program,
    schedules: schedulesForResponse(schedule),
  };
}

// UPDATE PROGRAM DETAILS
export async function updateProgram(id, data) {
  const { 
    title, 
    description, 
    location,
    start_date, 
    end_date, 
    capacity, 
    is_active, 
    is_featured,
    image_url, 
    gallery_images = [],
    activities = [],
    schedule = [],
  } = data;

  if (is_featured) {
    await assertFeaturedProgramLimit({ excludeId: id });
  }

 

  const { rows } = await pool.query(
    `
    UPDATE programs
    SET 
      title = $2,
      description = $3,
      location = $4,
      start_date = $5,
      end_date = $6,
      capacity = $7,
      is_active = $8,
      is_featured = $9,
      image_url = $10,
      gallery_images = $11,
      activities = $12
    WHERE id = $1
    RETURNING *;
    `,
    [id, title, description, location, start_date, end_date, capacity, is_active, is_featured, image_url, gallery_images, activities],
  );

  await pool.query(
    `
    DELETE FROM program_schedules
    WHERE program_id = $1
    `,
    [id]
  );

  await createProgramSchedules(
    id,
    schedule
  );

  return {
    ...rows[0],
    schedules: schedulesForResponse(schedule),
  };
}

// ENABLE / DISABLE PROGRAM
export async function toggleProgramActive(id, isActive) {
  const { rows } = await pool.query(
    `
    UPDATE programs
    SET is_active = $2
    WHERE id = $1
    RETURNING *;
    `,
    [id, isActive],
  );

  return rows[0];
}

// DELETE PROGRAM
export async function deleteProgram(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
      DELETE FROM program_schedules
      WHERE program_id = $1;
      `,
      [id],
    );

    const result = await client.query(
      `
      DELETE FROM programs
      WHERE id = $1;
      `,
      [id],
    );

    await client.query("COMMIT");

    return result.rowCount > 0;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
