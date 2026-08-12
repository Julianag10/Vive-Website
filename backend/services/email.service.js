import { sendHtmlEmail, sendTemplateEmail } from "../utils/email/emailClient.js";
import {
  registrationConfirmationEmail,
  waitlistPromotedRegistrationEmail,
  waitlistRegistrationEmail,
} from "../utils/email/templates/registrationConfirmationEmail.js";
import { contactConfirmationEmail } from "../utils/email/templates/contactConfirmationEmail.js";
import { adminRegistrationMessageEmail } from "../utils/email/templates/adminRegistrationMessageEmail.js";
import {
  donationAbandonedCheckoutEmail,
  donationConfirmationEmail,
  donationDisputeAlertEmail,
  donationPaymentFailedEmail,
  donationRefundEmail,
} from "../utils/email/templates/donationConfirmationEmail.js";
import { volunteerConfirmationEmail } from "../utils/email/templates/volunteerConfirmationEmail.js";

function splitName(name = "") {
  const [firstName = "", ...rest] = String(name).trim().split(/\s+/).filter(Boolean);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function getTemplateId(envName) {
  return process.env[envName] || process.env.RESEND_GENERIC_TEMPLATE_ID;
}

function buildResourceVariables({ type, item = {}, occurrence = {}, statsText = "" }) {
  const resourceLabel = type === "event" ? "event" : "program";
  const resourceTitle = item.title || item.name || resourceLabel;
  const resourceImageUrl = type === "program"
    ? item.imageUrl || item.image_url || ""
    : "";
  const scheduleText = occurrence.date || occurrence.time
    ? [occurrence.date, occurrence.time].filter(Boolean).join(", ")
    : "";

  return {
    REGISTRATION_TYPE: resourceLabel,
    RESOURCE_ID: item.id || "",
    RESOURCE_TITLE: resourceTitle,
    RESOURCE_DESCRIPTION: item.description || "",
    RESOURCE_LOCATION: item.location || "",
    RESOURCE_DATE: occurrence.date || item.date || "",
    RESOURCE_TIME: occurrence.time || item.time || "",
    RESOURCE_START_DATE: occurrence.startDate || item.startDate || item.start_date || item.date || "",
    RESOURCE_START_TIME: occurrence.startTime || item.startTime || item.start_time || item.time || "",
    RESOURCE_END_DATE: occurrence.endDate || item.endDate || item.end_date || item.date || "",
    RESOURCE_END_TIME: occurrence.endTime || item.endTime || item.end_time || item.time || "",
    RESOURCE_IMAGE_URL: resourceImageUrl,
    RESOURCE_IMAGE_ALT: resourceTitle,
    RESOURCE_ACTIVITIES_HTML: Array.isArray(item.activities) ? item.activities.join(", ") : item.activities || "",
    RESOURCE_STATS: statsText,
    SCHEDULE_TEXT: scheduleText,
  };
}

export const sendEmail = async (email, name, subject, message) => {
  const { firstName, lastName } = splitName(name);

  await sendTemplateEmail({
    to: email,
    subject,
    templateId: getTemplateId("RESEND_GENERIC_TEMPLATE_ID"),
    variables: {
      NAME: name || "friend",
      FIRST: firstName,
      LAST: lastName,
      SUBJECT: subject,
      MESSAGE: message,
    },
  });
};

export const sendRegistrationConfirmationEmail = async ({
  email,
  name,
  type,
  item = {},
  manageUrl = "",
}) => {
  const resourceLabel = type === "event" ? "event" : "program";
  const resourceTitle = item.title || item.name || resourceLabel;
  const html = registrationConfirmationEmail({
    name,
    item,
    type,
    manageUrl,
  });

  await sendHtmlEmail({
    to: email,
    subject: `You're registered for ${resourceTitle}`,
    html,
  });
};

export const sendWaitlistRegistrationEmail = async ({
  email,
  name,
  type,
  item = {},
  manageUrl = "",
}) => {
  const resourceLabel = type === "event" ? "event" : "program";
  const resourceTitle = item.title || item.name || resourceLabel;
  const html = waitlistRegistrationEmail({
    name,
    item,
    type,
    manageUrl,
  });

  await sendHtmlEmail({
    to: email,
    subject: `You're waitlisted for ${resourceTitle}`,
    html,
  });
};

export const sendWaitlistPromotedEmail = async ({ email, name, type, item = {}, occurrence = {} }) => {
  const resourceLabel = type === "event" ? "event" : "program";
  const resourceTitle = item.title || item.name || resourceLabel;
  const html = waitlistPromotedRegistrationEmail({
    name,
    item,
    type,
    manageUrl: `${process.env.BASE_URL || "http://localhost:5173"}/${type === "event" ? "events" : "programs"}`,
  });

  await sendHtmlEmail({
    to: email,
    subject: `A spot opened up for ${resourceTitle}`,
    html,
  });
};

export const sendVolunteerApplicationEmail = async ({
  email,
  application = {},
  editUrl = "",
  withdrawUrl = "",
}) => {
  const html = volunteerConfirmationEmail({
    application,
    editUrl,
    withdrawUrl,
  });

  await sendHtmlEmail({
    to: email,
    subject: "We received your volunteer application",
    html,
  });
};

export const sendContactConfirmationEmail = async ({
  email,
  contactMessage = {},
}) => {
  const html = contactConfirmationEmail({
    contactMessage,
  });

  await sendHtmlEmail({
    to: email,
    subject: "We received your message",
    html,
  });
};

export const sendDonationConfirmationEmail = async ({
  email,
  name,
  amount,
}) => {
  const html = donationConfirmationEmail({
    name,
    amount,
  });

  await sendHtmlEmail({
    to: email,
    subject: "Thank you for your donation",
    html,
  });
};

export const sendPaymentFailedEmail = async ({
  email,
  reason,
  retryUrl,
}) => {
  const html = donationPaymentFailedEmail({
    reason,
    retryUrl,
  });

  await sendHtmlEmail({
    to: email,
    subject: "Your donation could not be completed",
    html,
  });
};

export const sendRefundEmail = async ({
  email,
  amount,
}) => {
  const html = donationRefundEmail({
    amount,
  });

  await sendHtmlEmail({
    to: email,
    subject: "Your donation was refunded",
    html,
  });
};

export const sendDisputeAlertEmail = async ({
  chargeId,
  amount,
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_TO_OVERRIDE || "admin@vive.org";
  const html = donationDisputeAlertEmail({
    chargeId,
    amount,
  });

  await sendHtmlEmail({
    to: adminEmail,
    subject: "Donation dispute opened",
    html,
  });
};

export const sendAbandonedCheckoutEmail = async ({
  email,
  resumeUrl,
}) => {
  const html = donationAbandonedCheckoutEmail({
    resumeUrl,
  });

  await sendHtmlEmail({
    to: email,
    subject: "Finish your donation to ViVe Wellness",
    html,
  });
};

export const sendAdminRegistrationMessageEmail = async ({
  email,
  subject,
  resourceTitle,
  message,
}) => {
  const html = adminRegistrationMessageEmail({
    resourceTitle,
    message,
  });

  await sendHtmlEmail({
    to: email,
    subject,
    html,
  });
};

export const sendAdminVolunteerMessageEmail = async ({
  email,
  subject,
  volunteerName,
  message,
}) => {
  const html = adminRegistrationMessageEmail({
    resourceTitle: volunteerName
      ? `Volunteer application for ${volunteerName}`
      : "Volunteer application",
    message,
  });

  await sendHtmlEmail({
    to: email,
    subject,
    html,
  });
};

export const sendAdminContactMessageEmail = async ({
  email,
  subject,
  contactName,
  message,
}) => {
  const html = adminRegistrationMessageEmail({
    resourceTitle: contactName
      ? `Contact response for ${contactName}`
      : "Contact response",
    message,
  });

  await sendHtmlEmail({
    to: email,
    subject,
    html,
  });
};
