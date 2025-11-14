// ==========================================
// GAMES PAGE - Complete Production-Ready Implementation
// Author: Arsh Verma
// Version: 2.2.0
// Description: Handles all games portfolio functionality for preview showcase
//              - Filters, sorting, card rendering, and navigation to details
//              - Error handling, accessibility, and performance optimized
//              - Fixed loading state bug: Now properly transitions from loading to content
// Last Updated: November 10, 2024
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// Centralized state for games data and UI interactions
// ==========================================
const GAMES_STATE = {
    allGames: [],              // Complete list of games from data source
    filteredGames: [],         // Currently displayed games after filtering/sorting
    currentFilters: {          // Active filter and sort settings
        category: 'all',
        status: 'all',
        sort: 'newest'
    },
    isLoading: false,          // Loading state to prevent race conditions
    animationDelay: 100        // Staggered animation timing for card entrance
};

// ==========================================
// INITIALIZATION
// Entry point for games page functionality
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeGamesPage();
    setupThemeToggle();
    setupBackToTop();
    setupMobileMenu();
});

/**
 * Main initialization function
 * - Orchestrates data loading, UI setup, and initial render
 * - Wrapped in try-catch for robust error handling
 * - Fixed: displayGames now called after loading state is cleared for proper transition
 */
function initializeGamesPage() {
    try {
        // Set loading state
        GAMES_STATE.isLoading = true;
        
        // Load games data first (synchronous)
        loadGamesData();
        
        // Setup UI components (depend on data for filters)
        setupGameFilters();
        setupGameEventListeners();
        
        // Update dynamic stats
        updateHeaderStats();
        
        // Delay content reveal for smooth UX: Clear loading and display after timeout
        setTimeout(() => {
            GAMES_STATE.isLoading = false;
            displayGames(GAMES_STATE.filteredGames);
            hideLoadingScreen();
        }, 800);
    } catch (error) {
        console.error('Error initializing games page:', error);
        showNotification('Failed to load games. Please refresh the page.', 'error');
        GAMES_STATE.isLoading = false;
        // Fallback display for error state
        displayGames([]);
        hideLoadingScreen();
    }
}

/**
 * Load games data from data source
 * - Prioritizes global functions/data, falls back to sample
 * - Handles missing data gracefully
 */
function loadGamesData() {
    try {
        let gamesData = [];
        
        // Fallback: Use sample data for demo/preview
        gamesData = createSampleGames();
        
        // Validate and assign data
        GAMES_STATE.allGames = validateGamesData(gamesData);
        GAMES_STATE.filteredGames = [...GAMES_STATE.allGames];
    } catch (error) {
        console.error('Error loading games:', error);
        GAMES_STATE.allGames = [];
        GAMES_STATE.filteredGames = [];
        showNotification('Error loading games data.', 'error');
    }
}

/**
 * Validate games data structure
 * - Ensures each game has required fields
 * - Sanitizes and defaults missing values
 * @param {Array} games - Raw games data
 * @returns {Array} Validated games array
 */
function validateGamesData(games) {
    if (!Array.isArray(games)) return [];
    
    return games.map(game => ({
        id: game.id || Date.now() + Math.random(),  // Unique ID fallback
        name: game.name || 'Untitled Game',
        category: game.category || 'Uncategorized',
        status: game.status || 'In Development',
        overview: game.overview || game.description || 'Preview coming soon.',
        releaseDate: game.releaseDate || null,
        rating: game.rating || 0,
        playCount: Math.max(0, game.playCount || 0),
        image: game.image || generatePlaceholderImage(game.name),
        features: Array.isArray(game.features) ? game.features.slice(0, 5) : [],  // Limit to 5
        repositoryUrl: game.repositoryUrl || null
    })).filter(game => game.id);  // Remove invalid entries
}

/**
 * Generate placeholder image URL
 * - Uses via.placeholder.com for production-ready fallbacks
 * @param {string} name - Game name for text overlay
 * @returns {string} Image URL
 */
function generatePlaceholderImage(name) {
    const encodedName = encodeURIComponent(name.substring(0, 20));  // Truncate for URL
    return `https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodedName}`;
}

/**
 * Display games in the grid
 * - Handles loading, empty, and populated states
 * - Renders cards with preview focus (limited details)
 * @param {Array} games - Games to display
 */
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) {
        console.error('Games grid element not found');
        return;
    }
    
    // Loading state (only if still loading)
    if (GAMES_STATE.isLoading) {
        gamesGrid.innerHTML = `
            <div class="loading-games">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing games...</p>
            </div>
        `;
        return;
    }
    
    // Empty state with CTA
    if (!games || games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-gamepad"></i>
                <h3>No Games Found</h3>
                <p>No games match your current filters. Try adjusting them for previews.</p>
                <button class="btn btn-primary" onclick="resetFilters()" aria-label="Reset filters">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    // Render cards
    gamesGrid.innerHTML = games.map(game => createGameCard(game)).join('');
    
    // Setup interactions post-render
    setupGameCardListeners();
    animateGameCards();
}

/**
 * Create HTML for a single game card (preview only)
 * - Limited details: title, rating, category, short overview, key features
 * - Links to game-detail.html for full info
 * @param {Object} game - Game data object
 * @returns {string} HTML string for card
 */
function createGameCard(game) {
    const statusClass = game.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = game.image;
    
    // Shorten overview for preview (max 120 chars)
    const shortOverview = (game.overview || '').length > 120 
        ? game.overview.substring(0, 120) + '...' 
        : game.overview;
    
    return `
        <article class="game-card" 
                 data-game-id="${game.id}" 
                 data-category="${game.category}" 
                 data-status="${game.status}"
                 role="article"
                 aria-labelledby="game-title-${game.id}">
            
            <div class="game-image">
                <img src="${imageUrl}" 
                     alt="${game.name} preview image"
                     loading="lazy"
                     onerror="this.src='${generatePlaceholderImage(game.name)}'">
                
                <div class="game-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-primary btn-view-details" 
                                data-game-id="${game.id}"
                                aria-label="View details for ${game.name}">
                            <i class="fas fa-eye"></i>
                            <span>Preview Details</span>
                        </button>
                        ${game.status === 'Live' ? `
                            <button class="btn btn-secondary btn-play-now" 
                                    data-game-id="${game.id}"
                                    aria-label="Play ${game.name} now">
                                <i class="fas fa-play"></i>
                                <span>Play Preview</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="game-badge status-${statusClass}" aria-label="Status: ${game.status}">${game.status}</div>
            </div>
            
            <div class="game-content">
                <header class="game-header">
                    <h3 class="game-title" id="game-title-${game.id}">${game.name}</h3>
                    ${game.rating > 0 ? `
                        <div class="game-rating" aria-label="Rating: ${game.rating} out of 5">
                            <div class="rating-stars" aria-hidden="true">${generateStars(game.rating)}</div>
                            <span class="rating-value">${game.rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                </header>
                
                <div class="game-meta">
                    <span class="game-category" aria-label="Category: ${game.category}">
                        <i class="fas fa-tag" aria-hidden="true"></i>
                        ${game.category}
                    </span>
                    ${game.releaseDate ? `
                        <span class="game-date" aria-label="Release date: ${formatDate(game.releaseDate)}">
                            <i class="fas fa-calendar" aria-hidden="true"></i>
                            ${formatDate(game.releaseDate)}
                        </span>
                    ` : ''}
                </div>
                
                <p class="game-description">${shortOverview}</p>
                
                ${game.features && game.features.length > 0 ? `
                    <div class="game-features" aria-label="Key features">
                        ${game.features.slice(0, 3).map(feature => `
                            <span class="game-feature">
                                <i class="fas fa-check" aria-hidden="true"></i>
                                ${feature}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="game-actions">
                    <button class="btn btn-primary btn-view-game" 
                            data-game-id="${game.id}"
                            aria-label="Learn more about ${game.name}">
                        <i class="fas fa-info-circle" aria-hidden="true"></i>
                        <span>Preview More</span>
                    </button>
                    ${game.repositoryUrl ? `
                        <a href="${game.repositoryUrl}" 
                           class="btn btn-secondary"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="View source code on GitHub">
                            <i class="fab fa-github" aria-hidden="true"></i>
                            <span>View Code</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </article>
    `;
}

/**
 * Setup filter controls
 * - Dynamically populates categories
 * - Attaches change listeners for real-time filtering
 */
function setupGameFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!categoryFilter || !statusFilter || !sortFilter) {
        console.warn('Filter elements not found');
        return;
    }
    
    // Populate unique categories dynamically
    const categories = [...new Set(GAMES_STATE.allGames.map(game => game.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Event listeners for filters
    categoryFilter.addEventListener('change', handleFilterChange);
    statusFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    
    function handleFilterChange() {
        GAMES_STATE.currentFilters.category = categoryFilter.value;
        GAMES_STATE.currentFilters.status = statusFilter.value;
        GAMES_STATE.currentFilters.sort = sortFilter.value;
        applyFilters();
    }
}

/**
 * Apply all active filters and sorting
 * - Chains category/status filters, then sorts
 * - Updates display immediately
 */
function applyFilters() {
    let filtered = [...GAMES_STATE.allGames];
    
    // Category filter
    if (GAMES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(game => game.category === GAMES_STATE.currentFilters.category);
    }
    
    // Status filter
    if (GAMES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(game => game.status === GAMES_STATE.currentFilters.status);
    }
    
    // Sort results
    filtered = sortGames(filtered, GAMES_STATE.currentFilters.sort);
    
    GAMES_STATE.filteredGames = filtered;
    displayGames(filtered);
}

/**
 * Sort games by specified criteria
 * - Supports newest, oldest, rating, popularity
 * - Handles missing dates/values gracefully
 * @param {Array} games - Games to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted games
 */
function sortGames(games, sortBy) {
    const sorted = [...games];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
            
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0));
            
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            
        case 'popular':
            return sorted.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
            
        default:
            return sorted;
    }
}

/**
 * Reset all filters to defaults
 * - Clears selections and reapplies
 * - Shows success notification
 */
function resetFilters() {
    GAMES_STATE.currentFilters = {
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

/**
 * Setup global event listeners
 * - Keyboard shortcuts (e.g., 'R' for reset)
 * - Ignores inputs to avoid conflicts
 */
function setupGameEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Skip if focused on form elements
        if (e.target.matches('input, textarea, select, button')) return;
        
        // Reset filters on 'R' key
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            resetFilters();
        }
    });
}

/**
 * Setup interactive listeners on game cards
 * - View details, play, hover effects
 * - Prevents event bubbling on buttons
 */
function setupGameCardListeners() {
    // View details / Learn more buttons
    document.querySelectorAll('.btn-view-details, .btn-view-game').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            viewGameDetails(gameId);
        });
    });
    
    // Play now buttons (only for live games)
    document.querySelectorAll('.btn-play-now').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            playGame(gameId);
        });
    });
    
    // Card-wide click for details (excluding buttons/links)
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const gameId = this.getAttribute('data-game-id');
                viewGameDetails(gameId);
            }
        });
        
        // Desktop hover effects (transform for engagement)
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
}

/**
 * Navigate to game details page
 * - Appends query params for SPA-like routing
 * @param {string|number} gameId - Game ID
 */
function viewGameDetails(gameId) {
    if (!gameId) {
        showNotification('Invalid game ID', 'error');
        return;
    }
    showNotification('Game details feature coming soon!', 'info');
    // window.location.href = `game-detail.html?id=${encodeURIComponent(gameId)}`;
}

/**
 * Navigate to play game (with play flag)
 * - For live games, enables direct play mode
 * @param {string|number} gameId - Game ID
 */
function playGame(gameId) {
    if (!gameId) {
        showNotification('Invalid game ID', 'error');
        return;
    }
    showNotification('Play feature coming soon!', 'info');
    // window.location.href = `game-detail.html?id=${encodeURIComponent(gameId)}&play=true`;
}

/**
 * Update header statistics dynamically
 * - Calculates totals from loaded data
 * - Updates DOM elements safely
 */
function updateHeaderStats() {
    const allGames = GAMES_STATE.allGames;
    if (allGames.length === 0) return;
    
    const totalGames = allGames.length;
    const averageRating = (allGames.reduce((sum, game) => sum + (game.rating || 0), 0) / totalGames).toFixed(1);
    const totalPlayers = allGames.reduce((sum, game) => sum + (game.playCount || 0), 0);
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalGames}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalPlayers) + '+';
    }
}

/**
 * Animate cards entrance with stagger
 * - Fade-in and slide-up for polished UX
 */
function animateGameCards() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        // Initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'none';
        
        // Trigger animation with delay
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * GAMES_STATE.animationDelay);
    });
}

/**
 * Hide loading screen with fade-out
 * - Ensures smooth transition to content
 */
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-games');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// Reusable helpers for formatting and notifications
// ==========================================

/**
 * Generate star rating HTML
 * - Full, half, and empty stars based on rating
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML for stars
 */
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

/**
 * Format large numbers (K, M suffixes)
 * - For player counts and stats
 * @param {number} num - Number to format
 * @returns {string} Formatted string
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
 * - Handles invalid dates gracefully
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date or 'N/A'
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.warn('Invalid date format:', dateString);
        return 'N/A';
    }
}

/**
 * Show notification (fallback to console if no global function)
 * - Integrates with utils.js showNotification if available
 * @param {string} message - Notification text
 * @param {string} type - Type: info, success, error
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    let title = 'Information';
    
    if (type === 'success') {
        icon = 'check-circle';
        title = 'Success';
    } else if (type === 'error') {
        icon = 'exclamation-circle';
        title = 'Error';
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
    
    // Show animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ==========================================
// THEME TOGGLE FUNCTIONALITY
// ==========================================
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    if (!themeToggle || !themeIcon) return;
    
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update icon based on current theme
    updateThemeIcon(savedTheme, themeIcon);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        updateThemeIcon(newTheme, themeIcon);
        
        showNotification(`Switched to ${newTheme} mode`, 'info');
    });
}

function updateThemeIcon(theme, iconElement) {
    if (theme === 'dark') {
        iconElement.className = 'fas fa-sun';
    } else {
        iconElement.className = 'fas fa-moon';
    }
}

// ==========================================
// BACK TO TOP FUNCTIONALITY
// ==========================================
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// MOBILE MENU FUNCTIONALITY
// ==========================================
function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ==========================================
// SAMPLE DATA FALLBACK
// Production-ready sample games for preview/demo mode
// Edit here to add/remove sample entries
// ==========================================
function createSampleGames() {
    return [
        {
            id: 1,
            name: "Dragon Quest RPG",
            category: "Action RPG",
            status: "Live",
            rating: 4.7,
            overview: "An epic fantasy adventure with deep combat mechanics and rich storytelling. Preview the world and characters.",
            releaseDate: "2024-01-15",
            playCount: 15000,
            image: "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=Dragon+Quest+RPG",
            features: ["Open World Exploration", "Character Customization", "Real-time Combat", "Co-op Multiplayer"],
            repositoryUrl: "https://github.com/ArshVermaGit/dragon-quest-rpg"
        },
        {
            id: 2,
            name: "Neon Drift Racer",
            category: "Racing",
            status: "Live",
            rating: 4.9,
            overview: "High-speed futuristic racing with stunning visuals and intense competition. Test the tracks in preview.",
            releaseDate: "2024-02-20",
            playCount: 22000,
            image: "https://via.placeholder.com/400x250/00D4AA/FFFFFF?text=Neon+Drift+Racer",
            features: ["Multiplayer Races", "Vehicle Customization", "Dynamic Weather", "VR Compatible"],
            repositoryUrl: "https://github.com/ArshVermaGit/neon-drift-racer"
        },
        {
            id: 3,
            name: "Pixel Platformer Pro",
            category: "Platformer",
            status: "In Development",
            rating: 4.5,
            overview: "Challenging retro-style platformer with modern mechanics and pixel-perfect controls. Sneak peek at levels.",
            releaseDate: "2024-06-30",
            playCount: 5000,
            image: "https://via.placeholder.com/400x250/FF6B35/FFFFFF?text=Pixel+Platformer",
            features: ["Retro Pixel Art", "Level Editor", "Speedrun Challenges", "Online Leaderboards"],
            repositoryUrl: "https://github.com/ArshVermaGit/pixel-platformer"
        },
        {
            id: 4,
            name: "Shadow Realm Chronicles",
            category: "Fantasy RPG",
            status: "In Development",
            rating: 0,  // No rating yet
            overview: "Dark fantasy RPG with choice-driven narratives and atmospheric exploration. Early preview available.",
            releaseDate: null,
            playCount: 0,
            image: "https://via.placeholder.com/400x250/2E2E2E/FFFFFF?text=Shadow+Realm",
            features: ["Branching Storylines", "Moral Choices", "Procedural Dungeons", "Voice Acting"],
            repositoryUrl: null
        },
        {
            id: 5,
            name: "Cosmic Colony",
            category: "Strategy",
            status: "Live",
            rating: 4.8,
            overview: "Build and manage interstellar colonies in this deep space strategy game. Explore alien worlds.",
            releaseDate: "2023-11-10",
            playCount: 18000,
            image: "https://via.placeholder.com/400x250/8B5CF6/FFFFFF?text=Cosmic+Colony",
            features: ["Base Building", "Resource Management", "Alien Diplomacy", "Research Trees"],
            repositoryUrl: "https://github.com/ArshVermaGit/cosmic-colony"
        },
        {
            id: 6,
            name: "Cyber Heist",
            category: "Action RPG",
            status: "In Development",
            rating: 4.2,
            overview: "Futuristic heist game with hacking mechanics and team-based gameplay. Plan the perfect cyber crime.",
            releaseDate: "2024-09-15",
            playCount: 3000,
            image: "https://via.placeholder.com/400x250/06B6D4/FFFFFF?text=Cyber+Heist",
            features: ["Team Coordination", "Hacking Minigames", "Stealth Mechanics", "Multiple Endings"],
            repositoryUrl: "https://github.com/ArshVermaGit/cyber-heist"
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// Make key functions available globally for HTML onclicks and utils integration
// ==========================================
window.initializeGamesPage = initializeGamesPage;
window.resetFilters = resetFilters;
window.viewGameDetails = viewGameDetails;
window.playGame = playGame;
window.applyFilters = applyFilters;