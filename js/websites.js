// ==========================================
// WEBSITES PAGE - Complete Implementation
// Author: Arsh Verma
// Version: 2.0.0
// Description: Handles all websites portfolio functionality
// ==========================================

'use strict';

// Global state management
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Websites page initializing...');
    initializeWebsitesPage();
});

/**
 * Main initialization function
 */
function initializeWebsitesPage() {
    try {
        loadWebsitesData();
        setupWebsiteFilters();
        setupWebsiteEventListeners();
        updateHeaderStats();
        displayWebsites(WEBSITES_STATE.allWebsites);
        
        setTimeout(hideLoadingScreen, 800);
        console.log('✅ Websites page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing websites page:', error);
        showNotification('Failed to load websites. Please refresh the page.', 'error');
        hideLoadingScreen();
    }
}

/**
 * Load websites data from data source
 */
function loadWebsitesData() {
    try {
        if (typeof window.getWebsites === 'function') {
            WEBSITES_STATE.allWebsites = window.getWebsites();
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.websites) {
            WEBSITES_STATE.allWebsites = PORTFOLIO_DATA.websites;
        } else {
            console.warn('⚠️ No websites data found, using sample data');
            WEBSITES_STATE.allWebsites = createSampleWebsites();
        }
        
        WEBSITES_STATE.filteredWebsites = [...WEBSITES_STATE.allWebsites];
        console.log(`📦 Loaded ${WEBSITES_STATE.allWebsites.length} websites`);
    } catch (error) {
        console.error('❌ Error loading websites:', error);
        WEBSITES_STATE.allWebsites = [];
        WEBSITES_STATE.filteredWebsites = [];
    }
}

/**
 * Display websites in the grid
 */
function displayWebsites(websites) {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) return;
    
    if (WEBSITES_STATE.isLoading) {
        websitesGrid.innerHTML = `
            <div class="loading-websites">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing websites...</p>
            </div>
        `;
        return;
    }
    
    if (!websites || websites.length === 0) {
        websitesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-laptop-code"></i>
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
    
    websitesGrid.innerHTML = websites.map(website => createWebsiteCard(website)).join('');
    setupWebsiteCardListeners();
    animateWebsiteCards();
}

/**
 * Create HTML for website card
 */
function createWebsiteCard(website) {
    const statusClass = website.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = website.image || `https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=${encodeURIComponent(website.name)}`;
    
    return `
        <div class="website-card" 
             data-website-id="${website.id}" 
             data-category="${website.category}" 
             data-status="${website.status}">
            
            <div class="website-image">
                <img src="${imageUrl}" 
                     alt="${website.name}"
                     loading="lazy">
                
                <div class="website-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-primary btn-view-details" 
                                data-website-id="${website.id}">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${website.liveUrl ? `
                            <a href="${website.liveUrl}" 
                               class="btn btn-secondary btn-visit-site"
                               target="_blank"
                               rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Visit Site</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <div class="website-badge status-${statusClass}">${website.status}</div>
                <div class="category-badge">
                    <i class="fas fa-tag"></i>
                    ${website.category}
                </div>
            </div>
            
            <div class="website-content">
                <div class="website-header">
                    <h3 class="website-title">${website.name}</h3>
                    <div class="website-rating">
                        <div class="rating-stars">${generateStars(website.rating)}</div>
                        <span class="rating-value">${website.rating}</span>
                    </div>
                </div>
                
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
                
                <p class="website-description">${website.overview || website.description || 'A professional web solution with modern design and functionality.'}</p>
                
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
                </div>
                
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
        </div>
    `;
}

/**
 * Setup filter controls
 */
function setupWebsiteFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    // Populate category filter
    if (categoryFilter) {
        const categories = [...new Set(WEBSITES_STATE.allWebsites.map(website => website.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        categoryFilter.addEventListener('change', function() {
            WEBSITES_STATE.currentFilters.category = this.value;
            applyWebsiteFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            WEBSITES_STATE.currentFilters.status = this.value;
            applyWebsiteFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            WEBSITES_STATE.currentFilters.sort = this.value;
            applyWebsiteFilters();
        });
    }
}

/**
 * Apply all active filters
 */
function applyWebsiteFilters() {
    let filtered = [...WEBSITES_STATE.allWebsites];
    
    // Category filter
    if (WEBSITES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(website => 
            website.category === WEBSITES_STATE.currentFilters.category
        );
    }
    
    // Status filter
    if (WEBSITES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(website => 
            website.status === WEBSITES_STATE.currentFilters.status
        );
    }
    
    // Apply sorting
    filtered = sortWebsites(filtered, WEBSITES_STATE.currentFilters.sort);
    
    WEBSITES_STATE.filteredWebsites = filtered;
    displayWebsites(filtered);
}

/**
 * Sort websites by criteria
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

/**
 * Reset all filters
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
    showNotification('Filters reset successfully', 'success');
}

/**
 * Setup event listeners
 */
function setupWebsiteEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select')) return;
        
        if (e.key === 'r' || e.key === 'R') {
            resetWebsiteFilters();
        }
    });
}

/**
 * Setup card interactions
 */
function setupWebsiteCardListeners() {
    // View details buttons
    document.querySelectorAll('.btn-view-details, .btn-view-website').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const websiteId = this.getAttribute('data-website-id');
            viewWebsiteDetails(websiteId);
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
        
        // Hover effects
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
}

/**
 * Navigate to website details
 */
function viewWebsiteDetails(websiteId) {
    if (!websiteId) {
        showNotification('Invalid website ID', 'error');
        return;
    }
    window.location.href = `website-detail.html?id=${websiteId}`;
}

/**
 * Update header statistics
 */
function updateHeaderStats() {
    const allWebsites = WEBSITES_STATE.allWebsites;
    if (allWebsites.length === 0) return;
    
    const totalWebsites = allWebsites.length;
    const averageRating = (
        allWebsites.reduce((sum, website) => sum + website.rating, 0) / totalWebsites
    ).toFixed(1);
    const totalUsers = allWebsites.reduce(
        (sum, website) => sum + parseUserBase(website.userBase || '0'), 0
    );
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalWebsites}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalUsers) + '+';
    }
}

/**
 * Animate cards entrance
 */
function animateWebsiteCards() {
    const cards = document.querySelectorAll('.website-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * WEBSITES_STATE.animationDelay);
    });
}

/**
 * Hide loading screen
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
// UTILITY FUNCTIONS
// ==========================================

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    for (let i = 0; i < fullStars; i++) {
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

function parseUserBase(userBase) {
    if (!userBase || typeof userBase !== 'string') return 0;
    const numStr = userBase.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return 0;
    
    const upperCase = userBase.toUpperCase();
    if (upperCase.includes('M')) {
        return num * 1000000;
    } else if (upperCase.includes('K')) {
        return num * 1000;
    }
    return num;
}

function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return 'N/A';
    }
}

function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
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
            overview: "Comprehensive e-commerce platform with advanced features and seamless user experience.",
            launchDate: "2024-02-20",
            userBase: "25K+",
            pageViews: 180000,
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=E-Shop+Pro",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            liveUrl: "https://eshoppro.com",
            repositoryUrl: "https://github.com/ArshVermaGit/eshop-pro"
        },
        {
            id: 2,
            name: "HealthTrack Plus",
            category: "Health & Wellness",
            status: "Live",
            rating: 4.8,
            overview: "Comprehensive health tracking platform with AI-powered insights and analytics.",
            launchDate: "2024-01-15",
            userBase: "50K+",
            pageViews: 250000,
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=HealthTrack+Plus",
            technologies: ["Vue.js", "Python", "PostgreSQL", "Django"],
            liveUrl: "https://healthtrackplus.com"
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
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=CloudSuite+SaaS",
            technologies: ["Angular", "Java", "MySQL", "Spring Boot"]
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

console.log('✅ Websites.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔧 Version: 2.0.0');