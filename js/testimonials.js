// ============================================
// TESTIMONIALS FUNCTIONALITY
// ============================================

class TestimonialsManager {
    constructor() {
        this.testimonials = [];
        this.filteredTestimonials = [];
        this.currentFilters = {
            projectType: 'all',
            rating: 0,
            sort: 'newest',
            clientType: 'all'
        };
        this.currentPage = 1;
        this.testimonialsPerPage = 6;
        this.carouselIndex = 0;
        this.init();
    }

    init() {
        this.loadTestimonials();
        this.setupEventListeners();
        this.setupFilters();
        this.renderTestimonials();
        this.setupCarousel();
        this.setupModal();
    }

    loadTestimonials() {
        this.testimonials = window.PORTFOLIO_DATA.testimonials || [];
        this.filteredTestimonials = [...this.testimonials];
    }

    setupEventListeners() {
        // Filter event listeners
        document.getElementById('projectTypeFilter')?.addEventListener('change', (e) => {
            this.currentFilters.projectType = e.target.value;
            this.applyFilters();
        });

        document.getElementById('ratingFilter')?.addEventListener('change', (e) => {
            this.currentFilters.rating = parseInt(e.target.value);
            this.applyFilters();
        });

        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.currentFilters.sort = e.target.value;
            this.applyFilters();
        });

        document.getElementById('clientTypeFilter')?.addEventListener('change', (e) => {
            this.currentFilters.clientType = e.target.value;
            this.applyFilters();
        });

        // Rating filter buttons
        document.querySelectorAll('.rating-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.rating-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.rating = parseInt(e.target.dataset.rating);
                this.applyFilters();
            });
        });

        // Search functionality
        const searchInput = document.getElementById('testimonialSearch');
        const searchClear = document.getElementById('testimonialSearchClear');
        
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
        document.getElementById('resetTestimonialFilters')?.addEventListener('click', () => {
            this.resetFilters();
        });

        // View options
        document.querySelectorAll('.view-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.changeView(e.target.dataset.view);
            });
        });

        // Add testimonial button
        document.getElementById('addTestimonialBtn')?.addEventListener('click', () => {
            this.openTestimonialModal();
        });

        document.getElementById('addTestimonialCtaBtn')?.addEventListener('click', () => {
            this.openTestimonialModal();
        });

        // Guidelines
        document.getElementById('viewSubmissionGuidelines')?.addEventListener('click', () => {
            this.openGuidelinesModal();
        });
    }

    setupFilters() {
        // Initialize filter values
        const filters = ['projectTypeFilter', 'ratingFilter', 'sortFilter', 'clientTypeFilter'];
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.value = this.currentFilters[filterId.replace('Filter', '')] || 'all';
            }
        });
    }

    applyFilters() {
        let filtered = [...this.testimonials];

        // Project type filter
        if (this.currentFilters.projectType !== 'all') {
            filtered = filtered.filter(testimonial => 
                testimonial.projectType === this.currentFilters.projectType
            );
        }

        // Rating filter
        if (this.currentFilters.rating > 0) {
            filtered = filtered.filter(testimonial => 
                testimonial.rating >= this.currentFilters.rating
            );
        }

        // Client type filter
        if (this.currentFilters.clientType !== 'all') {
            filtered = filtered.filter(testimonial => 
                testimonial.clientType === this.currentFilters.clientType
            );
        }

        // Search filter
        const searchInput = document.getElementById('testimonialSearch');
        if (searchInput && searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filtered = filtered.filter(testimonial =>
                testimonial.clientName.toLowerCase().includes(searchTerm) ||
                testimonial.text.toLowerCase().includes(searchTerm) ||
                testimonial.projectName.toLowerCase().includes(searchTerm)
            );
        }

        // Sorting
        filtered = this.sortTestimonials(filtered, this.currentFilters.sort);

        this.filteredTestimonials = filtered;
        this.currentPage = 1;
        this.renderTestimonials();
        this.updateResultsCount();
    }

    sortTestimonials(testimonials, sortType) {
        switch (sortType) {
            case 'newest':
                return testimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return testimonials.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'rating':
                return testimonials.sort((a, b) => b.rating - a.rating);
            case 'project':
                return testimonials.sort((a, b) => a.projectType.localeCompare(b.projectType));
            case 'featured':
                return testimonials.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
            case 'verified':
                return testimonials.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
            default:
                return testimonials;
        }
    }

    handleSearch(searchTerm) {
        this.applyFilters();
    }

    resetFilters() {
        this.currentFilters = {
            projectType: 'all',
            rating: 0,
            sort: 'newest',
            clientType: 'all'
        };
        
        this.setupFilters();
        
        const searchInput = document.getElementById('testimonialSearch');
        if (searchInput) searchInput.value = '';
        
        this.applyFilters();
    }

    changeView(viewType) {
        const grid = document.getElementById('testimonialsGrid');
        if (grid) {
            grid.setAttribute('data-view', viewType);
        }
        
        document.querySelectorAll('.view-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelector(`[data-view="${viewType}"]`)?.classList.add('active');
    }

    renderTestimonials() {
        const grid = document.getElementById('testimonialsGrid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.testimonialsPerPage;
        const endIndex = startIndex + this.testimonialsPerPage;
        const testimonialsToShow = this.filteredTestimonials.slice(startIndex, endIndex);

        if (testimonialsToShow.length === 0) {
            grid.innerHTML = this.getEmptyStateHTML();
            this.hidePagination();
            return;
        }

        grid.innerHTML = testimonialsToShow.map(testimonial => this.createTestimonialCard(testimonial)).join('');
        this.renderPagination();
    }

    createTestimonialCard(testimonial) {
        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        const isFeatured = testimonial.verified && testimonial.rating >= 4.5;

        return `
            <div class="testimonial-card ${isFeatured ? 'featured' : ''}" 
                 data-rating="${testimonial.rating}" 
                 data-project-type="${testimonial.projectType}" 
                 data-client-type="${testimonial.clientType}" 
                 data-verified="${testimonial.verified}">
                <div class="testimonial-header">
                    <div class="client-info">
                        <div class="client-avatar">
                            <div class="avatar-placeholder">
                                ${testimonial.clientName.split(' ').map(n => n[0]).join('')}
                            </div>
                            ${testimonial.verified ? `
                                <div class="avatar-badge verified">
                                    <i class="fas fa-check"></i>
                                </div>
                            ` : ''}
                        </div>
                        <div class="client-details">
                            <h3 class="client-name">${testimonial.clientName}</h3>
                            <p class="client-role">${testimonial.clientRole}</p>
                            ${testimonial.verified ? `
                                <div class="client-verified">
                                    <i class="fas fa-check"></i>
                                    Verified Client
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="testimonial-meta">
                        <span class="project-type ${testimonial.projectType.toLowerCase()}">${testimonial.projectType}</span>
                        <div class="rating">
                            ${stars}
                            <span class="rating-value">${testimonial.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                <div class="testimonial-content">
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-footer">
                        <span class="testimonial-date">${formatDate(testimonial.date)}</span>
                        <span class="project-name">${testimonial.projectName}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-comment-dots"></i>
                <h3>No Testimonials Found</h3>
                <p>Try adjusting your filters or search terms to see more results</p>
                <button class="btn btn-primary" id="resetTestimonialSearch">
                    <i class="fas fa-redo"></i>
                    Reset Search
                </button>
            </div>
        `;
    }

    renderPagination() {
        const pagination = document.getElementById('testimonialsPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredTestimonials.length / this.testimonialsPerPage);
        
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
                this.renderTestimonials();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    hidePagination() {
        const pagination = document.getElementById('testimonialsPagination');
        if (pagination) {
            pagination.innerHTML = '';
        }
    }

    updateResultsCount() {
        const countElement = document.getElementById('testimonialsCount');
        if (countElement) {
            countElement.textContent = this.filteredTestimonials.length;
        }
    }

    setupCarousel() {
        const track = document.getElementById('carouselTrack');
        const dots = document.getElementById('carouselDots');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (!track) return;

        const featuredTestimonials = this.testimonials.filter(t => t.verified && t.rating >= 4.5);
        
        if (featuredTestimonials.length === 0) {
            document.querySelector('.featured-testimonials').style.display = 'none';
            return;
        }

        // Create carousel slides
        track.innerHTML = featuredTestimonials.map(testimonial => `
            <div class="carousel-slide">
                ${this.createTestimonialCard(testimonial)}
            </div>
        `).join('');

        // Create dots
        if (dots) {
            dots.innerHTML = featuredTestimonials.map((_, index) => `
                <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
            `).join('');
        }

        // Carousel navigation
        const updateCarousel = () => {
            track.style.transform = `translateX(-${this.carouselIndex * 100}%)`;
            
            if (dots) {
                dots.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.carouselIndex);
                });
            }
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.carouselIndex = (this.carouselIndex - 1 + featuredTestimonials.length) % featuredTestimonials.length;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.carouselIndex = (this.carouselIndex + 1) % featuredTestimonials.length;
                updateCarousel();
            });
        }

        if (dots) {
            dots.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    this.carouselIndex = parseInt(e.target.dataset.index);
                    updateCarousel();
                });
            });
        }

        // Auto-advance carousel
        setInterval(() => {
            this.carouselIndex = (this.carouselIndex + 1) % featuredTestimonials.length;
            updateCarousel();
        }, 5000);
    }

    setupModal() {
        // Testimonial form submission
        const form = document.getElementById('testimonialForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitTestimonial(form);
            });
        }

        // Rating stars
        const stars = document.querySelectorAll('#ratingStars .star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.setRating(index + 1);
            });
        });

        // Character counter
        const textarea = document.getElementById('testimonialText');
        const charCount = document.getElementById('charCount');
        if (textarea && charCount) {
            textarea.addEventListener('input', () => {
                charCount.textContent = textarea.value.length;
            });
        }

        // Modal close buttons
        document.getElementById('cancelTestimonial')?.addEventListener('click', () => {
            this.closeTestimonialModal();
        });

        document.getElementById('modalClose')?.addEventListener('click', () => {
            this.closeTestimonialModal();
        });

        document.getElementById('guidelinesClose')?.addEventListener('click', () => {
            this.closeGuidelinesModal();
        });

        document.getElementById('startTestimonialFromGuidelines')?.addEventListener('click', () => {
            this.closeGuidelinesModal();
            this.openTestimonialModal();
        });
    }

    openTestimonialModal() {
        document.getElementById('testimonialModal').classList.add('active');
    }

    closeTestimonialModal() {
        document.getElementById('testimonialModal').classList.remove('active');
        document.getElementById('testimonialForm').reset();
        this.setRating(0);
    }

    openGuidelinesModal() {
        document.getElementById('guidelinesModal').classList.add('active');
    }

    closeGuidelinesModal() {
        document.getElementById('guidelinesModal').classList.remove('active');
    }

    setRating(rating) {
        const stars = document.querySelectorAll('#ratingStars .star');
        const ratingInput = document.getElementById('rating');
        const ratingText = document.getElementById('ratingText');

        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });

        ratingInput.value = rating;
        
        const ratingTexts = ['Select your rating', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        ratingText.textContent = ratingTexts[rating];
    }

    submitTestimonial(form) {
        const formData = new FormData(form);
        const testimonial = {
            clientName: formData.get('clientName'),
            clientRole: formData.get('clientRole'),
            projectType: formData.get('projectType'),
            projectName: formData.get('projectName'),
            rating: parseInt(formData.get('rating')),
            text: formData.get('testimonialText'),
            date: new Date().toISOString().split('T')[0],
            verified: false
        };

        if (this.validateTestimonial(testimonial)) {
            window.addTestimonial(testimonial);
            this.showNotification('Thank you for your testimonial! It will be reviewed before publishing.', 'success');
            this.closeTestimonialModal();
            this.loadTestimonials();
            this.applyFilters();
        }
    }

    validateTestimonial(testimonial) {
        if (!testimonial.clientName || !testimonial.clientRole || !testimonial.projectType || 
            !testimonial.projectName || !testimonial.rating || !testimonial.text) {
            this.showNotification('Please fill in all required fields.', 'error');
            return false;
        }

        if (testimonial.text.length < 10) {
            this.showNotification('Please provide a more detailed testimonial.', 'error');
            return false;
        }

        return true;
    }

    showNotification(message, type) {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize testimonials manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.testimonialsManager = new TestimonialsManager();
});