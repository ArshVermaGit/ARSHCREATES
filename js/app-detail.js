// ============================================
// APP DETAIL FUNCTIONALITY
// ============================================

class AppDetail {
    constructor() {
        this.currentApp = null;
        this.init();
    }

    init() {
        this.loadAppData();
        this.setupEventListeners();
        this.setupLightbox();
        this.updateNavigation();
    }

    loadAppData() {
        const urlParams = new URLSearchParams(window.location.search);
        const appId = urlParams.get('id') || 1;
        
        this.currentApp = window.getItemById('apps', appId);
        
        if (this.currentApp) {
            this.updateAppDetail();
        } else {
            this.showErrorState();
        }
    }

    updateAppDetail() {
        // Update page title
        document.title = `${this.currentApp.name} - App Details | Arsh Verma`;

        // Update hero section
        this.updateHeroSection();
        
        // Update description
        this.updateDescription();
        
        // Update features
        this.updateFeatures();
        
        // Update technology stack
        this.updateTechnologyStack();
        
        // Update related apps
        this.updateRelatedApps();
        
        // Update download buttons
        this.updateDownloadButtons();
    }

    updateHeroSection() {
        const app = this.currentApp;
        
        // Update app icon
        const appIcon = document.querySelector('.app-icon-large');
        if (appIcon) {
            appIcon.innerHTML = `<i class="fas fa-${this.getAppIcon(app.category)}"></i>`;
        }

        // Update app info
        document.querySelector('.app-title').textContent = app.name;
        document.querySelector('.app-tagline').textContent = app.overview;
        document.querySelector('.app-category').textContent = app.category;

        // Update rating
        const ratingElement = document.querySelector('.app-rating-large');
        if (ratingElement) {
            const stars = ratingElement.querySelector('.stars');
            stars.innerHTML = this.generateStars(app.rating);
            ratingElement.querySelector('.rating-text').textContent = `${app.rating} (${this.formatNumber(app.downloads)} reviews)`;
        }

        // Update stats
        const stats = document.querySelectorAll('.app-stats-overview .stat');
        if (stats.length >= 4) {
            stats[0].querySelector('.stat-value').textContent = this.formatNumber(app.downloads);
            stats[1].querySelector('.stat-value').textContent = app.rating;
            stats[2].querySelector('.stat-value').textContent = this.formatNumber(app.activeUsers);
            stats[3].querySelector('.stat-value').textContent = '98%';
        }
    }

    updateDescription() {
        const descriptionElement = document.querySelector('.app-description');
        if (descriptionElement) {
            descriptionElement.textContent = this.currentApp.description;
        }
    }

    updateFeatures() {
        const featuresGrid = document.querySelector('.app-feature-grid');
        if (featuresGrid && this.currentApp.features) {
            featuresGrid.innerHTML = this.currentApp.features.map((feature, index) => `
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
        const techStack = document.querySelector('.tech-stack');
        if (techStack && this.currentApp.technologies) {
            techStack.innerHTML = this.currentApp.technologies.map(tech => `
                <div class="tech-item">
                    <i class="fas fa-${this.getTechIcon(tech)}"></i>
                    <span>${tech}</span>
                </div>
            `).join('');
        }
    }

    updateRelatedApps() {
        const relatedGrid = document.querySelector('.related-grid');
        if (relatedGrid) {
            const allApps = window.getItemsByCategory('apps');
            const relatedApps = allApps
                .filter(app => app.id !== this.currentApp.id)
                .slice(0, 3);

            relatedGrid.innerHTML = relatedApps.map(app => `
                <div class="related-card">
                    <div class="related-image">
                        <img src="${app.image}" alt="${app.name}" loading="lazy">
                    </div>
                    <div class="related-content">
                        <h3>${app.name}</h3>
                        <p>${app.overview}</p>
                        <div class="related-meta">
                            <span class="rating">${app.rating}★</span>
                            <span class="category">${app.category}</span>
                        </div>
                        <a href="app-detail.html?id=${app.id}" class="btn btn-outline">View Details</a>
                    </div>
                </div>
            `).join('');
        }
    }

    updateDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.download-buttons a');
        const iosButton = downloadButtons[0];
        const androidButton = downloadButtons[1];

        if (iosButton && this.currentApp.appStoreUrl) {
            iosButton.href = this.currentApp.appStoreUrl;
        } else if (iosButton) {
            iosButton.style.display = 'none';
        }

        if (androidButton && this.currentApp.playStoreUrl) {
            androidButton.href = this.currentApp.playStoreUrl;
        } else if (androidButton) {
            androidButton.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Lightbox functionality
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

        // Share functionality
        const shareButtons = document.querySelectorAll('.btn-share');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.shareApp(e.target.closest('.btn-share').dataset.platform);
            });
        });
    }

    setupLightbox() {
        // Implementation handled in setupEventListeners
    }

    updateNavigation() {
        const prevItem = window.getPrevItem('apps', this.currentApp.id);
        const nextItem = window.getNextItem('apps', this.currentApp.id);

        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');

        if (prevArrow && prevItem) {
            prevArrow.href = `app-detail.html?id=${prevItem.id}`;
            prevArrow.querySelector('.arrow-title').textContent = prevItem.name;
        }

        if (nextArrow && nextItem) {
            nextArrow.href = `app-detail.html?id=${nextItem.id}`;
            nextArrow.querySelector('.arrow-title').textContent = nextItem.name;
        }
    }

    shareApp(platform) {
        const appTitle = this.currentApp.name;
        const appUrl = window.location.href;
        let shareUrl = '';

        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(appTitle)}&url=${encodeURIComponent(appUrl)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`;
                break;
            case 'link':
                navigator.clipboard.writeText(appUrl).then(() => {
                    this.showNotification('App link copied to clipboard!', 'success');
                });
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    showErrorState() {
        document.querySelector('.app-detail-section').innerHTML = `
            <div class="error-state">
                <i class="fas fa-mobile-alt"></i>
                <h2>App Not Found</h2>
                <p>The app you're looking for doesn't exist or has been moved.</p>
                <a href="apps.html" class="btn btn-primary">Back to Apps</a>
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
    getAppIcon(category) {
        const icons = {
            'Productivity': 'bullseye',
            'Health & Fitness': 'heartbeat',
            'Finance': 'chart-line',
            'Education': 'graduation-cap',
            'Entertainment': 'gamepad',
            'Social': 'users'
        };
        return icons[category] || 'mobile-alt';
    }

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
        const icons = ['brain', 'clock', 'chart-line', 'ban', 'sync', 'robot'];
        return icons[index] || 'star';
    }

    getFeatureDescription(feature) {
        const descriptions = {
            'AI Task Prioritization': 'Intelligent algorithms automatically sort and prioritize your tasks based on deadlines, importance, and your work patterns.',
            'Smart Focus Timer': 'Pomodoro-style focus sessions with adaptive timing based on your concentration levels and task complexity.',
            'Productivity Analytics': 'Detailed insights into your work patterns, focus duration, and productivity trends with actionable recommendations.',
            'Distraction Blocking': 'Automatically block distracting apps and websites during focus sessions to maintain deep concentration.',
            'Cross-Device Sync': 'Seamlessly sync your tasks, focus sessions, and settings across all your devices with cloud integration.',
            'Smart Suggestions': 'Get personalized productivity tips and schedule optimizations based on your historical data and goals.'
        };
        return descriptions[feature] || 'Enhanced feature that improves user experience and functionality.';
    }

    getTechIcon(tech) {
        const icons = {
            'Swift': 'code',
            'Kotlin': 'code',
            'React Native': 'mobile',
            'Flutter': 'mobile',
            'Firebase': 'cloud',
            'Core Data': 'database',
            'Room': 'database',
            'Node.js': 'server'
        };
        return icons[tech] || 'cog';
    }

    openLightbox(src) {
        // Implementation handled in setupEventListeners
    }
}

// Initialize app detail when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.appDetail = new AppDetail();
});