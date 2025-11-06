// ==========================================
// GAME DETAIL PAGE - Individual game presentation
// Handles game preview, navigation, and interactions
// ==========================================

// Global Variables
let currentGameId = null;
let currentGame = null;
let gameImages = [];
let isGamePlaying = false;

// Initialize Game Detail Page
function initializeGameDetailPage() {
    console.log('Initializing game detail page...');
    
    // Get game ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentGameId = parseInt(urlParams.get('id'));
    const autoPlay = urlParams.get('play') === 'true';
    
    if (!currentGameId || isNaN(currentGameId)) {
        showNotification('Game not found', 'error');
        setTimeout(() => window.location.href = 'games.html', 2000);
        return;
    }
    
    loadGameDetails(currentGameId);
    setupGameDetailEventListeners();
    
    // Auto-play if requested
    if (autoPlay) {
        setTimeout(() => {
            if (currentGame && currentGame.status === 'Live') {
                playGameEmbed(currentGame);
            }
        }, 500);
    }
}

// Load Game Details
function loadGameDetails(gameId) {
    const games = getGames();
    const game = games.find(g => g.id === gameId);
    
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
    
    // Update game title and meta
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) gameTitle.textContent = game.name;
    
    const gameCategory = document.getElementById('gameCategory');
    if (gameCategory) gameCategory.textContent = game.category;
    
    const gameRating = document.getElementById('gameRating');
    if (gameRating) gameRating.textContent = game.rating;
    
    const gameStatus = document.getElementById('gameStatus');
    if (gameStatus) {
        gameStatus.textContent = game.status;
        gameStatus.className = 'game-status ' + (game.status === 'Live' ? 'status-live' : 'status-dev');
    }
    
    // Update overview and description
    const gameOverview = document.getElementById('gameOverview');
    if (gameOverview) gameOverview.textContent = game.overview;
    
    const gameDescription = document.getElementById('gameDescription');
    if (gameDescription) gameDescription.textContent = game.description;
    
    // Update detail cards
    updateDetailCard('releaseDate', formatDate(game.releaseDate));
    updateDetailCard('developmentTime', game.developmentTime);
    updateDetailCard('teamSize', game.teamSize);
    updateDetailCard('likes', game.likes.toLocaleString());
    updateDetailCard('playCount', game.playCount.toLocaleString());
    updateDetailCard('platforms', game.platforms.join(', '));
    
    // Update features list
    const featuresList = document.getElementById('featuresList');
    if (featuresList && game.features) {
        featuresList.innerHTML = game.features.map(feature => 
            `<li><span>${feature}</span></li>`
        ).join('');
    }
    
    // Update technologies
    const techList = document.getElementById('techList');
    if (techList && game.technologies) {
        techList.innerHTML = game.technologies.map(tech => 
            `<span>${tech}</span>`
        ).join('');
    }
    
    // Update stats circles
    updateStatCircle('ratingCircle', game.rating.toString());
    updateStatCircle('playCountCircle', formatStatNumber(game.playCount));
    updateStatCircle('likesCircle', formatStatNumber(game.likes));
    
    // Update repository button
    const repositoryBtn = document.getElementById('repositoryBtn');
    if (repositoryBtn && game.repositoryUrl) {
        repositoryBtn.href = game.repositoryUrl;
        repositoryBtn.style.display = 'flex';
    } else if (repositoryBtn) {
        repositoryBtn.style.display = 'none';
    }
    
    // Update play button state
    updatePlayButton(game);
    
    // Animate content
    animateGameDetails();
}

// Update Detail Card
function updateDetailCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

// Update Stat Circle
function updateStatCircle(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '0';
    }
}

// Update Play Button
function updatePlayButton(game) {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) return;
    
    if (game.status === 'In Development') {
        playBtn.innerHTML = '<i class="fas fa-clock"></i><span>Coming Soon</span>';
        playBtn.disabled = true;
        playBtn.style.cursor = 'not-allowed';
        playBtn.style.opacity = '0.6';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Game</span>';
        playBtn.disabled = false;
        playBtn.style.cursor = 'pointer';
        playBtn.style.opacity = '1';
        playBtn.onclick = () => playGameEmbed(game);
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
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Fullscreen change handlers
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
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
    const games = getGames();
    const currentIndex = games.findIndex(g => g.id === currentGameId);
    
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + games.length) % games.length;
    const prevGame = games[prevIndex];
    
    window.location.href = `game-detail.html?id=${prevGame.id}`;
}

function navigateToNextGame() {
    const games = getGames();
    const currentIndex = games.findIndex(g => g.id === currentGameId);
    
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % games.length;
    const nextGame = games[nextIndex];
    
    window.location.href = `game-detail.html?id=${nextGame.id}`;
}

// Game Interaction Functions
function playGameEmbed(game) {
    if (!game.playUrl) {
        showNotification('Game URL not available', 'error');
        return;
    }
    
    const gameContainer = document.getElementById('gameContainer');
    const gameFrame = document.getElementById('gameFrame');
    const previewImage = document.querySelector('.preview-image');
    
    if (gameContainer && gameFrame) {
        // Show game container
        gameContainer.classList.add('active');
        gameFrame.src = game.playUrl;
        isGamePlaying = true;
        
        // Hide preview overlay
        if (previewImage) {
            const overlay = previewImage.querySelector('.preview-overlay');
            if (overlay) overlay.style.display = 'none';
        }
        
        showNotification(`Starting ${game.name}...`, 'success');
    } else {
        // Fallback: open in new tab
        window.open(game.playUrl, '_blank');
        showNotification(`Opening ${game.name} in new tab`, 'info');
    }
}

function toggleFullscreen() {
    const gamePreview = document.querySelector('.game-preview');
    if (!gamePreview) return;
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && !document.msFullscreenElement) {
        // Enter fullscreen
        if (gamePreview.requestFullscreen) {
            gamePreview.requestFullscreen();
        } else if (gamePreview.webkitRequestFullscreen) {
            gamePreview.webkitRequestFullscreen();
        } else if (gamePreview.mozRequestFullScreen) {
            gamePreview.mozRequestFullScreen();
        } else if (gamePreview.msRequestFullscreen) {
            gamePreview.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function restartGame() {
    const gameFrame = document.getElementById('gameFrame');
    if (gameFrame && gameFrame.src && isGamePlaying) {
        const currentSrc = gameFrame.src;
        gameFrame.src = '';
        setTimeout(() => {
            gameFrame.src = currentSrc;
        }, 100);
        showNotification('Game restarted', 'info');
    } else {
        showNotification('No game is currently playing', 'warning');
    }
}

function closeGame() {
    const gameContainer = document.getElementById('gameContainer');
    const gameFrame = document.getElementById('gameFrame');
    const previewImage = document.querySelector('.preview-image');
    
    if (gameContainer) {
        gameContainer.classList.remove('active');
    }
    
    if (gameFrame) {
        gameFrame.src = '';
    }
    
    if (previewImage) {
        const overlay = previewImage.querySelector('.preview-overlay');
        if (overlay) overlay.style.display = 'flex';
    }
    
    isGamePlaying = false;
    
    // Exit fullscreen if active
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    
    showNotification('Game closed', 'info');
}

// Share Functionality
function shareGame() {
    if (!currentGame) return;
    
    const shareData = {
        title: currentGame.name,
        text: currentGame.overview,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                showNotification('Game shared successfully', 'success');
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    fallbackShare();
                }
            });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    // Copy URL to clipboard
    const url = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Game link copied to clipboard', 'success');
            })
            .catch(() => {
                showNotification('Could not copy link', 'error');
            });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Game link copied to clipboard', 'success');
        } catch (err) {
            showNotification('Could not copy link', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // Ignore if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
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
            if (isGamePlaying) {
                closeGame();
            }
            break;
        case ' ':
        case 'Enter':
            if (!isGamePlaying && currentGame && currentGame.status === 'Live') {
                e.preventDefault();
                playGameEmbed(currentGame);
            }
            break;
        case 'f':
        case 'F':
            if (isGamePlaying) {
                e.preventDefault();
                toggleFullscreen();
            }
            break;
        case 'r':
        case 'R':
            if (isGamePlaying) {
                e.preventDefault();
                restartGame();
            }
            break;
    }
}

// Fullscreen Change Handler
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                            document.mozFullScreenElement || document.msFullscreenElement);
    
    fullscreenBtn.innerHTML = isFullscreen ? 
        '<i class="fas fa-compress"></i>' : 
        '<i class="fas fa-expand"></i>';
    fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';
}

// Animate Game Details
function animateGameDetails() {
    const elements = document.querySelectorAll('.detail-card, .features-list li, .tech-tags span, .stat-item');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatStatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Make functions globally available
window.initializeGameDetailPage = initializeGameDetailPage;
window.playGameEmbed = playGameEmbed;
window.shareGame = shareGame;
window.navigateToPreviousGame = navigateToPreviousGame;
window.navigateToNextGame = navigateToNextGame;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
} else {
    initializeGameDetailPage();
}