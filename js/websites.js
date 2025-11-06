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
    console.log('Initializing websites page...');
    loadWebsites();
    setupWebsiteFilters();
    setupWebsiteEventListeners();
    updateHeaderStats();
}

// Load Websites
function loadWebsites() {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) {
        console.error('Websites grid not found!');
        return;
    }
    
    // Use safe data access
    currentWebsites = getWebsites();
    console.log('Loaded websites:', currentWebsites);
    
    if (currentWebsites.length === 0) {
        console.warn('No websites found in portfolio data');
        websitesGrid.innerHTML = `
            <div class="loading-games">
                <i class="fas fa-laptop-code"></i>
                <p>No websites available at the moment.</p>
            </div>
        `;
        return;
    }
    
    displayWebsites(currentWebsites);
}

// Display Websites
function displayWebsites(websites) {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) return;
    
    if (websites.length === 0) {
        websitesGrid.innerHTML = `
            <div class="no-games">
                <i class="fas fa-laptop-code"></i>
                <p>No websites match your filters</p>
                <button class="btn btn-primary" onclick="resetWebsiteFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    websitesGrid.innerHTML = websites.map(website => `
        <div class="game-card" data-website-id="${website.id}">
            <div class="game-image">
                <img src="${website.image}" alt="${website.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(website.name)}'">
                ${website.status === 'Live' ? `<span class="game-badge">Live</span>` : ''}
            </div>
            
            <div class="game-content">
                <div class="game-header">
                    <h3 class="game-title">${website.name}</h3>
                    <div class="game-rating">
                        <span class="rating-stars">${generateStars(website.rating)}</span>
                        <span class="rating-value">${website.rating}</span>
                    </div>
                </div>
                
                <span class="game-category">${website.category}</span>
                
                <p class="game-description">${truncateText(website.overview, 120)}</p>
                
                <div class="game-features">
                    ${website.features.slice(0, 3).map(feature => 
                        `<span class="game-feature">${feature}</span>`
                    ).join('')}
                </div>
                
                <div class="game-actions">
                    <a href="${website.liveUrl || '#'}" class="btn btn-primary btn-visit-website" 
                       ${website.status === 'In Development' || !website.liveUrl || website.liveUrl === '#' ? 'onclick="event.preventDefault(); showNotification(\'Coming Soon!\', \'info\')"' : 'target="_blank"'}>
                        <i class="fas fa-external-link-alt"></i>
                        <span>${website.status === 'In Development' ? 'Coming Soon' : 'Visit Site'}</span>
                    </a>
                    <button class="btn btn-secondary btn-view-website-details" data-website-id="${website.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>Details</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to website cards
    setupWebsiteCardListeners();
    
    // Animate cards on load
    animateWebsiteCards();
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
            showNotification(`Filtered by category: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            applyWebsiteFilters();
            showNotification(`Filtered by status: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyWebsiteFilters();
            showNotification(`Sorted by: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
}

// Apply Filters
function applyWebsiteFilters() {
    let filteredWebsites = getWebsites();
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filteredWebsites = filteredWebsites.filter(website => 
            website.category === currentFilters.category
        );
    }
    
    // Status filter
    if (currentFilters.status !== 'all') {
        filteredWebsites = filteredWebsites.filter(website => 
            website.status === currentFilters.status
        );
    }
    
    // Sort websites
    filteredWebsites = sortWebsites(filteredWebsites, currentFilters.sort);
    
    currentWebsites = filteredWebsites;
    displayWebsites(filteredWebsites);
}

// Sort Websites
function sortWebsites(websites, sortBy) {
    const sortedWebsites = [...websites];
    
    switch (sortBy) {
        case 'newest':
            return sortedWebsites.sort((a, b) => 
                new Date(b.launchDate) - new Date(a.launchDate)
            );
        case 'oldest':
            return sortedWebsites.sort((a, b) => 
                new Date(a.launchDate) - new Date(b.launchDate)
            );
        case 'rating':
            return sortedWebsites.sort((a, b) => b.rating - a.rating);
        case 'users':
            return sortedWebsites.sort((a, b) => {
                const aUsers = parseUserBase(a.userBase);
                const bUsers = parseUserBase(b.userBase);
                return bUsers - aUsers;
            });
        default:
            return sortedWebsites;
    }
}

// Parse User Base (handles strings like "50K+", "100K+")
function parseUserBase(userBase) {
    if (!userBase) return 0;
    
    const numStr = userBase.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    
    if (userBase.includes('K')) {
        return num * 1000;
    } else if (userBase.includes('M')) {
        return num * 1000000;
    }
    
    return num;
}

// Reset Filters
function resetWebsiteFilters() {
    currentFilters = {
        category: 'all',
        status: 'all',
        sort: 'newest'
    };
    
    // Reset select elements
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('sortFilter').value = 'newest';
    
    applyWebsiteFilters();
    showNotification('Filters reset', 'success');
}

// Setup Website Event Listeners
function setupWebsiteEventListeners() {
    // Search functionality (if search input exists)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                applyWebsiteFilters();
                return;
            }
            
            const filteredWebsites = getWebsites().filter(website => 
                website.name.toLowerCase().includes(searchTerm) ||
                website.overview.toLowerCase().includes(searchTerm) ||
                website.category.toLowerCase().includes(searchTerm) ||
                website.description.toLowerCase().includes(searchTerm)
            );
            
            displayWebsites(filteredWebsites);
        }, 300));
    }
}

// Setup Website Card Listeners
function setupWebsiteCardListeners() {
    // View detail buttons
    document.querySelectorAll('.btn-view-website-details').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const websiteId = parseInt(this.getAttribute('data-website-id'));
            viewWebsiteDetails(websiteId);
        });
    });
    
    // Card click (for whole card interaction)
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.game-actions')) {
                const websiteId = parseInt(this.getAttribute('data-website-id'));
                viewWebsiteDetails(websiteId);
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

// View Website Details
function viewWebsiteDetails(websiteId) {
    window.location.href = `website-detail.html?id=${websiteId}`;
}

// Update Header Stats
function updateHeaderStats() {
    const allWebsites = getWebsites();
    
    // Calculate stats
    const totalWebsites = allWebsites.length;
    const averageRating = totalWebsites > 0 
        ? (allWebsites.reduce((sum, website) => sum + website.rating, 0) / totalWebsites).toFixed(1)
        : '0.0';
    const totalUsers = allWebsites.reduce((sum, website) => 
        sum + parseUserBase(website.userBase), 0
    );
    
    // Update stat numbers
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalWebsites}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalUsers);
    }
}

// Animate Website Cards
function animateWebsiteCards() {
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
window.initializeWebsitesPage = initializeWebsitesPage;
window.resetWebsiteFilters = resetWebsiteFilters;
window.viewWebsiteDetails = viewWebsiteDetails;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsitesPage);
} else {
    initializeWebsitesPage();
}