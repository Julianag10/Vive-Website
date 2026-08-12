import { emailLayout } from "../emailLayout.js";
import { emailTokens, escapeHtml, typeStyle } from "../emailStyles.js";

function listItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return `<p style="${typeStyle("body", {
      color: emailTokens.colors.white,
      WebkitTextFillColor: emailTokens.colors.white,
      margin: "0",
    })}">None selected</p>`;
  }

  return `
    <ul style="${typeStyle("body", {
      color: emailTokens.colors.white,
      WebkitTextFillColor: emailTokens.colors.white,
      margin: "0",
      paddingLeft: "22px",
    })}">
      ${items.map((item) => `<li style="color:${emailTokens.colors.white};-webkit-text-fill-color:${emailTokens.colors.white};">${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function responseRow(label, value, { inline = false, prominentLabel = false } = {}) {
  const valueStyle = typeStyle("body", {
    color: emailTokens.colors.white,
    WebkitTextFillColor: emailTokens.colors.white,
    margin: "0",
  });
  const labelStyle = typeStyle("bodyBold", {
    color: emailTokens.colors.white,
    WebkitTextFillColor: emailTokens.colors.white,
    fontSize: prominentLabel ? "18px" : undefined,
    fontWeight: prominentLabel ? "900 !important" : "700 !important",
    margin: "0",
  });

  if (inline) {
    return `
      <tr>
        <td style="padding:0 0 ${emailTokens.spacing.md}px;color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
          <p style="${valueStyle};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
            <strong style="${labelStyle};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">${escapeHtml(label)}:</strong>
            <span style="${valueStyle};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
              ${value || ""}
            </span>
          </p>
        </td>
      </tr>
    `;
  }

  return `
    <tr>
      <td style="padding:0 0 ${emailTokens.spacing.md}px;color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
        <p style="${labelStyle};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;margin:0 0 6px !important;">
          ${escapeHtml(label)}:
        </p>
        <div style="${valueStyle};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
          ${value || ""}
        </div>
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

function emailButton(label, href, variant = "primary") {
  const isPrimary = variant === "primary";
  const background = isPrimary ? emailTokens.colors.blue : emailTokens.colors.white;
  const color = isPrimary ? emailTokens.colors.white : emailTokens.colors.blue;
  const border = isPrimary ? `3px solid ${emailTokens.colors.blue}` : `3px solid ${emailTokens.colors.blue}`;

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="border-collapse:separate;margin:0 auto;">
      <tr>
        <td align="center" bgcolor="${background}" style="background-color:${background};border:${border};border-radius:${emailTokens.radius.pill}px;">
          <a href="${escapeHtml(href)}" style="${typeStyle("button", {
            color,
            WebkitTextFillColor: color,
            display: "inline-block",
            textDecoration: "none",
            padding: emailTokens.button.padding,
            borderRadius: `${emailTokens.radius.pill}px`,
          })}">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function volunteerConfirmationEmail({
  application = {},
  editUrl = "",
  withdrawUrl = "",
}) {
  const name = [application.first_name, application.last_name].filter(Boolean).join(" ");

  return emailLayout({
    title: "Thank You for Volunteering!",
    previewText: "We received your volunteer application.",
    body: `
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        Hi ${escapeHtml(name || "friend")},
      </p>
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        Thank you for offering your time to ViVe Wellness. We received your volunteer application.
      </p>
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: "0" })}">
        If your availability and interests match a current need, our team will contact you with next steps.
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.blue}" style="width:100%;border-collapse:separate;margin:${emailTokens.spacing.section}px 0 0;background-color:${emailTokens.colors.blue};border-radius:${emailTokens.radius.card}px;">
        <tr>
          <td style="padding:${emailTokens.spacing.xxl}px;color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
              ${responseRow("Name", escapeHtml(name), { inline: true })}
              ${responseRow("Email", contactLink(application.email, "mailto"), { inline: true })}
              ${responseRow("Phone", contactLink(application.phone, "tel"), { inline: true })}
              ${responseRow("Volunteer roles", listItems(application.roles), { prominentLabel: true })}
              ${responseRow("Availability", listItems(application.availability), { prominentLabel: true })}
              ${responseRow("Skills", escapeHtml(application.skills || "No skills listed."), { prominentLabel: true })}
              ${responseRow("Why would you like to volunteer with us", escapeHtml(application.motivation || "No response provided."), { prominentLabel: true })}
            </table>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;margin:${emailTokens.spacing.section}px 0 0;">
        <tr>
          <td align="center" style="padding:0 0 ${emailTokens.spacing.md}px;">
            ${emailButton("Edit application", editUrl, "primary")}
          </td>
        </tr>
        <tr>
          <td align="center">
            ${emailButton("Withdraw application", withdrawUrl, "secondary")}
          </td>
        </tr>
      </table>
    `,
  });
}
