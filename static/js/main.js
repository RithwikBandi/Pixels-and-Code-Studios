/* Pixels & Code Studios — scroll choreography
   GSAP ScrollTrigger + Lenis. All motion is transform/opacity only. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- local time (always on) ---------- */
  var timeEl = document.getElementById('localTime');
  if (timeEl) {
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit'
    });
    var tick = function () { timeEl.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- text splitting ---------- */
  function splitChars(el) {
    var text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    text.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'ch';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.setAttribute('aria-hidden', 'true');
      el.appendChild(span);
    });
  }
  document.querySelectorAll('.split-chars').forEach(splitChars);

  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    el.setAttribute('aria-label', words.join(' '));
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'wd';
      span.textContent = w;
      span.setAttribute('aria-hidden', 'true');
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.wd');
  }

  /* ---------- smooth scroll (Lenis) ---------- */
  if (!reduceMotion) {
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

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

  /* ---------- preloader + hero intro ---------- */
  var preloader = document.getElementById('preloader');
  var countEl = document.getElementById('preloaderCount');

  function heroIntro() {
    var tl = gsap.timeline();
    tl.to('.hero-kicker', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
      .to('.hero-title .ch', {
        yPercent: 0,
        rotation: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.02
      }, 0.15)
      .to('.hero-sub, .hero-foot .btn, .scroll-hint', {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08
      }, 0.55)
      .to('.nav', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.5);
  }

  gsap.set('.hero-title .ch', { yPercent: 110, rotation: 5, transformOrigin: '0% 100%' });
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

  /* ---------- nav background ---------- */
  ScrollTrigger.create({
    start: 80,
    onToggle: function (self) {
      document.getElementById('nav').classList.toggle('is-scrolled', self.isActive);
    }
  });

  /* ---------- testimonials (work with reduced motion too) ---------- */
  var tsts = document.querySelectorAll('.tst');
  var dots = document.querySelectorAll('.tst-dot');
  var tstIndex = 0;
  var tstTimer = null;

  function showTst(i) {
    tstIndex = i;
    tsts.forEach(function (t) { t.classList.toggle('is-active', +t.dataset.index === i); });
    dots.forEach(function (d) { d.classList.toggle('is-active', +d.dataset.index === i); });
  }
  function startTstTimer() {
    if (tstTimer) clearInterval(tstTimer);
    tstTimer = setInterval(function () {
      showTst((tstIndex + 1) % tsts.length);
    }, 5500);
  }
  if (tsts.length) {
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        showTst(+d.dataset.index);
        startTstTimer();
      });
    });
    startTstTimer();
  }

  if (reduceMotion) return; // static page below this point

  /* ---------- scroll progress bar ---------- */
  gsap.to('.progress-bar', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
  });

  /* ---------- hero particle field ---------- */
  (function heroParticles() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, particles;
    var mouse = { x: -9999, y: -9999 };
    var COLORS = ['255, 154, 31', '255, 196, 46'];

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(90, Math.floor(W / 16));
      particles = [];
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 0.8 + Math.random() * 1.6,
          c: COLORS[i % 2],
          a: 0.2 + Math.random() * 0.5
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    var heroEl = document.getElementById('hero');
    heroEl.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    heroEl.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });

    function frame() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;

          var dx = p.x - mouse.x, dy = p.y - mouse.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.strokeStyle = 'rgba(' + p.c + ',' + ((1 - d / 150) * 0.35).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }

          ctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ---------- hero pin-and-dim ---------- */
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

  if (!isTouch) {
    var glow = document.getElementById('heroGlow');
    var gx = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3.out' });
    var gy = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3.out' });
    window.addEventListener('mousemove', function (e) {
      gx((e.clientX / window.innerWidth - 0.5) * 120);
      gy((e.clientY / window.innerHeight - 0.5) * 120);
    });
  }

  /* ---------- marquees: infinite loop + scroll-velocity reaction ---------- */
  var marqueeTweens = [];
  document.querySelectorAll('[data-marquee]').forEach(function (track) {
    track.style.animation = 'none';
    var tween = gsap.to(track, { xPercent: -50, repeat: -1, duration: 24, ease: 'none' });
    marqueeTweens.push(tween);
  });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: function (self) {
      var boost = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 1200);
      marqueeTweens.forEach(function (t) {
        t.timeScale(boost);
        gsap.to(t, { timeScale: 1, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
      });
    }
  });

  /* ---------- section headings ---------- */
  document.querySelectorAll('.reveal').forEach(function (el) {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ---------- services ---------- */
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

  /* ---------- manifesto: words fill in on scrub ---------- */
  var manifestoEl = document.getElementById('manifestoText');
  if (manifestoEl) {
    var words = splitWords(manifestoEl);
    gsap.set(words, { opacity: 0.12 });
    gsap.to(words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.4,
      scrollTrigger: {
        trigger: '.manifesto',
        start: 'top 78%',
        end: 'bottom 55%',
        scrub: true
      }
    });
  }

  /* ---------- showreel scale ---------- */
  gsap.fromTo('.reel-inner',
    { scale: 0.62 },
    {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.reel', start: 'top 85%', end: 'top 20%', scrub: true }
    });

  /* ---------- counters (stats + collective) ---------- */
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

  /* ---------- work cards: rise, parallax, 3D tilt ---------- */
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

  if (!isTouch) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      var rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });
      var ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx((0.5 - (e.clientY - r.top) / r.height) * 6);
      });
      card.addEventListener('mouseleave', function () { rx(0); ry(0); });
    });
  }

  /* ---------- team cards stagger in ---------- */
  gsap.from('.team-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger: '.team-grid', start: 'top 85%' }
  });

  /* ---------- process horizontal scroll ---------- */
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

  /* ---------- CTA ---------- */
  gsap.from('.cta-title .ch', {
    yPercent: 110,
    duration: 0.8,
    ease: 'power4.out',
    stagger: 0.02,
    scrollTrigger: { trigger: '.cta', start: 'top 70%' }
  });

  /* ---------- footer giant wordmark rises ---------- */
  gsap.from('.footer-giant', {
    yPercent: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 90%' }
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
