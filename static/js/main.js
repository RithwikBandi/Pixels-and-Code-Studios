/* Pixels & Code Studios — scroll choreography
   GSAP ScrollTrigger + Lenis. All motion is transform/opacity only.
   Vanilla features (nav menu, clock, testimonials) run even when the
   animation libraries fail to load — the site must never depend on a CDN. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;
  var hasAnimLibs = !!(window.gsap && window.ScrollTrigger && window.Lenis);

  var preloader = document.getElementById('preloader');

  function hidePreloader() {
    if (preloader) preloader.style.display = 'none';
  }

  /* ================= vanilla features (no library needed) ================ */

  /* ---------- local time ---------- */
  var timeEl = document.getElementById('localTime');
  if (timeEl) {
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit'
    });
    var tick = function () { timeEl.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- mobile menu ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = false;
    // force reflow so the transition runs when un-hiding
    void mobileMenu.offsetHeight;
    mobileMenu.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-locked', open);
    if (!open) {
      window.setTimeout(function () {
        if (!menuOpen) mobileMenu.hidden = true;
      }, 450);
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () { setMenu(!menuOpen); });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) setMenu(false);
    });
  }

  /* ---------- testimonials ---------- */
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
    // don't advance while the tab is hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (tstTimer) clearInterval(tstTimer);
        tstTimer = null;
      } else {
        startTstTimer();
      }
    });
  }

  /* ---------- contact form -> Web3Forms email (client-side only API) --- */
  var contactForm = document.querySelector('form.contact-form');
  if (contactForm && contactForm.dataset.w3fKey) {
    contactForm.addEventListener('submit', function () {
      var fd = new FormData(contactForm);
      var name = (fd.get('name') || '').toString().trim();
      var email = (fd.get('email') || '').toString().trim();
      var message = (fd.get('message') || '').toString().trim();
      // mirror the server-side validation so invalid posts don't email
      if (!name || message.length < 10 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
      try {
        // form-encoded body: no CORS preflight, per the Web3Forms client API
        var payload = new FormData();
        payload.append('access_key', contactForm.dataset.w3fKey);
        payload.append('subject', 'New project inquiry: ' + name);
        payload.append('from_name', 'Pixels & Code Studios website');
        payload.append('name', name);
        payload.append('email', email);
        payload.append('service', (fd.get('service') || 'not specified').toString());
        payload.append('budget', (fd.get('budget') || 'not specified').toString());
        payload.append('message', message);
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: payload,
          keepalive: true // survives the page navigating to the success state
        }).catch(function () { /* email is best-effort; inquiry is saved server-side */ });
      } catch (e) {
        // email notification is best-effort; the inquiry is saved server-side
      }
    });
  }

  /* ---------- custom themed dropdowns (native popup can't be styled) ---- */
  function enhanceSelect(select) {
    var shell = document.createElement('div');
    shell.className = 'select-shell';
    select.parentNode.insertBefore(shell, select);
    shell.appendChild(select);
    select.classList.add('select-native'); // visually hidden, still submitted

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    var triggerLabel = document.createElement('span');
    trigger.appendChild(triggerLabel);

    var menu = document.createElement('ul');
    menu.className = 'select-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    var options = [];
    Array.prototype.forEach.call(select.options, function (opt, i) {
      var li = document.createElement('li');
      li.className = 'select-option';
      li.setAttribute('role', 'option');
      li.textContent = opt.textContent;
      li.dataset.value = opt.value;
      if (i === select.selectedIndex) li.classList.add('is-selected');
      li.addEventListener('click', function () { choose(i); close(); trigger.focus(); });
      menu.appendChild(li);
      options.push(li);
    });

    shell.appendChild(trigger);
    shell.appendChild(menu);

    function sync() {
      var current = select.options[select.selectedIndex];
      triggerLabel.textContent = current ? current.textContent : '';
      trigger.classList.toggle('is-placeholder', !select.value);
      options.forEach(function (li, i) {
        li.classList.toggle('is-selected', i === select.selectedIndex);
      });
    }
    function choose(i) {
      select.selectedIndex = i;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
    }
    function open() {
      menu.hidden = false;
      shell.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      menu.hidden = true;
      shell.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function () {
      if (menu.hidden) open(); else close();
    });
    trigger.addEventListener('keydown', function (e) {
      var idx = select.selectedIndex;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (menu.hidden) { open(); return; }
        var next = idx + (e.key === 'ArrowDown' ? 1 : -1);
        if (next >= 0 && next < options.length) choose(next);
      } else if (e.key === 'Escape') {
        close();
      } else if ((e.key === 'Enter' || e.key === ' ') && !menu.hidden) {
        e.preventDefault();
        close();
      }
    });
    document.addEventListener('click', function (e) {
      if (!shell.contains(e.target)) close();
    });

    sync();
  }
  document.querySelectorAll('.form-field select').forEach(enhanceSelect);

  /* ---------- nav background (vanilla fallback + primary) ---------- */
  var navEl = document.getElementById('nav');
  function updateNavBg() {
    if (navEl) navEl.classList.toggle('is-scrolled', window.scrollY > 80);
  }
  window.addEventListener('scroll', updateNavBg, { passive: true });
  updateNavBg();

  /* ============== degrade gracefully when libraries are missing ========== */

  if (!hasAnimLibs || reduceMotion) {
    // Counters already render their final value in the markup.
    document.documentElement.classList.add('no-anim');
    hidePreloader();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- text splitting (word-aware so lines never break mid-word) -- */
  function splitChars(el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    text.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      var word = document.createElement('span');
      word.className = 'wd-w';
      word.setAttribute('aria-hidden', 'true');
      part.split('').forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'ch';
        span.textContent = ch;
        word.appendChild(span);
      });
      el.appendChild(word);
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
  var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href.length < 2) return; // plain "#" — nothing to scroll to
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -96 }); // clear the fixed nav
      }
    });
  });

  /* ---------- intro: preloader + hero (home) or simple page intro ------- */
  var heroTitle = document.querySelector('.hero-title');
  var pageTitle = document.querySelector('.page-title');
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

  if (heroTitle) {
    gsap.set('.hero-title .ch', { yPercent: 110, rotation: 5, transformOrigin: '0% 100%' });
    gsap.set('.hero-kicker, .hero-sub, .hero-foot .btn, .scroll-hint', { opacity: 0, y: 24 });
    gsap.set('.nav', { opacity: 0, y: -16 });

    if (preloader && countEl) {
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
            hidePreloader();
            ScrollTrigger.refresh();
          }
        })
        .add(heroIntro, '-=0.35');
    } else {
      heroIntro();
    }
  } else if (pageTitle) {
    gsap.set('.page-title .ch', { yPercent: 110, rotation: 5, transformOrigin: '0% 100%' });
    gsap.set('.page-kicker, .page-sub', { opacity: 0, y: 24 });
    gsap.timeline()
      .to('.page-kicker', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.05)
      .to('.page-title .ch', {
        yPercent: 0, rotation: 0, duration: 0.9, ease: 'power4.out', stagger: 0.02
      }, 0.1)
      .to('.page-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.5);
  }

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
  if (document.querySelector('.hero')) {
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
  }

  /* ---------- marquees: infinite loop + scroll-velocity reaction -------- */
  var marqueeTweens = [];
  document.querySelectorAll('[data-marquee]').forEach(function (track) {
    track.style.animation = 'none';
    var tween = gsap.to(track, { xPercent: -50, repeat: -1, duration: 24, ease: 'none' });
    marqueeTweens.push(tween);
  });
  if (marqueeTweens.length) {
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
  }

  /* ---------- section headings / reveals ---------- */
  document.querySelectorAll('.reveal').forEach(function (el) {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ---------- services (home) ---------- */
  var mediaCards = document.querySelectorAll('.media-card');
  if (mediaCards.length) {
    var activateMedia = function (i) {
      mediaCards.forEach(function (c) {
        c.classList.toggle('is-active', +c.dataset.index === i);
      });
    };
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
  }

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
        trigger: manifestoEl,
        start: 'top 78%',
        end: 'bottom 55%',
        scrub: true
      }
    });
  }

  /* ---------- showreel scale ---------- */
  if (document.querySelector('.reel')) {
    gsap.fromTo('.reel-inner',
      { scale: 0.62 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.reel', start: 'top 85%', end: 'top 20%', scrub: true }
      });
  }

  /* ---------- counters (markup holds the final value) ---------- */
  document.querySelectorAll('.counter').forEach(function (el) {
    var target = +el.dataset.target;
    var obj = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
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

  /* ---------- card grids stagger in ---------- */
  [['.team-grid', '.team-card'], ['.founders-grid', '.founder-card']].forEach(function (pair) {
    if (!document.querySelector(pair[0])) return;
    gsap.from(pair[1], {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: pair[0], start: 'top 85%' }
    });
  });

  /* ---------- process horizontal scroll (home) ---------- */
  var track = document.getElementById('processTrack');
  if (track) {
    var trackOverflow = function () {
      return Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.08);
    };
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
  }

  /* ---------- CTA ---------- */
  if (document.querySelector('.cta')) {
    gsap.from('.cta-title .ch', {
      yPercent: 110,
      duration: 0.8,
      ease: 'power4.out',
      stagger: 0.02,
      scrollTrigger: { trigger: '.cta', start: 'top 70%' }
    });
  }

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

  /* ---------- custom cursor (transforms only — never left/top) ---------- */
  if (!isTouch) {
    var cursor = document.querySelector('.cursor');
    var label = cursor.querySelector('.cursor-label');
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    var cx = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
    var cy = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });
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
