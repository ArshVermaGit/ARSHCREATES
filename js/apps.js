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
    console.log('Initializing apps page...');
    loadApps();
    setupAppFilters();
    setupAppEventListeners();
    updateHeaderStats();
}

// Load Apps
function loadApps() {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) {
        console.error('Apps grid not found!');
        return;
    }
    
    // Use safe data access
    currentApps = getApps();
    console.log('Loaded apps:', currentApps);
    
    if (currentApps.length === 0) {
        console.warn('No apps found in portfolio data');
        appsGrid.innerHTML = `
            <div class="loading-games">
                <i class="fas fa-mobile-alt"></i>
                <p>No apps available at the moment.</p>
            </div>
        `;
        return;
    }
    
    displayApps(currentApps);
}

// Display Apps
function displayApps(apps) {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;
    
    if (apps.length === 0) {
        appsGrid.innerHTML = `
            <div class="no-games">
                <i class="fas fa-mobile-alt"></i>
                <p>No apps match your filters</p>
                <button class="btn btn-primary" onclick="resetAppFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    appsGrid.innerHTML = apps.map(app => `
        <div class="game-card" data-app-id="${app.id}">
            <div class="game-image">
                <img src="${app.image}" alt="${app.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(app.name)}'">
                ${app.status === 'Live' ? `<span class="game-badge">Live</span>` : ''}
            </div>
            
            <div class="game-content">
                <div class="game-header">
                    <h3 class="game-title">${app.name}</h3>
                    <div class="game-rating">
                        <span class="rating-stars">${generateStars(app.rating)}</span>
                        <span class="rating-value">${app.rating}</span>
                    </div>
                </div>
                
                <span class="game-category">${app.category}</span>
                
                <p class="game-description">${truncateText(app.overview, 120)}</p>
                
                <div class="game-features">
                    <span class="game-feature"><i class="fas fa-download"></i> ${app.downloadCount}</span>
                    <span class="game-feature"><i class="fas fa-mobile-alt"></i> ${app.platform}</span>
                    ${app.features && app.features[0] ? `<span class="game-feature">${app.features[0]}</span>` : ''}
                </div>
                
                <div class="game-actions">
                    ${getDownloadButton(app)}
                    <button class="btn btn-secondary btn-view-app-details" data-app-id="${app.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>Details</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to app cards
    setupAppCardListeners();
    
    // Animate cards on load
    animateAppCards();
}

// Get Download Button HTML
function getDownloadButton(app) {
    if (app.status === 'In Development') {
        return `
            <button class="btn btn-primary" disabled style="opacity: 0.6; cursor: not-allowed;">
                <i class="fas fa-clock"></i>
                <span>Coming Soon</span>
            </button>
        `;
    }
    
    // Check for available download links
    const hasAppStore = app.appStoreUrl && app.appStoreUrl !== '#';
    const hasPlayStore = app.playStoreUrl && app.playStoreUrl !== '#';
    
    if (hasAppStore || hasPlayStore) {
        return `
            <button class="btn btn-primary btn-download-app" data-app-id="${app.id}">
                <i class="fas fa-download"></i>
                <span>Download</span>
            </button>
        `;
    }
    
    return `
        <button class="btn btn-primary" disabled style="opacity: 0.6; cursor: not-allowed;">
            <i class="fas fa-link"></i>
            <span>No Link</span>
        </button>
    `;
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
            showNotification(`Filtered by platform: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyAppFilters();
            showNotification(`Filtered by category: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            applyAppFilters();
            showNotification(`Filtered by status: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
}

// Apply Filters
function applyAppFilters() {
    let filteredApps = getApps();
    
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
        filteredApps = filteredApps.filter(app => 
            app.category === currentFilters.category
        );
    }
    
    // Status filter
    if (currentFilters.status !== 'all') {
        filteredApps = filteredApps.filter(app => 
            app.status === currentFilters.status
        );
    }
    
    currentApps = filteredApps;
    displayApps(filteredApps);
}

// Reset Filters
function resetAppFilters() {
    currentFilters = {
        platform: 'all',
        category: 'all',
        status: 'all'
    };
    
    // Reset select elements
    document.getElementById('platformFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    
    applyAppFilters();
    showNotification('Filters reset', 'success');
}

// Setup App Event Listeners
function setupAppEventListeners() {
    // Search functionality (if search input exists)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                applyAppFilters();
                return;
            }
            
            const filteredApps = getApps().filter(app => 
                app.name.toLowerCase().includes(searchTerm) ||
                app.overview.toLowerCase().includes(searchTerm) ||
                app.category.toLowerCase().includes(searchTerm) ||
                app.description.toLowerCase().includes(searchTerm)
            );
            
            displayApps(filteredApps);
        }, 300));
    }
}

// Setup App Card Listeners
function setupAppCardListeners() {
    // Download buttons
    document.querySelectorAll('.btn-download-app').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appId = parseInt(this.getAttribute('data-app-id'));
            showDownloadOptions(appId);
        });
    });
    
    // View detail buttons
    document.querySelectorAll('.btn-view-app-details').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const appId = parseInt(this.getAttribute('data-app-id'));
            viewAppDetails(appId);
        });
    });
    
    // Card click (for whole card interaction)
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.game-actions')) {
                const appId = parseInt(this.getAttribute('data-app-id'));
                viewAppDetails(appId);
            }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Show Download Options
function showDownloadOptions(appId) {
    const app = getApps().find(a => a.id === appId);
    if (!app) {
        showNotification('App not found', 'error');
        return;
    }
    
    const hasAppStore = app.appStoreUrl && app.appStoreUrl !== '#';
    const hasPlayStore = app.playStoreUrl && app.playStoreUrl !== '#';
    
    if (hasAppStore && hasPlayStore) {
        // Show both options
        const choice = confirm(`Download ${app.name}:\n\nClick OK for App Store\nClick Cancel for Google Play`);
        if (choice) {
            window.open(app.appStoreUrl, '_blank');
            showNotification('Opening App Store...', 'success');
        } else {
            window.open(app.playStoreUrl, '_blank');
            showNotification('Opening Google Play...', 'success');
        }
    } else if (hasAppStore) {
        window.open(app.appStoreUrl, '_blank');
        showNotification('Opening App Store...', 'success');
    } else if (hasPlayStore) {
        window.open(app.playStoreUrl, '_blank');
        showNotification('Opening Google Play...', 'success');
    } else {
        showNotification('Download links not available', 'error');
    }
}

// View App Details
function viewAppDetails(appId) {
    window.location.href = `app-detail.html?id=${appId}`;
}

// Update Header Stats
function updateHeaderStats() {
    const allApps = getApps();
    
    // Calculate stats
    const totalApps = allApps.length;
    const averageRating = totalApps > 0 
        ? (allApps.reduce((sum, app) => sum + app.rating, 0) / totalApps).toFixed(1)
        : '0.0';
    const totalDownloads = allApps.reduce((sum, app) => 
        sum + parseDownloadCount(app.downloadCount), 0
    );
    
    // Update stat numbers
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalApps}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalDownloads);
    }
}

// Parse Download Count (handles strings like "50K+", "75K+")
function parseDownloadCount(downloadCount) {
    if (!downloadCount) return 0;
    
    const numStr = downloadCount.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    
    if (downloadCount.includes('M')) {
        return num * 1000000;
    } else if (downloadCount.includes('K')) {
        return num * 1000;
    }
    
    return num;
}

// Animate App Cards
function animateAppCards() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });
}

// Utility: Truncate Text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Utility: Generate Stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
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

// Utility: Format Number
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Make functions globally available
window.initializeAppsPage = initializeAppsPage;
window.resetAppFilters = resetAppFilters;
window.viewAppDetails = viewAppDetails;
window.showDownloadOptions = showDownloadOptions;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppsPage);
} else {
    initializeAppsPage();
}