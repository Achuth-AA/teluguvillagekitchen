import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { gsap, initSmoothScroll, prefersReducedMotion, requestRefresh, scrollToHash } from './lib/motion';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import WhatsAppFloat from './components/WhatsAppFloat';

const BelowFold = lazy(() => import('./components/BelowFold'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  const [ready, setReady] = useState(false);
  const [sections, setSections] = useState(false);
  const onLoaded = useCallback(() => setReady(true), []);
  const onSectionsMounted = useCallback(() => setSections(true), []);

  const [mountRest, setMountRest] = useState(false);

  useEffect(() => initSmoothScroll(), []);

  // Mount everything below the hero once the intro has finished and the main thread is idle,
  // so the loader and hero animate without competing with layout work.
  useEffect(() => {
    if (!ready) return;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const id = idle(() => setMountRest(true), { timeout: 800 });
    return () => (window.cancelIdleCallback || clearTimeout)(id);
  }, [ready]);

  // Generic reveals: headings rise in, kolam dividers draw themselves.
  useEffect(() => {
    if (!ready || !sections) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray('.kolam-divider .kolam-stroke').forEach((p) => {
        const len = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, {
          strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: p, start: 'top 92%' },
        });
      });
    });
    // Headings rise in via one IntersectionObserver + CSS transitions (cheaper than a ScrollTrigger each).
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }),
      { rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    document.documentElement.classList.add('reveals-on');
    document.fonts?.ready.then(() => requestRefresh());
    requestRefresh();
    // Deep links (e.g. /#menu) arrive before the sections exist; honour them once they do.
    if (location.hash.length > 1) setTimeout(() => scrollToHash(location.hash), 300);
    return () => { ctx.revert(); io.disconnect(); };
  }, [ready, sections]);

  return (
    <>
      {!ready && <Loader onDone={onLoaded} />}
      <Cursor />
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          {mountRest ? <BelowFold onMount={onSectionsMounted} /> : <div style={{ minHeight: '100vh' }} />}
        </Suspense>
      </main>
      <Suspense fallback={null}>{mountRest && <Footer />}</Suspense>
      <WhatsAppFloat />
    </>
  );
}
