// ============================================
// GAME DETAIL FUNCTIONALITY
// ============================================

class GameDetail {
    constructor() {
        this.currentGame = null;
        this.init();
    }

    init() {
        this.loadGameData();
        this.setupEventListeners();
        this.setupLightbox();
        this.updateNavigation();
    }

    loadGameData() {
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('id') || 1;
        
        this.currentGame = window.getItemById('games', gameId);
        
        if (this.currentGame) {
            this.updateGameDetail();
        } else {
            this.showErrorState();
        }
    }

    updateGameDetail() {
        // Update page title
        document.title = `${this.currentGame.name} - Game Details | Arsh Verma`;

        // Update hero section
        this.updateHeroSection();
        
        // Update game description
        this.updateDescription();
        
        // Update features
        this.updateFeatures();
        
        // Update technology stack
        this.updateTechnologyStack();
        
        // Update game stats
        this.updateGameStats();
        
        // Update related games
        this.updateRelatedGames();
    }

    updateHeroSection() {
        const game = this.currentGame;
        
        // Update cover image
        const coverImage = document.querySelector('.game-cover img');
        if (coverImage) {
            coverImage.src = game.image;
            coverImage.alt = game.name;
        }

        // Update game info
        document.querySelector('.game-title').textContent = game.name;
        document.querySelector('.game-tagline').textContent = game.overview;
        document.querySelector('.game-category').textContent = game.category;

        // Update rating
        const ratingElement = document.querySelector('.game-rating-large');
        if (ratingElement) {
            const stars = ratingElement.querySelector('.stars');
            stars.innerHTML = this.generateStars(game.rating);
            ratingElement.querySelector('.rating-text').textContent = `${game.rating} (${this.formatNumber(game.playCount)} reviews)`;
        }

        // Update stats
        const stats = document.querySelectorAll('.game-stats-overview .stat');
        if (stats.length >= 4) {
            stats[0].querySelector('.stat-value').textContent = this.formatNumber(game.playCount);
            stats[1].querySelector('.stat-value').textContent = game.rating;
            stats[2].querySelector('.stat-value').textContent = this.formatNumber(game.downloads || game.playCount);
            stats[3].querySelector('.stat-value').textContent = '95%';
        }

        // Update platform tags
        const platformsContainer = document.querySelector('.platform-tags');
        if (platformsContainer) {
            platformsContainer.innerHTML = game.platforms.map(platform => 
                `<span class="platform-tag ${platform.toLowerCase()}">${platform}</span>`
            ).join('');
        }

        // Update action buttons
        const playButton = document.getElementById('playGameBtn');
        if (playButton && game.gameFile) {
            playButton.onclick = () => {
                window.open(game.gameFile, '_blank');
            };
        }

        const githubButton = document.querySelector('.btn-secondary');
        if (githubButton && game.repositoryUrl) {
            githubButton.href = game.repositoryUrl;
        }
    }

    updateDescription() {
        const descriptionElement = document.querySelector('.game-description');
        if (descriptionElement) {
            descriptionElement.textContent = this.currentGame.description;
        }
    }

    updateFeatures() {
        const featuresGrid = document.querySelector('.game-features-grid');
        if (featuresGrid && this.currentGame.features) {
            featuresGrid.innerHTML = this.currentGame.features.map((feature, index) => `
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-${this.getFeatureIcon(index)}"></i>
                    </div>
                    <h3>${feature}</h3>
                    <p>${this.getFeatureDescription(feature)}</p>
                </div>
            `).join('');
        }
    }

    updateTechnologyStack() {
        const techList = document.querySelector('.tech-list');
        if (techList && this.currentGame.technologies) {
            techList.innerHTML = this.currentGame.technologies.map(tech => 
                `<li>${tech}</li>`
            ).join('');
        }
    }

    updateGameStats() {
        const statsContainer = document.querySelector('.gameplay-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${this.currentGame.developmentTime}</div>
                    <div class="stat-label">Development</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.currentGame.teamSize}</div>
                    <div class="stat-label">Team Size</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.currentGame.rating}/5</div>
                    <div class="stat-label">Player Rating</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.formatNumber(this.currentGame.playCount)}</div>
                    <div class="stat-label">Total Plays</div>
                </div>
            `;
        }
    }

    updateRelatedGames() {
        const relatedGrid = document.querySelector('.related-grid');
        if (relatedGrid) {
            const allGames = window.getItemsByCategory('games');
            const relatedGames = allGames
                .filter(game => game.id !== this.currentGame.id)
                .slice(0, 3);

            relatedGrid.innerHTML = relatedGames.map(game => `
                <div class="related-card">
                    <div class="related-image">
                        <img src="${game.image}" alt="${game.name}" loading="lazy">
                    </div>
                    <div class="related-content">
                        <h3>${game.name}</h3>
                        <p>${game.overview}</p>
                        <div class="related-meta">
                            <span class="rating">${game.rating}★</span>
                            <span class="category">${game.category}</span>
                        </div>
                        <a href="game-detail.html?id=${game.id}" class="btn btn-outline">View Details</a>
                    </div>
                </div>
            `).join('');
        }
    }

    setupEventListeners() {
        // Trailer functionality
        const playButton = document.getElementById('playTrailerBtn');
        const trailerOverlay = document.getElementById('trailerOverlay');
        const gameTrailer = document.getElementById('gameTrailer');

        if (playButton && trailerOverlay && gameTrailer) {
            playButton.addEventListener('click', () => {
                trailerOverlay.classList.add('hidden');
                gameTrailer.play().catch(e => {
                    console.log('Autoplay prevented:', e);
                });
            });

            gameTrailer.addEventListener('click', () => {
                if (gameTrailer.paused) {
                    gameTrailer.play();
                } else {
                    gameTrailer.pause();
                }
            });
        }

        // Share functionality
        const shareButtons = document.querySelectorAll('.btn-share');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.shareGame(e.target.dataset.platform);
            });
        });
    }

    setupLightbox() {
        const lightbox = document.getElementById('screenshotLightbox');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        let currentScreenshotIndex = 0;

        // Open lightbox when clicking on screenshots
        document.querySelectorAll('.screenshot-item').forEach((screenshot, index) => {
            screenshot.addEventListener('click', () => {
                currentScreenshotIndex = index;
                this.openLightbox(screenshot.querySelector('img').src);
            });
        });

        const openLightbox = (src) => {
            lightboxImage.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        const navigateScreenshot = (direction) => {
            const screenshots = document.querySelectorAll('.screenshot-item');
            currentScreenshotIndex = (currentScreenshotIndex + direction + screenshots.length) % screenshots.length;
            const newSrc = screenshots[currentScreenshotIndex].querySelector('img').src;
            lightboxImage.src = newSrc;
        };

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => navigateScreenshot(-1));
        nextBtn.addEventListener('click', () => navigateScreenshot(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    updateNavigation() {
        const prevItem = window.getPrevItem('games', this.currentGame.id);
        const nextItem = window.getNextItem('games', this.currentGame.id);

        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');

        if (prevArrow && prevItem) {
            prevArrow.href = `game-detail.html?id=${prevItem.id}`;
            prevArrow.querySelector('.arrow-title').textContent = prevItem.name;
        }

        if (nextArrow && nextItem) {
            nextArrow.href = `game-detail.html?id=${nextItem.id}`;
            nextArrow.querySelector('.arrow-title').textContent = nextItem.name;
        }
    }

    shareGame(platform) {
        const gameTitle = this.currentGame.name;
        const gameUrl = window.location.href;
        let shareUrl = '';

        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(gameTitle)}&url=${encodeURIComponent(gameUrl)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(gameUrl)}`;
                break;
            case 'link':
                navigator.clipboard.writeText(gameUrl).then(() => {
                    this.showNotification('Game link copied to clipboard!', 'success');
                });
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    showErrorState() {
        document.querySelector('.game-detail-section').innerHTML = `
            <div class="error-state">
                <i class="fas fa-gamepad"></i>
                <h2>Game Not Found</h2>
                <p>The game you're looking for doesn't exist or has been moved.</p>
                <a href="games.html" class="btn btn-primary">Back to Games</a>
            </div>
        `;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.getElementById('notificationContainer').appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Helper methods
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return '★'.repeat(fullStars) + 
               (halfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    getFeatureIcon(index) {
        const icons = ['running', 'city', 'robot', 'puzzle-piece', 'bolt', 'history'];
        return icons[index] || 'star';
    }

    getFeatureDescription(feature) {
        const descriptions = {
            'Advanced parkour movement system': 'Fluid movement mechanics with wall running, sliding, and precision jumping.',
            'Dynamic weather and day-night cycle': 'Immersive environmental systems that affect gameplay and visuals.',
            'Procedurally generated city elements': 'Endless replayability with dynamically generated urban landscapes.',
            'Multiple character customization options': 'Extensive customization for personalizing your character.',
            'Online leaderboards and achievements': 'Compete with players worldwide and unlock achievements.'
        };
        return descriptions[feature] || 'Enhanced gameplay feature that improves user experience.';
    }

    openLightbox(src) {
        // Implementation handled in setupLightbox
    }
}

// Initialize game detail when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameDetail = new GameDetail();
});