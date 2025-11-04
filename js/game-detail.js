// ============================================
// GAME DETAIL PAGE SCRIPT
// ============================================

class GameDetailPage {
    constructor() {
        this.currentGame = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.loadGame();
        this.setupControls();
        this.setupNavigation();
        this.setupTheme();
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.getElementById('loadingText');
        
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

    loadGame() {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('id');

        if (!gameId) {
            window.location.href = 'index.html#games';
            return;
        }

        this.currentGame = getItemById(window.GAME_DATA, parseInt(gameId));

        if (!this.currentGame) {
            window.location.href = 'index.html#games';
            return;
        }

        this.displayGameInfo();
    }

    displayGameInfo() {
        const game = this.currentGame;

        // Update page elements
        document.title = `${game.name} - Arsh Verma`;
        
        document.getElementById('gameTitle').textContent = game.name;
        document.getElementById('gameCategory').textContent = game.category;
        document.getElementById('gameRating').textContent = `${game.rating}/5`;
        document.getElementById('playCount').textContent = `${game.playCount.toLocaleString()} plays`;
        document.getElementById('releaseDate').textContent = new Date(game.releaseDate).toLocaleDateString();
        document.getElementById('gameOverview').textContent = game.overview;
        document.getElementById('gameDescription').textContent = game.description;
        
        // Preview image
        document.getElementById('previewImage').src = game.image;
        document.getElementById('previewImage').alt = game.name;

        // Features list
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = game.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');

        // Technologies
        const techList = document.getElementById('techList');
        techList.innerHTML = game.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        // Development stats
        document.getElementById('developmentTime').textContent = game.developmentTime;
        document.getElementById('teamSize').textContent = game.teamSize;
        document.getElementById('likes').textContent = game.likes.toLocaleString();
    }

    setupControls() {
        const playBtn = document.getElementById('playBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const restartBtn = document.getElementById('restartBtn');
        const closeGameBtn = document.getElementById('closeGameBtn');

        if (playBtn) playBtn.addEventListener('click', () => this.startGame());
        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartGame());
        if (closeGameBtn) closeGameBtn.addEventListener('click', () => this.closeGame());
    }

    startGame() {
        const preview = document.getElementById('gamePreview');
        const container = document.getElementById('gameContainer');
        const frame = document.getElementById('gameFrame');
        const playBtn = document.getElementById('playBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const restartBtn = document.getElementById('restartBtn');
        const closeGameBtn = document.getElementById('closeGameBtn');

        // Hide preview, show game
        if (preview) preview.style.display = 'none';
        if (container) container.style.display = 'block';
        if (playBtn) playBtn.style.display = 'none';
        if (fullscreenBtn) fullscreenBtn.style.display = 'inline-flex';
        if (restartBtn) restartBtn.style.display = 'inline-flex';
        if (closeGameBtn) closeGameBtn.style.display = 'inline-flex';

        // Load game
        if (frame) {
            frame.src = this.currentGame.gameFile;
            this.isPlaying = true;
        }
    }

    closeGame() {
        const preview = document.getElementById('gamePreview');
        const container = document.getElementById('gameContainer');
        const frame = document.getElementById('gameFrame');
        const playBtn = document.getElementById('playBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const restartBtn = document.getElementById('restartBtn');
        const closeGameBtn = document.getElementById('closeGameBtn');

        // Show preview, hide game
        if (preview) preview.style.display = 'block';
        if (container) container.style.display = 'none';
        if (playBtn) playBtn.style.display = 'inline-flex';
        if (fullscreenBtn) fullscreenBtn.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'none';
        if (closeGameBtn) closeGameBtn.style.display = 'none';

        // Stop game
        if (frame) {
            frame.src = '';
            this.isPlaying = false;
        }
    }

    restartGame() {
        const frame = document.getElementById('gameFrame');
        if (frame) {
            const currentSrc = frame.src;
            frame.src = '';
            setTimeout(() => {
                frame.src = currentSrc;
            }, 100);
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('gameContainer');
        
        if (!document.fullscreenElement) {
            if (container) {
                container.requestFullscreen().catch(err => {
                    console.error('Error entering fullscreen:', err);
                });
            }
        } else {
            document.exitFullscreen();
        }
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prevGame');
        const nextBtn = document.getElementById('nextGame');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevGame = getPrevItem(window.GAME_DATA, this.currentGame.id);
                window.location.href = `game.html?id=${prevGame.id}`;
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextGame = getNextItem(window.GAME_DATA, this.currentGame.id);
                window.location.href = `game.html?id=${nextGame.id}`;
            });
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareGame());
        }
    }

    shareGame() {
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: this.currentGame.name,
                text: this.currentGame.overview,
                url: url
            }).catch(err => console.error('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Game link copied to clipboard!');
            });
        }
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

    showNotification(message) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GameDetailPage();
});