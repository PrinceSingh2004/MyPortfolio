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
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const targetText = stat.getAttribute('data-target');
                    const target = Number(targetText);
                    const suffix = stat.getAttribute('data-suffix') || '';
                    
                    if (isNaN(target)) return;

                    let startTime = null;
                    const duration = 2000;

                    function updateCounter(currentTime) {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);
                        
                        // easeOutExpo
                        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        
                        const currentValue = Math.floor(easeProgress * target);
                        stat.innerText = currentValue + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target + suffix;
                            stat.classList.add('glow-pulse');
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    observer.unobserve(stat);
                }
            });
        }, observerOptions);

        stats.forEach(stat => {
            observer.observe(stat);
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



    /* ================= CONTACT FORM ================= */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const successMsg = document.getElementById('form-success');
            const errorMsg = document.getElementById('form-error');
            
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    successMsg.style.display = 'block';
                    contactForm.reset();
                } else {
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                errorMsg.style.display = 'block';
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
                setTimeout(() => {
                    successMsg.style.display = 'none';
                    errorMsg.style.display = 'none';
                }, 5000);
            }
        });
    }

    /* ================= INITIALIZE ================= */
    animateCounters();
    animateProficiency();

    /* ================= RESUME DOWNLOAD HANDLER ================= */
    document.querySelectorAll(".resume-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const fileUrl = btn.getAttribute("href");

            try {
                const response = await fetch(fileUrl, { method: "HEAD" });

                if (!response.ok) {
                    e.preventDefault();
                    alert("Resume file not found. Please upload Prince_Singh_Resume.pdf inside assets folder.");
                } else {
                    console.log("Resume download started");
                }
            } catch (error) {
                e.preventDefault();
                alert("Resume download failed. Check file path or deployment.");
            }
        });
    });

});
