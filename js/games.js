// ============================================
// GAMES PAGE SCRIPT
// ============================================

class GamesPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.loadGames();
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

    loadGames() {
        const container = document.getElementById('gamesGrid');
        if (!container || !window.PORTFOLIO_DATA) return;

        const games = window.PORTFOLIO_DATA.games;
        container.innerHTML = games.map(game => `
            <div class="portfolio-card" onclick="window.location.href='game-detail.html?id=${game.id}'">
                <img src="${game.image}" alt="${game.name}" class="portfolio-image">
                <div class="portfolio-info">
                    <h3 class="portfolio-title">${game.name}</h3>
                    <p class="portfolio-category">${game.category}</p>
                    <p class="portfolio-description">${game.overview}</p>
                    <div class="portfolio-tags">
                        ${game.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                    <div class="portfolio-meta">
                        <span class="rating">
                            <i class="fas fa-star"></i> ${game.rating}
                        </span>
                        <span class="status ${game.status.toLowerCase()}">
                            ${game.status}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GamesPage();
});