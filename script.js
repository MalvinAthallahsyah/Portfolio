// ========================================
// PORTFOLIO — FMA Dark Theme + Single-Page Scroll
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initFMABackground();
    initParticles();
    initScrollNav();
    initClock();
    initCarousels();
    initContactForm();
    initCursorInteractivity();
});

// ========================================
// CLOCK
// ========================================
function initClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    function update() {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    }
    update();
    setInterval(update, 1000);
}

// ========================================
// SLIDING PILL NAV + SCROLL SPY
// ========================================
function initScrollNav() {
    const tabs     = document.querySelectorAll('.nav-tab:not(.nav-tab--disabled)');
    const pill     = document.getElementById('navPill');
    const nav      = document.getElementById('mainNav');
    const sections = [...tabs].map(t => document.getElementById(t.dataset.section));

    // Move pill to cover the given tab element
    function movePill(tabEl) {
        if (!pill || !tabEl || !nav) return;
        const navRect = nav.getBoundingClientRect();
        const tabRect = tabEl.getBoundingClientRect();
        pill.style.left  = (tabRect.left - navRect.left) + 'px';
        pill.style.width = tabRect.width + 'px';
    }

    // Set active tab + move pill
    function setActive(tabEl) {
        tabs.forEach(t => t.classList.remove('active'));
        tabEl.classList.add('active');
        movePill(tabEl);
    }

    // Click: scroll to section
    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            const target = sections[i];
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth' });
            setActive(tab);
        });
    });

    // CTA buttons with data-section attribute
    document.querySelectorAll('[data-section]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.section);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll-spy: detect which section is in view
    function onScroll() {
        const offset = 90;
        let current = 0;
        sections.forEach((sec, i) => {
            if (sec && sec.getBoundingClientRect().top <= offset) current = i;
        });
        setActive(tabs[current]);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Init pill after layout is ready
    requestAnimationFrame(() => requestAnimationFrame(() => setActive(tabs[0])));

    // Re-position pill on resize
    window.addEventListener('resize', () => {
        const active = document.querySelector('.nav-tab.active');
        if (active) movePill(active);
    });
}

// ========================================
// CAROUSEL
// ========================================
function initCarousels() {
    document.querySelectorAll('.proj-card__carousel').forEach(carousel => {
        const track  = carousel.querySelector('.carousel-track');
        const imgs   = carousel.querySelectorAll('.carousel-img');
        const dots   = carousel.querySelectorAll('.carousel-dot');
        const btnPrev = carousel.querySelector('.carousel-btn--prev');
        const btnNext = carousel.querySelector('.carousel-btn--next');
        if (!track || imgs.length < 2) return;

        let current = 0;

        function goTo(idx) {
            current = (idx + imgs.length) % imgs.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        btnPrev && btnPrev.addEventListener('click', (e) => { e.stopPropagation(); goTo(current - 1); });
        btnNext && btnNext.addEventListener('click', (e) => { e.stopPropagation(); goTo(current + 1); });
        dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

        // Touch/swipe support
        let startX = 0;
        carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });
    });
}

// ========================================
// CURSOR GLOW (smooth lerp)
// ========================================
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    const dot  = document.getElementById('cursorDot');
    if (!glow || !dot) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let gx = mx, gy = my;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    (function animateGlow() {
        gx += (mx - gx) * 0.06;
        gy += (my - gy) * 0.06;
        glow.style.left = gx + 'px';
        glow.style.top  = gy + 'px';
        requestAnimationFrame(animateGlow);
    })();

    document.addEventListener('mouseleave', () => { glow.style.opacity='0'; dot.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity='1'; dot.style.opacity='1'; });
}

// ========================================
// CURSOR INTERACTIVITY
// ========================================
function initCursorInteractivity() {
    const dot = document.getElementById('cursorDot');
    if (!dot) return;
    const targets = document.querySelectorAll('a, button:not(:disabled), .skill-tag, .social-link, .hero-social');
    targets.forEach(el => {
        el.addEventListener('mouseenter', () => dot.classList.add('hover'));
        el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
    });
}

// ========================================
// FMA BACKGROUND — Animated Transmutation Circles
// ========================================
function initFMABackground() {
    const canvas = document.getElementById('fmaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function drawCircle(x, y, r, rot, alpha, lw) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.lineWidth = lw;
        const gold = '#D4A017', red = '#8B1A1A';

        // Outer & inner rings
        ctx.strokeStyle = gold;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, r*0.78, 0, Math.PI*2); ctx.stroke();

        // Innermost ring (dark red)
        ctx.strokeStyle = red; ctx.globalAlpha = alpha*0.55;
        ctx.beginPath(); ctx.arc(0, 0, r*0.38, 0, Math.PI*2); ctx.stroke();
        ctx.globalAlpha = alpha;

        // 6-pointed star
        ctx.strokeStyle = gold;
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
            const rad = i%2===0 ? r*0.65 : r*0.35;
            const ang = (i/12)*Math.PI*2 - Math.PI/2;
            i===0 ? ctx.moveTo(Math.cos(ang)*rad, Math.sin(ang)*rad)
                  : ctx.lineTo(Math.cos(ang)*rad, Math.sin(ang)*rad);
        }
        ctx.closePath(); ctx.stroke();

        // Triangle up
        ctx.beginPath();
        for (let i=0;i<3;i++) {
            const a=(i/3)*Math.PI*2-Math.PI/2;
            i===0?ctx.moveTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.6):ctx.lineTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.6);
        }
        ctx.closePath(); ctx.stroke();

        // Triangle down (dark red)
        ctx.strokeStyle=red; ctx.globalAlpha=alpha*0.65;
        ctx.beginPath();
        for (let i=0;i<3;i++) {
            const a=(i/3)*Math.PI*2+Math.PI/2;
            i===0?ctx.moveTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.6):ctx.lineTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.6);
        }
        ctx.closePath(); ctx.stroke();

        // 12 tick marks
        ctx.globalAlpha=alpha; ctx.strokeStyle=gold;
        for (let i=0;i<12;i++) {
            const a=(i/12)*Math.PI*2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a)*r*0.82, Math.sin(a)*r*0.82);
            ctx.lineTo(Math.cos(a)*r*0.96, Math.sin(a)*r*0.96);
            ctx.stroke();
        }

        ctx.restore();
    }

    const circles = [
        { xr:0.12, yr:0.5,  r:260, spd: 0.00015, a:0.055, lw:0.8 },
        { xr:0.9,  yr:0.22, r:190, spd:-0.0002,  a:0.045, lw:0.7 },
        { xr:0.75, yr:0.85, r:150, spd: 0.00025, a:0.038, lw:0.6 },
        { xr:0.5,  yr:0.5,  r:400, spd: 0.00007, a:0.022, lw:0.9 },
    ];

    let t = 0;
    (function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        t++;
        circles.forEach(c => drawCircle(
            canvas.width*c.xr, canvas.height*c.yr,
            c.r, t*c.spd, c.a, c.lw
        ));
        requestAnimationFrame(draw);
    })();
}

// ========================================
// PARTICLES — FMA gold sparks
// ========================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let mx = -1000, my = -1000;

    function resize() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });

    class P {
        reset() {
            this.x = Math.random()*canvas.width;
            this.y = Math.random()*canvas.height;
            this.sz = Math.random()*1.2+0.3;
            this.vx = (Math.random()-.5)*.25;
            this.vy = (Math.random()-.5)*.25;
            this.op = Math.random()*.4+0.05;
            this.hue = Math.random()>.15 ? 30+Math.random()*15 : 5+Math.random()*12;
            this.sat = 70+Math.random()*30;
            this.life = Math.random();
            this.decay = .002+Math.random()*.003;
        }
        constructor() { this.reset(); }
        update() {
            this.x+=this.vx; this.y+=this.vy;
            this.life-=this.decay;
            if(this.life<=0) this.reset();
            const dx=mx-this.x, dy=my-this.y, d=Math.sqrt(dx*dx+dy*dy);
            if(d<140) { const f=(140-d)/140*.007; this.x+=dx*f; this.y+=dy*f; }
            if(this.x<0)this.x=canvas.width; if(this.x>canvas.width)this.x=0;
            if(this.y<0)this.y=canvas.height; if(this.y>canvas.height)this.y=0;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha=this.op*this.life;
            ctx.shadowColor=`hsl(${this.hue},90%,60%)`;
            ctx.shadowBlur=6;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.sz,0,Math.PI*2);
            ctx.fillStyle=`hsl(${this.hue},${this.sat}%,65%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    const count = Math.min(100, Math.floor(canvas.width*canvas.height/12000));
    const particles = Array.from({length:count}, () => { const p=new P(); p.life=Math.random(); return p; });

    (function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for(let i=0;i<particles.length;i++) {
            particles[i].update();
            particles[i].draw();
            for(let j=i+1;j<particles.length;j++) {
                const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
                const d=Math.sqrt(dx*dx+dy*dy);
                if(d<110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x,particles[i].y);
                    ctx.lineTo(particles[j].x,particles[j].y);
                    ctx.strokeStyle=`rgba(212,160,23,${(1-d/110)*.09})`;
                    ctx.lineWidth=.4; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    })();
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if(!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('formSubmit');
        const orig = btn.textContent;
        btn.textContent = 'Sent! ✓';
        btn.style.background = '#16a34a';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 2500);
    });
}
