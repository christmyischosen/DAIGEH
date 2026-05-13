/* ═══════════════════════════════════════════
   CULTURAL CUISINE EXPLORER — main.js
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     1. NAVBAR — scroll behaviour
  ─────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function onScroll() {
    const y = window.scrollY;

    // Shrink / background on scroll
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide on scroll down, reveal on scroll up
    if (y > lastScrollY && y > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = y;

    // Parallax
    updateParallax(y);

    // Trigger fade-ups & word animations
    checkFadeUps();
    checkWordAnims();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ──────────────────────────────────────────
     2. HAMBURGER MENU
  ─────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(15,2,0,0.97)';
      navLinks.style.padding = '2rem';
      navLinks.style.gap = '1.5rem';
      navLinks.style.backdropFilter = 'blur(20px)';
    });
  }

  /* ──────────────────────────────────────────
     3. PARALLAX — multiple sections
  ─────────────────────────────────────────── */
  const parallaxItems = [
    { el: document.getElementById('heroBg'),  speed: 0.4 },
    { el: document.getElementById('aboutBg'), speed: 0.25 },
    { el: document.getElementById('ctaBg'),   speed: 0.35 },
  ];

  function updateParallax(scrollY) {
    parallaxItems.forEach(({ el, speed }) => {
      if (!el) return;
      const rect   = el.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * speed}px)`;
    });
  }

  // Run once on load
  updateParallax(0);

  /* ──────────────────────────────────────────
     4. FADE-UP ON SCROLL (IntersectionObserver)
  ─────────────────────────────────────────── */
  const fadeUpEls = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  fadeUpEls.forEach((el) => fadeObserver.observe(el));

  function checkFadeUps() {
    fadeUpEls.forEach((el) => {
      const rect  = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight - 60;
      if (inView && !el.classList.contains('visible')) {
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  }

  /* ──────────────────────────────────────────
     5. WORD-BY-WORD ANIMATION
  ─────────────────────────────────────────── */
  function initWordAnimations() {
    // Each .section-title or .hero-title that contains .word-animate spans
    const wordContainers = document.querySelectorAll('.section-title, .hero-title, .cta-title');

    const wordObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const words = entry.target.querySelectorAll('.word-animate');
            words.forEach((word, i) => {
              setTimeout(() => {
                word.classList.add('visible');
              }, i * 110);
            });
            wordObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    wordContainers.forEach((container) => wordObserver.observe(container));
  }

  // Also trigger for hero words immediately on load
  function checkWordAnims() {
    document.querySelectorAll('.word-animate:not(.visible)').forEach((word, i) => {
      const rect = word.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40) {
        setTimeout(() => word.classList.add('visible'), i * 100);
      }
    });
  }

  initWordAnimations();

  // Trigger hero words after a short delay on load
  setTimeout(() => {
    const heroWords = document.querySelectorAll('.hero-title .word-animate');
    heroWords.forEach((word, i) => {
      setTimeout(() => word.classList.add('visible'), 500 + i * 120);
    });

    // Fade in hero sub & buttons
    const heroSub     = document.querySelector('.hero-sub');
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroSub)     heroSub.style.cssText     = 'opacity:1; transform:translateY(0); transition: opacity 0.8s ease 1.2s, transform 0.8s ease 1.2s;';
    if (heroButtons) heroButtons.style.cssText = 'opacity:1; transform:translateY(0); transition: opacity 0.8s ease 1.5s, transform 0.8s ease 1.5s;';
  }, 100);

  /* ──────────────────────────────────────────
     6. CURSOR GLOW EFFECT
  ─────────────────────────────────────────── */
  const cursor = document.createElement('div');
  cursor.id = 'cursor-glow';
  cursor.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,80,0,0.09) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top  = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ──────────────────────────────────────────
     7. FEATURE CARD — stagger on entrance
  ─────────────────────────────────────────── */
  const featureCards  = document.querySelectorAll('.feature-card');
  const audienceCards = document.querySelectorAll('.audience-card');

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.feature-card, .audience-card');
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, i * 120);
          });
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const featuresGrid  = document.querySelector('.features-grid');
  const audienceGrid  = document.querySelector('.audience-grid');
  if (featuresGrid) {
    featureCards.forEach((c) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(40px) scale(0.96)';
      c.style.transition = 'all 0.65s cubic-bezier(0.22,1,0.36,1)';
    });
    cardObserver.observe(featuresGrid);
  }
  if (audienceGrid) {
    audienceCards.forEach((c) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(40px) scale(0.96)';
      c.style.transition = 'all 0.65s cubic-bezier(0.22,1,0.36,1)';
    });
    cardObserver.observe(audienceGrid);
  }

  /* ──────────────────────────────────────────
     8. GALLERY — drag-to-scroll
  ─────────────────────────────────────────── */
  const galleryTrack = document.querySelector('.gallery-track');

  if (galleryTrack) {
    let isDown   = false;
    let startX   = 0;
    let scrollLeft = 0;

    galleryTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      galleryTrack.style.cursor = 'grabbing';
      startX     = e.pageX - galleryTrack.offsetLeft;
      scrollLeft = galleryTrack.scrollLeft;
    });

    galleryTrack.addEventListener('mouseleave', () => {
      isDown = false;
      galleryTrack.style.cursor = 'grab';
    });

    galleryTrack.addEventListener('mouseup', () => {
      isDown = false;
      galleryTrack.style.cursor = 'grab';
    });

    galleryTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - galleryTrack.offsetLeft;
      const walk = (x - startX) * 1.8;
      galleryTrack.scrollLeft = scrollLeft - walk;
    });

    galleryTrack.style.cursor = 'grab';
  }

  /* ──────────────────────────────────────────
     9. BUTTON — ripple effect
  ─────────────────────────────────────────── */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect   = btn.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: 10px; height: 10px;
        left: ${x - 5}px; top: ${y - 5}px;
        transform: scale(0);
        animation: rippleEffect 0.55s ease-out;
        pointer-events: none;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleEffect {
      to { transform: scale(30); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  /* ──────────────────────────────────────────
     10. SMOOTH ANCHOR LINKS
  ─────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────────
     11. ACTIVE NAV LINK — highlight on scroll
  ─────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => {
            a.style.color = '';
            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.style.color = 'var(--clr-gold-lt)';
            }
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ──────────────────────────────────────────
     12. EM CARDS — stagger entrance
  ─────────────────────────────────────────── */
  const emCards = document.querySelectorAll('.em-card');
  const emObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.em-card');
          cards.forEach((c, i) => {
            c.style.opacity = '0';
            c.style.transform = 'translateY(20px)';
            c.style.transition = 'all 0.5s ease';
            setTimeout(() => {
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
            }, i * 100 + 200);
          });
          emObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const empathyMap = document.querySelector('.empathy-map');
  if (empathyMap) {
    emCards.forEach((c) => { c.style.opacity = '0'; });
    emObserver.observe(empathyMap);
  }

  // Init scroll check
  setTimeout(checkFadeUps, 200);
  setTimeout(checkWordAnims, 300);

  /* ──────────────────────────────────────────
     13. CURRENCY CONVERTER
  ─────────────────────────────────────────── */
  async function initCurrencyConverter() {
    const fromSel    = document.getElementById('cur-from');
    const toSel      = document.getElementById('cur-to');
    const amountEl   = document.getElementById('cur-amount');
    const resultEl   = document.getElementById('cur-result');
    const convertBtn = document.getElementById('cur-convert');
    const swapBtn    = document.getElementById('cur-swap');
    const chips      = document.querySelectorAll('.cur-chip');

    if (!fromSel) return;

    // Currency names for dropdowns
    const CURRENCY_NAMES = {
      USD:'US Dollar', EUR:'Euro', GBP:'British Pound', JPY:'Japanese Yen',
      AUD:'Australian Dollar', CAD:'Canadian Dollar', CHF:'Swiss Franc',
      CNY:'Chinese Yuan', MXN:'Mexican Peso', THB:'Thai Baht',
      IDR:'Indonesian Rupiah', SGD:'Singapore Dollar', INR:'Indian Rupee',
      BRL:'Brazilian Real', ZAR:'South African Rand', KRW:'South Korean Won',
      NZD:'New Zealand Dollar', HKD:'Hong Kong Dollar', SEK:'Swedish Krona',
      NOK:'Norwegian Krone', DKK:'Danish Krone', PHP:'Philippine Peso',
      MYR:'Malaysian Ringgit', TRY:'Turkish Lira'
    };

    // Hardcoded USD-base rates — used when API is unreachable (e.g. file:// or offline)
    const DEMO_RATES = {
      USD:1, EUR:0.92, GBP:0.79, JPY:155.2, AUD:1.53, CAD:1.36,
      CHF:0.90, CNY:7.26, MXN:17.2, THB:35.8, IDR:15850, SGD:1.34,
      INR:83.5, BRL:5.05, ZAR:18.6, KRW:1352, NZD:1.63, HKD:7.82,
      SEK:10.5, NOK:10.7, DKK:6.89, PHP:56.8, MYR:4.71, TRY:32.5
    };

    function populateSelects(currencies) {
      [fromSel, toSel].forEach(sel => {
        sel.innerHTML = '';
        Object.entries(currencies).forEach(([code, name]) => {
          sel.add(new Option(`${code} — ${name}`, code));
        });
      });
      fromSel.value = 'USD';
      toSel.value   = 'EUR';
    }

    // Try live API, fall back to demo list
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch('https://api.frankfurter.app/currencies', { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error();
      populateSelects(await res.json());
    } catch {
      populateSelects(CURRENCY_NAMES);
    }

    async function convert() {
      const amount = parseFloat(amountEl.value);
      if (isNaN(amount) || amount <= 0) {
        resultEl.innerHTML = `<div class="cur-placeholder">Please enter a valid amount above.</div>`;
        return;
      }
      const from = fromSel.value;
      const to   = toSel.value;

      if (from === to) { showResult(amount, amount, from, to, 1, true); return; }

      resultEl.innerHTML = `<div class="cur-loading"><span class="cur-spinner"></span> Calculating…</div>`;

      // Try live API with 3-second timeout
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3000);
        const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`, { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error();
        const data = await res.json();
        showResult(amount, amount * data.rates[to], from, to, data.rates[to], true);
        return;
      } catch { /* fall through to demo rates */ }

      // Fallback: cross-calculate using USD-base demo rates
      if (DEMO_RATES[from] && DEMO_RATES[to]) {
        const rate = DEMO_RATES[to] / DEMO_RATES[from];
        showResult(amount, amount * rate, from, to, rate, false);
      } else {
        resultEl.innerHTML = `<div class="cur-placeholder">Currency pair not available in demo mode.</div>`;
      }
    }

    function showResult(amount, converted, from, to, rate, isLive) {
      const fmt = (n, cur) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: cur, maximumFractionDigits: 2
      }).format(n);

      const indicator = isLive
        ? `<span class="cur-live">● Live rate</span>`
        : `<span class="cur-demo">~ Approximate rate</span>`;

      resultEl.innerHTML = `
        <div class="cur-output">
          <div class="cur-main">
            <span class="cur-from-val">${fmt(amount, from)}</span>
            <span class="cur-equals">=</span>
            <span class="cur-to-val">${fmt(converted, to)}</span>
          </div>
          <div class="cur-meta">
            <span class="cur-rate">1 ${from} = ${rate.toFixed(4)} ${to}</span>
            ${indicator}
          </div>
        </div>`;
    }

    convertBtn.addEventListener('click', convert);
    amountEl.addEventListener('keydown', e => { if (e.key === 'Enter') convert(); });
    amountEl.addEventListener('input', () => {
      clearTimeout(amountEl._debounce);
      amountEl._debounce = setTimeout(convert, 600);
    });

    swapBtn.addEventListener('click', () => {
      [fromSel.value, toSel.value] = [toSel.value, fromSel.value];
      chips.forEach(c => c.classList.remove('active'));
      convert();
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        toSel.value = chip.dataset.to;
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        convert();
      });
    });

    convert();
  }

  initCurrencyConverter();

  /* ──────────────────────────────────────────
     14. RESTAURANT FINDER
  ─────────────────────────────────────────── */
  const U = 'https://images.unsplash.com/';
  const diningGuides = [
    /* ── EUROPE & ASIA ── */
    { id:'france',  name:'France',            flag:'🇫🇷',
      img: U+'photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#1a2a6c,#b21f1f)',
      tagline:'The art of dining is a way of life.',
      types:['Brasseries','Bistros & Cafés','Patisseries','Wine bars','Fine dining'],
      musts:['Morning croissant at a local café','Steak frites at a brasserie','Wine & cheese board','Sunday market lunch','Crêpes from a street vendor'],
      etiquette:'Meals are leisurely — never rush. Always greet staff with "Bonjour." Bread rests on the table, not a plate. "Bon appétit" before eating. Tipping appreciated but not required.',
      price:'$$ – $$$$' },
    { id:'japan',   name:'Japan',             flag:'🇯🇵',
      img: U+'photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#c0392b,#2c3e50)',
      tagline:'Precision, respect, and umami in every bite.',
      types:['Ramen shops','Izakayas','Sushi bars','Yakitori stalls','Kaiseki restaurants'],
      musts:['Ramen at a local shop','Conveyor belt sushi','Izakaya small plates & beer','Street takoyaki','Matcha desserts'],
      etiquette:'Say "itadakimasu" before eating. Never tip — it can be insulting. Slurping noodles is a compliment. Use both hands when receiving a dish.',
      price:'$ – $$$' },
    { id:'thailand',name:'Thailand',          flag:'🇹🇭',
      img: U+'photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#c0392b,#f39c12)',
      tagline:'Night markets, street stalls, and spice that wakes you up.',
      types:['Night markets','Street stalls','Thai kitchen restaurants','Seafood grills','Rooftop bars'],
      musts:['Pad Thai from a street cart','Night market feast','Tom yum soup','Mango sticky rice','Green curry at a local kitchen'],
      etiquette:'Eat with a spoon as the main utensil and fork to guide. Chopsticks are for noodle dishes only. Sharing dishes is common.',
      price:'$ – $$' },
    { id:'italy',   name:'Italy',             flag:'🇮🇹',
      img: U+'photo-1555992336-03a23c7b20ee?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#1a5276,#922b21)',
      tagline:'Simple ingredients, regional pride, and no shortcuts.',
      types:['Trattorias','Osterias','Pizzerias','Gelaterias','Enotecas (wine bars)'],
      musts:['Wood-fired Neapolitan pizza','Sunday pasta at a trattoria','Espresso standing at the bar','Aperitivo hour','Gelato from an artisan shop'],
      etiquette:'No cappuccino after 11am. Bread is for wiping plates. Don\'t ask for cheese on seafood pasta. A coperto (cover charge) on your bill is normal.',
      price:'$$ – $$$' },
    { id:'india',   name:'India',             flag:'🇮🇳',
      img: U+'photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#f39c12,#196f3d)',
      tagline:'A thousand spices and a million ways to eat.',
      types:['Dhabas (roadside kitchens)','Thali restaurants','Chai stalls','Street chaat vendors','Regional vegetarian restaurants'],
      musts:['Thali (full regional platter)','Street chaat (pani puri, bhel puri)','Dosa at a South Indian spot','Butter chicken with naan','Chai at a roadside stall'],
      etiquette:'Eat with your right hand only. Many restaurants are vegetarian — check before ordering meat. Tip 5–10%.',
      price:'$ – $$' },
    { id:'mexico',  name:'Mexico',            flag:'🇲🇽',
      img: U+'photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#2d6a4f,#95190c)',
      tagline:'Bold flavors, open kitchens, and endless warmth.',
      types:['Taquerías','Mercados','Cantinas','Marisquerías','Fondas'],
      musts:['Street tacos al pastor','Mercado breakfast','Ceviche at a marisquería','Mole negro','Elotes from a cart'],
      etiquette:'Lunch (comida) is the biggest meal, 2–4pm. Share dishes — it\'s the norm. Tipping 10–15% is customary.',
      price:'$ – $$$' },
    { id:'bali',    name:'Bali',              flag:'🇮🇩',
      img: U+'photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#196f3d,#d35400)',
      tagline:'Warungs, ceremony food, and sunset seafood.',
      types:['Warungs (local food stalls)','Night markets','Beach clubs','Organic cafés','Clifftop seafood grills'],
      musts:['Nasi goreng (fried rice)','Babi guling (suckling pig) at a warung','Satay from a street cart','Lawar salad','Fresh coconut on the beach'],
      etiquette:'Don\'t eat with your left hand. Remove shoes before entering traditional spots. Tipping is appreciated.',
      price:'$ – $$' },

    /* ── CARIBBEAN ── */
    { id:'barbados',    name:'Barbados',          flag:'🇧🇧',
      img:'barbados.jpg',
      grad:'linear-gradient(135deg,#1a6b5c,#e67e22)',
      tagline:'Rum, reef fish, and Friday night fish fries.',
      types:['Beach bars','Fish fry spots','Rum shops','Casual Bajan kitchens','Upscale beachfront dining'],
      musts:['Friday night fish fry at Oistins','Flying fish & cou-cou (national dish)','Rum punch at a local bar','Macaroni pie','Breadfruit roasted over coals'],
      etiquette:'"Liming" (hanging out over food) is the Bajan way. Relaxed, warm culture — nobody rushes. Tip 10–15%.',
      price:'$ – $$$' },
    { id:'jamaica',     name:'Jamaica',           flag:'🇯🇲',
      img: U+'photo-1522083165195-3424ed129620?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#1a6b35,#f4d03f)',
      tagline:'Bold spice, reggae soul, and jerk everything.',
      types:['Jerk centres','Fish fry spots','Rum bars','Patty shops','Roadside cook shops'],
      musts:['Jerk chicken from a roadside drum pan','Ackee & saltfish (national dish)','Jamaican beef patty','Rice & peas','Fresh sugarcane juice'],
      etiquette:'Dining is casual and communal. Portion sizes are generous. Tipping 10–15% appreciated at sit-down spots. "One love" is the vibe.',
      price:'$ – $$' },
    { id:'haiti',       name:'Haiti',             flag:'🇭🇹',
      img: U+'photo-1562671274-c9f1f72d0dcb?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#154360,#c0392b)',
      tagline:'Griot, légim, and the richest flavor in the Caribbean.',
      types:['Fritay stalls (fried food)','Family-style restaurants','Rum punch bars','Street food vendors','Beachside seafood shacks'],
      musts:['Griot (crispy fried pork)','Légim (vegetable stew)','Pikliz (spicy slaw)','Haitian black rice','Akasan (corn porridge drink)'],
      etiquette:'Food is a communal experience — share freely. Eating with your hands at casual spots is fine. Hospitality is everything. Tipping appreciated.',
      price:'$ – $$' },
    { id:'trinidad',    name:'Trinidad & Tobago', flag:'🇹🇹',
      img: U+'photo-1624969862644-791f3dc98927?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#c0392b,#f39c12)',
      tagline:'Curry, doubles, and the flavors of the whole world.',
      types:['Doubles vendors','Roti shops','Bake & shark stands','Pelau kitchens','Fine dining in Port of Spain'],
      musts:['Doubles (bara + curried chickpeas)','Bake & shark at Maracas Beach','Curry duck roti','Pelau (one-pot rice)','Pholourie with tamarind sauce'],
      etiquette:'Trinis are proud of their diverse food heritage — Indian, African, Chinese, Creole all blend here. Doubles are eaten standing. Tipping 10% customary.',
      price:'$ – $$$' },
    { id:'cuba',        name:'Cuba',              flag:'🇨🇺',
      img: U+'photo-1500759285222-a95626b934cb?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#154360,#c0392b)',
      tagline:'Ropa vieja, rum, and the rhythm of Havana.',
      types:['Paladares (private restaurants)','State restaurants','Street food stalls','Rum bars','Seafood restaurants'],
      musts:['Ropa vieja (shredded beef stew)','Moros y Cristianos (black beans & rice)','Cuban sandwich','Tostones (fried plantains)','Mojito at a Havana bar'],
      etiquette:'Paladares offer the best authentic food. Lunch is the main meal. Tips in USD are appreciated and make a real difference. Don\'t rush — meals are a social affair.',
      price:'$ – $$$' },
    { id:'domrep',      name:'Dominican Republic',flag:'🇩🇴',
      img: U+'photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#154360,#c0392b)',
      tagline:'La Bandera, mangú, and island warmth at every table.',
      types:['Comedores (casual lunch spots)','Seafood restaurants','Street vendors','Chimi (burger) trucks','Resort restaurants'],
      musts:['La Bandera (rice, beans & meat)','Mangú (mashed plantain) breakfast','Sancocho (hearty stew)','Chimi Dominican burger','Fresh coconut water on the road'],
      etiquette:'Lunch (1–3pm) is the main meal. Comedores are where locals eat — point at what you want. Tip 10–15% at sit-down restaurants.',
      price:'$ – $$' },

    /* ── AFRICA ── */
    { id:'nigeria',     name:'Nigeria',           flag:'🇳🇬',
      img: U+'photo-1609183480405-1b8ac9e0ab0d?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#196f3d,#2c2c2c)',
      tagline:'Jollof wars, suya smoke, and every flavor of West Africa.',
      types:['Buka restaurants (local joints)','Suya spots','Pepper soup parlours','Fine dining in Lagos','Street food markets'],
      musts:['Jollof rice (the original)','Suya (grilled spiced beef skewers)','Egusi soup with fufu','Pepper soup','Puff puff (fried dough snack)'],
      etiquette:'Eat with your right hand at traditional spots. Ask before photographing food. Hospitality is sacred — if invited to eat, don\'t decline. Tipping appreciated.',
      price:'$ – $$$' },
    { id:'ghana',       name:'Ghana',             flag:'🇬🇭',
      img: U+'photo-1624985003832-b0b6d45c59e2?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#c0392b,#f39c12)',
      tagline:'Fufu, kelewele, and West Africa\'s warmest tables.',
      types:['Chop bars (local eateries)','Waakye vendors','Roadside BBQ spots','Seafood joints','Fine dining in Accra'],
      musts:['Waakye (rice & beans with toppings)','Fufu with light soup','Kelewele (spiced fried plantain)','Grilled tilapia at a beach bar','Groundnut (peanut) soup'],
      etiquette:'Eating with your right hand is traditional. Chop bars are communal — sit where there\'s space. Greet before you eat. Food is shared freely.',
      price:'$ – $$' },
    { id:'safrica',     name:'South Africa',      flag:'🇿🇦',
      img: U+'photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=70',
      grad:'linear-gradient(135deg,#007a4d,#e03c31)',
      tagline:'Braai culture, bunny chow, and rainbow nation flavors.',
      types:['Braai (BBQ) spots','Bunny chow shops (Durban)','Cape Malay restaurants','Fine dining in Cape Town','Shisa nyama (township grill)'],
      musts:['Braai with boerewors sausage','Bunny chow (curried bread bowl)','Bobotie (spiced minced meat bake)','Biltong (dried cured meat)','Malva pudding for dessert'],
      etiquette:'The braai is sacred — never leave before the meat is ready. Greet warmly at township restaurants. Wine culture is strong in the Cape. Tip 10–15%.',
      price:'$ – $$$$' },
  ];

  function initRestaurantFinder() {
    const grid   = document.getElementById('resto-grid');
    const detail = document.getElementById('resto-detail');
    if (!grid) return;

    let activeId = null;

    diningGuides.forEach(dest => {
      const card = document.createElement('div');
      card.className = 'resto-card fade-up';
      card.dataset.id = dest.id;
      card.innerHTML = `
        <span class="resto-flag">${dest.flag}</span>
        <h3>${dest.name}</h3>
        <p>${dest.tagline}</p>
      `;
      card.addEventListener('click', () => toggleDetail(dest, card));
      grid.appendChild(card);

      const cardObserverLocal = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            cardObserverLocal.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      cardObserverLocal.observe(card);
    });

    function toggleDetail(dest, card) {
      const allCards = grid.querySelectorAll('.resto-card');

      if (activeId === dest.id) {
        activeId = null;
        allCards.forEach(c => c.classList.remove('active'));
        detail.innerHTML = '';
        return;
      }

      activeId = dest.id;
      allCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      detail.innerHTML = `
        <div class="resto-detail-inner">
          <div class="resto-col">
            <h4>🍽 Types of Restaurants</h4>
            <ul>${dest.types.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
          <div class="resto-col">
            <h4>⭐ Must-Try Experiences</h4>
            <ul>${dest.musts.map(m => `<li>${m}</li>`).join('')}</ul>
          </div>
          <div class="resto-col">
            <h4>🤝 Dining Etiquette</h4>
            <p class="resto-etiquette">${dest.etiquette}</p>
            <span class="resto-price-label">Typical price range</span>
            <span class="resto-price">${dest.price}</span>
          </div>
        </div>`;

      setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
    }
  }

  initRestaurantFinder();

})();
