// ==========================================
// GAME DETAIL PAGE - COMPLETE & CORRECTED VERSION
// Handles Unity WebGL game loading, navigation, and all interactive features
// Author: Arsh Verma
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentGameId = null;        // ID of the currently displayed game
let currentGame = null;          // Current game object with all details
let isGamePlaying = false;       // Flag to track if game is currently active
let unityInstance = null;        // Reference to Unity WebGL instance

// ==========================================
// UNITY WEBGL BUILD CONFIGURATION
// Maps game build paths to their Unity WebGL files
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
    // Add more game builds here as needed
};

// ==========================================
// PAGE INITIALIZATION
// ==========================================

/**
 * Initialize the game detail page
 * - Sets up theme
 * - Loads game data from URL parameters
 * - Sets up event listeners
 * - Handles auto-play if requested
 */
function initializeGameDetailPage() {
    console.log('Initializing game detail page...');
    
    try {
        // Initialize theme system first
        initializeTheme();
        
        // Extract game ID and auto-play flag from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        currentGameId = parseInt(urlParams.get('id'));
        const autoPlay = urlParams.get('play') === 'true';
        
        // Validate game ID
        if (!currentGameId || isNaN(currentGameId)) {
            console.error('Invalid or missing game ID');
            showNotification('Game not found', 'error');
            setTimeout(() => window.location.href = 'games.html', 2000);
            return;
        }
        
        // Load and display game details
        loadGameDetails(currentGameId);
        
        // Setup all event listeners
        setupGameDetailEventListeners();
        
        // Auto-play game if requested via URL parameter
        if (autoPlay) {
            setTimeout(() => {
                if (currentGame && currentGame.status === 'Live' && currentGame.unityBuild) {
                    playGameUnity(currentGame);
                }
            }, 1500);
        }
        
        // Hide loading screen with fade animation
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        console.log('Game detail page initialized successfully');
    } catch (error) {
        console.error('Error initializing game detail page:', error);
        showNotification('Error loading game page', 'error');
    }
}

// ==========================================
// THEME MANAGEMENT
// ==========================================

/**
 * Initialize theme system
 * - Loads saved theme preference from localStorage
 * - Sets up theme toggle button
 */
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme icon
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Attach theme toggle event listener
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log('Theme initialized:', savedTheme);
    } catch (error) {
        console.error('Error initializing theme:', error);
    }
}

/**
 * Toggle between light and dark theme
 * - Updates DOM attribute
 * - Saves preference to localStorage
 * - Updates theme icon
 */
function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('.theme-icon i');
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log('Theme toggled to:', newTheme);
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

// ==========================================
// GAME DATA LOADING
// ==========================================

/**
 * Load game details from data source
 * @param {number} gameId - ID of the game to load
 */
function loadGameDetails(gameId) {
    try {
        // Fetch games array from data.js
        const games = getGames();
        
        // Validate games data
        if (!games || !Array.isArray(games)) {
            throw new Error('Games data not available or invalid');
        }
        
        // Find the specific game by ID
        const game = games.find(g => g.id === gameId);
        
        if (!game) {
            console.error('Game not found with ID:', gameId);
            showNotification('Game not found', 'error');
            setTimeout(() => window.location.href = 'games.html', 2000);
            return;
        }
        
        // Store current game globally
        currentGame = game;
        
        // Display all game information
        displayGameDetails(game);
        
        // Setup navigation arrows
        setupGameNavigation();
        
        console.log('Game details loaded:', game.name);
    } catch (error) {
        console.error('Error loading game details:', error);
        showNotification('Error loading game details', 'error');
    }
}

// ==========================================
// GAME DETAILS DISPLAY
// ==========================================

/**
 * Display all game details in the UI
 * @param {Object} game - Game object containing all details
 */
function displayGameDetails(game) {
    try {
        // Update browser tab title
        document.title = `${game.name} - Arsh Verma`;
        
        // ===== PREVIEW IMAGE =====
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = game.image || 'https://via.placeholder.com/1200x675/393E41/FFFFFF?text=Game+Preview';
            previewImage.alt = game.name;
            
            // Fallback for broken images
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/1200x675/393E41/FFFFFF?text=Game+Preview';
            };
        }
        
        // ===== GAME HEADER SECTION =====
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
        
        // ===== GAME DESCRIPTION =====
        const gameOverview = document.getElementById('gameOverview');
        if (gameOverview) gameOverview.textContent = game.overview || 'No overview available.';
        
        const gameDescription = document.getElementById('gameDescription');
        if (gameDescription) gameDescription.textContent = game.description || 'No description available.';
        
        // ===== DETAIL CARDS (Right Sidebar) =====
        updateDetailCard('releaseDate', formatDate(game.releaseDate));
        updateDetailCard('developmentTime', game.developmentTime || '-');
        updateDetailCard('teamSize', game.teamSize || '-');
        updateDetailCard('likes', game.likes ? game.likes.toLocaleString() : '0');
        updateDetailCard('playCount', game.playCount ? game.playCount.toLocaleString() : '0');
        updateDetailCard('platforms', game.platforms ? game.platforms.join(', ') : '-');
        
        // ===== FEATURES LIST =====
        const featuresList = document.getElementById('featuresList');
        if (featuresList && game.features && Array.isArray(game.features)) {
            featuresList.innerHTML = game.features.map(feature => 
                `<li><i class="fas fa-check"></i><span>${escapeHtml(feature)}</span></li>`
            ).join('');
        }
        
        // ===== TECHNOLOGIES TAGS =====
        const techList = document.getElementById('techList');
        if (techList && game.technologies && Array.isArray(game.technologies)) {
            techList.innerHTML = game.technologies.map(tech => 
                `<span class="tech-tag">${escapeHtml(tech)}</span>`
            ).join('');
        }
        
        // ===== STATISTICS CIRCLES =====
        updateStatCircle('ratingCircle', game.rating ? game.rating.toString() : '0');
        updateStatCircle('playCountCircle', formatStatNumber(game.playCount || 0));
        updateStatCircle('likesCircle', formatStatNumber(game.likes || 0));
        
        // ===== REPOSITORY BUTTON =====
        const repositoryBtn = document.getElementById('repositoryBtn');
        if (repositoryBtn) {
            if (game.repositoryUrl) {
                repositoryBtn.href = game.repositoryUrl;
                repositoryBtn.style.display = 'flex';
                repositoryBtn.target = '_blank';
                repositoryBtn.rel = 'noopener noreferrer'; // Security best practice
            } else {
                repositoryBtn.style.display = 'none';
            }
        }
        
        // ===== PLAY BUTTON STATE =====
        updatePlayButton(game);
        
        console.log('Game details displayed successfully');
    } catch (error) {
        console.error('Error displaying game details:', error);
        showNotification('Error displaying game information', 'error');
    }
}

/**
 * Update a detail card element
 * @param {string} elementId - ID of the element to update
 * @param {string} value - Value to display
 */
function updateDetailCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

/**
 * Update a statistic circle element
 * @param {string} elementId - ID of the stat circle element
 * @param {string} value - Value to display
 */
function updateStatCircle(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '0';
    }
}

/**
 * Update the play button based on game status
 * @param {Object} game - Game object
 */
function updatePlayButton(game) {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) return;
    
    try {
        if (game.status === 'In Development') {
            // Game is still in development
            playBtn.innerHTML = '<i class="fas fa-clock"></i><span>Coming Soon</span>';
            playBtn.disabled = true;
            playBtn.style.cursor = 'not-allowed';
            playBtn.style.opacity = '0.6';
            playBtn.onclick = null;
        } else if (!game.unityBuild) {
            // No playable WebGL build available
            playBtn.innerHTML = '<i class="fas fa-external-link-alt"></i><span>View Project</span>';
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
            // Game is playable via WebGL
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

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================

/**
 * Setup all event listeners for the game detail page
 */
function setupGameDetailEventListeners() {
    try {
        // ===== SHARE BUTTON =====
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', shareGame);
        }
        
        // ===== FULLSCREEN BUTTON =====
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }
        
        // ===== RESTART BUTTON =====
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', restartGame);
        }
        
        // ===== CLOSE GAME BUTTON =====
        const closeGameBtn = document.getElementById('closeGameBtn');
        if (closeGameBtn) {
            closeGameBtn.addEventListener('click', closeGame);
        }
        
        // ===== KEYBOARD NAVIGATION =====
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // ===== FULLSCREEN CHANGE EVENTS =====
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        console.log('Event listeners setup complete');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// ==========================================
// GAME NAVIGATION
// ==========================================

/**
 * Setup previous/next game navigation arrows
 */
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
        
        console.log('Game navigation setup complete');
    } catch (error) {
        console.error('Error setting up game navigation:', error);
    }
}

/**
 * Navigate to the previous game in the list
 */
function navigateToPreviousGame() {
    try {
        const games = getGames();
        if (!games || !Array.isArray(games)) {
            console.error('Games data not available');
            return;
        }
        
        const currentIndex = games.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) {
            console.error('Current game not found in games list');
            return;
        }
        
        // Wrap around to last game if at beginning
        const prevIndex = (currentIndex - 1 + games.length) % games.length;
        const prevGame = games[prevIndex];
        
        // Navigate to previous game
        window.location.href = `game-detail.html?id=${prevGame.id}`;
    } catch (error) {
        console.error('Error navigating to previous game:', error);
        showNotification('Navigation error', 'error');
    }
}

/**
 * Navigate to the next game in the list
 */
function navigateToNextGame() {
    try {
        const games = getGames();
        if (!games || !Array.isArray(games)) {
            console.error('Games data not available');
            return;
        }
        
        const currentIndex = games.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) {
            console.error('Current game not found in games list');
            return;
        }
        
        // Wrap around to first game if at end
        const nextIndex = (currentIndex + 1) % games.length;
        const nextGame = games[nextIndex];
        
        // Navigate to next game
        window.location.href = `game-detail.html?id=${nextGame.id}`;
    } catch (error) {
        console.error('Error navigating to next game:', error);
        showNotification('Navigation error', 'error');
    }
}

// ==========================================
// UNITY WEBGL GAME FUNCTIONS
// ==========================================

/**
 * Initialize and play Unity WebGL game
 * @param {Object} game - Game object with Unity build configuration
 */
function playGameUnity(game) {
    console.log('Attempting to play game:', game.name);
    
    try {
        // Check if game has Unity WebGL build
        if (!game.unityBuild) {
            showNotification('This game is not available for WebGL play', 'info');
            if (game.repositoryUrl) {
                window.open(game.repositoryUrl, '_blank', 'noopener,noreferrer');
            }
            return;
        }
        
        // Get Unity build configuration
        const buildConfig = unityBuilds[game.unityBuild];
        if (!buildConfig) {
            showNotification('Game build configuration not found', 'error');
            console.error('Build config not found for:', game.unityBuild);
            return;
        }
        
        const gameContainer = document.getElementById('gameContainer');
        const previewOverlay = document.querySelector('.preview-overlay');
        
        if (!gameContainer) {
            showNotification('Game container not found', 'error');
            console.error('Game container element not found in DOM');
            return;
        }
        
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
        
        console.log('Game initialization started');
    } catch (error) {
        console.error('Error playing Unity game:', error);
        showNotification('Error starting game: ' + error.message, 'error');
        resetGameState();
    }
}

/**
 * Load Unity WebGL build files and create Unity instance
 * @param {Object} buildConfig - Unity build configuration object
 */
function loadUnityBuild(buildConfig) {
    try {
        const canvas = document.getElementById("unityCanvas");
        const loadingBar = document.getElementById("unityProgressBar");
        const unityLoading = document.getElementById("unityLoading");
        
        if (!canvas) {
            showNotification('Unity canvas not found', 'error');
            console.error('Unity canvas element not found');
            return;
        }
        
        // Show loading screen
        if (unityLoading) {
            unityLoading.style.display = 'flex';
        }
        
        // Clear any existing Unity instance
        if (window.unityInstance) {
            console.log('Cleaning up existing Unity instance');
            try {
                window.unityInstance.Quit();
            } catch (e) {
                console.warn('Error quitting previous Unity instance:', e);
            }
            window.unityInstance = null;
            unityInstance = null;
        }
        
        // Create and load Unity loader script
        const script = document.createElement("script");
        script.src = buildConfig.loaderUrl;
        
        script.onload = () => {
            console.log('Unity loader script loaded successfully');
            
            // Verify Unity loader function exists
            if (typeof createUnityInstance !== "function") {
                showNotification('Unity WebGL loader failed to load', 'error');
                console.error('createUnityInstance function not found');
                if (unityLoading) unityLoading.style.display = 'none';
                resetGameState();
                return;
            }
            
            // Unity build configuration
            const config = {
                dataUrl: buildConfig.dataUrl,
                frameworkUrl: buildConfig.frameworkUrl,
                codeUrl: buildConfig.codeUrl,
                streamingAssetsUrl: "StreamingAssets",
                companyName: buildConfig.companyName,
                productName: buildConfig.productName,
                productVersion: buildConfig.productVersion,
            };
            
            console.log('Creating Unity instance with config:', config);
            
            // Create Unity instance
            createUnityInstance(canvas, config, (progress) => {
                // Update loading progress bar
                if (loadingBar) {
                    const percentage = Math.round(progress * 100);
                    loadingBar.style.width = `${percentage}%`;
                    console.log(`Unity loading progress: ${percentage}%`);
                }
            }).then((instance) => {
                console.log('Unity instance created successfully');
                
                // Store instance globally
                window.unityInstance = instance;
                unityInstance = instance;
                
                // Hide loading screen
                if (unityLoading) {
                    unityLoading.style.display = 'none';
                }
                
                showNotification('Game loaded successfully!', 'success');
            }).catch((message) => {
                console.error('Failed to create Unity instance:', message);
                showNotification('Failed to load game: ' + message, 'error');
                resetGameState();
            });
        };
        
        script.onerror = (error) => {
            console.error('Failed to load Unity loader script:', error);
            showNotification('Failed to load Unity WebGL build', 'error');
            resetGameState();
        };
        
        // Append script to document
        document.body.appendChild(script);
    } catch (error) {
        console.error('Error loading Unity build:', error);
        showNotification('Error loading game: ' + error.message, 'error');
        resetGameState();
    }
}

/**
 * Reset game state to initial state (not playing)
 */
function resetGameState() {
    isGamePlaying = false;
    
    const gameContainer = document.getElementById('gameContainer');
    const previewOverlay = document.querySelector('.preview-overlay');
    const unityLoading = document.getElementById('unityLoading');
    
    if (gameContainer) gameContainer.classList.remove('active');
    if (previewOverlay) previewOverlay.style.display = 'flex';
    if (unityLoading) unityLoading.style.display = 'none';
    
    console.log('Game state reset');
}

// ==========================================
// GAME CONTROL FUNCTIONS
// ==========================================

/**
 * Toggle fullscreen mode for game container
 */
function toggleFullscreen() {
    try {
        const gamePreview = document.querySelector('.game-preview');
        if (!gamePreview) {
            console.error('Game preview element not found');
            return;
        }
        
        // Check if already in fullscreen
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
            
            console.log('Entering fullscreen mode');
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
            
            console.log('Exiting fullscreen mode');
        }
    } catch (error) {
        console.error('Error toggling fullscreen:', error);
        showNotification('Fullscreen error', 'error');
    }
}

/**
 * Restart the current game
 * Quits Unity instance and reinitializes
 */
function restartGame() {
    try {
        if (!unityInstance || !currentGame) {
            showNotification('No game is currently running', 'info');
            return;
        }
        
        console.log('Restarting game:', currentGame.name);
        showNotification('Restarting game...', 'info');
        
        // Quit current Unity instance
        unityInstance.Quit().then(() => {
            console.log('Unity instance quit successfully');
            unityInstance = null;
            window.unityInstance = null;
            
            // Restart game after short delay
            setTimeout(() => {
                playGameUnity(currentGame);
            }, 500);
        }).catch((error) => {
            console.error('Error quitting Unity instance:', error);
            // Try to restart anyway
            unityInstance = null;
            window.unityInstance = null;
            setTimeout(() => {
                playGameUnity(currentGame);
            }, 500);
        });
    } catch (error) {
        console.error('Error restarting game:', error);
        showNotification('Error restarting game', 'error');
    }
}

/**
 * Close the game and return to preview state
 */
function closeGame() {
    try {
        console.log('Closing game');
        
        const gameContainer = document.getElementById('gameContainer');
        const previewOverlay = document.querySelector('.preview-overlay');
        const unityLoading = document.getElementById('unityLoading');
        
        // Quit Unity instance
        if (unityInstance) {
            try {
                unityInstance.Quit();
                console.log('Unity instance quit successfully');
            } catch (e) {
                console.warn('Error quitting Unity:', e);
            }
            unityInstance = null;
            window.unityInstance = null;
        }
        
        // Reset UI state
        if (gameContainer) gameContainer.classList.remove('active');
        if (previewOverlay) previewOverlay.style.display = 'flex';
        if (unityLoading) unityLoading.style.display = 'none';
        
        isGamePlaying = false;
        
        // Exit fullscreen if active
        if (document.fullscreenElement || document.webkitFullscreenElement || 
            document.mozFullScreenElement || document.msFullscreenElement) {
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
        
        showNotification('Game closed', 'info');
    } catch (error) {
        console.error('Error closing game:', error);
        showNotification('Error closing game', 'error');
    }
}

// ==========================================
// SHARE FUNCTIONALITY
// ==========================================

/**
 * Share game using Web Share API or fallback to clipboard
 */
function shareGame() {
    if (!currentGame) {
        showNotification('No game to share', 'error');
        return;
    }
    
    try {
        const shareData = {
            title: currentGame.name,
            text: currentGame.overview || `Check out ${currentGame.name}!`,
            url: window.location.href
        };
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    showNotification('Game shared successfully', 'success');
                    console.log('Game shared via Web Share API');
                })
                .catch((error) => {
                    // User cancelled or error occurred
                    if (error.name !== 'AbortError') {
                        console.error('Share error:', error);
                        fallbackShare();
                    }
                });
        } else {
            // Web Share API not available, use fallback
            fallbackShare();
        }
    } catch (error) {
        console.error('Error sharing game:', error);
        fallbackShare();
    }
}

/**
 * Fallback share function - copies link to clipboard
 */
function fallbackShare() {
    const url = window.location.href;
    
    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Link copied to clipboard', 'success');
                console.log('Link copied to clipboard');
            })
            .catch((error) => {
                console.error('Clipboard error:', error);
                showNotification('Could not copy link', 'error');
            });
    } else {
        // Clipboard API not available
        showNotification('Share not supported on this browser', 'error');
    }
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================

/**
 * Handle keyboard shortcuts
 * - Arrow Left/Right: Navigate between games
 * - Escape: Close game
 * - F: Toggle fullscreen
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardNavigation(e) {
    // Don't interfere with form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateToPreviousGame();
            console.log('Keyboard: Navigate to previous game');
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextGame();
            console.log('Keyboard: Navigate to next game');
            break;
            
        case 'Escape':
            if (isGamePlaying) {
                e.preventDefault();
                closeGame();
                console.log('Keyboard: Close game');
            }
            break;
            
        case 'f':
        case 'F':
            if (isGamePlaying) {
                e.preventDefault();
                toggleFullscreen();
                console.log('Keyboard: Toggle fullscreen');
            }
            break;
            
        case 'r':
        case 'R':
            if (isGamePlaying) {
                e.preventDefault();
                restartGame();
                console.log('Keyboard: Restart game');
            }
            break;
    }
}

// ==========================================
// FULLSCREEN CHANGE HANDLER
// ==========================================

/**
 * Handle fullscreen state changes
 * Updates fullscreen button icon
 */
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    // Check if currently in fullscreen
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                           document.mozFullScreenElement || document.msFullscreenElement);
    
    // Update button icon
    const icon = fullscreenBtn.querySelector('i');
    if (icon) {
        icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    }
    
    // Update button text
    const span = fullscreenBtn.querySelector('span');
    if (span) {
        span.textContent = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
    }
    
    console.log('Fullscreen state:', isFullscreen ? 'active' : 'inactive');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    
    try {
        const date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        
        // Format: Month Day, Year (e.g., "January 15, 2024")
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Format large numbers with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatStatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) {
        return '0';
    }
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toString();
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
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

/**
 * Show notification toast message
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        
        // Set notification style based on type
        let backgroundColor;
        let icon;
        
        switch (type) {
            case 'error':
                backgroundColor = '#dc3545';
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'success':
                backgroundColor = '#28a745';
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                backgroundColor = '#ffc107';
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'info':
            default:
                backgroundColor = '#17a2b8';
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        // Apply styles
        notification.style.cssText = `
            position: fixed;
            top: 6rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: ${backgroundColor};
            color: white;
            border-radius: 12px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 250px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            font-family: 'Inter', sans-serif;
        `;
        
        // Set content with icon
        notification.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        console.log(`Notification [${type}]:`, message);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// ==========================================
// VISIBILITY CHANGE HANDLER
// ==========================================

/**
 * Handle page visibility changes
 * Pauses game when tab is not visible (optional enhancement)
 */
function handleVisibilityChange() {
    if (document.hidden && isGamePlaying) {
        console.log('Page hidden, game is playing');
        // Optional: Pause game or show notification
    } else if (!document.hidden && isGamePlaying) {
        console.log('Page visible, game is playing');
        // Optional: Resume game
    }
}

// Listen for visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// ==========================================
// WINDOW UNLOAD HANDLER
// ==========================================

/**
 * Cleanup when page is about to unload
 * Ensures Unity instance is properly cleaned up
 */
window.addEventListener('beforeunload', () => {
    if (unityInstance) {
        try {
            console.log('Page unloading, cleaning up Unity instance');
            unityInstance.Quit();
        } catch (e) {
            console.warn('Error cleaning up Unity on unload:', e);
        }
    }
});

// ==========================================
// GLOBAL FUNCTION EXPORTS
// Make functions available globally for HTML onclick handlers
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
// AUTO-INITIALIZATION
// Initialize page when DOM is ready
// ==========================================
if (document.readyState === 'loading') {
    // DOM still loading, wait for DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
    console.log('Waiting for DOM to load...');
} else {
    // DOM already loaded, initialize immediately
    initializeGameDetailPage();
}

// ==========================================
// CSS ANIMATIONS (Add to your stylesheet if not present)
// ==========================================
/*
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
*/

// ==========================================
// DEBUG HELPERS (Remove in production)
// ==========================================

/**
 * Debug function to check game state
 * Call window.debugGameState() in console
 */
window.debugGameState = function() {
    console.log('=== GAME STATE DEBUG ===');
    console.log('Current Game ID:', currentGameId);
    console.log('Current Game:', currentGame);
    console.log('Is Game Playing:', isGamePlaying);
    console.log('Unity Instance:', unityInstance);
    console.log('Available Games:', getGames());
    console.log('Unity Builds Config:', unityBuilds);
    console.log('=======================');
};

// Log initialization
console.log('game-detail.js loaded successfully');
console.log('Available functions:', Object.keys(window).filter(key => 
    typeof window[key] === 'function' && 
    ['initializeGameDetailPage', 'playGameUnity', 'shareGame', 'navigateToPreviousGame', 
     'navigateToNextGame', 'toggleTheme', 'toggleFullscreen', 'restartGame', 
     'closeGame', 'debugGameState'].includes(key)
));