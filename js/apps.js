// ==========================================
// APPS PAGE - Complete Mobile Apps Portfolio Functionality
// Handles filtering, sorting, searching, and app display
// Author: Arsh Verma
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentApps = [];              // Currently displayed apps after filters
let allApps = [];                  // All apps from data source
let currentFilters = {             // Current filter state
    platform: 'all',
    category: 'all',
    status: 'all'
};
let isAnimating = false;           // Prevent multiple animations at once

// ==========================================
// PAGE INITIALIZATION
// ==========================================

/**
 * Initialize the apps portfolio page
 * - Loads app data
 * - Sets up filters and event listeners
 * - Updates header statistics
 * - Handles loading screen
 */
function initializeAppsPage() {
    console.log('Initializing apps page...');
    
    try {
        // Load and display apps
        loadApps();
        
        // Setup filter controls
        setupAppFilters();
        
        // Setup event listeners
        setupAppEventListeners();
        
        // Update header statistics
        updateHeaderStats();
        
        // Hide loading screen after delay
        setTimeout(() => {
            hideLoadingScreen();
        }, 800);
        
        console.log('Apps page initialized successfully');
    } catch (error) {
        console.error('Error initializing apps page:', error);
        showNotification('Error loading apps page', 'error');
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
// APP DATA LOADING
// ==========================================

/**
 * Load apps from data source
 * - Fetches apps from data.js
 * - Handles empty data gracefully
 * - Displays initial app grid
 */
function loadApps() {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) {
        console.error('Apps grid element not found!');
        return;
    }
    
    try {
        // Get apps from data.js
        allApps = getApps();
        currentApps = [...allApps];
        
        console.log('Loaded apps:', allApps.length);
        
        // Handle empty data
        if (allApps.length === 0) {
            console.warn('No apps found in portfolio data');
            appsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-mobile-alt"></i>
                    <h3>No Apps Available</h3>
                    <p>Check back soon for new mobile app projects!</p>
                </div>
            `;
            return;
        }
        
        // Display all apps initially
        displayApps(currentApps);
    } catch (error) {
        console.error('Error loading apps:', error);
        appsGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Apps</h3>
                <p>Please refresh the page to try again.</p>
            </div>
        `;
    }
}

// ==========================================
// APP DISPLAY
// ==========================================

/**
 * Display apps in the grid
 * @param {Array} apps - Array of app objects to display
 */
function displayApps(apps) {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;
    
    // Handle no results
    if (apps.length === 0) {
        appsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
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
    
    // Generate app cards HTML
    appsGrid.innerHTML = apps.map(app => createAppCard(app)).join('');
    
    // Setup card interactions
    setupAppCardListeners();
    
    // Animate cards entrance
    animateAppCards();
    
    // Update results count
    updateResultsCount(apps.length);
    
    console.log(`Displayed ${apps.length} apps`);
}

/**
 * Create HTML for a single app card
 * @param {Object} app - App object
 * @returns {string} HTML string for the card
 */
function createAppCard(app) {
    const statusClass = app.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = app.image || `https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(app.name)}`;
    
    return `
        <div class="game-card app-card" 
             data-app-id="${app.id}" 
             data-platform="${app.platform}" 
             data-category="${app.category}" 
             data-status="${app.status}" 
             data-rating="${app.rating}">
            
            <!-- App Image with Overlay -->
            <div class="game-image">
                <img src="${imageUrl}" 
                     alt="${escapeHtml(app.name)}" 
                     loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(app.name)}'">
                
                <!-- Hover Overlay -->
                <div class="game-overlay">
                    <div class="overlay-content">
                        <a href="app-detail.html?id=${app.id}" 
                           class="view-details-btn"
                           onclick="event.stopPropagation();">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </a>
                        ${app.storeUrl ? `
                            <a href="${app.storeUrl}" 
                               class="download-btn"
                               target="_blank"
                               rel="noopener noreferrer"
                               onclick="event.stopPropagation();">
                                <i class="fas fa-download"></i>
                                <span>Download</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Status Badge -->
                <div class="game-badge status-${statusClass}">
                    ${app.status}
                </div>
                
                <!-- Platform Badge -->
                <div class="platform-badge">
                    ${getPlatformIcon(app.platform)}
                    <span>${app.platform}</span>
                </div>
            </div>
            
            <!-- App Content -->
            <div class="game-content">
                <h3 class="game-title">${escapeHtml(app.name)}</h3>
                
                <!-- Meta Information -->
                <div class="game-meta">
                    <div class="game-rating">
                        <div class="rating-stars">${generateStars(app.rating)}</div>
                        <span class="rating-value">${app.rating}</span>
                    </div>
                    <span class="game-status status-${statusClass}">
                        ${app.status}
                    </span>
                </div>
                
                <!-- Brief Description -->
                ${app.overview ? `
                    <p class="app-overview">${escapeHtml(truncateText(app.overview, 80))}</p>
                ` : ''}
                
                <!-- Quick Stats -->
                <div class="app-quick-stats">
                    ${app.downloadCount ? `
                        <div class="quick-stat">
                            <i class="fas fa-download"></i>
                            <span>${app.downloadCount} downloads</span>
                        </div>
                    ` : ''}
                    ${app.launchDate ? `
                        <div class="quick-stat">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDate(app.launchDate)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Technologies Used -->
                ${app.technologies && app.technologies.length > 0 ? `
                    <div class="tech-preview">
                        ${app.technologies.slice(0, 3).map(tech => 
                            `<span class="tech-badge">${escapeHtml(tech)}</span>`
                        ).join('')}
                        ${app.technologies.length > 3 ? 
                            `<span class="tech-badge more">+${app.technologies.length - 3}</span>` 
                            : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Get platform icon based on platform name
 * @param {string} platform - Platform name
 * @returns {string} Icon HTML
 */
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

// ==========================================
// FILTER FUNCTIONALITY
// ==========================================

/**
 * Setup filter controls and event listeners
 */
function setupAppFilters() {
    const platformFilter = document.getElementById('platformFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    // Platform Filter
    if (platformFilter) {
        platformFilter.addEventListener('change', function() {
            currentFilters.platform = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyAppFilters();
            showNotification(`Platform: ${selectedText}`, 'info');
            console.log('Platform filter changed:', this.value);
        });
    }
    
    // Category Filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyAppFilters();
            showNotification(`Category: ${selectedText}`, 'info');
            console.log('Category filter changed:', this.value);
        });
    }
    
    // Status Filter
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyAppFilters();
            showNotification(`Status: ${selectedText}`, 'info');
            console.log('Status filter changed:', this.value);
        });
    }
    
    console.log('App filters setup complete');
}

/**
 * Apply all current filters to apps
 * - Filters by platform (with smart matching)
 * - Filters by category
 * - Filters by status
 */
function applyAppFilters() {
    try {
        let filteredApps = [...allApps];
        
        // Apply platform filter with smart matching
        if (currentFilters.platform !== 'all') {
            filteredApps = filteredApps.filter(app => {
                const appPlatform = app.platform || '';
                
                if (currentFilters.platform === 'Cross-Platform') {
                    return appPlatform === 'Cross-Platform' || 
                           appPlatform.includes('iOS') && appPlatform.includes('Android');
                } else if (currentFilters.platform === 'iOS') {
                    return appPlatform.includes('iOS') || appPlatform === 'Cross-Platform';
                } else if (currentFilters.platform === 'Android') {
                    return appPlatform.includes('Android') || appPlatform === 'Cross-Platform';
                }
                
                return appPlatform === currentFilters.platform;
            });
            console.log(`Platform filter applied: ${filteredApps.length} results`);
        }
        
        // Apply category filter
        if (currentFilters.category !== 'all') {
            filteredApps = filteredApps.filter(app => 
                app.category === currentFilters.category
            );
            console.log(`Category filter applied: ${filteredApps.length} results`);
        }
        
        // Apply status filter
        if (currentFilters.status !== 'all') {
            filteredApps = filteredApps.filter(app => 
                app.status === currentFilters.status
            );
            console.log(`Status filter applied: ${filteredApps.length} results`);
        }
        
        // Update current apps and display
        currentApps = filteredApps;
        displayApps(filteredApps);
        
        console.log(`Filters applied. Showing ${filteredApps.length} of ${allApps.length} apps`);
    } catch (error) {
        console.error('Error applying filters:', error);
        showNotification('Error applying filters', 'error');
    }
}

/**
 * Reset all filters to default values
 */
function resetAppFilters() {
    try {
        // Reset filter values
        currentFilters = {
            platform: 'all',
            category: 'all',
            status: 'all'
        };
        
        // Reset select elements
        const platformFilter = document.getElementById('platformFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (platformFilter) platformFilter.value = 'all';
        if (categoryFilter) categoryFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        
        // Clear search if exists
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.value = '';
        
        // Reapply filters (will show all)
        applyAppFilters();
        
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
function setupAppEventListeners() {
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
                applyAppFilters();
                return;
            }
            
            // Search in app properties
            const searchResults = allApps.filter(app => {
                const searchableText = [
                    app.name,
                    app.overview,
                    app.description,
                    app.category,
                    app.platform,
                    app.status,
                    ...(app.technologies || []),
                    ...(app.features || [])
                ].join(' ').toLowerCase();
                
                return searchableText.includes(searchTerm);
            });
            
            currentApps = searchResults;
            displayApps(searchResults);
            
            console.log(`Search results: ${searchResults.length} apps found`);
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
                resetAppFilters();
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
// APP CARD INTERACTIONS
// ==========================================

/**
 * Setup interactive behaviors for app cards
 * - Click to view details
 * - Hover effects
 * - Smooth transitions
 */
function setupAppCardListeners() {
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach(card => {
        // Click to view details
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a button or link
            if (e.target.closest('a, button')) {
                return;
            }
            
            const appId = parseInt(this.getAttribute('data-app-id'));
            if (appId) {
                viewAppDetails(appId);
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
    
    console.log(`Setup interactions for ${cards.length} app cards`);
}

/**
 * Navigate to app detail page
 * @param {number} appId - ID of the app to view
 */
function viewAppDetails(appId) {
    if (!appId || isNaN(appId)) {
        console.error('Invalid app ID:', appId);
        showNotification('Invalid app', 'error');
        return;
    }
    
    console.log('Navigating to app details:', appId);
    window.location.href = `app-detail.html?id=${appId}`;
}

// ==========================================
// HEADER STATISTICS
// ==========================================

/**
 * Update header statistics based on app data
 * - Total apps count
 * - Average rating
 * - Total downloads
 */
function updateHeaderStats() {
    try {
        const totalApps = allApps.length;
        
        // Calculate average rating
        const averageRating = totalApps > 0 
            ? (allApps.reduce((sum, app) => sum + (app.rating || 0), 0) / totalApps).toFixed(1)
            : '0.0';
        
        // Calculate total downloads
        const totalDownloads = allApps.reduce((sum, app) => 
            sum + parseDownloadCount(app.downloadCount || '0'), 0
        );
        
        // Update stat displays
        const statNumbers = document.querySelectorAll('.header-stats .stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = totalApps > 0 ? `${totalApps}+` : '0';
            statNumbers[1].textContent = averageRating;
            statNumbers[2].textContent = formatNumber(totalDownloads) + '+';
        }
        
        console.log('Header stats updated:', { totalApps, averageRating, totalDownloads });
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
        resultsCount.textContent = `Showing ${count} of ${allApps.length} apps`;
    }
}

// ==========================================
// ANIMATIONS
// ==========================================

/**
 * Animate app cards on display
 * Staggered fade-in animation
 */
function animateAppCards() {
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
 * Parse download count string to number
 * @param {string} downloadCount - Download count string (e.g., "50K+", "1.2M+")
 * @returns {number} Parsed number value
 */
function parseDownloadCount(downloadCount) {
    if (!downloadCount || typeof downloadCount !== 'string') return 0;
    
    // Remove non-numeric characters except decimal point
    const numStr = downloadCount.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    
    if (isNaN(num)) return 0;
    
    // Check for K (thousands) or M (millions) suffix
    if (downloadCount.toUpperCase().includes('M')) {
        return num * 1000000;
    } else if (downloadCount.toUpperCase().includes('K')) {
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
window.initializeAppsPage = initializeAppsPage;
window.resetAppFilters = resetAppFilters;
window.viewAppDetails = viewAppDetails;
window.applyAppFilters = applyAppFilters;

// ==========================================
// AUTO-INITIALIZATION
// Initialize when DOM is ready
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppsPage);
    console.log('Waiting for DOM to load...');
} else {
    initializeAppsPage();
}

// ==========================================
// DEBUG HELPERS
// ==========================================

/**
 * Debug function to check apps state
 * Call window.debugAppsState() in console
 */
window.debugAppsState = function() {
    console.log('=== APPS STATE DEBUG ===');
    console.log('All Apps:', allApps);
    console.log('Current Apps:', currentApps);
    console.log('Current Filters:', currentFilters);
    console.log('Total Count:', allApps.length);
    console.log('Filtered Count:', currentApps.length);
    console.log('========================');
};

// Log initialization
console.log('apps.js loaded successfully');
console.log('Available functions:', ['initializeAppsPage', 'resetAppFilters', 'viewAppDetails', 'applyAppFilters', 'debugAppsState']);