import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, scrollToHash } from '../lib/motion';
import { menu, itemById } from '../lib/content';
import SectionHeading from './SectionHeading';
import Magnetic from './Magnetic';
import { ArrowIcon } from './Icons';

const steps = menu.bhojanam.steps.map((s) => ({ ...s, item: itemById[s.id] })).filter((s) => s.item);

function Plate() {
  return (
    <svg className="plate-svg" viewBox="0 0 600 600" aria-hidden="true">
      <defs>
        <radialGradient id="plate-rim" cx="0.45" cy="0.4" r="0.65">
          <stop offset="0" stopColor="oklch(0.66 0.12 48)" />
          <stop offset="1" stopColor="oklch(0.5 0.11 42)" />
        </radialGradient>
        <radialGradient id="plate-well" cx="0.45" cy="0.42" r="0.6">
          <stop offset="0" stopColor="oklch(0.74 0.09 60)" />
          <stop offset="1" stopColor="oklch(0.62 0.11 50)" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="292" fill="url(#plate-rim)" />
      <circle cx="300" cy="300" r="250" fill="url(#plate-well)" />
      <g fill="none" stroke="oklch(0.85 0.06 70 / 0.55)" strokeWidth="2" strokeLinecap="round">
        <circle cx="300" cy="300" r="270" strokeDasharray="2 14" />
        <circle cx="300" cy="300" r="250" />
      </g>
    </svg>
  );
}

export default function Bhojanam() {
  const root = useRef(null);
  const strip = useRef(null);
  const [active, setActive] = useState(-1);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 899.98px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899.98px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Desktop: pinned scroll builds the meal.
  useEffect(() => {
    if (mobile) return;
    const el = root.current;
    const q = gsap.utils.selector(el);
    if (prefersReducedMotion()) {
      gsap.set(q('.plate-dish, .bhojanam-cta'), { opacity: 1, scale: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(q('.plate-dish'), { opacity: 0, y: -120, scale: 0.4, rotate: -25 });
      gsap.set(q('.bhojanam-cta'), { opacity: 0, y: 30 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: q('.bhojanam-stage')[0], start: 'top top', end: `+=${steps.length * 55}%`, pin: true, scrub: 0.5,
          onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * (steps.length + 0.6)) - 0)),
        },
      });
      q('.plate-dish').forEach((d, i) => {
        tl.to(d, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1, ease: 'back.out(2.2)' }, i * 1.1);
      });
      tl.to(q('.plate-wrap')[0], { scale: 1.04, duration: 1, ease: 'sine.inOut' }, '+=0.1');
      tl.to(q('.bhojanam-cta'), { opacity: 1, y: 0, duration: 0.8 }, '<');
    }, el);
    return () => ctx.revert();
  }, [mobile]);

  // Mobile: swipe sequence drives which dishes are on the plate.
  useEffect(() => {
    if (!mobile) return;
    const cards = strip.current.querySelectorAll('.swipe-card');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.index))),
      { root: strip.current, threshold: 0.6 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [mobile]);

  useEffect(() => {
    if (!mobile) return;
    const dishes = root.current.querySelectorAll('.plate-dish');
    const reduced = prefersReducedMotion();
    dishes.forEach((d, i) => {
      const on = i <= active;
      if (reduced) gsap.set(d, { opacity: on ? 1 : 0 });
      else if (on && d.dataset.on !== '1') gsap.fromTo(d, { opacity: 0, y: -60, scale: 0.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(2.2)' });
      else if (!on && d.dataset.on !== '0') gsap.to(d, { opacity: 0, scale: 0.6, duration: d.dataset.on ? 0.3 : 0 });
      d.dataset.on = on ? '1' : '0';
    });
  }, [active, mobile]);

  const nudge = (dir) => {
    const s = strip.current;
    s.scrollBy({ left: dir * s.clientWidth * 0.8, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const visit = (e) => { e.preventDefault(); scrollToHash('#visit'); };

  return (
    <section id="bhojanam" ref={root} className="bhojanam" aria-labelledby="bhojanam-title">
      <div className="bhojanam-stage">
        <div className="wrap bhojanam-head">
          <SectionHeading id="bhojanam-title" eyebrow="Build your bhojanam" telugu="భోజనం" teluguEn="the full meal" title={<>One meal. <em>Everything</em> in it.</>} />
          <p className="bhojanam-count" aria-live="polite">
            <span className="count-num">{String(Math.max(0, active + 1)).padStart(2, '0')}</span>
            <span className="count-of">/ {String(steps.length).padStart(2, '0')}</span>
            <span className="count-label">{active >= 0 ? steps[active].label : 'Scroll to serve'}</span>
          </p>
        </div>

        <div className="plate-wrap">
          <Plate />
          {steps.map((s, i) => (
            <figure
              key={s.id}
              className={`plate-dish ${i === active ? 'is-current' : ''}`}
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}%` }}
            >
              <img src={s.item.image} alt={s.item.name} width="360" height="360" loading="lazy" decoding="async" />
              <figcaption>
                <span lang="te">{s.item.telugu}</span> {s.label}
              </figcaption>
            </figure>
          ))}
        </div>

        {!mobile && (
          <div className="bhojanam-cta">
            <p>That&rsquo;s a full Andhra bhojanam. Come sit down for one.</p>
            <Magnetic href="#visit" className="btn btn-primary" onClick={visit}>Visit us <ArrowIcon /></Magnetic>
          </div>
        )}

        {mobile && (
          <div className="swipe">
            <div className="swipe-strip" ref={strip} tabIndex={0} aria-label="Swipe to add dishes to the plate">
              {steps.map((s, i) => (
                <article key={s.id} className="swipe-card" data-index={i}>
                  <p className="swipe-step">{String(i + 1).padStart(2, '0')}</p>
                  <h3>{s.item.name}</h3>
                  <p className="telugu-accent small"><span lang="te">{s.item.telugu}</span></p>
                  <p>{s.item.description}</p>
                </article>
              ))}
              <article className="swipe-card swipe-final" data-index={steps.length - 1}>
                <h3>Your bhojanam is ready.</h3>
                <a href="#visit" className="btn btn-primary" onClick={visit}>Visit us <ArrowIcon /></a>
              </article>
            </div>
            <div className="swipe-nav">
              <button type="button" onClick={() => nudge(-1)} aria-label="Previous dish"><ArrowIcon style={{ transform: 'scaleX(-1)' }} /></button>
              <button type="button" onClick={() => nudge(1)} aria-label="Next dish"><ArrowIcon /></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
