// ============================================
// APP DETAIL PAGE SCRIPT
// ============================================

class AppDetailPage {
    constructor() {
        this.currentApp = null;
        this.isPreviewing = false;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.loadApp();
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

    loadApp() {
        const urlParams = new URLSearchParams(window.location.search);
        const appId = urlParams.get('id');

        if (!appId) {
            this.redirectToApps();
            return;
        }

        this.currentApp = getItemById('apps', parseInt(appId));

        if (!this.currentApp) {
            this.redirectToApps();
            return;
        }

        this.displayAppInfo();
    }

    redirectToApps() {
        window.location.href = 'apps.html';
    }

    displayAppInfo() {
        const app = this.currentApp;

        // Update page title and meta
        document.title = `${app.name} - Arsh Verma`;
        
        // Update main app info
        document.getElementById('appTitle').textContent = app.name;
        document.getElementById('appCategory').textContent = app.category;
        document.getElementById('appRating').textContent = app.rating;
        document.getElementById('appStatus').textContent = app.status;
        document.getElementById('appOverview').textContent = app.overview;
        document.getElementById('appDescription').textContent = app.description;
        
        // Update preview image
        document.getElementById('previewImage').src = app.image;
        document.getElementById('previewImage').alt = app.name;

        // Update details
        document.getElementById('launchDate').textContent = formatDate(app.launchDate);
        document.getElementById('developmentTime').textContent = app.developmentTime;
        document.getElementById('downloadCount').textContent = this.formatNumber(app.playCount);
        document.getElementById('appPlatform').textContent = app.platform;

        // Update buttons
        const repoBtn = document.getElementById('repositoryBtn');
        const appStoreBtn = document.getElementById('appStoreBtn');
        const playStoreBtn = document.getElementById('playStoreBtn');
        
        if (app.repositoryUrl) {
            repoBtn.href = app.repositoryUrl;
        } else {
            repoBtn.style.display = 'none';
        }

        if (app.appStoreUrl) {
            appStoreBtn.href = app.appStoreUrl;
        } else {
            appStoreBtn.style.display = 'none';
        }

        if (app.playStoreUrl) {
            playStoreBtn.href = app.playStoreUrl;
        } else {
            playStoreBtn.style.display = 'none';
        }

        // Update features list
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = app.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');

        // Update technologies
        const techList = document.getElementById('techList');
        techList.innerHTML = app.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        // Update stats circles
        document.getElementById('ratingCircle').textContent = app.rating;
        document.getElementById('downloadCountCircle').textContent = this.formatNumber(app.playCount);

        // Load screenshots
        this.loadScreenshots();

        // Animate stat circles
        this.animateStatCircles();
    }

    loadScreenshots() {
        const app = this.currentApp;
        const screenshotsContainer = document.getElementById('appScreenshots');

        if (!app.screenshots || app.screenshots.length === 0) {
            screenshotsContainer.style.display = 'none';
            return;
        }

        screenshotsContainer.innerHTML = app.screenshots.map(screenshot => 
            `<div class="screenshot-item">
                <img src="${screenshot}" alt="${app.name} screenshot" class="screenshot-img">
            </div>`
        ).join('');

        // Initialize screenshot carousel
        this.initScreenshotCarousel();
    }

    initScreenshotCarousel() {
        const screenshotsContainer = document.getElementById('appScreenshots');
        const screenshots = screenshotsContainer.querySelectorAll('.screenshot-item');
        let currentIndex = 0;

        // Add navigation controls
        const navControls = document.createElement('div');
        navControls.className = 'screenshot-nav';
        navControls.innerHTML = `
            <button class="nav-btn prev-btn">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="nav-btn next-btn">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        screenshotsContainer.appendChild(navControls);

        // Navigation functions
        const showScreenshot = (index) => {
            screenshots.forEach((screenshot, i) => {
                screenshot.style.transform = `translateX(${(i - index) * 100}%)`;
                screenshot.style.opacity = i === index ? '1' : '0.5';
            });
        };

        // Event listeners for navigation
        navControls.querySelector('.prev-btn').addEventListener('click', () => {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : screenshots.length - 1;
            showScreenshot(currentIndex);
        });

        navControls.querySelector('.next-btn').addEventListener('click', () => {
            currentIndex = currentIndex < screenshots.length - 1 ? currentIndex + 1 : 0;
            showScreenshot(currentIndex);
        });

        // Initialize first screenshot
        showScreenshot(currentIndex);
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
        // Control buttons
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        if (closePreviewBtn) closePreviewBtn.addEventListener('click', () => this.closePreview());

        // Navigation arrows
        const prevBtn = document.getElementById('prevApp');
        const nextBtn = document.getElementById('nextApp');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateToPrevApp());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateToNextApp());
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareApp());
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isPreviewing) {
                switch (e.key) {
                    case 'Escape':
                        e.preventDefault();
                        this.closePreview();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateToPrevApp();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateToNextApp();
                        break;
                }
            } else {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateToPrevApp();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateToNextApp();
                        break;
                }
            }
        });
    }

    closePreview() {
        this.isPreviewing = false;
        document.body.classList.remove('preview-active');
    }

    navigateToPrevApp() {
        const apps = window.PORTFOLIO_DATA.apps;
        const currentIndex = apps.findIndex(a => a.id === this.currentApp.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : apps.length - 1;
        const prevApp = apps[prevIndex];
        
        this.navigateToApp(prevApp);
    }

    navigateToNextApp() {
        const apps = window.PORTFOLIO_DATA.apps;
        const currentIndex = apps.findIndex(a => a.id === this.currentApp.id);
        const nextIndex = currentIndex < apps.length - 1 ? currentIndex + 1 : 0;
        const nextApp = apps[nextIndex];
        
        this.navigateToApp(nextApp);
    }

    navigateToApp(app) {
        // Close preview if active
        if (this.isPreviewing) {
            this.closePreview();
        }

        // Navigate to new app
        window.location.href = `app-detail.html?id=${app.id}`;
    }

    shareApp() {
        const app = this.currentApp;
        const shareUrl = window.location.href;
        const shareText = `Check out ${app.name} - ${app.overview}`;

        if (navigator.share) {
            navigator.share({
                title: app.name,
                text: shareText,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showNotification('App link copied to clipboard!', 'success');
            });
        }
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
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AppDetailPage();
});