// script.js - Additional functionality and utilities

// Utility functions
class AppUtils {
    static debounce(func, wait, immediate) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    static preloadImages(images) {
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    static animateOnScroll() {
        const elements = document.querySelectorAll('.portfolio-card, .skill-item, .float-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupScrollProgress();
        this.setupSmoothScrolling();
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', AppUtils.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(el => {
                el.style.transform = `translateY(${rate}px)`;
            });
        }, 16));
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--accent), var(--accent-secondary));
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const trackLength = docHeight - winHeight;
            const progress = Math.floor((scrollTop / trackLength) * 100);
            
            progressBar.style.width = progress + '%';
        });
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Image lazy loading
class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px 0px' });
        }

        this.startObserving();
    }

    startObserving() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (this.observer) {
                this.observer.observe(img);
            } else {
                // Fallback: load all images immediately
                this.loadImage(img);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        const image = new Image();
        image.src = src;
        image.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        image.onerror = () => {
            console.warn('Failed to load image:', src);
        };
    }
}

// Form enhancements
class FormEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupInputAnimations();
        this.setupFormValidation();
    }

    setupInputAnimations() {
        const inputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
        
        inputs.forEach(input => {
            // Add floating label behavior
            const container = input.closest('.form-group');
            if (!container) return;

            const label = container.querySelector('label');
            if (label) {
                input.addEventListener('focus', () => {
                    label.classList.add('active');
                });

                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('active');
                    }
                });

                // Check initial value
                if (input.value) {
                    label.classList.add('active');
                }
            }

            // Character counter for textareas
            if (input.tagName === 'TEXTAREA') {
                const counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.style.cssText = `
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    text-align: right;
                    margin-top: 0.5rem;
                `;
                container.appendChild(counter);

                const updateCounter = () => {
                    const maxLength = input.getAttribute('maxlength') || 500;
                    const currentLength = input.value.length;
                    counter.textContent = `${currentLength}/${maxLength}`;
                    
                    if (currentLength > maxLength * 0.8) {
                        counter.style.color = 'var(--warning)';
                    } else {
                        counter.style.color = 'var(--text-muted)';
                    }
                };

                input.addEventListener('input', updateCounter);
                updateCounter();
            }
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.setAttribute('novalidate', true);
            
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        this.clearFieldError(field);

        let isValid = true;
        let message = '';

        // Required validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // URL validation
        if (field.type === 'url' && field.value) {
            try {
                new URL(field.value);
            } catch {
                isValid = false;
                message = 'Please enter a valid URL';
            }
        }

        if (!isValid) {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--error);
            font-size: 0.8rem;
            margin-top: 0.5rem;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.setupPerformanceObserver();
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            if (navigationTiming) {
                this.metrics.loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
                this.metrics.domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart;
                
                console.log('Page Load Performance:', this.metrics);
            }
        });
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'longtask') {
                        console.warn('Long task detected:', entry);
                    }
                });
            });

            observer.observe({ entryTypes: ['longtask'] });
        }
    }
}

// Initialize all utilities when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize utilities
    new ScrollAnimations();
    new LazyLoader();
    new FormEnhancer();
    new PerformanceMonitor();

    // Setup scroll animations
    AppUtils.animateOnScroll();

    // Preload critical images
    const criticalImages = [
        'images/hero-visual.jpg',
        'images/logo.png'
    ];
    AppUtils.preloadImages(criticalImages);

    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove loading spinner if exists
        const loader = document.getElementById('loading-spinner');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    });

    // Error boundary for images
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            console.warn('Image failed to load:', e.target.src);
            e.target.style.opacity = '0.5';
            e.target.alt = 'Image not available';
        }
    }, true);

    // Enhanced error handling
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
    });

    // Service Worker registration (if needed)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppUtils, ScrollAnimations, LazyLoader, FormEnhancer };
}