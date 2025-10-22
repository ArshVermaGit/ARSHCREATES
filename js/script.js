// Enhanced script.js with theme switching, navigation, and animations

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing enhanced script.js...');
    
    // Initialize all components
    initThemeSwitcher();
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initDynamicEffects();
    initPortfolioSectionObserver();
    initSidePanel(); // New: Initialize side panel
    
    // Set current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    console.log('Enhanced script.js initialized successfully');
});

// =============================================================================
// THEME SWITCHER
// =============================================================================
function initThemeSwitcher() {
    const themeBtn = document.getElementById('themeBtn');
    const themeIcon = themeBtn?.querySelector('i');
    
    if (!themeBtn || !themeIcon) return;
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);
    
    themeBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio_theme', newTheme);
        
        // Update icon
        updateThemeIcon(themeIcon, newTheme);
        
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
        
        console.log('Theme switched to:', newTheme);
    });
}

function updateThemeIcon(iconElement, theme) {
    if (!iconElement) return;
    
    if (theme === 'dark') {
        iconElement.className = 'fas fa-sun';
        iconElement.title = 'Switch to light theme';
    } else {
        iconElement.className = 'fas fa-moon';
        iconElement.title = 'Switch to dark theme';
    }
}

// =============================================================================
// NAVIGATION
// =============================================================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'var(--bg-overlay)';
                navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
            } else {
                navbar.style.background = 'var(--liquid-glass-bg)';
                navbar.style.backdropFilter = 'blur(var(--liquid-glass-blur)) saturate(200%)';
            }
        }
    });
}

// =============================================================================
// SMOOTH SCROLLING
// =============================================================================
function initSmoothScrolling() {
    // Enhanced smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navToggle = document.getElementById('navToggle');
                const navMenu = document.getElementById('navMenu');
                if (navToggle && navMenu && navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================================================
// SCROLL ANIMATIONS
// =============================================================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.section, .portfolio-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// =============================================================================
// DYNAMIC EFFECTS
// =============================================================================
function initDynamicEffects() {
    // Parallax effect for hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', throttle(() => {
            const scroll = window.scrollY;
            heroVisual.style.transform = `translateY(${scroll * 0.2}px)`;
        }, 16));
    }
    
    // Card hover effects
    const cards = document.querySelectorAll('.portfolio-card, .float-card, .skill-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;
            
            const rotateY = (mouseX / rect.width) * 10;
            const rotateX = (mouseY / rect.height) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// =============================================================================
// PORTFOLIO SECTION OBSERVER
// =============================================================================
function initPortfolioSectionObserver() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => observer.observe(section));
}

// =============================================================================
// SIDE PANEL INITIALIZATION (NEW)
// =============================================================================
function initSidePanel() {
    const sidePanel = document.getElementById('sidePanel');
    const sideBtns = document.querySelectorAll('.side-panel-btn');
    
    if (!sidePanel || !sideBtns.length) return;
    
    // Show panel on mouse near right edge
    document.addEventListener('mousemove', debounce((e) => {
        const triggerZone = 50; // pixels from right edge
        if (window.innerWidth - e.clientX < triggerZone) {
            sidePanel.classList.add('active');
        } else {
            sidePanel.classList.remove('active');
        }
    }, 100));
    
    // Button click handlers
    sideBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section) {
                // Update active state
                sideBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to section
                const targetSection = document.getElementById(section);
                if (targetSection) {
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                    const offsetTop = targetSection.offsetTop - navbarHeight - 20;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Update active state on scroll
    window.addEventListener('scroll', throttle(() => {
        const sections = ['games', 'websites', 'photos', 'videos'];
        let currentSection = '';
        
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    currentSection = sectionId;
                }
            }
        });
        
        if (currentSection) {
            sideBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.section === currentSection);
            });
        }
    }, 100));
}

// =============================================================================
// PERFORMANCE OPTIMIZATIONS
// =============================================================================
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =============================================================================
// IMAGE LAZY LOADING
// =============================================================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// =============================================================================
// ERROR HANDLING
// =============================================================================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Handle promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// =============================================================================
// ACCESSIBILITY ENHANCEMENTS
// =============================================================================
function initAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && document.querySelector('.portfolio-modal.active')) {
            handleModalFocus(e);
        }
    });
}

function handleModalFocus(e) {
    const modal = document.querySelector('.portfolio-modal.active');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

// =============================================================================
// SERVICE WORKER REGISTRATION (PWA)
// =============================================================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
}

// =============================================================================
// ANALYTICS (Optional - Add your tracking code here)
// =============================================================================
function initAnalytics() {
    // Add your analytics tracking code here
    // Example: Google Analytics, Plausible, etc.
}

// =============================================================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// =============================================================================
window.initThemeSwitcher = initThemeSwitcher;
window.initNavigation = initNavigation;
window.initSmoothScrolling = initSmoothScrolling;
window.initScrollAnimations = initScrollAnimations;
window.initDynamicEffects = initDynamicEffects;
window.initPortfolioSectionObserver = initPortfolioSectionObserver;
window.initLazyLoading = initLazyLoading;
window.initAccessibility = initAccessibility;
window.registerServiceWorker = registerServiceWorker;
window.initAnalytics = initAnalytics;

// Initialize additional features
initLazyLoading();
initAccessibility();
registerServiceWorker();
initAnalytics();