/** Editorial heading: small eyebrow, Telugu accent word with its English line, and the h2. */
export default function SectionHeading({ id, eyebrow, telugu, teluguEn, title, align = 'left', tone = 'dark' }) {
  return (
    <header className={`section-heading ${align === 'right' ? 'is-right' : ''} ${tone === 'light' ? 'is-light' : ''}`}>
      {eyebrow && <p className="eyebrow" data-reveal>{eyebrow}</p>}
      {telugu && (
        <p className="telugu-accent" data-reveal>
          <span lang="te">{telugu}</span>
          <span className="telugu-en">{teluguEn}</span>
        </p>
      )}
      <h2 id={id} className="section-title" data-reveal>{title}</h2>
    </header>
  );
}
