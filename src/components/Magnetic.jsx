import { useEffect, useRef } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion';

/** Wraps a link/button so it leans toward the cursor (desktop only). */
export default function Magnetic({ as: Tag = 'a', strength = 0.35, className = '', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    const inner = el.querySelector('.magnetic-inner');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' });
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength); yTo(dy * strength);
      ixTo?.(dx * strength * 0.4); iyTo?.(dy * strength * 0.4);
    };
    const leave = () => { xTo(0); yTo(0); ixTo?.(0); iyTo?.(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);
  return (
    <Tag ref={ref} className={`magnetic ${className}`} data-cursor="grow" {...rest}>
      <span className="magnetic-inner">{children}</span>
    </Tag>
  );
}
