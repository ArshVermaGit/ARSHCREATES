// ==========================================
// WEBSITES PAGE - Complete Production-Ready Implementation
// Author: Arsh Verma
// Version: 2.2.0
// Description: Handles all websites portfolio functionality for preview showcase
//              - Filters, sorting, card rendering, and navigation to details
//              - Error handling, accessibility, and performance optimized
//              - Inspired by games.js: Modern card design with dark bg, badges, features list
// Last Updated: November 10, 2025
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// Centralized state for websites data and UI interactions
// ==========================================
const WEBSITES_STATE = {
    allWebsites: [],           // Complete list of websites from data source
    filteredWebsites: [],      // Currently displayed websites after filtering/sorting
    currentFilters: {          // Active filter and sort settings
        category: 'all',
        status: 'all',
        sort: 'newest'
    },
    isLoading: false,          // Loading state to prevent race conditions
    animationDelay: 100        // Staggered animation timing for card entrance
};

// ==========================================
// INITIALIZATION
// Entry point for websites page functionality
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Websites page initializing...');
    initializeWebsitesPage();
});

/**
 * Main initialization function
 * - Orchestrates data loading, UI setup, and initial render
 * - Wrapped in try-catch for robust error handling
 */
function initializeWebsitesPage() {
    try {
        WEBSITES_STATE.isLoading = true;
        
        loadWebsitesData();
        
        setupWebsiteFilters();
        setupWebsiteEventListeners();
        
        updateHeaderStats();
        
        setTimeout(() => {
            WEBSITES_STATE.isLoading = false;
            displayWebsites(WEBSITES_STATE.filteredWebsites);
            hideLoadingScreen();
        }, 800);
        
        console.log('✅ Websites page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing websites page:', error);
        showNotification('Failed to load websites. Please refresh the page.', 'error');
        WEBSITES_STATE.isLoading = false;
        displayWebsites([]);
        hideLoadingScreen();
    }
}

/**
 * Load websites data from data source
 * - Prioritizes global functions/data, falls back to sample
 * - Handles missing data gracefully
 */
function loadWebsitesData() {
    try {
        let websitesData = [];
        
        if (typeof window.getWebsites === 'function') {
            websitesData = window.getWebsites();
            console.log('📦 Websites loaded from getWebsites() function');
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && Array.isArray(PORTFOLIO_DATA.websites)) {
            websitesData = PORTFOLIO_DATA.websites;
            console.log('📦 Websites loaded from PORTFOLIO_DATA');
        } else {
            console.warn('⚠️ No websites data found, using sample data for preview');
            websitesData = createSampleWebsites();
        }
        
        WEBSITES_STATE.allWebsites = validateWebsitesData(websitesData);
        WEBSITES_STATE.filteredWebsites = [...WEBSITES_STATE.allWebsites];
        
        console.log(`📦 Loaded ${WEBSITES_STATE.allWebsites.length} websites`);
    } catch (error) {
        console.error('❌ Error loading websites:', error);
        WEBSITES_STATE.allWebsites = [];
        WEBSITES_STATE.filteredWebsites = [];
        showNotification('Error loading websites data.', 'error');
    }
}

/**
 * Validate websites data structure
 * - Ensures each website has required fields
 * - Sanitizes and defaults missing values
 * @param {Array} websites - Raw websites data
 * @returns {Array} Validated websites array
 */
function validateWebsitesData(websites) {
    if (!Array.isArray(websites)) return [];
    
    return websites.map(website => ({
        id: website.id || Date.now() + Math.random(),
        name: website.name || 'Untitled Website',
        category: website.category || 'Uncategorized',
        status: website.status || 'Live',
        overview: website.overview || website.description || 'Preview coming soon.',
        launchDate: website.launchDate || null,
        userBase: website.userBase || '0',
        image: website.image || generatePlaceholderImage(website.name),
        features: Array.isArray(website.technologies) ? website.technologies.slice(0, 3).map(tech => `Built with ${tech}`) : [],  // Adapt to features
        liveUrl: website.liveUrl || null,
        repositoryUrl: website.repositoryUrl || null
    })).filter(website => website.id);
}

/**
 * Generate placeholder image URL
 * - Uses via.placeholder.com for production-ready fallbacks
 * @param {string} name - Website name for text overlay
 * @returns {string} Image URL
 */
function generatePlaceholderImage(name) {
    const encodedName = encodeURIComponent(name.substring(0, 20));
    return `https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=${encodedName}`;
}

/**
 * Display websites in the grid
 * - Handles loading, empty, and populated states
 * - Renders cards with preview focus (limited details)
 * @param {Array} websites - Websites to display
 */
function displayWebsites(websites) {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) {
        console.error('❌ Websites grid element not found');
        return;
    }
    
    if (WEBSITES_STATE.isLoading) {
        websitesGrid.innerHTML = `
            <div class="loading-websites">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing websites...</p>
            </div>
        `;
        return;
    }
    
    if (!websites || websites.length === 0) {
        websitesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-laptop-code"></i>
                <h3>No Websites Found</h3>
                <p>No websites match your current filters. Try adjusting them for previews.</p>
                <button class="btn btn-primary" onclick="resetWebsiteFilters()" aria-label="Reset filters">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    websitesGrid.innerHTML = websites.map(website => createWebsiteCard(website)).join('');
    
    setupWebsiteCardListeners();
    animateWebsiteCards();
}

/**
 * Create HTML for a single website card (preview only)
 * - Inspired by games card: Dark bg, rounded, status badge top-right, rating, meta, desc, features list, buttons
 * - Links to website-detail.html for full info
 * @param {Object} website - Website data object
 * @returns {string} HTML string for card
 */
function createWebsiteCard(website) {
    const statusClass = website.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = website.image;
    
    const shortOverview = (website.overview || '').length > 120 ? website.overview.substring(0, 120) + '...' : website.overview;
    
    return `
        <article class="website-card" 
                 data-website-id="${website.id}" 
                 data-category="${website.category}" 
                 data-status="${website.status}"
                 role="article"
                 aria-labelledby="website-title-${website.id}">
            
            <div class="website-image">
                <img src="${imageUrl}" 
                     alt="${website.name} preview image"
                     loading="lazy"
                     onerror="this.src='${generatePlaceholderImage(website.name)}'">
                
                <div class="website-status-badge status-${statusClass}" aria-label="Status: ${website.status}">${website.status}</div>
            </div>
            
            <div class="website-header">
                <h3 class="website-title" id="website-title-${website.id}">${website.name}</h3>
                ${website.rating > 0 ? `
                    <div class="website-rating" aria-label="Rating: ${website.rating} out of 5">
                        <div class="rating-stars" aria-hidden="true">${generateStars(website.rating)}</div>
                        <span class="rating-value">${website.rating.toFixed(1)}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="website-meta">
                <span class="website-category" aria-label="Category: ${website.category}">
                    <i class="fas fa-tag" aria-hidden="true"></i>
                    ${website.category}
                </span>
                ${website.launchDate ? `
                    <span class="website-date" aria-label="Launch date: ${formatDate(website.launchDate)}">
                        <i class="fas fa-calendar" aria-hidden="true"></i>
                        ${formatDate(website.launchDate)}
                    </span>
                ` : ''}
            </div>
            
            <p class="website-description">${shortOverview}</p>
            
            ${website.features && website.features.length > 0 ? `
                <div class="website-features" aria-label="Key features">
                    ${website.features.map(feature => `
                        <div class="feature-item">
                            <i class="fas fa-check" aria-hidden="true"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="website-actions">
                <button class="btn btn-primary btn-preview-website" 
                        data-website-id="${website.id}"
                        aria-label="Preview more for ${website.name}">
                    <i class="fas fa-info-circle" aria-hidden="true"></i>
                    <span>Preview More</span>
                </button>
                ${website.repositoryUrl ? `
                    <a href="${website.repositoryUrl}" 
                       class="btn btn-secondary btn-view-code"
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="View source code on GitHub">
                        <i class="fab fa-github" aria-hidden="true"></i>
                        <span>View Code</span>
                    </a>
                ` : ''}
            </div>
        </article>
    `;
}

/**
 * Setup filter controls
 * - Dynamically populates categories
 * - Attaches change listeners for real-time filtering
 */
function setupWebsiteFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!categoryFilter || !statusFilter || !sortFilter) {
        console.warn('⚠️ Filter elements not found');
        return;
    }
    
    const categories = [...new Set(WEBSITES_STATE.allWebsites.map(website => website.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    const statuses = [...new Set(WEBSITES_STATE.allWebsites.map(website => website.status).filter(Boolean))].sort();
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });
    
    categoryFilter.addEventListener('change', handleFilterChange);
    statusFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    
    function handleFilterChange() {
        WEBSITES_STATE.currentFilters.category = categoryFilter.value;
        WEBSITES_STATE.currentFilters.status = statusFilter.value;
        WEBSITES_STATE.currentFilters.sort = sortFilter.value;
        applyWebsiteFilters();
    }
}

/**
 * Apply all active filters and sorting
 * - Chains category/status filters, then sorts
 * - Updates display immediately
 */
function applyWebsiteFilters() {
    let filtered = [...WEBSITES_STATE.allWebsites];
    
    if (WEBSITES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(website => website.category === WEBSITES_STATE.currentFilters.category);
    }
    
    if (WEBSITES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(website => website.status === WEBSITES_STATE.currentFilters.status);
    }
    
    filtered = sortWebsites(filtered, WEBSITES_STATE.currentFilters.sort);
    
    WEBSITES_STATE.filteredWebsites = filtered;
    displayWebsites(filtered);
}

/**
 * Sort websites by specified criteria
 * - Supports newest, oldest, rating, users
 * - Handles missing dates/values gracefully
 * @param {Array} websites - Websites to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted websites
 */
function sortWebsites(websites, sortBy) {
    const sorted = [...websites];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.launchDate || 0) - new Date(a.launchDate || 0));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.launchDate || 0) - new Date(b.launchDate || 0));
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'users':
            return sorted.sort((a, b) => parseUserBase(b.userBase || '0') - parseUserBase(a.userBase || '0'));
        default:
            return sorted;
    }
}

/**
 * Reset all filters to defaults
 * - Clears selections and reapplies
 * - Shows success notification
 */
function resetWebsiteFilters() {
    WEBSITES_STATE.currentFilters = { category: 'all', status: 'all', sort: 'newest' };
    
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'newest';
    
    applyWebsiteFilters();
    showNotification('Filters reset successfully', 'success');
}

/**
 * Setup global event listeners
 * - Keyboard shortcuts (e.g., 'R' for reset)
 * - Ignores inputs to avoid conflicts
 */
function setupWebsiteEventListeners() {
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select, button')) return;
        
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            resetWebsiteFilters();
        }
    });
}

/**
 * Setup interactive listeners on website cards
 * - Preview, view code, hover effects
 * - Prevents event bubbling on buttons
 */
function setupWebsiteCardListeners() {
    document.querySelectorAll('.btn-preview-website').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const websiteId = this.getAttribute('data-website-id');
            viewWebsiteDetails(websiteId);
        });
    });
    
    document.querySelectorAll('.btn-view-code').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    document.querySelectorAll('.website-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const websiteId = this.getAttribute('data-website-id');
                viewWebsiteDetails(websiteId);
            }
        });
        
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
}

/**
 * Navigate to website details page
 * - Appends query params for SPA-like routing
 * @param {string|number} websiteId - Website ID
 */
function viewWebsiteDetails(websiteId) {
    if (!websiteId) {
        showNotification('Invalid website ID', 'error');
        return;
    }
    window.location.href = `website-detail.html?id=${encodeURIComponent(websiteId)}`;
}

/**
 * Update header statistics dynamically
 * - Calculates totals from loaded data
 * - Updates DOM elements safely
 */
function updateHeaderStats() {
    const allWebsites = WEBSITES_STATE.allWebsites;
    if (allWebsites.length === 0) return;
    
    const totalWebsites = allWebsites.length;
    const averageRating = (allWebsites.reduce((sum, website) => sum + (website.rating || 0), 0) / totalWebsites).toFixed(1);
    const totalUsers = allWebsites.reduce((sum, website) => sum + parseUserBase(website.userBase || '0'), 0);
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalWebsites}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalUsers) + '+';
    }
}

/**
 * Animate cards entrance with stagger
 * - Fade-in and slide-up for polished UX
 */
function animateWebsiteCards() {
    const cards = document.querySelectorAll('.website-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'none';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * WEBSITES_STATE.animationDelay);
    });
}

/**
 * Hide loading screen with fade-out
 * - Ensures smooth transition to content
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// Reusable helpers for formatting and notifications
// ==========================================

/**
 * Generate star rating HTML
 * - Full, half, and empty stars based on rating
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML for stars
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star"></i>';
    if (hasHalfStar) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) html += '<i class="far fa-star"></i>';
    return html;
}

/**
 * Parse user base string to number
 * - Handles K/M suffixes for stats
 * @param {string} userBase - User base string (e.g., '25K+')
 * @returns {number} Parsed number
 */
function parseUserBase(userBase) {
    if (!userBase || typeof userBase !== 'string') return 0;
    const numStr = userBase.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return 0;
    
    const upperCase = userBase.toUpperCase();
    if (upperCase.includes('M')) return num * 1000000;
    else if (upperCase.includes('K')) return num * 1000;
    return num;
}

/**
 * Format large numbers (K, M suffixes)
 * - For user counts and stats
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
function formatNumber(num) {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    else if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

/**
 * Format date to readable string
 * - Handles invalid dates gracefully
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date or 'N/A'
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.warn('Invalid date format:', dateString);
        return 'N/A';
    }
}

/**
 * Show notification (fallback to console if no global function)
 * - Integrates with utils.js showNotification if available
 * @param {string} message - Notification text
 * @param {string} type - Type: info, success, error
 */
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ==========================================
// SAMPLE DATA FALLBACK
// Production-ready sample websites for preview/demo mode
// Edit here to add/remove sample entries
// ==========================================
function createSampleWebsites() {
    return [
        {
            id: 1,
            name: "E-Shop Pro",
            category: "E-commerce",
            status: "Live",
            rating: 4.9,
            overview: "Comprehensive e-commerce platform with advanced features and seamless user experience. Preview the storefront and features.",
            launchDate: "2024-02-20",
            userBase: "25K+",
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=E-Shop+Pro",
            features: ["React frontend", "Node.js backend", "Stripe payments"],
            liveUrl: "https://eshoppro.com",
            repositoryUrl: "https://github.com/ArshVermaGit/eshop-pro"
        },
        {
            id: 2,
            name: "HealthTrack Plus",
            category: "Health & Wellness",
            status: "Live",
            rating: 4.8,
            overview: "Comprehensive health tracking platform with AI-powered insights and analytics. Test the dashboard in preview.",
            launchDate: "2024-01-15",
            userBase: "50K+",
            image: "https://via.placeholder.com/400x250/EC4899/FFFFFF?text=HealthTrack+Plus",
            features: ["Vue.js UI", "Python API", "PostgreSQL DB"],
            liveUrl: "https://healthtrackplus.com",
            repositoryUrl: "https://github.com/ArshVermaGit/healthtrack-plus"
        },
        {
            id: 3,
            name: "CloudSuite SaaS",
            category: "SaaS Platform",
            status: "In Development",
            rating: 4.6,
            overview: "All-in-one SaaS platform for business management and team collaboration. Sneak peek at core modules.",
            launchDate: "2024-06-30",
            userBase: "10K+",
            image: "https://via.placeholder.com/400x250/A855F7/FFFFFF?text=CloudSuite+SaaS",
            features: ["Angular framework", "Java Spring", "MySQL integration"],
            repositoryUrl: "https://github.com/ArshVermaGit/cloudsuite-saas"
        },
        {
            id: 4,
            name: "FoodDash Delivery",
            category: "Food Delivery",
            status: "In Development",
            rating: 0,
            overview: "Real-time food delivery app with integrated payments and tracking. Early preview available.",
            launchDate: null,
            userBase: "0",
            image: "https://via.placeholder.com/400x250/10B981/FFFFFF?text=FoodDash",
            features: ["Next.js SSR", "Express server", "Redis caching"],
            liveUrl: null,
            repositoryUrl: null
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// Make key functions available globally for HTML onclicks and utils integration
// ==========================================
window.initializeWebsitesPage = initializeWebsitesPage;
window.resetWebsiteFilters = resetWebsiteFilters;
window.viewWebsiteDetails = viewWebsiteDetails;
window.applyWebsiteFilters = applyWebsiteFilters;

console.log('✅ Websites.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔧 Version: 2.2.0 - Games-Inspired Design Applied');