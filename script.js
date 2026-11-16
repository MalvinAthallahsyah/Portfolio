// ========================================
// Gusti Muhammad Malvin Athallahsyah
// Portfolio Instruments & Interaction Logic
// ========================================

document.documentElement.classList.add('js');

// ── Scroll-pause flag: heavy canvases check this ────────────────
let _scrolling = false;
let _scrollTimer;
window.addEventListener('scroll', () => {
    _scrolling = true;
    clearTimeout(_scrollTimer);
    _scrollTimer = setTimeout(() => { _scrolling = false; }, 150);
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initFMABackground();
    initParticles();
    initClock();
    initContactForm();
    initCursorInteractivity();
    initJourneyTabs();
    initObservatoryNetwork();
    initScrollSpy();
    initProjectCarousel();
    initPassport();
    initMotion();
    initInteractive();
});

// ========================================
// SCROLL SPY — highlights nav link for active section
// ========================================
function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const links = [...document.querySelectorAll('.top nav a')];
    const map   = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));

    // NOTE: no scrollIntoView here — that caused a scroll feedback loop
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(a => a.removeAttribute('aria-current'));
                const a = map.get(e.target.id);
                if (a) a.setAttribute('aria-current', 'true');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    map.forEach((_, id) => {
        const s = document.getElementById(id);
        if (s) obs.observe(s);
    });
}

function initProjectCarousel() {
    document.querySelectorAll('[data-carousel]').forEach(cr => {
        const track  = cr.querySelector('.pj-cr__track');
        const slides = track.children;
        const dots   = [...cr.querySelectorAll('.pj-cr__dot')];
        let i = 0;

        function go(n) {
            i = (n + slides.length) % slides.length;
            track.style.transform = `translateX(${-i * 100}%)`;
            dots.forEach((d, k) => d.classList.toggle('pj-cr__dot--on', k === i));
        }

        cr.querySelectorAll('.pj-cr__btn').forEach(b => {
            b.addEventListener('click', () => go(i + Number(b.dataset.dir)));
        });
        dots.forEach((d, k) => d.addEventListener('click', () => go(k)));

        // Keyboard: arrow left/right saat fokus di dalam carousel
        cr.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') go(i + 1);
            if (e.key === 'ArrowLeft')  go(i - 1);
        });
    });
}

// ========================================
// JOURNEY TABS
// ========================================
function initJourneyTabs() {
    // scoped to the journey tablist — the passport tabs (.pp-tab) have their
    // own role=tab handling inside initPassport
    const tabs   = [...document.querySelectorAll('.tabs [role="tab"]')];
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

    function sel(i, animate) {
        tabs.forEach((t, j) => {
            t.setAttribute('aria-selected', j === i);
            t.tabIndex = j === i ? 0 : -1;
            if (panels[j]) panels[j].hidden = j !== i;
            if (panels[j]) panels[j].classList.toggle('on', j === i);
        });
        // a freshly shown panel must never sit blank: timeline cards that the
        // journey scroll-reveal has not shown yet appear now, staggered
        const p = panels[i];
        if (animate && p) {
            [...p.querySelectorAll('.tc:not([data-tc-in])')].forEach((el, k) => {
                el.dataset.tcIn = '1';
                el.style.setProperty('--d', k * 90 + 'ms');
                el.classList.add('rv');
            });
            requestAnimationFrame(() => requestAnimationFrame(() =>
                [...p.querySelectorAll('.tc.rv')].forEach(el => el.classList.add('in'))));
        }
    }

    tabs.forEach((t, i) => {
        t.addEventListener('click', () => sel(i, true));
        t.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
                sel(n);
                tabs[n].focus();
            }
        });
    });

    sel(0);
}

// ========================================
// INSTRUMENT CLOCK (WIB / UTC+7)
// ========================================
function initClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    function update() {
        el.textContent = new Date().toLocaleTimeString('id-ID', {
            hour12: false, timeZone: 'Asia/Jakarta'
        });
    }
    update();
    setInterval(update, 1000);
}

// ========================================
// CONTACT: COPY EMAIL TO CLIPBOARD
// ========================================
function initContactForm() {
    const btn = document.getElementById('copyEmailBtn');
    const txt = document.getElementById('copyEmailTxt');
    if (!btn || !txt) return;

    btn.addEventListener('click', () => {
        navigator.clipboard.writeText('malvinathallahsyah04@gmail.com').then(() => {
            txt.textContent = 'Copied!';
            setTimeout(() => { txt.textContent = 'Copy email'; }, 2000);
        }).catch(() => {
            txt.textContent = 'Failed';
            setTimeout(() => { txt.textContent = 'Copy email'; }, 2500);
        });
    });
}

// ========================================
// CURSOR GLOW
// ========================================
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    const dot  = document.getElementById('cursorDot');
    if (!glow || !dot) return;

    // Use CSS transforms only — no rAF loop, no layout read
    document.addEventListener('mousemove', e => {
        const x = e.clientX, y = e.clientY;
        dot.style.transform  = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        glow.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
        dot.style.opacity  = '0';
    });
    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
        dot.style.opacity  = '1';
    });
}

// ========================================
// CURSOR INTERACTIVITY
// ========================================
function initCursorInteractivity() {
    const dot = document.getElementById('cursorDot');
    if (!dot) return;
    const targets = document.querySelectorAll('a, button:not(:disabled)');
    targets.forEach(el => {
        el.addEventListener('mouseenter', () => dot.classList.add('hover'));
        el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
    });
}

// ========================================
// AMBIENT FMA TRANSMUTATION CIRCLE CANVAS
// ========================================
function initFMABackground() {
    const canvas = document.getElementById('fmaCanvas');
    if (!canvas) return;
    // Skip heavy canvas if user prefers reduced motion
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let angle = 0;
    let frameId;
    let lastTs = 0;
    // Draw at max 20fps to keep main thread free for scroll
    const FPS_CAP = 1000 / 20;

    function draw(ts) {
        frameId = requestAnimationFrame(draw);
        if (document.hidden) return;
        if (_scrolling) return;           // pause during scroll
        if (ts - lastTs < FPS_CAP) return;
        lastTs = ts;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        const cx   = canvas.width > 768 ? canvas.width * 0.65 : canvas.width * 0.5;
        const cy   = canvas.height * 0.45;
        const baseR = Math.min(canvas.width, canvas.height) * 0.42;

        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.strokeStyle = 'rgba(202,255,166,0.07)';
        ctx.lineWidth   = 1;

        [1, 0.94, 0.78, 0.48, 0.22].forEach(r => {
            ctx.beginPath();
            ctx.arc(0, 0, baseR * r, 0, Math.PI * 2);
            ctx.stroke();
        });

        const ticks = 24;
        for (let i = 0; i < ticks; i++) {
            const a  = (i * Math.PI * 2) / ticks;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * baseR * 0.94, Math.sin(a) * baseR * 0.94);
            ctx.lineTo(Math.cos(a) * baseR,         Math.sin(a) * baseR);
            ctx.stroke();
        }

        for (let tri = 0; tri < 2; tri++) {
            const offset = tri === 0 ? -Math.PI / 2 : Math.PI / 2;
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const a = (i * Math.PI * 2) / 3 + offset;
                const x = Math.cos(a) * baseR * 0.78;
                const y = Math.sin(a) * baseR * 0.78;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        for (let i = 0; i < 6; i++) {
            const a  = (i * Math.PI * 2) / 6;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * baseR * 0.78, Math.sin(a) * baseR * 0.78, baseR * 0.08, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.moveTo(-baseR * 1.05, 0); ctx.lineTo(baseR * 1.05, 0);
        ctx.moveTo(0, -baseR * 1.05); ctx.lineTo(0, baseR * 1.05);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        angle += 0.0003;
    }

    frameId = requestAnimationFrame(draw);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(frameId); }
        else { lastTs = 0; frameId = requestAnimationFrame(draw); }
    });
}

// ========================================
// AMBIENT PARTICLES
// ========================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    // Skip heavy canvas if user prefers reduced motion
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let mx = -1000, my = -1000;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    class P {
        reset() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.sz = Math.random() * 1.2 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.op = Math.random() * 0.3 + 0.06;
            this.life  = Math.random();
            this.decay = 0.002 + Math.random() * 0.002;
        }
        constructor() { this.reset(); }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            if (this.life <= 0) this.reset();
            const dx = mx - this.x, dy = my - this.y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
                const f = (120 - d) / 120 * 0.005;
                this.x += dx * f;
                this.y += dy * f;
            }
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.op * this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
            ctx.fillStyle = '#caffa6';
            ctx.fill();
            ctx.restore();
        }
    }

    // Fewer particles = less CPU during scroll
    const count = Math.min(35, Math.floor(canvas.width * canvas.height / 30000));
    const particles = Array.from({ length: count }, () => {
        const p = new P();
        p.life = Math.random();
        return p;
    });

    let frameId;
    let lastTs = 0;
    // Cap at 30fps
    const FPS_CAP = 1000 / 30;

    function animate(ts) {
        frameId = requestAnimationFrame(animate);
        if (document.hidden) return;
        if (_scrolling) return;           // pause during scroll
        if (ts - lastTs < FPS_CAP) return;
        lastTs = ts;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
    }

    frameId = requestAnimationFrame(animate);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(frameId); }
        else { lastTs = 0; frameId = requestAnimationFrame(animate); }
    });
}

// ========================================
// OBSERVATORY NETWORK GRAPH
// ========================================
function initObservatoryNetwork() {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const svg = document.getElementById('net');
    if (!svg) return;

    const NS = 'http://www.w3.org/2000/svg';
    const mk = (n, a, p) => {
        const e = document.createElementNS(NS, n);
        for (const k in a) e.setAttribute(k, a[k]);
        if (p) p.appendChild(e);
        return e;
    };

    // Deterministic pseudo-random (seeded)
    let sd = 11;
    const rnd = () => (sd = sd * 16807 % 2147483647) / 2147483647;

    const hubs = [...svg.querySelectorAll('.hub')].map(h => ({
        el:    h,
        id:    h.dataset.id,
        x:     +h.dataset.x,
        y:     +h.dataset.y,
        edges: [...svg.querySelectorAll('[data-h=' + h.dataset.id + ']')]
    }));

    const all = [{ x: 270, y: 265 }, ...hubs.map(h => ({ x: h.x, y: h.y, hub: h }))];

    // Ambient nodes
    const amb = [];
    for (let k = 0; k < 500 && amb.length < 24; k++) {
        const a = rnd() * 6.283;
        const r = 55 + rnd() * 195;
        const x = 270 + Math.cos(a) * r;
        const y = 265 + Math.sin(a) * r * 0.95;
        if (x < 28 || x > 492 || y < 28 || y > 492) continue;
        if (all.some(p => Math.hypot(p.x - x, p.y - y) < 44)) continue;
        const p = { x, y };
        amb.push(p);
        all.push(p);
    }

    const gE = document.getElementById('edges');
    const gN = document.getElementById('nodes');
    const gH = document.getElementById('heads');
    const gP = document.getElementById('parts');

    const seen = new Set(['0-1', '0-2', '0-3']);
    const E    = [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }];
    const adj  = all.map(() => []);
    [0, 1, 2].forEach(i => adj[0].push(i));
    [1, 2, 3].forEach((n, i) => adj[n].push(i));

    all.forEach((p, i) => {
        if (i === 0) return;
        const near = all.map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
                        .filter(o => o.j !== i && o.j !== 0)
                        .sort((u, v) => u.d - v.d)
                        .slice(0, p.hub ? 3 : 2);
        near.forEach(o => {
            const a = Math.min(i, o.j), b = Math.max(i, o.j), k = `${a}-${b}`;
            if (seen.has(k)) return;
            seen.add(k);
            const el  = mk('line', { class: 'e', x1: all[a].x, y1: all[a].y, x2: all[b].x, y2: all[b].y }, gE);
            const id  = E.push({ a, b, el }) - 1;
            adj[a].push(id);
            adj[b].push(id);
            [all[a], all[b]].forEach(q => q.hub && q.hub.edges.push(el));
        });
    });

    amb.forEach(p => mk('circle', { class: 'n', cx: p.x, cy: p.y, r: 1.8 + rnd() * 1.4 }, gN));

    hubs.forEach(h => {
        const on  = () => h.edges.forEach(e => e.classList.add('hot'));
        const off = () => h.edges.forEach(e => e.classList.remove('hot'));
        ['mouseenter', 'focus'].forEach(t => h.el.addEventListener(t, on));
        ['mouseleave', 'blur'].forEach(t => h.el.addEventListener(t, off));

        h.el.addEventListener('click', ev => {
            const href = h.el.getAttribute('href');
            const target = document.querySelector(href);
            if (!target) return;
            ev.preventDefault();
            target.scrollIntoView({ behavior: still ? 'auto' : 'smooth' });
            history.replaceState(null, '', href);

            // CLOUD node → auto-activate Achievements & Awards tab
            if (h.id === 'cloud') {
                const achTab = document.getElementById('t-ach');
                if (achTab) achTab.click();
            }
        });
    });

    // Animated traversal particles
    const ps = Array.from({ length: 7 }, () => {
        const e = Math.floor(rnd() * E.length);
        return {
            e, t: rnd(), f: rnd() < 0.5, s: 0.12 + rnd() * 0.1,
            el: mk('circle', { class: 'pt', r: 2.2 }, gP)
        };
    });

    // Orbital trackers along the curved paths
    const hs = ['k1', 'k2', 'k3'].map((id, i) => {
        const p = document.getElementById(id);
        return {
            p, L: p.getTotalLength(), o: i * 0.33,
            r: mk('circle', { class: 'head', r: 7 }, gH),
            d: mk('circle', { class: 'hd2',  r: 2.2 }, gH)
        };
    });

    function draw(t) {
        ps.forEach(q => {
            const e = E[q.e];
            const a = all[q.f ? e.b : e.a];
            const b = all[q.f ? e.a : e.b];
            q.el.setAttribute('cx', a.x + (b.x - a.x) * q.t);
            q.el.setAttribute('cy', a.y + (b.y - a.y) * q.t);
        });
        hs.forEach(h => {
            const u  = ((t * 0.012 + h.o) % 1);
            const pt = h.p.getPointAtLength(h.L * (0.15 + u * 0.8));
            h.r.setAttribute('cx', pt.x);
            h.r.setAttribute('cy', pt.y);
            h.d.setAttribute('cx', pt.x);
            h.d.setAttribute('cy', pt.y);
        });
    }

    draw(0.4);
    if (still) return;

    let last = 0, run = true, time = 0;

    new IntersectionObserver(es => {
        run = es[0].isIntersecting;
        if (run) { last = 0; requestAnimationFrame(tick); }
    }).observe(svg);

    function tick(ts) {
        if (!run || document.hidden) {
            if (!document.hidden && run) requestAnimationFrame(tick);
            return;
        }
        const dt = last ? Math.min((ts - last) / 1000, 0.1) : 0;
        last = ts;
        time += dt;

        ps.forEach(q => {
            q.t += q.s * dt;
            if (q.t >= 1) {
                const end  = q.f ? E[q.e].a : E[q.e].b;
                const opts = adj[end].filter(i => i !== q.e);
                const n    = opts.length ? opts[Math.floor(rnd() * opts.length)] : q.e;
                q.f = E[n].a !== end;
                q.e = n;
                q.t = 0;
            }
        });

        draw(time);
        requestAnimationFrame(tick);
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && run) { last = 0; requestAnimationFrame(tick); }
    });

    requestAnimationFrame(tick);
}


// ========================================
// PASSPORT — open/close, page tabs, stamps, tilt, photo fallback
// ========================================
function initPassport() {
    const root = document.getElementById('passport');
    if (!root) return;

    const still    = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const openBtn  = root.querySelector('#ppOpen');
    const closeBtn = root.querySelector('#ppClose');
    const book     = root.querySelector('#ppBook');
    const tabs     = [...root.querySelectorAll('.pp-tab')];
    const panels   = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const photo    = root.querySelector('.pp-photo');
    const img      = photo && photo.querySelector('img');

    // Photo missing? Fall back to the silhouette
    if (img) {
        const fail = () => { img.hidden = true; };
        img.addEventListener('error', fail);
        if (img.complete && img.naturalWidth === 0) fail();
    }

    // ── Open / close
    function setState(isOpen) {
        root.dataset.state = isOpen ? 'open' : 'closed';
        openBtn.setAttribute('aria-expanded', String(isOpen));
        book.inert = !isOpen;
    }

    function focusTab() {
        const sel = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
        sel.focus({ preventScroll: true });
    }

    function openPassport() {
        if (root.hasAttribute('data-opening') || root.hasAttribute('data-closing')) return;
        if (still) {
            setState(true);
            focusTab();
            return;
        }
        // cover stays on screen and fades while the book widens out of it
        root.setAttribute('data-opening', '');
        setState(true);
        focusTab();
        setTimeout(() => root.removeAttribute('data-opening'), 1050);
    }

    function closePassport(focusBack) {
        if (root.hasAttribute('data-opening') || root.hasAttribute('data-closing')) return;
        if (still) {
            setState(false);
            if (focusBack !== false) openBtn.focus({ preventScroll: true });
            return;
        }
        root.setAttribute('data-closing', '');
        setTimeout(() => {
            setState(false);
            root.removeAttribute('data-closing');
            if (focusBack !== false) openBtn.focus({ preventScroll: true });
        }, 640);
    }

    setState(false);
    openBtn.addEventListener('click', openPassport);
    closeBtn.addEventListener('click', closePassport);
    root.addEventListener('keydown', e => { if (e.key === 'Escape' && root.dataset.state === 'open') closePassport(); });

    // ── Auto-close when the passport scrolls mostly out of view
    let autoQueued = false;
    addEventListener('scroll', () => {
        if (autoQueued || root.dataset.state !== 'open') return;
        autoQueued = true;
        requestAnimationFrame(() => {
            autoQueued = false;
            const r = root.getBoundingClientRect();
            const visible = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
            if (root.dataset.state === 'open' && visible < r.height * 0.25) closePassport(false);
        });
    }, { passive: true });

    // ── Page tabs (arrow-key navigable)
    function select(i, focus) {
        tabs.forEach((t, n) => {
            const on = n === i;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            panels[n].hidden = !on;
        });
        if (focus) tabs[i].focus();
    }

    tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(i));
        t.addEventListener('keydown', e => {
            let n = null;
            if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
            if (e.key === 'ArrowLeft')  n = (i - 1 + tabs.length) % tabs.length;
            if (e.key === 'Home') n = 0;
            if (e.key === 'End')  n = tabs.length - 1;
            if (n !== null) { e.preventDefault(); select(n, true); }
        });
    });

    // ── Click a stamp to press it again
    root.querySelectorAll('button.stamp').forEach(s => {
        s.addEventListener('click', () => {
            s.classList.add('is-restamp');
            s.style.animation = 'none';
            void s.offsetWidth;
            s.style.animation = '';
        });
    });

    // ── Tilt + hologram (pointer devices only)
    if (!still && matchMedia('(hover: hover)').matches) {
        book.addEventListener('pointermove', e => {
            const r = book.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - 0.5;
            const y = (e.clientY - r.top)  / r.height - 0.5;
            book.style.setProperty('--ry', (x * 4).toFixed(2) + 'deg');
            book.style.setProperty('--rx', (-y * 3).toFixed(2) + 'deg');
        });
        book.addEventListener('pointerleave', () => {
            book.style.setProperty('--ry', '0deg');
            book.style.setProperty('--rx', '0deg');
        });
        if (photo) {
            photo.addEventListener('pointermove', e => {
                const r = photo.getBoundingClientRect();
                photo.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
                photo.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
            });
        }
    }
}

// ========================================
// MOTION LAYER — scroll progress, hero entrance, reveals, rotating circle
// ========================================
function initMotion() {
    const root  = document.documentElement;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gate  = document.getElementById('gate-intro');

    // Hero waits for the gate to open (or starts at once if it is gone)
    const go = () => root.classList.add('hero-go');
    if (still || !gate || gate.classList.contains('gi--hidden') || getComputedStyle(gate).display === 'none') {
        go();
    } else {
        new MutationObserver((_, o) => {
            if (gate.classList.contains('gi--fade') || gate.classList.contains('gi--hidden')) { go(); o.disconnect(); }
        }).observe(gate, { attributes: true, attributeFilter: ['class'] });
    }

    // Hero headline: split into words for the staggered rise
    const h1 = document.querySelector('.hero h1');
    if (h1 && !still) {
        const words = h1.textContent.trim().split(/\s+/);
        h1.setAttribute('aria-label', words.join(' '));
        h1.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${w}</span>`).join(' ');
    }

    // Scroll progress bar + slowly turning circle in the journey section
    const bar  = document.createElement('div');
    bar.className = 'scroll-bar';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const circ = document.querySelector('.circ svg');
    let queued = false;
    const update = () => {
        queued = false;
        const max = root.scrollHeight - innerHeight;
        bar.style.scale = (max > 0 ? scrollY / max : 0) + ' 1';
        if (circ && !still) circ.style.rotate = (scrollY * 0.04) + 'deg';
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    if (still || !('IntersectionObserver' in window)) return;

    // Scroll reveals, staggered among siblings
    // (journey .jl/.tc are revealed as one unit further below)
    const sel = '.about h2,.about .note,.about-body p,.passport,#work .wrap>h2,.proj-card,.arsenal-header,.arsenal-category-bar,.contact .wrap>*';
    const els = [...document.querySelectorAll(sel)];
    els.forEach(el => {
        const sibs = [...el.parentElement.children].filter(c => c.matches(sel));
        el.style.setProperty('--d', Math.max(0, sibs.indexOf(el)) * 90 + 'ms');
        el.classList.add('rv');
    });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        el.classList.add('in');
        // hand the element back to its own CSS once the reveal is done
        setTimeout(() => { el.classList.remove('rv', 'in'); el.style.removeProperty('--d'); }, 1800);
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));

    // Journey: the label column + the visible panel's timeline cards reveal
    // as one unit when the section enters the viewport (per-card observation
    // could leave the timeline blank)
    const journey = document.getElementById('journey');
    if (journey) {
        const jio = new IntersectionObserver(entries => entries.forEach(e => {
            if (!e.isIntersecting) return;
            jio.disconnect();
            const jl    = journey.querySelector('.jl');
            const cards = [...journey.querySelectorAll('.panel.on .tc')].filter(el => !el.dataset.tcIn);
            const unit  = jl ? [jl, ...cards] : cards;
            unit.forEach((el, k) => {
                if (el !== jl) el.dataset.tcIn = '1';
                el.style.setProperty('--d', k * 90 + 'ms');
                el.classList.add('rv');
            });
            requestAnimationFrame(() => requestAnimationFrame(() =>
                unit.forEach(el => el.classList.add('in'))));
            setTimeout(() => unit.forEach(el => {
                el.classList.remove('rv', 'in');
                el.style.removeProperty('--d');
            }), 1800);
        }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
        jio.observe(journey);
    }
}

// ========================================
// INTERACTIVE LAYER — magnetic buttons, project-card tilt + glare
// fine pointers only, skipped under prefers-reduced-motion;
// CSS side lives at the end of styles.css (.mag / .tilt)
// ========================================
function initInteractive() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Magnetic pull: buttons lean toward the cursor, spring back on leave
    document.querySelectorAll('.btn, .tab, .pp-tab, .pp-close, .pj-cr__btn, .gi-enter-btn').forEach(el => {
        el.classList.add('mag');
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.2;
            const y = (e.clientY - r.top  - r.height / 2) * 0.2;
            el.style.setProperty('--mag-x', Math.max(-9, Math.min(9, x)).toFixed(1) + 'px');
            el.style.setProperty('--mag-y', Math.max(-9, Math.min(9, y)).toFixed(1) + 'px');
        });
        el.addEventListener('pointerleave', () => {
            el.style.setProperty('--mag-x', '0px');
            el.style.setProperty('--mag-y', '0px');
        });
    });

    // Project cards: subtle 3D tilt + a soft mint glare that follows the cursor
    document.querySelectorAll('.proj-card').forEach(card => {
        card.classList.add('tilt');
        card.addEventListener('pointermove', e => {
            const r  = card.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width  - 0.5;
            const ny = (e.clientY - r.top)  / r.height - 0.5;
            card.style.setProperty('--tx', (-ny * 4).toFixed(2) + 'deg');
            card.style.setProperty('--ty', ( nx * 5).toFixed(2) + 'deg');
            card.style.setProperty('--gx', ((nx + 0.5) * 100).toFixed(1) + '%');
            card.style.setProperty('--gy', ((ny + 0.5) * 100).toFixed(1) + '%');
        });
        card.addEventListener('pointerleave', () => {
            card.style.setProperty('--tx', '0deg');
            card.style.setProperty('--ty', '0deg');
        });
    });
}
