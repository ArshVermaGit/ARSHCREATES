// ============================================================================================================
// GAME DETAIL PAGE - YOUTUBE STYLE LAYOUT
// ============================================================================================================
// 
// Description: Comprehensive game detail page with Unity WebGL integration
// Features: Dynamic game loading, Unity player, navigation, theme switching, and social sharing
// Layout: Professional YouTube-inspired design with primary content and sidebar
// 
// Author: Arsh Verma
// Portfolio: ArshCreates
// Created: 2024
// 
// ============================================================================================================

// ============================================================================================================
// GLOBAL STATE VARIABLES
// ============================================================================================================

let currentGameId = null;          // Current game ID from URL parameter
let currentGame = null;            // Current game object with all data
let isGamePlaying = false;         // Flag indicating if game is currently active
let unityInstance = null;          // Reference to Unity WebGL instance for game control

// ============================================================================================================
// UNITY WEBGL BUILD CONFIGURATION
// ============================================================================================================
// Maps game build paths to their Unity WebGL build files
// Add your game builds here with proper paths to loader, data, framework, and wasm files
// ============================================================================================================

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

// ============================================================================================================
// PAGE INITIALIZATION
// ============================================================================================================

/**
 * Initialize the game detail page
 * Called automatically when DOM is ready
 * Sets up theme, loads game data, initializes event listeners, and handles auto-play
 */
function initializeGameDetailPage() {
    console.log('🎮 Initializing game detail page...');
    
    try {
        // Step 1: Initialize theme system
        initializeTheme();
        
        // Step 2: Extract URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        currentGameId = parseInt(urlParams.get('id'));
        const autoPlay = urlParams.get('play') === 'true';
        
        // Step 3: Validate game ID
        if (!currentGameId || isNaN(currentGameId)) {
            console.error('❌ Invalid or missing game ID in URL');
            showNotification('Game not found', 'error');
            setTimeout(() => window.location.href = 'games.html', 2000);
            return;
        }
        
        console.log(`📌 Loading game with ID: ${currentGameId}`);
        
        // Step 4: Load and display game details
        loadGameDetails(currentGameId);
        
        // Step 5: Setup all event listeners
        setupGameDetailEventListeners();
        
        // Step 6: Auto-play if requested via URL parameter
        if (autoPlay) {
            console.log('🎯 Auto-play requested via URL');
            setTimeout(() => {
                if (currentGame && currentGame.status === 'Live' && currentGame.unityBuild) {
                    playGameUnity(currentGame);
                }
            }, 1500);
        }
        
        // Step 7: Hide loading screen with smooth fade animation
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        console.log('✅ Game detail page initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing game detail page:', error);
        showNotification('Error loading game page', 'error');
    }
}

// ============================================================================================================
// THEME MANAGEMENT SYSTEM
// ============================================================================================================

/**
 * Initialize theme system
 * Loads saved theme preference from localStorage and sets up toggle functionality
 */
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        // Load saved theme preference or default to dark mode
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme toggle icon based on current theme
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Attach click event listener to theme toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log(`🎨 Theme initialized: ${savedTheme}`);
        
    } catch (error) {
        console.error('❌ Error initializing theme:', error);
    }
}

/**
 * Toggle between light and dark theme
 * Updates DOM, saves preference, and changes icon
 */
function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('.theme-icon i');
        
        // Apply new theme to document
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon: sun for dark mode, moon for light mode
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log(`🎨 Theme toggled to: ${newTheme}`);
        
    } catch (error) {
        console.error('❌ Error toggling theme:', error);
    }
}

// ============================================================================================================
// GAME DATA LOADING
// ============================================================================================================

/**
 * Load game details from data source
 * Fetches game data by ID and displays all information
 * 
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
            console.error(`❌ Game not found with ID: ${gameId}`);
            showNotification('Game not found', 'error');
            setTimeout(() => window.location.href = 'games.html', 2000);
            return;
        }
        
        // Store current game globally
        currentGame = game;
        
        // Display all game information
        displayGameDetails(game);
        
        // Setup navigation arrows for previous/next game
        setupGameNavigation();
        
        console.log(`✅ Game details loaded: ${game.name}`);
        
    } catch (error) {
        console.error('❌ Error loading game details:', error);
        showNotification('Error loading game details', 'error');
    }
}

// ============================================================================================================
// GAME DETAILS DISPLAY
// ============================================================================================================

/**
 * Display all game details in the UI
 * Updates all DOM elements with game information
 * 
 * @param {Object} game - Game object containing all details
 */
function displayGameDetails(game) {
    try {
        console.log('📝 Displaying game details for:', game.name);
        
        // ===== UPDATE BROWSER TAB TITLE =====
        document.title = `${game.name} - Arsh Verma`;
        
        // ===== PREVIEW IMAGE =====
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = game.image || 'https://via.placeholder.com/1280x720/1a1a2e/ffffff?text=Game+Preview';
            previewImage.alt = `${game.name} - Game Preview`;
            
            // Fallback for broken images
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/1280x720/1a1a2e/ffffff?text=Game+Preview';
                console.warn('⚠️ Failed to load game image, using placeholder');
            };
        }
        
        // ===== GAME HEADER SECTION =====
        updateElement('gameTitle', game.name || 'Unknown Game');
        
        // Update category with icon
        const gameCategory = document.getElementById('gameCategory');
        if (gameCategory) {
            const categorySpan = gameCategory.querySelector('span');
            if (categorySpan) {
                categorySpan.textContent = game.category || 'Uncategorized';
            }
        }
        
        // Update rating
        updateElement('gameRating', game.rating ? game.rating.toFixed(1) : '0.0');
        
        // Update status with proper class
        const gameStatus = document.getElementById('gameStatus');
        if (gameStatus) {
            const statusText = game.status || 'Unknown';
            gameStatus.innerHTML = `<i class="fas fa-circle"></i> ${statusText}`;
            gameStatus.className = `game-status ${game.status === 'Live' ? 'status-live' : 'status-dev'}`;
        }
        
        // ===== GAME DESCRIPTION SECTION =====
        updateElement('gameOverview', game.overview || 'No overview available for this game.');
        updateElement('gameDescription', game.description || 'Detailed description coming soon.');
        
        // ===== SIDEBAR DETAIL CARDS =====
        updateElement('releaseDate', formatDate(game.releaseDate));
        updateElement('developmentTime', game.developmentTime || '-');
        updateElement('teamSize', game.teamSize || '-');
        updateElement('platforms', game.platforms ? game.platforms.join(', ') : '-');
        
        // ===== SIDEBAR STATISTICS =====
        updateElement('playCount', game.playCount ? game.playCount.toLocaleString() : '0');
        updateElement('likes', game.likes ? game.likes.toLocaleString() : '0');
        updateElement('ratingValue', game.rating ? game.rating.toFixed(1) : '0.0');
        
        // ===== FEATURES LIST =====
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
        
        // ===== TECHNOLOGIES TAGS =====
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
        
        // ===== REPOSITORY BUTTON =====
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
        
        // ===== UPDATE PLAY BUTTON STATE =====
        updatePlayButton(game);
        
        console.log('✅ Game details displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying game details:', error);
        showNotification('Error displaying game information', 'error');
    }
}

/**
 * Update a single DOM element's text content
 * Helper function to reduce code repetition
 * 
 * @param {string} elementId - ID of the element to update
 * @param {string} value - Value to display
 */
function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

/**
 * Update the play button based on game status and availability
 * Changes button appearance and functionality based on game state
 * 
 * @param {Object} game - Game object
 */
function updatePlayButton(game) {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) return;
    
    try {
        const playIcon = playBtn.querySelector('.play-icon-circle i');
        const playText = playBtn.querySelector('.play-text');
        
        if (game.status === 'In Development') {
            // Game is still in development - show "Coming Soon"
            if (playIcon) playIcon.className = 'fas fa-clock';
            if (playText) playText.textContent = 'Coming Soon';
            playBtn.disabled = true;
            playBtn.style.cursor = 'not-allowed';
            playBtn.style.opacity = '0.6';
            playBtn.onclick = null;
            
        } else if (!game.unityBuild) {
            // No playable WebGL build available - show "View Project"
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
            // Game is playable via WebGL
            if (playIcon) playIcon.className = 'fas fa-play';
            if (playText) playText.textContent = 'Play Game';
            playBtn.disabled = false;
            playBtn.style.cursor = 'pointer';
            playBtn.style.opacity = '1';
            playBtn.onclick = () => playGameUnity(game);
        }
        
    } catch (error) {
        console.error('❌ Error updating play button:', error);
    }
}

// ============================================================================================================
// EVENT LISTENERS SETUP
// ============================================================================================================

/**
 * Setup all event listeners for the game detail page
 * Attaches click handlers to all interactive elements
 */
function setupGameDetailEventListeners() {
    try {
        console.log('🔧 Setting up event listeners...');
        
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
        
        // ===== FULLSCREEN CHANGE EVENTS (Cross-browser) =====
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        console.log('✅ Event listeners setup complete');
        
    } catch (error) {
        console.error('❌ Error setting up event listeners:', error);
    }
}

// ============================================================================================================
// GAME NAVIGATION (PREVIOUS/NEXT)
// ============================================================================================================

/**
 * Setup previous/next game navigation arrows
 * Attaches click handlers to navigation buttons
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
        
        console.log('✅ Game navigation setup complete');
        
    } catch (error) {
        console.error('❌ Error setting up game navigation:', error);
    }
}

/**
 * Navigate to the previous game in the list
 * Wraps around to the last game if at the beginning
 */
function navigateToPreviousGame() {
    try {
        const games = getGames();
        if (!games || !Array.isArray(games)) {
            console.error('❌ Games data not available');
            return;
        }
        
        const currentIndex = games.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) {
            console.error('❌ Current game not found in games list');
            return;
        }
        
        // Wrap around to last game if at beginning
        const prevIndex = (currentIndex - 1 + games.length) % games.length;
        const prevGame = games[prevIndex];
        
        console.log(`⬅️ Navigating to previous game: ${prevGame.name}`);
        
        // Navigate to previous game
        window.location.href = `game-detail.html?id=${prevGame.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to previous game:', error);
        showNotification('Navigation error', 'error');
    }
}

/**
 * Navigate to the next game in the list
 * Wraps around to the first game if at the end
 */
function navigateToNextGame() {
    try {
        const games = getGames();
        if (!games || !Array.isArray(games)) {
            console.error('❌ Games data not available');
            return;
        }
        
        const currentIndex = games.findIndex(g => g.id === currentGameId);
        if (currentIndex === -1) {
            console.error('❌ Current game not found in games list');
            return;
        }
        
        // Wrap around to first game if at end
        const nextIndex = (currentIndex + 1) % games.length;
        const nextGame = games[nextIndex];
        
        console.log(`➡️ Navigating to next game: ${nextGame.name}`);
        
        // Navigate to next game
        window.location.href = `game-detail.html?id=${nextGame.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to next game:', error);
        showNotification('Navigation error', 'error');
    }
}

// ============================================================================================================
// UNITY WEBGL GAME FUNCTIONS
// ============================================================================================================

/**
 * Initialize and play Unity WebGL game
 * Validates game availability, shows game container, and loads Unity build
 * 
 * @param {Object} game - Game object with Unity build configuration
 */
function playGameUnity(game) {
    console.log(`🎮 Attempting to play game: ${game.name}`);
    
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
            console.error('❌ Build config not found for:', game.unityBuild);
            return;
        }
        
        // Get necessary DOM elements
        const gameContainer = document.getElementById('gameContainer');
        const previewContainer = document.getElementById('previewContainer');
        
        if (!gameContainer) {
            showNotification('Game container not found', 'error');
            console.error('❌ Game container element not found in DOM');
            return;
        }
        
        // Show game container and hide preview
        gameContainer.style.display = 'block';
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
        
        isGamePlaying = true;
        
        // Load Unity WebGL build
        loadUnityBuild(buildConfig);
        
        showNotification(`Starting ${game.name}...`, 'success');
        
        console.log('✅ Game initialization started');
        
    } catch (error) {
        console.error('❌ Error playing Unity game:', error);
        showNotification('Error starting game: ' + error.message, 'error');
        resetGameState();
    }
}

/**
 * Load Unity WebGL build files and create Unity instance
 * Dynamically loads Unity loader script and creates game instance
 * 
 * @param {Object} buildConfig - Unity build configuration object
 */
function loadUnityBuild(buildConfig) {
    try {
        console.log('📦 Loading Unity build...');
        console.log('Build config:', buildConfig);
        
        const canvas = document.getElementById("unityCanvas");
        const loadingBar = document.getElementById("unityProgressBar");
        const unityLoading = document.getElementById("unityLoading");
        
        if (!canvas) {
            showNotification('Unity canvas not found', 'error');
            console.error('❌ Unity canvas element not found');
            return;
        }
        
        // Show loading screen
        if (unityLoading) {
            unityLoading.style.display = 'flex';
        }
        
        // Clear any existing Unity instance
        if (window.unityInstance) {
            console.log('🧹 Cleaning up existing Unity instance');
            try {
                window.unityInstance.Quit();
            } catch (e) {
                console.warn('⚠️ Error quitting previous Unity instance:', e);
            }
            window.unityInstance = null;
            unityInstance = null;
        }
        
        // Create and load Unity loader script
        const script = document.createElement("script");
        script.src = buildConfig.loaderUrl;
        
        let loadTimeout = setTimeout(() => {
            console.error('❌ Unity loader timeout - taking too long to load');
            showNotification('Game loading timeout. The build files might be incomplete.', 'error');
            resetGameState();
        }, 30000); // 30 second timeout
        
        script.onload = () => {
            clearTimeout(loadTimeout);
            console.log('✅ Unity loader script loaded successfully');
            
            // Verify Unity loader function exists
            if (typeof createUnityInstance !== "function") {
                showNotification('Unity WebGL loader failed. Check Unity version.', 'error');
                console.error('❌ createUnityInstance function not found');
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
            
            console.log('⚙️ Creating Unity instance with config:', config);
            
            // Create Unity instance with progress tracking
            createUnityInstance(canvas, config, (progress) => {
                console.log(`📊 Unity loading progress: ${Math.round(progress * 100)}%`);
                
                // Update loading progress bar
                if (loadingBar) {
                    const percentage = Math.round(progress * 100);
                    loadingBar.style.width = `${percentage}%`;
                    
                    // If progress is stuck at 0% for too long, there's an issue
                    if (percentage === 0) {
                        console.warn('⚠️ Progress stuck at 0% - check .data file');
                    }
                }
            }).then((instance) => {
                console.log('✅ Unity instance created successfully');
                
                // Store instance globally
                window.unityInstance = instance;
                unityInstance = instance;
                
                // Hide loading screen
                if (unityLoading) {
                    unityLoading.style.display = 'none';
                }
                
                showNotification('Game loaded successfully!', 'success');
                
            }).catch((message) => {
                console.error('❌ Failed to create Unity instance:', message);
                showNotification('Failed to load game. The build might be corrupted.', 'error');
                resetGameState();
            });
        };
        
        script.onerror = (error) => {
            clearTimeout(loadTimeout);
            console.error('❌ Failed to load Unity loader script:', error);
            showNotification('Cannot load game files. Check if WebGL build is complete.', 'error');
            resetGameState();
        };
        
        // Append script to document
        document.body.appendChild(script);
        
    } catch (error) {
        console.error('❌ Error loading Unity build:', error);
        showNotification('Error loading game: ' + error.message, 'error');
        resetGameState();
    }
}

/**
 * Debug function to check if Unity files are accessible
 */
window.checkUnityFiles = async function() {
    const buildConfig = unityBuilds["static/games_files/sky_surfers/"];
    
    if (!buildConfig) {
        console.error('❌ Build config not found');
        return;
    }
    
    console.log('🔍 Checking Unity file accessibility...');
    
    const filesToCheck = [
        { name: 'Loader', url: buildConfig.loaderUrl },
        { name: 'Data', url: buildConfig.dataUrl },
        { name: 'Framework', url: buildConfig.frameworkUrl },
        { name: 'WASM', url: buildConfig.codeUrl }
    ];
    
    for (const file of filesToCheck) {
        try {
            const response = await fetch(file.url, { method: 'HEAD' });
            console.log(`✅ ${file.name}: ${response.status === 200 ? 'ACCESSIBLE' : 'NOT FOUND'}`);
        } catch (error) {
            console.error(`❌ ${file.name}: ${error.message}`);
        }
    }
};

/**
 * Reset game state to initial state (not playing)
 * Hides game container and shows preview again
 */
function resetGameState() {
    console.log('🔄 Resetting game state');
    
    isGamePlaying = false;
    
    const gameContainer = document.getElementById('gameContainer');
    const previewContainer = document.getElementById('previewContainer');
    const unityLoading = document.getElementById('unityLoading');
    
    if (gameContainer) gameContainer.style.display = 'none';
    if (previewContainer) previewContainer.style.display = 'block';
    if (unityLoading) unityLoading.style.display = 'none';
    
    console.log('✅ Game state reset complete');
}

// ============================================================================================================
// GAME CONTROL FUNCTIONS
// ============================================================================================================

/**
 * Toggle fullscreen mode for game container
 * Supports cross-browser fullscreen API
 */
function toggleFullscreen() {
    try {
        const gamePlayerWrapper = document.querySelector('.game-player-wrapper');
        if (!gamePlayerWrapper) {
            console.error('❌ Game player wrapper element not found');
            return;
        }
        
        // Check if already in fullscreen
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                document.mozFullScreenElement || document.msFullscreenElement);
        
        if (!isFullscreen) {
            // Enter fullscreen
            console.log('🖥️ Entering fullscreen mode');
            
            if (gamePlayerWrapper.requestFullscreen) {
                gamePlayerWrapper.requestFullscreen();
            } else if (gamePlayerWrapper.webkitRequestFullscreen) {
                gamePlayerWrapper.webkitRequestFullscreen();
            } else if (gamePlayerWrapper.mozRequestFullScreen) {
                gamePlayerWrapper.mozRequestFullScreen();
            } else if (gamePlayerWrapper.msRequestFullscreen) {
                gamePlayerWrapper.msRequestFullscreen();
            }
            
        } else {
            // Exit fullscreen
            console.log('🖥️ Exiting fullscreen mode');
            
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
        
    } catch (error) {
        console.error('❌ Error toggling fullscreen:', error);
        showNotification('Fullscreen error', 'error');
    }
}

/**
 * Restart the current game
 * Quits Unity instance and reinitializes the game
 */
function restartGame() {
    try {
        if (!unityInstance || !currentGame) {
            showNotification('No game is currently running', 'info');
            return;
        }
        
        console.log(`🔄 Restarting game: ${currentGame.name}`);
        showNotification('Restarting game...', 'info');
        
        // Quit current Unity instance
        unityInstance.Quit().then(() => {
            console.log('✅ Unity instance quit successfully');
            unityInstance = null;
            window.unityInstance = null;
            
            // Restart game after short delay
            setTimeout(() => {
                playGameUnity(currentGame);
            }, 500);
            
        }).catch((error) => {
            console.error('⚠️ Error quitting Unity instance:', error);
            // Try to restart anyway
            unityInstance = null;
            window.unityInstance = null;
            setTimeout(() => {
                playGameUnity(currentGame);
            }, 500);
        });
        
    } catch (error) {
        console.error('❌ Error restarting game:', error);
        showNotification('Error restarting game', 'error');
    }
}

/**
 * Close the game and return to preview state
 * Quits Unity instance and resets UI
 */
function closeGame() {
    try {
        console.log('❌ Closing game');
        
        const gameContainer = document.getElementById('gameContainer');
        const previewContainer = document.getElementById('previewContainer');
        const unityLoading = document.getElementById('unityLoading');
        
        // Quit Unity instance
        if (unityInstance) {
            try {
                unityInstance.Quit();
                console.log('✅ Unity instance quit successfully');
            } catch (e) {
                console.warn('⚠️ Error quitting Unity:', e);
            }
            unityInstance = null;
            window.unityInstance = null;
        }
        
        // Reset UI state
        if (gameContainer) gameContainer.style.display = 'none';
        if (previewContainer) previewContainer.style.display = 'block';
        if (unityLoading) unityLoading.style.display = 'none';
        
        isGamePlaying = false;
        
        // Exit fullscreen if active
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                document.mozFullScreenElement || document.msFullscreenElement);
        
        if (isFullscreen) {
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
        console.log('✅ Game closed successfully');
        
    } catch (error) {
        console.error('❌ Error closing game:', error);
        showNotification('Error closing game', 'error');
    }
}

// ============================================================================================================
// SHARE FUNCTIONALITY
// ============================================================================================================

/**
 * Share game using Web Share API or fallback to clipboard
 * Allows users to share game via native share dialog or copy link
 */
function shareGame() {
    if (!currentGame) {
        showNotification('No game to share', 'error');
        return;
    }
    
    try {
        const shareData = {
            title: `${currentGame.name} - ArshCreates`,
            text: currentGame.overview || `Check out ${currentGame.name} by Arsh Verma!`,
            url: window.location.href
        };
        
        // Check if Web Share API is available (mobile/modern browsers)
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    showNotification('Game shared successfully', 'success');
                    console.log('✅ Game shared via Web Share API');
                })
                .catch((error) => {
                    // User cancelled or error occurred
                    if (error.name !== 'AbortError') {
                        console.error('❌ Share error:', error);
                        fallbackShare();
                    }
                });
        } else {
            // Web Share API not available, use fallback
            fallbackShare();
        }
        
    } catch (error) {
        console.error('❌ Error sharing game:', error);
        fallbackShare();
    }
}

/**
 * Fallback share function - copies link to clipboard
 * Used when Web Share API is not available
 */
function fallbackShare() {
    const url = window.location.href;
    
    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Link copied to clipboard!', 'success');
                console.log('✅ Link copied to clipboard');
            })
            .catch((error) => {
                console.error('❌ Clipboard error:', error);
                showManualCopyDialog(url);
            });
    } else {
        // Clipboard API not available - show manual copy dialog
        showManualCopyDialog(url);
    }
}

/**
 * Show manual copy dialog for browsers without clipboard access
 * 
 * @param {string} url - URL to display for copying
 */
function showManualCopyDialog(url) {
    const dialog = prompt('Copy this link to share:', url);
    if (dialog !== null) {
        showNotification('Please copy the link manually', 'info');
    }
}

// ============================================================================================================
// KEYBOARD NAVIGATION
// ============================================================================================================

/**
 * Handle keyboard shortcuts for navigation and game control
 * 
 * Keyboard shortcuts:
 * - Arrow Left: Navigate to previous game
 * - Arrow Right: Navigate to next game
 * - Escape: Close game
 * - F: Toggle fullscreen
 * - R: Restart game
 * 
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardNavigation(e) {
    // Don't interfere with form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (e.key) {
            
        case 'Escape':
            if (isGamePlaying) {
                e.preventDefault();
                closeGame();
                console.log('⌨️ Keyboard: Close game');
            }
            break;
            
        case 'f':
        case 'F':
            if (isGamePlaying) {
                e.preventDefault();
                toggleFullscreen();
                console.log('⌨️ Keyboard: Toggle fullscreen');
            }
            break;
            
        case 'r':
        case 'R':
            if (isGamePlaying) {
                e.preventDefault();
                restartGame();
                console.log('⌨️ Keyboard: Restart game');
            }
            break;
    }
}

// ============================================================================================================
// FULLSCREEN CHANGE HANDLER
// ============================================================================================================

/**
 * Handle fullscreen state changes
 * Updates fullscreen button icon and text based on current state
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
    
    console.log(`🖥️ Fullscreen state: ${isFullscreen ? 'active' : 'inactive'}`);
}

// ============================================================================================================
// UTILITY FUNCTIONS
// ============================================================================================================

/**
 * Format date string to readable format
 * Converts ISO date string to human-readable format
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (e.g., "January 15, 2024")
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
        console.error('❌ Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Format large numbers with K/M suffixes
 * Converts large numbers to compact format with suffixes
 * 
 * @param {number} num - Number to format
 * @returns {string} Formatted number string (e.g., "1.5K", "2.3M")
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
 * Escape HTML special characters to prevent XSS attacks
 * Sanitizes user input before displaying in DOM
 * 
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML insertion
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
 * Displays temporary notification in top-right corner
 * 
 * @param {string} message - Notification message to display
 * @param {string} type - Notification type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        
        // Set notification style and icon based on type
        let icon;
        
        switch (type) {
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'info':
            default:
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        // Set notification content with icon
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${escapeHtml(message)}</div>
        `;
        
        // Get or create notification container
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Add notification to container
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        console.log(`📢 Notification [${type}]: ${message}`);
        
    } catch (error) {
        console.error('❌ Error showing notification:', error);
    }
}

// ============================================================================================================
// PAGE VISIBILITY HANDLER
// ============================================================================================================

/**
 * Handle page visibility changes
 * Optional: Can be used to pause game when tab is not visible
 */
function handleVisibilityChange() {
    if (document.hidden && isGamePlaying) {
        console.log('👁️ Page hidden, game is playing');
        // Optional: Pause game or show notification
    } else if (!document.hidden && isGamePlaying) {
        console.log('👁️ Page visible, game is playing');
        // Optional: Resume game
    }
}

// Listen for visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// ============================================================================================================
// WINDOW UNLOAD HANDLER
// ============================================================================================================

/**
 * Cleanup when page is about to unload
 * Ensures Unity instance is properly cleaned up to prevent memory leaks
 */
window.addEventListener('beforeunload', () => {
    if (unityInstance) {
        try {
            console.log('🧹 Page unloading, cleaning up Unity instance');
            unityInstance.Quit();
        } catch (e) {
            console.warn('⚠️ Error cleaning up Unity on unload:', e);
        }
    }
});

// ============================================================================================================
// GLOBAL FUNCTION EXPORTS
// ============================================================================================================
// Make functions available globally for inline HTML event handlers and console debugging

window.initializeGameDetailPage = initializeGameDetailPage;
window.playGameUnity = playGameUnity;
window.shareGame = shareGame;
window.navigateToPreviousGame = navigateToPreviousGame;
window.navigateToNextGame = navigateToNextGame;
window.toggleTheme = toggleTheme;
window.toggleFullscreen = toggleFullscreen;
window.restartGame = restartGame;
window.closeGame = closeGame;

// ============================================================================================================
// DEBUG HELPERS
// ============================================================================================================
// Helpful functions for debugging - can be removed in production

/**
 * Debug function to check current game state
 * Usage: Open browser console and type: window.debugGameState()
 */
window.debugGameState = function() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║       GAME STATE DEBUG INFO            ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('Current Game ID:', currentGameId);
    console.log('Current Game Object:', currentGame);
    console.log('Is Game Playing:', isGamePlaying);
    console.log('Unity Instance:', unityInstance);
    console.log('Available Games:', getGames());
    console.log('Unity Builds Config:', unityBuilds);
    console.log('Theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Fullscreen:', !!(document.fullscreenElement || document.webkitFullscreenElement));
    console.log('═══════════════════════════════════════════');
};

/**
 * Debug function to test notifications
 * Usage: window.testNotifications()
 */
window.testNotifications = function() {
    showNotification('This is an info notification', 'info');
    setTimeout(() => showNotification('This is a success notification', 'success'), 500);
    setTimeout(() => showNotification('This is a warning notification', 'warning'), 1000);
    setTimeout(() => showNotification('This is an error notification', 'error'), 1500);
};

// ============================================================================================================
// AUTO-INITIALIZATION
// ============================================================================================================
// Initialize page when DOM is ready

if (document.readyState === 'loading') {
    // DOM still loading, wait for DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
    console.log('⏳ Waiting for DOM to load...');
} else {
    // DOM already loaded, initialize immediately
    initializeGameDetailPage();
}

// ============================================================================================================
// INITIALIZATION COMPLETE
// ============================================================================================================

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║  GAME DETAIL PAGE - JavaScript Loaded Successfully             ║');
console.log('║  Author: Arsh Verma                                            ║');
console.log('║  Portfolio: ArshCreates                                        ║');
console.log('║                                                                ║');
console.log('║  Available Debug Commands:                                     ║');
console.log('║  • window.debugGameState()    - View current state             ║');
console.log('║  • window.testNotifications() - Test notification system       ║');
console.log('╚════════════════════════════════════════════════════════════════╝');

// ============================================================================================================
// END OF FILE
// ============================================================================================================