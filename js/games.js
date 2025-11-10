// ==========================================
// GAMES PAGE - Complete Implementation
// Author: Arsh Verma
// Version: 2.0.0
// Description: Handles all games portfolio functionality
// ==========================================

'use strict';

// Global state management
const GAMES_STATE = {
    allGames: [],
    filteredGames: [],
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
    console.log('🎮 Games page initializing...');
    initializeGamesPage();
});

/**
 * Main initialization function
 */
function initializeGamesPage() {
    try {
        loadGamesData();
        setupGameFilters();
        setupGameEventListeners();
        updateHeaderStats();
        displayGames(GAMES_STATE.allGames);
        
        setTimeout(hideLoadingScreen, 800);
        console.log('✅ Games page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing games page:', error);
        showNotification('Failed to load games. Please refresh the page.', 'error');
        hideLoadingScreen();
    }
}

/**
 * Load games data from data source
 */
function loadGamesData() {
    try {
        if (typeof window.getGames === 'function') {
            GAMES_STATE.allGames = window.getGames();
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.games) {
            GAMES_STATE.allGames = PORTFOLIO_DATA.games;
        } else {
            console.warn('⚠️ No games data found, using sample data');
            GAMES_STATE.allGames = createSampleGames();
        }
        
        GAMES_STATE.filteredGames = [...GAMES_STATE.allGames];
        console.log(`📦 Loaded ${GAMES_STATE.allGames.length} games`);
    } catch (error) {
        console.error('❌ Error loading games:', error);
        GAMES_STATE.allGames = [];
        GAMES_STATE.filteredGames = [];
    }
}

/**
 * Display games in the grid
 */
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;
    
    if (GAMES_STATE.isLoading) {
        gamesGrid.innerHTML = `
            <div class="loading-games">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing games...</p>
            </div>
        `;
        return;
    }
    
    if (!games || games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-gamepad"></i>
                <h3>No Games Found</h3>
                <p>No games match your current filters</p>
                <button class="btn btn-primary" onclick="resetFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    gamesGrid.innerHTML = games.map(game => createGameCard(game)).join('');
    setupGameCardListeners();
    animateGameCards();
}

/**
 * Create HTML for game card
 */
function createGameCard(game) {
    const statusClass = game.status.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = game.image || `https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(game.name)}`;
    
    return `
        <div class="game-card" 
             data-game-id="${game.id}" 
             data-category="${game.category}" 
             data-status="${game.status}">
            
            <div class="game-image">
                <img src="${imageUrl}" 
                     alt="${game.name}"
                     loading="lazy">
                
                <div class="game-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-primary btn-view-details" 
                                data-game-id="${game.id}">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${game.status === 'Live' ? `
                            <button class="btn btn-secondary btn-play-now" 
                                    data-game-id="${game.id}">
                                <i class="fas fa-play"></i>
                                <span>Play Now</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="game-badge status-${statusClass}">${game.status}</div>
            </div>
            
            <div class="game-content">
                <div class="game-header">
                    <h3 class="game-title">${game.name}</h3>
                    ${game.rating > 0 ? `
                        <div class="game-rating">
                            <div class="rating-stars">${generateStars(game.rating)}</div>
                            <span class="rating-value">${game.rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="game-meta">
                    <span class="game-category">
                        <i class="fas fa-tag"></i>
                        ${game.category}
                    </span>
                    ${game.releaseDate ? `
                        <span class="game-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(game.releaseDate)}
                        </span>
                    ` : ''}
                </div>
                
                <p class="game-description">${game.overview || game.description || 'An exciting gaming experience awaits!'}</p>
                
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
                
                <div class="game-actions">
                    <button class="btn btn-primary btn-view-game" 
                            data-game-id="${game.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>Learn More</span>
                    </button>
                    ${game.repositoryUrl ? `
                        <a href="${game.repositoryUrl}" 
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
function setupGameFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    // Populate category filter
    if (categoryFilter) {
        const categories = [...new Set(GAMES_STATE.allGames.map(game => game.category).filter(Boolean))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        categoryFilter.addEventListener('change', function() {
            GAMES_STATE.currentFilters.category = this.value;
            applyFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            GAMES_STATE.currentFilters.status = this.value;
            applyFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            GAMES_STATE.currentFilters.sort = this.value;
            applyFilters();
        });
    }
}

/**
 * Apply all active filters
 */
function applyFilters() {
    let filtered = [...GAMES_STATE.allGames];
    
    // Category filter
    if (GAMES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(game => 
            game.category === GAMES_STATE.currentFilters.category
        );
    }
    
    // Status filter
    if (GAMES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(game => 
            game.status === GAMES_STATE.currentFilters.status
        );
    }
    
    // Apply sorting
    filtered = sortGames(filtered, GAMES_STATE.currentFilters.sort);
    
    GAMES_STATE.filteredGames = filtered;
    displayGames(filtered);
}

/**
 * Sort games by criteria
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

/**
 * Reset all filters
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
 * Setup event listeners
 */
function setupGameEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select')) return;
        
        if (e.key === 'r' || e.key === 'R') {
            resetFilters();
        }
    });
}

/**
 * Setup card interactions
 */
function setupGameCardListeners() {
    // View details buttons
    document.querySelectorAll('.btn-view-details, .btn-view-game').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            viewGameDetails(gameId);
        });
    });
    
    // Play now buttons
    document.querySelectorAll('.btn-play-now').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            playGame(gameId);
        });
    });
    
    // Card click
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const gameId = this.getAttribute('data-game-id');
                viewGameDetails(gameId);
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
 * Navigate to game details
 */
function viewGameDetails(gameId) {
    if (!gameId) {
        showNotification('Invalid game ID', 'error');
        return;
    }
    window.location.href = `game-detail.html?id=${gameId}`;
}

/**
 * Navigate to play game
 */
function playGame(gameId) {
    if (!gameId) {
        showNotification('Invalid game ID', 'error');
        return;
    }
    window.location.href = `game-detail.html?id=${gameId}&play=true`;
}

/**
 * Update header statistics
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
 * Animate cards entrance
 */
function animateGameCards() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * GAMES_STATE.animationDelay);
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

function formatNumber(num) {
    if (!num || num === 0) return '0';
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
            features: ["Multiplayer Racing", "Vehicle Customization", "Dynamic Weather", "VR Support"]
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
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

window.initializeGamesPage = initializeGamesPage;
window.resetFilters = resetFilters;
window.viewGameDetails = viewGameDetails;
window.playGame = playGame;
window.applyFilters = applyFilters;

console.log('✅ Games.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔧 Version: 2.0.0');