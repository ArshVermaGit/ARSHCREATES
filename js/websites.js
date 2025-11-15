// ==========================================
// WEBSITES PORTFOLIO - PERFECTED JAVASCRIPT
// Author: Arsh Verma
// Version: 6.0.0 - Production Ready
// Description: Complete, bug-free websites portfolio
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
    animationDelay: 100
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Initializing Websites Portfolio...');
    initializeWebsitesPage();
});

/**
 * Main initialization function
 */
function initializeWebsitesPage() {
    try {
        // Initialize theme first
        initializeTheme();
        
        WEBSITES_STATE.isLoading = true;
        showLoadingState();
        
        // Load websites data
        loadWebsitesData();
        
        // Setup UI components
        setupWebsiteFilters();
        setupWebsiteEventListeners();
        updateHeaderStats();
        
        // Display websites after delay for smooth UX
        setTimeout(() => {
            WEBSITES_STATE.isLoading = false;
            applyFilters();
            hideLoadingState();
            console.log('✅ Websites portfolio initialized');
        }, 600);
        
    } catch (error) {
        console.error('❌ Error initializing:', error);
        showNotification('Failed to load websites portfolio. Please refresh.', 'error');
        WEBSITES_STATE.isLoading = false;
        displayErrorState();
    }
}

// ==========================================
// THEME MANAGEMENT
// ==========================================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        // Get theme from localStorage or default to system preference
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log(`🎨 Theme initialized: ${savedTheme}`);
        
    } catch (error) {
        console.error('❌ Theme error:', error);
        // Fallback to light theme
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('#themeToggle .theme-icon i');
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log(`🎨 Theme toggled: ${newTheme}`);
        
    } catch (error) {
        console.error('❌ Theme toggle error:', error);
    }
}

// ==========================================
// WEBSITE DATA LOADING
// ==========================================
function loadWebsitesData() {
    try {
        let websitesData = [];
        
        // Try multiple data sources
        if (typeof window.getWebsites === 'function') {
            websitesData = window.getWebsites();
            console.log('📥 Loaded from getWebsites():', websitesData.length);
        } else if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.websites)) {
            websitesData = window.PORTFOLIO_DATA.websites;
            console.log('📥 Loaded from PORTFOLIO_DATA:', websitesData.length);
        } else {
            websitesData = createSampleWebsites();
            console.log('📥 Using sample data:', websitesData.length);
        }
        
        // Validate and assign
        WEBSITES_STATE.allWebsites = validateWebsitesData(websitesData);
        WEBSITES_STATE.filteredWebsites = [...WEBSITES_STATE.allWebsites];
        
        console.log('🌐 Websites loaded:', WEBSITES_STATE.allWebsites.length);
        
    } catch (error) {
        console.error('❌ Error loading websites:', error);
        WEBSITES_STATE.allWebsites = createSampleWebsites();
        WEBSITES_STATE.filteredWebsites = [...WEBSITES_STATE.allWebsites];
    }
}

/**
 * Validate websites data structure
 */
function validateWebsitesData(websites) {
    if (!Array.isArray(websites)) {
        console.warn('⚠️ Invalid websites data: expected array');
        return [];
    }
    
    return websites.map((website, index) => ({
        id: website.id || `website-${Date.now()}-${index}`,
        name: (website.name || 'Untitled Website').trim(),
        category: website.category || 'Uncategorized',
        status: website.status || 'In Development',
        overview: website.overview || website.description || 'A modern web solution built with cutting-edge technology.',
        launchDate: website.launchDate || null,
        rating: Math.min(5, Math.max(0, website.rating || 0)),
        userBase: website.userBase || '0',
        image: website.image || generatePlaceholderImage(website.name || 'Website'),
        features: Array.isArray(website.features) ? website.features.slice(0, 5) : 
                  ['Modern Design', 'Responsive Layout', 'Fast Performance'],
        repositoryUrl: website.repositoryUrl || null,
        liveUrl: website.liveUrl || null,
        technologies: website.technologies || ['HTML5', 'CSS3', 'JavaScript'],
        screenshots: website.screenshots || []
    })).filter(website => website.id && website.name);
}

/**
 * Generate placeholder image URL
 */
function generatePlaceholderImage(name) {
    const encodedName = encodeURIComponent(name.substring(0, 20));
    return `https://via.placeholder.com/600x350/1A1A2E/3B82F6?text=${encodedName}`;
}

// ==========================================
// UI LOADING STATES
// ==========================================

/**
 * Show loading state
 */
function showLoadingState() {
    const websitesGrid = document.getElementById('websitesGrid');
    if (websitesGrid) {
        websitesGrid.innerHTML = `
            <div class="loading-websites">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing websites...</p>
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
        loadingElement.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
            if (loadingElement.parentNode) {
                loadingElement.remove();
            }
        }, 400);
    }
}

/**
 * Display error state
 */
function displayErrorState() {
    const websitesGrid = document.getElementById('websitesGrid');
    if (websitesGrid) {
        websitesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Websites</h3>
                <p>There was an error loading the websites portfolio.</p>
                <button class="btn btn-primary" onclick="retryLoading()">
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
function retryLoading() {
    showNotification('Retrying to load websites...', 'info');
    initializeWebsitesPage();
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
        console.error('❌ Websites grid not found');
        return;
    }
    
    websitesGrid.innerHTML = '';
    
    if (WEBSITES_STATE.isLoading) {
        showLoadingState();
        return;
    }
    
    if (!websites || websites.length === 0) {
        websitesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-laptop-code"></i>
                <h3>No Websites Found</h3>
                <p>No websites match your current filters. Try adjusting them to see more.</p>
                <button class="btn btn-primary" onclick="resetFilters()">
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
        
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(30px)';
        cardElement.style.animationDelay = `${index * WEBSITES_STATE.animationDelay}ms`;
        
        websitesGrid.appendChild(cardElement);
        
        setTimeout(() => {
            cardElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            cardElement.style.opacity = '1';
            cardElement.style.transform = 'translateY(0)';
        }, index * WEBSITES_STATE.animationDelay);
    });
    
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
    const shortOverview = (website.overview || '').length > 120 
        ? website.overview.substring(0, 120) + '...' 
        : website.overview;
    
    return `
        <article class="website-card" 
                 data-website-id="${website.id}" 
                 data-category="${website.category}" 
                 data-status="${website.status}"
                 role="article"
                 tabindex="0">
            
            <div class="website-image">
                <img src="${website.image}" 
                     alt="${website.name} - Website preview"
                     loading="lazy"
                     onerror="this.src='${generatePlaceholderImage(website.name)}'">
                
                <div class="website-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-view-details" 
                                data-website-id="${website.id}">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${website.status === 'Live' && website.liveUrl ? `
                            <button class="btn btn-visit-now" 
                                    data-website-id="${website.id}">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Visit Live</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="website-status-badge status-${statusClass}">
                    ${website.status}
                </div>
            </div>
            
            <div class="website-content">
                <header class="website-header">
                    <h3 class="website-title">${website.name}</h3>
                    ${website.rating > 0 ? `
                        <div class="website-rating">
                            <div class="rating-stars">${generateStars(website.rating)}</div>
                            <span class="rating-value">${website.rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                </header>
                
                <div class="website-meta">
                    <span class="website-category">
                        <i class="fas fa-tag"></i>
                        ${website.category}
                    </span>
                    ${website.launchDate ? `
                        <span class="website-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(website.launchDate)}
                        </span>
                    ` : ''}
                </div>
                
                <p class="website-description">${escapeHtml(shortOverview)}</p>
                
                ${website.features && website.features.length > 0 ? `
                    <div class="website-features">
                        ${website.features.slice(0, 3).map(feature => `
                            <span class="website-feature">
                                <i class="fas fa-check"></i>
                                ${escapeHtml(feature)}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="website-actions">
                    <button class="btn btn-primary btn-view-website" 
                            data-website-id="${website.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>Learn More</span>
                    </button>
                    ${website.repositoryUrl ? `
                        <a href="${website.repositoryUrl}" 
                           class="btn btn-secondary"
                           target="_blank"
                           rel="noopener noreferrer">
                            <i class="fab fa-github"></i>
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
    const resetButton = document.getElementById('resetFilters');
    
    if (!categoryFilter || !statusFilter || !sortFilter || !resetButton) {
        console.warn('⚠️ Filter elements not found');
        return;
    }
    
    // Populate categories dynamically
    const categories = [...new Set(WEBSITES_STATE.allWebsites.map(w => w.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Event listeners
    function handleFilterChange() {
        WEBSITES_STATE.currentFilters.category = categoryFilter.value;
        WEBSITES_STATE.currentFilters.status = statusFilter.value;
        WEBSITES_STATE.currentFilters.sort = sortFilter.value;
        applyFilters();
    }
    
    categoryFilter.addEventListener('change', handleFilterChange);
    statusFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    resetButton.addEventListener('click', resetFilters);
    
    console.log('✅ Filters setup completed');
}

/**
 * Apply all active filters and sorting
 */
function applyFilters() {
    if (WEBSITES_STATE.isLoading) return;
    
    let filtered = [...WEBSITES_STATE.allWebsites];
    
    // Category filter
    if (WEBSITES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(w => w.category === WEBSITES_STATE.currentFilters.category);
    }
    
    // Status filter
    if (WEBSITES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(w => w.status === WEBSITES_STATE.currentFilters.status);
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
 * Sort websites by criteria
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
 * Reset all filters
 */
function resetFilters() {
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
    
    applyFilters();
    showNotification('Filters reset successfully', 'success');
}

// ==========================================
// EVENT HANDLERS
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
            resetFilters();
        }
    });
}

/**
 * Setup website card listeners
 */
function setupWebsiteCardListeners() {
    // View details buttons
    document.querySelectorAll('.btn-view-details, .btn-view-website').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const websiteId = this.getAttribute('data-website-id');
            buttonClickAnimation(this);
            viewWebsiteDetails(websiteId);
        });
    });
    
    // Visit now buttons
    document.querySelectorAll('.btn-visit-now').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const websiteId = this.getAttribute('data-website-id');
            buttonClickAnimation(this);
            visitWebsite(websiteId);
        });
    });
    
    // Card click
    document.querySelectorAll('.website-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const websiteId = this.getAttribute('data-website-id');
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
    });
}

/**
 * Button click animation
 */
function buttonClickAnimation(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
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
        showNotification('Website not found', 'error');
        return;
    }
    
    console.log(`🔍 Viewing: ${website.name}`);
    window.location.href = `website-detail.html?id=${websiteId}`;
}

/**
 * Visit website functionality
 */
function visitWebsite(websiteId) {
    if (!websiteId) {
        showNotification('Invalid website selection', 'error');
        return;
    }
    
    const website = WEBSITES_STATE.allWebsites.find(w => w.id == websiteId);
    if (!website) {
        showNotification('Website not found', 'error');
        return;
    }
    
    if (website.status !== 'Live' || !website.liveUrl) {
        showNotification(`${website.name} is not available for live preview!`, 'info');
        return;
    }
    
    console.log(`🌐 Visiting: ${website.name}`);
    window.open(website.liveUrl, '_blank', 'noopener,noreferrer');
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
    
    for (let i = 0; i < fullStars + (hasFullExtra ? 1 : 0); i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
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
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'Coming Soon';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Coming Soon';
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (error) {
        return 'Coming Soon';
    }
}

/**
 * Update header statistics
 */
function updateHeaderStats() {
    const allWebsites = WEBSITES_STATE.allWebsites;
    if (allWebsites.length === 0) return;
    
    const totalWebsites = allWebsites.length;
    const avgRating = (allWebsites.reduce((sum, w) => sum + (w.rating || 0), 0) / totalWebsites).toFixed(1);
    const totalUsers = allWebsites.reduce((sum, w) => sum + parseUserBase(w.userBase || '0'), 0);
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        animateValue(statNumbers[0], 0, totalWebsites, 1500, '+');
        animateValue(statNumbers[1], 0, parseFloat(avgRating), 1500, '');
        animateValue(statNumbers[2], 0, totalUsers, 1500, '+');
    }
}

/**
 * Animate number counting
 */
function animateValue(element, start, end, duration, suffix = '') {
    if (!element) return;
    
    const range = Math.abs(end - start);
    const stepTime = Math.max(Math.floor(duration / range), 20);
    const isDecimal = end % 1 !== 0;
    let current = start;
    
    const timer = setInterval(() => {
        current += (end > start ? 1 : -1) * (isDecimal ? 0.1 : 1);
        
        if ((end > start && current >= end) || (end < start && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, stepTime);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 3000) {
    try {
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 6rem;
                right: 1.5rem;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-message">${escapeHtml(message)}</div>
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
                    notification.remove();
                }
            }, 300);
        }, duration);
        
    } catch (error) {
        console.error('❌ Notification error:', error);
    }
}

/**
 * Escape HTML to prevent XSS
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

// ==========================================
// SAMPLE DATA FALLBACK
// ==========================================
function createSampleWebsites() {
    return [
        {
            id: 1,
            name: "ReelSpot",
            overview: "Modern social media downloader with advanced features and seamless UX",
            description: "ReelSpot is a comprehensive social media content downloader that allows users to save their favorite videos, images, and reels from multiple platforms. Built with modern web technologies, it features a clean interface, fast processing, and support for multiple formats. The platform prioritizes user privacy and doesn't require login for most features.",
            image: "static/images/websites/ReelSpot/ReelSpot.jpg",
            category: "Media Downloader",
            rating: 4.8,
            status: "Live",
            launchDate: "2023-10-25",
            developmentTime: "3 months",
            userBase: "50K+",
            pageLoadTime: "1.2s",
            mobileResponsive: true,
            technologies: ["HTML5", "CSS3", "JavaScript"],
            features: [
                "Multi-platform support (Instagram, Facebook, Twitter)",
                "High-quality video downloads",
                "Batch download capability",
                "No watermarks",
                "Format conversion options",
                "Privacy-focused design"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/REELSPOT",
            liveUrl: "file:///Users/arshverma/GitHub/REELSPOT/index.html",
            screenshots: [
                "static/images/websites/ReelSpot/1.jpg",
                "static/images/websites/ReelSpot/2.jpg",
                "static/images/websites/ReelSpot/3.jpg",
                "static/images/websites/ReelSpot/4.jpg"
            ]
        },
        {
            id: 2,
            name: "E-Shop Pro",
            category: "E-commerce",
            status: "Live",
            rating: 4.9,
            overview: "Comprehensive e-commerce platform with advanced features and seamless user experience.",
            description: "Built with modern web technologies and optimized for performance. Features include advanced product filtering, secure payment processing, admin dashboard, and mobile-responsive design.",
            launchDate: "2024-02-20",
            developmentTime: "3 months",
            userBase: "25K+",
            performance: "99.8",
            features: [
                "React frontend with modern UI",
                "Node.js backend with Express",
                "MongoDB database integration",
                "Stripe payment processing",
                "Admin dashboard with analytics",
                "Mobile-responsive design"
            ],
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express", "JWT"],
            repositoryUrl: "https://github.com/ArshVermaGit/eshop-pro",
            liveUrl: "https://eshoppro.com",
            image: "https://via.placeholder.com/600x350/1A1A2E/3B82F6?text=E-Shop+Pro",
            screenshots: [
                "https://via.placeholder.com/800x450/1A1A2E/3B82F6?text=E-Shop+Pro+1",
                "https://via.placeholder.com/800x450/1A1A2E/3B82F6?text=E-Shop+Pro+2"
            ]
        },
        {
            id: 3,
            name: "HealthTrack Plus",
            category: "Health & Wellness",
            status: "Live",
            rating: 4.8,
            overview: "Comprehensive health tracking platform with AI-powered insights and analytics. Modern design with focus on user experience and data visualization.",
            launchDate: "2024-01-15",
            userBase: "50K+",
            image: "https://via.placeholder.com/600x350/1A1A2E/EC4899?text=HealthTrack+Plus",
            features: ["Vue.js UI", "Python API", "PostgreSQL DB", "Real-time analytics", "Progressive Web App"],
            technologies: ["Vue.js", "Python", "PostgreSQL", "D3.js"],
            repositoryUrl: "https://github.com/ArshVermaGit/healthtrack-plus",
            liveUrl: "https://healthtrackplus.com",
            screenshots: [
                "https://via.placeholder.com/800x450/1A1A2E/EC4899?text=HealthTrack+1",
                "https://via.placeholder.com/800x450/1A1A2E/EC4899?text=HealthTrack+2"
            ]
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================
window.initializeWebsitesPage = initializeWebsitesPage;
window.resetFilters = resetFilters;
window.viewWebsiteDetails = viewWebsiteDetails;
window.visitWebsite = visitWebsite;
window.applyFilters = applyFilters;
window.retryLoading = retryLoading;

console.log('🌐 Websites portfolio JavaScript loaded!');