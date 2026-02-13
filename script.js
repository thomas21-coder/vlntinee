// ==================== DOM Elements ====================
const heartsContainer = document.getElementById('heartsContainer');
const roseStage = document.getElementById('roseStage');
const envelopeStage = document.getElementById('envelopeStage');
const letterStage = document.getElementById('letterStage');
const roseWrapper = document.getElementById('roseWrapper');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelope = document.getElementById('envelope');
const roseText = document.getElementById('roseText');
const envelopeText = document.getElementById('envelopeText');

// ==================== State ====================
let currentStage = 'rose';
let isAnimating = false;

// ==================== Falling Hearts System ====================
const heartColors = [
    '#ff6b9d',
    '#ff8fb3', 
    '#ffb3c6',
    '#c44569',
    '#ffd1dc'
];

function createHeartSVG(color) {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 100 100">
            <path d="M50 88 C20 60 5 40 5 25 C5 10 20 0 35 0 C45 0 50 10 50 15 C50 10 55 0 65 0 C80 0 95 10 95 25 C95 40 80 60 50 88Z" 
                  fill="${color}"/>
        </svg>
    `;
    return heart;
}

function createFallingHeart() {
    const color = heartColors[Math.floor(Math.random() * heartColors.length)];
    const heart = createHeartSVG(color);
    
    // Random horizontal position
    const startX = Math.random() * window.innerWidth;
    heart.style.left = `${startX}px`;
    
    // Random size
    const scale = 0.5 + Math.random() * 0.8;
    heart.style.transform = `scale(${scale})`;
    
    // Random duration
    const duration = 6 + Math.random() * 6;
    heart.style.animationDuration = `${duration}s`;
    
    // Random horizontal sway
    const sway = (Math.random() - 0.5) * 100;
    heart.style.setProperty('--sway', `${sway}px`);
    
    heartsContainer.appendChild(heart);
    
    // Remove heart after animation
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

function startHeartsRain() {
    // Create initial batch of hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFallingHeart();
        }, i * 200);
    }
    
    // Continue creating hearts
    setInterval(() => {
        createFallingHeart();
    }, 400);
}

// ==================== Stage Transitions ====================
function transitionToEnvelope() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Hide rose stage
    roseStage.classList.add('exit');
    roseText.style.opacity = '0';
    
    setTimeout(() => {
        roseStage.classList.remove('active', 'exit');
        envelopeStage.classList.add('active');
        envelopeStage.style.opacity = '1';
        envelopeStage.style.transform = 'scale(1)';
        isAnimating = false;
    }, 600);
}

function transitionToLetter() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Open envelope animation
    envelope.classList.add('open');
    envelopeText.style.opacity = '0';
    
    setTimeout(() => {
        // Hide envelope stage
        envelopeStage.classList.add('exit');
        
        setTimeout(() => {
            envelopeStage.classList.remove('active', 'exit');
            letterStage.classList.add('active');
            letterStage.style.opacity = '1';
            letterStage.style.transform = 'scale(1)';
            isAnimating = false;
            
            // Create celebration hearts burst
            createHeartBurst();
        }, 500);
    }, 1000);
}

// ==================== Heart Burst Effect ====================
function createHeartBurst() {
    const burstContainer = document.createElement('div');
    burstContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 100;
    `;
    document.body.appendChild(burstContainer);
    
    for (let i = 0; i < 20; i++) {
        const heart = createHeartSVG(heartColors[Math.floor(Math.random() * heartColors.length)]);
        heart.style.position = 'absolute';
        heart.style.left = '0';
        heart.style.top = '0';
        
        const angle = (i / 20) * Math.PI * 2;
        const distance = 150 + Math.random() * 150;
        const duration = 0.8 + Math.random() * 0.5;
        
        heart.style.animation = `none`;
        heart.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        burstContainer.appendChild(heart);
        
        requestAnimationFrame(() => {
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            heart.style.transform = `translate(${x}px, ${y}px) scale(0.3)`;
            heart.style.opacity = '0';
        });
    }
    
    setTimeout(() => {
        burstContainer.remove();
    }, 2000);
}

// ==================== Event Listeners ====================
roseWrapper.addEventListener('click', () => {
    if (currentStage === 'rose') {
        currentStage = 'envelope';
        transitionToEnvelope();
    }
});

envelopeWrapper.addEventListener('click', () => {
    if (currentStage === 'envelope') {
        currentStage = 'letter';
        transitionToLetter();
    }
});

// Keyboard accessibility
roseWrapper.setAttribute('tabindex', '0');
roseWrapper.setAttribute('role', 'button');
roseWrapper.setAttribute('aria-label', 'Sentuh mawar untuk melanjutkan');

envelopeWrapper.setAttribute('tabindex', '0');
envelopeWrapper.setAttribute('role', 'button');
envelopeWrapper.setAttribute('aria-label', 'Buka amplop untuk membaca surat');

roseWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        roseWrapper.click();
    }
});

envelopeWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        envelopeWrapper.click();
    }
});

// Focus styles
[roseWrapper, envelopeWrapper].forEach(el => {
    el.addEventListener('focus', () => {
        el.style.outline = '3px solid #fff';
        el.style.outlineOffset = '8px';
        el.style.borderRadius = '50%';
    });
    el.addEventListener('blur', () => {
        el.style.outline = 'none';
    });
});

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    // Start hearts rain
    startHeartsRain();
    
    // Initialize first stage
    roseStage.classList.add('active');
    roseStage.style.opacity = '1';
    roseStage.style.transform = 'scale(1)';
});

// ==================== Window Resize Handler ====================
let resizeTimeout = null;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
        // Recreate hearts for new viewport size
        const existingHearts = heartsContainer.querySelectorAll('.falling-heart');
        existingHearts.forEach(heart => heart.remove());
    }, 300);
});