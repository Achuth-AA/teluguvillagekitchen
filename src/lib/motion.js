import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Shared Lenis instance so sections (marquee, navbar) can read scroll velocity/direction. */
export const scroll = { lenis: null, velocity: 0, direction: 1 };

export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
  scroll.lenis = lenis;
  lenis.on('scroll', (l) => {
    scroll.velocity = l.velocity;
    scroll.direction = l.direction;
    ScrollTrigger.update();
  });
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    scroll.lenis = null;
  };
}

/** Coalesces refresh requests: each ScrollTrigger.refresh() re-measures every pinned section. */
let refreshTimer;
export function requestRefresh(delay = 200) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), delay);
}

export function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (scroll.lenis) scroll.lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export { gsap, ScrollTrigger };
