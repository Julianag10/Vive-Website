import { emailTokens, escapeHtml, px, typeStyle } from "../emailStyles.js";

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

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function ordinalDay(day) {
  const value = Number(day);

  if (!Number.isFinite(value)) {
    return day;
  }

  const mod100 = value % 100;

  if (mod100 >= 11 && mod100 <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

function formatEmailDateOnly(value) {
  if (!value) {
    return "";
  }

  const stringValue = String(value);
  const date = /^\d{4}-\d{2}-\d{2}/.test(stringValue)
    ? new Date(`${stringValue.slice(0, 10)}T00:00:00Z`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return stringValue;
  }

  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(date);
  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
  const year = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return `${weekday} ${month} ${ordinalDay(day)} ${year}`;
}

function formatDisplayTime(value) {
  if (!value) {
    return "";
  }

  const [hourString, minuteString = "00"] = String(value).split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return String(value);
  }

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function compactTimeRange(timeRange) {
  return String(timeRange)
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function weekdayFromDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(date);
}

function formatScheduleTime(day = {}) {
  const explicitTime = firstValue(day.time, day.scheduleTime, day.schedule_time);

  if (explicitTime) {
    return compactTimeRange(explicitTime);
  }

  const startTime = firstValue(day.startTime, day.start_time);
  const endTime = firstValue(day.endTime, day.end_time);

  if (startTime && endTime) {
    return `${formatDisplayTime(startTime)}-${formatDisplayTime(endTime)}`;
  }

  return formatDisplayTime(startTime || endTime);
}

function formatSchedule(item = {}) {
  const scheduleDays = firstValue(item.scheduleDays, item.schedule_days, item.occurrences);

  if (Array.isArray(scheduleDays) && scheduleDays.length > 0) {
    return scheduleDays
      .map((day) => {
        const dayLabel = firstValue(
          day.day_of_week,
          day.dayOfWeek,
          day.weekday,
          day.day,
          weekdayFromDate(firstValue(day.date, day.startDate, day.start_date, day.occurrence_date))
        );
        const time = formatScheduleTime(day);

        if (dayLabel && time) {
          return `<span style="white-space:nowrap;"><strong style="font-weight:700;">${escapeHtml(dayLabel)}:</strong> ${escapeHtml(time)}</span>`;
        }

        return escapeHtml(dayLabel || time);
      })
      .filter(Boolean)
      .join("<br>");
  }

  return escapeHtml(firstValue(item.scheduleText, item.schedule_text, ""));
}

function formatActivities(item = {}) {
  const activities = firstValue(item.activities, item.notes, item.activityList);

  if (Array.isArray(activities) && activities.length > 0) {
    return `
      <ul style="margin:0;padding:0 0 0 26px;">
        ${activities.map((activity) => `<li style="margin:0 0 6px;">${escapeHtml(activity)}</li>`).join("")}
      </ul>
    `;
  }

  if (!activities) {
    return "";
  }

  return `<p style="margin:0;">${escapeHtml(activities)}</p>`;
}

function pillButton({
  href,
  label,
  background = emailTokens.colors.white,
  color = emailTokens.colors.blue,
  border = "3px solid transparent",
  width = "",
  padding = "24px 40px",
}) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="border-collapse:separate;margin:0 auto;width:${width || "auto"};">
      <tr>
        <td align="center" bgcolor="${background}" style="background-color:${background};border:${border};border-radius:${px(emailTokens.radius.pill)};">
          <a href="${href || "#"}" style="${typeStyle("button", {
            color,
            WebkitTextFillColor: color,
            display: "inline-block",
            textDecoration: "none",
            padding,
            fontSize: "32px",
            fontWeight: "900 !important",
            minWidth: width ? "100%" : "",
            boxSizing: "border-box",
            borderRadius: px(emailTokens.radius.pill),
            whiteSpace: "nowrap",
          })}">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function navButton(label, href, variant = "white") {
  const variants = {
    white: {
      background: emailTokens.colors.white,
      color: emailTokens.colors.blue,
      border: "3px solid transparent",
    },
    blue: {
      background: emailTokens.colors.blue,
      color: emailTokens.colors.white,
      border: "3px solid transparent",
    },
    outline: {
      background: emailTokens.colors.white,
      color: emailTokens.colors.blue,
      border: `3px solid ${emailTokens.colors.blue}`,
    },
  };
  const style = variants[variant] || variants.white;

  return `
    <td class="header-nav-cell" align="center" width="33.333%" style="width:33.333%;padding:0 10px;">
      ${pillButton({
        href,
        label,
        background: style.background,
        color: style.color,
        border: style.border,
      })}
    </td>
  `;
}

function infoCard(label, value, { bodyAlign = "center" } = {}) {
  return `
    <table class="mobile-info-card" role="presentation" width="166" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="${emailTokens.colors.green}" style="width:166px;max-width:166px;border-collapse:separate;background-color:${emailTokens.colors.green};border-radius:${px(emailTokens.radius.card)};">
      <tr>
        <td class="mobile-info-card-cell" align="center" valign="top" style="padding:64px 64px;vertical-align:top;">
          <h2 class="mobile-info-heading" style="${typeStyle("h2", {
            color: emailTokens.colors.black,
            WebkitTextFillColor: emailTokens.colors.black,
            margin: "0 0 10px",
            fontSize: "60px",
            textAlign: "center",
          })}">
            ${escapeHtml(label)}
          </h2>
          <p class="mobile-info-copy" style="${typeStyle("large", {
            color: emailTokens.colors.black,
            WebkitTextFillColor: emailTokens.colors.black,
            margin: 0,
            textAlign: bodyAlign,
            fontFamily: "'Inter', Arial, sans-serif !important",
            fontSize: "44px",
          })}">
            ${value || "TBD"}
          </p>
        </td>
      </tr>
    </table>
  `;
}

export function registrationConfirmationEmail({
  name,
  item = {},
  type,
  manageUrl = "",
  heroTitle = "You're Registered!",
  headerNoticeText = "",
  headerStatsText = "",
}) {
  const resourceLabel = type === "event" ? "event" : "program";
  const title = firstValue(item.title, item.name, resourceLabel);
  const description = firstValue(item.description, item.shortDescription, item.summary, "");
  const location = firstValue(item.location, item.address, "TBD");
  const startDate = firstValue(item.startDate, item.start_date, item.date, "");
  const startTime = firstValue(item.startTime, item.start_time, item.time, "");
  const endDate = firstValue(item.endDate, item.end_date, "");
  const endTime = firstValue(item.endTime, item.end_time, "");
  const displayStartDate = formatEmailDateOnly(startDate);
  const displayEndDate = formatEmailDateOnly(endDate);
  const programImagePath = type === "program" ? firstValue(
    item.imageUrl,
    item.image_url,
    item.mainImageUrl,
    item.main_image_url
  ) : "";
  const imageUrl = absoluteUrl(programImagePath);
  const shouldShowImage = type === "program" && imageUrl;
  const participantName = firstValue(name, "Participant Name");
  const schedule = formatSchedule(item);
  const stats = firstValue(item.statsText, item.capacityText, item.registrationStatus, item.spotsText, "");
  const capacity = firstValue(item.capacity, item.resourceCapacity);
  const waitlistPosition = Number(firstValue(item.waitlistPosition, item.waitlist_position, 0));
  const waitlistAheadCount = waitlistPosition > 0 ? waitlistPosition - 1 : null;
  const isWaitlistEmail = heroTitle.toLowerCase().includes("waitlist");
  const waitlistAheadText = waitlistAheadCount === null
    ? "Waitlist position is not available yet"
    : waitlistAheadCount === 1
      ? "1 person ahead of your waitlist spot"
      : `${waitlistAheadCount} people ahead of your waitlist spot`;
  const shouldShowHeaderNotice = Boolean(headerNoticeText) || isWaitlistEmail;
  const headerNotice = headerNoticeText ||
    "If a spot opens up, you will be automatically registered and an email will be sent to you containing the registration information.";
  const headerStats = headerStatsText ||
    `Capacity: ${capacity ?? "Not set"} \u00a0\u2022\u00a0 ${waitlistAheadText}`;
  const registerUrl = absoluteUrl(firstValue(item.registerUrl, manageUrl, "/programs"));
  const learnMoreUrl = absoluteUrl(firstValue(item.learnMoreUrl, manageUrl, "/programs"));
  const safeManageUrl = absoluteUrl(firstValue(manageUrl, item.manageUrl, "/programs"));
  const logoUrl = absoluteUrl("/uploads/logo/main_logo.png");

  return `
    <!doctype html>
    <html lang="en" style="margin:0;padding:0;background:${emailTokens.colors.white};">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>Confirm Registration</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="${emailTokens.fontImport}" rel="stylesheet">
        <style>
          @import url("${emailTokens.fontImport}");

          body, table, td, p, a, h1, h2, li {
            -webkit-text-size-adjust: 100%;
          }

          @media only screen and (max-width: 599px) {
            .email-shell { width: 100% !important; }
            .mobile-pad { padding-left: 0 !important; padding-right: 0 !important; }
            .mobile-details-layout { width: 100% !important; max-width: 100% !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-card { width: 88% !important; margin-left: auto !important; margin-right: auto !important; }
            .mobile-card-title-cell { padding: 64px 32px 64px !important; }
            .mobile-card-image-cell { padding-left: 64px !important; padding-right: 64px !important; }
            .mobile-card-actions-cell { padding: 22px 30px 40px !important; }
            .mobile-card-img { width: 100% !important; height: auto !important; }
            .mobile-info-cell { padding-left: 0 !important; padding-top: 16px !important; text-align: center !important; }
            .mobile-info-card { width: 88% !important; max-width: 88% !important; height: auto !important; margin-left: auto !important; margin-right: auto !important; }
            .mobile-info-card-cell { padding: 64px 64px !important; vertical-align: top !important; }
            .mobile-info-heading { font-size: 128px !important; margin-bottom: 32px !important; }
            .mobile-info-copy { font-size: 44px !important; }
            .mobile-action-card { width: 88% !important; height: auto !important; max-width: none !important; margin-left: auto !important; margin-right: auto !important; }
            .mobile-action-card-content { padding: 46px 48px 18px !important; }
            .mobile-action-card-button-cell { padding: 0 48px 46px !important; }
            .mobile-action-heading { font-size: 68px !important; }
            .responsive-logo { width: 70% !important; max-width: 320px !important; }
            .header-nav-cell { padding-left: 4px !important; padding-right: 4px !important; }
            .footer-nav-cell { padding-left: 4px !important; padding-right: 4px !important; }
            .mobile-hero { font-size: 74px !important; letter-spacing: -3px !important; }
            .mobile-name { font-size: 40px !important; }
            .mobile-card-title { font-size: 44px !important; }
            .mobile-card-copy { font-size: 44px !important; }
            .mobile-stat-copy { font-size: 18px !important; }
            .mobile-action-heading { font-size: 44px !important; }
          }
        </style>
      </head>
      <body bgcolor="${emailTokens.colors.white}" style="margin:0;padding:0;background-color:${emailTokens.colors.white};font-family:${emailTokens.fonts.body};color:${emailTokens.colors.black};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.white}" style="width:100%;border-collapse:collapse;background-color:${emailTokens.colors.white};">
          <tr>
            <td align="center">
              <table class="email-shell" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.white}" style="width:100%;max-width:720px;border-collapse:collapse;background-color:${emailTokens.colors.white};">
                <tr>
                  <td align="center" bgcolor="${emailTokens.colors.green}" style="padding:96px 32px 0;background-color:${emailTokens.colors.green};background-image:linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green});">
                    <img class="responsive-logo" src="${logoUrl}" width="360" alt="Vive Wellness" style="display:block;width:60%;max-width:360px;height:auto;border:0;">

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:100%;border-collapse:separate;margin:32px auto 0;table-layout:fixed;">
                      <tr>
                        <td align="center" style="padding:23px 0;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="width:100%;border-collapse:separate;margin:0 auto;table-layout:fixed;">
                            <tr>
                              ${navButton("Volunteer", absoluteUrl("/volunteer"), "white")}
                              ${navButton("Programs", absoluteUrl("/programs"), "blue")}
                              ${navButton("Donate", absoluteUrl("/donate"), "outline")}
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" bgcolor="${emailTokens.colors.green}" style="padding:32px 16px 160px;background-color:${emailTokens.colors.green};background-image:linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green});">
                    <h1 class="mobile-hero" style="${typeStyle("hero", {
                      color: emailTokens.colors.blue,
                      WebkitTextFillColor: emailTokens.colors.blue,
                      margin: 0,
                      textAlign: "center",
                      fontSize: "120px",
                      letterSpacing: "-6px",
                      whiteSpace: "nowrap",
                    })}">
                      ${escapeHtml(heroTitle)}
                    </h1>
                    <h2 class="mobile-name" style="${typeStyle("h2", {
                      color: emailTokens.colors.black,
                      WebkitTextFillColor: emailTokens.colors.black,
                      margin: "8px 0 0",
                      textAlign: "right",
                      fontSize: "60px",
                    })}">
                      ${escapeHtml(participantName)}
                    </h2>
                    ${shouldShowHeaderNotice
                      ? `
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="width:100%;max-width:100%;border-collapse:collapse;margin:32px auto 0;background:transparent;background-color:transparent;">
                          <tr style="background:transparent;background-color:transparent;">
                            <td align="center" width="100%" style="width:100%;padding:0;background:transparent;background-color:transparent;">
                              <p style="${typeStyle("body", {
                                color: emailTokens.colors.black,
                                WebkitTextFillColor: emailTokens.colors.black,
                                margin: "0 0 24px",
                                textAlign: "center",
                                fontSize: "28px",
                                lineHeight: "135%",
                              })}">
                                ${escapeHtml(headerNotice)}
                              </p>
                              ${headerStats
                                ? `
                                  <p style="${typeStyle("bodyBold", {
                                    color: emailTokens.colors.black,
                                    WebkitTextFillColor: emailTokens.colors.black,
                                    margin: 0,
                                    textAlign: "center",
                                    fontSize: "30px",
                                    fontWeight: "900 !important",
                                    lineHeight: "135%",
                                  })}">
                                    ${escapeHtml(headerStats)}
                                  </p>
                                `
                                : ""}
                            </td>
                          </tr>
                        </table>
                      `
                      : ""}
                  </td>
                </tr>

                <tr>
                  <td class="mobile-pad" align="center" bgcolor="${emailTokens.colors.white}" style="padding:0 32px 32px;background-color:${emailTokens.colors.white};">
                    <table class="mobile-details-layout" role="presentation" width="536" cellspacing="0" cellpadding="0" border="0" style="width:536px;max-width:100%;border-collapse:collapse;margin:-128px auto 0;">
                      <tr>
                        <td class="mobile-stack" valign="top" width="370" style="width:370px;">
                          <table class="mobile-card" role="presentation" width="370" cellspacing="0" cellpadding="0" border="0" bgcolor="${emailTokens.colors.blue}" style="width:370px;border-collapse:separate;background-color:${emailTokens.colors.blue};border-radius:${px(emailTokens.radius.card)};">
                            <tr>
                              <td class="mobile-card-title-cell" align="center" style="padding:64px 32px 64px;">
                                <h2 class="mobile-card-title" style="${typeStyle("h1", {
                                  color: emailTokens.colors.white,
                                  WebkitTextFillColor: emailTokens.colors.white,
                                  margin: 0,
                                  textAlign: "center",
                                  fontSize: "60px",
                                })}">
                                  ${escapeHtml(title)}
                                </h2>
                              </td>
                            </tr>
                            ${
                              shouldShowImage
                                ? `
                                  <tr>
                                    <td class="mobile-card-image-cell" align="center" style="padding:0 64px;">
                                      <img class="mobile-card-img" src="${imageUrl}" width="322" height="256" alt="${escapeHtml(title)}" style="display:block;width:322px;height:256px;border:0;border-radius:${px(emailTokens.radius.card)};object-fit:cover;">
                                    </td>
                                  </tr>

                                  <tr>
                                    <td height="32" style="height:32px;line-height:32px;font-size:32px;">&nbsp;</td>
                                  </tr>
                                `
                                : ""
                            }

                            <tr>
                              <td class="mobile-card-copy" style="${typeStyle("large", {
                                color: emailTokens.colors.white,
                                WebkitTextFillColor: emailTokens.colors.white,
                                fontSize: "44px",
                                padding: "48px 128px",
                              })}">

                                ${description ? `<p style="margin:0 0 32px;">${escapeHtml(description)}</p>` : ""}

                                <p style="margin:0 0 32px;">
                                  <strong style="font-weight:700;">Starts:</strong> ${escapeHtml(displayStartDate || "TBD")}<br>
                                  <strong style="font-weight:700;">Ends:</strong> ${escapeHtml(displayEndDate || "TBD")}
                                </p>
                                <div style="margin:0;">
                                  ${formatActivities(item)}
                                </div>
                              </td>
                            </tr>
                            ${
                              stats
                                ? `
                                  <tr>
                                    <td height="32" style="height:32px;line-height:32px;font-size:32px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="center" style="padding:0 48px;">
                                      <p class="mobile-stat-copy" style="${typeStyle("caption", {
                                        color: emailTokens.colors.white,
                                        WebkitTextFillColor: emailTokens.colors.white,
                                        fontSize: "44px",
                                        margin: 0,
                                        textAlign: "center",
                                      })}">
                                        ${escapeHtml(stats)}
                                      </p>
                                    </td>
                                  </tr>
                                `
                                : ""
                            }
                            <tr>
                              <td height="32" style="height:32px;line-height:32px;font-size:32px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td class="mobile-card-actions-cell" align="center" style="padding:22px 30px 40px;">
                                ${pillButton({
                                  href: registerUrl,
                                  label: stats?.toLowerCase().includes("waitlist") ? "Join Waitlist" : "Register",
                                  background: emailTokens.colors.green,
                                  color: emailTokens.colors.blue,
                                  border: `3px solid ${emailTokens.colors.white}`,
                                  width: "100%",
                                })}
                                <div style="height:32px;line-height:32px;font-size:32px;">&nbsp;</div>
                                ${pillButton({
                                  href: learnMoreUrl,
                                  label: "Learn More",
                                  background: emailTokens.colors.white,
                                  color: emailTokens.colors.blue,
                                  width: "100%",
                                })}
                              </td>
                            </tr>
                          </table>
                        </td>

                        <td class="mobile-stack mobile-info-cell" valign="top" width="166" style="width:166px;padding-left:16px;">
                          ${infoCard("Location", escapeHtml(location).replaceAll("\n", "<br>"))}
                          <div style="height:31px;line-height:31px;font-size:31px;">&nbsp;</div>
                          ${infoCard("Schedule", schedule || "TBD", { bodyAlign: "left" })}
                        </td>
                      </tr>
                    </table>

                    <table class="mobile-action-card" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="${emailTokens.colors.green}" style="width:auto;border-collapse:separate;margin:32px auto 0;background-color:${emailTokens.colors.green};border-radius:${px(emailTokens.radius.card)};">
                      <tr>
                        <td class="mobile-action-card-content" style="padding:16px 32px 8px;">
                          <h2 class="mobile-action-heading" style="${typeStyle("h2", {
                            color: emailTokens.colors.blue,
                            WebkitTextFillColor: emailTokens.colors.blue,
                            margin: 0,
                            textAlign: "right",
                            fontSize: "60px",
                          })}">
                            Look Up Registration?
                          </h2>
                          <div style="height:32px;line-height:16px;font-size:16px;">&nbsp;</div>
                          <h2 class="mobile-action-heading" style="${typeStyle("h2", {
                            color: emailTokens.colors.blue,
                            WebkitTextFillColor: emailTokens.colors.blue,
                            margin: 0,
                            fontSize: "60px",
                          })}">
                            Cancel Registration?
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td class="mobile-action-card-button-cell" align="center" style="padding:0 32px 16px;">
                          ${pillButton({
                            href: safeManageUrl,
                            label: "Manage Registration",
                            background: emailTokens.colors.white,
                            color: emailTokens.colors.blue,
                            border: `3px solid ${emailTokens.colors.blue}`,
                          })}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" bgcolor="${emailTokens.colors.green}" style="padding:56px 32px 72px;background-color:${emailTokens.colors.green};background-image:linear-gradient(${emailTokens.colors.green}, ${emailTokens.colors.green});">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="width:100%;border-collapse:collapse;margin:0 auto 29px;table-layout:fixed;">
                      <tr>
                        ${["HOME", "VOLUNTEER", "DONATE", "CONTACT US"].map((label) => {
                          const hrefs = {
                            HOME: "/",
                            VOLUNTEER: "/volunteer",
                            DONATE: "/donate",
                            "CONTACT US": "/contact",
                          };

                          return `
                            <td class="footer-nav-cell" align="center" width="25%" style="width:25%;padding:0 10px;">
                              <a href="${absoluteUrl(hrefs[label])}" style="${typeStyle("large", {
                                color: emailTokens.colors.blue,
                                WebkitTextFillColor: emailTokens.colors.blue,
                                fontSize: "32px",
                                textDecoration: "none",
                                fontWeight: "900 !important",
                              })}">${escapeHtml(label)}</a>
                            </td>
                          `;
                        }).join("")}
                      </tr>
                    </table>

                    <img class="responsive-logo" src="${logoUrl}" width="360" alt="Vive Wellness" style="display:block;width:60%;max-width:360px;height:auto;border:0;margin:0 auto 29px;">

                    <p style="${typeStyle("caption", {
                      color: emailTokens.colors.blue,
                      WebkitTextFillColor: emailTokens.colors.blue,
                      fontSize: "44px",
                      fontWeight: "900 !important",
                      margin: "0 0 29px",
                      textAlign: "center",
                    })}">
                      <a href="https://www.youtube.com/" style="color:${emailTokens.colors.blue};text-decoration:none;font-weight:900;">YouTube</a>
                      &nbsp;&nbsp;&nbsp;
                      <a href="https://www.instagram.com/" style="color:${emailTokens.colors.blue};text-decoration:none;font-weight:900;">Instagram</a>
                      &nbsp;&nbsp;&nbsp;
                      <a href="https://www.facebook.com/" style="color:${emailTokens.colors.blue};text-decoration:none;font-weight:900;">Facebook</a>
                    </p>

                    <p style="${typeStyle("bodyBold", {
                      color: emailTokens.colors.blue,
                      WebkitTextFillColor: emailTokens.colors.blue,
                      fontSize: "44px",
                      fontWeight: "900 !important",
                      margin: "0 0 80px",
                      textAlign: "center",
                    })}">
                      <a href="https://vivewellness.org" style="color:${emailTokens.colors.blue};text-decoration:none;font-weight:900;">vivewellness.org</a><br>
                      PO BOX 11003, Denver CO 80211
                    </p>
                    <p style="${typeStyle("bodyBold", {
                      color: emailTokens.colors.blue,
                      WebkitTextFillColor: emailTokens.colors.blue,
                      fontSize: "44px",
                      fontWeight: "900 !important",
                      margin: 0,
                      textAlign: "center",
                    })}">
                      © 2022 by Vive Wellness. All Rights Reserved.
                    </p>
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

export function waitlistRegistrationEmail(options = {}) {
  return registrationConfirmationEmail({
    ...options,
    heroTitle: "You're Waitlisted!",
  });
}

export function waitlistPromotedRegistrationEmail(options = {}) {
  return registrationConfirmationEmail({
    ...options,
    heroTitle: "You're Registered!",
    headerNoticeText: "A spot opened up. You have been automatically registered!",
    headerStatsText: "",
  });
}
