// ============================================
// MAIN PORTFOLIO APPLICATION
// ============================================

class PortfolioApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.setupParticles();
        this.setupNavigation();
        this.setupTypewriter();
        this.setupCounters();
        this.setupSkillBars();
        this.setupTabSystem();
        this.setupContactForm();
        this.setupBackToTop();
        this.setupMobileMenu();
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    // ============================================
    // LOADING SCREEN
    // ============================================
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.getElementById('loadingText');
        
        if (!loadingScreen) return;
        
        let progress = 0;
        const messages = [
            'Initializing Premium Experience...',
            'Loading Assets...',
            'Setting Up Animations...',
            'Almost Ready...',
            'Welcome!'
        ];
        let messageIndex = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                loadingBar.style.width = '100%';
                loadingText.textContent = 'Ready to Explore!';
                
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.visibility = 'hidden';
                    
                    // Initialize animations after loading
                    setTimeout(() => {
                        this.initializeAnimations();
                    }, 500);
                }, 1000);
            } else {
                loadingBar.style.width = `${progress}%`;
                
                // Update loading text based on progress
                if (progress >= 20 && messageIndex === 0) {
                    loadingText.textContent = messages[++messageIndex];
                } else if (progress >= 40 && messageIndex === 1) {
                    loadingText.textContent = messages[++messageIndex];
                } else if (progress >= 70 && messageIndex === 2) {
                    loadingText.textContent = messages[++messageIndex];
                } else if (progress >= 90 && messageIndex === 3) {
                    loadingText.textContent = messages[++messageIndex];
                }
            }
        }, 200);
    }

    // ============================================
    // THEME MANAGEMENT
    // ============================================
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                localStorage.setItem('theme', this.currentTheme);
                this.updateThemeIcon();
                
                this.showNotification(`Switched to ${this.currentTheme} mode`, 'success');
            });
        }
    }

    updateThemeIcon() {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // ============================================
    // PARTICLE BACKGROUND
    // ============================================
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
            
            // Random color from accent palette
            const colors = ['#FF6C47', '#FF9A3D', '#FFC93C', '#4A90E2'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = randomColor;
            
            container.appendChild(particle);
        }
    }

    // ============================================
    // NAVIGATION
    // ============================================
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            this.updateActiveLink();
        });

        // Smooth scroll for anchor links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        const offset = 80;
                        const targetPosition = target.offsetTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // TYPEWRITER EFFECT
    // ============================================
    setupTypewriter() {
        const element = document.getElementById('typewriter');
        if (!element) return;

        const texts = [
            'Premium Game Developer',
            'Creative Web Designer',
            'Innovative App Creator',
            'Digital Experience Architect'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        const type = () => {
            if (isPaused) return;

            const currentText = texts[textIndex];
            
            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 150;

            if (!isDeleting && charIndex === currentText.length) {
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    type();
                }, 2000);
                return;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        // Start typewriter after a delay
        setTimeout(type, 1000);
    }

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
                
                counter.textContent = currentValue.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(updateCounter);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // ============================================
    // SKILL BARS ANIMATION
    // ============================================
    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    setTimeout(() => {
                        entry.target.style.width = width + '%';
                    }, 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // ============================================
    // TAB SYSTEM
    // ============================================
    setupTabSystem() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to current button and content
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // Show/hide fields based on contact type
        const contactType = document.getElementById('contactType');
        const projectDetailsGroup = document.getElementById('projectDetailsGroup');
        const feedbackGroup = document.getElementById('feedbackGroup');

        contactType.addEventListener('change', (e) => {
            const value = e.target.value;
            
            // Hide all conditional fields
            projectDetailsGroup.style.display = 'none';
            feedbackGroup.style.display = 'none';
            
            // Show relevant field
            if (value === 'project') {
                projectDetailsGroup.style.display = 'block';
            } else if (value === 'feedback') {
                feedbackGroup.style.display = 'block';
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Show loading state
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Save to localStorage (for admin panel)
                this.saveContact(data);

                // Show success message
                this.showNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                form.reset();
                
                // Hide conditional fields
                projectDetailsGroup.style.display = 'none';
                feedbackGroup.style.display = 'none';

            } catch (error) {
                this.showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    saveContact(data) {
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push({
            ...data,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            status: 'unread'
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    setupBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    setupMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking a link
            menu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `fadeInUp 0.8s ease forwards`;
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.portfolio-card, .skill-item, .contact-method, .category-card, .feature-item, .tool-item'
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // HOVER EFFECTS
    // ============================================
    setupHoverEffects() {
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll(
            '.btn, .nav-link, .portfolio-card, .category-card, .skill-item, .contact-method, .social-link, .tool-item, .feature-item'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-2px)';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0)';
            });
        });

        // Enhanced card hover effects
        const cards = document.querySelectorAll('.portfolio-card, .category-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // ============================================
    // INITIALIZE ANIMATIONS
    // ============================================
    initializeAnimations() {
        // Initialize any additional animations after page load
        console.log('Portfolio initialized successfully!');
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    showNotification(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        // Remove notification after delay
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, formatDate, debounce, throttle };
}