import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, scrollToHash } from '../lib/motion';
import { site, telUrl } from '../lib/content';
import { KolamField } from './Kolam';
import { socialIcon } from './Icons';
import { NAV_LINKS } from './Nav';

export default function Footer() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.wordmark .ch', {
        yPercent: 110, rotate: 8, opacity: 0, stagger: 0.035, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.wordmark', start: 'top 92%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const name = site.brand.name;

  return (
    <footer ref={root} className="footer">
      <KolamField className="footer-kolam" />
      <div className="wrap footer-top">
        <img src={site.brand.logo} alt={site.brand.logoAlt} width="88" height="88" loading="lazy" />
        <p className="footer-tag">{site.brand.tagline}</p>
        <nav aria-label="Footer">
          <ul className="footer-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a className="link-draw" href={l.href} onClick={(e) => { e.preventDefault(); scrollToHash(l.href); }}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="footer-social">
          {site.social.map((s) => {
            const Icon = socialIcon[s.icon];
            return (
              <li key={s.label}>
                <a href={s.url} target={s.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={s.label}>
                  {Icon && <Icon />}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="wordmark">
        <span className="sr-only">{name}</span>
        {name.split('').map((c, i) => (
          <span key={i} className="ch" aria-hidden="true">{c === ' ' ? ' ' : c}</span>
        ))}
      </p>
      <div className="wrap footer-bottom">
        <p>© {new Date().getFullYear()} {name} · Gachibowli, Hyderabad</p>
        <a className="link-draw" href={telUrl}>{site.contact.phoneDisplay}</a>
      </div>
    </footer>
  );
}
