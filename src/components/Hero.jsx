import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, scrollToHash } from '../lib/motion';
import { site, whatsappUrl } from '../lib/content';
import Magnetic from './Magnetic';
import { WhatsAppIcon, ArrowIcon } from './Icons';

const { hero, brand } = site;

function Steam() {
  const puffs = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: `${8 + ((i * 53) % 84)}%`,
        size: `${70 + ((i * 37) % 90)}px`,
        delay: `${-((i * 1.7) % 9).toFixed(2)}s`,
        dur: `${8 + ((i * 3) % 6)}s`,
        drift: `${((i % 2 ? 1 : -1) * (20 + ((i * 11) % 40)))}px`,
      })),
    []
  );
  return (
    <div className="steam" aria-hidden="true">
      {puffs.map((p, i) => (
        <span key={i} style={{ '--left': p.left, '--size': p.size, '--delay': p.delay, '--dur': p.dur, '--drift': p.drift }} />
      ))}
    </div>
  );
}

const words = (text) => text.split(' ').map((w, i, all) => (
  <Fragment key={i}>
    <span className="word"><span className="word-inner">{w}</span></span>
    {i < all.length - 1 && ' '}
  </Fragment>
));

export default function Hero({ ready }) {
  const root = useRef(null);
  const video = useRef(null);
  const [videoOk, setVideoOk] = useState(true);
  const [muted, setMuted] = useState(true);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-aspect-ratio: 4/5)').matches);

  // Decide whether to play video at all (data saver / reduced motion → poster only).
  useEffect(() => {
    const saveData = navigator.connection?.saveData;
    if (saveData || prefersReducedMotion()) setVideoOk(false);
  }, []);

  // Video-synced overlays.
  useEffect(() => {
    if (!ready) return;
    const el = root.current;
    const v = video.current;
    const q = gsap.utils.selector(el);
    const reduced = prefersReducedMotion();

    const showStatic = () => {
      gsap.set(q('.hero-te, .hero-title-wrap .word-inner, .hero-logo, .hero-tagline .word-inner'), { opacity: 1, yPercent: 0, y: 0, scale: 1 });
      gsap.set(q('.hero-dish'), { opacity: 0 });
    };

    if (!videoOk || !v) {
      showStatic();
      return;
    }

    gsap.set(q('.hero-te'), { opacity: 0, y: 16 });
    gsap.set(q('.hero-dish'), { opacity: 0, x: -40 });
    gsap.set(q('.hero-logo'), { opacity: 0, scale: 0.7 });
    gsap.set(q('.hero-title-wrap .word-inner, .hero-tagline .word-inner'), { yPercent: 110, opacity: 0 });

    const titleTl = gsap
      .timeline({ paused: true })
      .to(q('.hero-logo'), { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' })
      .to(q('.hero-title-wrap h1 .word-inner'), { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.16, ease: 'power3.out' }, '-=0.3')
      .to(q('.hero-tagline .word-inner'), { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out' }, '-=0.3');

    let phase = '';
    let dishIdx = -1;
    let raf;
    const setPhase = (next) => {
      if (next === phase) return;
      phase = next;
      if (next === 'intro') {
        gsap.to(q('.hero-te'), { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' });
        titleTl.timeScale(3).reverse();
      } else {
        gsap.to(q('.hero-te'), { opacity: 0, y: -10, duration: 0.5 });
      }
      if (next === 'dishes') titleTl.timeScale(3).reverse();
      if (next === 'title') {
        gsap.to(q('.hero-dish'), { opacity: 0, x: 30, duration: 0.4, stagger: 0.04 });
        titleTl.timeScale(1).play();
      }
    };
    const tick = () => {
      const t = v.currentTime;
      if (t < hero.intro.to) setPhase('intro');
      else if (t < hero.titleAt) setPhase('dishes');
      else setPhase('title');

      let idx = -1;
      hero.dishes.forEach((d, i) => { if (t >= d.at && t < hero.dishesOut) idx = i; });
      if (idx !== dishIdx) {
        if (idx === -1) {
          if (phase !== 'title') gsap.to(q('.hero-dish'), { opacity: 0, x: 30, duration: 0.4 });
        } else {
          const items = q('.hero-dish');
          items.forEach((it, i) => {
            if (i === idx) gsap.fromTo(it, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' });
            else if (i < idx) gsap.to(it, { opacity: 0.45, x: 0, duration: 0.5 });
          });
          items.forEach((it, i) => it.classList.toggle('is-current', i === idx));
        }
        dishIdx = idx;
      }
      raf = requestAnimationFrame(tick);
    };

    v.currentTime = 0;
    const p = v.play();
    if (p) p.catch(() => { setVideoOk(false); });
    raf = requestAnimationFrame(tick);

    // Scroll: video scales 1.15 → 1, title drifts up and fades.
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(q('.hero-media'), { scale: 1.15 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(q('.hero-scroll-fade'), {
        y: -140, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: '60% top', scrub: true },
      });
    }, el);

    // Pause video when off screen to save CPU.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      titleTl.kill();
      ctx.revert();
      io.disconnect();
    };
  }, [ready, videoOk]);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.volume = 0.8;
    setMuted(v.muted);
  };

  const poster = isMobile ? hero.posterMobile : hero.poster;

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        {videoOk ? (
          <video
            ref={video}
            className="hero-video"
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            onError={() => setVideoOk(false)}
            aria-label="Film: a village courtyard kitchen, rice, gongura, pappu and curry being served, a full Andhra bhojanam"
          >
            <source src={isMobile ? hero.videoMobile : hero.video} type="video/mp4" onError={() => setVideoOk(false)} />
          </video>
        ) : (
          <img
            className="hero-video"
            src={poster}
            width={isMobile ? 540 : 1280}
            height={isMobile ? 960 : 720}
            alt="A woman stirring a large clay pot on a wood-fire stove in a sunlit village courtyard"
            fetchpriority="high"
          />
        )}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <Steam />

      <div className="hero-scroll-fade">
        <div className="hero-title-wrap">
          <img className="hero-logo" src={brand.logo} alt="" width="84" height="84" />
          <h1 id="hero-title">{words(brand.name)}</h1>
          <p className="hero-tagline">{words(brand.tagline)}</p>
        </div>
      </div>

      <p className="hero-te">
        <span lang="te">{hero.intro.telugu}</span>
        <span className="hero-te-en">{hero.intro.english}</span>
      </p>

      <ol className="hero-dishes" aria-label="In the meal">
        {hero.dishes.map((d) => (
          <li key={d.name} className="hero-dish">
            <span lang="te">{d.telugu}</span> {d.name}
          </li>
        ))}
      </ol>

      <div className="hero-ctas">
        <Magnetic href="#menu" className="btn btn-light" onClick={(e) => { e.preventDefault(); scrollToHash('#menu'); }}>
          See What We Serve <ArrowIcon />
        </Magnetic>
        <Magnetic href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <WhatsAppIcon /> Order on WhatsApp
        </Magnetic>
      </div>

      {videoOk && (
        <button type="button" className={`sound-toggle ${muted ? '' : 'is-on'}`} onClick={toggleSound} aria-pressed={!muted}>
          <span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <span>{muted ? 'Sound on' : 'Sound off'}</span>
        </button>
      )}
    </section>
  );
}
