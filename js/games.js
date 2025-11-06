// ==========================================
// GAMES PAGE - Games portfolio functionality
// Handles filtering, sorting, and game display
// ==========================================

// Global Variables
let currentGames = [];
let currentFilters = {
    category: 'all',
    status: 'all',
    sort: 'newest'
};

// Initialize Games Page
function initializeGamesPage() {
    console.log('Initializing games page...');
    loadGames();
    setupGameFilters();
    setupGameEventListeners();
}

// Load Games
function loadGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) {
        console.error('Games grid not found!');
        return;
    }
    
    // Use safe data access
    currentGames = getGames();
    console.log('Loaded games:', currentGames);
    
    if (currentGames.length === 0) {
        console.warn('No games found in portfolio data');
    }
    
    displayGames(currentGames);
    updateGameStats();
}


// Display Games
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;
    
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                <i class="fas fa-gamepad" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No games found</h3>
                <p style="color: var(--text-secondary);">Try adjusting your filters to see more results</p>
            </div>
        `;
        return;
    }
    
    gamesGrid.innerHTML = games.map(game => `
        <div class="portfolio-card" data-game-id="${game.id}">
            <div class="card-image">
                <img src="${game.image}" alt="${game.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/3c2a21/d5a46a?text=Game+Image'">
                <div class="card-overlay">
                    <div class="card-actions">
                        <button class="btn btn-primary btn-play" data-game-id="${game.id}" title="Play Game">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn btn-secondary btn-view" data-game-id="${game.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${game.name}</h3>
                        <span class="card-category">${game.category}</span>
                    </div>
                    <div class="card-rating">
                        ${generateStars(game.rating)}
                        <span>${game.rating}</span>
                    </div>
                </div>
                <p class="card-description">${game.overview}</p>
                <div class="card-meta">
                    <div class="card-stats">
                        <span><i class="fas fa-heart"></i> ${game.likes}</span>
                        <span><i class="fas fa-play-circle"></i> ${game.playCount}</span>
                    </div>
                    <span class="card-status ${game.status.toLowerCase().replace(' ', '-')}">
                        ${game.status}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to game cards
    setupGameCardListeners();
}

// Setup Game Filters
function setupGameFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyGameFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            applyGameFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyGameFilters();
        });
    }
}

// Apply Filters
function applyGameFilters() {
    let filteredGames = getGames();
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === currentFilters.category);
    }
    
    // Status filter
    if (currentFilters.status !== 'all') {
        filteredGames = filteredGames.filter(game => game.status === currentFilters.status);
    }
    
    // Sort games
    filteredGames = sortGames(filteredGames, currentFilters.sort);
    
    currentGames = filteredGames;
    displayGames(filteredGames);
}

// Sort Games
function sortGames(games, sortBy) {
    const sortedGames = [...games];
    switch (sortBy) {
        case 'newest':
            return sortedGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        case 'oldest':
            return sortedGames.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        case 'rating':
            return sortedGames.sort((a, b) => b.rating - a.rating);
        case 'popular':
            return sortedGames.sort((a, b) => b.playCount - a.playCount);
        default:
            return sortedGames;
    }
}

// Setup Game Event Listeners
function setupGameEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredGames = PORTFOLIO_DATA.games.filter(game => 
                game.name.toLowerCase().includes(searchTerm) ||
                game.overview.toLowerCase().includes(searchTerm) ||
                game.category.toLowerCase().includes(searchTerm)
            );
            displayGames(filteredGames);
        }, 300));
    }
}

// Setup Game Card Listeners
function setupGameCardListeners() {
    // Play buttons
    document.querySelectorAll('.btn-play').forEach(btn => {
        btn.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-game-id'));
            playGame(gameId);
        });
    });
    
    // View detail buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-game-id'));
            viewGameDetails(gameId);
        });
    });
    
    // Card click (for whole card interaction)
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.card-actions')) {
                const gameId = parseInt(this.getAttribute('data-game-id'));
                viewGameDetails(gameId);
            }
        });
    });
}

// Play Game
function playGame(gameId) {
    const game = PORTFOLIO_DATA.games.find(g => g.id === gameId);
    if (!game) return;
    
    if (game.status === 'In Development') {
        showNotification('This game is still in development. Coming soon!', 'info');
        return;
    }
    
    // Open game in new tab or iframe
    if (game.playUrl) {
        window.open(game.playUrl, '_blank');
        showNotification(`Opening ${game.name}...`, 'success');
    } else {
        showNotification('Game URL not available', 'error');
    }
}

// View Game Details
function viewGameDetails(gameId) {
    navigateToDetailPage('game', gameId);
}

// Update Game Stats
function updateGameStats() {
    const totalGames = document.querySelector('.stat-number');
    if (totalGames) {
        totalGames.textContent = PORTFOLIO_DATA.games.length;
    }
}

// Make functions globally available
window.initializeGamesPage = initializeGamesPage;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGamesPage);
} else {
    initializeGamesPage();
}