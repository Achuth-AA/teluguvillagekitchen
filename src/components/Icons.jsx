const base = { width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: 'false' };

export const WhatsAppIcon = (p) => (
  <svg {...base} {...p} fill="currentColor">
    <path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.2-.2-.5-.3Z" />
  </svg>
);

export const PhoneIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3.5h3l1.6 4.2-2 1.3a11 11 0 0 0 5.4 5.4l1.3-2 4.2 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);

export const InstagramIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = (p) => (
  <svg {...base} {...p} fill="currentColor">
    <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.3-.1c-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.4V21h3.1Z" />
  </svg>
);

export const MapIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const ArrowIcon = (p) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const socialIcon = { instagram: InstagramIcon, facebook: FacebookIcon, map: MapIcon };

/** Small hand-drawn chilli. `filled` chillies show the spice level. */
export function Chilli({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={filled ? 'text-primary' : 'text-line'}>
      <path d="M15.5 5.2c1.4-.6 2.8-.2 3.4 1 .6 1.3 0 3.4-1.6 5.6-2.3 3.2-6.4 6.6-11.6 7.8-.9.2-1.2-.6-.5-1.1 3.6-2.3 6.3-5.6 7.4-9 .5-1.6 1.6-3.7 2.9-4.3Z" fill="currentColor" />
      <path d="M16.8 5.1c-.1-1.4.5-2.6 1.8-3.3" fill="none" stroke="var(--c-secondary)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SpiceLevel({ level = 0, max = 3 }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`Spice level ${level} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <Chilli key={i} filled={i < level} />
      ))}
    </span>
  );
}
