import { pool } from "../../db/db.js";
import { sendAdminContactMessageEmail } from "../email.service.js";

export async function listContactMessages() {
  const { rows } = await pool.query(`
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      organization,
      message,
      created_at
    FROM contact_messages
    ORDER BY created_at DESC;
  `);

  return rows;
}

export async function emailContactMessage(messageId, { subject, message }) {
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
    FROM contact_messages
    WHERE id = $1
      AND email IS NOT NULL
      AND TRIM(email) != ''
    LIMIT 1;
    `,
    [messageId]
  );

  if (!rows[0]) {
    const error = new Error("No email address found for this contact response.");
    error.status = 404;
    throw error;
  }

  const contactName = [rows[0].first_name, rows[0].last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  await sendAdminContactMessageEmail({
    email: rows[0].email,
    subject: cleanSubject,
    contactName,
    message: cleanMessage,
  });

  return {
    sentCount: 1,
    recipientEmail: rows[0].email,
    recipientName: contactName,
  };
}
