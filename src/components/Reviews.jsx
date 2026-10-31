import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { site } from '../lib/content';
import SectionHeading from './SectionHeading';
import { ArrowIcon } from './Icons';

/** [REAL REVIEWS] Drag carousel. Content comes verbatim from site.json → reviews. */
export default function Reviews() {
  const viewport = useRef(null);
  const track = useRef(null);
  const [idx, setIdx] = useState(0);
  const { items, source } = site.reviews;

  const offsets = () => [...track.current.children].map((c) => c.offsetLeft);
  const maxX = () => Math.max(0, track.current.scrollWidth - viewport.current.clientWidth);
  const goTo = (i) => {
    const n = gsap.utils.clamp(0, items.length - 1, i);
    const x = Math.min(offsets()[n], maxX());
    gsap.to(track.current, { x: -x, duration: prefersReducedMotion() ? 0 : 0.7, ease: 'power3.out' });
    setIdx(n);
  };

  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    let startX = 0, startT = 0, lastX = 0, lastTime = 0, vel = 0, dragging = false;
    const getX = () => gsap.getProperty(tr, 'x');

    const down = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      startX = lastX = e.clientX;
      startT = getX();
      lastTime = performance.now();
      vel = 0;
      gsap.killTweensOf(tr);
      vp.setPointerCapture(e.pointerId);
      vp.classList.add('is-dragging');
    };
    const move = (e) => {
      if (!dragging) return;
      const now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastTime);
      lastX = e.clientX; lastTime = now;
      let x = startT + (e.clientX - startX);
      const min = -maxX();
      if (x > 0) x *= 0.35;
      if (x < min) x = min + (x - min) * 0.35;
      gsap.set(tr, { x });
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      vp.classList.remove('is-dragging');
      const projected = -(getX() + vel * 220);
      const offs = offsets();
      let nearest = 0;
      offs.forEach((o, i) => { if (Math.abs(o - projected) < Math.abs(offs[nearest] - projected)) nearest = i; });
      goTo(nearest);
    };
    vp.addEventListener('pointerdown', down);
    vp.addEventListener('pointermove', move);
    vp.addEventListener('pointerup', up);
    vp.addEventListener('pointercancel', up);
    const onResize = () => goTo(idx);
    window.addEventListener('resize', onResize);
    return () => {
      vp.removeEventListener('pointerdown', down);
      vp.removeEventListener('pointermove', move);
      vp.removeEventListener('pointerup', up);
      vp.removeEventListener('pointercancel', up);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="reviews" className="reviews" aria-labelledby="reviews-title">
      <div className="wrap reviews-head">
        <SectionHeading id="reviews-title" eyebrow={`What guests say · ${source}`} telugu="మాటలు" teluguEn="in their words" title={<>Kind words from <em>the table.</em></>} tone="light" />
        <div className="reviews-nav">
          <button type="button" onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Previous review">
            <ArrowIcon style={{ transform: 'scaleX(-1)' }} />
          </button>
          <button type="button" onClick={() => goTo(idx + 1)} disabled={idx === items.length - 1} aria-label="Next review">
            <ArrowIcon />
          </button>
        </div>
      </div>
      <div ref={viewport} className="reviews-viewport" data-cursor-label="Drag" aria-roledescription="carousel" aria-label="Guest reviews">
        <ul ref={track} className="reviews-track">
          {items.map((r, i) => (
            <li key={r.author} className={`review review-${(i % 3) + 1}`} aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
              <blockquote>
                <p>&ldquo;{r.text}&rdquo;</p>
              </blockquote>
              <footer>
                <span className="review-author">{r.author}</span>
                <span className="review-meta">
                  {r.badge && <>{r.badge} · </>}{r.meta} · {r.when}
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
      <p className="wrap reviews-src">Reviews quoted as posted on {source}.</p>
    </section>
  );
}
