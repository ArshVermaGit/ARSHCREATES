// ==========================================
// GAME DETAIL PAGE - FIXED VERSION
// Author: Arsh Verma
// Version: 7.0.0 - Auto-loads from data.js
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE
// ==========================================
let currentGameId = null;
let currentGame = null;
let isGamePlaying = false;
let unityInstance = null;
let gamesData = [];

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
        
        console.log(`🔌 Loading game ID: ${currentGameId}`);
        
        // Load games data first
        loadGamesData().then(() => {
            loadGameDetails(currentGameId);
            setupGameDetailEventListeners();
            
            if (autoPlay) {
                setTimeout(() => {
                    if (currentGame && currentGame.status === 'Live') {
                        playGame(currentGame);
                    }
                }, 1500);
            }
            
            console.log('✅ Game detail initialized');
        }).catch(error => {
            console.error('❌ Failed to load games data:', error);
            showNotification('Error loading game data', 'error');
        });
        
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
async function loadGamesData() {
    try {
        if (typeof getGames === 'function') {
            gamesData = getGames();
        } else if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.games)) {
            gamesData = window.PORTFOLIO_DATA.games;
        } else {
            throw new Error('Games data not available');
        }
        
        if (!gamesData || !Array.isArray(gamesData)) {
            throw new Error('Games data not available');
        }
        
        console.log(`📥 Loaded ${gamesData.length} games`);
        return gamesData;
        
    } catch (error) {
        console.error('❌ Error loading games data:', error);
        throw error;
    }
}

function loadGameDetails(gameId) {
    try {
        if (!gamesData || gamesData.length === 0) {
            throw new Error('No games data available');
        }
        
        const game = gamesData.find(g => g.id === gameId);
        
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
        
        document.title = `${game.name} - Arsh Verma`;
        
        // Preview image
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = game.image || 'https://via.placeholder.com/1280x720/1A1A2E/FFB800?text=Game+Preview';
            previewImage.alt = `${game.name} - Preview`;
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/1280x720/1A1A2E/FFB800?text=Game+Preview';
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
        updateElement('gameDescription', game.description || game.overview || 'Detailed description coming soon.');
        
        // Sidebar details
        updateElement('releaseDate', formatDate(game.releaseDate));
        updateElement('developmentTime', game.developmentTime || 'Not specified');
        updateElement('teamSize', game.teamSize || 'Solo');
        updateElement('platforms', game.platforms ? (Array.isArray(game.platforms) ? game.platforms.join(', ') : game.platforms) : 'Web, Windows');
        
        // Stats
        updateElement('playCount', game.playCount ? game.playCount.toLocaleString() : '0');
        updateElement('likes', game.likes ? game.likes.toLocaleString() : '0');
        updateElement('ratingValue', game.rating ? game.rating.toFixed(1) : '0.0');
        
        // Features
        const featuresList = document.getElementById('featuresList');
        if (featuresList) {
            if (game.features && Array.isArray(game.features) && game.features.length > 0) {
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
        if (techList) {
            if (game.technologies && Array.isArray(game.technologies) && game.technologies.length > 0) {
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
        
        // Screenshots
        displayScreenshots(game.screenshots);
        
        updatePlayButton(game);
        
        console.log('✅ Game details displayed');
        
    } catch (error) {
        console.error('❌ Display error:', error);
        showNotification('Error displaying game information', 'error');
    }
}

function displayScreenshots(screenshots) {
    const screenshotsGrid = document.getElementById('screenshotsGrid');
    if (!screenshotsGrid) return;
    
    if (screenshots && Array.isArray(screenshots) && screenshots.length > 0) {
        screenshotsGrid.innerHTML = screenshots.map((screenshot, index) => `
            <div class="screenshot-item" onclick="openLightbox('${screenshot}', ${index})">
                <img src="${screenshot}" alt="Game Screenshot ${index + 1}" loading="lazy">
                <div class="screenshot-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        `).join('');
        
        if (!document.getElementById('lightbox')) {
            const lightboxHTML = `
                <div id="lightbox" class="lightbox" style="display: none;">
                    <div class="lightbox-content">
                        <button class="lightbox-close" onclick="closeLightbox()">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="lightbox-nav lightbox-prev" onclick="changeSlide(-1)">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <img id="lightboxImage" src="" alt="Game Screenshot">
                        <button class="lightbox-nav lightbox-next" onclick="changeSlide(1)">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        }
    } else {
        screenshotsGrid.innerHTML = `
            <div class="no-screenshots">
                <i class="fas fa-images"></i>
                <p>No screenshots available</p>
            </div>
        `;
    }
}

function openLightbox(imageSrc, index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (lightbox && lightboxImage) {
        lightboxImage.src = imageSrc;
        lightboxImage.dataset.currentIndex = index;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function changeSlide(direction) {
    const lightboxImage = document.getElementById('lightboxImage');
    if (!lightboxImage) return;
    
    const currentIndex = parseInt(lightboxImage.dataset.currentIndex);
    const screenshots = currentGame?.screenshots;
    
    if (!screenshots || !Array.isArray(screenshots)) return;
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = screenshots.length - 1;
    if (newIndex >= screenshots.length) newIndex = 0;
    
    lightboxImage.src = screenshots[newIndex];
    lightboxImage.dataset.currentIndex = newIndex;
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
        
        const newPlayBtn = playBtn.cloneNode(true);
        playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
        
        const updatedPlayBtn = document.getElementById('playBtn');
        
        if (game.status === 'In Development') {
            if (playIcon) playIcon.className = 'fas fa-clock';
            if (playText) playText.textContent = 'Coming Soon';
            updatedPlayBtn.disabled = true;
            updatedPlayBtn.style.cursor = 'not-allowed';
            updatedPlayBtn.style.opacity = '0.6';
        } else if (game.unityBuild && game.unityBuild.enabled) {
            // Unity WebGL game
            if (playIcon) playIcon.className = 'fas fa-play';
            if (playText) playText.textContent = 'Play Game';
            updatedPlayBtn.disabled = false;
            updatedPlayBtn.style.cursor = 'pointer';
            updatedPlayBtn.style.opacity = '1';
            updatedPlayBtn.onclick = () => playGame(game);
        } else if (game.playUrl) {
            // External link game
            if (playIcon) playIcon.className = 'fas fa-external-link-alt';
            if (playText) playText.textContent = 'Play Game';
            updatedPlayBtn.disabled = false;
            updatedPlayBtn.style.cursor = 'pointer';
            updatedPlayBtn.style.opacity = '1';
            updatedPlayBtn.onclick = () => {
                window.open(game.playUrl, '_blank', 'noopener,noreferrer');
            };
        } else {
            // No playable version
            if (playIcon) playIcon.className = 'fas fa-external-link-alt';
            if (playText) playText.textContent = 'View Project';
            updatedPlayBtn.disabled = false;
            updatedPlayBtn.style.cursor = 'pointer';
            updatedPlayBtn.style.opacity = '1';
            updatedPlayBtn.onclick = () => {
                if (game.repositoryUrl) {
                    window.open(game.repositoryUrl, '_blank', 'noopener,noreferrer');
                } else {
                    showNotification('No playable version available', 'info');
                }
            };
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
        document.addEventListener('keydown', handleLightboxNavigation);
        
        console.log('✅ Listeners setup complete');
        
    } catch (error) {
        console.error('❌ Listener setup error:', error);
    }
}

function handleLightboxNavigation(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || lightbox.style.display === 'none') return;
    
    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            changeSlide(-1);
            break;
        case 'ArrowRight':
            changeSlide(1);
            break;
    }
}

// ==========================================
// GAME NAVIGATION
// ==========================================
function setupGameNavigation() {
    try {
        const prevGameBtn = document.getElementById('prevGame');
        const nextGameBtn = document.getElementById('nextGame');
        
        if (!gamesData || gamesData.length === 0) return;
        
        const currentIndex = gamesData.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) return;
        
        const prevGame = gamesData[(currentIndex - 1 + gamesData.length) % gamesData.length];
        const nextGame = gamesData[(currentIndex + 1) % gamesData.length];
        
        if (prevGameBtn) {
            const prevTitle = prevGameBtn.querySelector('.nav-title');
            if (prevTitle) prevTitle.textContent = prevGame.name;
            prevGameBtn.onclick = () => navigateToGame(prevGame.id);
        }
        
        if (nextGameBtn) {
            const nextTitle = nextGameBtn.querySelector('.nav-title');
            if (nextTitle) nextTitle.textContent = nextGame.name;
            nextGameBtn.onclick = () => navigateToGame(nextGame.id);
        }
        
        console.log('✅ Navigation setup complete');
        
    } catch (error) {
        console.error('❌ Navigation setup error:', error);
    }
}

function navigateToGame(gameId) {
    window.location.href = `game-detail.html?id=${gameId}`;
}

// ==========================================
// GAME PLAY FUNCTIONALITY
// ==========================================
function playGame(game) {
    console.log(`🎮 Playing: ${game.name}`);
    
    try {
        // Check if external playUrl exists
        if (game.playUrl && (!game.unityBuild || !game.unityBuild.enabled)) {
            window.open(game.playUrl, '_blank', 'noopener,noreferrer');
            return;
        }
        
        // Check if Unity WebGL is enabled
        if (!game.unityBuild || !game.unityBuild.enabled) {
            showNotification('Game not available for WebGL play', 'info');
            if (game.repositoryUrl) {
                window.open(game.repositoryUrl, '_blank', 'noopener,noreferrer');
            }
            return;
        }
        
        const buildConfig = game.unityBuild;
        
        // Validate Unity build configuration
        if (!buildConfig.loaderUrl || !buildConfig.dataUrl || !buildConfig.frameworkUrl || !buildConfig.codeUrl) {
            showNotification('Invalid Unity build configuration', 'error');
            console.error('❌ Missing Unity build URLs');
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
        previewContainer.style.display = 'none';
        
        isGamePlaying = true;
        loadUnityBuild(buildConfig);
        showNotification(`Starting ${game.name}...`, 'success');
        
        console.log('✅ Game started');
        
    } catch (error) {
        console.error('❌ Play error:', error);
        showNotification('Error starting game', 'error');
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
        
        // Clean up previous instance
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
            showNotification('Game loading timeout - check build files', 'error');
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
                companyName: buildConfig.companyName || "ArshCreates",
                productName: buildConfig.productName || "Game",
                productVersion: buildConfig.productVersion || "1.0",
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
                
                showNotification('Game loaded successfully!', 'success');
                
            }).catch((message) => {
                console.error('❌ Unity instance failed:', message);
                showNotification('Failed to load game - check console', 'error');
                resetGameState();
            });
        };
        
        script.onerror = (error) => {
            clearTimeout(loadTimeout);
            console.error('❌ Script load failed:', error);
            showNotification('Cannot load game files - check paths', 'error');
            resetGameState();
        };
        
        document.body.appendChild(script);
        
    } catch (error) {
        console.error('❌ Load Unity error:', error);
        showNotification('Error loading game', 'error');
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
                playGame(currentGame);
            }, 500);
        }).catch((error) => {
            console.warn('⚠️ Quit error:', error);
            unityInstance = null;
            window.unityInstance = null;
            setTimeout(() => {
                playGame(currentGame);
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
                showNotification('Link copied to clipboard!', 'success');
            })
            .catch(() => {
                showManualCopyDialog(url);
            });
    } else {
        showManualCopyDialog(url);
    }
}

function showManualCopyDialog(url) {
    prompt('Copy this link to share:', url);
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
    if (!dateString) return 'Coming Soon';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Coming Soon';
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        return 'Coming Soon';
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
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
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
        
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
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
            console.log('🧹 Cleaning up Unity instance');
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
window.playGame = playGame;
window.shareGame = shareGame;
window.toggleTheme = toggleTheme;
window.toggleFullscreen = toggleFullscreen;
window.restartGame = restartGame;
window.closeGame = closeGame;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeSlide = changeSlide;

// ==========================================
// AUTO-INITIALIZATION
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
} else {
    setTimeout(initializeGameDetailPage, 100);
}

console.log('🎮 Game detail JavaScript loaded successfully!');