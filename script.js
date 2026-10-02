/* ============================================
   1. DOM
============================================ */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
    bgLayer: $('#bgLayer'),
    screens: $$('.screen'),
    audioToggle: $('#audioToggle'),
    audioIcon: $('#audioIcon'),
    bgMusic: $('#bgMusic'),
    envelope: $('#envelope'),
    envelopeSeal: $('#envelopeSeal'),
    envelopeContainer: $('#envelopeContainer'),
    btnDiscover: $('#btnDiscover'),
    btnYes: $('#btnYes'),
    btnNo: $('#btnNo'),
    dayButtons: $$('.day-btn'),
    timeButtons: $$('.time-btn'),
    selectedDateDisplay: $('#selectedDateDisplay'),
    selectedTimeDisplay: $('#selectedTimeDisplay'),
    personalMessage: $('#personalMessage'),
    btnConfirm: $('#btnConfirm'),
    btnCalendar: $('#btnCalendar'),
    btnWhatsApp: $('#btnWhatsApp'),
    finalDay: $('#finalDay'),
    finalTime: $('#finalTime'),
    particles: $('#particles')
};

/* ============================================
   2. STATE
============================================ */
const state = {
    screen: 1,
    selectedDay: 'Samedi',
    selectedTime: '16:30',
    envelopeOpened: false,
    message: '',
    noAttempts: 0,
    musicPlaying: false,
    musicMuted: false,
    userInteracted: false,
    answered: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

const noMessages = [
    'Non',
    'T\'es sûre ?',
    'Vraiment ? 😅',
    'Réfléchis encore...',
    'Allez... ❤️'
];

const WHATSAPP_PHONE = '2250705689548';

/* ============================================
   3. PARTICLES
============================================ */
function createParticles() {
    if (state.reducedMotion) return;
    const count = 15;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        const size = 3 + Math.random() * 7;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (9 + Math.random() * 8) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.opacity = 0.2 + Math.random() * 0.5;
        dom.particles.appendChild(p);
    }
}

/* ============================================
   4. PLUIE DE CŒURS
============================================ */
function createHeartRain() {
    if (state.reducedMotion) return;

    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'hearts-rain';
    heartsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
        overflow: hidden;
    `;
    document.body.appendChild(heartsContainer);

    const heartCount = 30;
    const hearts = ['❤️', '💕', '💖', '💗', '🌸', '✨'];

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.className = 'falling-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            const startX = Math.random() * 100;
            const size = 20 + Math.random() * 20;
            const duration = 3 + Math.random() * 2;
            const delay = Math.random() * 0.5;
            
            heart.style.cssText = `
                position: absolute;
                left: ${startX}%;
                top: -50px;
                font-size: ${size}px;
                animation: fallHeart ${duration}s ease-in ${delay}s forwards;
                opacity: 0;
            `;
            
            heartsContainer.appendChild(heart);
        }, i * 80);
    }

    setTimeout(() => {
        heartsContainer.remove();
    }, 5000);
}

/* ============================================
   5. ENVELOPE INTERACTION
============================================ */
function openEnvelope(e) {
    if (e && e.target && e.target.closest('#btnDiscover')) {
        // Clic sur le bouton découvrir à l'intérieur de la lettre
        return;
    }
    triggerFirstInteraction();
    if (!state.envelopeOpened) {
        state.envelopeOpened = true;
        if (dom.envelope) {
            dom.envelope.classList.add('is-open');
        }
    }
}

/* ============================================
   6. SCREENS
============================================ */
function showScreen(screenNumber) {
    const current = $(`.screen.is-active`);
    const next = $(`.screen[data-screen="${screenNumber}"]`);
    if (!next || current === next) return;

    if (current) {
        current.classList.add('is-leaving');
        current.classList.remove('is-active');
        setTimeout(() => {
            current.classList.remove('is-leaving');
        }, 600);
    }

    setTimeout(() => {
        next.classList.add('is-active');
        state.screen = screenNumber;

        // Changement de fond pour l'écran final
        if (screenNumber === 4) {
            dom.bgLayer.classList.add('has-sunset');
        }
    }, current ? 300 : 0);
}

/* ============================================
   7. BUTTONS & SELECTIONS
============================================ */
function handleDiscover(e) {
    if (e) e.stopPropagation();
    triggerFirstInteraction();
    showScreen(2);
}

function handleYes() {
    triggerFirstInteraction();
    createHeartRain(); // Pluie de cœurs !
    
    setTimeout(() => {
        showScreen(3);
    }, 800);
}

function handleNo(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    triggerFirstInteraction();

    if (state.reducedMotion) return;

    const btn = dom.btnNo;
    if (btn.dataset.disappearing === 'true') return;

    const idx = Math.min(state.noAttempts, noMessages.length - 1);
    btn.textContent = noMessages[idx];
    state.noAttempts++;

    // Après 5 tentatives, faire disparaître le bouton
    if (state.noAttempts >= 5) {
        btn.dataset.disappearing = 'true';
        btn.style.transition = 'opacity 600ms ease, transform 600ms ease';
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            btn.style.display = 'none';
        }, 600);
        
        return;
    }

    // Déplacement aléatoire
    const transforms = [
        'translateX(30px) translateY(-10px) rotate(3deg)',
        'translateX(-35px) translateY(12px) rotate(-3deg)',
        'translateX(40px) translateY(20px) rotate(2deg)',
        'translateX(-30px) translateY(-25px) rotate(-2deg)',
        'translateX(25px) translateY(-15px) rotate(4deg)'
    ];

    btn.style.transform = transforms[idx % transforms.length];
}

function selectDay(day) {
    state.selectedDay = day;
    dom.dayButtons.forEach(b => {
        b.classList.toggle('is-selected', b.dataset.day === day);
    });
    if (dom.selectedDateDisplay) {
        dom.selectedDateDisplay.textContent = (day + ' prochain').toUpperCase();
    }
}

function selectTime(time) {
    state.selectedTime = time;
    dom.timeButtons.forEach(b => {
        b.classList.toggle('is-selected', b.dataset.time === time);
    });
    if (dom.selectedTimeDisplay) {
        dom.selectedTimeDisplay.textContent = time;
    }
    dom.btnConfirm.disabled = false;
}

function buildWhatsAppUrl() {
    const dayText = state.selectedDay + ' prochain';
    let text = `Coucou ! ❤️ J'accepte avec grand plaisir ton invitation pour le pique-nique au bord de la lagune !\n\n`;
    text += `📅 Jour : ${dayText}\n`;
    text += `⏰ Heure : ${state.selectedTime || '16:30'}\n`;
    if (state.message) {
        text += `💬 Petit mot : "${state.message}"\n`;
    }
    text += `\nÀ très vite ! 🌅✨`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

function confirmInvitation() {
    state.message = dom.personalMessage.value.trim();
    
    if (dom.finalDay) {
        dom.finalDay.textContent = state.selectedDay + ' prochain';
    }
    if (dom.finalTime) {
        dom.finalTime.textContent = 'à ' + (state.selectedTime || '16:30');
    }
    
    state.answered = true;
    
    // Configurer le lien WhatsApp
    const waUrl = buildWhatsAppUrl();
    if (dom.btnWhatsApp) {
        dom.btnWhatsApp.href = waUrl;
    }
    
    showScreen(4);
    
    // Tenter d'ouvrir WhatsApp après une courte pause fluide
    setTimeout(() => {
        try {
            window.open(waUrl, '_blank');
        } catch (e) {}
    }, 450);
}

/* ============================================
   8. AUDIO
============================================ */
const audio = {
    targetVolume: 0.35,
    fadeInterval: null
};

function playMusic() {
    const m = dom.bgMusic;
    m.volume = 0;
    const p = m.play();
    if (p && typeof p.then === 'function') {
        p.then(() => {
            state.musicPlaying = true;
            fadeIn(m, 1500, audio.targetVolume);
            updateAudioUI();
        }).catch(() => {
            // autoplay bloqué, on attend une interaction
        });
    }
}

function pauseMusic() {
    const m = dom.bgMusic;
    fadeOut(m, 800).then(() => {
        m.pause();
        state.musicPlaying = false;
        updateAudioUI();
    });
}

function toggleMusic() {
    triggerFirstInteraction();
    if (state.musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function updateAudioUI() {
    dom.audioToggle.classList.toggle('is-playing', state.musicPlaying);
    dom.audioIcon.textContent = state.musicPlaying ? '♫' : '♪';
}

function fadeIn(el, duration, target) {
    return new Promise(resolve => {
        clearInterval(audio.fadeInterval);
        const steps = 20;
        const stepTime = duration / steps;
        const increment = target / steps;
        let current = el.volume;
        el.volume = Math.max(0.01, current);
        audio.fadeInterval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(audio.fadeInterval);
                resolve();
            }
            el.volume = current;
        }, stepTime);
    });
}

function fadeOut(el, duration) {
    return new Promise(resolve => {
        clearInterval(audio.fadeInterval);
        const steps = 20;
        const stepTime = duration / steps;
        const decrement = el.volume / steps;
        let current = el.volume;
        audio.fadeInterval = setInterval(() => {
            current -= decrement;
            if (current <= 0.01) {
                current = 0;
                clearInterval(audio.fadeInterval);
                el.volume = 0;
                resolve();
            }
            el.volume = current;
        }, stepTime);
    });
}

function switchMusic(newTrack) {
    const m = dom.bgMusic;
    fadeOut(m, 1500).then(() => {
        m.pause();
        m.src = newTrack;
        m.load();
        const p = m.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                state.musicPlaying = true;
                fadeIn(m, 1500, audio.targetVolume);
                updateAudioUI();
            }).catch(() => {});
        }
    });
}

/* ============================================
   8. FIRST INTERACTION FALLBACK
============================================ */
function triggerFirstInteraction() {
    if (state.userInteracted) return;
    state.userInteracted = true;
    if (!state.musicPlaying) {
        playMusic();
    }
}

['click', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, triggerFirstInteraction, { once: false, passive: true });
});

/* ============================================
   9. CALENDAR
============================================ */
function getNextTargetDate(dayName) {
    const now = new Date();
    // 6 = Samedi, 0 = Dimanche
    const targetDayIndex = (dayName && dayName.toLowerCase().startsWith('sam')) ? 6 : 0;
    const currentDayIndex = now.getDay();
    let daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;
    // Si c'est aujourd'hui ou 0, on vise la semaine prochaine (+7 jours)
    if (daysToAdd === 0) daysToAdd = 7;
    const date = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return date;
}

function generateCalendarEvent() {
    const date = getNextTargetDate(state.selectedDay);
    const [h, m] = (state.selectedTime || '16:30').split(':').map(Number);
    date.setHours(h, m, 0, 0);

    const endDate = new Date(date.getTime() + 3 * 60 * 60 * 1000); // +3h

    const fmt = (d) => {
        const pad = (n) => String(n).padStart(2, '0');
        return d.getFullYear() +
            pad(d.getMonth() + 1) +
            pad(d.getDate()) + 'T' +
            pad(d.getHours()) +
            pad(d.getMinutes()) + '00';
    };

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Romantic Invite//FR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:' + Date.now() + '@romantic-invite',
        'DTSTAMP:' + fmt(new Date()),
        'DTSTART:' + fmt(date),
        'DTEND:' + fmt(endDate),
        'SUMMARY:Pique-nique au bord de la lagune ❤️',
        'LOCATION:Au bord de la lagune',
        'DESCRIPTION:Un petit pique-nique romantique\\, un coucher de soleil et nous deux.' +
            (state.message ? '\\n\\nMessage : ' + state.message.replace(/\n/g, '\\n') : ''),
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pique-nique-${state.selectedDay.toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ============================================
   10. BACKGROUND IMAGE DETECTION
============================================ */
function detectBackgroundImage() {
    const img = new Image();
    img.onload = () => dom.bgLayer.classList.add('has-image');
    img.src = 'asset/images/lagoon.jpeg';
}

/* ============================================
   11. INITIALIZATION & EVENTS
============================================ */
function bindEvents() {
    // Enveloppe interactive
    if (dom.envelope) {
        dom.envelope.addEventListener('click', openEnvelope);
    }
    if (dom.envelopeSeal) {
        dom.envelopeSeal.addEventListener('click', openEnvelope);
    }

    if (dom.btnDiscover) {
        dom.btnDiscover.addEventListener('click', handleDiscover);
    }
    if (dom.btnYes) {
        dom.btnYes.addEventListener('click', handleYes);
    }

    // Bouton NON : souris + tactile
    if (dom.btnNo) {
        dom.btnNo.addEventListener('mouseenter', handleNo);
        dom.btnNo.addEventListener('touchstart', handleNo, { passive: false });
        dom.btnNo.addEventListener('click', (e) => {
            e.preventDefault();
            handleNo(e);
        });
        dom.btnNo.addEventListener('focus', handleNo);
    }

    // Sélecteurs de jour (Samedi / Dimanche)
    dom.dayButtons.forEach(btn => {
        btn.addEventListener('click', () => selectDay(btn.dataset.day));
    });

    // Sélecteurs d'heure
    dom.timeButtons.forEach(btn => {
        btn.addEventListener('click', () => selectTime(btn.dataset.time));
    });

    if (dom.btnConfirm) {
        dom.btnConfirm.addEventListener('click', confirmInvitation);
    }
    if (dom.btnCalendar) {
        dom.btnCalendar.addEventListener('click', generateCalendarEvent);
    }
    if (dom.audioToggle) {
        dom.audioToggle.addEventListener('click', toggleMusic);
    }

    if (dom.personalMessage) {
        dom.personalMessage.addEventListener('input', (e) => {
            state.message = e.target.value;
        });
    }
}

function init() {
    createParticles();
    detectBackgroundImage();
    bindEvents();
    updateAudioUI();

    // Tenter l'autoplay
    const p = dom.bgMusic.play();
    if (p && typeof p.then === 'function') {
        p.then(() => {
            state.musicPlaying = true;
            dom.bgMusic.volume = audio.targetVolume;
            updateAudioUI();
        }).catch(() => {
            dom.bgMusic.pause();
        });
    }
}

/* ============================================
   12. BEFOREUNLOAD GUARD
============================================ */
function handleBeforeUnload(e) {
    // N'afficher l'avertissement que si la personne a interagi
    // (elle a au moins cliqué sur "découvrir") mais n'a pas encore répondu
    if (!state.userInteracted || state.answered) return;

    // Message standard – les navigateurs modernes ignorent le texte
    // personnalisé et affichent leur propre message par sécurité,
    // mais on le définit quand même pour les anciens navigateurs.
    const message = 'Tu n\'as pas encore répondu à mon invitation… tu pars déjà ? 🥺';
    e.preventDefault();
    e.returnValue = message; // requis pour Chrome
    return message;
}

window.addEventListener('beforeunload', handleBeforeUnload);

document.addEventListener('DOMContentLoaded', init);