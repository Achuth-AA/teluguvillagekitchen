import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, scrollToHash, scroll, ScrollTrigger } from '../lib/motion';
import { site, whatsappUrl } from '../lib/content';
import { WhatsAppIcon } from './Icons';

export const NAV_LINKS = [
  { href: '#story', label: 'Our Story', telugu: 'కథ' },
  { href: '#bhojanam', label: 'Bhojanam', telugu: 'భోజనం' },
  { href: '#signature', label: 'Signatures', telugu: 'రుచి' },
  { href: '#menu', label: 'Veg Meals', telugu: 'భోజనం' },
  { href: '#gallery', label: 'Gallery', telugu: 'చిత్రాలు' },
  { href: '#visit', label: 'Visit', telugu: 'రండి' },
];

export default function Nav() {
  const bar = useRef(null);
  const panel = useRef(null);
  const toggleBtn = useRef(null);
  const [open, setOpen] = useState(false);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        bar.current.classList.toggle('is-solid', y > 80);
        const dir = scroll.lenis ? scroll.direction : self.direction;
        const shouldHide = dir === 1 && y > 240;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          gsap.to(bar.current, { yPercent: hidden ? -110 : 0, duration: 0.45, ease: 'power3.out' });
        }
      },
    });
    return () => st.kill();
  }, []);

  // Full-screen mobile menu with staggered links.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const links = el.querySelectorAll('.mobile-link');
    if (open) {
      scroll.lenis?.stop();
      document.body.style.overflow = 'hidden';
      gsap.set(el, { visibility: 'visible' });
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        gsap.set(links, { opacity: 1, y: 0 });
      } else {
        gsap.timeline()
          .fromTo(el, { clipPath: 'circle(0% at 92% 4%)' }, { clipPath: 'circle(150% at 92% 4%)', opacity: 1, duration: 0.7, ease: 'power3.inOut' })
          .fromTo(links, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out' }, '-=0.35');
      }
      el.querySelector('a')?.focus();
      const onKey = (e) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    scroll.lenis?.start();
    document.body.style.overflow = '';
    gsap.to(el, { opacity: 0, duration: 0.3, onComplete: () => gsap.set(el, { visibility: 'hidden' }) });
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    setTimeout(() => scrollToHash(href), wasOpen ? 250 : 0);
    if (wasOpen) toggleBtn.current?.focus();
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header ref={bar} className="navbar">
        <a href="#top" className="nav-brand" onClick={(e) => go(e, '#top')} aria-label={`${site.brand.name} — home`}>
          <img src={site.brand.logo} alt="" width="40" height="40" />
          <span className="nav-wordmark">Telugu Village <em>Kitchen</em></span>
        </a>
        <nav aria-label="Primary" className="nav-desktop">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a className="link-draw" href={l.href} onClick={(e) => go(e, l.href)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="nav-cta" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon /> <span>Order</span>
        </a>
        <button
          ref={toggleBtn}
          type="button"
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="bar" /><span className="bar" />
        </button>
      </header>

      <div id="mobile-menu" ref={panel} className="mobile-menu" aria-hidden={!open} inert={open ? undefined : ''}>
        <nav aria-label="Mobile">
          <ul>
            {NAV_LINKS.map((l, i) => (
              <li key={l.href} className="mobile-link-wrap">
                <a className="mobile-link" href={l.href} onClick={(e) => go(e, l.href)}>
                  <span className="mobile-num">0{i + 1}</span>
                  {l.label}
                  <span lang="te" className="mobile-te">{l.telugu}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mobile-foot">{site.contact.phoneDisplay} · Gachibowli, Hyderabad</p>
      </div>
    </>
  );
}
