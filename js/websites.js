// ==========================================
// WEBSITES PAGE - Websites portfolio functionality
// Handles filtering, sorting, and website display
// ==========================================

// Global Variables
let currentWebsites = [];
let currentFilters = {
    category: 'all',
    status: 'all',
    sort: 'newest'
};

// Initialize Websites Page
function initializeWebsitesPage() {
    loadWebsites();
    setupWebsiteFilters();
    setupWebsiteEventListeners();
}

// Load Websites
function loadWebsites() {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) return;
    
    currentWebsites = PORTFOLIO_DATA.websites;
    displayWebsites(currentWebsites);
    updateWebsiteStats();
}

// Display Websites
function displayWebsites(websites) {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) return;
    
    if (websites.length === 0) {
        websitesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-laptop-code"></i>
                <h3>No websites found</h3>
                <p>Try adjusting your filters to see more results</p>
            </div>
        `;
        return;
    }
    
    websitesGrid.innerHTML = websites.map(website => `
        <div class="portfolio-card" data-website-id="${website.id}">
            <div class="card-image">
                <img src="${website.image}" alt="${website.name}" loading="lazy">
                <div class="card-overlay">
                    <div class="card-actions">
                        <a href="${website.liveUrl}" class="btn-visit" target="_blank" title="Visit Website">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <button class="btn-view" data-website-id="${website.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${website.name}</h3>
                        <span class="card-category">${website.category}</span>
                    </div>
                    <div class="card-rating">
                        ${generateStars(website.rating)}
                        <span>${website.rating}</span>
                    </div>
                </div>
                <p class="card-description">${website.overview}</p>
                <div class="card-meta">
                    <div class="card-stats">
                        <span><i class="fas fa-users"></i> ${website.userBase}</span>
                        <span><i class="fas fa-clock"></i> ${website.developmentTime}</span>
                    </div>
                    <span class="card-status ${website.status.toLowerCase().replace(' ', '-')}">
                        ${website.status}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to website cards
    setupWebsiteCardListeners();
}

// Setup Website Filters
function setupWebsiteFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyWebsiteFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            applyWebsiteFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyWebsiteFilters();
        });
    }
}

// Apply Filters
function applyWebsiteFilters() {
    let filteredWebsites = [...PORTFOLIO_DATA.websites];
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filteredWebsites = filteredWebsites.filter(website => website.category === currentFilters.category);
    }
    
    // Status filter
    if (currentFilters.status !== 'all') {
        filteredWebsites = filteredWebsites.filter(website => website.status === currentFilters.status);
    }
    
    // Sort websites
    filteredWebsites = sortItems(filteredWebsites, currentFilters.sort);
    
    currentWebsites = filteredWebsites;
    displayWebsites(filteredWebsites);
}

// Setup Website Event Listeners
function setupWebsiteEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredWebsites = PORTFOLIO_DATA.websites.filter(website => 
                website.name.toLowerCase().includes(searchTerm) ||
                website.overview.toLowerCase().includes(searchTerm) ||
                website.category.toLowerCase().includes(searchTerm)
            );
            displayWebsites(filteredWebsites);
        }, 300));
    }
}

// Setup Website Card Listeners
function setupWebsiteCardListeners() {
    // View detail buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const websiteId = parseInt(this.getAttribute('data-website-id'));
            viewWebsiteDetails(websiteId);
        });
    });
    
    // Card click (for whole card interaction)
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.card-actions') && !e.target.closest('a')) {
                const websiteId = parseInt(this.getAttribute('data-website-id'));
                viewWebsiteDetails(websiteId);
            }
        });
    });
}

// View Website Details
function viewWebsiteDetails(websiteId) {
    navigateToDetailPage('website', websiteId);
}

// Update Website Stats
function updateWebsiteStats() {
    const totalWebsites = document.getElementById('totalWebsites');
    const liveWebsites = document.getElementById('liveWebsites');
    const totalUsers = document.getElementById('totalUsers');
    
    if (totalWebsites) {
        totalWebsites.textContent = PORTFOLIO_DATA.websites.length;
    }
    
    if (liveWebsites) {
        const liveCount = PORTFOLIO_DATA.websites.filter(website => website.status === 'Live').length;
        liveWebsites.textContent = liveCount;
    }
    
    if (totalUsers) {
        // Calculate total users from userBase strings like "50K+", "25K+"
        const totalUserCount = PORTFOLIO_DATA.websites.reduce((sum, website) => {
            const userCount = parseInt(website.userBase) || 0;
            return sum + userCount;
        }, 0);
        totalUsers.textContent = totalUserCount.toLocaleString() + '+';
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsitesPage);
} else {
    initializeWebsitesPage();
}