/**
 * ==========================================
 * GAMES PAGE - COMPLETE IMPLEMENTATION
 * Author: Arsh Verma
 * Purpose: Handles all game portfolio functionality
 * Version: 1.0.0
 * Last Updated: 2024
 * ==========================================
 */

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// Centralized state for games page
// ==========================================
const GAMES_STATE = {
    allGames: [],           // Complete games dataset
    filteredGames: [],      // Currently filtered games
    currentFilters: {       // Active filter settings
        category: 'all',
        status: 'all',
        sort: 'newest',
        search: ''
    },
    isLoading: false,       // Loading state flag
    animationDelay: 100,    // Card animation delay (ms)
    initialized: false      // Initialization flag
};

// ==========================================
// INITIALIZATION
// Entry point for games page
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Games page initializing...');
    initializeGamesPage();
});

/**
 * Initialize the entire games page
 * Sets up data, filters, events, and displays content
 */
function initializeGamesPage() {
    try {
        // Prevent double initialization
        if (GAMES_STATE.initialized) {
            console.warn('⚠️ Games page already initialized');
            return;
        }
        
        // 1. Load all games from data source
        loadGamesData();
        
        // 2. Setup filter controls
        setupGameFilters();
        
        // 3. Setup event listeners
        setupGameEventListeners();
        
        // 4. Update header statistics
        updateHeaderStats();
        
        // 5. Display games
        displayGames(GAMES_STATE.allGames);
        
        // 6. Hide loading screen after brief delay
        setTimeout(hideLoadingScreen, 800);
        
        // Mark as initialized
        GAMES_STATE.initialized = true;
        
        console.log('✅ Games page initialized successfully');
        console.log(`📊 Loaded ${GAMES_STATE.allGames.length} games`);
        
    } catch (error) {
        console.error('❌ Error initializing games page:', error);
        showNotification('Failed to load games. Please refresh the page.', 'error');
        hideLoadingScreen();
    }
}

// ==========================================
// DATA LOADING
// Load games from data source with fallback
// ==========================================

/**
 * Load games data from global data source
 * Falls back to sample data if no data available
 */
function loadGamesData() {
    try {
        console.log('📦 Loading games data...');
        
        // Try to get games from data.js using multiple methods
        if (typeof window.getGames === 'function') {
            // Method 1: Using getGames() function
            GAMES_STATE.allGames = window.getGames();
            console.log('✓ Loaded from getGames()');
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.games) {
            // Method 2: Using PORTFOLIO_DATA object
            GAMES_STATE.allGames = PORTFOLIO_DATA.games;
            console.log('✓ Loaded from PORTFOLIO_DATA');
        } else {
            // Method 3: Fallback to sample data
            console.warn('⚠️ No games data found, using sample data');
            GAMES_STATE.allGames = createSampleGames();
        }
        
        // Validate data
        if (!Array.isArray(GAMES_STATE.allGames)) {
            throw new Error('Games data is not an array');
        }
        
        // Initialize filtered games
        GAMES_STATE.filteredGames = [...GAMES_STATE.allGames];
        
        console.log(`✅ Successfully loaded ${GAMES_STATE.allGames.length} games`);
        
    } catch (error) {
        console.error('❌ Error loading games:', error);
        GAMES_STATE.allGames = [];
        GAMES_STATE.filteredGames = [];
        showNotification('Failed to load games data', 'error');
    }
}

// ==========================================
// DISPLAY GAMES
// Render games to the page
// ==========================================

/**
 * Display games in the grid
 * @param {Array} games - Array of game objects to display
 */
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    
    // Validate grid element exists
    if (!gamesGrid) {
        console.error('❌ Games grid element not found');
        return;
    }
    
    // Show loading state
    if (GAMES_STATE.isLoading) {
        gamesGrid.innerHTML = `
            <div class="loading-games">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing games...</p>
            </div>
        `;
        return;
    }
    
    // Show empty state if no games
    if (!games || games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-games">
                <i class="fas fa-gamepad"></i>
                <p>No games match your current filters</p>
                <button class="btn btn-primary" onclick="resetFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    // Generate game cards HTML
    const gamesHTML = games.map(game => createGameCard(game)).join('');
    gamesGrid.innerHTML = gamesHTML;
    
    // Setup card interactions
    setupGameCardListeners();
    
    // Animate cards entrance
    animateGameCards();
    
    console.log(`✅ Displayed ${games.length} games`);
}

// ==========================================
// CREATE GAME CARD HTML
// Generate HTML for individual game card
// ==========================================

/**
 * Create HTML for a single game card
 * @param {Object} game - Game object with all properties
 * @returns {string} HTML string for game card
 */
function createGameCard(game) {
    // Safely handle missing data
    const statusClass = (game.status || 'unknown').toLowerCase().replace(/\s+/g, '-');
    const starsHTML = generateStars(game.rating || 0);
    const imageUrl = game.image || `https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(game.name || 'Game')}`;
    const description = game.overview || game.description || 'An exciting gaming experience awaits!';
    
    return `
        <div class="game-card" 
             data-game-id="${game.id}" 
             data-category="${game.category || 'Unknown'}" 
             data-status="${game.status || 'Unknown'}" 
             data-rating="${game.rating || 0}">
            
            <!-- Game Image Container -->
            <div class="game-image">
                <img src="${imageUrl}" 
                     alt="${game.name || 'Game'}"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(game.name || 'Game')}'">
                
                <!-- Hover Overlay with Actions -->
                <div class="game-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-primary btn-view-details" 
                                data-game-id="${game.id}"
                                aria-label="View ${game.name} details">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${game.status === 'Live' ? `
                            <button class="btn btn-secondary btn-play-now" 
                                    data-game-id="${game.id}"
                                    aria-label="Play ${game.name}">
                                <i class="fas fa-play"></i>
                                <span>Play Now</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Status Badge -->
                <div class="game-badge status-${statusClass}">${game.status || 'Unknown'}</div>
            </div>
            
            <!-- Game Content -->
            <div class="game-content">
                <!-- Title and Rating -->
                <div class="game-header">
                    <h3 class="game-title">${game.name || 'Untitled Game'}</h3>
                    <div class="game-rating">
                        <div class="rating-stars">${starsHTML}</div>
                        <span class="rating-value">${(game.rating || 0).toFixed(1)}</span>
                    </div>
                </div>
                
                <!-- Meta Information -->
                <div class="game-meta">
                    <span class="game-category">
                        <i class="fas fa-tag"></i>
                        ${game.category || 'Uncategorized'}
                    </span>
                    ${game.releaseDate ? `
                        <span class="game-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(game.releaseDate)}
                        </span>
                    ` : ''}
                </div>
                
                <!-- Description -->
                <p class="game-description">${description}</p>
                
                <!-- Features (if available) -->
                ${game.features && game.features.length > 0 ? `
                    <div class="game-features">
                        ${game.features.slice(0, 3).map(feature => `
                            <span class="game-feature">
                                <i class="fas fa-check"></i>
                                ${feature}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Action Buttons -->
                <div class="game-actions">
                    <button class="btn btn-primary btn-view-game" 
                            data-game-id="${game.id}"
                            aria-label="View ${game.name}">
                        <i class="fas fa-info-circle"></i>
                        <span>Learn More</span>
                    </button>
                    ${game.repositoryUrl ? `
                        <a href="${game.repositoryUrl}" 
                           class="btn btn-secondary"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="View ${game.name} source code">
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
// Initialize all filter controls
// ==========================================

/**
 * Setup all filter controls
 */
function setupGameFilters() {
    console.log('🔧 Setting up game filters...');
    
    try {
        // Initialize each filter type
        setupCategoryFilter();
        setupStatusFilter();
        setupSortFilter();
        
        console.log('✅ Filters initialized successfully');
    } catch (error) {
        console.error('❌ Error setting up filters:', error);
    }
}

/**
 * Setup category filter dropdown
 */
function setupCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // Extract unique categories from all games
    const categories = [...new Set(GAMES_STATE.allGames.map(game => game.category).filter(Boolean))];
    
    // Clear and rebuild options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Add change event listener
    categoryFilter.addEventListener('change', function() {
        GAMES_STATE.currentFilters.category = this.value;
        applyFilters();
        console.log('📂 Category filter changed:', this.value);
    });
}

/**
 * Setup status filter dropdown
 */
function setupStatusFilter() {
    const statusFilter = document.getElementById('statusFilter');
    if (!statusFilter) return;
    
    statusFilter.addEventListener('change', function() {
        GAMES_STATE.currentFilters.status = this.value;
        applyFilters();
        console.log('📊 Status filter changed:', this.value);
    });
}

/**
 * Setup sort filter dropdown
 */
function setupSortFilter() {
    const sortFilter = document.getElementById('sortFilter');
    if (!sortFilter) return;
    
    sortFilter.addEventListener('change', function() {
        GAMES_STATE.currentFilters.sort = this.value;
        applyFilters();
        console.log('🔄 Sort changed:', this.value);
    });
}

// ==========================================
// APPLY FILTERS
// Filter and sort games based on current settings
// ==========================================

/**
 * Apply all active filters and display results
 */
function applyFilters() {
    let filtered = [...GAMES_STATE.allGames];
    
    // Apply category filter
    if (GAMES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(game => 
            game.category === GAMES_STATE.currentFilters.category
        );
    }
    
    // Apply status filter
    if (GAMES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(game => 
            game.status === GAMES_STATE.currentFilters.status
        );
    }
    
    // Apply search filter (if search exists)
    if (GAMES_STATE.currentFilters.search) {
        const searchTerm = GAMES_STATE.currentFilters.search.toLowerCase();
        filtered = filtered.filter(game => {
            return (
                (game.name && game.name.toLowerCase().includes(searchTerm)) ||
                (game.overview && game.overview.toLowerCase().includes(searchTerm)) ||
                (game.description && game.description.toLowerCase().includes(searchTerm)) ||
                (game.category && game.category.toLowerCase().includes(searchTerm)) ||
                (game.features && game.features.some(f => f.toLowerCase().includes(searchTerm)))
            );
        });
    }
    
    // Apply sorting
    filtered = sortGames(filtered, GAMES_STATE.currentFilters.sort);
    
    // Update state and display
    GAMES_STATE.filteredGames = filtered;
    displayGames(filtered);
    
    console.log(`🎯 Filters applied: ${filtered.length} of ${GAMES_STATE.allGames.length} games shown`);
}

// ==========================================
// SORT GAMES
// Sort games array by specified criteria
// ==========================================

/**
 * Sort games based on sort criteria
 * @param {Array} games - Games array to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted games array
 */
function sortGames(games, sortBy) {
    const sorted = [...games];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => {
                const dateA = new Date(a.releaseDate || 0);
                const dateB = new Date(b.releaseDate || 0);
                return dateB - dateA;
            });
            
        case 'oldest':
            return sorted.sort((a, b) => {
                const dateA = new Date(a.releaseDate || 0);
                const dateB = new Date(b.releaseDate || 0);
                return dateA - dateB;
            });
            
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            
        case 'popular':
            return sorted.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
            
        default:
            return sorted;
    }
}

// ==========================================
// RESET FILTERS
// Reset all filters to default state
// ==========================================

/**
 * Reset all filters to default values
 */
function resetFilters() {
    console.log('🔄 Resetting all filters...');
    
    // Reset state
    GAMES_STATE.currentFilters = {
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
    
    // Reapply filters (shows all games)
    applyFilters();
    
    showNotification('Filters reset successfully', 'success');
}

// ==========================================
// GAME CARD INTERACTIONS
// Setup event listeners for game cards
// ==========================================

/**
 * Setup all game card event listeners
 */
function setupGameCardListeners() {
    // View Details Buttons
    const viewButtons = document.querySelectorAll('.btn-view-details, .btn-view-game');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            viewGameDetails(gameId);
        });
    });
    
    // Play Now Buttons
    const playButtons = document.querySelectorAll('.btn-play-now');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            playGame(gameId);
        });
    });
    
    // Card Click (entire card clickable)
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        // Click handler
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons or links
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const gameId = this.getAttribute('data-game-id');
                viewGameDetails(gameId);
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
    
    console.log('✅ Game card listeners attached');
}

// ==========================================
// EVENT LISTENERS
// Global event listeners for games page
// ==========================================

/**
 * Setup global event listeners
 */
function setupGameEventListeners() {
    // Window resize handler (debounced)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            setupGameCardListeners();
        }, 250);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Don't trigger if typing in input
        if (e.target.matches('input, textarea, select')) return;
        
        // Press 'R' to reset filters
        if (e.key === 'r' || e.key === 'R') {
            resetFilters();
        }
    });
    
    console.log('✅ Event listeners initialized');
}

// ==========================================
// NAVIGATION FUNCTIONS
// Handle navigation to game pages
// ==========================================

/**
 * Navigate to game detail page
 * @param {string|number} gameId - Game ID
 */
function viewGameDetails(gameId) {
    console.log('🎮 Viewing game details:', gameId);
    
    if (!gameId) {
        showNotification('Invalid game ID', 'error');
        return;
    }
    
    // Navigate to game detail page
    window.location.href = `game-detail.html?id=${gameId}`;
}

/**
 * Navigate to play game page
 * @param {string|number} gameId - Game ID
 */
function playGame(gameId) {
    console.log('▶️ Playing game:', gameId);
    
    if (!gameId) {
        showNotification('Invalid game ID', 'error');
        return;
    }
    
    // Navigate to game detail page with play parameter
    window.location.href = `game-detail.html?id=${gameId}&play=true`;
}

// ==========================================
// HEADER STATISTICS
// Update statistics in page header
// ==========================================

/**
 * Update header statistics based on games data
 */
function updateHeaderStats() {
    const allGames = GAMES_STATE.allGames;
    
    if (allGames.length === 0) return;
    
    try {
        // Calculate statistics
        const totalGames = allGames.length;
        const averageRating = (allGames.reduce((sum, game) => sum + (game.rating || 0), 0) / totalGames).toFixed(1);
        const totalPlayers = allGames.reduce((sum, game) => sum + (game.playCount || 0), 0);
        
        // Update UI elements
        const statNumbers = document.querySelectorAll('.header-stats .stat-number');
        
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = `${totalGames}+`;
            statNumbers[1].textContent = averageRating;
            statNumbers[2].textContent = formatNumber(totalPlayers);
        }
        
        console.log('📊 Stats updated:', { totalGames, averageRating, totalPlayers });
    } catch (error) {
        console.error('❌ Error updating stats:', error);
    }
}

// ==========================================
// ANIMATIONS
// Handle page animations
// ==========================================

/**
 * Animate game cards entrance with stagger effect
 */
function animateGameCards() {
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate with stagger delay
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * GAMES_STATE.animationDelay);
    });
}

/**
 * Hide loading screen with fade out
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
 * Format large numbers with K/M suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
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
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) return 'N/A';
        
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return 'N/A';
    }
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Use global notification function if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Get notification color based on type
 * @param {string} type - Notification type
 * @returns {string} Color hex code
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
// SAMPLE DATA FALLBACK
// Sample games data if no data source available
// ==========================================

/**
 * Create sample games for fallback
 * @returns {Array} Array of sample game objects
 */
function createSampleGames() {
    return [
        {
            id: 1,
            name: "Dragon Quest RPG",
            category: "Action RPG",
            status: "Live",
            rating: 4.7,
            overview: "An epic fantasy adventure with deep combat mechanics and rich storytelling.",
            releaseDate: "2024-01-15",
            playCount: 15000,
            image: "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=Dragon+Quest+RPG",
            features: ["Open World", "Character Customization", "Real-time Combat", "Multiplayer"],
            repositoryUrl: "https://github.com/ArshVermaGit/dragon-quest-rpg"
        },
        {
            id: 2,
            name: "Neon Drift Racer",
            category: "Racing",
            status: "Live",
            rating: 4.9,
            overview: "High-speed futuristic racing with stunning visuals and intense competition.",
            releaseDate: "2024-02-20",
            playCount: 22000,
            image: "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=Neon+Drift+Racer",
            features: ["Multiplayer Racing", "Vehicle Customization", "Dynamic Weather", "VR Support"],
            repositoryUrl: "https://github.com/ArshVermaGit/neon-drift-racer"
        },
        {
            id: 3,
            name: "Pixel Platformer Pro",
            category: "Platformer",
            status: "In Development",
            rating: 4.5,
            overview: "Challenging retro-style platformer with modern mechanics and pixel-perfect controls.",
            releaseDate: "2024-06-30",
            playCount: 5000,
            image: "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=Pixel+Platformer+Pro",
            features: ["Retro Graphics", "Level Editor", "Speedrun Mode", "Online Leaderboards"]
        },
        {
            id: 4,
            name: "Mythic Legends",
            category: "Fantasy RPG",
            status: "Live",
            rating: 4.8,
            overview: "Build your legend in this massive multiplayer fantasy RPG with deep lore.",
            releaseDate: "2023-11-10",
            playCount: 35000,
            image: "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=Mythic+Legends",
            features: ["MMO Gameplay", "Class System", "Guild Wars", "Regular Updates"],
            repositoryUrl: "https://github.com/ArshVermaGit/mythic-legends"
        },
        {
            id: 5,
            name: "Space Explorers",
            category: "Action RPG",
            status: "In Development",
            rating: 4.3,
            overview: "Explore the cosmos in this procedurally generated space adventure.",
            releaseDate: "2024-08-15",
            playCount: 2000,
            image: "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=Space+Explorers",
            features: ["Procedural Generation", "Base Building", "Space Combat", "Co-op Mode"]
        },
        {
            id: 6,
            name: "Cyber Strike",
            category: "Action RPG",
            status: "Live",
            rating: 4.6,
            overview: "Tactical cyberpunk shooter with RPG elements and immersive world-building.",
            releaseDate: "2023-09-05",
            playCount: 18000,
            image: "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=Cyber+Strike",
            features: ["Tactical Combat", "Cyberware Upgrades", "Branching Story", "Multiplayer"],
            repositoryUrl: "https://github.com/ArshVermaGit/cyber-strike"
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// Export functions for use in other scripts
// ==========================================
window.initializeGamesPage = initializeGamesPage;
window.resetFilters = resetFilters;
window.viewGameDetails = viewGameDetails;
window.playGame = playGame;
window.applyFilters = applyFilters;

// ==========================================
// AUTO-INITIALIZE CHECK
// Verify script loaded successfully
// ==========================================
console.log('✅ Games.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔗 GitHub: https://github.com/ArshVermaGit');