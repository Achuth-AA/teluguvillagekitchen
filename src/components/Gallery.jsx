import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, scroll } from '../lib/motion';
import { site } from '../lib/content';
import SectionHeading from './SectionHeading';

export default function Gallery() {
  const root = useRef(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const [index, setIndex] = useState(null);
  const items = site.gallery;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gallery-item').forEach((el, i) => {
        gsap.fromTo(el, { clipPath: i % 2 ? 'inset(100% 0 0 0)' : 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
        gsap.fromTo(el.querySelector('img'), { scale: 1.25 }, {
          scale: 1, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const open = (i, e) => {
    opener.current = e.currentTarget;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d) => setIndex((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    const d = dialog.current;
    if (index === null) {
      if (d.open) d.close();
      scroll.lenis?.start();
      opener.current?.focus();
      return;
    }
    if (!d.open) {
      d.showModal();
      scroll.lenis?.stop();
      if (!prefersReducedMotion()) gsap.fromTo(d, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
    }
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, step]);

  const current = index !== null ? items[index] : null;

  return (
    <section id="gallery" ref={root} className="gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <SectionHeading id="gallery-title" eyebrow="Gallery" telugu="మన ఊరు" teluguEn="our village" title={<>Smoke, steam and <em>sunlight.</em></>} align="right" />
        <ul className="masonry">
          {items.map((g, i) => (
            <li key={g.src}>
              <button type="button" className="gallery-item" onClick={(e) => open(i, e)} data-cursor-label="View" aria-label={`Open image: ${g.alt}`}>
                <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog ref={dialog} className="lightbox" onClose={close} onClick={(e) => e.target === dialog.current && close()} aria-label="Image viewer">
        {current && (
          <figure>
            <img src={current.src} alt={current.alt} width={current.w} height={current.h} />
            <figcaption>{current.alt} <span className="lb-count">{index + 1} / {items.length}</span></figcaption>
          </figure>
        )}
        <div className="lb-controls">
          <button type="button" onClick={() => step(-1)}>Previous</button>
          <button type="button" onClick={() => step(1)}>Next</button>
          <button type="button" onClick={close} autoFocus>Close</button>
        </div>
      </dialog>
    </section>
  );
}
