export const CONTACT_DETAILS = [
  {
    icon: <ContactIconImage src="/uploads/icons/location-pin.svg" alt="" />,
    label: "Location",
    value: "PO BOX 11003, Denver CO 80211",
    href: "https://www.google.com/maps/search/?api=1&query=PO+BOX+11003+Denver+CO+80211",
  },
  {
    icon: <ContactIconImage src="/uploads/icons/telephone.svg" alt="" />,
    label: "Phone",
    value: "(720) 440-1235",
    href: "tel:+17204401235",
  },
  {
    icon: <ContactIconImage src="/uploads/icons/enveloper-fill.svg" alt="" />,
    label: "Email",
    value: "info@vivewellness.org",
    href: "mailto:info@vivewellness.org",
  },
];

export const SOCIAL_LINKS = [
  {
    icon: <ContactIconImage src="/uploads/icons/instagram.svg" alt="" />,
    label: "Instagram",
    href: "https://www.instagram.com/viveewellness/",
  },
  {
    icon: <ContactIconImage src="/uploads/icons/facebook.svg" alt="" />,
    label: "Facebook",
    href: "https://www.facebook.com/vivewellness/",
  },
  {
    icon: <ContactIconImage src="/uploads/icons/youtube.svg" alt="" />,
    label: "YouTube",
    href: "https://www.youtube.com/@vivewellnessorg",
  },
];

function ContactIconImage({ src, alt }) {
  return (
    <span
      aria-hidden="true"
      className="contact-icon-image"
      role="img"
      style={{ "--contact-icon-url": `url("${src}")` }}
      title={alt}
    />
  );
}

export function ContactInfoList({ items = CONTACT_DETAILS, showLabels = false }) {
  return (
    <div className="contact-info-list">
      {items.map((item) => (
        <a className="contact-info-item" href={item.href} key={item.label}>
          <span className="contact-info-icon">{item.icon}</span>
          <span>
            {showLabels && <strong>{item.label}</strong>}
            {item.value}
          </span>
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
