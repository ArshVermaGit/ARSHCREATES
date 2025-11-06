// ==========================================
// UTILITY FUNCTIONS - Shared across all pages
// Using window.storage API (NOT localStorage)
// ==========================================

// Storage Keys - Using hierarchical naming
const STORAGE_KEYS = {
    CONTACTS: 'portfolio:contacts',
    TESTIMONIALS: 'portfolio:testimonials',
    ANALYTICS: 'portfolio:analytics',
    SETTINGS: 'portfolio:settings'
};

// ==========================================
// INITIALIZE STORAGE
// ==========================================
async function initializeStorage() {
    try {
        // Initialize contacts if not exists
        try {
            await window.storage.get(STORAGE_KEYS.CONTACTS);
        } catch (error) {
            // Key doesn't exist, create it
            await window.storage.set(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
        }
        
        // Initialize testimonials if not exists
        try {
            await window.storage.get(STORAGE_KEYS.TESTIMONIALS);
        } catch (error) {
            // Key doesn't exist, create it with initial data
            const initialTestimonials = PORTFOLIO_DATA?.testimonials?.map(t => ({
                ...t,
                approved: true
            })) || [];
            await window.storage.set(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(initialTestimonials));
        }
        
        // Initialize analytics if not exists
        try {
            await window.storage.get(STORAGE_KEYS.ANALYTICS);
        } catch (error) {
            // Key doesn't exist, create it
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
    try {
        const result = await window.storage.get(STORAGE_KEYS.CONTACTS);
        if (result && result.value) {
            return JSON.parse(result.value);
        }
        return [];
    } catch (error) {
        console.error('Error loading contacts:', error);
        return [];
    }
}

async function addContact(contactData) {
    try {
        const contacts = await getContacts();
        const newContact = {
            id: Date.now(),
            ...contactData,
            date: new Date().toISOString(),
            status: 'new'
        };
        
        contacts.push(newContact);
        await window.storage.set(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
        return newContact;
    } catch (error) {
        console.error('Error adding contact:', error);
        return null;
    }
}

async function updateContactStatus(contactId, updates) {
    try {
        const contacts = await getContacts();
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        
        if (contactIndex !== -1) {
            contacts[contactIndex] = { ...contacts[contactIndex], ...updates };
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
        const result = await window.storage.get(STORAGE_KEYS.TESTIMONIALS);
        if (result && result.value) {
            return JSON.parse(result.value);
        }
        return [];
    } catch (error) {
        console.error('Error loading testimonials:', error);
        return [];
    }
}

async function addTestimonial(testimonialData) {
    try {
        const testimonials = await getTestimonials();
        const newTestimonial = {
            id: Date.now(),
            ...testimonialData,
            date: new Date().toISOString(),
            approved: false, // Requires admin approval
            avatar: 'assets/testimonials/default-avatar.jpg'
        };
        
        testimonials.push(newTestimonial);
        await window.storage.set(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
        return newTestimonial;
    } catch (error) {
        console.error('Error adding testimonial:', error);
        return null;
    }
}

async function approveTestimonial(testimonialId) {
    try {
        const testimonials = await getTestimonials();
        const testimonialIndex = testimonials.findIndex(t => t.id === testimonialId);
        
        if (testimonialIndex !== -1) {
            testimonials[testimonialIndex].approved = true;
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
        const result = await window.storage.get(STORAGE_KEYS.ANALYTICS);
        if (result && result.value) {
            return JSON.parse(result.value);
        }
        return {
            pageViews: 0,
            averageSession: '0m 0s',
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
        await window.storage.set(STORAGE_KEYS.ANALYTICS, JSON.stringify(updatedAnalytics));
        return updatedAnalytics;
    } catch (error) {
        console.error('Error updating analytics:', error);
        return null;
    }
}

// ==========================================
// PORTFOLIO DATA ENHANCEMENT
// ==========================================
function enhancePortfolioData() {
    if (!window.PORTFOLIO_DATA) {
        console.warn('PORTFOLIO_DATA is not defined!');
        return;
    }

    // Ensure all portfolio items have required fields
    if (PORTFOLIO_DATA.games) {
        PORTFOLIO_DATA.games.forEach(game => {
            if (!game.screenshots) game.screenshots = [];
            if (!game.playUrl) game.playUrl = '#';
            if (!game.repositoryUrl) game.repositoryUrl = '#';
        });
    }
    
    if (PORTFOLIO_DATA.websites) {
        PORTFOLIO_DATA.websites.forEach(website => {
            if (!website.screenshots) website.screenshots = [];
            if (!website.liveUrl) website.liveUrl = '#';
            if (!website.repositoryUrl) website.repositoryUrl = '#';
        });
    }
    
    if (PORTFOLIO_DATA.apps) {
        PORTFOLIO_DATA.apps.forEach(app => {
            if (!app.screenshots) app.screenshots = [];
            if (!app.appStoreUrl) app.appStoreUrl = '#';
            if (!app.playStoreUrl) app.playStoreUrl = '#';
            if (!app.repositoryUrl) app.repositoryUrl = '#';
        });
    }
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
    if (!PORTFOLIO_DATA.games) PORTFOLIO_DATA.games = [];
    if (!PORTFOLIO_DATA.websites) PORTFOLIO_DATA.websites = [];
    if (!PORTFOLIO_DATA.apps) PORTFOLIO_DATA.apps = [];
    if (!PORTFOLIO_DATA.testimonials) PORTFOLIO_DATA.testimonials = [];
    
    // Ensure all items have required fields
    PORTFOLIO_DATA.games.forEach((game, index) => {
        if (!game.id) game.id = index + 1;
        if (!game.screenshots) game.screenshots = [];
        if (!game.playUrl) game.playUrl = '#';
    });
    
    PORTFOLIO_DATA.websites.forEach((website, index) => {
        if (!website.id) website.id = index + 1;
        if (!website.screenshots) website.screenshots = [];
        if (!website.liveUrl) website.liveUrl = '#';
    });
    
    PORTFOLIO_DATA.apps.forEach((app, index) => {
        if (!app.id) app.id = index + 1;
        if (!app.screenshots) app.screenshots = [];
        if (!app.appStoreUrl) app.appStoreUrl = '#';
        if (!app.playStoreUrl) app.playStoreUrl = '#';
    });
    
    return true;
}

// ==========================================
// SAFE DATA ACCESS
// ==========================================
function getGames() {
    return PORTFOLIO_DATA?.games || [];
}

function getWebsites() {
    return PORTFOLIO_DATA?.websites || [];
}

function getApps() {
    return PORTFOLIO_DATA?.apps || [];
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(title, message, type = 'info') {
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        console.warn('Notification container not found');
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icons[type] || icons.info}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ==========================================
// FORM VALIDATION
// ==========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ==========================================
// DATE FORMATTING
// ==========================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
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
// INITIALIZE ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', async function() {
    // Validate portfolio data if exists
    if (window.PORTFOLIO_DATA) {
        validatePortfolioData();
    }
    
    // Initialize storage
    if (window.storage) {
        await initializeStorage();
    } else {
        console.warn('window.storage API not available');
    }
});

// ==========================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ==========================================
window.STORAGE_KEYS = STORAGE_KEYS;
window.initializeStorage = initializeStorage;
window.getContacts = getContacts;
window.addContact = addContact;
window.updateContactStatus = updateContactStatus;
window.deleteContact = deleteContact;
window.getTestimonials = getTestimonials;
window.addTestimonial = addTestimonial;
window.approveTestimonial = approveTestimonial;
window.deleteTestimonial = deleteTestimonial;
window.getAnalytics = getAnalytics;
window.updateAnalytics = updateAnalytics;
window.enhancePortfolioData = enhancePortfolioData;
window.navigateToDetailPage = navigateToDetailPage;
window.validatePortfolioData = validatePortfolioData;
window.getGames = getGames;
window.getWebsites = getWebsites;
window.getApps = getApps;
window.showNotification = showNotification;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.sanitizeInput = sanitizeInput;
window.formatDate = formatDate;
window.getRelativeTime = getRelativeTime;