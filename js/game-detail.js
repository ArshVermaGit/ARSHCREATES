// ============================================
// GAME DETAIL PAGE SCRIPT
// ============================================

class GameDetailPage {
    constructor() {
        this.currentGame = null;
        this.isPlaying = false;
        this.isFullscreen = false;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.loadGame();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingBar = document.getElementById('loadingBar');
        
        if (!loadingScreen) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.visibility = 'hidden';
                }, 500);
            }
            
            if (loadingBar) loadingBar.style.width = `${progress}%`;
        }, 200);
    }

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const theme = document.documentElement.getAttribute('data-theme');
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
            });
        }
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    loadGame() {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('id');

        if (!gameId) {
            this.redirectToGames();
            return;
        }

        this.currentGame = getItemById('games', parseInt(gameId));

        if (!this.currentGame) {
            this.redirectToGames();
            return;
        }

        this.displayGameInfo();
    }

    redirectToGames() {
        window.location.href = 'games.html';
    }

    displayGameInfo() {
        const game = this.currentGame;

        // Update page title and meta
        document.title = `${game.name} - Arsh Verma`;
        
        // Update main game info
        document.getElementById('gameTitle').textContent = game.name;
        document.getElementById('gameCategory').textContent = game.category;
        document.getElementById('gameRating').textContent = game.rating;
        document.getElementById('gameStatus').textContent = game.status;
        document.getElementById('gameOverview').textContent = game.overview;
        document.getElementById('gameDescription').textContent = game.description;
        
        // Update preview image
        document.getElementById('previewImage').src = game.image;
        document.getElementById('previewImage').alt = game.name;

        // Update details
        document.getElementById('releaseDate').textContent = formatDate(game.releaseDate);
        document.getElementById('developmentTime').textContent = game.developmentTime;
        document.getElementById('teamSize').textContent = `${game.teamSize} people`;
        document.getElementById('likes').textContent = this.formatNumber(game.likes);
        document.getElementById('playCount').textContent = this.formatNumber(game.playCount);
        document.getElementById('platforms').textContent = game.platforms.join(', ');

        // Update repository button
        const repoBtn = document.getElementById('repositoryBtn');
        if (game.repositoryUrl) {
            repoBtn.href = game.repositoryUrl;
        } else {
            repoBtn.style.display = 'none';
        }

        // Update features list
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = game.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');

        // Update technologies
        const techList = document.getElementById('techList');
        techList.innerHTML = game.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        // Update stats circles
        document.getElementById('ratingCircle').textContent = game.rating;
        document.getElementById('playCountCircle').textContent = this.formatNumber(game.playCount);
        document.getElementById('likesCircle').textContent = this.formatNumber(game.likes);

        // Animate stat circles
        this.animateStatCircles();
    }

    animateStatCircles() {
        const circles = document.querySelectorAll('.stat-circle');
        circles.forEach(circle => {
            circle.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                circle.style.animation = '';
            }, 2000);
        });
    }

    setupEventListeners() {
        // Play button
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.startGame());
        }

        // Control buttons
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const restartBtn = document.getElementById('restartBtn');
        const closeGameBtn = document.getElementById('closeGameBtn');

        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartGame());
        if (closeGameBtn) closeGameBtn.addEventListener('click', () => this.closeGame());

        // Navigation arrows
        const prevBtn = document.getElementById('prevGame');
        const nextBtn = document.getElementById('nextGame');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateToPrevGame());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateToNextGame());
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareGame());
        }

        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key to close game
            if (e.key === 'Escape' && this.isPlaying) {
                this.closeGame();
            }

            // Arrow keys for navigation
            if (!this.isPlaying) {
                if (e.key === 'ArrowLeft') {
                    this.navigateToPrevGame();
                } else if (e.key === 'ArrowRight') {
                    this.navigateToNextGame();
                }
            }

            // Space bar to play/pause
            if (e.key === ' ' && !this.isPlaying) {
                e.preventDefault();
                this.startGame();
            }
        });
    }

    // In the startGame method, update to:
    startGame() {
        const game = this.currentGame;
     
        if (!game.gameFile) {
            this.showNotification('Game file not available', 'error');
            return;
        }

        const preview = document.querySelector('.game-preview');
        const container = document.getElementById('gameContainer');
        const frame = document.getElementById('gameFrame');
        const playBtn = document.getElementById('playBtn');
        const controls = document.querySelector('.game-controls');

        if (!preview || !container || !frame) return;

    // Hide preview, show game
        preview.style.display = 'none';
        container.style.display = 'block';
        controls.style.display = 'flex';

    // Load game - use the correct path
        frame.src = game.gameFile;
        this.isPlaying = true;

    // Update UI
        if (playBtn) playBtn.style.display = 'none';

        this.showNotification('Game started! Press ESC to exit.', 'success');
    }

    closeGame() {
        const preview = document.querySelector('.game-preview');
        const container = document.getElementById('gameContainer');
        const frame = document.getElementById('gameFrame');
        const playBtn = document.getElementById('playBtn');
        const controls = document.querySelector('.game-controls');

        if (!preview || !container || !frame) return;

        // Show preview, hide game
        preview.style.display = 'block';
        container.style.display = 'none';
        controls.style.display = 'none';

        // Stop game
        frame.src = '';
        this.isPlaying = false;

        // Update UI
        if (playBtn) playBtn.style.display = 'flex';

        // Exit fullscreen if active
        if (this.isFullscreen) {
            document.exitFullscreen();
        }

        this.showNotification('Game closed', 'info');
    }

    restartGame() {
        const frame = document.getElementById('gameFrame');
        if (frame && this.isPlaying) {
            const currentSrc = frame.src;
            frame.src = '';
            setTimeout(() => {
                frame.src = currentSrc;
            }, 100);
            this.showNotification('Game restarted', 'info');
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('gameContainer');
        
        if (!this.isFullscreen) {
            if (container) {
                container.requestFullscreen().catch(err => {
                    console.error('Error entering fullscreen:', err);
                    this.showNotification('Fullscreen not supported', 'error');
                });
            }
        } else {
            document.exitFullscreen();
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            const icon = fullscreenBtn.querySelector('i');
            if (icon) {
                icon.className = this.isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
            }
        }
    }

    navigateToPrevGame() {
        const prevGame = getPrevItem('games', this.currentGame.id);
        if (prevGame) {
            window.location.href = `game-detail.html?id=${prevGame.id}`;
        }
    }

    navigateToNextGame() {
        const nextGame = getNextItem('games', this.currentGame.id);
        if (nextGame) {
            window.location.href = `game-detail.html?id=${nextGame.id}`;
        }
    }

    shareGame() {
        const url = window.location.href;
        const title = this.currentGame.name;
        const text = this.currentGame.overview;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url
            }).then(() => {
                this.showNotification('Game shared successfully!', 'success');
            }).catch(err => {
                console.error('Error sharing:', err);
                this.copyToClipboard(url);
            });
        } else {
            this.copyToClipboard(url);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Game link copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showNotification('Failed to copy link', 'error');
        });
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showNotification(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Add CSS for game detail page
const gameDetailStyles = `
<style>
.game-detail-section {
    padding: 120px 0 60px;
}

.game-preview-container {
    position: relative;
    margin-bottom: 60px;
}

.game-preview {
    position: relative;
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
}

.preview-image {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.preview-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.preview-image:hover .preview-overlay {
    opacity: 1;
}

.preview-image:hover .preview-img {
    transform: scale(1.05);
}

.btn-play-large {
    background: var(--gradient-primary);
    border: none;
    border-radius: var(--radius-lg);
    padding: 20px 40px;
    color: var(--primary);
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all var(--transition-smooth);
    box-shadow: var(--shadow-glow);
}

.btn-play-large:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-glow), var(--shadow-lg);
}

.game-controls {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: none;
    gap: 12px;
    align-items: center;
    z-index: 10;
}

.control-group {
    display: flex;
    gap: 8px;
}

.btn-control {
    width: 50px;
    height: 50px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-smooth);
    backdrop-filter: var(--glass-blur);
}

.btn-control:hover {
    background: var(--accent);
    color: var(--primary);
    transform: scale(1.1);
}

.control-info {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    padding: 8px 16px;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: 0.9rem;
    backdrop-filter: var(--glass-blur);
}

.game-container {
    position: relative;
    width: 100%;
    height: 600px;
    display: none;
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
}

#gameFrame {
    width: 100%;
    height: 100%;
    border: none;
    background: var(--secondary);
}

.detail-navigation {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    pointer-events: none;
}

.nav-arrow {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 16px 20px;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all var(--transition-smooth);
    backdrop-filter: var(--glass-blur);
    pointer-events: all;
    opacity: 0.7;
}

.nav-arrow:hover {
    opacity: 1;
    background: var(--accent);
    color: var(--primary);
    transform: translateX(var(--arrow-direction, 0));
}

.prev-arrow { --arrow-direction: -5px; }
.next-arrow { --arrow-direction: 5px; }

.arrow-text {
    font-weight: 500;
}

.game-info-container {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    padding: 40px;
    backdrop-filter: var(--glass-blur);
    box-shadow: var(--shadow-lg);
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    gap: 30px;
}

.game-title-section {
    flex: 1;
}

.game-title {
    font-size: 3rem;
    margin-bottom: 12px;
    background: var(--gradient-hero);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.game-meta {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
}

.game-category {
    background: var(--gradient-primary);
    color: var(--primary);
    padding: 6px 16px;
    border-radius: var(--radius-lg);
    font-weight: 600;
    font-size: 0.9rem;
}

.game-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-tertiary);
    font-weight: 600;
}

.game-status {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    padding: 6px 16px;
    border-radius: var(--radius-lg);
    font-weight: 500;
    font-size: 0.9rem;
}

.game-actions {
    display: flex;
    gap: 12px;
}

.game-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.game-description-section h2,
.features-section h2,
.technologies-section h2,
.game-stats-section h2 {
    font-size: 1.75rem;
    margin-bottom: 20px;
    color: var(--text-primary);
}

.game-overview {
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 20px;
    line-height: 1.6;
    font-weight: 500;
}

.game-description {
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.7;
}

.game-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 30px 0;
}

.detail-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all var(--transition-smooth);
    backdrop-filter: var(--glass-blur);
}

.detail-card:hover {
    border-color: var(--accent);
    transform: translateY(-5px);
}

.detail-icon {
    width: 50px;
    height: 50px;
    background: var(--gradient-primary);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-size: 1.2rem;
}

.detail-content h3 {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin-bottom: 4px;
    font-weight: 500;
}

.detail-content p {
    font-size: 1.1rem;
    color: var(--text-primary);
    font-weight: 600;
}

.features-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 12px;
    list-style: none;
}

.features-list li {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    padding: 16px 20px;
    border-radius: var(--radius-md);
    color: var(--text-primary);
    position: relative;
    padding-left: 40px;
    transition: all var(--transition-smooth);
}

.features-list li:hover {
    border-color: var(--accent);
    transform: translateX(8px);
}

.features-list li::before {
    content: '✓';
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--accent);
    font-weight: bold;
}

.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.tech-tag {
    background: var(--gradient-primary);
    color: var(--primary);
    padding: 8px 16px;
    border-radius: var(--radius-lg);
    font-weight: 500;
    font-size: 0.9rem;
    transition: all var(--transition-smooth);
}

.tech-tag:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    margin-top: 20px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 30px;
    transition: all var(--transition-smooth);
}

.stat-item:hover {
    border-color: var(--accent);
    transform: translateY(-5px);
}

.stat-circle {
    width: 80px;
    height: 80px;
    background: var(--gradient-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-size: 1.5rem;
    font-weight: 700;
    box-shadow: var(--shadow-md);
}

.stat-info h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: var(--text-primary);
}

.stat-info p {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
    .game-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .game-actions {
        justify-content: center;
    }
    
    .detail-navigation {
        position: relative;
        top: auto;
        transform: none;
        margin-top: 20px;
    }
    
    .nav-arrow .arrow-text {
        display: none;
    }
    
    .game-details-grid {
        grid-template-columns: 1fr;
    }
    
    .features-list {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', gameDetailStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GameDetailPage();
});