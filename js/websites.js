// ==========================================
// WEBSITES PAGE - Complete Portfolio Functionality
// Handles filtering, sorting, searching, and website display
// Author: Arsh Verma
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentWebsites = [];           // Currently displayed websites after filters
let allWebsites = [];               // All websites from data source
let currentFilters = {              // Current filter state
    category: 'all',
    status: 'all',
    sort: 'newest'
};
let isAnimating = false;            // Prevent multiple animations at once

// ==========================================
// PAGE INITIALIZATION
// ==========================================

/**
 * Initialize the websites portfolio page
 * - Loads website data
 * - Sets up filters and event listeners
 * - Updates header statistics
 * - Handles loading screen
 */
function initializeWebsitesPage() {
    console.log('Initializing websites page...');
    
    try {
        // Load and display websites
        loadWebsites();
        
        // Setup filter controls
        setupWebsiteFilters();
        
        // Setup event listeners
        setupWebsiteEventListeners();
        
        // Update header statistics
        updateHeaderStats();
        
        // Hide loading screen after delay
        setTimeout(() => {
            hideLoadingScreen();
        }, 800);
        
        console.log('Websites page initialized successfully');
    } catch (error) {
        console.error('Error initializing websites page:', error);
        showNotification('Error loading websites page', 'error');
    }
}

/**
 * Hide loading screen with fade animation
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
// WEBSITE DATA LOADING
// ==========================================

/**
 * Load websites from data source
 * - Fetches websites from data.js
 * - Handles empty data gracefully
 * - Displays initial website grid
 */
function loadWebsites() {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) {
        console.error('Websites grid element not found!');
        return;
    }
    
    try {
        // Get websites from data.js
        allWebsites = getWebsites();
        currentWebsites = [...allWebsites];
        
        console.log('Loaded websites:', allWebsites.length);
        
        // Handle empty data
        if (allWebsites.length === 0) {
            console.warn('No websites found in portfolio data');
            websitesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-laptop-code"></i>
                    <h3>No Websites Available</h3>
                    <p>Check back soon for new website projects!</p>
                </div>
            `;
            return;
        }
        
        // Display all websites initially
        displayWebsites(currentWebsites);
    } catch (error) {
        console.error('Error loading websites:', error);
        websitesGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Websites</h3>
                <p>Please refresh the page to try again.</p>
            </div>
        `;
    }
}

// ==========================================
// WEBSITE DISPLAY
// ==========================================

/**
 * Display websites in the grid
 * @param {Array} websites - Array of website objects to display
 */
function displayWebsites(websites) {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) return;
    
    // Handle no results
    if (websites.length === 0) {
        websitesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Websites Found</h3>
                <p>No websites match your current filters</p>
                <button class="btn btn-primary" onclick="resetWebsiteFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    // Generate website cards HTML
    websitesGrid.innerHTML = websites.map(website => createWebsiteCard(website)).join('');
    
    // Setup card interactions
    setupWebsiteCardListeners();
    
    // Animate cards entrance
    animateWebsiteCards();
    
    // Update results count
    updateResultsCount(websites.length);
    
    console.log(`Displayed ${websites.length} websites`);
}

/**
 * Create HTML for a single website card
 * @param {Object} website - Website object
 * @returns {string} HTML string for the card
 */
function createWebsiteCard(website) {
    const statusClass = website.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = website.image || `https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(website.name)}`;
    
    return `
        <div class="game-card website-card" 
             data-website-id="${website.id}" 
             data-category="${website.category}" 
             data-status="${website.status}" 
             data-rating="${website.rating}">
            
            <!-- Website Image with Overlay -->
            <div class="game-image">
                <img src="${imageUrl}" 
                     alt="${escapeHtml(website.name)}" 
                     loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(website.name)}'">
                
                <!-- Hover Overlay -->
                <div class="game-overlay">
                    <div class="overlay-content">
                        <a href="website-detail.html?id=${website.id}" 
                           class="view-details-btn"
                           onclick="event.stopPropagation();">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </a>
                        ${website.liveUrl ? `
                            <a href="${website.liveUrl}" 
                               class="visit-site-btn"
                               target="_blank"
                               rel="noopener noreferrer"
                               onclick="event.stopPropagation();">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Visit Site</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Status Badge -->
                <div class="game-badge status-${statusClass}">
                    ${website.status}
                </div>
                
                <!-- Category Badge -->
                <div class="category-badge">
                    <i class="fas fa-tag"></i>
                    ${website.category}
                </div>
            </div>
            
            <!-- Website Content -->
            <div class="game-content">
                <h3 class="game-title">${escapeHtml(website.name)}</h3>
                
                <!-- Meta Information -->
                <div class="game-meta">
                    <div class="game-rating">
                        <div class="rating-stars">${generateStars(website.rating)}</div>
                        <span class="rating-value">${website.rating}</span>
                    </div>
                    <span class="game-status status-${statusClass}">
                        ${website.status}
                    </span>
                </div>
                
                <!-- Brief Description -->
                ${website.overview ? `
                    <p class="website-overview">${escapeHtml(truncateText(website.overview, 80))}</p>
                ` : ''}
                
                <!-- Quick Stats -->
                <div class="website-quick-stats">
                    ${website.userBase ? `
                        <div class="quick-stat">
                            <i class="fas fa-users"></i>
                            <span>${website.userBase} users</span>
                        </div>
                    ` : ''}
                    ${website.launchDate ? `
                        <div class="quick-stat">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDate(website.launchDate)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Technologies Used -->
                ${website.technologies && website.technologies.length > 0 ? `
                    <div class="tech-preview">
                        ${website.technologies.slice(0, 3).map(tech => 
                            `<span class="tech-badge">${escapeHtml(tech)}</span>`
                        ).join('')}
                        ${website.technologies.length > 3 ? 
                            `<span class="tech-badge more">+${website.technologies.length - 3}</span>` 
                            : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ==========================================
// FILTER FUNCTIONALITY
// ==========================================

/**
 * Setup filter controls and event listeners
 */
function setupWebsiteFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    // Category Filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyWebsiteFilters();
            showNotification(`Filtered by: ${selectedText}`, 'info');
            console.log('Category filter changed:', this.value);
        });
    }
    
    // Status Filter
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyWebsiteFilters();
            showNotification(`Status: ${selectedText}`, 'info');
            console.log('Status filter changed:', this.value);
        });
    }
    
    // Sort Filter
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyWebsiteFilters();
            showNotification(`Sorted by: ${selectedText}`, 'info');
            console.log('Sort filter changed:', this.value);
        });
    }
    
    console.log('Website filters setup complete');
}

/**
 * Apply all current filters to websites
 * - Filters by category
 * - Filters by status
 * - Sorts results
 */
function applyWebsiteFilters() {
    try {
        let filteredWebsites = [...allWebsites];
        
        // Apply category filter
        if (currentFilters.category !== 'all') {
            filteredWebsites = filteredWebsites.filter(website => 
                website.category === currentFilters.category
            );
            console.log(`Category filter applied: ${filteredWebsites.length} results`);
        }
        
        // Apply status filter
        if (currentFilters.status !== 'all') {
            filteredWebsites = filteredWebsites.filter(website => 
                website.status === currentFilters.status
            );
            console.log(`Status filter applied: ${filteredWebsites.length} results`);
        }
        
        // Apply sorting
        filteredWebsites = sortWebsites(filteredWebsites, currentFilters.sort);
        
        // Update current websites and display
        currentWebsites = filteredWebsites;
        displayWebsites(filteredWebsites);
        
        console.log(`Filters applied. Showing ${filteredWebsites.length} of ${allWebsites.length} websites`);
    } catch (error) {
        console.error('Error applying filters:', error);
        showNotification('Error applying filters', 'error');
    }
}

/**
 * Sort websites by specified criteria
 * @param {Array} websites - Array of websites to sort
 * @param {string} sortBy - Sort criteria (newest, oldest, rating, users)
 * @returns {Array} Sorted array of websites
 */
function sortWebsites(websites, sortBy) {
    const sortedWebsites = [...websites];
    
    switch (sortBy) {
        case 'newest':
            return sortedWebsites.sort((a, b) => {
                const dateA = new Date(a.launchDate || 0);
                const dateB = new Date(b.launchDate || 0);
                return dateB - dateA;
            });
            
        case 'oldest':
            return sortedWebsites.sort((a, b) => {
                const dateA = new Date(a.launchDate || 0);
                const dateB = new Date(b.launchDate || 0);
                return dateA - dateB;
            });
            
        case 'rating':
            return sortedWebsites.sort((a, b) => {
                return (b.rating || 0) - (a.rating || 0);
            });
            
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

/**
 * Reset all filters to default values
 */
function resetWebsiteFilters() {
    try {
        // Reset filter values
        currentFilters = {
            category: 'all',
            status: 'all',
            sort: 'newest'
        };
        
        // Reset select elements
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (categoryFilter) categoryFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'newest';
        
        // Clear search if exists
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.value = '';
        
        // Reapply filters (will show all)
        applyWebsiteFilters();
        
        showNotification('Filters reset successfully', 'success');
        console.log('Filters reset to defaults');
    } catch (error) {
        console.error('Error resetting filters:', error);
        showNotification('Error resetting filters', 'error');
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

/**
 * Setup additional event listeners
 * - Search functionality
 * - Scroll effects
 * - Keyboard shortcuts
 */
function setupWebsiteEventListeners() {
    // Search functionality
    setupSearchFunctionality();
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Scroll to top button
    setupScrollToTop();
    
    console.log('Event listeners setup complete');
}

/**
 * Setup search functionality with debouncing
 */
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            console.log('Searching for:', searchTerm);
            
            // If search is empty, apply normal filters
            if (searchTerm === '') {
                applyWebsiteFilters();
                return;
            }
            
            // Search in website properties
            const searchResults = allWebsites.filter(website => {
                const searchableText = [
                    website.name,
                    website.overview,
                    website.description,
                    website.category,
                    website.status,
                    ...(website.technologies || []),
                    ...(website.features || [])
                ].join(' ').toLowerCase();
                
                return searchableText.includes(searchTerm);
            });
            
            // Apply sorting to search results
            const sortedResults = sortWebsites(searchResults, currentFilters.sort);
            
            currentWebsites = sortedResults;
            displayWebsites(sortedResults);
            
            console.log(`Search results: ${searchResults.length} websites found`);
        }, 300));
    }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'r':
            case 'R':
                // Reset filters
                e.preventDefault();
                resetWebsiteFilters();
                break;
                
            case '/':
                // Focus search
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.focus();
                break;
        }
    });
}

/**
 * Setup scroll to top functionality
 */
function setupScrollToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==========================================
// WEBSITE CARD INTERACTIONS
// ==========================================

/**
 * Setup interactive behaviors for website cards
 * - Click to view details
 * - Hover effects
 * - Smooth transitions
 */
function setupWebsiteCardListeners() {
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach(card => {
        // Click to view details
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a button or link
            if (e.target.closest('a, button')) {
                return;
            }
            
            const websiteId = parseInt(this.getAttribute('data-website-id'));
            if (websiteId) {
                viewWebsiteDetails(websiteId);
            }
        });
        
        // Hover effect - lift card
        card.addEventListener('mouseenter', function() {
            if (!isAnimating) {
                this.style.transform = 'translateY(-10px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!isAnimating) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    console.log(`Setup interactions for ${cards.length} website cards`);
}

/**
 * Navigate to website detail page
 * @param {number} websiteId - ID of the website to view
 */
function viewWebsiteDetails(websiteId) {
    if (!websiteId || isNaN(websiteId)) {
        console.error('Invalid website ID:', websiteId);
        showNotification('Invalid website', 'error');
        return;
    }
    
    console.log('Navigating to website details:', websiteId);
    window.location.href = `website-detail.html?id=${websiteId}`;
}

// ==========================================
// HEADER STATISTICS
// ==========================================

/**
 * Update header statistics based on website data
 * - Total websites count
 * - Average rating
 * - Total users
 */
function updateHeaderStats() {
    try {
        const totalWebsites = allWebsites.length;
        
        // Calculate average rating
        const averageRating = totalWebsites > 0 
            ? (allWebsites.reduce((sum, website) => sum + (website.rating || 0), 0) / totalWebsites).toFixed(1)
            : '0.0';
        
        // Calculate total users
        const totalUsers = allWebsites.reduce((sum, website) => 
            sum + parseUserBase(website.userBase || '0'), 0
        );
        
        // Update stat displays
        const statNumbers = document.querySelectorAll('.header-stats .stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = totalWebsites > 0 ? `${totalWebsites}+` : '0';
            statNumbers[1].textContent = averageRating;
            statNumbers[2].textContent = formatNumber(totalUsers) + '+';
        }
        
        console.log('Header stats updated:', { totalWebsites, averageRating, totalUsers });
    } catch (error) {
        console.error('Error updating header stats:', error);
    }
}

/**
 * Update results count display
 * @param {number} count - Number of results
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} of ${allWebsites.length} websites`;
    }
}

// ==========================================
// ANIMATIONS
// ==========================================

/**
 * Animate website cards on display
 * Staggered fade-in animation
 */
function animateWebsiteCards() {
    if (isAnimating) return;
    
    isAnimating = true;
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate with delay based on index
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50); // 50ms delay between each card
    });
    
    // Reset animation flag after all cards have animated
    setTimeout(() => {
        isAnimating = false;
    }, cards.length * 50 + 600);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Parse user base string to number
 * @param {string} userBase - User base string (e.g., "50K+", "1.2M+")
 * @returns {number} Parsed number value
 */
function parseUserBase(userBase) {
    if (!userBase || typeof userBase !== 'string') return 0;
    
    // Remove non-numeric characters except decimal point
    const numStr = userBase.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    
    if (isNaN(num)) return 0;
    
    // Check for K (thousands) or M (millions) suffix
    if (userBase.toUpperCase().includes('M')) {
        return num * 1000000;
    } else if (userBase.toUpperCase().includes('K')) {
        return num * 1000;
    }
    
    return num;
}

/**
 * Format number with K/M suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toString();
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string for stars
 */
function generateStars(rating) {
    if (typeof rating !== 'number' || isNaN(rating)) rating = 0;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Jan 2024")
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    try {
        // Check if utils.js has showNotification
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback notification system
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        
        let backgroundColor, icon;
        switch (type) {
            case 'error':
                backgroundColor = '#dc3545';
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'success':
                backgroundColor = '#28a745';
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                backgroundColor = '#ffc107';
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'info':
            default:
                backgroundColor = '#17a2b8';
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 6rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: ${backgroundColor};
            color: white;
            border-radius: 12px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// ==========================================
// GLOBAL FUNCTION EXPORTS
// Make functions available globally
// ==========================================
window.initializeWebsitesPage = initializeWebsitesPage;
window.resetWebsiteFilters = resetWebsiteFilters;
window.viewWebsiteDetails = viewWebsiteDetails;
window.applyWebsiteFilters = applyWebsiteFilters;

// ==========================================
// AUTO-INITIALIZATION
// Initialize when DOM is ready
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsitesPage);
    console.log('Waiting for DOM to load...');
} else {
    initializeWebsitesPage();
}

// ==========================================
// DEBUG HELPERS
// ==========================================

/**
 * Debug function to check website state
 * Call window.debugWebsitesState() in console
 */
window.debugWebsitesState = function() {
    console.log('=== WEBSITES STATE DEBUG ===');
    console.log('All Websites:', allWebsites);
    console.log('Current Websites:', currentWebsites);
    console.log('Current Filters:', currentFilters);
    console.log('Total Count:', allWebsites.length);
    console.log('Filtered Count:', currentWebsites.length);
    console.log('===========================');
};

// Log initialization
console.log('websites.js loaded successfully');
console.log('Available functions:', ['initializeWebsitesPage', 'resetWebsiteFilters', 'viewWebsiteDetails', 'applyWebsiteFilters', 'debugWebsitesState']);