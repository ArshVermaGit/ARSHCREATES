// ==========================================
// WEBSITES PAGE - Complete Production-Ready Implementation
// Author: Arsh Verma
// Version: 3.1.0
// Description: Handles all websites portfolio functionality
//              - Fixed data loading from PORTFOLIO_DATA
//              - Filters, sorting, card rendering, and navigation
//              - Error handling, accessibility, and performance optimized
// Last Updated: November 2024
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// ==========================================
const WEBSITES_STATE = {
    allWebsites: [],
    filteredWebsites: [],
    currentFilters: {
        category: 'all',
        status: 'all',
        sort: 'newest'
    },
    isLoading: false,
    animationDelay: 150
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Initializing Websites Page...');
    initializeWebsitesPage();
});

/**
 * Main initialization function - Fixed data loading
 */
function initializeWebsitesPage() {
    try {
        // Set loading state
        WEBSITES_STATE.isLoading = true;
        showLoadingState();
        
        // Load websites data first
        loadWebsitesData();
        
        // Setup UI components
        setupWebsiteFilters();
        setupWebsiteEventListeners();
        updateHeaderStats();
        
        // Display websites after short delay for smooth UX
        setTimeout(() => {
            WEBSITES_STATE.isLoading = false;
            applyWebsiteFilters(); // This will trigger displayWebsites
            hideLoadingState();
            console.log('✅ Websites page initialized successfully');
        }, 800);
        
    } catch (error) {
        console.error('❌ Error initializing websites page:', error);
        showNotification('Failed to load websites portfolio. Please refresh the page.', 'error');
        WEBSITES_STATE.isLoading = false;
        displayErrorState();
    }
}

/**
 * Fixed data loading from PORTFOLIO_DATA
 */
function loadWebsitesData() {
    try {
        let websitesData = [];
        
        // Try to load from PORTFOLIO_DATA
        if (typeof window.PORTFOLIO_DATA !== 'undefined' && 
            Array.isArray(window.PORTFOLIO_DATA.websites) && 
            window.PORTFOLIO_DATA.websites.length > 0) {
            websitesData = window.PORTFOLIO_DATA.websites;
            console.log('📥 Loaded websites from PORTFOLIO_DATA:', websitesData.length);
        } 
        // Fallback: Check if getWebsites function exists
        else if (typeof window.getWebsites === 'function') {
            websitesData = window.getWebsites();
            console.log('📥 Loaded websites from getWebsites():', websitesData.length);
        }
        // Final fallback: Use sample data
        else {
            websitesData = createSampleWebsites();
            console.log('📥 Using sample websites data:', websitesData.length);
        }
        
        // Validate and assign data
        WEBSITES_STATE.allWebsites = validateWebsitesData(websitesData);
        WEBSITES_STATE.filteredWebsites = [...WEBSITES_STATE.allWebsites];
        
        console.log('🌐 Final websites count:', WEBSITES_STATE.allWebsites.length);
        
    } catch (error) {
        console.error('Error loading websites:', error);
        WEBSITES_STATE.allWebsites = [];
        WEBSITES_STATE.filteredWebsites = [];
        throw new Error('Failed to load websites data');
    }
}

/**
 * Enhanced loading state
 */
function showLoadingState() {
    const websitesGrid = document.getElementById('websitesGrid');
    if (websitesGrid) {
        websitesGrid.innerHTML = `
            <div class="loading-websites" style="animation: fadeIn 0.5s ease-out;">
                <i class="fas fa-spinner fa-spin" style="animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;"></i>
                <p>Loading amazing websites...</p>
                <div style="width: 100px; height: 4px; background: var(--border-color); border-radius: 2px; margin-top: 10px; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: var(--accent-primary); border-radius: 2px; animation: shimmer 1.5s infinite;"></div>
                </div>
            </div>
        `;
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loadingElement = document.querySelector('.loading-websites');
    if (loadingElement) {
        loadingElement.style.opacity = '0';
        loadingElement.style.transform = 'translateY(-20px)';
        loadingElement.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            if (loadingElement.parentNode) {
                loadingElement.remove();
            }
        }, 500);
    }
}

/**
 * Display error state with retry option
 */
function displayErrorState() {
    const websitesGrid = document.getElementById('websitesGrid');
    if (websitesGrid) {
        websitesGrid.innerHTML = `
            <div class="no-results" style="animation: fadeIn 0.6s ease-out;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Websites</h3>
                <p>There was an error loading the websites portfolio. Please try again.</p>
                <button class="btn btn-primary" onclick="retryWebsitesLoading()" aria-label="Retry loading websites">
                    <i class="fas fa-redo"></i>
                    <span>Retry Loading</span>
                </button>
            </div>
        `;
    }
}

/**
 * Retry loading websites
 */
function retryWebsitesLoading() {
    showNotification('Retrying to load websites...', 'info');
    initializeWebsitesPage();
}

// ==========================================
// DATA VALIDATION
// ==========================================

/**
 * Validate websites data structure
 */
function validateWebsitesData(websites) {
    if (!Array.isArray(websites)) {
        console.warn('Invalid websites data: expected array');
        return [];
    }
    
    return websites.map((website, index) => {
        const validatedWebsite = {
            id: website.id || `website-${Date.now()}-${index}`,
            name: website.name?.trim() || 'Untitled Website',
            category: website.category || 'Uncategorized',
            status: website.status || 'Live',
            overview: website.overview || website.description || 'A modern web solution with cutting-edge technology and user-friendly design.',
            launchDate: website.launchDate || null,
            rating: Math.min(5, Math.max(0, website.rating || 0)),
            userBase: website.userBase || '0',
            image: website.image || generatePlaceholderImage(website.name || 'Website'),
            features: Array.isArray(website.features) ? website.features.slice(0, 5) : ['Modern Design', 'Responsive Layout', 'Fast Performance'],
            liveUrl: website.liveUrl || null,
            repositoryUrl: website.repositoryUrl || null
        };
        
        return validatedWebsite;
    }).filter(website => website.id && website.name);
}

/**
 * Generate placeholder image URL
 */
function generatePlaceholderImage(name) {
    const encodedName = encodeURIComponent(name.substring(0, 20));
    return `https://via.placeholder.com/400x250/2E2E2E/3B82F6?text=${encodedName}`;
}

// ==========================================
// UI RENDERING
// ==========================================

/**
 * Display websites in the grid
 */
function displayWebsites(websites) {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) {
        console.error('❌ Websites grid element not found');
        return;
    }
    
    // Clear existing content
    websitesGrid.innerHTML = '';
    
    // Loading state
    if (WEBSITES_STATE.isLoading) {
        showLoadingState();
        return;
    }
    
    // Empty state
    if (!websites || websites.length === 0) {
        websitesGrid.innerHTML = `
            <div class="no-results" style="animation: fadeIn 0.6s ease-out;">
                <i class="fas fa-laptop-code"></i>
                <h3>No Websites Found</h3>
                <p>No websites match your current filters. Try adjusting them to see more previews.</p>
                <button class="btn btn-primary" onclick="resetWebsiteFilters()" aria-label="Reset all filters">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    // Render websites with staggered animation
    websites.forEach((website, index) => {
        const websiteCard = createWebsiteCard(website);
        const cardElement = createElementFromHTML(websiteCard);
        
        // Set initial state for animation
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(30px)';
        
        websitesGrid.appendChild(cardElement);
        
        // Staggered entrance animation
        setTimeout(() => {
            cardElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            cardElement.style.opacity = '1';
            cardElement.style.transform = 'translateY(0)';
        }, index * WEBSITES_STATE.animationDelay);
    });
    
    // Setup interactions after render
    setTimeout(() => {
        setupWebsiteCardListeners();
        console.log(`🌐 Displayed ${websites.length} websites`);
    }, 100);
}

/**
 * Create HTML element from string
 */
function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

/**
 * Create website card HTML
 */
function createWebsiteCard(website) {
    const statusClass = website.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = website.image;
    const shortOverview = (website.overview || '').length > 120 
        ? website.overview.substring(0, 120) + '...' 
        : website.overview;
    
    return `
        <article class="website-card" 
                 data-website-id="${website.id}" 
                 data-category="${website.category}" 
                 data-status="${website.status}"
                 role="article"
                 aria-labelledby="website-title-${website.id}"
                 tabindex="0">
            
            <div class="website-image">
                <img src="${imageUrl}" 
                     alt="${website.name} - Website preview screenshot"
                     loading="lazy"
                     onerror="this.src='${generatePlaceholderImage(website.name)}'; this.onerror=null;">
                
                <div class="website-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-primary btn-view-details" 
                                data-website-id="${website.id}"
                                aria-label="View detailed preview of ${website.name}">
                            <i class="fas fa-eye"></i>
                            <span>Preview Details</span>
                        </button>
                        ${website.liveUrl ? `
                            <a href="${website.liveUrl}" 
                               class="btn btn-secondary btn-visit-live"
                               target="_blank"
                               rel="noopener noreferrer"
                               aria-label="Visit ${website.name} live website">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Visit Live</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <div class="website-status-badge status-${statusClass}" aria-label="Status: ${website.status}">
                    ${website.status}
                </div>
            </div>
            
            <div class="website-content">
                <header class="website-header">
                    <h3 class="website-title" id="website-title-${website.id}">${website.name}</h3>
                    ${website.rating > 0 ? `
                        <div class="website-rating" aria-label="Rating: ${website.rating} out of 5 stars">
                            <div class="rating-stars" aria-hidden="true">${generateStars(website.rating)}</div>
                            <span class="rating-value">${website.rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                </header>
                
                <div class="website-meta">
                    <span class="website-category" aria-label="Category: ${website.category}">
                        <i class="fas fa-tag" aria-hidden="true"></i>
                        ${website.category}
                    </span>
                    ${website.launchDate ? `
                        <span class="website-date" aria-label="Launched: ${formatDate(website.launchDate)}">
                            <i class="fas fa-calendar" aria-hidden="true"></i>
                            ${formatDate(website.launchDate)}
                        </span>
                    ` : ''}
                </div>
                
                <p class="website-description">${shortOverview}</p>
                
                ${website.features && website.features.length > 0 ? `
                    <div class="website-features" aria-label="Key features of ${website.name}">
                        ${website.features.slice(0, 3).map(feature => `
                            <span class="website-feature">
                                <i class="fas fa-check" aria-hidden="true"></i>
                                ${feature}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="website-actions">
                    <button class="btn btn-primary btn-view-website" 
                            data-website-id="${website.id}"
                            aria-label="Learn more about ${website.name}">
                        <i class="fas fa-info-circle" aria-hidden="true"></i>
                        <span>Preview More</span>
                    </button>
                    ${website.repositoryUrl ? `
                        <a href="${website.repositoryUrl}" 
                           class="btn btn-secondary"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="View ${website.name} source code on GitHub">
                            <i class="fab fa-github" aria-hidden="true"></i>
                            <span>View Code</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </article>
    `;
}

// ==========================================
// FILTERING & SORTING
// ==========================================

/**
 * Setup filter controls
 */
function setupWebsiteFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!categoryFilter || !statusFilter || !sortFilter) {
        console.warn('Filter elements not found');
        return;
    }
    
    // Populate categories dynamically from actual data
    const categories = [...new Set(WEBSITES_STATE.allWebsites.map(website => website.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Event listeners for filters
    function handleFilterChange() {
        WEBSITES_STATE.currentFilters.category = categoryFilter.value;
        WEBSITES_STATE.currentFilters.status = statusFilter.value;
        WEBSITES_STATE.currentFilters.sort = sortFilter.value;
        applyWebsiteFilters();
    }
    
    categoryFilter.addEventListener('change', handleFilterChange);
    statusFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    
    console.log('✅ Website filters setup completed');
}

/**
 * Apply all active filters and sorting
 */
function applyWebsiteFilters() {
    if (WEBSITES_STATE.isLoading) return;
    
    let filtered = [...WEBSITES_STATE.allWebsites];
    
    // Category filter
    if (WEBSITES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(website => website.category === WEBSITES_STATE.currentFilters.category);
    }
    
    // Status filter
    if (WEBSITES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(website => website.status === WEBSITES_STATE.currentFilters.status);
    }
    
    // Sort results
    filtered = sortWebsites(filtered, WEBSITES_STATE.currentFilters.sort);
    
    WEBSITES_STATE.filteredWebsites = filtered;
    displayWebsites(filtered);
    
    // Show results count
    const resultsText = filtered.length === 1 ? 'website' : 'websites';
    showNotification(`Showing ${filtered.length} ${resultsText}`, 'info', 2000);
}

/**
 * Sort websites by specified criteria
 */
function sortWebsites(websites, sortBy) {
    const sorted = [...websites];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => {
                const dateA = a.launchDate ? new Date(a.launchDate) : new Date(0);
                const dateB = b.launchDate ? new Date(b.launchDate) : new Date(0);
                return dateB - dateA;
            });
            
        case 'oldest':
            return sorted.sort((a, b) => {
                const dateA = a.launchDate ? new Date(a.launchDate) : new Date(0);
                const dateB = b.launchDate ? new Date(b.launchDate) : new Date(0);
                return dateA - dateB;
            });
            
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            
        case 'users':
            return sorted.sort((a, b) => parseUserBase(b.userBase || '0') - parseUserBase(a.userBase || '0'));
            
        default:
            return sorted;
    }
}

/**
 * Reset all filters to defaults
 */
function resetWebsiteFilters() {
    WEBSITES_STATE.currentFilters = {
        category: 'all',
        status: 'all',
        sort: 'newest'
    };
    
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'newest';
    
    applyWebsiteFilters();
    showNotification('All filters reset successfully', 'success');
}

// ==========================================
// INTERACTIONS & EVENT HANDLERS
// ==========================================

/**
 * Setup global event listeners
 */
function setupWebsiteEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select, button')) return;
        
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            resetWebsiteFilters();
        }
    });
}

/**
 * Setup interactive listeners on website cards
 */
function setupWebsiteCardListeners() {
    // View details / Learn more buttons
    document.querySelectorAll('.btn-view-details, .btn-view-website').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const websiteId = this.getAttribute('data-website-id');
            buttonClickAnimation(this);
            viewWebsiteDetails(websiteId);
        });
    });
    
    // Visit live buttons
    document.querySelectorAll('.btn-visit-live').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            buttonClickAnimation(this);
            // Link will naturally navigate
        });
    });
    
    // Card-wide click for details
    document.querySelectorAll('.website-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const websiteId = this.getAttribute('data-website-id');
                cardClickAnimation(this);
                viewWebsiteDetails(websiteId);
            }
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const websiteId = this.getAttribute('data-website-id');
                viewWebsiteDetails(websiteId);
            }
        });
        
        // Enhanced hover effects
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    });
}

/**
 * Button click animation
 */
function buttonClickAnimation(button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
}

/**
 * Card click animation
 */
function cardClickAnimation(card) {
    card.style.transform = 'scale(0.98)';
    card.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        card.style.transform = '';
    }, 200);
}

/**
 * Navigate to website details
 */
function viewWebsiteDetails(websiteId) {
    if (!websiteId) {
        showNotification('Invalid website selection', 'error');
        return;
    }
    
    const website = WEBSITES_STATE.allWebsites.find(w => w.id == websiteId);
    if (!website) {
        showNotification('Website details not found', 'error');
        return;
    }
    
    showNotification(`Opening details for ${website.name}...`, 'info', 2000);
    console.log(`🔍 Viewing details for: ${website.name}`, website);
    
    // For demo purposes - navigate to detail page
    setTimeout(() => {
        if (website.liveUrl) {
            window.open(website.liveUrl, '_blank');
        } else {
            const features = website.features.slice(0, 3).join(', ');
            showNotification(
                `${website.name} - ${website.category} | Rating: ${website.rating}/5 | Features: ${features}`,
                'info',
                4000
            );
        }
    }, 500);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Generate star rating HTML
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const hasFullExtra = rating % 1 > 0.7;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) - (hasFullExtra ? 1 : 0);
    
    let html = '';
    
    // Full stars
    for (let i = 0; i < fullStars + (hasFullExtra ? 1 : 0); i++) {
        html += '<i class="fas fa-star" style="color: #3B82F6;"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt" style="color: #3B82F6;"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star" style="color: #3B82F6;"></i>';
    }
    
    return html;
}

/**
 * Parse user base string to number
 */
function parseUserBase(userBase) {
    if (!userBase || typeof userBase !== 'string') return 0;
    const numStr = userBase.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return 0;
    
    const upperCase = userBase.toUpperCase();
    if (upperCase.includes('M')) return num * 1000000;
    else if (upperCase.includes('K')) return num * 1000;
    return num;
}

/**
 * Format large numbers
 */
function formatNumber(num) {
    if (!num || num === 0) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    if (!dateString) return 'Coming Soon';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Coming Soon';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.warn('Invalid date format:', dateString);
        return 'Coming Soon';
    }
}

/**
 * Update header statistics dynamically
 */
function updateHeaderStats() {
    const allWebsites = WEBSITES_STATE.allWebsites;
    if (allWebsites.length === 0) return;
    
    const totalWebsites = allWebsites.length;
    const averageRating = (allWebsites.reduce((sum, website) => sum + (website.rating || 0), 0) / totalWebsites).toFixed(1);
    const totalUsers = allWebsites.reduce((sum, website) => sum + parseUserBase(website.userBase || '0'), 0);
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        animateValue(statNumbers[0], 0, totalWebsites, 1500, '+');
        animateValue(statNumbers[1], 0, averageRating, 1500, '');
        animateValue(statNumbers[2], 0, totalUsers, 1500, '+');
    }
}

/**
 * Animate number counting
 */
function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current + suffix;
        
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    let title = 'Information';
    
    switch (type) {
        case 'success':
            icon = 'check-circle';
            title = 'Success';
            break;
        case 'error':
            icon = 'exclamation-circle';
            title = 'Error';
            break;
        default:
            icon = 'info-circle';
            title = 'Information';
    }
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    return notification;
}

// ==========================================
// SAMPLE DATA FALLBACK
// ==========================================
function createSampleWebsites() {
    return [
        {
            id: 1,
            name: "E-Shop Pro",
            category: "E-commerce",
            status: "Live",
            rating: 4.9,
            overview: "Comprehensive e-commerce platform with advanced features and seamless user experience. Preview the storefront and features.",
            launchDate: "2024-02-20",
            userBase: "25K+",
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=E-Shop+Pro",
            features: ["React frontend", "Node.js backend", "Stripe payments", "Admin dashboard"],
            liveUrl: "https://eshoppro.com",
            repositoryUrl: "https://github.com/ArshVermaGit/eshop-pro"
        },
        {
            id: 2,
            name: "HealthTrack Plus",
            category: "Health & Wellness",
            status: "Live",
            rating: 4.8,
            overview: "Comprehensive health tracking platform with AI-powered insights and analytics. Test the dashboard in preview.",
            launchDate: "2024-01-15",
            userBase: "50K+",
            image: "https://via.placeholder.com/400x250/EC4899/FFFFFF?text=HealthTrack+Plus",
            features: ["Vue.js UI", "Python API", "PostgreSQL DB", "Real-time analytics"],
            liveUrl: "https://healthtrackplus.com",
            repositoryUrl: "https://github.com/ArshVermaGit/healthtrack-plus"
        },
        {
            id: 3,
            name: "CloudSuite SaaS",
            category: "SaaS Platform",
            status: "In Development",
            rating: 4.6,
            overview: "All-in-one SaaS platform for business management and team collaboration. Sneak peek at core modules.",
            launchDate: "2024-06-30",
            userBase: "10K+",
            image: "https://via.placeholder.com/400x250/A855F7/FFFFFF?text=CloudSuite+SaaS",
            features: ["Angular framework", "Java Spring", "MySQL integration", "Multi-tenant"],
            repositoryUrl: "https://github.com/ArshVermaGit/cloudsuite-saas"
        },
        {
            id: 4,
            name: "FoodDash Delivery",
            category: "Food Delivery",
            status: "In Development",
            rating: 0,
            overview: "Real-time food delivery app with integrated payments and tracking. Early preview available.",
            launchDate: null,
            userBase: "0",
            image: "https://via.placeholder.com/400x250/10B981/FFFFFF?text=FoodDash",
            features: ["Next.js SSR", "Express server", "Redis caching", "Real-time tracking"],
            liveUrl: null,
            repositoryUrl: null
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================
window.initializeWebsitesPage = initializeWebsitesPage;
window.resetWebsiteFilters = resetWebsiteFilters;
window.viewWebsiteDetails = viewWebsiteDetails;
window.applyWebsiteFilters = applyWebsiteFilters;
window.retryWebsitesLoading = retryWebsitesLoading;

console.log('🌐 Websites portfolio JavaScript loaded successfully!');