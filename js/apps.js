// ============================================
// APPS PORTFOLIO FUNCTIONALITY
// ============================================

class AppsPortfolio {
    constructor() {
        this.apps = [];
        this.filteredApps = [];
        this.currentFilters = {
            platform: 'all',
            category: 'all',
            status: 'all',
            sort: 'newest'
        };
        this.currentPage = 1;
        this.appsPerPage = 9;
        this.init();
    }

    init() {
        this.loadApps();
        this.setupEventListeners();
        this.setupFilters();
        this.renderApps();
        this.setupViewTransitions();
    }

    loadApps() {
        this.apps = window.PORTFOLIO_DATA.apps || [];
        this.filteredApps = [...this.apps];
    }

    setupEventListeners() {
        // Filter event listeners
        document.getElementById('platformFilter')?.addEventListener('change', (e) => {
            this.currentFilters.platform = e.target.value;
            this.applyFilters();
        });

        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.applyFilters();
        });

        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.currentFilters.sort = e.target.value;
            this.applyFilters();
        });

        // Platform filter buttons
        document.querySelectorAll('.platform-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.platform-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.platform = e.target.dataset.platform;
                this.applyFilters();
            });
        });

        // Search functionality
        const searchInput = document.getElementById('appSearch');
        const searchClear = document.getElementById('searchClear');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.handleSearch('');
            });
        }

        // Reset filters
        document.getElementById('resetFilters')?.addEventListener('click', () => {
            this.resetFilters();
        });

        // View options
        document.querySelectorAll('.view-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.changeView(e.target.dataset.view);
            });
        });

        // App preview
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-preview')) {
                const appId = e.target.closest('.btn-preview').dataset.appPreview;
                this.openAppPreview(appId);
            }
        });
    }

    setupFilters() {
        // Initialize filter values
        const filters = ['platformFilter', 'categoryFilter', 'statusFilter', 'sortFilter'];
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.value = this.currentFilters[filterId.replace('Filter', '')] || 'all';
            }
        });
    }

    applyFilters() {
        let filtered = [...this.apps];

        // Platform filter
        if (this.currentFilters.platform !== 'all') {
            if (this.currentFilters.platform === 'cross-platform') {
                filtered = filtered.filter(app => app.platform === 'Cross-Platform');
            } else {
                filtered = filtered.filter(app => 
                    app.platform.toLowerCase().includes(this.currentFilters.platform)
                );
            }
        }

        // Category filter
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(app => 
                app.category === this.currentFilters.category
            );
        }

        // Status filter
        if (this.currentFilters.status !== 'all') {
            filtered = filtered.filter(app => 
                app.status.toLowerCase() === this.currentFilters.status.toLowerCase()
            );
        }

        // Search filter
        const searchInput = document.getElementById('appSearch');
        if (searchInput && searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filtered = filtered.filter(app =>
                app.name.toLowerCase().includes(searchTerm) ||
                app.description.toLowerCase().includes(searchTerm) ||
                app.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
            );
        }

        // Sorting
        filtered = this.sortApps(filtered, this.currentFilters.sort);

        this.filteredApps = filtered;
        this.currentPage = 1;
        this.renderApps();
        this.updateResultsCount();
    }

    sortApps(apps, sortType) {
        switch (sortType) {
            case 'newest':
                return apps.sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate));
            case 'oldest':
                return apps.sort((a, b) => new Date(a.launchDate) - new Date(b.launchDate));
            case 'rating':
                return apps.sort((a, b) => b.rating - a.rating);
            case 'downloads':
                return apps.sort((a, b) => b.downloads - a.downloads);
            case 'popular':
                return apps.sort((a, b) => b.activeUsers - a.activeUsers);
            case 'a-z':
                return apps.sort((a, b) => a.name.localeCompare(b.name));
            case 'z-a':
                return apps.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return apps;
        }
    }

    handleSearch(searchTerm) {
        this.applyFilters();
    }

    resetFilters() {
        this.currentFilters = {
            platform: 'all',
            category: 'all',
            status: 'all',
            sort: 'newest'
        };
        
        this.setupFilters();
        
        const searchInput = document.getElementById('appSearch');
        if (searchInput) searchInput.value = '';
        
        this.applyFilters();
    }

    changeView(viewType) {
        const grid = document.getElementById('appsGrid');
        if (grid) {
            grid.setAttribute('data-view', viewType);
        }
        
        document.querySelectorAll('.view-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelector(`[data-view="${viewType}"]`)?.classList.add('active');
    }

    renderApps() {
        const grid = document.getElementById('appsGrid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.appsPerPage;
        const endIndex = startIndex + this.appsPerPage;
        const appsToShow = this.filteredApps.slice(startIndex, endIndex);

        if (appsToShow.length === 0) {
            grid.innerHTML = this.getEmptyStateHTML();
            this.hidePagination();
            return;
        }

        grid.innerHTML = appsToShow.map(app => this.createAppCard(app)).join('');
        this.renderPagination();
    }

    createAppCard(app) {
        const platformTag = app.platform.toLowerCase().includes('ios') ? 'ios' : 
                           app.platform.toLowerCase().includes('android') ? 'android' : 
                           'cross-platform';

        return `
            <div class="portfolio-card app-card" 
                 data-category="${app.category}" 
                 data-status="${app.status}" 
                 data-platform="${platformTag}" 
                 data-rating="${app.rating}" 
                 data-downloads="${app.downloads}">
                <div class="card-image">
                    <img src="${app.image}" alt="${app.name}" class="portfolio-image" loading="lazy">
                    <div class="app-preview-overlay">
                        <div class="card-actions">
                            <button class="btn-download" onclick="window.location.href='app-detail.html?id=${app.id}'">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn-preview" data-app-preview="${app.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-bookmark" data-app-id="${app.id}">
                                <i class="far fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-badge ${app.status.toLowerCase()}">
                        <i class="fas fa-circle"></i>
                        ${app.status}
                    </div>
                    <div class="app-performance">
                        <span>Rating</span>
                        <div class="performance-bar">
                            <div class="performance-fill" style="width: ${app.rating * 20}%"></div>
                        </div>
                        <span>${app.rating}/5</span>
                    </div>
                </div>
                <div class="portfolio-info">
                    <div class="app-header">
                        <h3 class="portfolio-title">${app.name}</h3>
                        <div class="app-rating">
                            <i class="fas fa-star"></i>
                            <span>${app.rating}</span>
                        </div>
                    </div>
                    <p class="portfolio-category">${app.category}</p>
                    <p class="portfolio-description">${app.overview}</p>
                    
                    <div class="app-card-features">
                        ${app.features.slice(0, 3).map(feature => 
                            `<span class="app-feature">${feature}</span>`
                        ).join('')}
                        ${app.features.length > 3 ? '<span class="feature-more">+' + (app.features.length - 3) + '</span>' : ''}
                    </div>
                    
                    <div class="portfolio-tags">
                        ${app.technologies.slice(0, 4).map(tech => 
                            `<span class="tag">${tech}</span>`
                        ).join('')}
                        ${app.technologies.length > 4 ? '<span class="tag-more">+' + (app.technologies.length - 4) + '</span>' : ''}
                    </div>
                    
                    <div class="portfolio-meta">
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${app.rating}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-download"></i>
                            <span>${this.formatNumber(app.downloads)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${this.formatNumber(app.activeUsers)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-bolt"></i>
                            <span>${Math.round(app.rating * 20)}%</span>
                        </div>
                    </div>
                    
                    <div class="portfolio-platforms">
                        <span class="platform-tag ${platformTag}">${app.platform}</span>
                    </div>
                    
                    <div class="download-badges">
                        ${app.appStoreUrl ? `
                            <span class="download-badge ios-badge">
                                <i class="fab fa-apple"></i>
                                App Store
                            </span>
                        ` : ''}
                        ${app.playStoreUrl ? `
                            <span class="download-badge android-badge">
                                <i class="fab fa-android"></i>
                                Google Play
                            </span>
                        ` : ''}
                    </div>
                    
                    <div class="app-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 100%"></div>
                        </div>
                        <span class="progress-text">Fully Launched</span>
                    </div>
                </div>
            </div>
        `;
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-mobile-alt"></i>
                <h3>No Apps Found</h3>
                <p>Try adjusting your filters or search terms to see more results</p>
                <button class="btn btn-primary" id="resetSearch">
                    <i class="fas fa-redo"></i>
                    Reset Search
                </button>
            </div>
        `;
    }

    renderPagination() {
        const pagination = document.getElementById('appsPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredApps.length / this.appsPerPage);
        
        if (totalPages <= 1) {
            this.hidePagination();
            return;
        }

        let paginationHTML = '';
        
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage - 1}">Previous</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="pagination-btn active" data-page="${i}">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Next</button>`;
        }

        pagination.innerHTML = paginationHTML;

        pagination.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderApps();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    hidePagination() {
        const pagination = document.getElementById('appsPagination');
        if (pagination) {
            pagination.innerHTML = '';
        }
    }

    updateResultsCount() {
        const countElement = document.getElementById('appsCount');
        if (countElement) {
            countElement.textContent = this.filteredApps.length;
        }
    }

    openAppPreview(appId) {
        const app = this.apps.find(a => a.id === parseInt(appId));
        if (!app) return;

        const modalHTML = `
            <div id="appPreviewModal" class="modal active">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>${app.name} - Preview</h2>
                        <button class="modal-close" id="appPreviewClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="app-preview-content">
                            <div class="preview-video">
                                <video controls autoplay muted>
                                    <source src="videos/${app.name.toLowerCase().replace(' ', '-')}-demo.mp4" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div class="preview-info">
                                <h3>${app.name}</h3>
                                <p>${app.description}</p>
                                <div class="preview-actions">
                                    <button class="btn btn-primary" onclick="window.location.href='app-detail.html?id=${app.id}'">
                                        <i class="fas fa-download"></i>
                                        Download App
                                    </button>
                                    <button class="btn btn-secondary" onclick="window.location.href='app-detail.html?id=${app.id}'">
                                        <i class="fas fa-info-circle"></i>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('appPreviewModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('appPreviewClose').addEventListener('click', () => {
            document.getElementById('appPreviewModal').remove();
        });

        document.getElementById('appPreviewModal').addEventListener('click', (e) => {
            if (e.target.id === 'appPreviewModal') {
                document.getElementById('appPreviewModal').remove();
            }
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

    setupViewTransitions() {
        const appCards = document.querySelectorAll('.app-card');
        appCards.forEach((card, index) => {
            card.style.viewTransitionName = `app-card-${index}`;
        });
    }
}

// Initialize apps portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.appsPortfolio = new AppsPortfolio();
});