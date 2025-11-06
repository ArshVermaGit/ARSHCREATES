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
    loadGames();
    setupGameFilters();
    setupGameEventListeners();
}

// Load Games
function loadGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;
    
    currentGames = PORTFOLIO_DATA.games;
    displayGames(currentGames);
    updateGameStats();
}

// Display Games
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;
    
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-gamepad"></i>
                <h3>No games found</h3>
                <p>Try adjusting your filters to see more results</p>
            </div>
        `;
        return;
    }
    
    gamesGrid.innerHTML = games.map(game => `
        <div class="portfolio-card" data-game-id="${game.id}">
            <div class="card-image">
                <img src="${game.image}" alt="${game.name}" loading="lazy">
                <div class="card-overlay">
                    <div class="card-actions">
                        <button class="btn-play" data-game-id="${game.id}" title="Play Game">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-view" data-game-id="${game.id}" title="View Details">
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
    let filteredGames = [...PORTFOLIO_DATA.games];
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === currentFilters.category);
    }
    
    // Status filter
    if (currentFilters.status !== 'all') {
        filteredGames = filteredGames.filter(game => game.status === currentFilters.status);
    }
    
    // Sort games
    filteredGames = sortItems(filteredGames, currentFilters.sort);
    
    currentGames = filteredGames;
    displayGames(filteredGames);
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
        
        // Update play count (in a real app, this would be server-side)
        game.playCount++;
        updateGameStats();
    }
}

// View Game Details
function viewGameDetails(gameId) {
    // Navigate to game detail page
    window.location.href = `game-detail.html?id=${gameId}`;
}

// Update Game Stats
function updateGameStats() {
    const totalGames = document.getElementById('totalGames');
    const liveGames = document.getElementById('liveGames');
    const totalPlayers = document.getElementById('totalPlayers');
    
    if (totalGames) {
        totalGames.textContent = PORTFOLIO_DATA.games.length;
    }
    
    if (liveGames) {
        const liveCount = PORTFOLIO_DATA.games.filter(game => game.status === 'Live').length;
        liveGames.textContent = liveCount;
    }
    
    if (totalPlayers) {
        const totalPlayCount = PORTFOLIO_DATA.games.reduce((sum, game) => sum + game.playCount, 0);
        totalPlayers.textContent = totalPlayCount.toLocaleString();
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGamesPage);
} else {
    initializeGamesPage();
}