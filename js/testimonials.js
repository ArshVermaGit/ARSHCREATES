// ==========================================
// TESTIMONIALS PAGE - Client testimonials functionality
// Handles filtering, sorting, and adding testimonials
// ==========================================

// Global Variables
let currentTestimonials = [];
let currentFilters = {
    projectType: 'all',
    rating: '0',
    sort: 'newest'
};

// Initialize Testimonials Page
function initializeTestimonialsPage() {
    loadTestimonials();
    setupTestimonialFilters();
    setupTestimonialEventListeners();
    setupTestimonialModal();
}

// Load Testimonials
function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;
    
    currentTestimonials = getTestimonials();
    displayTestimonials(currentTestimonials);
    updateTestimonialStats();
}

// Display Testimonials
function displayTestimonials(testimonials) {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;
    
    // Filter approved testimonials only
    const approvedTestimonials = testimonials.filter(t => t.approved !== false);
    
    if (approvedTestimonials.length === 0) {
        testimonialsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-comment-dots"></i>
                <h3>No testimonials yet</h3>
                <p>Be the first to share your experience!</p>
            </div>
        `;
        return;
    }
    
    testimonialsGrid.innerHTML = approvedTestimonials.map(testimonial => `
        <div class="testimonial-item" data-testimonial-id="${testimonial.id}">
            <div class="testimonial-header">
                <div class="testimonial-client">
                    <img src="${testimonial.avatar}" alt="${testimonial.clientName}" class="client-avatar" loading="lazy">
                    <div class="client-info">
                        <h4>${testimonial.clientName}</h4>
                        <p>${testimonial.clientRole}</p>
                    </div>
                </div>
                <div class="testimonial-rating">
                    ${generateStars(testimonial.rating)}
                </div>
            </div>
            <div class="testimonial-text">
                "${testimonial.testimonialText}"
            </div>
            <div class="testimonial-meta">
                <span class="project-info">
                    <i class="fas fa-${getProjectTypeIcon(testimonial.projectType)}"></i>
                    ${testimonial.projectName} (${testimonial.projectType})
                </span>
                <span class="testimonial-date">
                    ${formatDate(testimonial.date)}
                </span>
            </div>
        </div>
    `).join('');
}

// Get Project Type Icon
function getProjectTypeIcon(projectType) {
    const icons = {
        'Website': 'laptop-code',
        'App': 'mobile-alt',
        'Game': 'gamepad',
        'Consultation': 'comments'
    };
    return icons[projectType] || 'star';
}

// Setup Testimonial Filters
function setupTestimonialFilters() {
    const projectTypeFilter = document.getElementById('projectTypeFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (projectTypeFilter) {
        projectTypeFilter.addEventListener('change', function() {
            currentFilters.projectType = this.value;
            applyTestimonialFilters();
        });
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', function() {
            currentFilters.rating = this.value;
            applyTestimonialFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyTestimonialFilters();
        });
    }
}

// Apply Filters
function applyTestimonialFilters() {
    let filteredTestimonials = getTestimonials().filter(t => t.approved !== false);
    
    // Project type filter
    if (currentFilters.projectType !== 'all') {
        filteredTestimonials = filteredTestimonials.filter(testimonial => 
            testimonial.projectType === currentFilters.projectType
        );
    }
    
    // Rating filter
    if (currentFilters.rating !== '0') {
        const minRating = parseFloat(currentFilters.rating);
        filteredTestimonials = filteredTestimonials.filter(testimonial => 
            testimonial.rating >= minRating
        );
    }
    
    // Sort testimonials
    filteredTestimonials = sortTestimonials(filteredTestimonials, currentFilters.sort);
    
    currentTestimonials = filteredTestimonials;
    displayTestimonials(filteredTestimonials);
}

// Sort Testimonials
function sortTestimonials(testimonials, sortBy) {
    const sortedTestimonials = [...testimonials];
    switch (sortBy) {
        case 'newest':
            return sortedTestimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'oldest':
            return sortedTestimonials.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'rating':
            return sortedTestimonials.sort((a, b) => b.rating - a.rating);
        case 'project':
            return sortedTestimonials.sort((a, b) => a.projectType.localeCompare(b.projectType));
        default:
            return sortedTestimonials;
    }
}

// Setup Testimonial Event Listeners
function setupTestimonialEventListeners() {
    // Add testimonial button
    const addTestimonialBtn = document.getElementById('addTestimonialBtn');
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', openTestimonialModal);
    }
}

// Testimonial Modal
function setupTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelTestimonial');
    const form = document.getElementById('testimonialForm');
    
    if (!modal) return;
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeTestimonialModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeTestimonialModal);
    }
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeTestimonialModal();
        }
    });
    
    // Star rating
    setupStarRating();
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleTestimonialSubmit);
    }
}

function openTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closeTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        
        // Reset form
        const form = document.getElementById('testimonialForm');
        if (form) {
            form.reset();
            resetStarRating();
        }
    }
}

// Star Rating System
function setupStarRating() {
    const stars = document.querySelectorAll('#ratingStars .star');
    const ratingInput = document.getElementById('rating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setStarRating(rating);
            if (ratingInput) {
                ratingInput.value = rating;
            }
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
    });
    
    // Reset stars when mouse leaves container
    const starsContainer = document.getElementById('ratingStars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingInput?.value || 0);
            highlightStars(currentRating);
        });
    }
}

function setStarRating(rating) {
    const stars = document.querySelectorAll('#ratingStars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('#ratingStars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = 'var(--accent)';
        } else {
            star.style.color = 'var(--text-muted)';
        }
    });
}

function resetStarRating() {
    const stars = document.querySelectorAll('#ratingStars .star');
    stars.forEach(star => {
        star.classList.remove('active');
        star.style.color = 'var(--text-muted)';
    });
    
    const ratingInput = document.getElementById('rating');
    if (ratingInput) {
        ratingInput.value = '';
    }
}

// Handle Testimonial Submission
function handleTestimonialSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const testimonialData = {
        clientName: formData.get('clientName'),
        clientRole: formData.get('clientRole'),
        projectType: formData.get('projectType'),
        projectName: formData.get('projectName'),
        rating: parseInt(formData.get('rating')),
        testimonialText: formData.get('testimonialText')
    };
    
    // Validation
    if (!testimonialData.clientName || !testimonialData.clientRole || 
        !testimonialData.projectType || !testimonialData.projectName ||
        !testimonialData.rating || !testimonialData.testimonialText) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (testimonialData.rating < 1 || testimonialData.rating > 5) {
        showNotification('Please select a rating', 'error');
        return;
    }
    
    try {
        // Add testimonial
        addTestimonial(testimonialData);
        
        showNotification('Thank you for your testimonial! It will be reviewed and published soon.', 'success');
        closeTestimonialModal();
        
        // Reload testimonials to show the new one (if auto-approved)
        loadTestimonials();
        
    } catch (error) {
        console.error('Error adding testimonial:', error);
        showNotification('There was an error submitting your testimonial. Please try again.', 'error');
    }
}

// Update Testimonial Stats
function updateTestimonialStats() {
    const totalTestimonials = document.getElementById('totalTestimonials');
    const averageRating = document.getElementById('averageRating');
    const satisfactionRate = document.getElementById('satisfactionRate');
    
    const testimonials = getTestimonials().filter(t => t.approved !== false);
    
    if (totalTestimonials) {
        totalTestimonials.textContent = testimonials.length;
    }
    
    if (averageRating && testimonials.length > 0) {
        const avg = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
        averageRating.textContent = avg.toFixed(1);
    }
    
    if (satisfactionRate && testimonials.length > 0) {
        const satisfied = testimonials.filter(t => t.rating >= 4).length;
        const rate = (satisfied / testimonials.length) * 100;
        satisfactionRate.textContent = Math.round(rate) + '%';
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTestimonialsPage);
} else {
    initializeTestimonialsPage();
}