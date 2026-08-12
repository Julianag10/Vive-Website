import { emailTokens, escapeHtml, px, typeStyle } from "./emailStyles.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

function absoluteUrl(path) {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function headerNavLink(label, href) {
  return `
    <a class="vive-blue-text" href="${href}" style="${typeStyle("bodyBold", {
      color: emailTokens.colors.blue,
      WebkitTextFillColor: emailTokens.colors.blue,
      textDecoration: "none",
      display: "inline-block",
      fontWeight: "700 !important",
      margin: "0 10px 10px",
    })}">
      ${escapeHtml(label)}
    </a>
  `;
}

function footerCaption(text) {
  const captionStyle = typeStyle("caption", {
    color: `${emailTokens.colors.blue} !important`,
    margin: 0,
    textAlign: "center",
  });

  return `
    <p class="footer-caption vive-blue-text" style="${captionStyle};margin:0 0 8px !important;">
      <span style="${captionStyle}">${escapeHtml(text)}</span>
    </p>
  `;
}

export function emailLayout({ title, body, previewText = "" }) {
  const logoUrl = absoluteUrl("/uploads/logo/main_logo.png");

  return `
    <!doctype html>
    <html style="margin:0 !important;padding:0 !important;width:100% !important;min-width:100% !important;background-color:${emailTokens.colors.white} !important;background:${emailTokens.colors.white} !important;">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="${emailTokens.fontImport}" rel="stylesheet">
        <style>
          @import url("${emailTokens.fontImport}");

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-width: 100% !important;
          }

          body, table, td, p, a, div {
            font-family: ${emailTokens.fonts.body} !important;
          }

          a {
            font-weight: 700 !important;
          }

          h1 {
            font-family: ${emailTokens.fonts.display} !important;
          }

          h2 {
            font-family: ${emailTokens.fonts.heading} !important;
          }

          .vive-green-bg {
            background-color: ${emailTokens.colors.green} !important;
            background: ${emailTokens.colors.green} !important;
            background-image: linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green}) !important;
            color-scheme: light !important;
          }

          .email-white-bg {
            background-color: ${emailTokens.colors.white} !important;
            background: ${emailTokens.colors.white} !important;
            background-image: linear-gradient(${emailTokens.colors.white}, ${emailTokens.colors.white}) !important;
            color-scheme: light !important;
          }

          .vive-blue-text,
          .vive-blue-text span,
          .vive-blue-text a {
            color: ${emailTokens.colors.blue} !important;
            -webkit-text-fill-color: ${emailTokens.colors.blue} !important;
          }

          .vive-black-text,
          .vive-black-text span,
          .vive-black-text a {
            color: ${emailTokens.colors.black} !important;
            -webkit-text-fill-color: ${emailTokens.colors.black} !important;
          }

          .vive-white-text,
          .vive-white-text span,
          .vive-white-text a {
            color: ${emailTokens.colors.white} !important;
            -webkit-text-fill-color: ${emailTokens.colors.white} !important;
          }

          .footer-caption,
          .footer-caption span,
          .footer-caption a,
          a[x-apple-data-detectors],
          .unstyle-auto-link a {
            color: ${emailTokens.colors.blue} !important;
            font-family: ${emailTokens.fonts.body} !important;
            font-size: 14px !important;
            line-height: 165% !important;
            font-weight: 700 !important;
            letter-spacing: 0 !important;
            text-decoration: none !important;
          }

          @media (prefers-color-scheme: dark) {
            html,
            body,
            .email-white-bg,
            .email-shell {
              background-color: ${emailTokens.colors.white} !important;
              background: ${emailTokens.colors.white} !important;
              background-image: linear-gradient(${emailTokens.colors.white}, ${emailTokens.colors.white}) !important;
            }

            .vive-green-bg {
              background-color: ${emailTokens.colors.green} !important;
              background: ${emailTokens.colors.green} !important;
              background-image: linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green}) !important;
            }

            .vive-blue-text,
            .vive-blue-text span,
            .vive-blue-text a,
            .footer-caption,
            .footer-caption span,
            .footer-caption a {
              color: ${emailTokens.colors.blue} !important;
              -webkit-text-fill-color: ${emailTokens.colors.blue} !important;
            }

            .vive-black-text,
            .vive-black-text span,
            .vive-black-text a {
              color: ${emailTokens.colors.black} !important;
              -webkit-text-fill-color: ${emailTokens.colors.black} !important;
            }

            .vive-white-text,
            .vive-white-text span,
            .vive-white-text a {
              color: ${emailTokens.colors.white} !important;
              -webkit-text-fill-color: ${emailTokens.colors.white} !important;
            }
          }

          [data-ogsc] html,
          [data-ogsc] body,
          [data-ogsc] .email-white-bg,
          [data-ogsc] .email-shell {
            background-color: ${emailTokens.colors.white} !important;
            background: ${emailTokens.colors.white} !important;
          }

          [data-ogsc] .vive-green-bg {
            background-color: ${emailTokens.colors.green} !important;
            background: ${emailTokens.colors.green} !important;
            background-image: linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green}) !important;
          }

          [data-ogsc] .vive-blue-text,
          [data-ogsc] .vive-blue-text span,
          [data-ogsc] .vive-blue-text a,
          [data-ogsc] .footer-caption,
          [data-ogsc] .footer-caption span,
          [data-ogsc] .footer-caption a {
            color: ${emailTokens.colors.blue} !important;
            -webkit-text-fill-color: ${emailTokens.colors.blue} !important;
          }

          [data-ogsc] .vive-black-text,
          [data-ogsc] .vive-black-text span,
          [data-ogsc] .vive-black-text a {
            color: ${emailTokens.colors.black} !important;
            -webkit-text-fill-color: ${emailTokens.colors.black} !important;
          }

          [data-ogsc] .vive-white-text,
          [data-ogsc] .vive-white-text span,
          [data-ogsc] .vive-white-text a {
            color: ${emailTokens.colors.white} !important;
            -webkit-text-fill-color: ${emailTokens.colors.white} !important;
          }

          u + .body .vive-green-bg {
            background-color: ${emailTokens.colors.green} !important;
            background: ${emailTokens.colors.green} !important;
            background-image: linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green}) !important;
          }

          u + .body .email-white-bg {
            background-color: ${emailTokens.colors.white} !important;
            background: ${emailTokens.colors.white} !important;
            background-image: linear-gradient(${emailTokens.colors.white}, ${emailTokens.colors.white}) !important;
          }

          @media only screen and (max-width: 420px) {
            .email-shell { width: 100% !important; }
            .email-pad { padding-left: 16px !important; padding-right: 16px !important; }
            .email-button { display: block !important; text-align: center !important; }
          }
        </style>
      </head>
      <body class="body email-white-bg" bgcolor="${emailTokens.colors.white}" style="margin:0 !important;padding:0 !important;width:100% !important;min-width:100% !important;background-color:${emailTokens.colors.white} !important;background:${emailTokens.colors.white} !important;background-image:linear-gradient(${emailTokens.colors.white}, ${emailTokens.colors.white}) !important;">
        ${
          previewText
            ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(previewText)}</div>`
            : ""
        }
        <table class="email-white-bg" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.white}" style="width:100% !important;min-width:100% !important;background-color:${emailTokens.colors.white} !important;background:${emailTokens.colors.white} !important;background-image:linear-gradient(${emailTokens.colors.white}, ${emailTokens.colors.white}) !important;margin:0 !important;padding:0 !important;">
          <tr>
            <td align="center" class="email-white-bg" bgcolor="${emailTokens.colors.white}" style="padding:0 !important;background-color:${emailTokens.colors.white} !important;background:${emailTokens.colors.white} !important;background-image:linear-gradient(${emailTokens.colors.white}, ${emailTokens.colors.white}) !important;">
              <table class="email-shell email-white-bg" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.white}" style="width:100% !important;min-width:100% !important;max-width:none !important;background-color:${emailTokens.colors.white} !important;background:${emailTokens.colors.white} !important;background-image:linear-gradient(${emailTokens.colors.white}, ${emailTokens.colors.white}) !important;border-collapse:collapse;">
                <tr>
                  <td class="email-pad vive-green-bg" align="center" bgcolor="${emailTokens.colors.green}" style="width:100% !important;min-width:100% !important;background-color:${emailTokens.colors.green} !important;background:${emailTokens.colors.green} !important;background-image:linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green}) !important;padding:${px(emailTokens.padding.email)};min-height:${px(emailTokens.email.headerHeight)};">
                    <img src="${logoUrl}" alt="ViVe Wellness" width="${emailTokens.logo.width}" style="display:block;width:${px(emailTokens.logo.width)};max-width:100%;height:auto;margin:0 auto ${px(emailTokens.spacing.lg)};">

                    <div style="text-align:center;">
                      ${headerNavLink("Vive Home", `${BASE_URL}`)}
                      ${headerNavLink("Volunteer", `${BASE_URL}/volunteer`)}
                      ${headerNavLink("Donate", `${BASE_URL}/donate`)}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td class="email-pad email-white-bg" bgcolor="${emailTokens.colors.white}" style="background-color:${emailTokens.colors.white} !important;background:${emailTokens.colors.white} !important;padding:${px(emailTokens.padding.email)};">
                    <h1 class="vive-blue-text" style="${typeStyle("hero", {
                      color: emailTokens.colors.blue,
                      WebkitTextFillColor: emailTokens.colors.blue,
                      fontSize: "48px",
                      fontWeight: 400,
                      margin: `0 0 ${px(emailTokens.spacing.xxl)}`,
                      textAlign: "center",
                    })}">
                      ${escapeHtml(title)}
                    </h1>

                    <div class="vive-black-text" style="${typeStyle("body", {
                      color: emailTokens.colors.black,
                      WebkitTextFillColor: emailTokens.colors.black,
                      margin: 0,
                    })}">
                      ${body}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td class="email-pad vive-green-bg" align="center" bgcolor="${emailTokens.colors.green}" style="width:100% !important;min-width:100% !important;background-color:${emailTokens.colors.green} !important;background:${emailTokens.colors.green} !important;background-image:linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green}) !important;padding:${px(emailTokens.padding.email)};min-height:${px(emailTokens.email.footerHeight)};">
                    <div style="text-align:center;margin:0 0 ${px(emailTokens.spacing.footerGap)};">
                      ${headerNavLink("Vive Home", `${BASE_URL}`)}
                      ${headerNavLink("Volunteer", `${BASE_URL}/volunteer`)}
                      ${headerNavLink("Contact", `${BASE_URL}/contact`)}
                      ${headerNavLink("Donate", `${BASE_URL}/donate`)}
                    </div>

                    <img src="${logoUrl}" alt="ViVe Wellness" width="${emailTokens.logo.width}" style="display:block;width:${px(emailTokens.logo.width)};max-width:100%;height:auto;margin:0 auto ${px(emailTokens.spacing.footerGap)};">

                    <div class="unstyle-auto-link" style="text-align:center;">
                      ${footerCaption("PO BOX 11003, Denver CO 80211")}
                      ${footerCaption("(720) 440-1235 | info@vivewellness.org")}
                      ${footerCaption("© 2022 by Vive Wellness. All Rights Reserved.")}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
