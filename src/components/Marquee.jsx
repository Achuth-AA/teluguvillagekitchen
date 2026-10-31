import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, scroll } from '../lib/motion';
import { menu } from '../lib/content';

/** Two rows of dish names (Telugu + English) moving opposite ways; speed reacts to scroll velocity. */
export default function Marquee() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const rows = root.current.querySelectorAll('.marquee-row');
    const tweens = [...rows].map((row, i) => {
      const dir = i % 2 ? 1 : -1;
      const t = gsap.fromTo(row, { xPercent: dir === -1 ? 0 : -50 }, { xPercent: dir === -1 ? -50 : 0, duration: 38 + i * 6, ease: 'none', repeat: -1 });
      // Start deep into the repeat cycle so a negative timeScale (scrolling up) can run backwards.
      return t.totalTime(t.duration() * 200);
    });
    const tick = () => {
      const boost = 1 + Math.min(Math.abs(scroll.velocity) / 6, 5);
      const sign = scroll.direction === -1 ? -1 : 1;
      tweens.forEach((t) => {
        t.timeScale(gsap.utils.interpolate(t.timeScale(), boost * sign, 0.08));
      });
    };
    gsap.ticker.add(tick);
    const io = new IntersectionObserver(([e]) => tweens.forEach((t) => (e.isIntersecting ? t.resume() : t.pause())));
    io.observe(root.current);
    return () => { gsap.ticker.remove(tick); tweens.forEach((t) => t.kill()); io.disconnect(); };
  }, []);

  const list = menu.items;
  const row = (key, mode) => (
    <div className="marquee-row" aria-hidden={key !== 0}>
      {[0, 1].map((dup) => (
        <div className="marquee-group" key={dup} aria-hidden={dup === 1}>
          {list.map((item) => (
            <span className="marquee-item" key={item.id}>
              {mode === 'te' ? <span lang="te" className="m-te">{item.telugu}</span> : <span className="m-en">{item.name}</span>}
              <svg className="m-sep" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 1 Q12 8 19 10 Q12 12 10 19 Q8 12 1 10 Q8 8 10 1Z" fill="currentColor" />
              </svg>
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <section className="marquee-clip" aria-label="Dishes we serve">
      <div className="marquee" ref={root}>
        {row(0, 'en')}
        {row(1, 'te')}
      </div>
    </section>
  );
}
