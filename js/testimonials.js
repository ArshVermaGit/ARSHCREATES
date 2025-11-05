// ============================================
// TESTIMONIALS PAGE SCRIPT
// ============================================

class TestimonialsPage {
    constructor() {
        this.testimonials = [];
        this.filteredTestimonials = [];
        this.currentFilters = {
            projectType: 'all',
            minRating: 0,
            sort: 'newest'
        };
        this.currentRating = 0;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.setupNavigation();
        this.loadTestimonials();
        this.setupFilters();
        this.setupModal();
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

    loadTestimonials() {
        if (!window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.testimonials) {
            console.error('Testimonials data not found');
            return;
        }

        this.testimonials = window.PORTFOLIO_DATA.testimonials;
        this.filteredTestimonials = [...this.testimonials];
        this.renderTestimonials();
    }

    setupFilters() {
        const projectTypeFilter = document.getElementById('projectTypeFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (projectTypeFilter) {
            projectTypeFilter.addEventListener('change', (e) => {
                this.currentFilters.projectType = e.target.value;
                this.applyFilters();
            });
        }

        if (ratingFilter) {
            ratingFilter.addEventListener('change', (e) => {
                this.currentFilters.minRating = parseFloat(e.target.value);
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
        this.filteredTestimonials = this.testimonials.filter(testimonial => {
            // Project type filter
            if (this.currentFilters.projectType !== 'all' && testimonial.projectType !== this.currentFilters.projectType) {
                return false;
            }

            // Rating filter
            if (this.currentFilters.minRating > 0 && testimonial.rating < this.currentFilters.minRating) {
                return false;
            }

            return true;
        });

        // Sort testimonials
        this.sortTestimonials();

        this.renderTestimonials();
    }

    sortTestimonials() {
        switch (this.currentFilters.sort) {
            case 'newest':
                this.filteredTestimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                this.filteredTestimonials.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'rating':
                this.filteredTestimonials.sort((a, b) => b.rating - a.rating);
                break;
            case 'project':
                this.filteredTestimonials.sort((a, b) => a.projectType.localeCompare(b.projectType));
                break;
        }
    }

    renderTestimonials() {
        const container = document.getElementById('testimonialsGrid');
        if (!container) return;

        if (this.filteredTestimonials.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comment-dots"></i>
                    <h3>No Testimonials Found</h3>
                    <p>Try adjusting your filters to see more results</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredTestimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="client-info">
                        <div class="client-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="client-details">
                            <h3 class="client-name">${testimonial.clientName}</h3>
                            <p class="client-role">${testimonial.clientRole}</p>
                        </div>
                    </div>
                    <div class="testimonial-meta">
                        <span class="project-type ${testimonial.projectType.toLowerCase()}">${testimonial.projectType}</span>
                        <div class="rating">
                            ${this.renderStars(testimonial.rating)}
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
        `).join('');

        // Add hover effects
        this.setupCardHoverEffects();
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (hasHalfStar && i === fullStars + 1) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }

        return stars;
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.testimonial-card');
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

    setupModal() {
        const modal = document.getElementById('testimonialModal');
        const addBtn = document.getElementById('addTestimonialBtn');
        const closeBtn = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('cancelTestimonial');
        const form = document.getElementById('testimonialForm');

        // Open modal
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            form.reset();
            this.resetRating();
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Setup rating stars
        this.setupRatingStars();

        // Handle form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitTestimonial(form);
            });
        }
    }

    setupRatingStars() {
        const stars = document.querySelectorAll('#ratingStars .star');
        const ratingInput = document.getElementById('rating');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                this.setRating(rating);
            });

            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                this.highlightStars(rating);
            });
        });

        // Reset stars on mouse leave
        document.getElementById('ratingStars').addEventListener('mouseleave', () => {
            this.highlightStars(this.currentRating);
        });
    }

    setRating(rating) {
        this.currentRating = rating;
        document.getElementById('rating').value = rating;
        this.highlightStars(rating);
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('#ratingStars .star');
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    resetRating() {
        this.currentRating = 0;
        document.getElementById('rating').value = '';
        this.highlightStars(0);
    }

    submitTestimonial(form) {
        const formData = new FormData(form);
        const testimonial = {
            id: Date.now(),
            clientName: formData.get('clientName'),
            clientRole: formData.get('clientRole'),
            projectType: formData.get('projectType'),
            projectName: formData.get('projectName'),
            rating: parseFloat(formData.get('rating')),
            text: formData.get('testimonialText'),
            date: new Date().toISOString()
        };

        // Add to testimonials array
        this.testimonials.unshift(testimonial);
        this.filteredTestimonials.unshift(testimonial);

        // Update localStorage
        this.saveTestimonials();

        // Update display
        this.renderTestimonials();

        // Close modal
        document.getElementById('testimonialModal').classList.remove('active');
        document.body.style.overflow = '';

        // Show success message
        this.showNotification('Testimonial added successfully!', 'success');

        // Reset form
        form.reset();
        this.resetRating();
    }

    saveTestimonials() {
        if (window.PORTFOLIO_DATA) {
            window.PORTFOLIO_DATA.testimonials = this.testimonials;
            localStorage.setItem('portfolioData', JSON.stringify(window.PORTFOLIO_DATA));
        }
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
    new TestimonialsPage();
});