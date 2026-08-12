import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getFromAddress() {
  return process.env.EMAIL_FROM || "ViVe Wellness <onboarding@resend.dev>";
}

function getRecipientAddress(to) {
  const override = process.env.EMAIL_TO_OVERRIDE?.trim();

  return override || to;
}

export async function sendTemplateEmail({
  to,
  subject,
  templateId,
  variables = {},
  from = getFromAddress(),
}) {
  if (!to) {
    throw new Error("Email recipient is required.");
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  if (!templateId) {
    throw new Error("Resend template id is required.");
  }

  const recipient = getRecipientAddress(to);

  const result = await resend.emails.send({
    from,
    to: recipient,
    subject,
    template: {
      id: templateId,
      variables,
    },
  });

  if (result?.error) {
    throw new Error(`Resend template email failed: ${result.error.message || JSON.stringify(result.error)}`);
  }

  console.log(`Email sent: "${subject}" to ${recipient}`);

  return result;
}

export async function sendHtmlEmail({
  to,
  subject,
  html,
  from = getFromAddress(),
}) {
  if (!to) {
    throw new Error("Email recipient is required.");
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  if (!html) {
    throw new Error("Email html is required.");
  }

  const recipient = getRecipientAddress(to);

  const result = await resend.emails.send({
    from,
    to: recipient,
    subject,
    html,
  });

  if (result?.error) {
    throw new Error(`Resend html email failed: ${result.error.message || JSON.stringify(result.error)}`);
  }

  console.log(`Email sent: "${subject}" to ${recipient}`);

  return result;
}
