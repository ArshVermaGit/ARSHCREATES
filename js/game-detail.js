// ==========================================
// GAME DETAIL PAGE - PERFECTED JAVASCRIPT
// Author: Arsh Verma
// Version: 6.0.0 - Production Ready
// Description: Complete game detail with Unity WebGL
// Last Updated: November 2024
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE
// ==========================================
let currentGameId = null;
let currentGame = null;
let isGamePlaying = false;
let unityInstance = null;

// ==========================================
// UNITY WEBGL BUILD CONFIG
// ==========================================
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

// ==========================================
// INITIALIZATION
// ==========================================
function initializeGameDetailPage() {
    console.log('🎮 Initializing game detail page...');
    
    try {
        initializeTheme();
        
        const urlParams = new URLSearchParams(window.location.search);
        currentGameId = parseInt(urlParams.get('id'));
        const autoPlay = urlParams.get('play') === 'true';
        
        if (!currentGameId || isNaN(currentGameId)) {
            console.error('❌ Invalid game ID');
            showNotification('Game not found', 'error');
            setTimeout(() => window.location.href = 'games.html', 2000);
            return;
        }
        
        console.log(`📌 Loading game ID: ${currentGameId}`);
        
        loadGameDetails(currentGameId);
        setupGameDetailEventListeners();
        
        if (autoPlay) {
            setTimeout(() => {
                if (currentGame && currentGame.status === 'Live' && currentGame.unityBuild) {
                    playGameUnity(currentGame);
                }
            }, 1500);
        }
        
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.style.display = 'none', 500);
            }
        }, 1000);
        
        console.log('✅ Game detail initialized');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showNotification('Error loading game page', 'error');
    }
}

// ==========================================
// THEME MANAGEMENT
// ==========================================
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
        
        console.log(`🎨 Theme: ${savedTheme}`);
        
    } catch (error) {
        console.error('❌ Theme error:', error);
    }
}

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
        
        console.log(`🎨 Theme toggled: ${newTheme}`);
        
    } catch (error) {
        console.error('❌ Theme toggle error:', error);
    }
}

// ==========================================
// GAME DATA LOADING
// ==========================================
function loadGameDetails(gameId) {
    try {
        const games = typeof getGames === 'function' ? getGames() : 
                     (window.PORTFOLIO_DATA?.games || []);
        
        if (!games || !Array.isArray(games)) {
            throw new Error('Games data not available');
        }
        
        const game = games.find(g => g.id === gameId);
        
        if (!game) {
            console.error(`❌ Game not found: ${gameId}`);
            showNotification('Game not found', 'error');
            setTimeout(() => window.location.href = 'games.html', 2000);
            return;
        }
        
        currentGame = game;
        displayGameDetails(game);
        setupGameNavigation();
        
        console.log(`✅ Loaded: ${game.name}`);
        
    } catch (error) {
        console.error('❌ Load error:', error);
        showNotification('Error loading game details', 'error');
    }
}

// ==========================================
// DISPLAY GAME DETAILS
// ==========================================
function displayGameDetails(game) {
    try {
        console.log(`📋 Displaying: ${game.name}`);
        
        // Update title
        document.title = `${game.name} - Arsh Verma`;
        
        // Preview image
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = game.image || 'https://via.placeholder.com/1280x720/1A1A2E/E4572E?text=Game';
            previewImage.alt = `${game.name} - Preview`;
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/1280x720/1A1A2E/E4572E?text=Game+Preview';
            };
        }
        
        // Header info
        updateElement('gameTitle', game.name || 'Unknown Game');
        
        const gameCategory = document.getElementById('gameCategory');
        if (gameCategory) {
            const categorySpan = gameCategory.querySelector('span');
            if (categorySpan) {
                categorySpan.textContent = game.category || 'Uncategorized';
            }
        }
        
        updateElement('gameRating', game.rating ? game.rating.toFixed(1) : '0.0');
        
        const gameStatus = document.getElementById('gameStatus');
        if (gameStatus) {
            const statusText = game.status || 'Unknown';
            gameStatus.innerHTML = `<i class="fas fa-circle"></i> ${statusText}`;
            gameStatus.className = `game-status ${game.status === 'Live' ? 'status-live' : 'status-dev'}`;
        }
        
        // Description
        updateElement('gameOverview', game.overview || 'No overview available.');
        updateElement('gameDescription', game.description || 'Detailed description coming soon.');
        
        // Sidebar details
        updateElement('releaseDate', formatDate(game.releaseDate));
        updateElement('developmentTime', game.developmentTime || '-');
        updateElement('teamSize', game.teamSize || '-');
        updateElement('platforms', game.platforms ? game.platforms.join(', ') : '-');
        
        // Stats
        updateElement('playCount', game.playCount ? game.playCount.toLocaleString() : '0');
        updateElement('likes', game.likes ? game.likes.toLocaleString() : '0');
        updateElement('ratingValue', game.rating ? game.rating.toFixed(1) : '0.0');
        
        // Features
        const featuresList = document.getElementById('featuresList');
        if (featuresList && game.features && Array.isArray(game.features)) {
            if (game.features.length > 0) {
                featuresList.innerHTML = game.features.map(feature => 
                    `<li>
                        <i class="fas fa-check-circle"></i>
                        <span>${escapeHtml(feature)}</span>
                    </li>`
                ).join('');
            } else {
                featuresList.innerHTML = '<li><i class="fas fa-info-circle"></i><span>No features listed</span></li>';
            }
        }
        
        // Technologies
        const techList = document.getElementById('techList');
        if (techList && game.technologies && Array.isArray(game.technologies)) {
            if (game.technologies.length > 0) {
                techList.innerHTML = game.technologies.map(tech => 
                    `<span class="tech-tag">
                        <i class="fas fa-code"></i>
                        ${escapeHtml(tech)}
                    </span>`
                ).join('');
            } else {
                techList.innerHTML = '<span class="tech-tag"><i class="fas fa-info-circle"></i>No technologies listed</span>';
            }
        }
        
        // Repository button
        const repositoryBtn = document.getElementById('repositoryBtn');
        if (repositoryBtn) {
            if (game.repositoryUrl) {
                repositoryBtn.href = game.repositoryUrl;
                repositoryBtn.style.display = 'inline-flex';
                repositoryBtn.target = '_blank';
                repositoryBtn.rel = 'noopener noreferrer';
            } else {
                repositoryBtn.style.display = 'none';
            }
        }
        
        updatePlayButton(game);
        
        console.log('✅ Game details displayed');
        
    } catch (error) {
        console.error('❌ Display error:', error);
        showNotification('Error displaying game information', 'error');
    }
}

function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

function updatePlayButton(game) {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) return;
    
    try {
        const playIcon = playBtn.querySelector('.play-icon-circle i');
        const playText = playBtn.querySelector('.play-text');
        
        if (game.status === 'In Development') {
            if (playIcon) playIcon.className = 'fas fa-clock';
            if (playText) playText.textContent = 'Coming Soon';
            playBtn.disabled = true;
            playBtn.style.cursor = 'not-allowed';
            playBtn.style.opacity = '0.6';
            playBtn.onclick = null;
        } else if (!game.unityBuild) {
            if (playIcon) playIcon.className = 'fas fa-external-link-alt';
            if (playText) playText.textContent = 'View Project';
            playBtn.disabled = false;
            playBtn.style.cursor = 'pointer';
            playBtn.style.opacity = '1';
            playBtn.onclick = () => {
                if (game.repositoryUrl) {
                    window.open(game.repositoryUrl, '_blank', 'noopener,noreferrer');
                } else {
                    showNotification('No playable version available', 'info');
                }
            };
        } else {
            if (playIcon) playIcon.className = 'fas fa-play';
            if (playText) playText.textContent = 'Play Game';
            playBtn.disabled = false;
            playBtn.style.cursor = 'pointer';
            playBtn.style.opacity = '1';
            playBtn.onclick = () => playGameUnity(game);
        }
        
    } catch (error) {
        console.error('❌ Play button error:', error);
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupGameDetailEventListeners() {
    try {
        console.log('🔧 Setting up listeners...');
        
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', shareGame);
        }
        
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }
        
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', restartGame);
        }
        
        const closeGameBtn = document.getElementById('closeGameBtn');
        if (closeGameBtn) {
            closeGameBtn.addEventListener('click', closeGame);
        }
        
        document.addEventListener('keydown', handleKeyboardNavigation);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        
        console.log('✅ Listeners setup complete');
        
    } catch (error) {
        console.error('❌ Listener setup error:', error);
    }
}

// ==========================================
// GAME NAVIGATION
// ==========================================
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
        
        console.log('✅ Navigation setup');
        
    } catch (error) {
        console.error('❌ Navigation setup error:', error);
    }
}

function navigateToPreviousGame() {
    try {
        const games = typeof getGames === 'function' ? getGames() : 
                     (window.PORTFOLIO_DATA?.games || []);
        
        if (!games || !Array.isArray(games)) return;
        
        const currentIndex = games.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) return;
        
        const prevIndex = (currentIndex - 1 + games.length) % games.length;
        const prevGame = games[prevIndex];
        
        console.log(`⬅️ Previous: ${prevGame.name}`);
        window.location.href = `game-detail.html?id=${prevGame.id}`;
        
    } catch (error) {
        console.error('❌ Navigation error:', error);
        showNotification('Navigation error', 'error');
    }
}

function navigateToNextGame() {
    try {
        const games = typeof getGames === 'function' ? getGames() : 
                     (window.PORTFOLIO_DATA?.games || []);
        
        if (!games || !Array.isArray(games)) return;
        
        const currentIndex = games.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) return;
        
        const nextIndex = (currentIndex + 1) % games.length;
        const nextGame = games[nextIndex];
        
        console.log(`➡️ Next: ${nextGame.name}`);
        window.location.href = `game-detail.html?id=${nextGame.id}`;
        
    } catch (error) {
        console.error('❌ Navigation error:', error);
        showNotification('Navigation error', 'error');
    }
}

// ==========================================
// UNITY WEBGL FUNCTIONS
// ==========================================
function playGameUnity(game) {
    console.log(`🎮 Playing: ${game.name}`);
    
    try {
        if (!game.unityBuild) {
            showNotification('Game not available for WebGL play', 'info');
            if (game.repositoryUrl) {
                window.open(game.repositoryUrl, '_blank', 'noopener,noreferrer');
            }
            return;
        }
        
        const buildConfig = unityBuilds[game.unityBuild];
        if (!buildConfig) {
            showNotification('Game build not found', 'error');
            console.error('❌ Build config missing:', game.unityBuild);
            return;
        }
        
        const gameContainer = document.getElementById('gameContainer');
        const previewContainer = document.getElementById('previewContainer');
        
        if (!gameContainer) {
            showNotification('Game container not found', 'error');
            console.error('❌ Container not found');
            return;
        }
        
        gameContainer.style.display = 'block';
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
        
        isGamePlaying = true;
        loadUnityBuild(buildConfig);
        showNotification(`Starting ${game.name}...`, 'success');
        
        console.log('✅ Game started');
        
    } catch (error) {
        console.error('❌ Play error:', error);
        showNotification('Error starting game: ' + error.message, 'error');
        resetGameState();
    }
}

function loadUnityBuild(buildConfig) {
    try {
        console.log('📦 Loading Unity build...');
        
        const canvas = document.getElementById("unityCanvas");
        const loadingBar = document.getElementById("unityProgressBar");
        const unityLoading = document.getElementById("unityLoading");
        
        if (!canvas) {
            showNotification('Unity canvas not found', 'error');
            return;
        }
        
        if (unityLoading) {
            unityLoading.style.display = 'flex';
        }
        
        if (window.unityInstance) {
            try {
                window.unityInstance.Quit();
            } catch (e) {
                console.warn('⚠️ Error quitting previous instance:', e);
            }
            window.unityInstance = null;
            unityInstance = null;
        }
        
        const script = document.createElement("script");
        script.src = buildConfig.loaderUrl;
        
        const loadTimeout = setTimeout(() => {
            console.error('❌ Unity loader timeout');
            showNotification('Game loading timeout', 'error');
            resetGameState();
        }, 30000);
        
        script.onload = () => {
            clearTimeout(loadTimeout);
            console.log('✅ Unity loader loaded');
            
            if (typeof createUnityInstance !== "function") {
                showNotification('Unity WebGL loader failed', 'error');
                if (unityLoading) unityLoading.style.display = 'none';
                resetGameState();
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
            
            console.log('⚙️ Creating Unity instance...');
            
            createUnityInstance(canvas, config, (progress) => {
                console.log(`📊 Loading: ${Math.round(progress * 100)}%`);
                
                if (loadingBar) {
                    loadingBar.style.width = `${Math.round(progress * 100)}%`;
                }
            }).then((instance) => {
                console.log('✅ Unity instance created');
                
                window.unityInstance = instance;
                unityInstance = instance;
                
                if (unityLoading) {
                    unityLoading.style.display = 'none';
                }
                
                showNotification('Game loaded!', 'success');
                
            }).catch((message) => {
                console.error('❌ Unity instance failed:', message);
                showNotification('Failed to load game', 'error');
                resetGameState();
            });
        };
        
        script.onerror = (error) => {
            clearTimeout(loadTimeout);
            console.error('❌ Script load failed:', error);
            showNotification('Cannot load game files', 'error');
            resetGameState();
        };
        
        document.body.appendChild(script);
        
    } catch (error) {
        console.error('❌ Load Unity error:', error);
        showNotification('Error loading game: ' + error.message, 'error');
        resetGameState();
    }
}

function resetGameState() {
    console.log('🔄 Resetting state');
    
    isGamePlaying = false;
    
    const gameContainer = document.getElementById('gameContainer');
    const previewContainer = document.getElementById('previewContainer');
    const unityLoading = document.getElementById('unityLoading');
    
    if (gameContainer) gameContainer.style.display = 'none';
    if (previewContainer) previewContainer.style.display = 'block';
    if (unityLoading) unityLoading.style.display = 'none';
    
    console.log('✅ State reset');
}

// ==========================================
// GAME CONTROLS
// ==========================================
function toggleFullscreen() {
    try {
        const gamePlayerWrapper = document.querySelector('.game-player-wrapper');
        if (!gamePlayerWrapper) return;
        
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
        
        if (!isFullscreen) {
            console.log('🖥️ Entering fullscreen');
            
            if (gamePlayerWrapper.requestFullscreen) {
                gamePlayerWrapper.requestFullscreen();
            } else if (gamePlayerWrapper.webkitRequestFullscreen) {
                gamePlayerWrapper.webkitRequestFullscreen();
            } else if (gamePlayerWrapper.mozRequestFullScreen) {
                gamePlayerWrapper.mozRequestFullScreen();
            }
        } else {
            console.log('🖥️ Exiting fullscreen');
            
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
        
    } catch (error) {
        console.error('❌ Fullscreen error:', error);
        showNotification('Fullscreen error', 'error');
    }
}

function restartGame() {
    try {
        if (!unityInstance || !currentGame) {
            showNotification('No game running', 'info');
            return;
        }
        
        console.log(`🔄 Restarting: ${currentGame.name}`);
        showNotification('Restarting game...', 'info');
        
        unityInstance.Quit().then(() => {
            unityInstance = null;
            window.unityInstance = null;
            
            setTimeout(() => {
                playGameUnity(currentGame);
            }, 500);
        }).catch((error) => {
            console.warn('⚠️ Quit error:', error);
            unityInstance = null;
            window.unityInstance = null;
            setTimeout(() => {
                playGameUnity(currentGame);
            }, 500);
        });
        
    } catch (error) {
        console.error('❌ Restart error:', error);
        showNotification('Error restarting', 'error');
    }
}

function closeGame() {
    try {
        console.log('❌ Closing game');
        
        const gameContainer = document.getElementById('gameContainer');
        const previewContainer = document.getElementById('previewContainer');
        const unityLoading = document.getElementById('unityLoading');
        
        if (unityInstance) {
            try {
                unityInstance.Quit();
            } catch (e) {
                console.warn('⚠️ Quit error:', e);
            }
            unityInstance = null;
            window.unityInstance = null;
        }
        
        if (gameContainer) gameContainer.style.display = 'none';
        if (previewContainer) previewContainer.style.display = 'block';
        if (unityLoading) unityLoading.style.display = 'none';
        
        isGamePlaying = false;
        
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
        
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
        
        showNotification('Game closed', 'info');
        console.log('✅ Game closed');
        
    } catch (error) {
        console.error('❌ Close error:', error);
        showNotification('Error closing game', 'error');
    }
}

// ==========================================
// SHARE FUNCTIONALITY
// ==========================================
function shareGame() {
    if (!currentGame) {
        showNotification('No game to share', 'error');
        return;
    }
    
    try {
        const shareData = {
            title: `${currentGame.name} - ArshCreates`,
            text: currentGame.overview || `Check out ${currentGame.name}!`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    showNotification('Shared successfully', 'success');
                    console.log('✅ Shared via Web Share API');
                })
                .catch((error) => {
                    if (error.name !== 'AbortError') {
                        fallbackShare();
                    }
                });
        } else {
            fallbackShare();
        }
        
    } catch (error) {
        console.error('❌ Share error:', error);
        fallbackShare();
    }
}

function fallbackShare() {
    const url = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Link copied!', 'success');
            })
            .catch(() => {
                showManualCopyDialog(url);
            });
    } else {
        showManualCopyDialog(url);
    }
}

function showManualCopyDialog(url) {
    prompt('Copy this link:', url);
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
function handleKeyboardNavigation(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
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
        case 'r':
        case 'R':
            if (isGamePlaying) {
                e.preventDefault();
                restartGame();
            }
            break;
    }
}

// ==========================================
// FULLSCREEN HANDLER
// ==========================================
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    
    const icon = fullscreenBtn.querySelector('i');
    if (icon) {
        icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    }
    
    const span = fullscreenBtn.querySelector('span');
    if (span) {
        span.textContent = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
    }
    
    console.log(`🖥️ Fullscreen: ${isFullscreen ? 'active' : 'inactive'}`);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        return 'Invalid Date';
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

function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        
        const icons = {
            error: '<i class="fas fa-exclamation-circle"></i>',
            success: '<i class="fas fa-check-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-message">${escapeHtml(message)}</div>
        `;
        
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
    } catch (error) {
        console.error('❌ Notification error:', error);
    }
}

// ==========================================
// CLEANUP
// ==========================================
window.addEventListener('beforeunload', () => {
    if (unityInstance) {
        try {
            console.log('🧹 Cleaning up');
            unityInstance.Quit();
        } catch (e) {
            console.warn('⚠️ Cleanup error:', e);
        }
    }
});

// ==========================================
// GLOBAL EXPORTS
// ==========================================
window.initializeGameDetailPage = initializeGameDetailPage;
window.playGameUnity = playGameUnity;
window.shareGame = shareGame;
window.navigateToPreviousGame = navigateToPreviousGame;
window.navigateToNextGame = navigateToNextGame;
window.toggleTheme = toggleTheme;
window.toggleFullscreen = toggleFullscreen;
window.restartGame = restartGame;
window.closeGame = closeGame;

// ==========================================
// DEBUG HELPERS
// ==========================================
window.debugGameState = function() {
    console.log('╔═══════════════════════════════════════╗');
    console.log('║       GAME STATE DEBUG INFO           ║');
    console.log('╚═══════════════════════════════════════╝');
    console.log('Current Game ID:', currentGameId);
    console.log('Current Game:', currentGame);
    console.log('Is Playing:', isGamePlaying);
    console.log('Unity Instance:', unityInstance);
    console.log('Available Games:', typeof getGames === 'function' ? getGames() : []);
    console.log('Unity Builds:', unityBuilds);
    console.log('Theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Fullscreen:', !!(document.fullscreenElement || document.webkitFullscreenElement));
    console.log('═══════════════════════════════════════');
};

window.testNotifications = function() {
    showNotification('Info notification', 'info');
    setTimeout(() => showNotification('Success notification', 'success'), 500);
    setTimeout(() => showNotification('Warning notification', 'warning'), 1000);
    setTimeout(() => showNotification('Error notification', 'error'), 1500);
};

window.checkUnityFiles = async function() {
    const buildConfig = unityBuilds["static/games_files/sky_surfers/"];
    
    if (!buildConfig) {
        console.error('❌ Build config not found');
        return;
    }
    
    console.log('🔍 Checking Unity file accessibility...');
    
    const files = [
        { name: 'Loader', url: buildConfig.loaderUrl },
        { name: 'Data', url: buildConfig.dataUrl },
        { name: 'Framework', url: buildConfig.frameworkUrl },
        { name: 'WASM', url: buildConfig.codeUrl }
    ];
    
    for (const file of files) {
        try {
            const response = await fetch(file.url, { method: 'HEAD' });
            console.log(`✅ ${file.name}: ${response.status === 200 ? 'ACCESSIBLE' : 'NOT FOUND'}`);
        } catch (error) {
            console.error(`❌ ${file.name}: ${error.message}`);
        }
    }
};

// ==========================================
// AUTO-INITIALIZATION
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
    console.log('⏳ Waiting for DOM...');
} else {
    initializeGameDetailPage();
}

// ==========================================
// INITIALIZATION COMPLETE
// ==========================================
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  GAME DETAIL PAGE - JavaScript Loaded Successfully           ║');
console.log('║  Author: Arsh Verma                                          ║');
console.log('║  Portfolio: ArshCreates                                      ║');
console.log('║                                                              ║');
console.log('║  Available Debug Commands:                                   ║');
console.log('║  • window.debugGameState()    - View current state           ║');
console.log('║  • window.testNotifications() - Test notification system     ║');
console.log('║  • window.checkUnityFiles()   - Check Unity build files      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');

// ==========================================
// END OF FILE
// ==========================================