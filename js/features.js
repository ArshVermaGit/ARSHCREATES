// ============================================
// PREMIUM FEATURES & ANIMATIONS
// ============================================

class PremiumFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.setupCustomCursor();
        this.setupParticles();
        this.setupParallaxEffects();
        this.setupAdvancedAnimations();
        this.setupInteractiveElements();
    }

    // Custom Cursor
    setupCustomCursor() {
        const cursorDot = document.getElementById('cursorDot');
        const cursorRing = document.getElementById('cursorRing');
        
        if (!cursorDot || !cursorRing) return;
        
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            
            cursorRing.style.left = e.clientX + 'px';
            cursorRing.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursorDot.classList.add('hover');
            cursorRing.classList.add('hover');
        });
        
        document.addEventListener('mouseup', () => {
            cursorDot.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });
        
        const hoverElements = document.querySelectorAll('a, button, .portfolio-card, .nav-link');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorRing.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorRing.classList.remove('hover');
            });
        });
    }

    // Particle Background
    setupParticles() {
        const container = document.getElementById('particlesContainer');
        if (!container) return;

        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            const animationDuration = 15 + Math.random() * 20;
            const animationDelay = Math.random() * 20;
            particle.style.animationDuration = animationDuration + 's';
            particle.style.animationDelay = animationDelay + 's';
            
            const opacity = Math.random() * 0.5 + 0.1;
            particle.style.opacity = opacity;
            
            container.appendChild(particle);
        }
    }

    // Parallax Effects
    setupParallaxEffects() {
        const heroBackground = document.querySelector('.hero-gradient');
        
        if (!heroBackground) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroBackground.style.transform = `rotate(${rate * 0.1}deg)`;
        });
    }

    // Advanced Animations
    setupAdvancedAnimations() {
        this.setupTiltEffects();
        this.setupMagneticButtons();
        this.setupScrollReveal();
    }

    setupTiltEffects() {
        const tiltElements = document.querySelectorAll('.portfolio-card, .stat-card');

        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;

                element.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale3d(1.05, 1.05, 1.05)
                `;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn-primary, .btn-outline');

        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const deltaX = (x - centerX) * 0.3;
                const deltaY = (y - centerY) * 0.3;

                button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    // Interactive Elements
    setupInteractiveElements() {
        this.setupRippleEffects();
        this.setupHoverSounds();
    }

    setupRippleEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    setupHoverSounds() {
        // This would require audio files - placeholder for future implementation
        const interactiveElements = document.querySelectorAll('.btn, .portfolio-card, .nav-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                // Play subtle hover sound
                // this.playHoverSound();
            });
        });
    }

    playHoverSound() {
        // Implementation for hover sounds
        // const audio = new Audio('sounds/hover.mp3');
        // audio.volume = 0.1;
        // audio.play();
    }
}

// Additional CSS for ripple effect
const rippleStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .btn {
        position: relative;
        overflow: hidden;
    }

    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
`;

// Inject ripple styles
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Initialize features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.premiumFeatures = new PremiumFeatures();
});