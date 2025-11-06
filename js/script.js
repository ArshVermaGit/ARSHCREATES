// ==========================================
// MAIN SCRIPT - Core functionality for all pages
// Handles loading, navigation, theme, and common features
// ==========================================

// Global Variables
var currentTheme = 'dark';
var isLoading = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing page');
    initializePage();
});

// Initialize Page
function initializePage() {
    console.log('Initializing page...');
    
    // Set theme
    const savedTheme = getTheme();
    setTheme(savedTheme);
    updateThemeToggle(savedTheme);
    
    // Get current page
    const page = getCurrentPage();
    console.log('Current page:', page);
    
    // Setup event listeners
    setupEventListeners();
    
    // Start animations
    startAnimations();
    
    // Initialize page-specific components
    initializePageComponents(page);
    
    // Hide loading screen
    setTimeout(hideLoadingScreen, 1000);
}

// Initialize Page-Specific Components
function initializePageComponents(page) {
    switch (page) {
        case 'home':
            initializeHomePage();
            break;
        case 'games':
            initializeGamesPage();
            break;
        case 'websites':
            initializeWebsitesPage();
            break;
        case 'apps':
            initializeAppsPage();
            break;
        case 'testimonials':
            initializeTestimonialsPage();
            break;
        case 'admin':
            initializeAdminPage();
            break;
        case 'game-detail':
            initializeGameDetailPage();
            break;
        case 'website-detail':
            initializeWebsiteDetailPage();
            break;
        case 'app-detail':
            initializeAppDetailPage();
            break;
        default:
            console.log('Unknown page, using home initialization');
            initializeHomePage();
    }
}

// Get Current Page
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '' || page === '/') return 'home';
    if (page.includes('games.html')) return 'games';
    if (page.includes('websites.html')) return 'websites';
    if (page.includes('apps.html')) return 'apps';
    if (page.includes('testimonials.html')) return 'testimonials';
    if (page.includes('admin.html')) return 'admin';
    if (page.includes('game-detail.html')) return 'game-detail';
    if (page.includes('website-detail.html')) return 'website-detail';
    if (page.includes('app-detail.html')) return 'app-detail';
    if (page.includes('404.html')) return '404';
    if (page.includes('500.html')) return '500';
    return 'home';
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('Theme toggle initialized');
    }
    
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        console.log('Mobile menu initialized');
    }
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', throttle(toggleBackToTop, 100));
        backToTop.addEventListener('click', scrollToTop);
        console.log('Back to top initialized');
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupContactForm(contactForm);
        console.log('Contact form initialized');
    }
    
    // Navigation links - smooth scroll
    setupSmoothScroll();
    
    // Particle system
    initializeParticles();
    
    // Custom cursor (desktop only)
    if (window.innerWidth > 768) {
        initializeCustomCursor();
    }
}

// Loading Screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

function showLoadingScreen(message = 'Loading...') {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingText = document.getElementById('loadingText');
    if (loadingScreen) {
        if (loadingText) loadingText.textContent = message;
        loadingScreen.style.display = 'flex';
        setTimeout(() => loadingScreen.style.opacity = '1', 10);
    }
}

// Theme Management
function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateThemeToggle(newTheme);
    showNotification(`Theme changed to ${newTheme} mode`, 'success');
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
    currentTheme = theme;
}

function getTheme() {
    return localStorage.getItem('portfolio_theme') || 'dark';
}

function updateThemeToggle(theme) {
    currentTheme = theme;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Update theme text if exists
    const themeText = themeToggle?.querySelector('.theme-text');
    if (themeText) {
        themeText.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
}

// Navigation
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle?.classList.remove('active');
                }
            }
        });
    });
}

function toggleBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Contact Form
function setupContactForm(form) {
    const contactType = document.getElementById('contactType');
    const projectDetailsGroup = document.getElementById('projectDetailsGroup');
    const feedbackGroup = document.getElementById('feedbackGroup');
    
    // Show/hide additional fields based on contact type
    if (contactType) {
        contactType.addEventListener('change', function() {
            const value = this.value;
            
            // Hide all optional groups
            if (projectDetailsGroup) projectDetailsGroup.style.display = 'none';
            if (feedbackGroup) feedbackGroup.style.display = 'none';
            
            // Show relevant group
            if (value === 'project' && projectDetailsGroup) {
                projectDetailsGroup.style.display = 'block';
            } else if (value === 'feedback' && feedbackGroup) {
                feedbackGroup.style.display = 'block';
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });
}

function handleFormSubmission(form) {
    if (isLoading) return;
    
    const formData = new FormData(form);
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        contactType: formData.get('contactType'),
        projectDetails: formData.get('projectDetails') || '',
        feedback: formData.get('feedback') || '',
        message: formData.get('message')
    };
    
    // Basic validation
    if (!data.fullName || !data.email || !data.contactType || !data.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    isLoading = true;
    showLoadingScreen('Sending your message...');
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Save to localStorage
            const contacts = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
            const newContact = {
                id: Date.now(),
                ...data,
                date: new Date().toISOString(),
                status: 'new',
                important: false
            };
            contacts.unshift(newContact);
            localStorage.setItem('portfolio_contacts', JSON.stringify(contacts));
            
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Hide optional fields
            const projectDetailsGroup = document.getElementById('projectDetailsGroup');
            const feedbackGroup = document.getElementById('feedbackGroup');
            if (projectDetailsGroup) projectDetailsGroup.style.display = 'none';
            if (feedbackGroup) feedbackGroup.style.display = 'none';
            
        } catch (error) {
            console.error('Error saving contact:', error);
            showNotification('There was an error sending your message. Please try again.', 'error');
        } finally {
            isLoading = false;
            hideLoadingScreen();
        }
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notifications
function showNotification(message, type = 'info', duration = 5000) {
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${getNotificationTitle(type)}</div>
            <div class="notification-message">${escapeHtml(message)}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
    
    return notification;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationTitle(type) {
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    };
    return titles[type] || 'Notification';
}

// Animations
function startAnimations() {
    // Typewriter effect
    initializeTypewriter();
    
    // Counter animations
    initializeCounters();
    
    // Skill bar animations
    initializeSkillBars();
    
    // Scroll animations
    initializeScrollAnimations();
}

function initializeTypewriter() {
    const typewriter = document.getElementById('typewriter');
    if (!typewriter) return;
    
    const texts = [
        'Creative Developer',
        'Game Developer',
        'Web Specialist',
        'Problem Solver',
        'Innovation Enthusiast'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
}

function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress[data-width]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section, .portfolio-card, .category-card, .game-card, .website-card, .app-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Particle System
function initializeParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 8 : 15;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 20 + 5;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 3;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    // Random color variation
    const colors = ['var(--accent-primary)', 'var(--accent-secondary)', 'rgba(59, 130, 246, 0.3)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = randomColor;
    
    container.appendChild(particle);
}

// Custom Cursor
function initializeCustomCursor() {
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    
    if (!cursorDot || !cursorRing) return;
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Dot follows cursor directly
        dotX = mouseX;
        dotY = mouseY;
        
        // Ring follows with delay
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [data-cursor-effect]');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '50px';
            cursorRing.style.height = '50px';
            cursorRing.style.borderColor = 'var(--accent-primary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '40px';
            cursorRing.style.height = '40px';
            cursorRing.style.borderColor = 'var(--accent-primary)';
        });
    });
}

// Page-specific Initializers
function initializeHomePage() {
    console.log('Initializing home page...');
    // Home page is mostly handled by global animations
}

function initializeGamesPage() {
    console.log('Initializing games page...');
    // Games page initialization will be in games.js
}

function initializeWebsitesPage() {
    console.log('Initializing websites page...');
    // Websites page initialization will be in websites.js
}

function initializeAppsPage() {
    console.log('Initializing apps page...');
    // Apps page initialization will be in apps.js
}

function initializeTestimonialsPage() {
    console.log('Initializing testimonials page...');
    // Testimonials page initialization will be in testimonials.js
}

function initializeAdminPage() {
    console.log('Initializing admin page...');
    // Admin page initialization will be in admin.js
}

function initializeGameDetailPage() {
    console.log('Initializing game detail page...');
    // Game detail page initialization will be in game-detail.js
}

function initializeWebsiteDetailPage() {
    console.log('Initializing website detail page...');
    // Website detail page initialization will be in website-detail.js
}

function initializeAppDetailPage() {
    console.log('Initializing app detail page...');
    // App detail page initialization will be in app-detail.js
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
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

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 7) {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

// Make functions globally available for other scripts
window.showNotification = showNotification;
window.hideLoadingScreen = hideLoadingScreen;
window.showLoadingScreen = showLoadingScreen;
window.debounce = debounce;
window.throttle = throttle;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.isValidEmail = isValidEmail;

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        hideLoadingScreen,
        showLoadingScreen,
        debounce,
        throttle,
        escapeHtml,
        formatDate,
        isValidEmail
    };
}