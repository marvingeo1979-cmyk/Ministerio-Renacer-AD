// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
    });
}

// Fade in animations on scroll
const observerOptions = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.ministry-card, .about-text, .about-image, .video-card, .section-header, .videos-cta, .carousel-wrapper, .radio-player-card, .radio-schedule').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Contact Form submission (Mock)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Gracias por contactarnos! Tu mensaje ha sido enviado. Dios te bendiga.');
        contactForm.reset();
    });
}

// ===================== CARRUSEL =====================
(function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const total = slides.length;
    let current = 0;
    let autoPlayTimer = null;

    // Crear puntos indicadores
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function updateCarousel() {
        track.style.transform = `translateX(-${current * 100}%)`;
        // Actualizar slides y dots
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === current);
        });
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        current = (index + total) % total;
        updateCarousel();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // Botones
    nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
    prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { next(); resetAutoPlay(); }
        if (e.key === 'ArrowLeft') { prev(); resetAutoPlay(); }
    });

    // Swipe táctil
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
            resetAutoPlay();
        }
    }, { passive: true });

    // Auto-play
    function startAutoPlay() {
        autoPlayTimer = setInterval(next, 4500);
    }
    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // Pausar al pasar el cursor
    const wrapper = document.querySelector('.carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        wrapper.addEventListener('mouseleave', startAutoPlay);
    }

    updateCarousel();
    startAutoPlay();
})();

// ===================== RADIO EN LÍNEA =====================
(function initRadio() {
    const audio = document.getElementById('radioAudio');
    const playBtn = document.getElementById('radioPlayBtn');
    const iconPlay = document.getElementById('iconPlay');
    const iconPause = document.getElementById('iconPause');
    const volSlider = document.getElementById('radioVolSlider');
    const volDown = document.getElementById('radioVolDown');
    const volUp = document.getElementById('radioVolUp');
    const muteBtn = document.getElementById('radioMuteBtn');
    const liveBadge = document.getElementById('radioLiveBadge');
    const equalizer = document.getElementById('radioEqualizer');
    const albumImg = document.getElementById('radioAlbumImg');
    const radioSection = document.querySelector('.radio-section');
    const songTitle = document.getElementById('radioSongTitle');

    if (!audio || !playBtn) return;

    let isPlaying = false;
    let isMuted = false;
    let prevVolume = 0.8;

    audio.volume = 0.8;

    function setPlaying(state) {
        isPlaying = state;
        iconPlay.style.display = state ? 'none' : 'block';
        iconPause.style.display = state ? 'block' : 'none';
        equalizer && equalizer.classList.toggle('active', state);
        albumImg && albumImg.classList.toggle('spinning', state);
        liveBadge && liveBadge.classList.toggle('active', state);
        radioSection && radioSection.classList.toggle('playing', state);
    }

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            setPlaying(false);
        } else {
            audio.load();
            audio.play()
                .then(() => {
                    setPlaying(true);
                    if (songTitle) songTitle.textContent = 'Transmisión en Vivo 🎙️';
                })
                .catch(() => {
                    setPlaying(false);
                    if (songTitle) songTitle.textContent = '⚠️ Configura el enlace de tu stream de radio';
                });
        }
    });

    volSlider.addEventListener('input', () => {
        const vol = volSlider.value / 100;
        audio.volume = vol;
        prevVolume = vol;
        isMuted = (vol === 0);
        updateMuteIcon();
    });

    volDown.addEventListener('click', () => {
        const v = Math.max(0, parseFloat(volSlider.value) - 10);
        volSlider.value = v;
        audio.volume = v / 100;
        prevVolume = v / 100;
        isMuted = (v === 0);
        updateMuteIcon();
    });

    volUp.addEventListener('click', () => {
        const v = Math.min(100, parseFloat(volSlider.value) + 10);
        volSlider.value = v;
        audio.volume = v / 100;
        prevVolume = v / 100;
        isMuted = false;
        updateMuteIcon();
    });

    muteBtn.addEventListener('click', () => {
        if (!isMuted) {
            prevVolume = audio.volume;
            audio.volume = 0;
            volSlider.value = 0;
            isMuted = true;
        } else {
            const r = prevVolume > 0 ? prevVolume : 0.8;
            audio.volume = r;
            volSlider.value = r * 100;
            isMuted = false;
        }
        updateMuteIcon();
    });

    function updateMuteIcon() {
        muteBtn.classList.toggle('muted', isMuted);
    }

    audio.addEventListener('error', () => {
        setPlaying(false);
        if (songTitle) songTitle.textContent = '⚠️ Configura el enlace de tu stream de radio';
    });
    audio.addEventListener('ended', () => setPlaying(false));
})();

