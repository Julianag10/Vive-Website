import { pool } from "../../db/db.js";
import { sendAdminVolunteerMessageEmail } from "../email.service.js";

export async function listVolunteerApplications() {
  const { rows } = await pool.query(`
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      roles,
      availability,
      skills,
      motivation,
      status,
      withdrawn_at,
      created_at
    FROM volunteer_applications
    ORDER BY created_at DESC;
  `);

  return rows;
}

export async function emailVolunteerApplication(applicationId, { subject, message }) {
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
      id,
      first_name,
      last_name,
      email
    FROM volunteer_applications
    WHERE id = $1
      AND email IS NOT NULL
      AND TRIM(email) != ''
    LIMIT 1;
    `,
    [applicationId]
  );

  if (!rows[0]) {
    const error = new Error("No email address found for this volunteer application.");
    error.status = 404;
    throw error;
  }

  const volunteerName = [rows[0].first_name, rows[0].last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  await sendAdminVolunteerMessageEmail({
    email: rows[0].email,
    subject: cleanSubject,
    volunteerName,
    message: cleanMessage,
  });

  return {
    sentCount: 1,
    recipientEmail: rows[0].email,
    recipientName: volunteerName,
  };
}
