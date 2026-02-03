document.addEventListener('DOMContentLoaded', () => {

    // Audio Systems
    const bgMusic = document.getElementById('bg-music');
    const sfxLaugh = document.getElementById('sfx-laugh');
    const musicBtn = document.getElementById('music-toggle');
    let isMusicPlaying = false;

    // Background Music Toggle
    if (musicBtn && bgMusic) {
        bgMusic.volume = 0.4; // 40% volume default

        musicBtn.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                bgMusic.play().catch(e => console.log("Audio play failed interaction required"));
                musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }

    // Hover Sound Effects (Title)
    const titles = document.querySelectorAll('.cinematic-title, .cinematic-subtitle');
    titles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            if (sfxLaugh && isMusicPlaying) { // Only play SFX if user has enabled audio
                sfxLaugh.currentTime = 0;
                sfxLaugh.volume = 0.6;
                sfxLaugh.play().catch(e => { }); // Ignore interaction errors
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

        // Add simple hover sound effect only (Visuals handled by CSS)
        document.querySelectorAll('.title-char').forEach(char => {
            char.addEventListener('mouseenter', () => {
                // Play Sound on hover
                if (sfxLaugh && isMusicPlaying) {
                    sfxLaugh.currentTime = 0;
                    sfxLaugh.volume = 0.4;
                    sfxLaugh.play().catch(e => { });
                }
            });
        });
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
