// ==========================================
// GAME DETAIL PAGE - FIXED VERSION
// Handles Unity WebGL game loading and display
// ==========================================

// Global Variables
let currentGameId = null;
let currentGame = null;
let isGamePlaying = false;
let unityInstance = null;

// Unity WebGL Build Configuration - CORRECTED PATHS
const unityBuilds = {
    "static/games_files/sky_surfers/": {
        loaderUrl: "static/games_files/sky_surfers/Build/sky_surfers.loader.js",
        dataUrl: "static/games_files/sky_surfers/Build/sky_surfers.data",
        frameworkUrl: "static/games_files/sky_surfers/Build/sky_surfers.framework.js",
        codeUrl: "static/games_files/sky_surfers/Build/sky_surfers.wasm",
        companyName: "ArshCreates",
        productName: "Sky Surfers",
        productVersion: "1.0"
    }
};

// Initialize Game Detail Page
function initializeGameDetailPage() {
    console.log('Initializing game detail page...');
    
    try {
        // Initialize theme first
        initializeTheme();
        
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
                if (currentGame && currentGame.status === 'Live' && currentGame.unityBuild) {
                    playGameUnity(currentGame);
                }
            }, 1500);
        }
        
        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
    } catch (error) {
        console.error('Error initializing game detail page:', error);
        showNotification('Error loading game page', 'error');
    }
}

// Initialize Theme
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    } catch (error) {
        console.error('Error initializing theme:', error);
    }
}

// Toggle Theme
function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('.theme-icon i');
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

// Load Game Details
function loadGameDetails(gameId) {
    try {
        const games = getGames();
        if (!games || !Array.isArray(games)) {
            throw new Error('Games data not available');
        }
        
        const game = games.find(g => g.id === gameId);
        
        if (!game) {
            showNotification('Game not found', 'error');
            setTimeout(() => window.location.href = 'games.html', 2000);
            return;
        }
        
        currentGame = game;
        displayGameDetails(game);
        setupGameNavigation();
    } catch (error) {
        console.error('Error loading game details:', error);
        showNotification('Error loading game details', 'error');
    }
}

// Display Game Details
function displayGameDetails(game) {
    try {
        // Update page title
        document.title = `${game.name} - Arsh Verma`;
        
        // Update preview image
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = game.image || 'https://via.placeholder.com/1200x675/393E41/FFFFFF?text=Game+Preview';
            previewImage.alt = game.name;
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/1200x675/393E41/FFFFFF?text=Game+Preview';
            };
        }
        
        // Update game title and meta
        const gameTitle = document.getElementById('gameTitle');
        if (gameTitle) gameTitle.textContent = game.name || 'Unknown Game';
        
        const gameCategory = document.getElementById('gameCategory');
        if (gameCategory) gameCategory.textContent = game.category || 'Uncategorized';
        
        const gameRating = document.getElementById('gameRating');
        if (gameRating) gameRating.textContent = game.rating || '0';
        
        const gameStatus = document.getElementById('gameStatus');
        if (gameStatus) {
            gameStatus.textContent = game.status || 'Unknown';
            gameStatus.className = 'game-status ' + (game.status === 'Live' ? 'status-live' : 'status-dev');
        }
        
        // Update overview and description
        const gameOverview = document.getElementById('gameOverview');
        if (gameOverview) gameOverview.textContent = game.overview || 'No overview available.';
        
        const gameDescription = document.getElementById('gameDescription');
        if (gameDescription) gameDescription.textContent = game.description || 'No description available.';
        
        // Update detail cards
        updateDetailCard('releaseDate', formatDate(game.releaseDate));
        updateDetailCard('developmentTime', game.developmentTime || '-');
        updateDetailCard('teamSize', game.teamSize || '-');
        updateDetailCard('likes', game.likes ? game.likes.toLocaleString() : '0');
        updateDetailCard('playCount', game.playCount ? game.playCount.toLocaleString() : '0');
        updateDetailCard('platforms', game.platforms ? game.platforms.join(', ') : '-');
        
        // Update features list
        const featuresList = document.getElementById('featuresList');
        if (featuresList && game.features && Array.isArray(game.features)) {
            featuresList.innerHTML = game.features.map(feature => 
                `<li><i class="fas fa-check"></i><span>${feature}</span></li>`
            ).join('');
        }
        
        // Update technologies
        const techList = document.getElementById('techList');
        if (techList && game.technologies && Array.isArray(game.technologies)) {
            techList.innerHTML = game.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');
        }
        
        // Update stats circles
        updateStatCircle('ratingCircle', game.rating ? game.rating.toString() : '0');
        updateStatCircle('playCountCircle', formatStatNumber(game.playCount || 0));
        updateStatCircle('likesCircle', formatStatNumber(game.likes || 0));
        
        // Update repository button
        const repositoryBtn = document.getElementById('repositoryBtn');
        if (repositoryBtn && game.repositoryUrl) {
            repositoryBtn.href = game.repositoryUrl;
            repositoryBtn.style.display = 'flex';
            repositoryBtn.target = '_blank';
        } else if (repositoryBtn) {
            repositoryBtn.style.display = 'none';
        }
        
        // Update play button state
        updatePlayButton(game);
    } catch (error) {
        console.error('Error displaying game details:', error);
    }
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
    
    try {
        if (game.status === 'In Development') {
            playBtn.innerHTML = '<i class="fas fa-clock"></i><span>Coming Soon</span>';
            playBtn.disabled = true;
            playBtn.style.cursor = 'not-allowed';
            playBtn.style.opacity = '0.6';
            playBtn.onclick = null;
        } else if (!game.unityBuild) {
            playBtn.innerHTML = '<i class="fas fa-external-link-alt"></i><span>View Project</span>';
            playBtn.disabled = false;
            playBtn.style.cursor = 'pointer';
            playBtn.style.opacity = '1';
            playBtn.onclick = () => {
                if (game.repositoryUrl) {
                    window.open(game.repositoryUrl, '_blank');
                } else {
                    showNotification('No playable version available', 'info');
                }
            };
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Game</span>';
            playBtn.disabled = false;
            playBtn.style.cursor = 'pointer';
            playBtn.style.opacity = '1';
            playBtn.onclick = () => playGameUnity(game);
        }
    } catch (error) {
        console.error('Error updating play button:', error);
    }
}

// Setup Game Detail Event Listeners
function setupGameDetailEventListeners() {
    try {
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
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Setup Game Navigation
function setupGameNavigation() {
    try {
        const prevGameBtn = document.getElementById('prevGame');
        const nextGameBtn = document.getElementById('nextGame');
        
        if (prevGameBtn) {
            prevGameBtn.addEventListener('click', navigateToPreviousGame);
        }
        
        if (nextGameBtn) {
            nextGameBtn.addEventListener('click', navigateToNextGame);
        }
    } catch (error) {
        console.error('Error setting up game navigation:', error);
    }
}

// Navigation Functions
function navigateToPreviousGame() {
    try {
        const games = getGames();
        if (!games || !Array.isArray(games)) return;
        
        const currentIndex = games.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) return;
        
        const prevIndex = (currentIndex - 1 + games.length) % games.length;
        const prevGame = games[prevIndex];
        
        window.location.href = `game-detail.html?id=${prevGame.id}`;
    } catch (error) {
        console.error('Error navigating to previous game:', error);
    }
}

function navigateToNextGame() {
    try {
        const games = getGames();
        if (!games || !Array.isArray(games)) return;
        
        const currentIndex = games.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) return;
        
        const nextIndex = (currentIndex + 1) % games.length;
        const nextGame = games[nextIndex];
        
        window.location.href = `game-detail.html?id=${nextGame.id}`;
    } catch (error) {
        console.error('Error navigating to next game:', error);
    }
}

// Unity WebGL Game Functions
function playGameUnity(game) {
    console.log('Attempting to play game:', game.name);
    
    try {
        if (!game.unityBuild) {
            showNotification('This game is not available for WebGL play', 'info');
            if (game.repositoryUrl) {
                window.open(game.repositoryUrl, '_blank');
            }
            return;
        }
        
        const buildConfig = unityBuilds[game.unityBuild];
        if (!buildConfig) {
            showNotification('Game build configuration not found', 'error');
            console.error('Build config not found for:', game.unityBuild);
            return;
        }
        
        const gameContainer = document.getElementById('gameContainer');
        const previewOverlay = document.querySelector('.preview-overlay');
        
        if (gameContainer) {
            // Show game container
            gameContainer.classList.add('active');
            isGamePlaying = true;
            
            // Hide preview overlay
            if (previewOverlay) {
                previewOverlay.style.display = 'none';
            }
            
            // Load Unity WebGL build
            loadUnityBuild(buildConfig);
            
            showNotification(`Starting ${game.name}...`, 'success');
        } else {
            showNotification('Game container not found', 'error');
        }
    } catch (error) {
        console.error('Error playing Unity game:', error);
        showNotification('Error starting game: ' + error.message, 'error');
    }
}

function loadUnityBuild(buildConfig) {
    try {
        const canvas = document.getElementById("unityCanvas");
        const loadingBar = document.getElementById("unityProgressBar");
        const unityLoading = document.getElementById("unityLoading");
        
        if (!canvas) {
            showNotification('Unity canvas not found', 'error');
            return;
        }
        
        // Show loading screen
        if (unityLoading) {
            unityLoading.style.display = 'flex';
        }
        
        // Clear any existing Unity instance
        if (window.unityInstance) {
            try {
                window.unityInstance.Quit();
            } catch (e) {
                console.warn('Error quitting Unity instance:', e);
            }
            window.unityInstance = null;
        }
        
        // Create script tag for Unity loader
        const script = document.createElement("script");
        script.src = buildConfig.loaderUrl;
        
        script.onload = () => {
            console.log('Unity loader loaded successfully');
            
            if (typeof createUnityInstance !== "function") {
                showNotification('Unity WebGL loader failed to load', 'error');
                if (unityLoading) unityLoading.style.display = 'none';
                return;
            }
            
            const config = {
                dataUrl: buildConfig.dataUrl,
                frameworkUrl: buildConfig.frameworkUrl,
                codeUrl: buildConfig.codeUrl,
                streamingAssetsUrl: "StreamingAssets",
                companyName: buildConfig.companyName,
                productName: buildConfig.productName,
                productVersion: buildConfig.productVersion,
            };
            
            createUnityInstance(canvas, config, (progress) => {
                if (loadingBar) {
                    loadingBar.style.width = `${progress * 100}%`;
                }
            }).then((instance) => {
                console.log('Unity instance created successfully');
                window.unityInstance = instance;
                unityInstance = instance;
                
                if (unityLoading) {
                    unityLoading.style.display = 'none';
                }
                showNotification('Game loaded successfully!', 'success');
            }).catch((message) => {
                console.error('Failed to create Unity instance:', message);
                showNotification('Failed to load game', 'error');
                resetGameState();
            });
        };
        
        script.onerror = (error) => {
            console.error('Failed to load Unity loader:', error);
            showNotification('Failed to load Unity WebGL build', 'error');
            resetGameState();
        };
        
        document.body.appendChild(script);
    } catch (error) {
        console.error('Error loading Unity build:', error);
        showNotification('Error loading game: ' + error.message, 'error');
    }
}

function resetGameState() {
    isGamePlaying = false;
    const gameContainer = document.getElementById('gameContainer');
    const previewOverlay = document.querySelector('.preview-overlay');
    const unityLoading = document.getElementById('unityLoading');
    
    if (gameContainer) gameContainer.classList.remove('active');
    if (previewOverlay) previewOverlay.style.display = 'flex';
    if (unityLoading) unityLoading.style.display = 'none';
}

// Game Control Functions
function toggleFullscreen() {
    try {
        const gamePreview = document.querySelector('.game-preview');
        if (!gamePreview) return;
        
        if (!document.fullscreenElement) {
            if (gamePreview.requestFullscreen) {
                gamePreview.requestFullscreen();
            } else if (gamePreview.webkitRequestFullscreen) {
                gamePreview.webkitRequestFullscreen();
            } else if (gamePreview.mozRequestFullScreen) {
                gamePreview.mozRequestFullScreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
    } catch (error) {
        console.error('Error toggling fullscreen:', error);
    }
}

function restartGame() {
    try {
        if (unityInstance && currentGame) {
            unityInstance.Quit().then(() => {
                setTimeout(() => playGameUnity(currentGame), 500);
            });
            showNotification('Restarting game...', 'info');
        }
    } catch (error) {
        console.error('Error restarting game:', error);
    }
}

function closeGame() {
    try {
        const gameContainer = document.getElementById('gameContainer');
        const previewOverlay = document.querySelector('.preview-overlay');
        const unityLoading = document.getElementById('unityLoading');
        
        if (unityInstance) {
            try {
                unityInstance.Quit();
            } catch (e) {
                console.warn('Error quitting Unity:', e);
            }
            unityInstance = null;
            window.unityInstance = null;
        }
        
        if (gameContainer) gameContainer.classList.remove('active');
        if (previewOverlay) previewOverlay.style.display = 'flex';
        if (unityLoading) unityLoading.style.display = 'none';
        
        isGamePlaying = false;
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        showNotification('Game closed', 'info');
    } catch (error) {
        console.error('Error closing game:', error);
    }
}

// Share Functionality
function shareGame() {
    if (!currentGame) return;
    
    try {
        const shareData = {
            title: currentGame.name,
            text: currentGame.overview,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).then(() => {
                showNotification('Game shared successfully', 'success');
            }).catch((error) => {
                if (error.name !== 'AbortError') {
                    fallbackShare();
                }
            });
        } else {
            fallbackShare();
        }
    } catch (error) {
        fallbackShare();
    }
}

function fallbackShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard', 'success');
    }).catch(() => {
        showNotification('Could not copy link', 'error');
    });
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
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
                e.preventDefault();
                closeGame();
            }
            break;
        case 'f':
        case 'F':
            if (isGamePlaying) {
                e.preventDefault();
                toggleFullscreen();
            }
            break;
    }
}

// Fullscreen Change Handler
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    const isFullscreen = !!document.fullscreenElement;
    const icon = fullscreenBtn.querySelector('i');
    if (icon) {
        icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatStatNumber(num) {
    if (typeof num !== 'number') return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 6rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        border-radius: 12px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make functions globally available
window.initializeGameDetailPage = initializeGameDetailPage;
window.playGameUnity = playGameUnity;
window.shareGame = shareGame;
window.navigateToPreviousGame = navigateToPreviousGame;
window.navigateToNextGame = navigateToNextGame;
window.toggleTheme = toggleTheme;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
} else {
    initializeGameDetailPage();
}