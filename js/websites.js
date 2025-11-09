// ==========================================
// WEBSITES PAGE - COMPLETE & PERFECT IMPLEMENTATION
// Handles all website portfolio functionality
// Author: Arsh Verma
// ==========================================

// ==========================================
// GLOBAL STATE
// ==========================================
const WEBSITES_STATE = {
    allWebsites: [],
    filteredWebsites: [],
    currentFilters: {
        category: 'all',
        status: 'all',
        sort: 'newest',
        search: ''
    },
    isLoading: false,
    animationDelay: 100
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Websites page initializing...');
    initializeWebsitesPage();
});

function initializeWebsitesPage() {
    try {
        // 1. Load all websites from data.js
        loadWebsitesData();
        
        // 2. Setup filter controls
        setupWebsiteFilters();
        
        // 3. Setup event listeners
        setupWebsiteEventListeners();
        
        // 4. Update header statistics
        updateHeaderStats();
        
        // 5. Display websites
        displayWebsites(WEBSITES_STATE.allWebsites);
        
        // 6. Hide loading screen
        setTimeout(hideLoadingScreen, 800);
        
        console.log('✅ Websites page initialized successfully');
        console.log(`📊 Loaded ${WEBSITES_STATE.allWebsites.length} websites`);
        
    } catch (error) {
        console.error('❌ Error initializing websites page:', error);
        showNotification('Failed to load websites', 'error');
        hideLoadingScreen();
    }
}

// ==========================================
// DATA LOADING
// ==========================================
function loadWebsitesData() {
    try {
        // Get websites from data.js (using global PORTFOLIO_DATA or window.getWebsites())
        if (typeof window.getWebsites === 'function') {
            WEBSITES_STATE.allWebsites = window.getWebsites();
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.websites) {
            WEBSITES_STATE.allWebsites = PORTFOLIO_DATA.websites;
        } else {
            // Fallback: Create sample data if no data exists
            console.warn('⚠️ No websites data found, using fallback');
            WEBSITES_STATE.allWebsites = createSampleWebsites();
        }
        
        WEBSITES_STATE.filteredWebsites = [...WEBSITES_STATE.allWebsites];
        
        console.log('📦 Websites loaded:', WEBSITES_STATE.allWebsites.length);
        
    } catch (error) {
        console.error('❌ Error loading websites:', error);
        WEBSITES_STATE.allWebsites = [];
        WEBSITES_STATE.filteredWebsites = [];
    }
}

// ==========================================
// DISPLAY WEBSITES
// ==========================================
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
    
    // Generate website cards HTML
    websitesGrid.innerHTML = websites.map(website => createWebsiteCard(website)).join('');
    
    // Setup card interactions
    setupWebsiteCardListeners();
    
    // Animate cards entrance
    animateWebsiteCards();
    
    console.log(`✅ Displayed ${websites.length} websites`);
}

// ==========================================
// CREATE WEBSITE CARD HTML
// ==========================================
function createWebsiteCard(website) {
    const statusClass = website.status.toLowerCase().replace(/\s+/g, '-');
    const starsHTML = generateStars(website.rating);
    
    return `
        <div class="game-card website-card" 
             data-website-id="${website.id}" 
             data-category="${website.category}" 
             data-status="${website.status}" 
             data-rating="${website.rating}">
            
            <!-- Website Image -->
            <div class="game-image">
                <img src="${website.image || 'assets/images/websites/default.jpg'}" 
                     alt="${website.name}"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=${encodeURIComponent(website.name)}'">
                
                <!-- Hover Overlay -->
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
                               aria-label="Visit ${website.name}">
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
            
            <!-- Website Content -->
            <div class="game-content">
                <div class="game-header">
                    <h3 class="game-title">${website.name}</h3>
                    <div class="game-rating">
                        <div class="rating-stars">${starsHTML}</div>
                        <span class="rating-value">${website.rating}</span>
                    </div>
                </div>
                
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
                
                <p class="game-description">${website.overview || website.description || 'A professional web solution with modern design and functionality.'}</p>
                
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
                
                <div class="game-actions">
                    <button class="btn btn-primary btn-view-website" 
                            data-website-id="${website.id}"
                            aria-label="View ${website.name}">
                        <i class="fas fa-info-circle"></i>
                        <span>Learn More</span>
                    </button>
                    ${website.repositoryUrl ? `
                        <a href="${website.repositoryUrl}" 
                           class="btn btn-secondary"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="View ${website.name} source code">
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
// FILTER SETUP
// ==========================================
function setupWebsiteFilters() {
    console.log('🔧 Setting up website filters...');
    
    // Category Filter
    setupCategoryFilter();
    
    // Status Filter
    setupStatusFilter();
    
    // Sort Filter
    setupSortFilter();
    
    console.log('✅ Filters initialized');
}

function setupCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!categoryFilter) return;
    
    // Get unique categories
    const categories = [...new Set(WEBSITES_STATE.allWebsites.map(website => website.category))];
    
    // Clear existing options except "All"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Event listener
    categoryFilter.addEventListener('change', function() {
        WEBSITES_STATE.currentFilters.category = this.value;
        applyWebsiteFilters();
        
        console.log('📂 Category filter changed:', this.value);
    });
}

function setupStatusFilter() {
    const statusFilter = document.getElementById('statusFilter');
    
    if (!statusFilter) return;
    
    statusFilter.addEventListener('change', function() {
        WEBSITES_STATE.currentFilters.status = this.value;
        applyWebsiteFilters();
        
        console.log('📊 Status filter changed:', this.value);
    });
}

function setupSortFilter() {
    const sortFilter = document.getElementById('sortFilter');
    
    if (!sortFilter) return;
    
    sortFilter.addEventListener('change', function() {
        WEBSITES_STATE.currentFilters.sort = this.value;
        applyWebsiteFilters();
        
        console.log('🔄 Sort changed:', this.value);
    });
}

// ==========================================
// APPLY FILTERS
// ==========================================
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
    
    // Apply search filter
    if (WEBSITES_STATE.currentFilters.search) {
        const searchTerm = WEBSITES_STATE.currentFilters.search;
        filtered = filtered.filter(website => 
            website.name.toLowerCase().includes(searchTerm) ||
            (website.overview && website.overview.toLowerCase().includes(searchTerm)) ||
            (website.description && website.description.toLowerCase().includes(searchTerm)) ||
            website.category.toLowerCase().includes(searchTerm) ||
            (website.technologies && website.technologies.some(tech => tech.toLowerCase().includes(searchTerm)))
        );
    }
    
    // Apply sorting
    filtered = sortWebsites(filtered, WEBSITES_STATE.currentFilters.sort);
    
    WEBSITES_STATE.filteredWebsites = filtered;
    displayWebsites(filtered);
    
    console.log(`🎯 Filters applied: ${filtered.length} websites shown`);
}

// ==========================================
// SORT WEBSITES
// ==========================================
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
// RESET FILTERS
// ==========================================
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
    
    // Reapply filters (which will show all websites)
    applyWebsiteFilters();
    
    showNotification('Filters reset successfully', 'success');
}

// ==========================================
// WEBSITE CARD INTERACTIONS
// ==========================================
function setupWebsiteCardListeners() {
    // View Details Buttons
    document.querySelectorAll('.btn-view-details, .btn-view-website').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const websiteId = this.getAttribute('data-website-id');
            viewWebsiteDetails(websiteId);
        });
    });
    
    // Visit Site Buttons (prevent default behavior setup)
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
// EVENT LISTENERS
// ==========================================
function setupWebsiteEventListeners() {
    // Window resize handler
    window.addEventListener('resize', debounce(function() {
        // Reattach listeners if needed
        setupWebsiteCardListeners();
    }, 250));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'R' to reset filters
        if (e.key === 'r' || e.key === 'R') {
            if (!e.target.matches('input, textarea')) {
                resetWebsiteFilters();
            }
        }
    });
    
    console.log('✅ Event listeners initialized');
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================
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
// HEADER STATISTICS
// ==========================================
function updateHeaderStats() {
    const allWebsites = WEBSITES_STATE.allWebsites;
    
    if (allWebsites.length === 0) return;
    
    // Calculate statistics
    const totalWebsites = allWebsites.length;
    const averageRating = (allWebsites.reduce((sum, website) => sum + website.rating, 0) / totalWebsites).toFixed(1);
    const totalUsers = allWebsites.reduce((sum, website) => sum + parseUserBase(website.userBase || '0'), 0);
    
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
// ANIMATIONS
// ==========================================
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
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return 'N/A';
    
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

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

function showNotification(message, type = 'info') {
    // Use global notification function if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
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
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
// SAMPLE DATA FALLBACK
// ==========================================
function createSampleWebsites() {
    return [
        {
            id: 1,
            name: "E-Shop Pro",
            category: "E-commerce",
            status: "Live",
            rating: 4.8,
            overview: "A modern e-commerce platform with advanced features and seamless user experience.",
            launchDate: "2024-01-15",
            userBase: "50K+",
            pageViews: 250000,
            conversionRate: 3.2,
            loadTime: 1.8,
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=E-Shop+Pro",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
            liveUrl: "https://example-eshop.com",
            repositoryUrl: "https://github.com/ArshVermaGit/eshop-pro"
        },
        {
            id: 2,
            name: "HealthTrack Plus",
            category: "Health & Wellness",
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
// ==========================================
window.initializeWebsitesPage = initializeWebsitesPage;
window.resetWebsiteFilters = resetWebsiteFilters;
window.viewWebsiteDetails = viewWebsiteDetails;
window.applyWebsiteFilters = applyWebsiteFilters;

// ==========================================
// AUTO-INITIALIZE
// ==========================================
console.log('✅ Websites.js loaded successfully');