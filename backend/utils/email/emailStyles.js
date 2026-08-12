export const emailTokens = {
  meta: {
    target: "html-email-inline-styles",
    maxWidth: 600,
    unsupported: ["clamp()", "vw", "CSS variables", "grid", "complex responsive layout"],
  },
  colors: {
    greenLight: "#F9FBF0",
    greenLightHover: "#F6F9E9",
    greenLightActive: "#EBF3D1",
    green: "#C0D969",
    greenHover: "#ADC35F",
    greenActive: "#9AAE54",
    greenDark: "#90A34F",
    greenDarker: "#434C25",
    blueLight: "#ECF3FE",
    blueLightHover: "#E2EDFD",
    blueLightActive: "#C3DAFC",
    blue: "#3C88F4",
    blueHover: "#367ADC",
    blueActive: "#306DC3",
    blueDark: "#2D66B7",
    blueDarker: "#153055",
    white: "#FFFFFF",
    black: "#000000",
    muted: "#8E98A8",
    guide: "#E9EBF8",
  },
  fonts: {
    display: "'ADLaM Display', Arial, sans-serif",
    heading: "'Fraunces', Georgia, serif",
    body: "'Manrope', Arial, sans-serif",
    fallback: "Arial, sans-serif",
  },
  fontImport:
    "https://fonts.googleapis.com/css2?family=ADLaM+Display&family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Manrope:wght@400;700&display=swap",
  type: {
    hero: {
      fontFamily: "'ADLaM Display', Arial, sans-serif",
      fontSize: 67,
      lineHeight: "120%",
      fontWeight: 400,
      letterSpacing: "-0.05em",
    },
    h1: {
      fontFamily: "'Fraunces', Georgia, serif",
      fontSize: 38,
      lineHeight: "120%",
      fontWeight: 900,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "'Fraunces', Georgia, serif",
      fontSize: 28,
      lineHeight: "120%",
      fontWeight: 900,
      letterSpacing: "-0.02em",
    },
    large: {
      fontFamily: "'Manrope', Arial, sans-serif",
      fontSize: 21,
      lineHeight: "120%",
      fontWeight: 400,
      letterSpacing: "-0.02em",
    },
    body: {
      fontFamily: "'Manrope', Arial, sans-serif",
      fontSize: 16,
      lineHeight: "120%",
      fontWeight: 400,
      letterSpacing: "0",
    },
    bodyBold: {
      fontFamily: "'Manrope', Arial, sans-serif",
      fontSize: 16,
      lineHeight: "120%",
      fontWeight: 700,
      letterSpacing: "0",
    },
    button: {
      fontFamily: "'Manrope', Arial, sans-serif",
      fontSize: 16,
      lineHeight: "120%",
      fontWeight: 700,
      letterSpacing: "0",
    },
    caption: {
      fontFamily: "'Manrope', Arial, sans-serif",
      fontSize: 14,
      lineHeight: "165%",
      fontWeight: 700,
      letterSpacing: "0",
    },
  },
  spacing: {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    section: 32,
    navGap: 40,
    footerGap: 29,
  },
  padding: {
    email: 32,
    cardX: 24,
    cardDetail: "16px 24px",
    button: "12px 20px",
    footerNavX: 50,
  },
  radius: {
    none: 0,
    sm: 5,
    md: 8,
    lg: 12,
    card: 24,
    pill: 90,
  },
  button: {
    height: 44,
    desktopHeight: 49,
    padding: "12px 20px",
    gap: 10,
    radius: 90,
    borderWidth: 3,
  },
  card: {
    width: 370,
    innerWidth: 322,
    imageWidth: 322,
    imageHeight: 256,
    paddingX: 24,
    radius: 24,
    detailGap: 16,
  },
  email: {
    maxWidth: 600,
    headerHeight: 285,
    footerHeight: 460,
    mainContentWidth: 600,
  },
  logo: {
    width: 260,
    height: 113,
  },
  image: {
    cardWidth: 322,
    cardHeight: 256,
    radius: 24,
  },
};

export function px(value) {
  return typeof value === "number" ? `${value}px` : value;
}

export function styleObjectToString(styleObject) {
  return Object.entries(styleObject)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      return `${cssKey}:${typeof value === "number" ? `${value}px` : value}`;
    })
    .join(";");
}

function important(value) {
  const stringValue = typeof value === "number" ? `${value}px` : String(value);

  if (stringValue.includes("!important")) {
    return stringValue;
  }

  return `${stringValue} !important`;
}

export function typeStyle(typeName, overrides = {}) {
  const type = emailTokens.type[typeName] || emailTokens.type.body;
  const mergedType = {
    fontFamily: type.fontFamily,
    fontSize: px(type.fontSize),
    lineHeight: type.lineHeight,
    fontWeight: type.fontWeight,
    letterSpacing: type.letterSpacing,
    ...overrides,
  };

  return styleObjectToString({
    ...mergedType,
    fontFamily: important(mergedType.fontFamily),
    fontSize: important(mergedType.fontSize),
    lineHeight: important(mergedType.lineHeight),
    fontWeight: important(mergedType.fontWeight),
    letterSpacing: important(mergedType.letterSpacing),
  });
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
