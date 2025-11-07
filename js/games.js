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
    updateHeaderStats();
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
        gamesGrid.innerHTML = `
            <div class="loading-games">
                <i class="fas fa-gamepad"></i>
                <p>No games available at the moment.</p>
            </div>
        `;
        return;
    }
    
    displayGames(currentGames);
}

// Display Games - SIMPLIFIED: Only image, title, status, rating
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;
    
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-games">
                <i class="fas fa-gamepad"></i>
                <p>No games match your filters</p>
                <button class="btn btn-primary" onclick="resetFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    gamesGrid.innerHTML = games.map(game => `
        <div class="game-card" data-game-id="${game.id}" data-category="${game.category}" data-status="${game.status}" data-rating="${game.rating}">
            <div class="game-image">
                <img src="${game.image}" alt="${game.name}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodeURIComponent(game.name)}'">
                <div class="game-overlay">
                    <div class="overlay-content">
                        <a href="game-detail.html?id=${game.id}" class="view-details-btn">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </a>
                    </div>
                </div>
                <div class="game-badge status-${game.status.toLowerCase().replace(' ', '-')}">${game.status}</div>
            </div>
            
            <div class="game-content">
                <h3 class="game-title">${game.name}</h3>
                <div class="game-meta">
                    <div class="game-rating">
                        <div class="rating-stars">${generateStars(game.rating)}</div>
                        <span class="rating-value">${game.rating}</span>
                    </div>
                    <span class="game-status status-${game.status.toLowerCase().replace(' ', '-')}">${game.status}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to game cards
    setupGameCardListeners();
    
    // Animate cards on load
    animateGameCards();
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
            showNotification(`Filtered by category: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            applyGameFilters();
            showNotification(`Filtered by status: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyGameFilters();
            showNotification(`Sorted by: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }
}

// Apply Filters
function applyGameFilters() {
    let filteredGames = getGames();
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filteredGames = filteredGames.filter(game => 
            game.category === currentFilters.category
        );
    }
    
    // Status filter
    if (currentFilters.status !== 'all') {
        filteredGames = filteredGames.filter(game => 
            game.status === currentFilters.status
        );
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
            return sortedGames.sort((a, b) => 
                new Date(b.releaseDate) - new Date(a.releaseDate)
            );
        case 'oldest':
            return sortedGames.sort((a, b) => 
                new Date(a.releaseDate) - new Date(b.releaseDate)
            );
        case 'rating':
            return sortedGames.sort((a, b) => b.rating - a.rating);
        case 'popular':
            return sortedGames.sort((a, b) => b.playCount - a.playCount);
        default:
            return sortedGames;
    }
}

// Reset Filters
function resetFilters() {
    currentFilters = {
        category: 'all',
        status: 'all',
        sort: 'newest'
    };
    
    // Reset select elements
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('sortFilter').value = 'newest';
    
    applyGameFilters();
    showNotification('Filters reset', 'success');
}

// Setup Game Event Listeners
function setupGameEventListeners() {
    // Search functionality (if search input exists)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                applyGameFilters();
                return;
            }
            
            const filteredGames = getGames().filter(game => 
                game.name.toLowerCase().includes(searchTerm) ||
                game.overview.toLowerCase().includes(searchTerm) ||
                game.category.toLowerCase().includes(searchTerm) ||
                game.description.toLowerCase().includes(searchTerm)
            );
            
            displayGames(filteredGames);
        }, 300));
    }
}

// Setup Game Card Listeners
function setupGameCardListeners() {
    // Card click (for whole card interaction)
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const gameId = parseInt(this.getAttribute('data-game-id'));
            viewGameDetails(gameId);
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// View Game Details
function viewGameDetails(gameId) {
    window.location.href = `game-detail.html?id=${gameId}`;
}

// Update Header Stats
function updateHeaderStats() {
    const allGames = getGames();
    
    // Calculate stats
    const totalGames = allGames.length;
    const averageRating = totalGames > 0 
        ? (allGames.reduce((sum, game) => sum + game.rating, 0) / totalGames).toFixed(1)
        : '0.0';
    const totalPlayers = allGames.reduce((sum, game) => sum + game.playCount, 0);
    
    // Update stat numbers
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalGames}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = formatNumber(totalPlayers);
    }
}

// Animate Game Cards
function animateGameCards() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });
}

// Utility: Generate Stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Utility: Format Number
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Make functions globally available
window.initializeGamesPage = initializeGamesPage;
window.resetFilters = resetFilters;
window.viewGameDetails = viewGameDetails;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGamesPage);
} else {
    initializeGamesPage();
}