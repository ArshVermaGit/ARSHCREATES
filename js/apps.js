// ==========================================
// APPS PAGE - Complete Mobile Apps Portfolio
// Author: Arsh Verma
// Version: 2.0.0
// Description: Handles all apps portfolio functionality
// ==========================================

'use strict';

// Global state management
const APPS_STATE = {
    allApps: [],
    filteredApps: [],
    currentFilters: {
        platform: 'all',
        category: 'all',
        status: 'all'
    },
    isLoading: false,
    animationDelay: 100
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Apps page initializing...');
    initializeAppsPage();
});

/**
 * Main initialization function
 */
function initializeAppsPage() {
    try {
        loadAppsData();
        setupAppFilters();
        setupAppEventListeners();
        updateHeaderStats();
        displayApps(APPS_STATE.allApps);
        
        setTimeout(hideLoadingScreen, 800);
        console.log('✅ Apps page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing apps page:', error);
        showNotification('Failed to load apps. Please refresh the page.', 'error');
        hideLoadingScreen();
    }
}

/**
 * Load apps data from data source
 */
function loadAppsData() {
    try {
        // Try to get from global data source
        if (typeof window.getApps === 'function') {
            APPS_STATE.allApps = window.getApps();
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.apps) {
            APPS_STATE.allApps = PORTFOLIO_DATA.apps;
        } else {
            // Fallback to sample data
            console.warn('⚠️ No apps data found, using sample data');
            APPS_STATE.allApps = createSampleApps();
        }
        
        APPS_STATE.filteredApps = [...APPS_STATE.allApps];
        console.log(`📦 Loaded ${APPS_STATE.allApps.length} apps`);
    } catch (error) {
        console.error('❌ Error loading apps:', error);
        APPS_STATE.allApps = [];
        APPS_STATE.filteredApps = [];
    }
}

/**
 * Display apps in the grid
 */
function displayApps(apps) {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;
    
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
                <p>No apps match your current filters</p>
                <button class="btn btn-primary" onclick="resetAppFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    appsGrid.innerHTML = apps.map(app => createAppCard(app)).join('');
    setupAppCardListeners();
    animateAppCards();
    updateResultsCount(apps.length);
}

/**
 * Create HTML for app card
 */
function createAppCard(app) {
    const statusClass = app.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = app.image || `https://via.placeholder.com/400x250/22C55E/FFFFFF?text=${encodeURIComponent(app.name)}`;
    
    return `
        <div class="app-card" 
             data-app-id="${app.id}" 
             data-platform="${app.platform}" 
             data-category="${app.category}" 
             data-status="${app.status}">
            
            <div class="app-image">
                <img src="${imageUrl}" 
                     alt="${app.name} mobile app"
                     loading="lazy">
                
                <div class="app-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-primary btn-view-details" 
                                data-app-id="${app.id}">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${app.storeUrl ? `
                            <a href="${app.storeUrl}" 
                               class="btn btn-secondary"
                               target="_blank"
                               rel="noopener noreferrer">
                                <i class="fas fa-download"></i>
                                <span>Download</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <div class="app-badge status-${statusClass}">${app.status}</div>
                <div class="platform-badge">
                    ${getPlatformIcon(app.platform)}
                    <span>${app.platform}</span>
                </div>
            </div>
            
            <div class="app-content">
                <div class="app-header">
                    <h3 class="app-title">${app.name}</h3>
                    ${app.rating > 0 ? `
                        <div class="app-rating">
                            <div class="rating-stars">${generateStars(app.rating)}</div>
                            <span class="rating-value">${app.rating}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="app-platform">
                    ${getPlatformIcon(app.platform)}
                    <span>${app.platform}</span>
                </div>
                
                <p class="app-description">${truncateText(app.description, 120)}</p>
                
                ${(app.downloadCount || app.launchDate) ? `
                    <div class="app-stats">
                        ${app.downloadCount ? `
                            <div class="app-stat">
                                <span class="app-stat-value">${app.downloadCount}</span>
                                <span class="app-stat-label">Downloads</span>
                            </div>
                        ` : ''}
                        ${app.launchDate ? `
                            <div class="app-stat">
                                <span class="app-stat-value">${formatDate(app.launchDate)}</span>
                                <span class="app-stat-label">Launched</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                ${app.technologies && app.technologies.length > 0 ? `
                    <div class="app-features">
                        ${app.technologies.slice(0, 4).map(tech => 
                            `<span class="app-feature">${tech}</span>`
                        ).join('')}
                        ${app.technologies.length > 4 ? 
                            `<span class="app-feature more">+${app.technologies.length - 4}</span>` 
                            : ''}
                    </div>
                ` : ''}
                
                <div class="app-actions">
                    <button class="btn btn-secondary btn-view-app" data-app-id="${app.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>Details</span>
                    </button>
                    ${app.storeUrl ? `
                        <a href="${app.storeUrl}" class="btn btn-app" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-download"></i>
                            <span>Download</span>
                        </a>
                    ` : `
                        <button class="btn btn-app" disabled>
                            <i class="fas fa-clock"></i>
                            <span>Coming Soon</span>
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

/**
 * Setup filter controls
 */
function setupAppFilters() {
    const platformFilter = document.getElementById('platformFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (platformFilter) {
        platformFilter.addEventListener('change', function() {
            APPS_STATE.currentFilters.platform = this.value;
            applyAppFilters();
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            APPS_STATE.currentFilters.category = this.value;
            applyAppFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            APPS_STATE.currentFilters.status = this.value;
            applyAppFilters();
        });
    }
}

/**
 * Apply all active filters
 */
function applyAppFilters() {
    let filtered = [...APPS_STATE.allApps];
    
    // Platform filter
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
        filtered = filtered.filter(app => 
            app.category === APPS_STATE.currentFilters.category
        );
    }
    
    // Status filter
    if (APPS_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(app => 
            app.status === APPS_STATE.currentFilters.status
        );
    }
    
    APPS_STATE.filteredApps = filtered;
    displayApps(filtered);
}

/**
 * Reset all filters
 */
function resetAppFilters() {
    APPS_STATE.currentFilters = {
        platform: 'all',
        category: 'all',
        status: 'all'
    };
    
    const platformFilter = document.getElementById('platformFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (platformFilter) platformFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    
    applyAppFilters();
    showNotification('Filters reset successfully', 'success');
}

/**
 * Setup event listeners
 */
function setupAppEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select')) return;
        
        if (e.key === 'r' || e.key === 'R') {
            resetAppFilters();
        }
    });
}

/**
 * Setup card interactions
 */
function setupAppCardListeners() {
    // View details buttons
    document.querySelectorAll('.btn-view-details, .btn-view-app').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const appId = this.getAttribute('data-app-id');
            viewAppDetails(appId);
        });
    });
    
    // Card click
    document.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const appId = this.getAttribute('data-app-id');
                viewAppDetails(appId);
            }
        });
        
        // Hover effects
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
}

/**
 * Navigate to app details
 */
function viewAppDetails(appId) {
    if (!appId) {
        showNotification('Invalid app ID', 'error');
        return;
    }
    window.location.href = `app-detail.html?id=${appId}`;
}

/**
 * Update header statistics
 */
function updateHeaderStats() {
    const allApps = APPS_STATE.allApps;
    if (allApps.length === 0) return;
    
    const totalApps = allApps.length;
    const ratedApps = allApps.filter(app => app.rating > 0);
    const averageRating = ratedApps.length > 0 
        ? (ratedApps.reduce((sum, app) => sum + app.rating, 0) / ratedApps.length).toFixed(1)
        : '0.0';
    
    const totalDownloads = allApps.reduce((sum, app) => 
        sum + parseDownloadCount(app.downloadCount || '0'), 0
    );
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = totalApps > 0 ? `${totalApps}+` : '0';
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalDownloads) + '+';
    }
}

/**
 * Update results count display
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} of ${APPS_STATE.allApps.length} app${APPS_STATE.allApps.length !== 1 ? 's' : ''}`;
    }
}

/**
 * Animate cards entrance
 */
function animateAppCards() {
    const cards = document.querySelectorAll('.app-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * APPS_STATE.animationDelay);
    });
}

/**
 * Hide loading screen
 */
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
// UTILITY FUNCTIONS
// ==========================================

function getPlatformIcon(platform) {
    if (platform.includes('iOS')) {
        return '<i class="fab fa-apple"></i>';
    } else if (platform.includes('Android')) {
        return '<i class="fab fa-android"></i>';
    } else if (platform === 'Cross-Platform') {
        return '<i class="fas fa-mobile-alt"></i>';
    }
    return '<i class="fas fa-mobile-alt"></i>';
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (error) {
        return 'N/A';
    }
}

function parseDownloadCount(downloadCount) {
    if (!downloadCount || typeof downloadCount !== 'string') return 0;
    const numStr = downloadCount.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return 0;
    
    if (downloadCount.toUpperCase().includes('M')) {
        return num * 1000000;
    } else if (downloadCount.toUpperCase().includes('K')) {
        return num * 1000;
    }
    return num;
}

function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ==========================================
// SAMPLE DATA FALLBACK
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
            description: "Advanced task management app with AI-powered prioritization and team collaboration features.",
            image: "https://via.placeholder.com/400x250/22C55E/FFFFFF?text=TaskMaster+Pro",
            storeUrl: "#",
            downloadCount: "100K+",
            launchDate: "2024-01-15",
            technologies: ["React Native", "Firebase", "AI/ML", "Push Notifications"]
        },
        {
            id: 2,
            name: "FitTrack",
            platform: "iOS",
            category: "Health & Fitness",
            status: "Live",
            rating: 4.6,
            description: "Comprehensive fitness tracking app with workout plans, nutrition tracking, and progress analytics.",
            image: "https://via.placeholder.com/400x250/10B981/FFFFFF?text=FitTrack",
            storeUrl: "#",
            downloadCount: "250K+",
            launchDate: "2023-11-20",
            technologies: ["Swift", "HealthKit", "CoreData", "Charts"]
        },
        {
            id: 3,
            name: "ShopEasy",
            platform: "Android",
            category: "E-commerce",
            status: "Live",
            rating: 4.7,
            description: "Modern e-commerce platform with AR product preview, one-click checkout, and personalized recommendations.",
            image: "https://via.placeholder.com/400x250/84CC16/FFFFFF?text=ShopEasy",
            storeUrl: "#",
            downloadCount: "500K+",
            launchDate: "2023-09-10",
            technologies: ["Kotlin", "ARCore", "Stripe", "ML Kit"]
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

window.initializeAppsPage = initializeAppsPage;
window.resetAppFilters = resetAppFilters;
window.viewAppDetails = viewAppDetails;
window.applyAppFilters = applyAppFilters;

console.log('✅ Apps.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔧 Version: 2.0.0');