export const CONTACT_DETAILS = [
  {
    icon: <LocationIcon />,
    label: "Location",
    value: "PO BOX 11003, Denver CO 80211",
    href: "https://www.google.com/maps/search/?api=1&query=PO+BOX+11003+Denver+CO+80211",
  },
  {
    icon: <PhoneIcon />,
    label: "Phone",
    value: "(720) 440-1235",
    href: "tel:+17204401235",
  },
  {
    icon: <MailIcon />,
    label: "Email",
    value: "info@vivewellness.org",
    href: "mailto:info@vivewellness.org",
  },
];

export const SOCIAL_LINKS = [
  {
    icon: <InstagramIcon />,
    label: "Instagram",
    href: "https://www.instagram.com/viveewellness/",
  },
  {
    icon: <FacebookIcon />,
    label: "Facebook",
    href: "https://www.facebook.com/vivewellness/",
  },
  {
    icon: <YouTubeIcon />,
    label: "YouTube",
    href: "https://www.youtube.com/@vivewellnessorg",
  },
];

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 22s7-6.1 7-13A7 7 0 0 0 5 9c0 6.9 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M22 12s0-3.4-.4-5a3 3 0 0 0-2.1-2.1C17.8 4.5 12 4.5 12 4.5s-5.8 0-7.5.4A3 3 0 0 0 2.4 7C2 8.6 2 12 2 12s0 3.4.4 5a3 3 0 0 0 2.1 2.1c1.7.4 7.5.4 7.5.4s5.8 0 7.5-.4a3 3 0 0 0 2.1-2.1c.4-1.6.4-5 .4-5Z" />
      <path d="m10 15 5-3-5-3v6Z" />
    </svg>
  );
}

export function ContactInfoList({ items = CONTACT_DETAILS }) {
  return (
    <div className="contact-info-list">
      {items.map((item) => (
        <a className="contact-info-item" href={item.href} key={item.label}>
          <span className="contact-info-icon">{item.icon}</span>
          <span>{item.value}</span>
        </a>
      ))}
    </div>
  );
}

export function SocialLinks({ links = SOCIAL_LINKS }) {
  return (
    <section className="contact-social-section">
      <h2>Like and follow us!</h2>
      <div className="contact-social-links">
        {links.map((link) => (
          <a
            aria-label={link.label}
            href={link.href}
            key={link.label}
            rel="noreferrer"
            target="_blank"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </section>
  );
}
