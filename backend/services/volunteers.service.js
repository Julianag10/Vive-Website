import { pool } from "../db/db.js";
import { randomBytes } from "node:crypto";
import { sendVolunteerApplicationEmail } from "./email.service.js";

const ALLOWED_ROLES = new Set([
  "Data input",
  "Swim instructor (experienced)",
  "Exercise instructor",
  "Kids play & exercise instructor",
  "Social media volunteer",
  "General/admin assistance",
]);

const ALLOWED_AVAILABILITY = new Set([
  "Summer camp",
  "Weekend workshop (4 hour shift)",
  "Weekend workshop (8 hour shift)",
  "Weekday workshop",
  "Ongoing weekday commitment",
]);

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanChoices(values, allowedChoices) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map(cleanText)
    .filter((value) => value && allowedChoices.has(value));
}

function createManageToken() {
  return randomBytes(32).toString("hex");
}

function publicApplication(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    roles: row.roles || [],
    availability: row.availability || [],
    skills: row.skills || "",
    motivation: row.motivation || "",
    status: row.status || "active",
    createdAt: row.created_at,
    withdrawnAt: row.withdrawn_at,
  };
}

function cleanVolunteerApplicationData(data) {
  const firstName = cleanText(data.firstName);
  const lastName = cleanText(data.lastName);
  const email = cleanText(data.email).toLowerCase();
  const phone = cleanText(data.phone);
  const roles = cleanChoices(data.roles, ALLOWED_ROLES);
  const availability = cleanChoices(data.availability, ALLOWED_AVAILABILITY);
  const skills = cleanText(data.skills) || null;
  const motivation = cleanText(data.motivation) || null;

  if (!firstName || !lastName || !email || !phone) {
    const error = new Error("First name, last name, email, and phone are required.");
    error.status = 400;
    throw error;
  }

  if (roles.length === 0) {
    const error = new Error("At least one volunteer role is required.");
    error.status = 400;
    throw error;
  }

  if (availability.length === 0) {
    const error = new Error("At least one availability option is required.");
    error.status = 400;
    throw error;
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    roles,
    availability,
    skills,
    motivation,
  };
}

function getManageUrl(token) {
  const baseUrl = process.env.BASE_URL || "http://localhost:5173";
  return `${baseUrl}/volunteer/application/${token}`;
}

export async function createVolunteerApplication(data) {
  const applicationData = cleanVolunteerApplicationData(data);
  const manageToken = createManageToken();

  const result = await pool.query(
    `INSERT INTO volunteer_applications
      (first_name, last_name, email, phone, roles, availability, skills, motivation, manage_token)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, first_name, last_name, email, phone, roles, availability, skills, motivation, manage_token, status, withdrawn_at, created_at`,
    [
      applicationData.firstName,
      applicationData.lastName,
      applicationData.email,
      applicationData.phone,
      applicationData.roles,
      applicationData.availability,
      applicationData.skills,
      applicationData.motivation,
      manageToken,
    ]
  );

  const application = result.rows[0];

  try {
    await sendVolunteerApplicationEmail({
      email: application.email,
      application,
      editUrl: getManageUrl(application.manage_token),
      withdrawUrl: getManageUrl(application.manage_token),
    });
  } catch (emailError) {
    console.error("Failed to send volunteer application email:", {
      email: application.email,
      applicationId: application.id,
      error: emailError.message,
    });
  }

  return publicApplication(application);
}

export async function getVolunteerApplicationByToken(token) {
  const cleanToken = cleanText(token);

  if (!cleanToken) {
    const error = new Error("Volunteer application link is required.");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    `SELECT id, first_name, last_name, email, phone, roles, availability, skills, motivation, status, withdrawn_at, created_at
     FROM volunteer_applications
     WHERE manage_token = $1`,
    [cleanToken]
  );

  if (!result.rows[0]) {
    const error = new Error("Volunteer application not found.");
    error.status = 404;
    throw error;
  }

  return publicApplication(result.rows[0]);
}

export async function updateVolunteerApplicationByToken(token, data) {
  const cleanToken = cleanText(token);
  const applicationData = cleanVolunteerApplicationData(data);

  if (!cleanToken) {
    const error = new Error("Volunteer application link is required.");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    `UPDATE volunteer_applications
     SET
      first_name = $1,
      last_name = $2,
      email = $3,
      phone = $4,
      roles = $5,
      availability = $6,
      skills = $7,
      motivation = $8
     WHERE manage_token = $9 AND status = 'active'
     RETURNING id, first_name, last_name, email, phone, roles, availability, skills, motivation, status, withdrawn_at, created_at`,
    [
      applicationData.firstName,
      applicationData.lastName,
      applicationData.email,
      applicationData.phone,
      applicationData.roles,
      applicationData.availability,
      applicationData.skills,
      applicationData.motivation,
      cleanToken,
    ]
  );

  if (!result.rows[0]) {
    const error = new Error("Active volunteer application not found.");
    error.status = 404;
    throw error;
  }

  return publicApplication(result.rows[0]);
}

export async function withdrawVolunteerApplicationByToken(token) {
  const cleanToken = cleanText(token);

  if (!cleanToken) {
    const error = new Error("Volunteer application link is required.");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    `UPDATE volunteer_applications
     SET status = 'withdrawn', withdrawn_at = now()
     WHERE manage_token = $1 AND status = 'active'
     RETURNING id, first_name, last_name, email, phone, roles, availability, skills, motivation, status, withdrawn_at, created_at`,
    [cleanToken]
  );

  if (!result.rows[0]) {
    const error = new Error("Active volunteer application not found.");
    error.status = 404;
    throw error;
  }

  return publicApplication(result.rows[0]);
}
