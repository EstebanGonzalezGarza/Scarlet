document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Logic
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Audio Systems
    const bgMusic = document.getElementById('bg-music');
    const sfxLaugh = document.getElementById('sfx-laugh'); // Source element
    const musicBtn = document.getElementById('music-toggle');
    let isMusicPlaying = false;

    // Auto-Play Attempt on First User Interaction (Any click)
    const enableAudio = () => {
        if (!isMusicPlaying && bgMusic) {
            bgMusic.volume = 0.5;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                if (musicBtn) musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }).catch(() => {
                // Browser blocked it, waiting for explicit click on button
            });
        }
        // Remove listener after first attempt
        document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio);

    // Manual Toggle
    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the global click above
            if (isMusicPlaying) {
                bgMusic.pause();
                musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                isMusicPlaying = false;
            } else {
                bgMusic.play();
                musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                isMusicPlaying = true;
            }
        });
    }

    // Hover Sound Effects (Title) - Using Audio Cloning for overlapping sounds
    document.querySelectorAll('.title-char').forEach(char => {
        char.addEventListener('mouseenter', () => {
            // Visuals handled by CSS
            // Audio logic:
            if (sfxLaugh && isMusicPlaying) {
                // Clone the node to allow overlapping laughs
                const laughClone = sfxLaugh.cloneNode();
                laughClone.volume = 0.6;
                laughClone.play().catch(e => { });
                // Cleanup clone after playing
                laughClone.onended = () => laughClone.remove();
            }
        });
    });

    // 3D Tilt Effect on Title Letters & Glitch Init
    const titleElement = document.querySelector('.cinematic-title');
    if (titleElement) {
        // Wrap title in glitch container
        const wrapper = document.createElement('div');
        wrapper.className = 'glitch-wrapper';
        titleElement.parentNode.insertBefore(wrapper, titleElement);
        wrapper.appendChild(titleElement);

        // Split letters
        const text = titleElement.innerText;
        titleElement.innerHTML = text.split('').map(char =>
            `<span class="title-char">${char}</span>`
        ).join('');
    }

    // Scroll Indicator Animation
    // (Handled by CSS currently)

    // Smooth Scroll Reveal
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.text-reveal, .gallery-card').forEach(el => {
        observer.observe(el);
    });

    // Deep Parallax Effect on Scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Parallax Backgrounds
        document.querySelectorAll('.parallax-bg').forEach((bg, index) => {
            // Check if section is in viewport to optimize
            const section = bg.parentElement;
            const rect = section.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.4;
                const yPos = -(rect.top * speed);
                bg.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });

        // Hero Text Parallax (Opposite direction)
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Particle System
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Resize
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 50, 50, ${this.alpha})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            for (let i = 0; i < 50; i++) particles.push(new Particle());
        };
        initParticles();

        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }
});
