// ==========================================
// GAMES PAGE - COMPLETE & PERFECT IMPLEMENTATION
// Handles all game portfolio functionality
// ==========================================

// ==========================================
// GLOBAL STATE
// ==========================================
const GAMES_STATE = {
    allGames: [],
    filteredGames: [],
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
    console.log('🎮 Games page initializing...');
    initializeGamesPage();
});

function initializeGamesPage() {
    try {
        // 1. Load all games from data.js
        loadGamesData();
        
        // 2. Setup filter controls
        setupGameFilters();
        
        // 3. Setup event listeners
        setupGameEventListeners();
        
        // 4. Update header statistics
        updateHeaderStats();
        
        // 5. Display games
        displayGames(GAMES_STATE.allGames);
        
        // 6. Hide loading screen
        setTimeout(hideLoadingScreen, 800);
        
        console.log('✅ Games page initialized successfully');
        console.log(`📊 Loaded ${GAMES_STATE.allGames.length} games`);
        
    } catch (error) {
        console.error('❌ Error initializing games page:', error);
        showNotification('Failed to load games', 'error');
        hideLoadingScreen();
    }
}

// ==========================================
// DATA LOADING
// ==========================================
function loadGamesData() {
    try {
        // Get games from data.js (using global PORTFOLIO_DATA or window.getGames())
        if (typeof window.getGames === 'function') {
            GAMES_STATE.allGames = window.getGames();
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && PORTFOLIO_DATA.games) {
            GAMES_STATE.allGames = PORTFOLIO_DATA.games;
        } else {
            // Fallback: Create sample data if no data exists
            console.warn('⚠️ No games data found, using fallback');
            GAMES_STATE.allGames = createSampleGames();
        }
        
        GAMES_STATE.filteredGames = [...GAMES_STATE.allGames];
        
        console.log('📦 Games loaded:', GAMES_STATE.allGames.length);
        
    } catch (error) {
        console.error('❌ Error loading games:', error);
        GAMES_STATE.allGames = [];
        GAMES_STATE.filteredGames = [];
    }
}

// ==========================================
// DISPLAY GAMES
// ==========================================
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    
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
    
    // Show empty state
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
    gamesGrid.innerHTML = games.map(game => createGameCard(game)).join('');
    
    // Setup card interactions
    setupGameCardListeners();
    
    // Animate cards entrance
    animateGameCards();
    
    console.log(`✅ Displayed ${games.length} games`);
}

// ==========================================
// CREATE GAME CARD HTML
// ==========================================
function createGameCard(game) {
    const statusClass = game.status.toLowerCase().replace(/\s+/g, '-');
    const starsHTML = generateStars(game.rating);
    
    return `
        <div class="game-card" 
             data-game-id="${game.id}" 
             data-category="${game.category}" 
             data-status="${game.status}" 
             data-rating="${game.rating}">
            
            <!-- Game Image -->
            <div class="game-image">
                <img src="${game.image || 'assets/images/games/default.jpg'}" 
                     alt="${game.name}"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(game.name)}'">
                
                <!-- Hover Overlay -->
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
                <div class="game-badge status-${statusClass}">${game.status}</div>
            </div>
            
            <!-- Game Content -->
            <div class="game-content">
                <div class="game-header">
                    <h3 class="game-title">${game.name}</h3>
                    <div class="game-rating">
                        <div class="rating-stars">${starsHTML}</div>
                        <span class="rating-value">${game.rating}</span>
                    </div>
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
// ==========================================
function setupGameFilters() {
    console.log('🔧 Setting up game filters...');
    
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
    const categories = [...new Set(GAMES_STATE.allGames.map(game => game.category))];
    
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
        GAMES_STATE.currentFilters.category = this.value;
        applyFilters();
        
        console.log('📂 Category filter changed:', this.value);
    });
}

function setupStatusFilter() {
    const statusFilter = document.getElementById('statusFilter');
    
    if (!statusFilter) return;
    
    statusFilter.addEventListener('change', function() {
        GAMES_STATE.currentFilters.status = this.value;
        applyFilters();
        
        console.log('📊 Status filter changed:', this.value);
    });
}

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
// ==========================================
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
    
    // Apply search filter
    if (GAMES_STATE.currentFilters.search) {
        const searchTerm = GAMES_STATE.currentFilters.search;
        filtered = filtered.filter(game => 
            game.name.toLowerCase().includes(searchTerm) ||
            (game.overview && game.overview.toLowerCase().includes(searchTerm)) ||
            (game.description && game.description.toLowerCase().includes(searchTerm)) ||
            game.category.toLowerCase().includes(searchTerm) ||
            (game.features && game.features.some(f => f.toLowerCase().includes(searchTerm)))
        );
    }
    
    // Apply sorting
    filtered = sortGames(filtered, GAMES_STATE.currentFilters.sort);
    
    GAMES_STATE.filteredGames = filtered;
    displayGames(filtered);
    
    console.log(`🎯 Filters applied: ${filtered.length} games shown`);
}

// ==========================================
// SORT GAMES
// ==========================================
function sortGames(games, sortBy) {
    const sorted = [...games];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => 
                new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0)
            );
            
        case 'oldest':
            return sorted.sort((a, b) => 
                new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0)
            );
            
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
            
        case 'popular':
            return sorted.sort((a, b) => 
                (b.playCount || 0) - (a.playCount || 0)
            );
            
        default:
            return sorted;
    }
}

// ==========================================
// RESET FILTERS
// ==========================================
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
    
    // Reapply filters (which will show all games)
    applyFilters();
    
    showNotification('Filters reset successfully', 'success');
}

// ==========================================
// GAME CARD INTERACTIONS
// ==========================================
function setupGameCardListeners() {
    // View Details Buttons
    document.querySelectorAll('.btn-view-details, .btn-view-game').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            viewGameDetails(gameId);
        });
    });
    
    // Play Now Buttons
    document.querySelectorAll('.btn-play-now').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            playGame(gameId);
        });
    });
    
    // Card Click (entire card clickable)
    document.querySelectorAll('.game-card').forEach(card => {
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
// ==========================================
function setupGameEventListeners() {
    // Window resize handler
    window.addEventListener('resize', debounce(function() {
        // Reattach listeners if needed
        setupGameCardListeners();
    }, 250));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'R' to reset filters
        if (e.key === 'r' || e.key === 'R') {
            if (!e.target.matches('input, textarea')) {
                resetFilters();
            }
        }
    });
    
    console.log('✅ Event listeners initialized');
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================
function viewGameDetails(gameId) {
    console.log('🎮 Viewing game details:', gameId);
    
    if (!gameId) {
        showNotification('Invalid game ID', 'error');
        return;
    }
    
    // Navigate to game detail page
    window.location.href = `game-detail.html?id=${gameId}`;
}

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
// ==========================================
function updateHeaderStats() {
    const allGames = GAMES_STATE.allGames;
    
    if (allGames.length === 0) return;
    
    // Calculate statistics
    const totalGames = allGames.length;
    const averageRating = (allGames.reduce((sum, game) => sum + game.rating, 0) / totalGames).toFixed(1);
    const totalPlayers = allGames.reduce((sum, game) => sum + (game.playCount || 0), 0);
    
    // Update UI
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalGames}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalPlayers);
    }
    
    console.log('📊 Stats updated:', { totalGames, averageRating, totalPlayers });
}

// ==========================================
// ANIMATIONS
// ==========================================
function animateGameCards() {
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate with stagger
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * GAMES_STATE.animationDelay);
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
// ==========================================
window.initializeGamesPage = initializeGamesPage;
window.resetFilters = resetFilters;
window.viewGameDetails = viewGameDetails;
window.playGame = playGame;
window.applyFilters = applyFilters;

// ==========================================
// AUTO-INITIALIZE
// ==========================================
console.log('✅ Games.js loaded successfully');