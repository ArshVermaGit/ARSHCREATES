// ==========================================
// GAMES PORTFOLIO - FIXED VERSION
// Author: Arsh Verma
// Version: 7.0.0 - Auto-loads from data.js
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// ==========================================
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

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Games Portfolio...');
    initializeGamesPage();
});

function initializeGamesPage() {
    try {
        initializeTheme();
        
        GAMES_STATE.isLoading = true;
        showLoadingState();
        
        loadGamesData();
        setupGameFilters();
        setupGameEventListeners();
        updateHeaderStats();
        
        setTimeout(() => {
            GAMES_STATE.isLoading = false;
            applyFilters();
            hideLoadingState();
            console.log('✅ Games portfolio initialized');
        }, 600);
        
    } catch (error) {
        console.error('❌ Error initializing:', error);
        showNotification('Failed to load games portfolio. Please refresh.', 'error');
        GAMES_STATE.isLoading = false;
        displayErrorState();
    }
}

// ==========================================
// THEME MANAGEMENT
// ==========================================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log(`🎨 Theme initialized: ${savedTheme}`);
        
    } catch (error) {
        console.error('❌ Theme error:', error);
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('#themeToggle .theme-icon i');
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log(`🎨 Theme toggled: ${newTheme}`);
        
    } catch (error) {
        console.error('❌ Theme toggle error:', error);
    }
}

// ==========================================
// GAME DATA LOADING
// ==========================================
function loadGamesData() {
    try {
        let gamesData = [];
        
        if (typeof window.getGames === 'function') {
            gamesData = window.getGames();
            console.log('📥 Loaded from getGames():', gamesData.length);
        } else if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.games)) {
            gamesData = window.PORTFOLIO_DATA.games;
            console.log('📥 Loaded from PORTFOLIO_DATA:', gamesData.length);
        } else {
            console.warn('⚠️ No data source found, using empty array');
            gamesData = [];
        }
        
        GAMES_STATE.allGames = validateGamesData(gamesData);
        GAMES_STATE.filteredGames = [...GAMES_STATE.allGames];
        
        console.log('🎮 Games loaded:', GAMES_STATE.allGames.length);
        
    } catch (error) {
        console.error('❌ Error loading games:', error);
        GAMES_STATE.allGames = [];
        GAMES_STATE.filteredGames = [];
    }
}

function validateGamesData(games) {
    if (!Array.isArray(games)) {
        console.warn('⚠️ Invalid games data: expected array');
        return [];
    }
    
    return games.map((game, index) => ({
        id: game.id || `game-${Date.now()}-${index}`,
        name: (game.name || 'Untitled Game').trim(),
        category: game.category || 'Uncategorized',
        status: game.status || 'In Development',
        overview: game.overview || game.description || 'An immersive gaming experience.',
        releaseDate: game.releaseDate || null,
        rating: Math.min(5, Math.max(0, game.rating || 0)),
        playCount: Math.max(0, game.playCount || 0),
        image: game.image || generatePlaceholderImage(game.name || 'Game'),
        features: Array.isArray(game.features) ? game.features.slice(0, 5) : 
                  ['Engaging Gameplay', 'Stunning Visuals', 'Immersive Experience'],
        repositoryUrl: game.repositoryUrl || null,
        playUrl: game.playUrl || null,
        unityBuild: game.unityBuild || { enabled: false }
    })).filter(game => game.id && game.name);
}

function generatePlaceholderImage(name) {
    const encodedName = encodeURIComponent(name.substring(0, 20));
    return `https://via.placeholder.com/600x350/1A1A2E/FFB800?text=${encodedName}`;
}

// ==========================================
// UI LOADING STATES
// ==========================================
function showLoadingState() {
    const gamesGrid = document.getElementById('gamesGrid');
    if (gamesGrid) {
        gamesGrid.innerHTML = `
            <div class="loading-games">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading amazing games...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    const loadingElement = document.querySelector('.loading-games');
    if (loadingElement) {
        loadingElement.style.opacity = '0';
        loadingElement.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
            if (loadingElement.parentNode) {
                loadingElement.remove();
            }
        }, 400);
    }
}

function displayErrorState() {
    const gamesGrid = document.getElementById('gamesGrid');
    if (gamesGrid) {
        gamesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Games</h3>
                <p>There was an error loading the games portfolio.</p>
                <button class="btn btn-primary" onclick="retryLoading()">
                    <i class="fas fa-redo"></i>
                    <span>Retry Loading</span>
                </button>
            </div>
        `;
    }
}

function retryLoading() {
    showNotification('Retrying to load games...', 'info');
    initializeGamesPage();
}

// ==========================================
// UI RENDERING
// ==========================================
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) {
        console.error('❌ Games grid not found');
        return;
    }
    
    gamesGrid.innerHTML = '';
    
    if (GAMES_STATE.isLoading) {
        showLoadingState();
        return;
    }
    
    if (!games || games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-gamepad"></i>
                <h3>No Games Found</h3>
                <p>No games match your current filters. Try adjusting them to see more.</p>
                <button class="btn btn-primary" onclick="resetFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    games.forEach((game, index) => {
        const gameCard = createGameCard(game);
        const cardElement = createElementFromHTML(gameCard);
        
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(30px)';
        cardElement.style.animationDelay = `${index * GAMES_STATE.animationDelay}ms`;
        
        gamesGrid.appendChild(cardElement);
        
        setTimeout(() => {
            cardElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            cardElement.style.opacity = '1';
            cardElement.style.transform = 'translateY(0)';
        }, index * GAMES_STATE.animationDelay);
    });
    
    setTimeout(() => {
        setupGameCardListeners();
        console.log(`🎮 Displayed ${games.length} games`);
    }, 100);
}

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function createGameCard(game) {
    const statusClass = game.status.toLowerCase().replace(/\s+/g, '-');
    const shortOverview = (game.overview || '').length > 120 
        ? game.overview.substring(0, 120) + '...' 
        : game.overview;
    
    // Determine if game is playable
    const isPlayable = game.status === 'Live' && 
                      ((game.unityBuild && game.unityBuild.enabled) || game.playUrl);
    
    return `
        <article class="game-card" 
                 data-game-id="${game.id}" 
                 data-category="${game.category}" 
                 data-status="${game.status}"
                 role="article"
                 tabindex="0">
            
            <div class="game-image">
                <img src="${game.image}" 
                     alt="${game.name} - Game preview"
                     loading="lazy"
                     onerror="this.src='${generatePlaceholderImage(game.name)}'">
                
                <div class="game-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-view-details" 
                                data-game-id="${game.id}">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${isPlayable ? `
                            <button class="btn btn-play-now" 
                                    data-game-id="${game.id}">
                                <i class="fas fa-play"></i>
                                <span>Play Now</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="game-badge status-${statusClass}">
                    ${game.status}
                </div>
            </div>
            
            <div class="game-content">
                <header class="game-header">
                    <h3 class="game-title">${game.name}</h3>
                    ${game.rating > 0 ? `
                        <div class="game-rating">
                            <div class="rating-stars">${generateStars(game.rating)}</div>
                            <span class="rating-value">${game.rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                </header>
                
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
                
                <p class="game-description">${escapeHtml(shortOverview)}</p>
                
                ${game.features && game.features.length > 0 ? `
                    <div class="game-features">
                        ${game.features.slice(0, 3).map(feature => `
                            <span class="game-feature">
                                <i class="fas fa-check"></i>
                                ${escapeHtml(feature)}
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
        </article>
    `;
}

// ==========================================
// FILTERING & SORTING
// ==========================================
function setupGameFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!categoryFilter || !statusFilter || !sortFilter) {
        console.warn('⚠️ Filter elements not found');
        return;
    }
    
    const categories = [...new Set(GAMES_STATE.allGames.map(g => g.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    function handleFilterChange() {
        GAMES_STATE.currentFilters.category = categoryFilter.value;
        GAMES_STATE.currentFilters.status = statusFilter.value;
        GAMES_STATE.currentFilters.sort = sortFilter.value;
        applyFilters();
    }
    
    categoryFilter.addEventListener('change', handleFilterChange);
    statusFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    
    console.log('✅ Filters setup completed');
}

function applyFilters() {
    if (GAMES_STATE.isLoading) return;
    
    let filtered = [...GAMES_STATE.allGames];
    
    if (GAMES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(g => g.category === GAMES_STATE.currentFilters.category);
    }
    
    if (GAMES_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(g => g.status === GAMES_STATE.currentFilters.status);
    }
    
    filtered = sortGames(filtered, GAMES_STATE.currentFilters.sort);
    
    GAMES_STATE.filteredGames = filtered;
    displayGames(filtered);
    
    const resultsText = filtered.length === 1 ? 'game' : 'games';
    showNotification(`Showing ${filtered.length} ${resultsText}`, 'info', 2000);
}

function sortGames(games, sortBy) {
    const sorted = [...games];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => {
                const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
                const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
                return dateB - dateA;
            });
            
        case 'oldest':
            return sorted.sort((a, b) => {
                const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
                const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
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

// ==========================================
// EVENT HANDLERS
// ==========================================
function setupGameEventListeners() {
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select, button')) return;
        
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            resetFilters();
        }
    });
}

function setupGameCardListeners() {
    document.querySelectorAll('.btn-view-details, .btn-view-game').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            buttonClickAnimation(this);
            viewGameDetails(gameId);
        });
    });
    
    document.querySelectorAll('.btn-play-now').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameId = this.getAttribute('data-game-id');
            buttonClickAnimation(this);
            playGame(gameId);
        });
    });
    
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const gameId = this.getAttribute('data-game-id');
                viewGameDetails(gameId);
            }
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const gameId = this.getAttribute('data-game-id');
                viewGameDetails(gameId);
            }
        });
    });
}

function buttonClickAnimation(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
}

function viewGameDetails(gameId) {
    if (!gameId) {
        showNotification('Invalid game selection', 'error');
        return;
    }
    
    const game = GAMES_STATE.allGames.find(g => g.id == gameId);
    if (!game) {
        showNotification('Game not found', 'error');
        return;
    }
    
    console.log(`🔍 Viewing: ${game.name}`);
    window.location.href = `game-detail.html?id=${gameId}`;
}

function playGame(gameId) {
    if (!gameId) {
        showNotification('Invalid game selection', 'error');
        return;
    }
    
    const game = GAMES_STATE.allGames.find(g => g.id == gameId);
    if (!game) {
        showNotification('Game not found', 'error');
        return;
    }
    
    if (game.status !== 'Live') {
        showNotification(`${game.name} is still in development!`, 'info');
        return;
    }
    
    console.log(`🎮 Playing: ${game.name}`);
    window.location.href = `game-detail.html?id=${gameId}&play=true`;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const hasFullExtra = rating % 1 > 0.7;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) - (hasFullExtra ? 1 : 0);
    
    let html = '';
    
    for (let i = 0; i < fullStars + (hasFullExtra ? 1 : 0); i++) {
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

function formatDate(dateString) {
    if (!dateString) return 'Coming Soon';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Coming Soon';
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (error) {
        return 'Coming Soon';
    }
}

function updateHeaderStats() {
    const allGames = GAMES_STATE.allGames;
    if (allGames.length === 0) return;
    
    const totalGames = allGames.length;
    const avgRating = (allGames.reduce((sum, g) => sum + (g.rating || 0), 0) / totalGames).toFixed(1);
    const totalPlayers = allGames.reduce((sum, g) => sum + (g.playCount || 0), 0);
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        animateValue(statNumbers[0], 0, totalGames, 1500, '+');
        animateValue(statNumbers[1], 0, parseFloat(avgRating), 1500, '');
        animateValue(statNumbers[2], 0, totalPlayers, 1500, '+');
    }
}

function animateValue(element, start, end, duration, suffix = '') {
    if (!element) return;
    
    const range = Math.abs(end - start);
    const stepTime = Math.max(Math.floor(duration / range), 20);
    const isDecimal = end % 1 !== 0;
    let current = start;
    
    const timer = setInterval(() => {
        current += (end > start ? 1 : -1) * (isDecimal ? 0.1 : 1);
        
        if ((end > start && current >= end) || (end < start && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, stepTime);
}

function showNotification(message, type = 'info', duration = 3000) {
    try {
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 6rem;
                right: 1.5rem;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-message">${escapeHtml(message)}</div>
            </div>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
        
    } catch (error) {
        console.error('❌ Notification error:', error);
    }
}

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

// ==========================================
// GLOBAL EXPORTS
// ==========================================
window.initializeGamesPage = initializeGamesPage;
window.resetFilters = resetFilters;
window.viewGameDetails = viewGameDetails;
window.playGame = playGame;
window.applyFilters = applyFilters;
window.retryLoading = retryLoading;

console.log('🎮 Games portfolio JavaScript loaded!');