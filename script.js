document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    /* ================= CINEMATIC LOADER ================= */
    const loader = document.getElementById('loader');
    const loaderProgress = document.querySelector('.loader-progress');
    const topLine = document.querySelector('.top-line');
    const bottomLine = document.querySelector('.bottom-line');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) progress = 100;
        loaderProgress.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(triggerCinematicIntro, 600);
        }
    }, 150);

    function triggerCinematicIntro() {
        document.querySelector('.loader-content').style.opacity = '0';
        setTimeout(() => {
            topLine.style.height = '0';
            bottomLine.style.height = '0';
            loader.style.background = 'transparent';
            loader.style.pointerEvents = 'none';
            document.body.classList.remove('loading');
            animateHero();
        }, 800);
        setTimeout(() => { loader.style.display = 'none'; }, 2500);
    }

    /* ================= GSAP ANIMATIONS ================= */
    function animateHero() {
        gsap.to('.cinematic-intro', {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            stagger: 0.2,
            ease: 'power4.out',
            clearProps: 'all'
        });
    }

    // Scroll Reveal Fade Ups
    gsap.utils.toArray('.fade-up').forEach(element => {
        gsap.fromTo(element,
            { y: 60, opacity: 0, filter: 'blur(5px)' },
            {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    /* ================= SCROLL PROGRESS & NAV ================= */
    const scrollBar = document.getElementById('scroll-bar');
    const nav = document.querySelector('.glass-nav');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + '%';

        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            nav.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ================= ADDICTIVE CUSTOM CURSOR ================= */
    const cursorGlow = document.querySelector('.cursor-glow');
    gsap.set(cursorGlow, { xPercent: -50, yPercent: -50 });

    const setCursorX = gsap.quickTo(cursorGlow, "left", { duration: 0.4, ease: "power3.out" });
    const setCursorY = gsap.quickTo(cursorGlow, "top", { duration: 0.4, ease: "power3.out" });

    window.addEventListener('mousemove', e => {
        setCursorX(e.clientX);
        setCursorY(e.clientY);
    });

    const interactables = document.querySelectorAll('a, button, .cinematic-card, .glass-panel, input, textarea');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
        el.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
    });

    /* ================= MOBILE MENU ================= */
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
    }

    hamburger.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) toggleMenu();
        });
    });

    /* ================= 3D KINETIC TILT EFFECT ================= */
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* ================= STATS COUNTER ANIMATION ================= */
    function animateCounters() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            gsap.to(stat, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ================= PROFICIENCY BARS ================= */
    function animateProficiency() {
        const bars = document.querySelectorAll('.proficiency-fill');
        bars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            gsap.to(bar, {
                width: width,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ================= TESTIMONIALS DRAG SCROLL ================= */
    const testimonialsRow = document.querySelector('.testimonials-row');
    if (testimonialsRow) {
        let isDown = false;
        let startX;
        let scrollLeft;
        testimonialsRow.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - testimonialsRow.offsetLeft;
            scrollLeft = testimonialsRow.scrollLeft;
        });
        testimonialsRow.addEventListener('mouseleave', () => { isDown = false; });
        testimonialsRow.addEventListener('mouseup', () => { isDown = false; });
        testimonialsRow.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsRow.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsRow.scrollLeft = scrollLeft - walk;
        });
    }

    /* ================= NEWSLETTER FEEDBACK ================= */
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Subscribed';
            btn.style.background = 'var(--accent-green)';
            newsletterForm.reset();
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        });
    }

    /* ================= INITIALIZE ================= */
    animateCounters();
    animateProficiency();
});
