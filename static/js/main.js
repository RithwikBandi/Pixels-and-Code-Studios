/* Pixels & Code Studios — scroll choreography
   GSAP ScrollTrigger + Lenis. All motion is transform/opacity only. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- text splitting ---------- */
  function splitChars(el) {
    var text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    text.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'ch';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.setAttribute('aria-hidden', 'true');
      el.appendChild(span);
    });
    return el.querySelectorAll('.ch');
  }

  document.querySelectorAll('.split-chars').forEach(splitChars);

  /* ---------- smooth scroll (Lenis) ---------- */
  if (!reduceMotion) {
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // anchor links route through Lenis so they glide instead of jump
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0 });
        }
      });
    });
  }

  /* ---------- preloader ---------- */
  var preloader = document.getElementById('preloader');
  var countEl = document.getElementById('preloaderCount');

  function heroIntro() {
    var tl = gsap.timeline();
    tl.to('.hero-kicker', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
      .to('.hero-title .ch', {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.02
      }, 0.15)
      .to('.hero-sub, .hero-foot .btn, .scroll-hint', {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08
      }, 0.55)
      .to('.nav', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.5);
  }

  // initial hidden states (set in JS so the page works without JS too)
  gsap.set('.hero-title .ch', { yPercent: 110 });
  gsap.set('.hero-kicker, .hero-sub, .hero-foot .btn, .scroll-hint', { opacity: 0, y: 24 });
  gsap.set('.nav', { opacity: 0, y: -16 });

  if (reduceMotion) {
    preloader.style.display = 'none';
    gsap.set('.hero-title .ch, .hero-kicker, .hero-sub, .hero-foot .btn, .scroll-hint, .nav', {
      clearProps: 'all'
    });
  } else {
    var count = { v: 0 };
    gsap.timeline()
      .to(count, {
        v: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: function () { countEl.textContent = Math.round(count.v); }
      })
      .to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: function () {
          preloader.style.display = 'none';
          ScrollTrigger.refresh();
        }
      })
      .add(heroIntro, '-=0.35');
  }

  /* ---------- nav background on scroll ---------- */
  ScrollTrigger.create({
    start: 80,
    onToggle: function (self) {
      document.getElementById('nav').classList.toggle('is-scrolled', self.isActive);
    }
  });

  if (reduceMotion) return; // static page below this point

  /* ---------- hero: pin-and-dim as next section slides over ---------- */
  gsap.to('.hero-inner', {
    scale: 0.92,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('#heroGlow', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // glow drifts toward the cursor
  if (!isTouch) {
    var glow = document.getElementById('heroGlow');
    var gx = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3.out' });
    var gy = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3.out' });
    window.addEventListener('mousemove', function (e) {
      gx((e.clientX / window.innerWidth - 0.5) * 120);
      gy((e.clientY / window.innerHeight - 0.5) * 120);
    });
  }

  /* ---------- section headings: masked line reveals ---------- */
  document.querySelectorAll('.reveal').forEach(function (el) {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ---------- services: ignite items + swap media ---------- */
  var mediaCards = document.querySelectorAll('.media-card');
  function activateMedia(i) {
    mediaCards.forEach(function (c) {
      c.classList.toggle('is-active', +c.dataset.index === i);
    });
  }
  activateMedia(0);

  document.querySelectorAll('.svc-item').forEach(function (item) {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: function (self) {
        item.classList.toggle('is-active', self.isActive);
        if (self.isActive) activateMedia(+item.dataset.index);
      }
    });
  });

  /* ---------- showreel: scales up to full width on scroll ---------- */
  gsap.fromTo('.reel-inner',
    { scale: 0.62 },
    {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.reel', start: 'top 85%', end: 'top 20%', scrub: true }
    });

  /* ---------- stats counters ---------- */
  document.querySelectorAll('.counter').forEach(function (el) {
    var target = +el.dataset.target;
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.v); }
        });
      }
    });
  });

  /* ---------- work cards: staggered rise + inner parallax ---------- */
  document.querySelectorAll('.work-card').forEach(function (card, i) {
    gsap.from(card, {
      y: 80,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: (i % 2) * 0.12,
      scrollTrigger: { trigger: card, start: 'top 88%' }
    });
    gsap.fromTo(card.querySelector('.work-mark'),
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
      });
  });

  /* ---------- process: pinned horizontal scroll ---------- */
  var track = document.getElementById('processTrack');
  function trackOverflow() {
    return Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08);
  }
  gsap.to(track, {
    x: function () { return -trackOverflow(); },
    ease: 'none',
    scrollTrigger: {
      trigger: '.process',
      start: 'top top',
      end: function () { return '+=' + trackOverflow(); },
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  /* ---------- CTA headline ---------- */
  gsap.from('.cta-title .ch', {
    yPercent: 110,
    duration: 0.8,
    ease: 'power4.out',
    stagger: 0.02,
    scrollTrigger: { trigger: '.cta', start: 'top 70%' }
  });

  /* ---------- magnetic buttons ---------- */
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      var xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      var yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ---------- custom cursor ---------- */
  if (!isTouch) {
    var cursor = document.querySelector('.cursor');
    var label = cursor.querySelector('.cursor-label');
    var cx = gsap.quickTo(cursor, 'left', { duration: 0.18, ease: 'power3.out' });
    var cy = gsap.quickTo(cursor, 'top', { duration: 0.18, ease: 'power3.out' });
    window.addEventListener('mousemove', function (e) { cx(e.clientX); cy(e.clientY); });

    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        var text = el.dataset.cursorLabel;
        if (text) {
          label.textContent = text;
          cursor.classList.add('has-label');
        } else {
          cursor.classList.add('is-hover');
        }
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('has-label', 'is-hover');
        label.textContent = '';
      });
    });
  }
})();
