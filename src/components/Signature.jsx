import { useEffect, useRef } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion';
import { menu, priceLabel } from '../lib/content';
import SectionHeading from './SectionHeading';
import { SpiceLevel } from './Icons';

const items = menu.items.filter((i) => i.signature);

export default function Signature() {
  const root = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.current.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: q('.sig-stage')[0], start: 'top top', end: () => `+=${distance()}`,
          pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      q('.sig-card img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: img.closest('.sig-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
      });
    });

    // 3D hover tilt (desktop pointer only).
    const cleanups = [];
    if (isFinePointer() && !prefersReducedMotion()) {
      q('.sig-card').forEach((card) => {
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
        const move = (e) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => { rx(0); ry(0); };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        cleanups.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
      });
    }
    return () => { mm.revert(); cleanups.forEach((c) => c()); };
  }, []);

  return (
    <section id="signature" ref={root} className="signature" aria-labelledby="sig-title">
      <div className="sig-stage">
        <div ref={track} className="sig-track">
          <div className="sig-intro">
            <SectionHeading id="sig-title" eyebrow="Signature dishes" telugu="రుచి" teluguEn="taste, the real kind" title={<>What people <em>come back</em> for.</>} tone="light" />
            <p className="sig-hint" aria-hidden="true">Keep scrolling →</p>
          </div>
          {items.map((item, i) => (
            <article key={item.id} className={`sig-card sig-card-${(i % 3) + 1}`} data-cursor-label="Taste">
              <div className="sig-img">
                <img src={item.image} alt={item.name} width="360" height="360" loading="lazy" decoding="async" />
              </div>
              <div className="sig-body">
                <p className="sig-num">{String(i + 1).padStart(2, '0')}</p>
                <h3>{item.name}</h3>
                <p className="telugu-accent small"><span lang="te">{item.telugu}</span></p>
                <p className="sig-desc">{item.description}</p>
                <div className="sig-meta">
                  <SpiceLevel level={item.spice} />
                  {item.price != null && <span className="price">{priceLabel(item)}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
