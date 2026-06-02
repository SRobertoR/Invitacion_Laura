document.addEventListener('DOMContentLoaded', () => {

    // 1. MANEJO DEL REPRODUCTOR DE MÚSICA, REVELACIÓN Y SCROLL
    const audio = document.getElementById('bg-music');
    const btnStart = document.getElementById('btn-start');
    const mainContent = document.getElementById('main-content');
    const musicWidget = document.getElementById('music-widget');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');

    // Acción principal al presionar "Ver Detalles y Escuchar"
    btnStart.addEventListener('click', () => {
        // 1. Mostrar la envoltura oculta del contenido quitando 'hidden' y activando opacidad
        mainContent.classList.remove('hidden');
        setTimeout(() => {
            mainContent.classList.remove('opacity-0');
        }, 10); // Breve espera para que la transición CSS de opacidad funcione impecable

        // 2. Desplazamiento suave hasta la sección de la cuenta regresiva/detalles
        document.getElementById('contador-seccion').scrollIntoView({ behavior: 'smooth' });
        
        // 3. Intento controlado de reproducir música
        audio.play().then(() => {
            musicWidget.classList.remove('hidden');
            musicIcon.textContent = '⏸️';
        }).catch(err => {
            console.log("Interacción requerida para audio:", err);
            musicWidget.classList.remove('hidden');
            musicIcon.textContent = '🎵';
        });
    });

    // Botón flotante para activar/pausar la música
    musicToggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            musicIcon.textContent = '⏸️';
            musicToggle.classList.add('pulse-active');
        } else {
            audio.pause();
            musicIcon.textContent = '🎵';
            musicToggle.classList.remove('pulse-active');
        }
    });


    // 2. CUENTA REGRESIVA (Octubre 24, 4:00 PM)
    const targetDate = new Date('2026-10-24T16:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            document.getElementById('contador-seccion').innerHTML = "<p class='font-serif-elegant text-2xl text-[#eec759]'>¡Llegó el día esperado! Bienvenidos.</p>";
            clearInterval(countdownInterval);
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(d).padStart(2, '0');
        document.getElementById('hours').textContent = String(h).padStart(2, '0');
        document.getElementById('minutes').textContent = String(m).padStart(2, '0');
        document.getElementById('seconds').textContent = String(s).padStart(2, '0');
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();


    // 3. LOGICA INTERACTIVA DEL CARRUSEL DE IMÁGENES
    const track = document.getElementById('carouselTrack');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;

    const updateCarouselPosition = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarouselPosition();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarouselPosition();
    });


    // 4. EFECTOS VISUALES: CANVAS DE POLVO DE ORO FLOTANTE
    const canvas = document.getElementById('gold-particles');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4.5 + 2.0; // Partículas más grandes (mínimo 2px, máximo 6.5px)
            this.speedY = Math.random() * 0.6 + 0.2;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.4 + 0.5; // Mayor opacidad (mínimo 50% visibles)
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#d4af37';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#eec759';
            ctx.fill();
            ctx.restore();
        }
    }

    const initParticles = () => {
        particlesArray = [];
        for (let i = 0; i < 75; i++) {
            particlesArray.push(new Particle());
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();
});