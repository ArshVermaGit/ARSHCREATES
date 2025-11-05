// ============================================
// GAMES PORTFOLIO FUNCTIONALITY
// ============================================

class GamesPortfolio {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.currentFilters = {
            category: 'all',
            status: 'all',
            platform: 'all',
            sort: 'newest'
        };
        this.currentPage = 1;
        this.gamesPerPage = 9;
        this.init();
    }

    init() {
        this.loadGames();
        this.setupEventListeners();
        this.setupFilters();
        this.renderGames();
        this.setupViewTransitions();
    }

    loadGames() {
        this.games = window.PORTFOLIO_DATA.games || [];
        this.filteredGames = [...this.games];
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

        document.getElementById('platformFilter')?.addEventListener('change', (e) => {
            this.currentFilters.platform = e.target.value;
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
        const searchInput = document.getElementById('gameSearch');
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

        // Game preview
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-preview')) {
                const gameId = e.target.closest('.btn-preview').dataset.gamePreview;
                this.openGamePreview(gameId);
            }
        });
    }

    setupFilters() {
        // Initialize filter values
        if (document.getElementById('categoryFilter')) {
            document.getElementById('categoryFilter').value = this.currentFilters.category;
        }
        if (document.getElementById('statusFilter')) {
            document.getElementById('statusFilter').value = this.currentFilters.status;
        }
        if (document.getElementById('platformFilter')) {
            document.getElementById('platformFilter').value = this.currentFilters.platform;
        }
        if (document.getElementById('sortFilter')) {
            document.getElementById('sortFilter').value = this.currentFilters.sort;
        }
    }

    applyFilters() {
        let filtered = [...this.games];

        // Category filter
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(game => 
                game.category === this.currentFilters.category
            );
        }

        // Status filter
        if (this.currentFilters.status !== 'all') {
            filtered = filtered.filter(game => 
                game.status.toLowerCase() === this.currentFilters.status.toLowerCase()
            );
        }

        // Platform filter
        if (this.currentFilters.platform !== 'all') {
            filtered = filtered.filter(game => 
                game.platforms.includes(this.currentFilters.platform)
            );
        }

        // Search filter (if any)
        const searchInput = document.getElementById('gameSearch');
        if (searchInput && searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filtered = filtered.filter(game =>
                game.name.toLowerCase().includes(searchTerm) ||
                game.description.toLowerCase().includes(searchTerm) ||
                game.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
            );
        }

        // Sorting
        filtered = this.sortGames(filtered, this.currentFilters.sort);

        this.filteredGames = filtered;
        this.currentPage = 1;
        this.renderGames();
        this.updateResultsCount();
    }

    sortGames(games, sortType) {
        switch (sortType) {
            case 'newest':
                return games.sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate));
            case 'oldest':
                return games.sort((a, b) => new Date(a.launchDate) - new Date(b.launchDate));
            case 'rating':
                return games.sort((a, b) => b.rating - a.rating);
            case 'popular':
                return games.sort((a, b) => b.playCount - a.playCount);
            case 'a-z':
                return games.sort((a, b) => a.name.localeCompare(b.name));
            case 'z-a':
                return games.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return games;
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
            sort: 'newest'
        };
        
        this.setupFilters();
        
        const searchInput = document.getElementById('gameSearch');
        if (searchInput) searchInput.value = '';
        
        this.applyFilters();
    }

    changeView(viewType) {
        const grid = document.getElementById('gamesGrid');
        if (grid) {
            grid.setAttribute('data-view', viewType);
        }
        
        document.querySelectorAll('.view-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelector(`[data-view="${viewType}"]`)?.classList.add('active');
    }

    renderGames() {
        const grid = document.getElementById('gamesGrid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.gamesPerPage;
        const endIndex = startIndex + this.gamesPerPage;
        const gamesToShow = this.filteredGames.slice(startIndex, endIndex);

        if (gamesToShow.length === 0) {
            grid.innerHTML = this.getEmptyStateHTML();
            this.hidePagination();
            return;
        }

        grid.innerHTML = gamesToShow.map(game => this.createGameCard(game)).join('');
        this.renderPagination();
    }

    createGameCard(game) {
        return `
            <div class="portfolio-card game-card" 
                 data-category="${game.category}" 
                 data-status="${game.status}" 
                 data-rating="${game.rating}" 
                 data-playcount="${game.playCount}">
                <div class="card-image">
                    <img src="${game.image}" alt="${game.name}" class="portfolio-image" loading="lazy">
                    <div class="card-overlay">
                        <div class="card-actions">
                            <button class="btn-visit" onclick="window.location.href='game-detail.html?id=${game.id}'">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="btn-preview" data-game-preview="${game.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-bookmark" data-game-id="${game.id}">
                                <i class="far fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-badge ${game.status.toLowerCase()}">
                        <i class="fas fa-circle"></i>
                        ${game.status}
                    </div>
                </div>
                <div class="portfolio-info">
                    <div class="game-header">
                        <h3 class="portfolio-title">${game.name}</h3>
                        <div class="game-rating">
                            <i class="fas fa-star"></i>
                            <span>${game.rating}</span>
                        </div>
                    </div>
                    <p class="portfolio-category">${game.category}</p>
                    <p class="portfolio-description">${game.overview}</p>
                    
                    <div class="game-card-features">
                        ${game.features.slice(0, 3).map(feature => 
                            `<span class="game-feature">${feature}</span>`
                        ).join('')}
                        ${game.features.length > 3 ? '<span class="feature-more">+' + (game.features.length - 3) + '</span>' : ''}
                    </div>
                    
                    <div class="portfolio-tags">
                        ${game.technologies.slice(0, 4).map(tech => 
                            `<span class="tag">${tech}</span>`
                        ).join('')}
                        ${game.technologies.length > 4 ? '<span class="tag-more">+' + (game.technologies.length - 4) + '</span>' : ''}
                    </div>
                    
                    <div class="portfolio-meta">
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${game.rating}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-play"></i>
                            <span>${this.formatNumber(game.playCount)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-heart"></i>
                            <span>${this.formatNumber(game.likes)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${new Date(game.launchDate).getFullYear()}</span>
                        </div>
                    </div>
                    
                    <div class="portfolio-platforms">
                        ${game.platforms.map(platform => 
                            `<span class="platform-tag ${platform.toLowerCase()}">${platform}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-gamepad"></i>
                <h3>No Games Found</h3>
                <p>Try adjusting your filters or search terms to see more results</p>
                <button class="btn btn-primary" id="resetSearch">
                    <i class="fas fa-redo"></i>
                    Reset Search
                </button>
            </div>
        `;
    }

    renderPagination() {
        const pagination = document.getElementById('gamesPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredGames.length / this.gamesPerPage);
        
        if (totalPages <= 1) {
            this.hidePagination();
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage - 1}">Previous</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="pagination-btn active" data-page="${i}">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Next</button>`;
        }

        pagination.innerHTML = paginationHTML;

        // Add event listeners to pagination buttons
        pagination.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderGames();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    hidePagination() {
        const pagination = document.getElementById('gamesPagination');
        if (pagination) {
            pagination.innerHTML = '';
        }
    }

    updateResultsCount() {
        const countElement = document.getElementById('gamesCount');
        if (countElement) {
            countElement.textContent = this.filteredGames.length;
        }
    }

    openGamePreview(gameId) {
        const game = this.games.find(g => g.id === parseInt(gameId));
        if (!game) return;

        // Create and show game preview modal
        const modalHTML = `
            <div id="gamePreviewModal" class="modal active">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>${game.name} - Preview</h2>
                        <button class="modal-close" id="gamePreviewClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="game-container">
                            <iframe src="${game.gameFile}" class="game-iframe" 
                                    allow="gamepad; fullscreen"></iframe>
                        </div>
                        <div class="game-controls">
                            <button class="btn-control" onclick="document.querySelector('.game-iframe').contentWindow.location.reload()">
                                <i class="fas fa-redo"></i>
                                Restart Game
                            </button>
                            <button class="btn-control" onclick="document.querySelector('.game-iframe').requestFullscreen()">
                                <i class="fas fa-expand"></i>
                                Fullscreen
                            </button>
                            <a href="game-detail.html?id=${game.id}" class="btn-control">
                                <i class="fas fa-info-circle"></i>
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('gamePreviewModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listener to close button
        document.getElementById('gamePreviewClose').addEventListener('click', () => {
            document.getElementById('gamePreviewModal').remove();
        });

        // Close modal when clicking outside
        document.getElementById('gamePreviewModal').addEventListener('click', (e) => {
            if (e.target.id === 'gamePreviewModal') {
                document.getElementById('gamePreviewModal').remove();
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
        // Add view transition names for smooth animations
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach((card, index) => {
            card.style.viewTransitionName = `game-card-${index}`;
        });
    }
}

// Initialize games portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gamesPortfolio = new GamesPortfolio();
});