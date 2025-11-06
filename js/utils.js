// ==========================================
// UTILITY FUNCTIONS - Shared across all pages
// ==========================================

// Storage Keys
const STORAGE_KEYS = {
    CONTACTS: 'portfolio_contacts',
    TESTIMONIALS: 'portfolio_testimonials',
    ANALYTICS: 'portfolio_analytics',
    SETTINGS: 'portfolio_settings'
};

// Initialize Storage
function initializeStorage() {
    // Initialize contacts if not exists
    if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
    }
    
    // Initialize testimonials if not exists
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
        const initialTestimonials = PORTFOLIO_DATA.testimonials.map(t => ({
            ...t,
            approved: true
        }));
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(initialTestimonials));
    }
    
    // Initialize analytics if not exists
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
        const initialAnalytics = {
            pageViews: 1250,
            averageSession: '4m 30s',
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(initialAnalytics));
    }
}

// Contact Management
function getContacts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    } catch (error) {
        console.error('Error loading contacts:', error);
        return [];
    }
}

function updateContactStatus(contactId, updates) {
    const contacts = getContacts();
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    
    if (contactIndex !== -1) {
        contacts[contactIndex] = { ...contacts[contactIndex], ...updates };
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
        return true;
    }
    return false;
}

function deleteContact(contactId) {
    const contacts = getContacts();
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filteredContacts));
    return true;
}

// Testimonial Management
function getTestimonials() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]');
    } catch (error) {
        console.error('Error loading testimonials:', error);
        return [];
    }
}

function addTestimonial(testimonialData) {
    const testimonials = getTestimonials();
    const newTestimonial = {
        id: Date.now(),
        ...testimonialData,
        date: new Date().toISOString(),
        approved: false, // Requires admin approval
        avatar: 'assets/testimonials/default-avatar.jpg'
    };
    
    testimonials.push(newTestimonial);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    return newTestimonial;
}

function approveTestimonial(testimonialId) {
    const testimonials = getTestimonials();
    const testimonialIndex = testimonials.findIndex(t => t.id === testimonialId);
    
    if (testimonialIndex !== -1) {
        testimonials[testimonialIndex].approved = true;
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
        return true;
    }
    return false;
}

// Analytics
function getAnalytics() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '{}');
    } catch (error) {
        console.error('Error loading analytics:', error);
        return {};
    }
}

function updateAnalytics(updates) {
    const analytics = getAnalytics();
    const updatedAnalytics = { ...analytics, ...updates, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(updatedAnalytics));
    return updatedAnalytics;
}

// Portfolio Data Enhancement
function enhancePortfolioData() {
    // Ensure all portfolio items have required fields
    PORTFOLIO_DATA.games.forEach(game => {
        if (!game.screenshots) game.screenshots = [];
        if (!game.playUrl) game.playUrl = '#';
        if (!game.repositoryUrl) game.repositoryUrl = '#';
    });
    
    PORTFOLIO_DATA.websites.forEach(website => {
        if (!website.screenshots) website.screenshots = [];
        if (!website.liveUrl) website.liveUrl = '#';
        if (!website.repositoryUrl) website.repositoryUrl = '#';
    });
    
    PORTFOLIO_DATA.apps.forEach(app => {
        if (!app.screenshots) app.screenshots = [];
        if (!app.appStoreUrl) app.appStoreUrl = '#';
        if (!app.playStoreUrl) app.playStoreUrl = '#';
        if (!app.repositoryUrl) app.repositoryUrl = '#';
    });
}

// Navigation Helper
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

// Make functions globally available
window.STORAGE_KEYS = STORAGE_KEYS;
window.initializeStorage = initializeStorage;
window.getContacts = getContacts;
window.updateContactStatus = updateContactStatus;
window.deleteContact = deleteContact;
window.getTestimonials = getTestimonials;
window.addTestimonial = addTestimonial;
window.approveTestimonial = approveTestimonial;
window.getAnalytics = getAnalytics;
window.updateAnalytics = updateAnalytics;
window.enhancePortfolioData = enhancePortfolioData;
window.navigateToDetailPage = navigateToDetailPage;