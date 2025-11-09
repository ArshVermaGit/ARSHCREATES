// ==========================================
// WEBSITES PAGE - COMPLETE IMPLEMENTATION
// Handles all website portfolio functionality
// Author: Arsh Verma
// Version: 1.0.0
// Last Updated: 2024
// ==========================================

/**
 * TABLE OF CONTENTS
 * 1. Global State Management
 * 2. Initialization
 * 3. Data Loading
 * 4. Display & Rendering
 * 5. Filtering System
 * 6. Sorting Functions
 * 7. Card Interactions
 * 8. Event Listeners
 * 9. Navigation Functions
 * 10. Statistics & Analytics
 * 11. Animations
 * 12. Utility Functions
 * 13. Sample Data Fallback
 */

// ==========================================
// 1. GLOBAL STATE MANAGEMENT
// Central state object for websites page
// ==========================================
const WEBSITES_STATE = {
    allWebsites: [],           // All websites from data source
    filteredWebsites: [],      // Filtered results
    currentFilters: {
        category: 'all',       // Selected category filter
        status: 'all',         // Selected status filter
        sort: 'newest',        // Current sort order
        search: ''             // Search query (future enhancement)
    },
    isLoading: false,          // Loading state flag
    animationDelay: 100        // Stagger delay for card animations (ms)
};

// ==========================================
// 2. INITIALIZATION
// Initialize page when DOM is ready
// ==========================================

/**
 * Main initialization function
 * Called when DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Websites page initializing...');
    initializeWebsitesPage();
});

/**
 * Initialize all website page components
 * @returns {void}
 */
function initializeWebsitesPage() {
    try {
        // Step 1: Load websites data from data source
        loadWebsitesData();
        
        // Step 2: Setup filter controls
        setupWebsiteFilters();
        
        // Step 3: Setup event listeners
        setupWebsiteEventListeners();
        
        // Step 4: Update header statistics
        updateHeaderStats();
        
        // Step 5: Display websites
        displayWebsites(WEBSITES_STATE.allWebsites);
        
        // Step 6: Hide loading screen after delay
        setTimeout(hideLoadingScreen, 800);
        
        console.log('✅ Websites page initialized successfully');
        console.log(`📊 Loaded ${WEBSITES_STATE.allWebsites.length} websites`);
        
    } catch (error) {
        console.error('❌ Error initializing websites page:', error);
        showNotification('Failed to load websites. Please refresh the page.', 'error');
        hideLoadingScreen();
    }
}

// ==========================================
// 3. DATA LOADING
// Load websites from data source
// ==========================================

/**
 * Load websites data from global data source
 * Supports multiple data source formats
 * @returns {void}
 */
function loadWebsitesData() {
    try {
        // Try to get websites from global function
        if (typeof window.getWebsites === 'function') {
            WEBSITES_STATE.allWebsites = window.getWebsites();
        } 
        // Try to get from PORTFOLIO_DATA object
        else if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.websites) {
            WEBSITES_STATE.allWebsites = PORTFOLIO_DATA.websites;
        } 
        // Fallback to sample data
        else {
            console.warn('⚠️ No websites data found, using fallback sample data');
            WEBSITES_STATE.allWebsites = createSampleWebsites();
        }
        
        // Initialize filtered websites with all websites
        WEBSITES_STATE.filteredWebsites = [...WEBSITES_STATE.allWebsites];
        
        console.log('📦 Websites loaded:', WEBSITES_STATE.allWebsites.length);
        
    } catch (error) {
        console.error('❌ Error loading websites:', error);
        WEBSITES_STATE.allWebsites = [];
        WEBSITES_STATE.filteredWebsites = [];
    }
}

// ==========================================
// 4. DISPLAY & RENDERING
// Render websites to the DOM
// ==========================================

/**
 * Display websites in the grid
 * Handles loading, empty, and populated states
 * @param {Array} websites - Array of website objects to display
 * @returns {void}
 */
function displayWebsites(websites) {
    const websitesGrid = document.getElementById('websitesGrid');
    
    if (!websitesGrid) {
        console.error('❌ Websites grid element not found');
        return;
    }
    
    // Show loading state
    if (WEBSITES_STATE.isLoading) {
        websitesGrid.innerHTML = `
            <div class="loading-games">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing websites...</p>
            </div>
        `;
        return;
    }
    
    // Show empty state
    if (!websites || websites.length === 0) {
        websitesGrid.innerHTML = `
            <div class="no-games">
                <i class="fas fa-laptop-code"></i>
                <p>No websites match your current filters</p>
                <button class="btn btn-primary" onclick="resetWebsiteFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    // Generate and display website cards
    websitesGrid.innerHTML = websites.map(website => createWebsiteCard(website)).join('');
    
    // Setup card interactions
    setupWebsiteCardListeners();
    
    // Animate cards entrance
    animateWebsiteCards();
    
    console.log(`✅ Displayed ${websites.length} websites`);
}

/**
 * Create HTML for a single website card
 * @param {Object} website - Website data object
 * @returns {string} HTML string for the card
 */
function createWebsiteCard(website) {
    const statusClass = website.status.toLowerCase().replace(/\s+/g, '-');
    const starsHTML = generateStars(website.rating);
    
    return `
        <div class="game-card website-card" 
             data-website-id="${website.id}" 
             data-category="${website.category}" 
             data-status="${website.status}" 
             data-rating="${website.rating}"
             tabindex="0"
             role="article"
             aria-label="${website.name} website">
            
            <!-- Website Image Section -->
            <div class="game-image">
                <img src="${website.image || 'assets/images/websites/default.jpg'}" 
                     alt="${website.name} screenshot"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=${encodeURIComponent(website.name)}'">
                
                <!-- Hover Overlay with Actions -->
                <div class="game-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-primary btn-view-details" 
                                data-website-id="${website.id}"
                                aria-label="View ${website.name} details">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${website.liveUrl ? `
                            <a href="${website.liveUrl}" 
                               class="btn btn-secondary btn-visit-site"
                               target="_blank"
                               rel="noopener noreferrer"
                               aria-label="Visit ${website.name} live">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Visit Site</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Status Badge -->
                <div class="game-badge status-${statusClass}">${website.status}</div>
                
                <!-- Category Badge -->
                <div class="category-badge">
                    <i class="fas fa-tag"></i>
                    ${website.category}
                </div>
            </div>
            
            <!-- Website Content Section -->
            <div class="game-content">
                <!-- Header with Title and Rating -->
                <div class="game-header">
                    <h3 class="game-title">${website.name}</h3>
                    <div class="game-rating" aria-label="Rating: ${website.rating} out of 5">
                        <div class="rating-stars">${starsHTML}</div>
                        <span class="rating-value">${website.rating}</span>
                    </div>
                </div>
                
                <!-- Metadata -->
                <div class="game-meta">
                    <span class="game-category">
                        <i class="fas fa-tag"></i>
                        ${website.category}
                    </span>
                    ${website.launchDate ? `
                        <span class="game-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(website.launchDate)}
                        </span>
                    ` : ''}
                </div>
                
                <!-- Description -->
                <p class="game-description">${website.overview || website.description || 'A professional web solution with modern design and functionality.'}</p>
                
                <!-- Technology Stack -->
                ${website.technologies && website.technologies.length > 0 ? `
                    <div class="website-tech">
                        ${website.technologies.slice(0, 4).map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                        ${website.technologies.length > 4 ? 
                            `<span class="tech-tag more">+${website.technologies.length - 4}</span>` 
                            : ''}
                    </div>
                ` : ''}
                
                <!-- Statistics -->
                <div class="website-stats">
                    ${website.userBase ? `
                        <div class="website-stat">
                            <span class="website-stat-value">${website.userBase}</span>
                            <span class="website-stat-label">Users</span>
                        </div>
                    ` : ''}
                    ${website.pageViews ? `
                        <div class="website-stat">
                            <span class="website-stat-value">${formatNumber(website.pageViews)}</span>
                            <span class="website-stat-label">Page Views</span>
                        </div>
                    ` : ''}
                    ${website.conversionRate ? `
                        <div class="website-stat">
                            <span class="website-stat-value">${website.conversionRate}%</span>
                            <span class="website-stat-label">Conversion</span>
                        </div>
                    ` : ''}
                    ${website.loadTime ? `
                        <div class="website-stat">
                            <span class="website-stat-value">${website.loadTime}s</span>
                            <span class="website-stat-label">Load Time</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Action Buttons -->
                <div class="game-actions">
                    <button class="btn btn-primary btn-view-website" 
                            data-website-id="${website.id}"
                            aria-label="Learn more about ${website.name}">
                        <i class="fas fa-info-circle"></i>
                        <span>Learn More</span>
                    </button>
                    ${website.repositoryUrl ? `
                        <a href="${website.repositoryUrl}" 
                           class="btn btn-secondary"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="View ${website.name} source code on GitHub">
                            <i class="fab fa-github"></i>
                            <span>View Code</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 5. FILTERING SYSTEM
// Setup and apply filters
// ==========================================

/**
 * Setup all filter controls
 * @returns {void}
 */
function setupWebsiteFilters() {
    console.log('🔧 Setting up website filters...');
    
    // Initialize each filter type
    setupCategoryFilter();
    setupStatusFilter();
    setupSortFilter();
    
    console.log('✅ Filters initialized');
}

/**
 * Setup category filter dropdown
 * @returns {void}
 */
function setupCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!categoryFilter) return;
    
    // Get unique categories from websites
    const categories = [...new Set(WEBSITES_STATE.allWebsites.map(website => website.category))];
    
    // Clear existing options except "All"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add category options dynamically
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Add change event listener
    categoryFilter.addEventListener('change', function() {
        WEBSITES_STATE.currentFilters.category = this.value;
        applyWebsiteFilters();
        console.log('📂 Category filter changed:', this.value);
    });
}

/**
 * Setup status filter dropdown
 * @returns {void}
 */
function setupStatusFilter() {
    const statusFilter = document.getElementById('statusFilter');
    
    if (!statusFilter) return;
    
    statusFilter.addEventListener('change', function() {
        WEBSITES_STATE.currentFilters.status = this.value;
        applyWebsiteFilters();
        console.log('📊 Status filter changed:', this.value);
    });
}

/**
 * Setup sort filter dropdown
 * @returns {void}
 */
function setupSortFilter() {
    const sortFilter = document.getElementById('sortFilter');
    
    if (!sortFilter) return;
    
    sortFilter.addEventListener('change', function() {
        WEBSITES_STATE.currentFilters.sort = this.value;
        applyWebsiteFilters();
        console.log('🔄 Sort changed:', this.value);
    });
}

/**
 * Apply all active filters to websites
 * @returns {void}
 */
function applyWebsiteFilters() {
    let filtered = [...WEBSITES_STATE.allWebsites];
    
    // Apply category filter
    if (WEBSITES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(website => 
            website.category === WEBSITES_STATE.currentFilters.category
        );
    }
    
    // Apply status filter
    if (WEBSITES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(website => 
            website.status === WEBSITES_STATE.currentFilters.status
        );
    }
    
    // Apply search filter (if implemented)
    if (WEBSITES_STATE.currentFilters.search) {
        const searchTerm = WEBSITES_STATE.currentFilters.search.toLowerCase();
        filtered = filtered.filter(website => 
            website.name.toLowerCase().includes(searchTerm) ||
            (website.overview && website.overview.toLowerCase().includes(searchTerm)) ||
            (website.description && website.description.toLowerCase().includes(searchTerm)) ||
            website.category.toLowerCase().includes(searchTerm) ||
            (website.technologies && website.technologies.some(tech => 
                tech.toLowerCase().includes(searchTerm)
            ))
        );
    }
    
    // Apply sorting
    filtered = sortWebsites(filtered, WEBSITES_STATE.currentFilters.sort);
    
    // Update state and display
    WEBSITES_STATE.filteredWebsites = filtered;
    displayWebsites(filtered);
    
    console.log(`🎯 Filters applied: ${filtered.length} websites shown`);
}

/**
 * Reset all filters to default values
 * @returns {void}
 */
function resetWebsiteFilters() {
    console.log('🔄 Resetting all filters...');
    
    // Reset state
    WEBSITES_STATE.currentFilters = {
        category: 'all',
        status: 'all',
        sort: 'newest',
        search: ''
    };
    
    // Reset UI elements
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'newest';
    
    // Reapply filters (will show all websites)
    applyWebsiteFilters();
    
    showNotification('Filters reset successfully', 'success');
}

// ==========================================
// 6. SORTING FUNCTIONS
// Sort websites by various criteria
// ==========================================

/**
 * Sort websites array by specified criteria
 * @param {Array} websites - Array of websites to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted array
 */
function sortWebsites(websites, sortBy) {
    const sorted = [...websites];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => 
                new Date(b.launchDate || 0) - new Date(a.launchDate || 0)
            );
            
        case 'oldest':
            return sorted.sort((a, b) => 
                new Date(a.launchDate || 0) - new Date(b.launchDate || 0)
            );
            
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
            
        case 'users':
            return sorted.sort((a, b) => 
                parseUserBase(b.userBase || '0') - parseUserBase(a.userBase || '0')
            );
            
        default:
            return sorted;
    }
}

// ==========================================
// 7. CARD INTERACTIONS
// Setup interactive elements on cards
// ==========================================

/**
 * Setup event listeners for website cards
 * @returns {void}
 */
function setupWebsiteCardListeners() {
    // View Details Buttons
    document.querySelectorAll('.btn-view-details, .btn-view-website').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const websiteId = this.getAttribute('data-website-id');
            viewWebsiteDetails(websiteId);
        });
    });
    
    // Visit Site Buttons
    document.querySelectorAll('.btn-visit-site').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            // Let the natural link behavior happen
        });
    });
    
    // Card Click (entire card clickable)
    document.querySelectorAll('.website-card').forEach(card => {
        // Click handler
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons or links
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const websiteId = this.getAttribute('data-website-id');
                viewWebsiteDetails(websiteId);
            }
        });
        
        // Keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const websiteId = this.getAttribute('data-website-id');
                viewWebsiteDetails(websiteId);
            }
        });
        
        // Hover effects (desktop only)
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
    
    console.log('✅ Website card listeners attached');
}

// ==========================================
// 8. EVENT LISTENERS
// Global event listeners
// ==========================================

/**
 * Setup global event listeners
 * @returns {void}
 */
function setupWebsiteEventListeners() {
    // Window resize handler (debounced)
    window.addEventListener('resize', debounce(function() {
        setupWebsiteCardListeners();
    }, 250));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'R' to reset filters
        if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
            if (!e.target.matches('input, textarea, select')) {
                e.preventDefault();
                resetWebsiteFilters();
            }
        }
    });
    
    console.log('✅ Event listeners initialized');
}

// ==========================================
// 9. NAVIGATION FUNCTIONS
// Handle page navigation
// ==========================================

/**
 * Navigate to website detail page
 * @param {string|number} websiteId - Website ID
 * @returns {void}
 */
function viewWebsiteDetails(websiteId) {
    console.log('🌐 Viewing website details:', websiteId);
    
    if (!websiteId) {
        showNotification('Invalid website ID', 'error');
        return;
    }
    
    // Navigate to website detail page
    window.location.href = `website-detail.html?id=${websiteId}`;
}

// ==========================================
// 10. STATISTICS & ANALYTICS
// Update header statistics
// ==========================================

/**
 * Update header statistics display
 * @returns {void}
 */
function updateHeaderStats() {
    const allWebsites = WEBSITES_STATE.allWebsites;
    
    if (allWebsites.length === 0) return;
    
    // Calculate statistics
    const totalWebsites = allWebsites.length;
    const averageRating = (
        allWebsites.reduce((sum, website) => sum + website.rating, 0) / totalWebsites
    ).toFixed(1);
    const totalUsers = allWebsites.reduce(
        (sum, website) => sum + parseUserBase(website.userBase || '0'), 0
    );
    
    // Update UI
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalWebsites}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalUsers) + '+';
    }
    
    console.log('📊 Stats updated:', { totalWebsites, averageRating, totalUsers });
}

// ==========================================
// 11. ANIMATIONS
// Handle card animations
// ==========================================

/**
 * Animate website cards entrance
 * @returns {void}
 */
function animateWebsiteCards() {
    const cards = document.querySelectorAll('.website-card');
    
    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate with stagger
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * WEBSITES_STATE.animationDelay);
    });
}

/**
 * Hide loading screen with fade effect
 * @returns {void}
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
// 12. UTILITY FUNCTIONS
// Helper functions for data formatting
// ==========================================

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with star icons
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}

/**
 * Parse user base string to number
 * Handles K (thousands) and M (millions) suffixes
 * @param {string} userBase - User base string (e.g., "50K", "1.5M")
 * @returns {number} Numeric value
 */
function parseUserBase(userBase) {
    if (!userBase || typeof userBase !== 'string') return 0;
    
    // Remove non-numeric characters except decimal point
    const numStr = userBase.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    
    if (isNaN(num)) return 0;
    
    // Check for K (thousands) or M (millions) suffix
    const upperCase = userBase.toUpperCase();
    if (upperCase.includes('M')) {
        return num * 1000000;
    } else if (upperCase.includes('K')) {
        return num * 1000;
    }
    
    return num;
}

/**
 * Format large numbers with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
function formatNumber(num) {
    if (!num) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toString();
}

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Jan 2024")
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return 'N/A';
    
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
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
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 * @returns {void}
 */
function showNotification(message, type = 'info') {
    // Use global notification function if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification implementation
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Get notification background color by type
 * @param {string} type - Notification type
 * @returns {string} Hex color code
 */
function getNotificationColor(type) {
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    return colors[type] || colors.info;
}

// ==========================================
// 13. SAMPLE DATA FALLBACK
// Fallback data when no external source available
// ==========================================

/**
 * Create sample websites for fallback
 * @returns {Array} Array of sample website objects
 */
function createSampleWebsites() {
    return [
        {
            id: 1,
            name: "E-Shop Pro",
            category: "E-commerce",
            status: "Live",
            rating: 4.9,
            overview: "Comprehensive health tracking platform with AI-powered insights and analytics.",
            launchDate: "2024-02-20",
            userBase: "25K+",
            pageViews: 180000,
            conversionRate: 4.1,
            loadTime: 2.1,
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=HealthTrack+Plus",
            technologies: ["Vue.js", "Python", "PostgreSQL", "Django", "Docker"],
            liveUrl: "https://healthtrackplus.com",
            repositoryUrl: "https://github.com/ArshVermaGit/healthtrack-plus"
        },
        {
            id: 3,
            name: "CloudSuite SaaS",
            category: "SaaS Platform",
            status: "In Development",
            rating: 4.6,
            overview: "All-in-one SaaS platform for business management and team collaboration.",
            launchDate: "2024-06-30",
            userBase: "10K+",
            pageViews: 75000,
            conversionRate: 2.8,
            loadTime: 2.4,
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=CloudSuite+SaaS",
            technologies: ["Angular", "Java", "MySQL", "Spring Boot", "Azure"]
        },
        {
            id: 4,
            name: "FoodExpress",
            category: "Food Delivery",
            status: "Live",
            rating: 4.7,
            overview: "Fast and reliable food delivery service with real-time tracking and multiple payment options.",
            launchDate: "2023-11-10",
            userBase: "100K+",
            pageViews: 500000,
            conversionRate: 5.2,
            loadTime: 1.5,
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=FoodExpress",
            technologies: ["React Native", "Express.js", "MongoDB", "Redis", "Firebase"],
            liveUrl: "https://foodexpress.com",
            repositoryUrl: "https://github.com/ArshVermaGit/foodexpress"
        },
        {
            id: 5,
            name: "EduLearn Pro",
            category: "SaaS Platform",
            status: "Live",
            rating: 4.9,
            overview: "Interactive learning platform with video courses, quizzes, and progress tracking.",
            launchDate: "2023-09-05",
            userBase: "75K+",
            pageViews: 320000,
            conversionRate: 4.8,
            loadTime: 1.9,
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=EduLearn+Pro",
            technologies: ["Next.js", "Python", "PostgreSQL", "FastAPI", "AWS"],
            liveUrl: "https://edulearnpro.com",
            repositoryUrl: "https://github.com/ArshVermaGit/edulearn-pro"
        },
        {
            id: 6,
            name: "FitLife Tracker",
            category: "Health & Wellness",
            status: "In Development",
            rating: 4.4,
            overview: "Advanced fitness tracking app with workout plans, nutrition guides, and community features.",
            launchDate: "2024-08-15",
            userBase: "5K+",
            pageViews: 45000,
            conversionRate: 3.5,
            loadTime: 2.2,
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=FitLife+Tracker",
            technologies: ["Flutter", "Node.js", "MongoDB", "GraphQL", "Google Cloud"]
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// Export functions for external use
// ==========================================
window.initializeWebsitesPage = initializeWebsitesPage;
window.resetWebsiteFilters = resetWebsiteFilters;
window.viewWebsiteDetails = viewWebsiteDetails;
window.applyWebsiteFilters = applyWebsiteFilters;

// ==========================================
// AUTO-INITIALIZE CONFIRMATION
// Log successful script load
// ==========================================
console.log('✅ Websites.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔧 Version: 1.0.0');

// ==========================================
// END OF SCRIPT
// Author: Arsh Verma
// ==========================================