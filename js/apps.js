// ==========================================
// APPS PAGE - Complete Production-Ready Implementation
// Author: Arsh Verma
// Version: 2.2.0
// Description: Handles all apps portfolio functionality for preview showcase
//              - Filters, sorting, card rendering, and navigation to details
//              - Error handling, accessibility, and performance optimized
//              - Inspired by websites.js: Modern card design with dark bg, badges, features list
// Last Updated: November 11, 2025
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// Centralized state for apps data and UI interactions
// ==========================================
const APPS_STATE = {
    allApps: [],               // Complete list of apps from data source
    filteredApps: [],          // Currently displayed apps after filtering/sorting
    currentFilters: {          // Active filter and sort settings
        platform: 'all',
        category: 'all',
        status: 'all',
        sort: 'newest'
    },
    isLoading: false,          // Loading state to prevent race conditions
    animationDelay: 100        // Staggered animation timing for card entrance
};

// ==========================================
// INITIALIZATION
// Entry point for apps page functionality
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Apps page initializing...');
    initializeAppsPage();
});

/**
 * Main initialization function
 * - Orchestrates data loading, UI setup, and initial render
 * - Wrapped in try-catch for robust error handling
 */
function initializeAppsPage() {
    try {
        APPS_STATE.isLoading = true;
        
        loadAppsData();
        
        setupAppFilters();
        setupAppEventListeners();
        
        updateHeaderStats();
        
        setTimeout(() => {
            APPS_STATE.isLoading = false;
            applyAppFilters(); // Apply initial filters to set filteredApps
            hideLoadingScreen();
        }, 800);
        
        console.log('✅ Apps page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing apps page:', error);
        showNotification('Failed to load apps. Please refresh the page.', 'error');
        APPS_STATE.isLoading = false;
        displayApps([]);
        hideLoadingScreen();
    }
}

/**
 * Load apps data from data source
 * - Prioritizes global functions/data, falls back to sample
 * - Handles missing data gracefully
 */
function loadAppsData() {
    try {
        let appsData = [];
        
        if (typeof window.getApps === 'function') {
            appsData = window.getApps();
            console.log('📦 Apps loaded from getApps() function');
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && Array.isArray(PORTFOLIO_DATA.apps)) {
            appsData = PORTFOLIO_DATA.apps;
            console.log('📦 Apps loaded from PORTFOLIO_DATA');
        } else {
            console.warn('⚠️ No apps data found, using sample data for preview');
            appsData = createSampleApps();
        }
        
        APPS_STATE.allApps = validateAppsData(appsData);
        APPS_STATE.filteredApps = [...APPS_STATE.allApps];
        
        console.log(`📦 Loaded ${APPS_STATE.allApps.length} apps`);
    } catch (error) {
        console.error('❌ Error loading apps:', error);
        APPS_STATE.allApps = [];
        APPS_STATE.filteredApps = [];
        showNotification('Error loading apps data.', 'error');
    }
}

/**
 * Validate apps data structure
 * - Ensures each app has required fields
 * - Sanitizes and defaults missing values
 * @param {Array} apps - Raw apps data
 * @returns {Array} Validated apps array
 */
function validateAppsData(apps) {
    if (!Array.isArray(apps)) return [];
    
    return apps.map(app => ({
        id: app.id || Date.now() + Math.random(),
        name: app.name || 'Untitled App',
        platform: app.platform || 'Cross-Platform',
        category: app.category || 'Uncategorized',
        status: app.status || 'Live',
        description: app.description || app.overview || 'Preview coming soon.',
        launchDate: app.launchDate || null,
        downloadCount: app.downloadCount || '0',
        image: app.image || generatePlaceholderImage(app.name),
        technologies: Array.isArray(app.technologies) ? app.technologies.slice(0, 4) : [],  // Limit to 4 for display
        storeUrl: app.storeUrl || null,
        repositoryUrl: app.repositoryUrl || null
    })).filter(app => app.id);
}

/**
 * Generate placeholder image URL
 * - Uses via.placeholder.com for production-ready fallbacks
 * @param {string} name - App name for text overlay
 * @returns {string} Image URL
 */
function generatePlaceholderImage(name) {
    const encodedName = encodeURIComponent(name.substring(0, 20));
    return `https://via.placeholder.com/400x250/22C55E/FFFFFF?text=${encodedName}`;
}

/**
 * Display apps in the grid
 * - Handles loading, empty, and populated states
 * - Renders cards with preview focus (limited details)
 * @param {Array} apps - Apps to display
 */
function displayApps(apps) {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) {
        console.error('❌ Apps grid element not found');
        return;
    }
    
    if (APPS_STATE.isLoading) {
        appsGrid.innerHTML = `
            <div class="loading-apps">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing apps...</p>
            </div>
        `;
        return;
    }
    
    if (!apps || apps.length === 0) {
        appsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-mobile-alt"></i>
                <h3>No Apps Found</h3>
                <p>No apps match your current filters. Try adjusting them for previews.</p>
                <button class="btn btn-primary" onclick="resetAppFilters()" aria-label="Reset filters">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        updateResultsCount(0);
        return;
    }
    
    appsGrid.innerHTML = apps.map(app => createAppCard(app)).join('');
    
    setupAppCardListeners();
    animateAppCards();
    updateResultsCount(apps.length);
}

/**
 * Create HTML for a single app card (preview only)
 * - Inspired by websites card: Dark bg, rounded, status badge top-right, rating, meta, desc, features list, buttons
 * - Links to app-detail.html for full info
 * @param {Object} app - App data object
 * @returns {string} HTML string for card
 */
function createAppCard(app) {
    const statusClass = app.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = app.image;
    const shortDescription = (app.description || '').length > 120 ? app.description.substring(0, 120) + '...' : app.description;
    
    return `
        <article class="app-card" 
                 data-app-id="${app.id}" 
                 data-platform="${app.platform}" 
                 data-category="${app.category}" 
                 data-status="${app.status}"
                 role="article"
                 aria-labelledby="app-title-${app.id}">
            
            <div class="app-image">
                <img src="${imageUrl}" 
                     alt="${app.name} preview image"
                     loading="lazy"
                     onerror="this.src='${generatePlaceholderImage(app.name)}'">
                
                <div class="app-status-badge status-${statusClass}" aria-label="Status: ${app.status}">${app.status}</div>
                <div class="platform-badge" aria-label="Platform: ${app.platform}">
                    ${getPlatformIcon(app.platform)}
                    <span>${app.platform}</span>
                </div>
            </div>
            
            <div class="app-header">
                <h3 class="app-title" id="app-title-${app.id}">${app.name}</h3>
                ${app.rating > 0 ? `
                    <div class="app-rating" aria-label="Rating: ${app.rating} out of 5">
                        <div class="rating-stars" aria-hidden="true">${generateStars(app.rating)}</div>
                        <span class="rating-value">${app.rating.toFixed(1)}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="app-meta">
                <span class="app-category" aria-label="Category: ${app.category}">
                    <i class="fas fa-tag" aria-hidden="true"></i>
                    ${app.category}
                </span>
                ${app.launchDate ? `
                    <span class="app-date" aria-label="Launch date: ${formatDate(app.launchDate)}">
                        <i class="fas fa-calendar" aria-hidden="true"></i>
                        ${formatDate(app.launchDate)}
                    </span>
                ` : ''}
            </div>
            
            <p class="app-description">${shortDescription}</p>
            
            ${app.technologies && app.technologies.length > 0 ? `
                <div class="app-features" aria-label="Key technologies">
                    ${app.technologies.map(tech => `
                        <div class="feature-item">
                            <i class="fas fa-check" aria-hidden="true"></i>
                            <span>${tech}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="app-actions">
                <button class="btn btn-primary btn-preview-app" 
                        data-app-id="${app.id}"
                        aria-label="Preview more for ${app.name}">
                    <i class="fas fa-info-circle" aria-hidden="true"></i>
                    <span>Preview More</span>
                </button>
                ${app.storeUrl ? `
                    <a href="${app.storeUrl}" 
                       class="btn btn-secondary btn-download-app"
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="Download ${app.name} from store">
                        <i class="fas fa-download" aria-hidden="true"></i>
                        <span>Download</span>
                    </a>
                ` : ''}
                ${app.repositoryUrl ? `
                    <a href="${app.repositoryUrl}" 
                       class="btn btn-secondary btn-repository"
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="View source code for ${app.name}">
                        <i class="fab fa-github" aria-hidden="true"></i>
                        <span>Code</span>
                    </a>
                ` : ''}
            </div>
        </article>
    `;
}

/**
 * Setup filter controls
 * - Dynamically populates platforms, categories, and statuses
 * - Attaches change listeners for real-time filtering
 */
function setupAppFilters() {
    const platformFilter = document.getElementById('platformFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!platformFilter || !categoryFilter || !statusFilter || !sortFilter) {
        console.warn('⚠️ Filter elements not found');
        return;
    }
    
    // Populate platforms dynamically (unique from data)
    const platforms = [...new Set(APPS_STATE.allApps.map(app => app.platform).filter(Boolean))].sort();
    platforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = platform;
        option.textContent = platform;
        platformFilter.appendChild(option);
    });
    
    // Populate categories dynamically
    const categories = [...new Set(APPS_STATE.allApps.map(app => app.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Populate statuses dynamically
    const statuses = [...new Set(APPS_STATE.allApps.map(app => app.status).filter(Boolean))].sort();
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });
    
    // Add listeners
    platformFilter.addEventListener('change', handleFilterChange);
    categoryFilter.addEventListener('change', handleFilterChange);
    statusFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    
    function handleFilterChange() {
        APPS_STATE.currentFilters.platform = platformFilter.value;
        APPS_STATE.currentFilters.category = categoryFilter.value;
        APPS_STATE.currentFilters.status = statusFilter.value;
        APPS_STATE.currentFilters.sort = sortFilter.value;
        applyAppFilters();
    }
}

/**
 * Apply all active filters and sorting
 * - Chains platform/category/status filters, then sorts
 * - Updates display immediately
 */
function applyAppFilters() {
    let filtered = [...APPS_STATE.allApps];
    
    // Platform filter (special handling for Cross-Platform)
    if (APPS_STATE.currentFilters.platform !== 'all') {
        filtered = filtered.filter(app => {
            const appPlatform = app.platform || '';
            if (APPS_STATE.currentFilters.platform === 'Cross-Platform') {
                return appPlatform === 'Cross-Platform';
            }
            return appPlatform.includes(APPS_STATE.currentFilters.platform);
        });
    }
    
    // Category filter
    if (APPS_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(app => app.category === APPS_STATE.currentFilters.category);
    }
    
    // Status filter
    if (APPS_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(app => app.status === APPS_STATE.currentFilters.status);
    }
    
    // Apply sorting
    filtered = sortApps(filtered, APPS_STATE.currentFilters.sort);
    
    APPS_STATE.filteredApps = filtered;
    displayApps(filtered);
}

/**
 * Sort apps by specified criteria
 * - Supports newest, oldest, rating, downloads
 * - Handles missing dates/values gracefully
 * @param {Array} apps - Apps to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted apps
 */
function sortApps(apps, sortBy) {
    const sorted = [...apps];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.launchDate || 0) - new Date(a.launchDate || 0));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.launchDate || 0) - new Date(b.launchDate || 0));
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'downloads':
            return sorted.sort((a, b) => parseDownloadCount(b.downloadCount || '0') - parseDownloadCount(a.downloadCount || '0'));
        default:
            return sorted;
    }
}

/**
 * Reset all filters to defaults
 * - Clears selections and reapplies
 * - Shows success notification
 */
function resetAppFilters() {
    APPS_STATE.currentFilters = { platform: 'all', category: 'all', status: 'all', sort: 'newest' };
    
    const platformFilter = document.getElementById('platformFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (platformFilter) platformFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'newest';
    
    applyAppFilters();
    showNotification('Filters reset successfully', 'success');
}

/**
 * Setup global event listeners
 * - Keyboard shortcuts (e.g., 'R' for reset)
 * - Ignores inputs to avoid conflicts
 */
function setupAppEventListeners() {
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select, button')) return;
        
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            resetAppFilters();
        }
    });
}

/**
 * Setup interactive listeners on app cards
 * - Preview, download, hover effects
 * - Prevents event bubbling on buttons
 */
function setupAppCardListeners() {
    document.querySelectorAll('.btn-preview-app').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const appId = this.getAttribute('data-app-id');
            viewAppDetails(appId);
        });
    });
    
    document.querySelectorAll('.btn-download-app').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    document.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const appId = this.getAttribute('data-app-id');
                viewAppDetails(appId);
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
 * Navigate to app details page
 * - Appends query params for SPA-like routing
 * @param {string|number} appId - App ID
 */
function viewAppDetails(appId) {
    if (!appId) {
        showNotification('Invalid app ID', 'error');
        return;
    }
    window.location.href = `app-detail.html?id=${encodeURIComponent(appId)}`;
}

/**
 * Update header statistics dynamically
 * - Calculates totals from loaded data
 * - Updates DOM elements safely
 */
function updateHeaderStats() {
    const allApps = APPS_STATE.allApps;
    if (allApps.length === 0) return;
    
    const totalApps = allApps.length;
    const ratedApps = allApps.filter(app => app.rating > 0);
    const averageRating = ratedApps.length > 0 
        ? (ratedApps.reduce((sum, app) => sum + app.rating, 0) / ratedApps.length).toFixed(1)
        : '0.0';
    const totalDownloads = allApps.reduce((sum, app) => sum + parseDownloadCount(app.downloadCount || '0'), 0);
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalApps}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalDownloads) + '+';
    }
}

/**
 * Update results count display
 * @param {number} count - Number of filtered results
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const total = APPS_STATE.allApps.length;
        resultsCount.textContent = `Showing ${count} of ${total} app${total !== 1 ? 's' : ''}`;
    }
}

/**
 * Animate cards entrance with stagger
 * - Fade-in and slide-up for polished UX
 */
function animateAppCards() {
    const cards = document.querySelectorAll('.app-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'none';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * APPS_STATE.animationDelay);
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
 * Get platform icon HTML
 * @param {string} platform - App platform
 * @returns {string} Icon HTML
 */
function getPlatformIcon(platform) {
    if (platform.includes('iOS')) {
        return '<i class="fab fa-apple" aria-hidden="true"></i>';
    } else if (platform.includes('Android')) {
        return '<i class="fab fa-android" aria-hidden="true"></i>';
    } else if (platform === 'Cross-Platform') {
        return '<i class="fas fa-mobile-alt" aria-hidden="true"></i>';
    }
    return '<i class="fas fa-mobile-alt" aria-hidden="true"></i>';
}

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
 * Parse download count string to number
 * - Handles K/M suffixes for stats
 * @param {string} downloadCount - Download count string (e.g., '25K+')
 * @returns {number} Parsed number
 */
function parseDownloadCount(downloadCount) {
    if (!downloadCount || typeof downloadCount !== 'string') return 0;
    const numStr = downloadCount.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return 0;
    
    const upperCase = downloadCount.toUpperCase();
    if (upperCase.includes('M')) return num * 1000000;
    else if (upperCase.includes('K')) return num * 1000;
    return num;
}

/**
 * Format large numbers (K, M suffixes)
 * - For download counts and stats
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
// Production-ready sample apps for preview/demo mode
// Edit here to add/remove sample entries
// ==========================================
function createSampleApps() {
    return [
        {
            id: 1,
            name: "TaskMaster Pro",
            platform: "Cross-Platform",
            category: "Productivity",
            status: "Live",
            rating: 4.8,
            description: "Advanced task management app with AI-powered prioritization and team collaboration features. Preview the dashboard and workflows.",
            launchDate: "2024-01-15",
            downloadCount: "100K+",
            image: "https://via.placeholder.com/400x250/22C55E/FFFFFF?text=TaskMaster+Pro",
            technologies: ["React Native", "Firebase", "AI/ML", "Push Notifications"],
            storeUrl: "https://play.google.com/store/apps/details?id=com.taskmaster.pro",
            repositoryUrl: "https://github.com/ArshVermaGit/TaskMasterPro"
        },
        {
            id: 2,
            name: "FitTrack",
            platform: "iOS",
            category: "Health & Fitness",
            status: "Live",
            rating: 4.6,
            description: "Comprehensive fitness tracking app with workout plans, nutrition tracking, and progress analytics. Test the health metrics in preview.",
            launchDate: "2023-11-20",
            downloadCount: "250K+",
            image: "https://via.placeholder.com/400x250/10B981/FFFFFF?text=FitTrack",
            technologies: ["Swift", "HealthKit", "CoreData", "Charts"],
            storeUrl: "https://apps.apple.com/app/fittrack/id123456789",
            repositoryUrl: "https://github.com/ArshVermaGit/TaskMasterPro"
        },
        {
            id: 3,
            name: "ShopEasy",
            platform: "Android",
            category: "E-commerce",
            status: "Live",
            rating: 4.7,
            description: "Modern e-commerce platform with AR product preview, one-click checkout, and personalized recommendations. Explore the shopping experience.",
            launchDate: "2023-09-10",
            downloadCount: "500K+",
            image: "https://via.placeholder.com/400x250/84CC16/FFFFFF?text=ShopEasy",
            technologies: ["Kotlin", "ARCore", "Stripe", "ML Kit"],
            storeUrl: "https://play.google.com/store/apps/details?id=com.shopeasy.app",
            repositoryUrl: "https://github.com/ArshVermaGit/TaskMasterPro"
        },
        {
            id: 4,
            name: "EduBoost",
            platform: "Cross-Platform",
            category: "Education",
            status: "In Development",
            rating: 0,
            description: "Interactive learning app with gamified courses and progress tracking. Early preview of core learning modules.",
            launchDate: null,
            downloadCount: "0",
            image: "https://via.placeholder.com/400x250/F59E0B/FFFFFF?text=EduBoost",
            technologies: ["Flutter", "Firebase Auth", "Offline Sync", "Gamification"],
            storeUrl: null,
            repositoryUrl: "https://github.com/ArshVermaGit/TaskMasterPro"
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// Make key functions available globally for HTML onclicks and utils integration
// ==========================================
window.initializeAppsPage = initializeAppsPage;
window.resetAppFilters = resetAppFilters;
window.viewAppDetails = viewAppDetails;
window.applyAppFilters = applyAppFilters;

console.log('✅ Apps.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔧 Version: 2.2.0 - Websites-Inspired Design Applied');