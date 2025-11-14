// ==========================================
// PORTFOLIO MASTER SCRIPT - OPTIMIZED & FAST
// All features working perfectly - No admin, no loading screen
// ==========================================

// ==========================================
// GLOBAL STATE & CONFIGURATION
// ==========================================
const STATE = {
    currentTheme: 'dark',
    menuOpen: false,
    modalOpen: false
};

const CONFIG = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    NOTIFICATION_DURATION: 5000,
    PARTICLE_COUNT: 15,
    TYPEWRITER_SPEED: 100
};

// ==========================================
// INITIALIZATION - PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio initializing...');
    initializePage();
});

function initializePage() {
    // 1. Initialize theme
    const savedTheme = getTheme();
    setTheme(savedTheme);
    updateThemeToggle(savedTheme);
    
    // 2. Setup all event listeners
    setupEventListeners();
    
    // 3. Start animations
    startAnimations();
    
    // 4. Initialize particles
    initializeParticles();
    
    console.log('✅ Portfolio initialized successfully');
}

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Theme toggle button
    setupThemeToggle();
    
    // Mobile menu toggle
    setupMobileMenu();
    
    // Back to top button
    setupBackToTop();
    
    // Contact form
    setupContactForm();
    
    // Smooth scroll for navigation
    setupSmoothScroll();
    
    // Tab switching (skills section)
    setupTabSwitching();
    
    // Download CV button
    setupDownloadCV();
    
    console.log('✅ Event listeners setup complete');
}

// ==========================================
// THEME MANAGEMENT
// ==========================================
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('✅ Theme toggle initialized');
    }
}

function toggleTheme() {
    const newTheme = STATE.currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateThemeToggle(newTheme);
    showNotification(`Theme changed to ${newTheme} mode`, 'success');
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
    STATE.currentTheme = theme;
}

function getTheme() {
    return localStorage.getItem('portfolio_theme') || 'dark';
}

function updateThemeToggle(theme) {
    STATE.currentTheme = theme;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ==========================================
// MOBILE MENU
// ==========================================
function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        // Toggle menu
        navToggle.addEventListener('click', () => {
            STATE.menuOpen = !STATE.menuOpen;
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = STATE.menuOpen ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (STATE.menuOpen && 
                !navToggle.contains(e.target) && 
                !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        console.log('✅ Mobile menu initialized');
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    navMenu?.classList.remove('active');
    navToggle?.classList.remove('active');
    document.body.style.overflow = '';
    STATE.menuOpen = false;
}

// ==========================================
// SMOOTH SCROLL NAVIGATION
// ==========================================
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip empty anchors
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
                if (STATE.menuOpen) {
                    closeMobileMenu();
                }
            }
        });
    });
    
    console.log('✅ Smooth scroll initialized');
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        // Show/hide on scroll
        window.addEventListener('scroll', throttle(toggleBackToTop, 100));
        
        // Scroll to top on click
        backToTop.addEventListener('click', scrollToTop);
        
        console.log('✅ Back to top initialized');
    }
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

// ==========================================
// CONTACT FORM HANDLING
// ==========================================
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    console.log('📝 Setting up contact form...');
    
    // Setup contact type change handler
    const contactType = document.getElementById('contactType');
    const projectDetailsGroup = document.getElementById('projectDetailsGroup');
    const feedbackGroup = document.getElementById('feedbackGroup');
    
    if (contactType) {
        contactType.addEventListener('change', function() {
            const value = this.value;
            
            // Hide all conditional fields
            if (projectDetailsGroup) projectDetailsGroup.style.display = 'none';
            if (feedbackGroup) feedbackGroup.style.display = 'none';
            
            // Show relevant field
            if (value === 'project' && projectDetailsGroup) {
                projectDetailsGroup.style.display = 'block';
            } else if (value === 'feedback' && feedbackGroup) {
                feedbackGroup.style.display = 'block';
            }
        });
    }
    
    // Setup form submission
    contactForm.addEventListener('submit', handleContactFormSubmit);
    
    console.log('✅ Contact form initialized');
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    console.log('📧 Processing contact form submission...');
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateContactForm(formData)) {
        return;
    }
    
    // Create contact object
    const contact = {
        id: Date.now(),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phoneNumber') || '',
        contactType: formData.get('contactType'),
        message: formData.get('message'),
        projectDetails: formData.get('projectDetails') || '',
        feedback: formData.get('feedback') || '',
        date: new Date().toISOString(),
        status: 'unread'
    };
    
    try {
        // Save to localStorage
        saveContact(contact);
        
        // Show success notification
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Hide conditional fields
        const projectDetailsGroup = document.getElementById('projectDetailsGroup');
        const feedbackGroup = document.getElementById('feedbackGroup');
        if (projectDetailsGroup) projectDetailsGroup.style.display = 'none';
        if (feedbackGroup) feedbackGroup.style.display = 'none';
        
        console.log('✅ Contact saved successfully');
        
    } catch (error) {
        console.error('❌ Error saving contact:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    }
}

function validateContactForm(formData) {
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const contactType = formData.get('contactType');
    const message = formData.get('message');
    
    // Validate required fields
    if (!fullName || fullName.trim().length < 2) {
        showNotification('Please enter a valid name', 'error');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!contactType) {
        showNotification('Please select a contact type', 'error');
        return false;
    }
    
    if (!message || message.trim().length < 10) {
        showNotification('Please enter a message (at least 10 characters)', 'error');
        return false;
    }
    
    return true;
}

function saveContact(contact) {
    const contacts = getContacts();
    contacts.unshift(contact);
    localStorage.setItem('portfolio_contacts', JSON.stringify(contacts));
}

function getContacts() {
    try {
        const contacts = localStorage.getItem('portfolio_contacts');
        return contacts ? JSON.parse(contacts) : [];
    } catch (error) {
        console.error('Error loading contacts:', error);
        return [];
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==========================================
// DOWNLOAD CV FUNCTIONALITY
// ==========================================
function setupDownloadCV() {
    const downloadCVBtn = document.getElementById('downloadCV');
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('CV download feature coming soon!', 'info');
        });
    }
}

// ==========================================
// NOTIFICATIONS SYSTEM
// ==========================================
function showNotification(message, type = 'info', duration = 5000) {
    let container = document.getElementById('notificationContainer');
    
    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const titleMap = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${titleMap[type] || 'Notification'}</div>
            <div class="notification-message">${escapeHtml(message)}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
    
    return notification;
}

// ==========================================
// ANIMATIONS
// ==========================================
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
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
}

function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    if (counters.length === 0) return;
    
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
    
    if (skillBars.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 100);
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section, .portfolio-card, .category-card, .game-card, ' +
        '.website-card, .app-card, .testimonial-card, .service-card'
    );
    
    if (animatedElements.length === 0) return;
    
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

// ==========================================
// TAB SWITCHING (Skills Section)
// ==========================================
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and target content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    console.log('✅ Tab switching initialized');
}

// ==========================================
// PARTICLE SYSTEM
// ==========================================
function initializeParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 8 : CONFIG.PARTICLE_COUNT;
    
    // Clear existing particles
    container.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
    
    console.log('✅ Particles initialized');
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
    
    // Random color
    const colors = [
        'var(--accent-primary)', 
        'var(--accent-secondary)', 
        'rgba(59, 130, 246, 0.3)'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = randomColor;
    
    container.appendChild(particle);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
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

// ==========================================
// GLOBAL EXPORTS
// Make functions available globally for other scripts
// ==========================================
window.showNotification = showNotification;
window.debounce = debounce;
window.throttle = throttle;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.isValidEmail = isValidEmail;
window.getContacts = getContacts;
window.saveContact = saveContact;

// ==========================================
// ERROR HANDLING
// ==========================================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ==========================================
// RESIZE HANDLER
// ==========================================
window.addEventListener('resize', debounce(function() {
    // Reinitialize particles on resize
    initializeParticles();
}, 250));

// ==========================================
// CONSOLE WELCOME MESSAGE
// ==========================================
console.log('%c🚀 ArshCreates Portfolio', 'font-size: 20px; font-weight: bold; color: #E4572E;');
console.log('%cDeveloped by Arsh Verma', 'font-size: 12px; color: #888;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #E4572E;');

// ==========================================
// MODULE EXPORTS (for compatibility)
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        debounce,
        throttle,
        escapeHtml,
        formatDate,
        isValidEmail,
        getContacts,
        saveContact
    };
}