import { emailLayout } from "../emailLayout.js";
import { emailTokens, escapeHtml, typeStyle } from "../emailStyles.js";

function formatAmount(amount) {
  if (amount === undefined || amount === null || amount === "") {
    return "";
  }

  const numberAmount = Number(amount);

  if (Number.isNaN(numberAmount)) {
    return String(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numberAmount);
}

function actionButton(label, href) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="border-collapse:separate;margin:0 auto;">
      <tr>
        <td align="center" bgcolor="${emailTokens.colors.blue}" style="background-color:${emailTokens.colors.blue};border:3px solid ${emailTokens.colors.blue};border-radius:${emailTokens.radius.pill}px;">
          <a href="${escapeHtml(href)}" style="${typeStyle("button", {
            color: emailTokens.colors.white,
            WebkitTextFillColor: emailTokens.colors.white,
            display: "inline-block",
            textDecoration: "none",
            padding: emailTokens.button.padding,
            borderRadius: `${emailTokens.radius.pill}px`,
          })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function detailCard(rows = []) {
  const filteredRows = rows.filter((row) => row.value !== undefined && row.value !== null && row.value !== "");

  if (filteredRows.length === 0) {
    return "";
  }

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.blue}" style="width:100%;border-collapse:separate;margin:${emailTokens.spacing.section}px 0;background-color:${emailTokens.colors.blue};border-radius:${emailTokens.radius.card}px;">
      <tr>
        <td style="padding:${emailTokens.spacing.xxl}px;color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
          ${filteredRows.map((row) => `
            <p style="${typeStyle("body", {
              color: emailTokens.colors.white,
              WebkitTextFillColor: emailTokens.colors.white,
              margin: `0 0 ${emailTokens.spacing.sm}px`,
            })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
              <strong style="${typeStyle("bodyBold", {
                color: emailTokens.colors.white,
                WebkitTextFillColor: emailTokens.colors.white,
                fontWeight: "900 !important",
                margin: "0",
              })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">${escapeHtml(row.label)}:</strong>
              <span style="color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">${escapeHtml(row.value)}</span>
            </p>
          `).join("")}
        </td>
      </tr>
    </table>
  `;
}

export function donationConfirmationEmail({ name, amount }) {
  const formattedAmount = formatAmount(amount);
  const homeUrl = process.env.BASE_URL || "http://localhost:5173";

  return emailLayout({
    title: "Thank You for Your Donation!",
    previewText: "Thank you for supporting ViVe Wellness.",
    body: `
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        Hi ${escapeHtml(name || "friend")},
      </p>
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        Thank you for supporting ViVe Wellness. Your gift helps us continue creating culturally relevant wellness programs for children, families, and communities across Denver.
      </p>
      ${formattedAmount ? `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.blue}" style="width:100%;border-collapse:separate;margin:${emailTokens.spacing.section}px 0;background-color:${emailTokens.colors.blue};border-radius:${emailTokens.radius.card}px;">
          <tr>
            <td align="center" style="padding:${emailTokens.spacing.xxl}px;color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
              <p style="${typeStyle("bodyBold", {
                color: emailTokens.colors.white,
                WebkitTextFillColor: emailTokens.colors.white,
                margin: `0 0 ${emailTokens.spacing.sm}px`,
              })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
                Donation Amount
              </p>
              <p style="${typeStyle("h1", {
                color: emailTokens.colors.white,
                WebkitTextFillColor: emailTokens.colors.white,
                margin: "0",
              })};color:${emailTokens.colors.white} !important;-webkit-text-fill-color:${emailTokens.colors.white} !important;">
                ${escapeHtml(formattedAmount)}
              </p>
            </td>
          </tr>
        </table>
      ` : ""}
      <p style="${typeStyle("bodyBold", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        This email serves as your donation confirmation. You will be emailed with your receipt.
      </p>
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.section}px` })}">
        All contributions are tax deductible. ViVe Wellness is a 501(c)(3) charitable organization.
      </p>
      ${actionButton("Back to ViVe Wellness", homeUrl)}
    `,
  });
}

export function donationPaymentFailedEmail({ reason, retryUrl }) {
  return emailLayout({
    title: "Donation Could Not Be Completed",
    previewText: "Your donation could not be completed.",
    body: `
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        Your donation could not be completed.
      </p>
      ${detailCard([
        { label: "Reason", value: reason || "Your payment could not be completed." },
      ])}
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.section}px` })}">
        You can try your donation again using the button below.
      </p>
      ${actionButton("Retry Donation", retryUrl || `${process.env.BASE_URL || "http://localhost:5173"}/donate`)}
    `,
  });
}

export function donationRefundEmail({ amount }) {
  const formattedAmount = formatAmount(amount);

  return emailLayout({
    title: "Your Donation Was Refunded",
    previewText: "Your donation refund has been processed.",
    body: `
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        Your donation refund has been processed.
      </p>
      ${detailCard([
        { label: "Amount refunded", value: formattedAmount },
      ])}
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: "0" })}">
        If you have questions about this refund, please contact ViVe Wellness.
      </p>
    `,
  });
}

export function donationDisputeAlertEmail({ chargeId, amount }) {
  const formattedAmount = formatAmount(amount);

  return emailLayout({
    title: "Donation Dispute Opened",
    previewText: "A donation dispute has been opened in Stripe.",
    body: `
      <p style="${typeStyle("bodyBold", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        A donation dispute has been filed.
      </p>
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        The donor contacted their bank and claimed the charge was fraudulent or unauthorized. Log in to Stripe to review and respond.
      </p>
      ${detailCard([
        { label: "Charge ID", value: chargeId },
        { label: "Amount", value: formattedAmount },
      ])}
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.section}px` })}">
        Next steps: review donor information, upload evidence if needed, then submit evidence or accept the dispute in Stripe.
      </p>
      ${actionButton("Open Stripe Disputes", "https://dashboard.stripe.com/disputes")}
    `,
  });
}

export function donationAbandonedCheckoutEmail({ resumeUrl }) {
  return emailLayout({
    title: "Finish Your Donation",
    previewText: "You started a donation but did not finish.",
    body: `
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.md}px` })}">
        You started a donation to ViVe Wellness but did not finish checkout.
      </p>
      <p style="${typeStyle("body", { color: emailTokens.colors.black, margin: `0 0 ${emailTokens.spacing.section}px` })}">
        You can complete your donation using the button below.
      </p>
      ${actionButton("Complete Donation", resumeUrl || `${process.env.BASE_URL || "http://localhost:5173"}/donate`)}
    `,
  });
}
