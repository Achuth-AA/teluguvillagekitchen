import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, scrollToHash } from '../lib/motion';
import { menu, itemById } from '../lib/content';
import SectionHeading from './SectionHeading';
import Magnetic from './Magnetic';
import { ArrowIcon } from './Icons';

const steps = menu.bhojanam.steps.map((s) => ({ ...s, item: itemById[s.id] })).filter((s) => s.item);

const LEAF = "M30 300 C 60 120, 240 52, 470 46 C 700 40, 900 70, 978 150 C 992 240, 990 330, 975 420 C 880 500, 690 522, 470 516 C 250 512, 70 470, 30 300 Z";

function Leaf() {
  return (
    <svg className="leaf-svg" viewBox="0 0 1000 560" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="leaf-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.6 0.15 140)" />
          <stop offset="0.5" stopColor="oklch(0.52 0.14 142)" />
          <stop offset="1" stopColor="oklch(0.46 0.12 145)" />
        </linearGradient>
      </defs>
      <clipPath id="leaf-clip">
        <path d={LEAF} />
      </clipPath>
      <path
        d={LEAF}
        fill="url(#leaf-g)"
      />
      <path d="M30 300 C 300 286, 650 282, 985 286" stroke="oklch(0.78 0.1 120)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g stroke="oklch(0.6 0.12 138 / 0.55)" strokeWidth="1.4" fill="none" clipPath="url(#leaf-clip)">
        {Array.from({ length: 26 }, (_, i) => {
          const x = 80 + i * 35;
          return (
            <g key={i}>
              <path d={`M${x} 290 C ${x + 20} 220, ${x + 40} 150, ${x + 52} ${70 + Math.abs(13 - i) * 2}`} />
              <path d={`M${x} 292 C ${x + 20} 360, ${x + 40} 430, ${x + 52} ${500 - Math.abs(13 - i) * 2}`} />
            </g>
          );
        })}
      </g>
      <path d="M978 150 C 960 160, 952 176, 960 196 L 975 186 Z" fill="var(--c-bg)" opacity="0.9" />
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
      gsap.set(q('.leaf-dish, .bhojanam-cta'), { opacity: 1, scale: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(q('.leaf-dish'), { opacity: 0, y: -120, scale: 0.4, rotate: -25 });
      gsap.set(q('.bhojanam-cta'), { opacity: 0, y: 30 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: q('.bhojanam-stage')[0], start: 'top top', end: `+=${steps.length * 55}%`, pin: true, scrub: 0.5,
          onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * (steps.length + 0.6)) - 0)),
        },
      });
      q('.leaf-dish').forEach((d, i) => {
        tl.to(d, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1, ease: 'back.out(2.2)' }, i * 1.1);
      });
      tl.to(q('.leaf-wrap')[0], { scale: 1.04, duration: 1, ease: 'sine.inOut' }, '+=0.1');
      tl.to(q('.bhojanam-cta'), { opacity: 1, y: 0, duration: 0.8 }, '<');
    }, el);
    return () => ctx.revert();
  }, [mobile]);

  // Mobile: swipe sequence drives which dishes are on the leaf.
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
    const dishes = root.current.querySelectorAll('.leaf-dish');
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
          <SectionHeading id="bhojanam-title" eyebrow="Build your bhojanam" telugu="భోజనం" teluguEn="the full meal" title={<>One leaf. <em>Everything</em> on it.</>} />
          <p className="bhojanam-count" aria-live="polite">
            <span className="count-num">{String(Math.max(0, active + 1)).padStart(2, '0')}</span>
            <span className="count-of">/ {String(steps.length).padStart(2, '0')}</span>
            <span className="count-label">{active >= 0 ? steps[active].label : 'Scroll to serve'}</span>
          </p>
        </div>

        <div className="leaf-wrap">
          <Leaf />
          {steps.map((s, i) => (
            <figure
              key={s.id}
              className={`leaf-dish ${i === active ? 'is-current' : ''}`}
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
            <div className="swipe-strip" ref={strip} tabIndex={0} aria-label="Swipe to add dishes to the leaf">
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
