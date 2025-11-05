// ============================================
// WEBSITE DETAIL PAGE SCRIPT
// ============================================

class WebsiteDetailPage {
    constructor() {
        this.currentWebsite = null;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.loadWebsite();
        this.setupNavigation();
        this.setupTheme();
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

    loadWebsite() {
        const urlParams = new URLSearchParams(window.location.search);
        const websiteId = urlParams.get('id');

        if (!websiteId) {
            window.location.href = 'websites.html';
            return;
        }

        this.currentWebsite = getItemById(window.PORTFOLIO_DATA.websites, parseInt(websiteId));

        if (!this.currentWebsite) {
            window.location.href = 'websites.html';
            return;
        }

        this.displayWebsiteInfo();
    }

    displayWebsiteInfo() {
        const website = this.currentWebsite;

        // Update page elements
        document.title = `${website.name} - Arsh Verma`;
        
        document.getElementById('websiteTitle').textContent = website.name;
        document.getElementById('websiteCategory').textContent = website.category;
        document.getElementById('websiteRating').textContent = `${website.rating}/5`;
        document.getElementById('launchDate').textContent = formatDate(website.launchDate);
        document.getElementById('developmentTime').textContent = website.developmentTime;
        document.getElementById('websiteOverview').textContent = website.overview;
        document.getElementById('websiteDescription').textContent = website.description;
        
        // Website image
        document.getElementById('websiteImage').src = website.image;
        document.getElementById('websiteImage').alt = website.name;

        // Features list
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = website.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');

        // Technologies
        const techList = document.getElementById('techList');
        techList.innerHTML = website.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        // Action buttons
        const visitBtn = document.getElementById('visitWebsite');
        const githubBtn = document.getElementById('viewGithub');

        if (website.url) {
            visitBtn.href = website.url;
        } else {
            visitBtn.style.display = 'none';
        }

        if (website.githubUrl) {
            githubBtn.href = website.githubUrl;
        } else {
            githubBtn.style.display = 'none';
        }
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prevWebsite');
        const nextBtn = document.getElementById('nextWebsite');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prevWebsite = getPrevItem(window.PORTFOLIO_DATA.websites, this.currentWebsite.id);
                window.location.href = `website-detail.html?id=${prevWebsite.id}`;
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextWebsite = getNextItem(window.PORTFOLIO_DATA.websites, this.currentWebsite.id);
                window.location.href = `website-detail.html?id=${nextWebsite.id}`;
            });
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareWebsite());
        }
    }

    shareWebsite() {
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: this.currentWebsite.name,
                text: this.currentWebsite.overview,
                url: url
            }).catch(err => console.error('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Project link copied to clipboard!');
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
    new WebsiteDetailPage();
});