// ============================================
// WEBSITES PAGE SCRIPT
// ============================================

class WebsitesPage {
    constructor() {
        this.websites = [];
        this.filteredWebsites = [];
        this.currentFilters = {
            category: 'all',
            status: 'all',
            sort: 'newest'
        };
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.setupNavigation();
        this.loadWebsites();
        this.setupFilters();
        this.setupBackToTop();
        this.setupMobileMenu();
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
                
                this.showNotification(`Switched to ${newTheme} mode`, 'success');
            });
        }
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    setupNavigation() {
        const navbar = document.getElementById('navbar');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    loadWebsites() {
        if (!window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.websites) {
            console.error('Websites data not found');
            return;
        }

        this.websites = window.PORTFOLIO_DATA.websites;
        this.filteredWebsites = [...this.websites];
        this.renderWebsites();
    }

    setupFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredWebsites = this.websites.filter(website => {
            // Category filter
            if (this.currentFilters.category !== 'all' && website.category !== this.currentFilters.category) {
                return false;
            }

            // Status filter
            if (this.currentFilters.status !== 'all' && website.status !== this.currentFilters.status) {
                return false;
            }

            return true;
        });

        // Sort websites
        this.sortWebsites();

        this.renderWebsites();
    }

    sortWebsites() {
        switch (this.currentFilters.sort) {
            case 'newest':
                this.filteredWebsites.sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate));
                break;
            case 'oldest':
                this.filteredWebsites.sort((a, b) => new Date(a.launchDate) - new Date(b.launchDate));
                break;
            case 'rating':
                this.filteredWebsites.sort((a, b) => b.rating - a.rating);
                break;
            case 'users':
                // For websites, we'll use a simulated user count based on playCount
                this.filteredWebsites.sort((a, b) => b.playCount - a.playCount);
                break;
        }
    }

    renderWebsites() {
        const container = document.getElementById('websitesGrid');
        if (!container) return;

        if (this.filteredWebsites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-laptop-code"></i>
                    <h3>No Websites Found</h3>
                    <p>Try adjusting your filters to see more results</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredWebsites.map(website => `
            <div class="portfolio-card" onclick="window.location.href='website-detail.html?id=${website.id}'">
                <div class="card-image">
                    <img src="${website.image}" alt="${website.name}" class="portfolio-image">
                    <div class="card-overlay">
                        <div class="card-actions">
                            <button class="btn-visit" onclick="event.stopPropagation(); window.location.href='website-detail.html?id=${website.id}'">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-badge ${website.status.toLowerCase()}">
                        ${website.status}
                    </div>
                </div>
                <div class="portfolio-info">
                    <h3 class="portfolio-title">${website.name}</h3>
                    <p class="portfolio-category">${website.category}</p>
                    <p class="portfolio-description">${website.overview}</p>
                    <div class="portfolio-tags">
                        ${website.technologies.slice(0, 3).map(tech => `<span class="tag">${tech}</span>`).join('')}
                        ${website.technologies.length > 3 ? `<span class="tag-more">+${website.technologies.length - 3}</span>` : ''}
                    </div>
                    <div class="portfolio-meta">
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${website.rating}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${this.formatNumber(website.playCount)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDate(website.launchDate)}</span>
                        </div>
                    </div>
                    <div class="portfolio-platforms">
                        <span class="platform-tag web">Web Platform</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add hover effects
        this.setupCardHoverEffects();
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.portfolio-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
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

    setupBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
                
                document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
            });

            menu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
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
    new WebsitesPage();
});