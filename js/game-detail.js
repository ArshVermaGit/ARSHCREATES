// ==========================================
// GAME DETAIL PAGE - Individual game presentation
// Handles game preview, navigation, and interactions
// ==========================================

// Global Variables
let currentGameId = null;
let currentGame = null;
let gameImages = [];

// Initialize Game Detail Page
function initializeGameDetailPage() {
    // Get game ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentGameId = parseInt(urlParams.get('id'));
    
    if (!currentGameId) {
        showNotification('Game not found', 'error');
        setTimeout(() => window.location.href = 'games.html', 2000);
        return;
    }
    
    loadGameDetails(currentGameId);
    setupGameDetailEventListeners();
}

// Load Game Details
function loadGameDetails(gameId) {
    const game = PORTFOLIO_DATA.games.find(g => g.id === gameId);
    if (!game) {
        showNotification('Game not found', 'error');
        setTimeout(() => window.location.href = 'games.html', 2000);
        return;
    }
    
    currentGame = game;
    gameImages = [game.image, ...(game.screenshots || [])];
    
    displayGameDetails(game);
    setupGameNavigation();
}

// Display Game Details
function displayGameDetails(game) {
    // Update page title
    document.title = `${game.name} - Arsh Verma`;
    
    // Update preview image
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = game.image;
        previewImage.alt = game.name;
    }
    
    // Update game information
    document.getElementById('gameTitle').textContent = game.name;
    document.getElementById('gameCategory').textContent = game.category;
    document.getElementById('gameRating').textContent = game.rating;
    document.getElementById('gameStatus').textContent = game.status;
    
    document.getElementById('gameOverview').textContent = game.overview;
    document.getElementById('gameDescription').textContent = game.description;
    
    // Update details
    document.getElementById('releaseDate').textContent = formatDate(game.releaseDate);
    document.getElementById('developmentTime').textContent = game.developmentTime;
    document.getElementById('teamSize').textContent = game.teamSize;
    document.getElementById('likes').textContent = game.likes.toLocaleString();
    document.getElementById('playCount').textContent = game.playCount.toLocaleString();
    document.getElementById('platforms').textContent = game.platforms.join(', ');
    
    // Update features list
    const featuresList = document.getElementById('featuresList');
    if (featuresList) {
        featuresList.innerHTML = game.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
    }
    
    // Update technologies
    const techList = document.getElementById('techList');
    if (techList) {
        techList.innerHTML = game.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    }
    
    // Update stats circles
    document.getElementById('ratingCircle').textContent = game.rating;
    document.getElementById('playCountCircle').textContent = game.playCount.toLocaleString();
    document.getElementById('likesCircle').textContent = game.likes.toLocaleString();
    
    // Update repository button
    const repositoryBtn = document.getElementById('repositoryBtn');
    if (repositoryBtn) {
        repositoryBtn.href = game.repositoryUrl;
    }
    
    // Update play button state
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        if (game.status === 'In Development') {
            playBtn.innerHTML = '<i class="fas fa-clock"></i><span>Coming Soon</span>';
            playBtn.disabled = true;
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Game</span>';
            playBtn.onclick = () => playGame(game);
        }
    }
    
    // Load screenshots
    loadGameScreenshots(game);
}

// Load Game Screenshots
function loadGameScreenshots(game) {
    const screenshotsContainer = document.getElementById('appScreenshots');
    if (!screenshotsContainer || !game.screenshots) return;
    
    screenshotsContainer.innerHTML = game.screenshots.map((screenshot, index) => `
        <div class="screenshot-thumbnail" data-screenshot-index="${index}">
            <img src="${screenshot}" alt="${game.name} screenshot ${index + 1}" loading="lazy">
        </div>
    `).join('');
    
    // Add click event to thumbnails
    document.querySelectorAll('.screenshot-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-screenshot-index'));
            showScreenshot(index);
        });
    });
}

// Show Screenshot
function showScreenshot(index) {
    const previewImage = document.getElementById('previewImage');
    if (previewImage && gameImages[index]) {
        previewImage.src = gameImages[index];
    }
}

// Setup Game Detail Event Listeners
function setupGameDetailEventListeners() {
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareGame);
    }
    
    // Fullscreen button
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }
    
    // Close game button
    const closeGameBtn = document.getElementById('closeGameBtn');
    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', closeGame);
    }
    
    // Close preview button
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreview);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Setup Game Navigation
function setupGameNavigation() {
    const prevGameBtn = document.getElementById('prevGame');
    const nextGameBtn = document.getElementById('nextGame');
    
    if (prevGameBtn) {
        prevGameBtn.addEventListener('click', navigateToPreviousGame);
    }
    
    if (nextGameBtn) {
        nextGameBtn.addEventListener('click', navigateToNextGame);
    }
}

// Navigation Functions
function navigateToPreviousGame() {
    const games = PORTFOLIO_DATA.games;
    const currentIndex = games.findIndex(g => g.id === currentGameId);
    const prevIndex = (currentIndex - 1 + games.length) % games.length;
    const prevGame = games[prevIndex];
    
    window.location.href = `game-detail.html?id=${prevGame.id}`;
}

function navigateToNextGame() {
    const games = PORTFOLIO_DATA.games;
    const currentIndex = games.findIndex(g => g.id === currentGameId);
    const nextIndex = (currentIndex + 1) % games.length;
    const nextGame = games[nextIndex];
    
    window.location.href = `game-detail.html?id=${nextGame.id}`;
}

// Game Interaction Functions
function playGame(game) {
    if (game.playUrl) {
        // Open game in iframe or new tab
        const gameContainer = document.getElementById('gameContainer');
        const gameFrame = document.getElementById('gameFrame');
        
        if (gameContainer && gameFrame) {
            gameFrame.src = game.playUrl;
            gameContainer.style.display = 'block';
            
            // Hide preview image
            const previewImage = document.getElementById('previewImage');
            if (previewImage) {
                previewImage.style.display = 'none';
            }
            
            showNotification(`Starting ${game.name}...`, 'success');
        } else {
            // Fallback: open in new tab
            window.open(game.playUrl, '_blank');
        }
    }
}

function toggleFullscreen() {
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) return;
    
    if (!document.fullscreenElement) {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function restartGame() {
    const gameFrame = document.getElementById('gameFrame');
    if (gameFrame && gameFrame.src) {
        gameFrame.src = gameFrame.src;
        showNotification('Game restarted', 'info');
    }
}

function closeGame() {
    const gameContainer = document.getElementById('gameContainer');
    const gameFrame = document.getElementById('gameFrame');
    const previewImage = document.getElementById('previewImage');
    
    if (gameContainer) gameContainer.style.display = 'none';
    if (gameFrame) gameFrame.src = '';
    if (previewImage) previewImage.style.display = 'block';
    
    // Exit fullscreen if active
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

function closePreview() {
    window.location.href = 'games.html';
}

// Share Functionality
function shareGame() {
    if (navigator.share) {
        navigator.share({
            title: currentGame.name,
            text: currentGame.overview,
            url: window.location.href
        }).then(() => {
            showNotification('Game shared successfully', 'success');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Game link copied to clipboard', 'success');
    }).catch(() => {
        showNotification('Could not share game', 'error');
    });
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateToPreviousGame();
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextGame();
            break;
        case 'Escape':
            closeGame();
            break;
        case ' ':
        case 'Enter':
            if (currentGame.status === 'Live') {
                e.preventDefault();
                playGame(currentGame);
            }
            break;
    }
}

// Fullscreen change handler
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        const isFullscreen = !!document.fullscreenElement;
        fullscreenBtn.innerHTML = isFullscreen ? 
            '<i class="fas fa-compress"></i>' : 
            '<i class="fas fa-expand"></i>';
        fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
} else {
    initializeGameDetailPage();
}