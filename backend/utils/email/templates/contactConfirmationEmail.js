import { emailLayout } from "../emailLayout.js";
import { emailTokens, escapeHtml, typeStyle } from "../emailStyles.js";

function responseRow(label, value) {
  return `
    <tr>
      <td style="padding:0 0 ${emailTokens.spacing.md}px;color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
        <p style="${typeStyle("bodyBold", {
          color: emailTokens.colors.white,
          WebkitTextFillColor: emailTokens.colors.white,
          fontWeight: "900 !important",
          margin: "0 0 6px",
        })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
          ${escapeHtml(label)}:
        </p>
        <div style="${typeStyle("body", {
          color: emailTokens.colors.white,
          WebkitTextFillColor: emailTokens.colors.white,
          margin: "0",
        })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
          ${value || ""}
        </div>
      </td>
    </tr>
  `;
}

function inlineResponseRow(label, value) {
  return `
    <tr>
      <td style="padding:0 0 ${emailTokens.spacing.md}px;color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
        <p style="${typeStyle("body", {
          color: emailTokens.colors.white,
          WebkitTextFillColor: emailTokens.colors.white,
          margin: "0",
        })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
          <strong style="${typeStyle("bodyBold", {
            color: emailTokens.colors.white,
            WebkitTextFillColor: emailTokens.colors.white,
            fontWeight: "900 !important",
            margin: "0",
          })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">${escapeHtml(label)}:</strong>
          <span style="color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">${value || ""}</span>
        </p>
      </td>
    </tr>
  `;
}

function contactLink(value, hrefPrefix) {
  const cleanValue = escapeHtml(value || "");

  if (!cleanValue) {
    return "";
  }

  return `
    <a href="${hrefPrefix}:${cleanValue}" style="${typeStyle("body", {
      color: `${emailTokens.colors.white} !important`,
      WebkitTextFillColor: `${emailTokens.colors.white} !important`,
      margin: "0",
      textDecoration: "none",
    })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
      ${cleanValue}
    </a>
  `;
}

export function contactConfirmationEmail({ contactMessage = {} }) {
  const name = [contactMessage.first_name, contactMessage.last_name]
    .filter(Boolean)
    .join(" ");

  return emailLayout({
    title: "We Received Your Message",
    previewText: "Thank you for contacting ViVe Wellness.",
    body: `
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        Hi ${escapeHtml(name || "friend")},
      </p>
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        Thank you for contacting ViVe Wellness. Our team received your message.
      </p>
      <p style="${typeStyle("bodyBold", { color: emailTokens.colors.black, margin: "0" })}">
        Admin has been alerted about your response. We will review it and follow up when appropriate.
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.blue}" style="width:100%;border-collapse:separate;margin:${emailTokens.spacing.section}px 0 0;background-color:${emailTokens.colors.blue};border-radius:${emailTokens.radius.card}px;">
        <tr>
          <td style="padding:${emailTokens.spacing.xxl}px;color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
              ${inlineResponseRow("Name", escapeHtml(name))}
              ${inlineResponseRow("Email", contactLink(contactMessage.email, "mailto"))}
              ${inlineResponseRow("Phone", contactLink(contactMessage.phone, "tel"))}
              ${inlineResponseRow("Organization", escapeHtml(contactMessage.organization || "Not provided"))}
              ${responseRow("Message", escapeHtml(contactMessage.message || "No message provided."))}
            </table>
          </td>
        </tr>
      </table>
    `,
  });
}
