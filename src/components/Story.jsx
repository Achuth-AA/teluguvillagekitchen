import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';
import { site } from '../lib/content';
import SectionHeading from './SectionHeading';

/** Fire → Clay Pot → Banana Leaf. Pinned on desktop; stacked reveals on mobile. */
export default function Story() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const path = q('.story-path-line')[0];
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 899.98px) and (prefers-reduced-motion: no-preference)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      ({ conditions }) => {
        if (conditions.reduced) {
          gsap.set(path, { strokeDashoffset: 0 });
          gsap.set(q('.story-line'), { opacity: 1 });
          return;
        }
        if (conditions.desktop) {
          const steps = q('.story-step');
          const imgs = q('.story-img');
          gsap.set(steps.slice(1), { autoAlpha: 0, y: 40 });
          gsap.set(imgs.slice(1), { autoAlpha: 0, scale: 1.08 });
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: q('.story-stage')[0], start: 'top top', end: '+=260%', pin: true, scrub: 0.6, anticipatePin: 1 },
          });
          tl.to(path, { strokeDashoffset: 0, duration: 3 }, 0);
          steps.forEach((step, i) => {
            const lines = step.querySelectorAll('.story-line');
            const at = i;
            tl.to(lines, { opacity: 1, stagger: 0.15, duration: 0.2 }, at + 0.05);
            tl.to(q('.story-dot')[i], { scale: 1, duration: 0.15 }, at);
            if (i < steps.length - 1) {
              tl.to(step, { autoAlpha: 0, y: -40, duration: 0.2 }, at + 0.85);
              tl.to(steps[i + 1], { autoAlpha: 1, y: 0, duration: 0.2 }, at + 0.95);
              tl.to(imgs[i], { autoAlpha: 0, scale: 0.96, duration: 0.25 }, at + 0.85);
              tl.to(imgs[i + 1], { autoAlpha: 1, scale: 1, duration: 0.3 }, at + 0.9);
            }
          });
        }
        if (conditions.mobile) {
          gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 80%', scrub: true } });
          q('.story-step').forEach((step) => {
            gsap.to(step.querySelectorAll('.story-line'), {
              opacity: 1, stagger: 0.2, ease: 'none',
              scrollTrigger: { trigger: step, start: 'top 75%', end: 'bottom 55%', scrub: true },
            });
          });
        }
      }
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="story" ref={root} className="story" aria-labelledby="story-title">
      <div className="story-intro wrap">
        <SectionHeading id="story-title" eyebrow="Our story" telugu="అమ్మ చేతి వంట" teluguEn="cooking by Amma's hands" title={<>Three things <em>make</em> a village meal.</>} />
      </div>
      <div className="story-stage">
        <svg className="story-path" viewBox="0 0 120 1000" preserveAspectRatio="none" aria-hidden="true">
          <path className="story-path-line" d="M60 0 C 10 120, 110 220, 60 333 S 10 560, 60 666 S 110 880, 60 1000" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="story-media">
          {site.story.map((s, i) => (
            <figure key={s.step} className={`story-img blob-${i + 1}`}>
              <img src={s.image} alt={s.alt} width="960" height="540" loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
        <ol className="story-steps">
          {site.story.map((s) => (
            <li key={s.step} className="story-step">
              <span className="story-dot" aria-hidden="true" />
              <img className="story-step-img" src={s.image} alt="" width="960" height="540" loading="lazy" decoding="async" />
              <p className="story-num">{s.step}</p>
              <h3 className="story-step-title">{s.title}</h3>
              <p className="telugu-accent small">
                <span lang="te">{s.telugu}</span>
                <span className="telugu-en">{s.teluguEn}</span>
              </p>
              <p className="story-text">
                {s.lines.map((l, i) => (
                  <span key={i} className="story-line">{l} </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
