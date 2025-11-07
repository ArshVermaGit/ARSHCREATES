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

// Display Apps - SIMPLIFIED: Only image, title, status, rating
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
        <div class="game-card" data-app-id="${app.id}" data-platform="${app.platform}" data-category="${app.category}" data-status="${app.status}" data-rating="${app.rating}">
            <div class="game-image">
                <img src="${app.image}" alt="${app.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(app.name)}'">
                <div class="game-overlay">
                    <div class="overlay-content">
                        <a href="app-detail.html?id=${app.id}" class="view-details-btn">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </a>
                    </div>
                </div>
                <div class="game-badge status-${app.status.toLowerCase().replace(' ', '-')}">${app.status}</div>
            </div>
            
            <div class="game-content">
                <h3 class="game-title">${app.name}</h3>
                <div class="game-meta">
                    <div class="game-rating">
                        <div class="rating-stars">${generateStars(app.rating)}</div>
                        <span class="rating-value">${app.rating}</span>
                    </div>
                    <span class="game-status status-${app.status.toLowerCase().replace(' ', '-')}">${app.status}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to app cards
    setupAppCardListeners();
    
    // Animate cards on load
    animateAppCards();
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
    // Card click (for whole card interaction)
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const appId = parseInt(this.getAttribute('data-app-id'));
            viewAppDetails(appId);
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

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppsPage);
} else {
    initializeAppsPage();
}