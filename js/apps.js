// ============================================
// APPS PAGE SCRIPT
// ============================================

class AppsPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.loadApps();
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

    loadApps() {
        const container = document.getElementById('appsGrid');
        if (!container || !window.PORTFOLIO_DATA) return;

        const apps = window.PORTFOLIO_DATA.apps;
        container.innerHTML = apps.map(app => `
            <div class="portfolio-card" onclick="window.location.href='app-detail.html?id=${app.id}'">
                <img src="${app.image}" alt="${app.name}" class="portfolio-image">
                <div class="portfolio-info">
                    <h3 class="portfolio-title">${app.name}</h3>
                    <p class="portfolio-category">${app.category} • ${app.platform}</p>
                    <p class="portfolio-description">${app.overview}</p>
                    <div class="portfolio-tags">
                        ${app.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                    <div class="portfolio-meta">
                        <span class="downloads">
                            <i class="fas fa-download"></i> ${app.downloads}
                        </span>
                        <span class="rating">
                            <i class="fas fa-star"></i> ${app.rating}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AppsPage();
});