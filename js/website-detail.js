// ============================================
// WEBSITE DETAIL PAGE SCRIPT
// ============================================

class WebsiteDetailPage {
    constructor() {
        this.currentWebsite = null;
        this.isPreviewing = false;
        this.isFullscreen = false;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.loadWebsite();
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

    loadWebsite() {
        const urlParams = new URLSearchParams(window.location.search);
        const websiteId = urlParams.get('id');

        if (!websiteId) {
            this.redirectToWebsites();
            return;
        }

        this.currentWebsite = getItemById('websites', parseInt(websiteId));

        if (!this.currentWebsite) {
            this.redirectToWebsites();
            return;
        }

        this.displayWebsiteInfo();
    }

    redirectToWebsites() {
        window.location.href = 'websites.html';
    }

    displayWebsiteInfo() {
        const website = this.currentWebsite;

        // Update page title and meta
        document.title = `${website.name} - Arsh Verma`;
        
        // Update main website info
        document.getElementById('websiteTitle').textContent = website.name;
        document.getElementById('websiteCategory').textContent = website.category;
        document.getElementById('websiteRating').textContent = website.rating;
        document.getElementById('websiteStatus').textContent = website.status;
        document.getElementById('websiteOverview').textContent = website.overview;
        document.getElementById('websiteDescription').textContent = website.description;
        
        // Update preview image
        document.getElementById('previewImage').src = website.image;
        document.getElementById('previewImage').alt = website.name;

        // Update details
        document.getElementById('launchDate').textContent = formatDate(website.launchDate);
        document.getElementById('developmentTime').textContent = website.developmentTime;
        document.getElementById('userBase').textContent = this.formatNumber(website.playCount) + ' users';

        // Update buttons
        const repoBtn = document.getElementById('repositoryBtn');
        const liveUrlBtn = document.getElementById('liveUrlBtn');
        
        if (website.repositoryUrl) {
            repoBtn.href = website.repositoryUrl;
        } else {
            repoBtn.style.display = 'none';
        }

        if (website.url) {
            liveUrlBtn.href = website.url;
        } else {
            liveUrlBtn.style.display = 'none';
        }

        // Update features list
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = website.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');

        // Update technologies
        const techList = document.getElementById('techList');
        techList.innerHTML = website.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        // Update stats circles
        document.getElementById('ratingCircle').textContent = website.rating;
        document.getElementById('userCountCircle').textContent = this.formatNumber(website.playCount);

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
        // Visit button
        const visitBtn = document.getElementById('visitBtn');
        if (visitBtn) {
            visitBtn.addEventListener('click', () => this.startPreview());
        }

        // Control buttons
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const closePreviewBtn = document.getElementById('closePreviewBtn');

        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        if (closePreviewBtn) closePreviewBtn.addEventListener('click', () => this.closePreview());

        // Navigation arrows
        const prevBtn = document.getElementById('prevWebsite');
        const nextBtn = document.getElementById('nextWebsite');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateToPrevWebsite());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateToNextWebsite());
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareWebsite());
        }

        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isPreviewing) {
                switch (e.key) {
                    case 'Escape':
                        e.preventDefault();
                        if (this.isFullscreen) {
                            this.toggleFullscreen();
                        } else {
                            this.closePreview();
                        }
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateToPrevWebsite();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateToNextWebsite();
                        break;
                }
            } else {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateToPrevWebsite();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateToNextWebsite();
                        break;
                }
            }
        });
    }

    startPreview() {
        const website = this.currentWebsite;
        const websiteFrame = document.getElementById('websiteFrame');
        const previewImage = document.querySelector('.preview-image');
        const websiteContainer = document.getElementById('websiteContainer');

        if (!website.url) {
            this.showNotification('Live website URL not available', 'error');
            return;
        }

        // Show loading state
        websiteFrame.src = website.url;
        previewImage.style.display = 'none';
        websiteContainer.style.display = 'block';
        
        this.isPreviewing = true;
        document.body.classList.add('preview-active');

        // Show notification
        this.showNotification('Website preview started. Use ESC to exit, arrow keys to navigate.', 'success');
    }

    closePreview() {
        const websiteFrame = document.getElementById('websiteFrame');
        const previewImage = document.querySelector('.preview-image');
        const websiteContainer = document.getElementById('websiteContainer');

        websiteFrame.src = '';
        previewImage.style.display = 'block';
        websiteContainer.style.display = 'none';
        
        this.isPreviewing = false;
        document.body.classList.remove('preview-active');

        // Exit fullscreen if active
        if (this.isFullscreen) {
            this.toggleFullscreen();
        }
    }

    toggleFullscreen() {
        const websiteContainer = document.getElementById('websiteContainer');
        
        if (!this.isFullscreen) {
            if (websiteContainer.requestFullscreen) {
                websiteContainer.requestFullscreen();
            } else if (websiteContainer.webkitRequestFullscreen) {
                websiteContainer.webkitRequestFullscreen();
            } else if (websiteContainer.msRequestFullscreen) {
                websiteContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            const icon = fullscreenBtn.querySelector('i');
            icon.className = this.isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
        }
    }

    navigateToPrevWebsite() {
        const websites = window.PORTFOLIO_DATA.websites;
        const currentIndex = websites.findIndex(w => w.id === this.currentWebsite.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : websites.length - 1;
        const prevWebsite = websites[prevIndex];
        
        this.navigateToWebsite(prevWebsite);
    }

    navigateToNextWebsite() {
        const websites = window.PORTFOLIO_DATA.websites;
        const currentIndex = websites.findIndex(w => w.id === this.currentWebsite.id);
        const nextIndex = currentIndex < websites.length - 1 ? currentIndex + 1 : 0;
        const nextWebsite = websites[nextIndex];
        
        this.navigateToWebsite(nextWebsite);
    }

    navigateToWebsite(website) {
        // Close preview if active
        if (this.isPreviewing) {
            this.closePreview();
        }

        // Navigate to new website
        window.location.href = `website-detail.html?id=${website.id}`;
    }

    shareWebsite() {
        const website = this.currentWebsite;
        const shareUrl = window.location.href;
        const shareText = `Check out ${website.name} - ${website.overview}`;

        if (navigator.share) {
            navigator.share({
                title: website.name,
                text: shareText,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showNotification('Website link copied to clipboard!', 'success');
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
    new WebsiteDetailPage();
});