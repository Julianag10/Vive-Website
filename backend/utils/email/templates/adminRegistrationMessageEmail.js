import { emailLayout } from "../emailLayout.js";
import { emailTokens, escapeHtml, typeStyle } from "../emailStyles.js";

function formatMessage(message = "") {
  return escapeHtml(message)
    .split(/\r?\n/)
    .map((line) => line || "&nbsp;")
    .join("<br>");
}

export function adminRegistrationMessageEmail({
  resourceTitle = "ViVe Wellness",
  message = "",
}) {
  return emailLayout({
    title: resourceTitle,
    previewText: "A message from ViVe Wellness.",
    body: `
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        ViVe Wellness sent this message about ${escapeHtml(resourceTitle)}.
      </p>
      <div style="${typeStyle("body", {
        color: emailTokens.colors.black,
        margin: "0",
      })}">
        ${formatMessage(message)}
      </div>
    `,
  });
}
