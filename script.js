const introScreen = document.getElementById('introScreen');
const envelopeScreen = document.getElementById('envelopeScreen');
const letterScreen = document.getElementById('letterScreen');
const continueBtn = document.getElementById('continueBtn');
const envelopeContainer = document.getElementById('envelopeContainer');
const envelope = document.getElementById('envelope');
const confettiContainer = document.getElementById('confettiContainer');
const musicBtn = document.getElementById('musicBtn');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const letterCard = document.querySelector('.letter-card');

let confettiShown = false;

let audioContext = null;
let isPlaying = false;

const melodyNotes = [
    { freq: 392, dur: 0.3 }, // G
    { freq: 392, dur: 0.3 }, // G
    { freq: 440, dur: 0.6 }, // A
    { freq: 392, dur: 0.6 }, // G
    { freq: 523, dur: 0.6 }, // C
    { freq: 494, dur: 1.2 }, // B
    { freq: 392, dur: 0.3 }, // G
    { freq: 392, dur: 0.3 }, // G
    { freq: 440, dur: 0.6 }, // A
    { freq: 392, dur: 0.6 }, // G
    { freq: 587, dur: 0.6 }, // D
    { freq: 523, dur: 1.2 }, // C
];

let currentNote = 0;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playNote(frequency, duration) {
    if (!audioContext) return;
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration);
}

function playMelody() {
    if (!isPlaying) return;
    
    const note = melodyNotes[currentNote];
    playNote(note.freq, note.dur);
    
    currentNote = (currentNote + 1) % melodyNotes.length;
    
    setTimeout(() => {
        if (isPlaying) playMelody();
    }, note.dur * 1000);
}

function toggleMusic() {
    initAudio();
    
    if (isPlaying) {
        isPlaying = false;
        musicBtn.textContent = '🔇';
        musicBtn.classList.remove('playing');
    } else {
        isPlaying = true;
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('playing');
        currentNote = 0;
        playMelody();
    }
}

musicBtn.addEventListener('click', toggleMusic);

continueBtn.addEventListener('click', () => {
    introScreen.classList.add('hide');
    setTimeout(() => {
        envelopeScreen.classList.add('show');
    }, 400);
});

envelopeContainer.addEventListener('click', () => {
    if (envelope.classList.contains('open')) return;
    
    envelope.classList.add('open');
    
    setTimeout(() => {
        if (!confettiShown) {
            createConfetti();
            confettiShown = true;

            if (!isPlaying) {
                toggleMusic();
            }
        }
        envelopeScreen.classList.add('hide');
        letterScreen.classList.add('show');
        letterCard.classList.remove('closing');
    }, 800);
});

closeLetterBtn.addEventListener('click', () => {
    letterCard.classList.add('closing');
    
    setTimeout(() => {
        letterScreen.classList.remove('show');
        envelopeScreen.classList.remove('hide');
        envelope.classList.remove('open');
    }, 500);
});

function createConfetti() {
    const colors = ['#FF6B9D', '#5BC0EB', '#7DCE82', '#FFD93D', '#FF8FB1', '#A78BFA'];
    const shapes = ['●', '■', '▲', '★', '♦', '♥'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.fontSize = (Math.random() * 15 + 8) + 'px';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            confettiContainer.appendChild(confetti);

            setTimeout(() => confetti.classList.add('active'), 10);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

function createFloatingDecos() {
    const decos = ['💖', '💫', '🌸', '⭐', '✨', '💕'];
    
    for (let i = 0; i < 8; i++) {
        const deco = document.createElement('div');
        deco.className = 'floating-deco';
        deco.textContent = decos[Math.floor(Math.random() * decos.length)];
        deco.style.left = Math.random() * 100 + 'vw';
        deco.style.top = Math.random() * 100 + 'vh';
        deco.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(deco);
    }
}

createFloatingDecos();

function createBgConfetti() {
    const bgConfetti = document.getElementById('bgConfetti');
    const colors = ['#FF6B9D', '#5BC0EB', '#7DCE82', '#FFD93D', '#FF8FB1', '#A78BFA', '#F9A8D4', '#6EE7B7'];
    const shapes = ['●', '■', '▲', '★', '♦', '◆', '○', '□'];

    for (let i = 0; i < 30; i++) {
        createSingleBgConfetti(bgConfetti, colors, shapes, Math.random() * 15);
    }

    setInterval(() => {
        if (bgConfetti.children.length < 40) {
            createSingleBgConfetti(bgConfetti, colors, shapes, 0);
        }
    }, 800);
}

function createSingleBgConfetti(container, colors, shapes, delay) {
    const piece = document.createElement('div');
    piece.className = 'bg-confetti-piece';
    piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.fontSize = (Math.random() * 16 + 10) + 'px';
    piece.style.animationDuration = (Math.random() * 8 + 10) + 's';
    piece.style.animationDelay = delay + 's';
    
    container.appendChild(piece);

    const duration = parseFloat(piece.style.animationDuration) + delay;
    setTimeout(() => piece.remove(), duration * 1000);
}

createBgConfetti();

document.querySelectorAll('button, .envelope-container').forEach(el => {
    el.addEventListener('touchstart', () => {
        el.style.transform = 'scale(0.98)';
    });
    el.addEventListener('touchend', () => {
        el.style.transform = '';
    });
});
