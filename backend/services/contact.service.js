import { pool } from "../db/db.js";
import { sendContactConfirmationEmail } from "./email.service.js";

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createContactMessage(data) {
  const firstName = cleanText(data.firstName);
  const lastName = cleanText(data.lastName);
  const email = cleanText(data.email).toLowerCase();
  const phone = cleanText(data.phone);
  const organization = cleanText(data.organization) || null;
  const message = cleanText(data.message);

  if (!firstName || !lastName || !email || !phone || !message) {
    const error = new Error("First name, last name, email, phone, and message are required.");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO contact_messages
      (first_name, last_name, email, phone, organization, message)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, first_name, last_name, email, phone, organization, message, created_at`,
    [firstName, lastName, email, phone, organization, message]
  );

  const contactMessage = result.rows[0];

  try {
    await sendContactConfirmationEmail({
      email: contactMessage.email,
      contactMessage,
    });
  } catch (emailError) {
    console.error("Failed to send contact confirmation email:", {
      email: contactMessage.email,
      contactMessageId: contactMessage.id,
      error: emailError.message,
    });
  }

  return contactMessage;
}
