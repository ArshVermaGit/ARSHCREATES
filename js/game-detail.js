// ==========================================
// GAME DETAIL PAGE - Individual game presentation
// Handles game preview, navigation, and interactions
// ==========================================

// Global Variables
let currentGameId = null;
let currentGame = null;
let isGamePlaying = false;
let unityInstance = null;

// Unity WebGL Build Configuration - FIXED PATHS
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
    // Add more games here as needed
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
                if (currentGame && currentGame.status === 'Live') {
                    playGameUnity(currentGame);
                }
            }, 1000);
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
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme icon
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Add theme toggle event listener
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
        
        // Update theme icon
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
        
        // Update preview image with fallback
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            // Use placeholder if image doesn't exist
            previewImage.src = game.image || 'https://via.placeholder.com/800x450/393E41/FFFFFF?text=Game+Preview';
            previewImage.alt = game.name;
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/800x450/393E41/FFFFFF?text=Game+Preview';
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
        } else if (featuresList) {
            featuresList.innerHTML = '<li><i class="fas fa-info-circle"></i><span>No features listed</span></li>';
        }
        
        // Update technologies
        const techList = document.getElementById('techList');
        if (techList && game.technologies && Array.isArray(game.technologies)) {
            techList.innerHTML = game.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');
        } else if (techList) {
            techList.innerHTML = '<span class="tech-tag">Not specified</span>';
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
        
        // Animate content
        animateGameDetails();
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
        
        // Preview image click to play
        const previewImage = document.querySelector('.preview-image');
        if (previewImage) {
            previewImage.addEventListener('click', (e) => {
                // Only trigger if not clicking on the play button
                if (!e.target.closest('.btn-play-large') && currentGame && currentGame.status === 'Live' && !isGamePlaying) {
                    playGameUnity(currentGame);
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Fullscreen change handlers
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
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

// Unity WebGL Game Functions - IMPROVED ERROR HANDLING
function playGameUnity(game) {
    console.log('Attempting to play game:', game.name);
    
    try {
        if (!game.unityBuild) {
            showNotification('This game is not available for WebGL play', 'info');
            
            // Fallback: Open repository or show message
            if (game.repositoryUrl) {
                window.open(game.repositoryUrl, '_blank');
            }
            return;
        }
        
        const buildConfig = unityBuilds[game.unityBuild];
        if (!buildConfig) {
            showNotification('Game build configuration not found', 'error');
            console.error('Build config not found for:', game.unityBuild);
            console.log('Available builds:', Object.keys(unityBuilds));
            return;
        }
        
        const gameContainer = document.getElementById('gameContainer');
        const unityContainer = document.getElementById('unityContainer');
        const previewImage = document.querySelector('.preview-image');
        
        if (gameContainer && unityContainer) {
            // Show game container
            gameContainer.classList.add('active');
            isGamePlaying = true;
            
            // Hide preview overlay
            if (previewImage) {
                const overlay = previewImage.querySelector('.preview-overlay');
                if (overlay) overlay.style.display = 'none';
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
        
        // Remove existing Unity loader script
        const existingScript = document.querySelector('script[src*="unity"], script[src*="Build"]');
        if (existingScript) {
            existingScript.remove();
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
                streamingAssetsUrl: buildConfig.streamingAssetsUrl || "StreamingAssets",
                companyName: buildConfig.companyName || "ArshCreates",
                productName: buildConfig.productName || (currentGame ? currentGame.name : "Game"),
                productVersion: buildConfig.productVersion || "1.0",
                showBanner: () => {} // Suppress default banner
            };
            
            createUnityInstance(canvas, config, (progress) => {
                // Update progress bar
                if (loadingBar) {
                    loadingBar.style.width = `${progress * 100}%`;
                }
            }).then((instance) => {
                console.log('Unity instance created successfully');
                window.unityInstance = instance;
                unityInstance = instance;
                
                // Hide loading screen when game is ready
                if (unityLoading) {
                    unityLoading.style.display = 'none';
                }
                showNotification('Game loaded successfully!', 'success');
            }).catch((message) => {
                console.error('Failed to create Unity instance:', message);
                showNotification('Failed to load game. Please check console for details.', 'error');
                if (unityLoading) {
                    unityLoading.style.display = 'none';
                }
                // Reset game state on error
                isGamePlaying = false;
                const gameContainer = document.getElementById('gameContainer');
                if (gameContainer) {
                    gameContainer.classList.remove('active');
                }
                // Show preview overlay again
                const previewImage = document.querySelector('.preview-image');
                if (previewImage) {
                    const overlay = previewImage.querySelector('.preview-overlay');
                    if (overlay) overlay.style.display = 'flex';
                }
            });
        };
        
        script.onerror = (error) => {
            console.error('Failed to load Unity loader:', error);
            showNotification('Failed to load Unity WebGL build. The game files might be missing.', 'error');
            if (unityLoading) {
                unityLoading.style.display = 'none';
            }
            // Reset game state on error
            isGamePlaying = false;
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer) {
                gameContainer.classList.remove('active');
            }
            // Show preview overlay again
            const previewImage = document.querySelector('.preview-image');
            if (previewImage) {
                const overlay = previewImage.querySelector('.preview-overlay');
                if (overlay) overlay.style.display = 'flex';
            }
        };
        
        document.body.appendChild(script);
    } catch (error) {
        console.error('Error loading Unity build:', error);
        showNotification('Error loading game: ' + error.message, 'error');
    }
}

// Game Interaction Functions
function toggleFullscreen() {
    try {
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;
        
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
            // Enter fullscreen
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.mozRequestFullScreen) {
                gameContainer.mozRequestFullScreen();
            } else if (gameContainer.msRequestFullscreen) {
                gameContainer.msRequestFullscreen();
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
    } catch (error) {
        console.error('Error toggling fullscreen:', error);
        showNotification('Error toggling fullscreen', 'error');
    }
}

function restartGame() {
    try {
        if (unityInstance) {
            unityInstance.Quit().then(() => {
                setTimeout(() => {
                    if (currentGame) {
                        playGameUnity(currentGame);
                    }
                }, 500);
            });
            showNotification('Restarting game...', 'info');
        } else {
            showNotification('No game is currently playing', 'warning');
        }
    } catch (error) {
        console.error('Error restarting game:', error);
        showNotification('Error restarting game', 'error');
    }
}

function closeGame() {
    try {
        const gameContainer = document.getElementById('gameContainer');
        const unityContainer = document.getElementById('unityContainer');
        const previewImage = document.querySelector('.preview-image');
        
        if (unityInstance) {
            try {
                unityInstance.Quit();
            } catch (e) {
                console.warn('Error quitting Unity instance:', e);
            }
            unityInstance = null;
            window.unityInstance = null;
        }
        
        if (gameContainer) {
            gameContainer.classList.remove('active');
        }
        
        // Clear Unity container
        if (unityContainer) {
            const canvas = document.getElementById('unityCanvas');
            if (canvas) {
                canvas.width = 0;
                canvas.height = 0;
            }
            
            const loading = document.getElementById('unityLoading');
            if (loading) {
                loading.style.display = 'none';
            }
        }
        
        // Show preview overlay
        if (previewImage) {
            const overlay = previewImage.querySelector('.preview-overlay');
            if (overlay) overlay.style.display = 'flex';
        }
        
        isGamePlaying = false;
        
        // Exit fullscreen if active
        if (document.fullscreenElement || 
            document.webkitFullscreenElement || 
            document.mozFullScreenElement || 
            document.msFullscreenElement) {
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
    } catch (error) {
        console.error('Error sharing game:', error);
        fallbackShare();
    }
}

function fallbackShare() {
    try {
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
    } catch (error) {
        console.error('Error in fallback share:', error);
        showNotification('Could not share game', 'error');
    }
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    try {
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
                    e.preventDefault();
                    closeGame();
                }
                break;
            case ' ':
            case 'Enter':
                if (!isGamePlaying && currentGame && currentGame.status === 'Live') {
                    e.preventDefault();
                    playGameUnity(currentGame);
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
    } catch (error) {
        console.error('Error handling keyboard navigation:', error);
    }
}

// Fullscreen Change Handler
function handleFullscreenChange() {
    try {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (!fullscreenBtn) return;
        
        const isFullscreen = !!(document.fullscreenElement || 
                                document.webkitFullscreenElement || 
                                document.mozFullScreenElement || 
                                document.msFullscreenElement);
        
        const icon = fullscreenBtn.querySelector('i');
        if (icon) {
            icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
        }
        fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';
    } catch (error) {
        console.error('Error handling fullscreen change:', error);
    }
}

// Animate Game Details
function animateGameDetails() {
    try {
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
    } catch (error) {
        console.error('Error animating game details:', error);
    }
}

// Utility Functions
function formatDate(dateString) {
    try {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return 'Invalid Date';
    }
}

function formatStatNumber(num) {
    if (typeof num !== 'number') return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function showNotification(message, type = 'info') {
    try {
        // Use existing notification function or create a simple one
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`${type}: ${message}`);
            // Create a simple notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
                color: white;
                border-radius: 4px;
                z-index: 10000;
                font-weight: 500;
                max-width: 300px;
                word-wrap: break-word;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Fallback for getGames if not defined
if (typeof getGames === 'undefined') {
    window.getGames = function() {
        console.warn('getGames function not defined. Using fallback.');
        try {
            // Try to get from PORTFOLIO_DATA first
            if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.games) {
                return window.PORTFOLIO_DATA.games;
            }
            
            // Fallback to localStorage
            const storedGames = localStorage.getItem('games');
            if (storedGames) {
                return JSON.parse(storedGames);
            }
        } catch (error) {
            console.error('Error getting games:', error);
        }
        return [];
    };
}

// Make functions globally available
window.initializeGameDetailPage = initializeGameDetailPage;
window.playGameUnity = playGameUnity;
window.shareGame = shareGame;
window.navigateToPreviousGame = navigateToPreviousGame;
window.navigateToNextGame = navigateToNextGame;
window.toggleTheme = toggleTheme;
window.closeGame = closeGame;
window.restartGame = restartGame;
window.toggleFullscreen = toggleFullscreen;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameDetailPage);
} else {
    initializeGameDetailPage();
}