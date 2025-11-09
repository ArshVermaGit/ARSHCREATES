// ==========================================
// APPS PAGE - Complete Mobile Apps Portfolio Functionality
// Handles filtering, sorting, searching, and app display
// Version: 1.0.0 | Author: Arsh Verma
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
let searchTimeout = null;          // Search debounce timeout

// ==========================================
// PAGE INITIALIZATION
// ==========================================

/**
 * Initialize the apps portfolio page
 * - Loads app data
 * - Sets up filters and event listeners
 * - Updates header statistics
 * - Handles loading screen
 * @author Arsh Verma
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
 * @author Arsh Verma
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Focus on main content for accessibility
            const mainContent = document.querySelector('.apps-section');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
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
 * @author Arsh Verma
 */
function loadApps() {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) {
        console.error('Apps grid element not found!');
        return;
    }
    
    try {
        // Get apps from data.js (check if function exists)
        if (typeof getApps === 'function') {
            allApps = getApps();
        } else {
            // Fallback to sample data if data.js not available
            allApps = getSampleApps();
        }
        
        currentApps = [...allApps];
        
        console.log('Loaded apps:', allApps.length);
        
        // Handle empty data
        if (allApps.length === 0) {
            console.warn('No apps found in portfolio data');
            appsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-mobile-alt" aria-hidden="true"></i>
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
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <h3>Error Loading Apps</h3>
                <p>Please refresh the page to try again.</p>
            </div>
        `;
    }
}

/**
 * Get sample apps for demonstration
 * Used when data.js is not available
 * @returns {Array} Sample app objects
 * @author Arsh Verma
 */
function getSampleApps() {
    return [
        {
            id: 1,
            name: "TaskMaster Pro",
            platform: "Cross-Platform",
            category: "Productivity",
            status: "Live",
            rating: 4.8,
            description: "Advanced task management app with AI-powered prioritization and team collaboration features.",
            image: "https://via.placeholder.com/400x250/22C55E/FFFFFF?text=TaskMaster+Pro",
            storeUrl: "#",
            downloadCount: "100K+",
            launchDate: "2024-01-15",
            technologies: ["React Native", "Firebase", "AI/ML", "Push Notifications"],
            features: ["Smart Prioritization", "Team Collaboration", "Voice Commands", "Dark Mode"]
        },
        {
            id: 2,
            name: "FitTrack",
            platform: "iOS",
            category: "Health & Fitness",
            status: "Live",
            rating: 4.6,
            description: "Comprehensive fitness tracking app with workout plans, nutrition tracking, and progress analytics.",
            image: "https://via.placeholder.com/400x250/10B981/FFFFFF?text=FitTrack",
            storeUrl: "#",
            downloadCount: "250K+",
            launchDate: "2023-11-20",
            technologies: ["Swift", "HealthKit", "CoreData", "Charts"],
            features: ["Workout Plans", "Nutrition Tracking", "Progress Analytics", "Apple Watch"]
        },
        {
            id: 3,
            name: "ShopEasy",
            platform: "Android",
            category: "E-commerce",
            status: "Live",
            rating: 4.7,
            description: "Modern e-commerce platform with AR product preview, one-click checkout, and personalized recommendations.",
            image: "https://via.placeholder.com/400x250/84CC16/FFFFFF?text=ShopEasy",
            storeUrl: "#",
            downloadCount: "500K+",
            launchDate: "2023-09-10",
            technologies: ["Kotlin", "ARCore", "Stripe", "ML Kit"],
            features: ["AR Preview", "One-Click Checkout", "Wishlist", "Order Tracking"]
        },
        {
            id: 4,
            name: "LearnHub",
            platform: "Cross-Platform",
            category: "Education",
            status: "Beta",
            rating: 4.5,
            description: "Interactive learning platform with video courses, quizzes, and progress tracking for students.",
            image: "https://via.placeholder.com/400x250/F59E0B/FFFFFF?text=LearnHub",
            downloadCount: "50K+",
            launchDate: "2024-03-01",
            technologies: ["Flutter", "Firebase", "Video Streaming", "Analytics"],
            features: ["Video Courses", "Interactive Quizzes", "Certificates", "Offline Mode"]
        },
        {
            id: 5,
            name: "MoneyWise",
            platform: "iOS",
            category: "Finance",
            status: "In Development",
            rating: 0,
            description: "Smart financial management app with budget tracking, investment insights, and expense categorization.",
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=MoneyWise",
            launchDate: "2024-12-01",
            technologies: ["SwiftUI", "Core Data", "Charts", "Secure Enclave"],
            features: ["Budget Tracking", "Investment Insights", "Bill Reminders", "Bank Sync"]
        },
        {
            id: 6,
            name: "FoodDelight",
            platform: "Android",
            category: "Food & Drink",
            status: "Live",
            rating: 4.9,
            description: "Food delivery app with real-time tracking, restaurant reviews, and exclusive deals.",
            image: "https://via.placeholder.com/400x250/EF4444/FFFFFF?text=FoodDelight",
            storeUrl: "#",
            downloadCount: "1M+",
            launchDate: "2023-06-15",
            technologies: ["Kotlin", "Google Maps", "Firebase", "Payment Gateway"],
            features: ["Real-time Tracking", "Restaurant Reviews", "Deals", "Schedule Orders"]
        }
    ];
}

// ==========================================
// APP DISPLAY
// ==========================================

/**
 * Display apps in the grid
 * @param {Array} apps - Array of app objects to display
 * @author Arsh Verma
 */
function displayApps(apps) {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return;
    
    // Handle no results
    if (apps.length === 0) {
        appsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" aria-hidden="true"></i>
                <h3>No Apps Found</h3>
                <p>No apps match your current filters</p>
                <button class="btn btn-primary" onclick="resetAppFilters()">
                    <i class="fas fa-redo" aria-hidden="true"></i>
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
    
    // Update results count
    updateResultsCount(apps.length);
    
    console.log(`Displayed ${apps.length} apps`);
}

/**
 * Create HTML for a single app card
 * @param {Object} app - App object
 * @returns {string} HTML string for the card
 * @author Arsh Verma
 */
function createAppCard(app) {
    const statusClass = app.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = app.image || `https://via.placeholder.com/400x250/22C55E/FFFFFF?text=${encodeURIComponent(app.name)}`;
    
    return `
        <div class="app-card" 
             data-app-id="${app.id}" 
             data-platform="${app.platform}" 
             data-category="${app.category}" 
             data-status="${app.status}" 
             data-rating="${app.rating}"
             role="listitem"
             tabindex="0">
            
            <!-- App Image with Overlay -->
            <div class="app-image">
                <img src="${imageUrl}" 
                     alt="${escapeHtml(app.name)} mobile app screenshot" 
                     loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x250/22C55E/FFFFFF?text=${encodeURIComponent(app.name)}'">
                
                <!-- Hover Overlay -->
                <div class="app-overlay">
                    <div class="overlay-content">
                        <a href="app-detail.html?id=${app.id}" 
                           class="view-details-btn"
                           onclick="event.stopPropagation();"
                           aria-label="View details for ${escapeHtml(app.name)}">
                            <i class="fas fa-eye" aria-hidden="true"></i>
                            <span>View Details</span>
                        </a>
                        ${app.storeUrl ? `
                            <a href="${app.storeUrl}" 
                               class="download-btn"
                               target="_blank"
                               rel="noopener noreferrer"
                               onclick="event.stopPropagation();"
                               aria-label="Download ${escapeHtml(app.name)}">
                                <i class="fas fa-download" aria-hidden="true"></i>
                                <span>Download</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Status Badge -->
                <div class="app-badge status-${statusClass}" aria-label="App status: ${app.status}">
                    ${app.status}
                </div>
                
                <!-- Platform Badge -->
                <div class="platform-badge" aria-label="Platform: ${app.platform}">
                    ${getPlatformIcon(app.platform)}
                    <span>${app.platform}</span>
                </div>
            </div>
            
            <!-- App Content -->
            <div class="app-content">
                <div class="app-header">
                    <h3 class="app-title">${escapeHtml(app.name)}</h3>
                    ${app.rating > 0 ? `
                        <div class="app-rating" aria-label="Rating: ${app.rating} out of 5 stars">
                            <div class="rating-stars">${generateStars(app.rating)}</div>
                            <span class="rating-value">${app.rating}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Platform Display -->
                <div class="app-platform">
                    ${getPlatformIcon(app.platform)}
                    <span>${app.platform}</span>
                </div>
                
                <!-- Brief Description -->
                ${app.description ? `
                    <p class="app-description">${escapeHtml(truncateText(app.description, 120))}</p>
                ` : ''}
                
                <!-- Quick Stats -->
                ${(app.downloadCount || app.launchDate) ? `
                    <div class="app-stats">
                        ${app.downloadCount ? `
                            <div class="app-stat">
                                <span class="app-stat-value">${app.downloadCount}</span>
                                <span class="app-stat-label">Downloads</span>
                            </div>
                        ` : ''}
                        ${app.launchDate ? `
                            <div class="app-stat">
                                <span class="app-stat-value">${formatDate(app.launchDate)}</span>
                                <span class="app-stat-label">Launched</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <!-- Technologies Used -->
                ${app.technologies && app.technologies.length > 0 ? `
                    <div class="app-features">
                        ${app.technologies.slice(0, 4).map(tech => 
                            `<span class="app-feature">${escapeHtml(tech)}</span>`
                        ).join('')}
                        ${app.technologies.length > 4 ? 
                            `<span class="app-feature more">+${app.technologies.length - 4}</span>` 
                            : ''}
                    </div>
                ` : ''}
                
                <!-- App Actions -->
                <div class="app-actions">
                    <a href="app-detail.html?id=${app.id}" class="btn btn-secondary" aria-label="View details for ${escapeHtml(app.name)}">
                        <i class="fas fa-info-circle" aria-hidden="true"></i>
                        <span>Details</span>
                    </a>
                    ${app.storeUrl ? `
                        <a href="${app.storeUrl}" class="btn btn-app" target="_blank" rel="noopener noreferrer" aria-label="Download ${escapeHtml(app.name)}">
                            <i class="fas fa-download" aria-hidden="true"></i>
                            <span>Download</span>
                        </a>
                    ` : `
                        <button class="btn btn-app" disabled aria-label="${escapeHtml(app.name)} coming soon">
                            <i class="fas fa-clock" aria-hidden="true"></i>
                            <span>Coming Soon</span>
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

/**
 * Get platform icon based on platform name
 * @param {string} platform - Platform name
 * @returns {string} Icon HTML
 * @author Arsh Verma
 */
function getPlatformIcon(platform) {
    if (platform.includes('iOS') || platform.includes('iPhone')) {
        return '<i class="fab fa-apple" aria-hidden="true"></i>';
    } else if (platform.includes('Android')) {
        return '<i class="fab fa-android" aria-hidden="true"></i>';
    } else if (platform === 'Cross-Platform') {
        return '<i class="fas fa-mobile-alt" aria-hidden="true"></i>';
    }
    return '<i class="fas fa-mobile-alt" aria-hidden="true"></i>';
}

// ==========================================
// FILTER FUNCTIONALITY
// ==========================================

/**
 * Setup filter controls and event listeners
 * @author Arsh Verma
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
            showNotification(`Filtered by platform: ${selectedText}`, 'info');
            console.log('Platform filter changed:', this.value);
        });
    }
    
    // Category Filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyAppFilters();
            showNotification(`Filtered by category: ${selectedText}`, 'info');
            console.log('Category filter changed:', this.value);
        });
    }
    
    // Status Filter
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyAppFilters();
            showNotification(`Filtered by status: ${selectedText}`, 'info');
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
 * @author Arsh Verma
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
                           (appPlatform.includes('iOS') && appPlatform.includes('Android'));
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
 * @author Arsh Verma
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
        const searchInput = document.getElementById('appSearch');
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
 * @author Arsh Verma
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
 * @author Arsh Verma
 */
function setupSearchFunctionality() {
    const searchInput = document.getElementById('appSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // Clear previous timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            // Set new timeout for debouncing
            searchTimeout = setTimeout(() => {
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
                        app.description,
                        app.overview,
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
                if (searchResults.length > 0) {
                    showNotification(`Found ${searchResults.length} app(s)`, 'success');
                }
            }, 300);
        });
    }
}

/**
 * Setup keyboard shortcuts
 * @author Arsh Verma
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        switch(e.key) {
            case 'r':
            case 'R':
                // Reset filters with Ctrl/Cmd + R
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    resetAppFilters();
                }
                break;
                
            case '/':
                // Focus search
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    const searchInput = document.getElementById('appSearch');
                    if (searchInput) searchInput.focus();
                }
                break;
                
            case 'Escape':
                // Clear search
                const searchInput = document.getElementById('appSearch');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                }
                break;
        }
    });
}

/**
 * Setup scroll to top functionality
 * @author Arsh Verma
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
 * - Keyboard navigation
 * @author Arsh Verma
 */
function setupAppCardListeners() {
    const cards = document.querySelectorAll('.app-card');
    
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
        
        // Keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const appId = parseInt(this.getAttribute('data-app-id'));
                if (appId) {
                    viewAppDetails(appId);
                }
            }
        });
    });
    
    console.log(`Setup interactions for ${cards.length} app cards`);
}

/**
 * Navigate to app detail page
 * @param {number} appId - ID of the app to view
 * @author Arsh Verma
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
 * @author Arsh Verma
 */
function updateHeaderStats() {
    try {
        const totalApps = allApps.length;
        
        // Calculate average rating (only from live apps with ratings)
        const ratedApps = allApps.filter(app => app.rating > 0);
        const averageRating = ratedApps.length > 0 
            ? (ratedApps.reduce((sum, app) => sum + app.rating, 0) / ratedApps.length).toFixed(1)
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
 * @author Arsh Verma
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} of ${allApps.length} app${allApps.length !== 1 ? 's' : ''}`;
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Parse download count string to number
 * @param {string} downloadCount - Download count string (e.g., "50K+", "1.2M+")
 * @returns {number} Parsed number value
 * @author Arsh Verma
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
 * @author Arsh Verma
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
 * @author Arsh Verma
 */
function generateStars(rating) {
    if (typeof rating !== 'number' || isNaN(rating)) rating = 0;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star" aria-hidden="true"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star" aria-hidden="true"></i>';
    }
    
    return starsHTML;
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Jan 2024")
 * @author Arsh Verma
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
 * @author Arsh Verma
 */
function truncateText(text, maxLength) {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Escape HTML special characters
 * Prevents XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 * @author Arsh Verma
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
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 * @author Arsh Verma
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
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        let backgroundColor, icon;
        switch (type) {
            case 'error':
                backgroundColor = '#dc3545';
                icon = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>';
                break;
            case 'success':
                backgroundColor = '#22C55E';
                icon = '<i class="fas fa-check-circle" aria-hidden="true"></i>';
                break;
            case 'warning':
                backgroundColor = '#ffc107';
                icon = '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>';
                break;
            case 'info':
            default:
                backgroundColor = '#17a2b8';
                icon = '<i class="fas fa-info-circle" aria-hidden="true"></i>';
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
            max-width: 400px;
        `;
        
        notification.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
        document.body.appendChild(notification);
        
        // Add animation styles if not present
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
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
// @author Arsh Verma
// ==========================================
window.initializeAppsPage = initializeAppsPage;
window.resetAppFilters = resetAppFilters;
window.viewAppDetails = viewAppDetails;
window.applyAppFilters = applyAppFilters;

// ==========================================
// AUTO-INITIALIZATION
// Initialize when DOM is ready
// @author Arsh Verma
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppsPage);
    console.log('Waiting for DOM to load...');
} else {
    initializeAppsPage();
}

// ==========================================
// DEBUG HELPERS
// Development and debugging utilities
// @author Arsh Verma
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
    return {
        allApps,
        currentApps,
        currentFilters,
        totalCount: allApps.length,
        filteredCount: currentApps.length
    };
};

/**
 * Debug function to test filters
 * Call window.testFilters() in console
 */
window.testFilters = function() {
    console.log('=== TESTING FILTERS ===');
    
    // Test platform filter
    console.log('Testing platform filter...');
    currentFilters.platform = 'iOS';
    applyAppFilters();
    console.log('iOS apps:', currentApps.length);
    
    // Reset
    resetAppFilters();
    
    // Test category filter
    console.log('Testing category filter...');
    currentFilters.category = 'Productivity';
    applyAppFilters();
    console.log('Productivity apps:', currentApps.length);
    
    // Reset
    resetAppFilters();
    
    console.log('Filter tests complete!');
    console.log('========================');
};

/**
 * Performance monitoring
 */
window.addEventListener('load', function() {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        console.log('=== PERFORMANCE METRICS ===');
        console.log('Page Load Time:', pageLoadTime + 'ms');
        console.log('DOM Ready Time:', domReadyTime + 'ms');
        console.log('===========================');
    }
});

// Log initialization
console.log('apps.js loaded successfully');
console.log('Author: Arsh Verma');
console.log('Version: 1.0.0');
console.log('Available functions:', [
    'initializeAppsPage', 
    'resetAppFilters', 
    'viewAppDetails', 
    'applyAppFilters', 
    'debugAppsState',
    'testFilters'
]);

// ==========================================
// ERROR HANDLING
// Global error handler for apps page
// @author Arsh Verma
// ==========================================
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    
    // Only show notification for critical errors
    if (event.error && event.error.message) {
        const message = event.error.message;
        if (message.includes('apps') || message.includes('filter')) {
            showNotification('An error occurred. Please refresh the page.', 'error');
        }
    }
});

// ==========================================
// UNLOAD HANDLER
// Cleanup when leaving page
// @author Arsh Verma
// ==========================================
window.addEventListener('beforeunload', function() {
    // Clear any pending timeouts
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    console.log('Apps page unloading...');
});

// ==========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// @author Arsh Verma
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAppsPage,
        resetAppFilters,
        viewAppDetails,
        applyAppFilters,
        getSampleApps
    };
}

// ==========================================
// END OF FILE
// apps.js - Complete Apps Portfolio JavaScript
// Author: Arsh Verma
// Version: 1.0.0
// ==========================================