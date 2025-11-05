// ============================================
// WEBSITES PORTFOLIO FUNCTIONALITY
// ============================================

class WebsitesPortfolio {
    constructor() {
        this.websites = [];
        this.filteredWebsites = [];
        this.currentFilters = {
            category: 'all',
            status: 'all',
            platform: 'all',
            sort: 'newest'
        };
        this.currentPage = 1;
        this.websitesPerPage = 9;
        this.init();
    }

    init() {
        this.loadWebsites();
        this.setupEventListeners();
        this.setupFilters();
        this.renderWebsites();
        this.setupViewTransitions();
    }

    loadWebsites() {
        this.websites = window.PORTFOLIO_DATA.websites || [];
        this.filteredWebsites = [...this.websites];
    }

    setupEventListeners() {
        // Filter event listeners
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

        document.getElementById('techFilter')?.addEventListener('change', (e) => {
            this.currentFilters.technology = e.target.value;
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
        const searchInput = document.getElementById('websiteSearch');
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

        // Website preview
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-preview')) {
                const websiteId = e.target.closest('.btn-preview').dataset.websitePreview;
                this.openWebsitePreview(websiteId);
            }
        });
    }

    setupFilters() {
        // Initialize filter values
        const filters = ['categoryFilter', 'statusFilter', 'sortFilter', 'techFilter'];
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.value = this.currentFilters[filterId.replace('Filter', '')] || 'all';
            }
        });
    }

    applyFilters() {
        let filtered = [...this.websites];

        // Category filter
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(website => 
                website.category === this.currentFilters.category
            );
        }

        // Status filter
        if (this.currentFilters.status !== 'all') {
            filtered = filtered.filter(website => 
                website.status.toLowerCase() === this.currentFilters.status.toLowerCase()
            );
        }

        // Technology filter
        if (this.currentFilters.technology !== 'all') {
            filtered = filtered.filter(website => 
                website.technologies.includes(this.currentFilters.technology)
            );
        }

        // Platform filter
        if (this.currentFilters.platform !== 'all') {
            filtered = filtered.filter(website => {
                if (this.currentFilters.platform === 'responsive') return true; // All websites are responsive
                if (this.currentFilters.platform === 'pwa') return website.features?.includes('PWA') || false;
                return true;
            });
        }

        // Search filter
        const searchInput = document.getElementById('websiteSearch');
        if (searchInput && searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filtered = filtered.filter(website =>
                website.name.toLowerCase().includes(searchTerm) ||
                website.description.toLowerCase().includes(searchTerm) ||
                website.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
            );
        }

        // Sorting
        filtered = this.sortWebsites(filtered, this.currentFilters.sort);

        this.filteredWebsites = filtered;
        this.currentPage = 1;
        this.renderWebsites();
        this.updateResultsCount();
    }

    sortWebsites(websites, sortType) {
        switch (sortType) {
            case 'newest':
                return websites.sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate));
            case 'oldest':
                return websites.sort((a, b) => new Date(a.launchDate) - new Date(b.launchDate));
            case 'rating':
                return websites.sort((a, b) => b.rating - a.rating);
            case 'users':
                return websites.sort((a, b) => b.monthlyUsers - a.monthlyUsers);
            case 'a-z':
                return websites.sort((a, b) => a.name.localeCompare(b.name));
            case 'z-a':
                return websites.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return websites;
        }
    }

    handleSearch(searchTerm) {
        this.applyFilters();
    }

    resetFilters() {
        this.currentFilters = {
            category: 'all',
            status: 'all',
            platform: 'all',
            sort: 'newest',
            technology: 'all'
        };
        
        this.setupFilters();
        
        const searchInput = document.getElementById('websiteSearch');
        if (searchInput) searchInput.value = '';
        
        this.applyFilters();
    }

    changeView(viewType) {
        const grid = document.getElementById('websitesGrid');
        if (grid) {
            grid.setAttribute('data-view', viewType);
        }
        
        document.querySelectorAll('.view-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelector(`[data-view="${viewType}"]`)?.classList.add('active');
    }

    renderWebsites() {
        const grid = document.getElementById('websitesGrid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.websitesPerPage;
        const endIndex = startIndex + this.websitesPerPage;
        const websitesToShow = this.filteredWebsites.slice(startIndex, endIndex);

        if (websitesToShow.length === 0) {
            grid.innerHTML = this.getEmptyStateHTML();
            this.hidePagination();
            return;
        }

        grid.innerHTML = websitesToShow.map(website => this.createWebsiteCard(website)).join('');
        this.renderPagination();
    }

    createWebsiteCard(website) {
        return `
            <div class="portfolio-card website-card" 
                 data-category="${website.category}" 
                 data-status="${website.status}" 
                 data-rating="${website.rating}" 
                 data-users="${website.monthlyUsers}">
                <div class="card-image">
                    <img src="${website.image}" alt="${website.name}" class="portfolio-image" loading="lazy">
                    <div class="website-preview-overlay">
                        <div class="card-actions">
                            <button class="btn-visit" onclick="window.open('${website.url}', '_blank')">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                            <button class="btn-preview" data-website-preview="${website.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-bookmark" data-website-id="${website.id}">
                                <i class="far fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-badge ${website.status.toLowerCase()}">
                        <i class="fas fa-circle"></i>
                        ${website.status}
                    </div>
                    <div class="website-performance">
                        <span>Performance</span>
                        <div class="performance-bar">
                            <div class="performance-fill" style="width: ${Math.min(website.rating * 20, 100)}%"></div>
                        </div>
                        <span>${Math.min(website.rating * 20, 100)}%</span>
                    </div>
                </div>
                <div class="portfolio-info">
                    <div class="website-header">
                        <h3 class="portfolio-title">${website.name}</h3>
                        <div class="website-rating">
                            <i class="fas fa-star"></i>
                            <span>${website.rating}</span>
                        </div>
                    </div>
                    <p class="portfolio-category">${website.category}</p>
                    <p class="portfolio-description">${website.overview}</p>
                    
                    <div class="website-card-features">
                        ${website.features.slice(0, 3).map(feature => 
                            `<span class="website-feature">${feature}</span>`
                        ).join('')}
                        ${website.features.length > 3 ? '<span class="feature-more">+' + (website.features.length - 3) + '</span>' : ''}
                    </div>
                    
                    <div class="portfolio-tags">
                        ${website.technologies.slice(0, 4).map(tech => 
                            `<span class="tag">${tech}</span>`
                        ).join('')}
                        ${website.technologies.length > 4 ? '<span class="tag-more">+' + (website.technologies.length - 4) + '</span>' : ''}
                    </div>
                    
                    <div class="portfolio-meta">
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${website.rating}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${this.formatNumber(website.monthlyUsers)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${new Date(website.launchDate).getFullYear()}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-bolt"></i>
                            <span>${Math.min(website.rating * 20, 100)}%</span>
                        </div>
                    </div>
                    
                    <div class="portfolio-platforms">
                        <span class="platform-tag responsive">Responsive</span>
                        ${website.features?.includes('PWA') ? '<span class="platform-tag pwa">PWA</span>' : ''}
                    </div>
                    
                    <div class="website-progress">
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
                <i class="fas fa-laptop-code"></i>
                <h3>No Websites Found</h3>
                <p>Try adjusting your filters or search terms to see more results</p>
                <button class="btn btn-primary" id="resetSearch">
                    <i class="fas fa-redo"></i>
                    Reset Search
                </button>
            </div>
        `;
    }

    renderPagination() {
        const pagination = document.getElementById('websitesPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredWebsites.length / this.websitesPerPage);
        
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
                this.renderWebsites();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    hidePagination() {
        const pagination = document.getElementById('websitesPagination');
        if (pagination) {
            pagination.innerHTML = '';
        }
    }

    updateResultsCount() {
        const countElement = document.getElementById('websitesCount');
        if (countElement) {
            countElement.textContent = this.filteredWebsites.length;
        }
    }

    openWebsitePreview(websiteId) {
        const website = this.websites.find(w => w.id === parseInt(websiteId));
        if (!website) return;

        const modalHTML = `
            <div id="websitePreviewModal" class="modal active">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>${website.name} - Preview</h2>
                        <button class="modal-close" id="websitePreviewClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="website-preview-content">
                            <div class="preview-frame">
                                <iframe src="${website.url}" class="website-iframe" 
                                        frameborder="0"></iframe>
                            </div>
                            <div class="preview-info">
                                <h3>${website.name}</h3>
                                <p>${website.description}</p>
                                <div class="preview-actions">
                                    <button class="btn btn-primary" onclick="window.open('${website.url}', '_blank')">
                                        <i class="fas fa-external-link-alt"></i>
                                        Visit Website
                                    </button>
                                    <button class="btn btn-secondary" onclick="window.location.href='website-detail.html?id=${website.id}'">
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

        const existingModal = document.getElementById('websitePreviewModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('websitePreviewClose').addEventListener('click', () => {
            document.getElementById('websitePreviewModal').remove();
        });

        document.getElementById('websitePreviewModal').addEventListener('click', (e) => {
            if (e.target.id === 'websitePreviewModal') {
                document.getElementById('websitePreviewModal').remove();
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
        const websiteCards = document.querySelectorAll('.website-card');
        websiteCards.forEach((card, index) => {
            card.style.viewTransitionName = `website-card-${index}`;
        });
    }
}

// Initialize websites portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.websitesPortfolio = new WebsitesPortfolio();
});