// ==========================================
// APPS PAGE - Mobile apps portfolio functionality
// Handles filtering, sorting, and app display
// ==========================================

// Global Variables
let currentApps = [];
let currentFilters = {
    platform: 'all',
    category: 'all',
    status: 'all'
};

// Initialize Apps Page
function initializeAppsPage() {
    loadApps();
    setupAppFilters();
    setupAppEventListeners();
}

// Load Apps
function loadApps() {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;
    
    currentApps = PORTFOLIO_DATA.apps;
    displayApps(currentApps);
    updateAppStats();
}

// Display Apps
function displayApps(apps) {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;
    
    if (apps.length === 0) {
        appsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-mobile-alt"></i>
                <h3>No apps found</h3>
                <p>Try adjusting your filters to see more results</p>
            </div>
        `;
        return;
    }
    
    appsGrid.innerHTML = apps.map(app => `
        <div class="portfolio-card" data-app-id="${app.id}">
            <div class="card-image">
                <img src="${app.image}" alt="${app.name}" loading="lazy">
                <div class="card-overlay">
                    <div class="card-actions">
                        ${app.appStoreUrl !== '#' ? `
                            <a href="${app.appStoreUrl}" class="btn-download ios" target="_blank" title="Download on App Store">
                                <i class="fab fa-apple"></i>
                            </a>
                        ` : ''}
                        ${app.playStoreUrl !== '#' ? `
                            <a href="${app.playStoreUrl}" class="btn-download android" target="_blank" title="Download on Play Store">
                                <i class="fab fa-google-play"></i>
                            </a>
                        ` : ''}
                        <button class="btn-view" data-app-id="${app.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${app.name}</h3>
                        <span class="card-category">${app.category}</span>
                    </div>
                    <div class="card-rating">
                        ${generateStars(app.rating)}
                        <span>${app.rating}</span>
                    </div>
                </div>
                <p class="card-description">${app.overview}</p>
                <div class="card-meta">
                    <div class="card-stats">
                        <span><i class="fas fa-download"></i> ${app.downloadCount}</span>
                        <span><i class="fas fa-mobile-alt"></i> ${app.platform}</span>
                    </div>
                    <span class="card-status ${app.status.toLowerCase().replace(' ', '-')}">
                        ${app.status}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to app cards
    setupAppCardListeners();
}

// Setup App Filters
function setupAppFilters() {
    const platformFilter = document.getElementById('platformFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (platformFilter) {
        platformFilter.addEventListener('change', function() {
            currentFilters.platform = this.value;
            applyAppFilters();
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyAppFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            applyAppFilters();
        });
    }
}

// Apply Filters
function applyAppFilters() {
    let filteredApps = [...PORTFOLIO_DATA.apps];
    
    // Platform filter
    if (currentFilters.platform !== 'all') {
        filteredApps = filteredApps.filter(app => {
            if (currentFilters.platform === 'Cross-Platform') {
                return app.platform === 'Cross-Platform';
            } else if (currentFilters.platform === 'iOS') {
                return app.platform.includes('iOS') || app.platform === 'Cross-Platform';
            } else if (currentFilters.platform === 'Android') {
                return app.platform.includes('Android') || app.platform === 'Cross-Platform';
            }
            return true;
        });
    }
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filteredApps = filteredApps.filter(app => app.category === currentFilters.category);
    }
    
    // Status filter
    if (currentFilters.status !== 'all') {
        filteredApps = filteredApps.filter(app => app.status === currentFilters.status);
    }
    
    currentApps = filteredApps;
    displayApps(filteredApps);
}

// Setup App Event Listeners
function setupAppEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredApps = PORTFOLIO_DATA.apps.filter(app => 
                app.name.toLowerCase().includes(searchTerm) ||
                app.overview.toLowerCase().includes(searchTerm) ||
                app.category.toLowerCase().includes(searchTerm)
            );
            displayApps(filteredApps);
        }, 300));
    }
}

// Setup App Card Listeners
function setupAppCardListeners() {
    // View detail buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const appId = parseInt(this.getAttribute('data-app-id'));
            viewAppDetails(appId);
        });
    });
    
    // Card click (for whole card interaction)
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.card-actions') && !e.target.closest('a')) {
                const appId = parseInt(this.getAttribute('data-app-id'));
                viewAppDetails(appId);
            }
        });
    });
}

// In apps.js, update the viewAppDetails function:
function viewAppDetails(appId) {
    navigateToDetailPage('app', appId);
}

// Add missing functions to apps.js
function sortItems(items, sortBy) {
    const sortedItems = [...items];
    switch (sortBy) {
        case 'newest':
            return sortedItems.sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate));
        case 'oldest':
            return sortedItems.sort((a, b) => new Date(a.launchDate) - new Date(b.launchDate));
        case 'rating':
            return sortedItems.sort((a, b) => b.rating - a.rating);
        case 'downloads':
            return sortedItems.sort((a, b) => {
                const aDownloads = parseInt(a.downloadCount) || 0;
                const bDownloads = parseInt(b.downloadCount) || 0;
                return bDownloads - aDownloads;
            });
        default:
            return sortedItems;
    }
}

// Update App Stats
function updateAppStats() {
    const totalApps = document.getElementById('totalApps');
    const liveApps = document.getElementById('liveApps');
    const totalDownloads = document.getElementById('totalDownloads');
    
    if (totalApps) {
        totalApps.textContent = PORTFOLIO_DATA.apps.length;
    }
    
    if (liveApps) {
        const liveCount = PORTFOLIO_DATA.apps.filter(app => app.status === 'Live').length;
        liveApps.textContent = liveCount;
    }
    
    if (totalDownloads) {
        // Calculate total downloads from downloadCount strings like "50K+", "75K+"
        const totalDownloadCount = PORTFOLIO_DATA.apps.reduce((sum, app) => {
            const downloadCount = parseInt(app.downloadCount) || 0;
            return sum + downloadCount;
        }, 0);
        totalDownloads.textContent = totalDownloadCount.toLocaleString() + '+';
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppsPage);
} else {
    initializeAppsPage();
}