/* ============================================
   PORTFOLIO — Interactive JavaScript
   Japanese × Korean Hybrid
   ============================================ */

(function () {
    'use strict';

    // --- Theme Toggle ---
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let currentTheme = localStorage.getItem('theme') || 'dark';
    let particles = [];
    let animationId;

    function setTheme(theme) {
        currentTheme = theme;
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        resetParticles();
    }

    themeToggle.addEventListener('click', () => {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Just apply theme visually — DON'T call setTheme() here because
    // particle classes (SakuraPetal, KoreanEmber) aren't defined yet.
    // Full initialization happens after classes are defined (see below).
    html.setAttribute('data-theme', currentTheme);

    // --- Canvas Setup ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Dynamic Culture Motifs ---
    function updateMotifs(theme) {
        const greeting = document.querySelector('.hero-greeting');
        const vertical = document.querySelector('.vertical-accent');
        
        if (theme === 'light') {
            // Japanese mode (Sakura Zen)
            if (greeting) greeting.textContent = "こんにちは — Hello";
            if (vertical) vertical.textContent = "ポートフォリオ";
        } else {
            // Korean mode (Seoul/Taegukgi Vibes)
            if (greeting) greeting.textContent = "안녕하세요 — Hello";
            if (vertical) vertical.textContent = "포트폴리오";
        }
    }

    // Hook updateMotifs into setTheme by overwriting it
    const originalSetTheme = setTheme;
    setTheme = function(theme) {
        currentTheme = theme;
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateMotifs(theme);
        resetParticles();
    };
    
    // Call immediately for initial state
    updateMotifs(currentTheme);

    // --- High Visibility Particle System ---
    
    // Light Mode: Sakura Petals (Japanese)
    class SakuraPetal {
        constructor() {
            this.reset(true);
        }

        reset(initialSpawn = false) {
            this.x = Math.random() * canvas.width;
            // If initial spawn, stagger them way above the screen so they fall down naturally
            this.y = initialSpawn ? -(Math.random() * canvas.height) : -30;
            this.size = Math.random() * 15 + 10;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.1;
            this.color = ['#ffb7c5', '#ffd1dc', '#fce4ec', '#f8bbd0'][Math.floor(Math.random() * 4)];
        }

        update() {
            this.x += this.speedX + Math.sin(this.angle) * 1;
            this.y += this.speedY;
            this.angle += this.spin;

            if (this.y > canvas.height + 30 || this.x > canvas.width + 50 || this.x < -50) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            // Senbonzakura anime aesthetic: glowing thin petals
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.9;
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color; 
            
            ctx.beginPath();
            ctx.moveTo(0, -this.size); // Pointy top
            ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.2, this.size * 0.4, this.size * 0.6, 0, this.size * 0.8); // Curved right edge
            ctx.bezierCurveTo(-this.size * 0.4, this.size * 0.6, -this.size * 0.6, -this.size * 0.2, 0, -this.size); // Curved left edge
            ctx.fill();
            
            ctx.restore();
        }
    }

    // Dark Mode: Taegukgi Embers (Korean)
    class KoreanEmber {
        constructor() {
            this.reset(true);
        }

        reset(randomY = false) {
            this.x = Math.random() * canvas.width;
            this.y = randomY ? Math.random() * canvas.height : canvas.height + 30;
            this.size = Math.random() * 4 + 2;
            this.speedY = -(Math.random() * 1 + 0.5); // Float upwards
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.pulseRate = Math.random() * 0.05 + 0.01;
            this.pulse = Math.random() * Math.PI * 2;
            
            // Taegukgi Colors: Deep Red, Deep Blue, Pure White
            this.colorRGB = [
                '205, 46, 58',  // Red
                '0, 71, 160',   // Blue
                '255, 255, 255' // White
            ][Math.floor(Math.random() * 3)];
        }

        update() {
            this.x += this.speedX + Math.sin(this.pulse) * 0.5;
            this.y += this.speedY;
            this.pulse += this.pulseRate;

            if (this.y < -30 || this.x > canvas.width + 30 || this.x < -30) {
                this.reset();
            }
        }

        draw() {
            const currentOpacity = this.opacity + Math.sin(this.pulse) * 0.2;
            
            ctx.beginPath();
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            grad.addColorStop(0, `rgba(${this.colorRGB}, ${currentOpacity})`);
            grad.addColorStop(1, `rgba(${this.colorRGB}, 0)`);
            
            ctx.fillStyle = grad;
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // --- Particle Management ---
    function resetParticles() {
        particles = [];
        const isLight = currentTheme === 'light';
        const count = isLight ? 40 : 80;
        const ParticleClass = isLight ? SakuraPetal : KoreanEmber;

        for (let i = 0; i < count; i++) {
            particles.push(new ParticleClass());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    resetParticles();
    animate();

    // --- Scroll Reveal ---
    const reveals = document.querySelectorAll('.reveal');

    // First, mark all elements currently in viewport as visible
    // BEFORE adding js-loaded class (which hides them)
    function revealVisibleNow() {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                el.classList.add('visible');
            }
        });
    }

    // Mark visible elements, then enable the animation system
    revealVisibleNow();
    requestAnimationFrame(() => {
        revealVisibleNow();
        // Now it's safe to add js-loaded — visible elements already have .visible class
        document.documentElement.classList.add('js-loaded');
    });

    // Set up IntersectionObserver for scroll-based reveals
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // Additional fallbacks
    setTimeout(revealVisibleNow, 200);
    setTimeout(revealVisibleNow, 500);
    window.addEventListener('load', revealVisibleNow);
    window.addEventListener('scroll', revealVisibleNow, { passive: true });

    // --- Active Nav Tracking ---
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-72px 0px 0px 0px'
    });

    sections.forEach(section => navObserver.observe(section));

    // --- Mobile Menu ---
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Navbar Scroll Effect ---
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const current = window.scrollY;

        if (current > 100) {
            navbar.style.borderBottomColor = 'var(--border-glass)';
        } else {
            navbar.style.borderBottomColor = 'transparent';
        }

        lastScroll = current;
    }, { passive: true });

    // --- Smooth scroll for all anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 72; // navbar height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Skill tag stagger animation ---
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, i) => {
        tag.style.transitionDelay = `${(i % 5) * 0.05}s`;
    });

})();
