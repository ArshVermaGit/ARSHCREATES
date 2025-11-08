// ==========================================
// UTILITY FUNCTIONS - Shared across all pages
// Combines localStorage fallback with window.storage API
// ==========================================

// Storage Keys - Using hierarchical naming
const STORAGE_KEYS = {
    CONTACTS: 'portfolio_contacts',
    TESTIMONIALS: 'portfolio_testimonials',
    ANALYTICS: 'portfolio_analytics',
    THEME: 'portfolio_theme'
};

// Check if window.storage is available
const hasWindowStorage = typeof window !== 'undefined' && window.storage;

// ==========================================
// INITIALIZE STORAGE
// ==========================================
async function initializeStorage() {
    if (!hasWindowStorage) {
        console.log('Using localStorage fallback');
        // Initialize localStorage if needed
        if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
            localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
            const initialTestimonials = window.PORTFOLIO_DATA?.testimonials?.map(t => ({
                ...t,
                approved: true
            })) || [];
            localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(initialTestimonials));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
            const initialAnalytics = {
                pageViews: 1250,
                averageSession: '4m 30s',
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(initialAnalytics));
        }
        return;
    }

    try {
        // Initialize contacts if not exists
        try {
            await window.storage.get(STORAGE_KEYS.CONTACTS);
        } catch (error) {
            await window.storage.set(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
        }
        
        // Initialize testimonials if not exists
        try {
            await window.storage.get(STORAGE_KEYS.TESTIMONIALS);
        } catch (error) {
            const initialTestimonials = window.PORTFOLIO_DATA?.testimonials?.map(t => ({
                ...t,
                approved: true
            })) || [];
            await window.storage.set(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(initialTestimonials));
        }
        
        // Initialize analytics if not exists
        try {
            await window.storage.get(STORAGE_KEYS.ANALYTICS);
        } catch (error) {
            const initialAnalytics = {
                pageViews: 1250,
                averageSession: '4m 30s',
                lastUpdated: new Date().toISOString()
            };
            await window.storage.set(STORAGE_KEYS.ANALYTICS, JSON.stringify(initialAnalytics));
        }
        
        console.log('✓ Storage initialized successfully');
    } catch (error) {
        console.error('Error initializing storage:', error);
    }
}

// ==========================================
// CONTACT MANAGEMENT
// ==========================================
async function getContacts() {
    console.log('=== GET CONTACTS CALLED ===');
    
    try {
        if (!hasWindowStorage) {
            console.log('Using localStorage to get contacts...');
            const contacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);
            console.log('Raw localStorage data:', contacts);
            const parsed = contacts ? JSON.parse(contacts) : [];
            console.log('Parsed contacts:', parsed);
            return parsed;
        }
        
        console.log('Using window.storage to get contacts...');
        try {
            const result = await window.storage.get(STORAGE_KEYS.CONTACTS);
            console.log('window.storage.get result:', result);
            
            if (result && result.value) {
                const parsed = JSON.parse(result.value);
                console.log('Parsed contacts from window.storage:', parsed);
                return parsed;
            }
            console.log('No contacts found, returning empty array');
            return [];
        } catch (storageError) {
            console.log('window.storage.get threw error (key might not exist):', storageError);
            return [];
        }
    } catch (error) {
        console.error('=== ERROR IN GET CONTACTS ===');
        console.error('Error:', error);
        return [];
    }
}

async function saveContact(contactData) {
    console.log('=== SAVE CONTACT CALLED ===');
    console.log('Contact data:', contactData);
    console.log('hasWindowStorage:', hasWindowStorage);
    console.log('STORAGE_KEYS:', STORAGE_KEYS);
    
    try {
        // Get existing contacts
        console.log('Getting existing contacts...');
        const contacts = await getContacts();
        console.log('Existing contacts:', contacts);
        
        // Create new contact
        const newContact = {
            id: Date.now(),
            ...contactData,
            date: new Date().toISOString(),
            status: 'unread',
            important: false
        };
        
        console.log('New contact:', newContact);
        
        // Add to beginning of array
        contacts.unshift(newContact);
        console.log('Updated contacts array:', contacts);
        
        // Save based on storage type
        if (!hasWindowStorage) {
            console.log('Using localStorage...');
            localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
            
            // Verify it was saved
            const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
            console.log('Verified localStorage save:', saved ? 'SUCCESS' : 'FAILED');
            console.log('Saved data:', saved);
            
            return true;
        } else {
            console.log('Using window.storage...');
            const result = await window.storage.set(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
            console.log('window.storage.set result:', result);
            return true;
        }
        
    } catch (error) {
        console.error('=== ERROR IN SAVE CONTACT ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        
        // Try localStorage as fallback
        try {
            console.log('Attempting localStorage fallback...');
            const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
            contacts.unshift({
                id: Date.now(),
                ...contactData,
                date: new Date().toISOString(),
                status: 'unread',
                important: false
            });
            localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
            console.log('✓ Saved via localStorage fallback');
            return true;
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            return false;
        }
    }
}

async function updateContactStatus(contactId, updates) {
    try {
        const contacts = await getContacts();
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        
        if (contactIndex !== -1) {
            contacts[contactIndex] = { ...contacts[contactIndex], ...updates };
            
            if (!hasWindowStorage) {
                localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
                return true;
            }
            
            await window.storage.set(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating contact:', error);
        return false;
    }
}

async function deleteContact(contactId) {
    try {
        const contacts = await getContacts();
        const filteredContacts = contacts.filter(c => c.id !== contactId);
        
        if (!hasWindowStorage) {
            localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filteredContacts));
            return true;
        }
        
        await window.storage.set(STORAGE_KEYS.CONTACTS, JSON.stringify(filteredContacts));
        return true;
    } catch (error) {
        console.error('Error deleting contact:', error);
        return false;
    }
}

// ==========================================
// TESTIMONIAL MANAGEMENT
// ==========================================
async function getTestimonials() {
    try {
        if (!hasWindowStorage) {
            const stored = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
            if (stored) {
                return JSON.parse(stored);
            }
            // Return default testimonials from PORTFOLIO_DATA
            return window.PORTFOLIO_DATA?.testimonials || [];
        }
        
        const result = await window.storage.get(STORAGE_KEYS.TESTIMONIALS);
        if (result && result.value) {
            return JSON.parse(result.value);
        }
        return window.PORTFOLIO_DATA?.testimonials || [];
    } catch (error) {
        console.error('Error loading testimonials:', error);
        return window.PORTFOLIO_DATA?.testimonials || [];
    }
}

async function addTestimonial(testimonialData) {
    try {
        const testimonials = await getTestimonials();
        const newTestimonial = {
            id: Date.now(),
            ...testimonialData,
            date: new Date().toISOString(),
            approved: false,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonialData.clientName)}&background=E4572E&color=fff&size=80`
        };
        
        testimonials.unshift(newTestimonial);
        
        if (!hasWindowStorage) {
            localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
            return true;
        }
        
        await window.storage.set(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
        return true;
    } catch (error) {
        console.error('Error adding testimonial:', error);
        return false;
    }
}

async function approveTestimonial(testimonialId) {
    try {
        const testimonials = await getTestimonials();
        const testimonialIndex = testimonials.findIndex(t => t.id === testimonialId);
        
        if (testimonialIndex !== -1) {
            testimonials[testimonialIndex].approved = true;
            
            if (!hasWindowStorage) {
                localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
                return true;
            }
            
            await window.storage.set(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error approving testimonial:', error);
        return false;
    }
}

async function deleteTestimonial(testimonialId) {
    try {
        const testimonials = await getTestimonials();
        const filteredTestimonials = testimonials.filter(t => t.id !== testimonialId);
        
        if (!hasWindowStorage) {
            localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(filteredTestimonials));
            return true;
        }
        
        await window.storage.set(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(filteredTestimonials));
        return true;
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return false;
    }
}

// ==========================================
// ANALYTICS
// ==========================================
async function getAnalytics() {
    try {
        if (!hasWindowStorage) {
            const analytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
            if (analytics) {
                return JSON.parse(analytics);
            }
            return {
                pageViews: 1250,
                averageSession: '4m 30s',
                lastUpdated: new Date().toISOString()
            };
        }
        
        const result = await window.storage.get(STORAGE_KEYS.ANALYTICS);
        if (result && result.value) {
            return JSON.parse(result.value);
        }
        return {
            pageViews: 1250,
            averageSession: '4m 30s',
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error loading analytics:', error);
        return {
            pageViews: 0,
            averageSession: '0m 0s',
            lastUpdated: new Date().toISOString()
        };
    }
}

async function updateAnalytics(updates) {
    try {
        const analytics = await getAnalytics();
        const updatedAnalytics = { 
            ...analytics, 
            ...updates, 
            lastUpdated: new Date().toISOString() 
        };
        
        if (!hasWindowStorage) {
            localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(updatedAnalytics));
            return updatedAnalytics;
        }
        
        await window.storage.set(STORAGE_KEYS.ANALYTICS, JSON.stringify(updatedAnalytics));
        return updatedAnalytics;
    } catch (error) {
        console.error('Error updating analytics:', error);
        return null;
    }
}

// ==========================================
// SAFE DATA ACCESS
// ==========================================
function getGames() {
    return window.PORTFOLIO_DATA?.games || [];
}

function getWebsites() {
    return window.PORTFOLIO_DATA?.websites || [];
}

function getApps() {
    return window.PORTFOLIO_DATA?.apps || [];
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(message, type = 'info', duration = 5000) {
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        font-weight: 500;
        font-size: 14px;
    `;
    
    const iconMap = {
        'error': 'fas fa-exclamation-circle',
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    const icon = document.createElement('i');
    icon.className = iconMap[type] || iconMap.info;
    icon.style.fontSize = '18px';
    
    const text = document.createElement('span');
    text.textContent = message;
    text.style.flex = '1';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = 'background: none; border: none; color: white; cursor: pointer; padding: 0; font-size: 16px; opacity: 0.8; transition: opacity 0.2s;';
    closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
    closeBtn.onmouseout = () => closeBtn.style.opacity = '0.8';
    closeBtn.onclick = () => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    };
    
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    container.appendChild(notification);
    
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

// ==========================================
// FORM VALIDATION
// ==========================================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateEmail(email) {
    return isValidEmail(email);
}

function validatePhone(phone) {
    if (!phone) return true; // Phone is optional
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
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

// ==========================================
// DATE FORMATTING
// ==========================================
function formatDate(dateString) {
    try {
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
    } catch (error) {
        return 'Invalid date';
    }
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
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

function getProjectTypeIcon(projectType) {
    const icons = {
        'Website': 'laptop-code',
        'App': 'mobile-alt',
        'Game': 'gamepad',
        'Consultation': 'comments'
    };
    return icons[projectType] || 'star';
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// ==========================================
// NAVIGATION HELPER
// ==========================================
function navigateToDetailPage(type, id) {
    const pageMap = {
        'game': 'game-detail.html',
        'website': 'website-detail.html',
        'app': 'app-detail.html'
    };
    
    const page = pageMap[type];
    if (page) {
        window.location.href = `${page}?id=${id}`;
    } else {
        console.error('Invalid page type:', type);
    }
}

// ==========================================
// PORTFOLIO DATA VALIDATION
// ==========================================
function validatePortfolioData() {
    if (!window.PORTFOLIO_DATA) {
        console.error('PORTFOLIO_DATA is not defined!');
        return false;
    }
    
    // Ensure all arrays exist
    if (!window.PORTFOLIO_DATA.games) window.PORTFOLIO_DATA.games = [];
    if (!window.PORTFOLIO_DATA.websites) window.PORTFOLIO_DATA.websites = [];
    if (!window.PORTFOLIO_DATA.apps) window.PORTFOLIO_DATA.apps = [];
    if (!window.PORTFOLIO_DATA.testimonials) window.PORTFOLIO_DATA.testimonials = [];
    
    return true;
}

// ==========================================
// LOADING SCREEN HELPERS
// ==========================================
function showLoadingScreen(message = 'Loading...') {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingText = document.getElementById('loadingText');
    if (loadingScreen) {
        if (loadingText) loadingText.textContent = message;
        loadingScreen.style.display = 'flex';
        setTimeout(() => loadingScreen.style.opacity = '1', 10);
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async function() {
        // Validate portfolio data if exists
        if (window.PORTFOLIO_DATA) {
            validatePortfolioData();
        }
        
        // Initialize storage
        await initializeStorage();
    });
} else {
    // DOM already loaded
    (async () => {
        if (window.PORTFOLIO_DATA) {
            validatePortfolioData();
        }
        await initializeStorage();
    })();
}

window.testContactSave = async function() {
    console.log('=== TESTING CONTACT SAVE ===');
    
    const testData = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        contactType: 'project',
        message: 'This is a test message'
    };
    
    console.log('Test data:', testData);
    
    try {
        const result = await saveContact(testData);
        console.log('Save result:', result);
        
        const contacts = await getContacts();
        console.log('All contacts after save:', contacts);
        
        return result;
    } catch (error) {
        console.error('Test failed:', error);
        return false;
    }
};

// ==========================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ==========================================
window.STORAGE_KEYS = STORAGE_KEYS;
window.hasWindowStorage = hasWindowStorage;
window.initializeStorage = initializeStorage;
window.getContacts = getContacts;
window.saveContact = saveContact;
window.updateContactStatus = updateContactStatus;
window.deleteContact = deleteContact;
window.getTestimonials = getTestimonials;
window.addTestimonial = addTestimonial;
window.approveTestimonial = approveTestimonial;
window.deleteTestimonial = deleteTestimonial;
window.getAnalytics = getAnalytics;
window.updateAnalytics = updateAnalytics;
window.getGames = getGames;
window.getWebsites = getWebsites;
window.getApps = getApps;
window.showNotification = showNotification;
window.isValidEmail = isValidEmail;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.sanitizeInput = sanitizeInput;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.formatDateShort = formatDateShort;
window.getRelativeTime = getRelativeTime;
window.debounce = debounce;
window.throttle = throttle;
window.getProjectTypeIcon = getProjectTypeIcon;
window.generateStars = generateStars;
window.navigateToDetailPage = navigateToDetailPage;
window.validatePortfolioData = validatePortfolioData;
window.showLoadingScreen = showLoadingScreen;
window.hideLoadingScreen = hideLoadingScreen;