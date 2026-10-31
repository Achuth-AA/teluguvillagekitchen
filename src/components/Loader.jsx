import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { Rosette } from './Kolam';
import { site } from '../lib/content';

/** ≤2s intro: muggu draws itself → resolves into the logo → curtains split open. Skippable. */
export default function Loader({ onDone }) {
  const root = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    const el = root.current;
    document.getElementById('boot')?.remove();
    document.documentElement.classList.add('is-loading');
    const finish = () => {
      document.documentElement.classList.remove('is-loading');
      onDone();
    };

    if (prefersReducedMotion()) {
      tl.current = gsap.timeline({ onComplete: finish }).to(el, { opacity: 0, duration: 0.35, delay: 0.2 });
      return () => tl.current.kill();
    }

    const strokes = el.querySelectorAll('.kolam-stroke');
    strokes.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    tl.current = gsap
      .timeline({ onComplete: finish, defaults: { ease: 'power2.inOut' } })
      .to(strokes, { strokeDashoffset: 0, duration: 0.85, stagger: 0.12 })
      .from(el.querySelectorAll('.loader-kolam circle'), { opacity: 0, scale: 0, transformOrigin: 'center', duration: 0.25, stagger: 0.02 }, '-=0.45')
      .to('.loader-kolam', { scale: 0.6, opacity: 0, rotate: 30, duration: 0.35 }, '+=0.02')
      .fromTo('.loader-logo', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' }, '<0.1')
      .to('.loader-logo', { scale: 1.08, opacity: 0, duration: 0.25 }, '+=0.12')
      .to('.curtain-l', { xPercent: -101, duration: 0.55, ease: 'power3.inOut' }, '<0.05')
      .to('.curtain-r', { xPercent: 101, duration: 0.55, ease: 'power3.inOut' }, '<')
      .to('.loader-skip', { opacity: 0, duration: 0.2 }, '<');

    return () => tl.current.kill();
  }, [onDone]);

  const skip = () => tl.current?.progress(1);

  return (
    <div ref={root} className="loader js-only" role="presentation">
      <div className="curtain curtain-l" />
      <div className="curtain curtain-r" />
      <div className="loader-center">
        <Rosette className="loader-kolam" strokeWidth={2} />
        <img className="loader-logo" src={site.brand.logo} alt="" width="140" height="140" />
      </div>
      <button type="button" className="loader-skip" onClick={skip}>
        Skip intro
      </button>
    </div>
  );
}
