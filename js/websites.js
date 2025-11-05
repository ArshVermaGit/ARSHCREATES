// ============================================
// WEBSITES PAGE SCRIPT
// ============================================

class WebsitesPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.loadWebsites();
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

    loadWebsites() {
        const container = document.getElementById('websitesGrid');
        if (!container || !window.PORTFOLIO_DATA) return;

        const websites = window.PORTFOLIO_DATA.websites;
        container.innerHTML = websites.map(site => `
            <div class="portfolio-card" onclick="window.location.href='website-detail.html?id=${site.id}'">
                <img src="${site.image}" alt="${site.name}" class="portfolio-image">
                <div class="portfolio-info">
                    <h3 class="portfolio-title">${site.name}</h3>
                    <p class="portfolio-category">${site.category}</p>
                    <p class="portfolio-description">${site.overview}</p>
                    <div class="portfolio-tags">
                        ${site.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                    <div class="portfolio-meta">
                        <span class="rating">
                            <i class="fas fa-star"></i> ${site.rating}
                        </span>
                        <span class="status ${site.status.toLowerCase()}">
                            ${site.status}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsitesPage();
});