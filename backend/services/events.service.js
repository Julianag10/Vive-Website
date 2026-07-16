// PUBLIC 
import { pool } from "../db/db.js";

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
      WHERE events.is_active = true
      AND (
        (
          events.start_date <= $1
          AND events.end_date >= $2
        )
        OR event_occurrences.occurrence_date BETWEEN $2::date AND $1::date
      )
    `)}
    ORDER BY events.start_date ASC
  `, [endOfMonth, startOfMonth]);

  // start_date <= end_of_range
// AND end_date >= start_of_range
  return rows;
}

