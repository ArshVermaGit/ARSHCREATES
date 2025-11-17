// ==========================================
// TESTIMONIALS MANAGEMENT SYSTEM
// Complete functionality for testimonials page
// ==========================================

// Global state
const TESTIMONIALS_STATE = {
    testimonials: [],
    filteredTestimonials: [],
    filters: {
        projectType: 'all',
        minRating: 0,
        sortBy: 'newest'
    },
    currentModal: null
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing testimonials page...');
    initializeTestimonialsPage();
});

function initializeTestimonialsPage() {
    // Load testimonials data
    loadTestimonials();
    
    // Setup event listeners
    setupTestimonialsEventListeners();
    
    // Update statistics
    updateTestimonialsStats();
    
    console.log('✅ Testimonials page initialized');
}

// ==========================================
// DATA MANAGEMENT
// ==========================================

function loadTestimonials() {
    console.log('📖 Loading testimonials...');
    
    try {
        // Show loading state
        showLoadingState();
        
        // Get approved testimonials from localStorage
        const storedTestimonials = localStorage.getItem('portfolio_testimonials');
        
        if (storedTestimonials) {
            const allTestimonials = JSON.parse(storedTestimonials);
            // Filter only approved testimonials
            TESTIMONIALS_STATE.testimonials = allTestimonials.filter(t => t.approved === true);
            console.log(`✅ Loaded ${TESTIMONIALS_STATE.testimonials.length} approved testimonials`);
        } else {
            // If no testimonials in storage, use sample data
            TESTIMONIALS_STATE.testimonials = getSampleTestimonials();
            console.log('📝 Using sample testimonials data');
        }
        
        // Apply current filters
        applyFilters();
        
        // Display testimonials
        displayTestimonials();
        
    } catch (error) {
        console.error('❌ Error loading testimonials:', error);
        showNotification('Error loading testimonials', 'error');
        TESTIMONIALS_STATE.testimonials = getSampleTestimonials();
        applyFilters();
        displayTestimonials();
    }
}

function getSampleTestimonials() {
    return [
        {
            id: 1,
            clientName: "Sarah Johnson",
            clientRole: "Product Manager at TechInnovate",
            projectType: "website",
            projectName: "E-Commerce Platform",
            rating: 5,
            testimonialText: "Arsh delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise transformed our online presence. The website performance improved by 60% and conversion rates increased significantly.",
            date: "2024-10-15",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=E4572E&color=fff",
            approved: true
        },
        {
            id: 2,
            clientName: "Mike Chen",
            clientRole: "CEO at GameStudio Pro",
            projectType: "game",
            projectName: "Mobile Adventure Game",
            rating: 5,
            testimonialText: "Working with Arsh on our mobile game was a fantastic experience. His Unity expertise and creative problem-solving helped us launch 2 weeks ahead of schedule. The game has received overwhelmingly positive reviews!",
            date: "2024-09-22",
            avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=E4572E&color=fff",
            approved: true
        },
        {
            id: 3,
            clientName: "Emily Rodriguez",
            clientRole: "Startup Founder",
            projectType: "app",
            projectName: "Fitness Tracking App",
            rating: 4.5,
            testimonialText: "Arsh's development skills brought our fitness app vision to life. He was responsive, professional, and delivered high-quality code. The app has been featured in the App Store and we're seeing great user engagement.",
            date: "2024-08-30",
            avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=E4572E&color=fff",
            approved: true
        }
    ];
}

function saveTestimonial(testimonial) {
    try {
        // Get existing testimonials
        const existingTestimonials = JSON.parse(localStorage.getItem('portfolio_testimonials') || '[]');
        
        // Add new testimonial (unapproved by default)
        const newTestimonial = {
            ...testimonial,
            id: Date.now(),
            date: new Date().toISOString(),
            approved: false // Needs admin approval
        };
        
        existingTestimonials.unshift(newTestimonial);
        
        // Save back to localStorage
        localStorage.setItem('portfolio_testimonials', JSON.stringify(existingTestimonials));
        
        console.log('✅ Testimonial saved for admin approval');
        return true;
        
    } catch (error) {
        console.error('❌ Error saving testimonial:', error);
        return false;
    }
}

// ==========================================
// DISPLAY FUNCTIONS
// ==========================================

function displayTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    const loading = document.getElementById('loadingTestimonials');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;
    
    // Hide loading state
    if (loading) loading.style.display = 'none';
    
    if (TESTIMONIALS_STATE.filteredTestimonials.length === 0) {
        // Show no results state
        if (noResults) noResults.style.display = 'flex';
        grid.innerHTML = '';
        return;
    }
    
    // Hide no results state
    if (noResults) noResults.style.display = 'none';
    
    // Generate testimonial cards
    grid.innerHTML = TESTIMONIALS_STATE.filteredTestimonials.map(testimonial => `
        <div class="testimonial-card" data-testimonial-id="${testimonial.id}">
            <div class="testimonial-header">
                <div class="testimonial-client">
                    <img src="${testimonial.avatar}" 
                         alt="${testimonial.clientName}" 
                         class="client-avatar"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=E4572E&color=fff'">
                    <div class="client-info">
                        <h3 class="client-name">${escapeHtml(testimonial.clientName)}</h3>
                        <p class="client-role">${escapeHtml(testimonial.clientRole)}</p>
                    </div>
                </div>
                <div class="testimonial-rating">
                    <div class="rating-stars">
                        ${generateStarsHTML(testimonial.rating)}
                    </div>
                    <div class="rating-value">${testimonial.rating}/5</div>
                </div>
            </div>
            
            <div class="testimonial-content">
                <div class="quote-icon">
                    <i class="fas fa-quote-left"></i>
                </div>
                <p class="testimonial-text">"${escapeHtml(testimonial.testimonialText)}"</p>
            </div>
            
            <div class="testimonial-footer">
                <div class="project-info">
                    <i class="fas fa-${getProjectIcon(testimonial.projectType)}"></i>
                    <span>${getProjectTypeLabel(testimonial.projectType)}</span>
                </div>
                <div class="testimonial-date">
                    <i class="fas fa-calendar"></i>
                    <span>${formatTestimonialDate(testimonial.date)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function getProjectIcon(projectType) {
    const icons = {
        'game': 'gamepad',
        'website': 'laptop-code',
        'app': 'mobile-alt',
        'consultation': 'comments',
        'other': 'star'
    };
    return icons[projectType] || 'star';
}

function getProjectTypeLabel(projectType) {
    const labels = {
        'game': 'Game Development',
        'website': 'Web Development',
        'app': 'Mobile App',
        'consultation': 'Consultation',
        'other': 'Other Project'
    };
    return labels[projectType] || 'Project';
}

function formatTestimonialDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// ==========================================
// FILTERING & SORTING
// ==========================================

function applyFilters() {
    let filtered = [...TESTIMONIALS_STATE.testimonials];
    
    // Apply project type filter
    if (TESTIMONIALS_STATE.filters.projectType !== 'all') {
        filtered = filtered.filter(t => t.projectType === TESTIMONIALS_STATE.filters.projectType);
    }
    
    // Apply rating filter
    if (TESTIMONIALS_STATE.filters.minRating > 0) {
        filtered = filtered.filter(t => t.rating >= TESTIMONIALS_STATE.filters.minRating);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        switch (TESTIMONIALS_STATE.filters.sortBy) {
            case 'newest':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'rating':
                return b.rating - a.rating;
            case 'project':
                return a.projectType.localeCompare(b.projectType);
            default:
                return 0;
        }
    });
    
    TESTIMONIALS_STATE.filteredTestimonials = filtered;
}

function updateFilters() {
    const projectTypeFilter = document.getElementById('projectTypeFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (projectTypeFilter) {
        TESTIMONIALS_STATE.filters.projectType = projectTypeFilter.value;
    }
    
    if (ratingFilter) {
        TESTIMONIALS_STATE.filters.minRating = parseFloat(ratingFilter.value);
    }
    
    if (sortFilter) {
        TESTIMONIALS_STATE.filters.sortBy = sortFilter.value;
    }
    
    applyFilters();
    displayTestimonials();
}

function resetFilters() {
    const projectTypeFilter = document.getElementById('projectTypeFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (projectTypeFilter) projectTypeFilter.value = 'all';
    if (ratingFilter) ratingFilter.value = '0';
    if (sortFilter) sortFilter.value = 'newest';
    
    TESTIMONIALS_STATE.filters = {
        projectType: 'all',
        minRating: 0,
        sortBy: 'newest'
    };
    
    applyFilters();
    displayTestimonials();
    
    showNotification('Filters reset successfully', 'success');
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupTestimonialsEventListeners() {
    console.log('🎯 Setting up testimonials event listeners...');
    
    // Filter event listeners
    setupFilterListeners();
    
    // Add testimonial button
    setupAddTestimonialButton();
    
    // Modal event listeners
    setupModalListeners();
    
    // Form submission
    setupFormSubmission();
    
    // Character count for testimonial text
    setupCharacterCount();
    
    console.log('✅ Testimonials event listeners setup complete');
}

function setupFilterListeners() {
    const projectTypeFilter = document.getElementById('projectTypeFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const resetFiltersNoResults = document.getElementById('resetFiltersNoResults');
    
    if (projectTypeFilter) {
        projectTypeFilter.addEventListener('change', updateFilters);
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', updateFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', updateFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    if (resetFiltersNoResults) {
        resetFiltersNoResults.addEventListener('click', resetFilters);
    }
}

function setupAddTestimonialButton() {
    const addTestimonialBtn = document.getElementById('addTestimonialBtn');
    
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', openTestimonialModal);
    }
}

function setupModalListeners() {
    const modal = document.getElementById('testimonialModal');
    const modalClose = document.getElementById('modalClose');
    const cancelTestimonial = document.getElementById('cancelTestimonial');
    
    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTestimonialModal();
            }
        });
    }
    
    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeTestimonialModal);
    }
    
    // Close modal on cancel button click
    if (cancelTestimonial) {
        cancelTestimonial.addEventListener('click', closeTestimonialModal);
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && TESTIMONIALS_STATE.currentModal === 'testimonial') {
            closeTestimonialModal();
        }
    });
}

function setupFormSubmission() {
    const form = document.getElementById('testimonialForm');
    
    if (form) {
        form.addEventListener('submit', handleTestimonialSubmit);
    }
}

function setupCharacterCount() {
    const testimonialText = document.getElementById('testimonialText');
    const charCount = document.getElementById('charCount');
    
    if (testimonialText && charCount) {
        testimonialText.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 500) {
                charCount.style.color = 'var(--error-color, #dc3545)';
            } else if (count > 400) {
                charCount.style.color = 'var(--warning-color, #ffc107)';
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });
    }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================

function openTestimonialModal() {
    console.log('📝 Opening testimonial modal...');
    
    const modal = document.getElementById('testimonialModal');
    const form = document.getElementById('testimonialForm');
    
    if (modal && form) {
        TESTIMONIALS_STATE.currentModal = 'testimonial';
        modal.classList.add('active');
        
        // Reset form
        form.reset();
        document.getElementById('charCount').textContent = '0';
        resetStarRating();
        
        // Set focus to first input
        const firstInput = form.querySelector('input, textarea, select');
        if (firstInput) firstInput.focus();
    }
}

function closeTestimonialModal() {
    console.log('📝 Closing testimonial modal...');
    
    const modal = document.getElementById('testimonialModal');
    
    if (modal) {
        modal.classList.remove('active');
        TESTIMONIALS_STATE.currentModal = null;
        
        // Reset form after animation
        setTimeout(() => {
            const form = document.getElementById('testimonialForm');
            if (form) form.reset();
            resetStarRating();
        }, 300);
    }
}

// ==========================================
// STAR RATING SYSTEM
// ==========================================

function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    const ratingText = document.getElementById('ratingText');
    
    const ratingTexts = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setStarRating(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
            ratingText.textContent = ratingTexts[rating] || 'Select your rating';
        });
    });
    
    // Reset stars when mouse leaves the container
    const starsContainer = document.getElementById('ratingStars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingInput.value) || 0;
            if (currentRating > 0) {
                highlightStars(currentRating);
                ratingText.textContent = ratingTexts[currentRating] || 'Select your rating';
            } else {
                resetStarRating();
            }
        });
    }
}

function setStarRating(rating) {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    const ratingText = document.getElementById('ratingText');
    
    const ratingTexts = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    
    // Update stars appearance
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
    
    // Update hidden input
    ratingInput.value = rating;
    
    // Update rating text
    ratingText.textContent = ratingTexts[rating] || 'Select your rating';
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

function resetStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    const ratingText = document.getElementById('ratingText');
    
    stars.forEach(star => {
        star.classList.remove('selected');
    });
    
    ratingInput.value = '';
    ratingText.textContent = 'Select your rating';
}

// ==========================================
// FORM HANDLING
// ==========================================

async function handleTestimonialSubmit(e) {
    e.preventDefault();
    console.log('📨 Processing testimonial submission...');
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateTestimonialForm(formData)) {
        return;
    }
    
    // Create testimonial object
    const testimonial = {
        clientName: formData.get('clientName').trim(),
        clientRole: formData.get('clientRole').trim(),
        projectType: formData.get('projectType'),
        projectName: formData.get('projectName').trim(),
        rating: parseFloat(formData.get('rating')),
        testimonialText: formData.get('testimonialText').trim(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.get('clientName').trim())}&background=E4572E&color=fff`
    };
    
    try {
        // Save testimonial (will be unapproved by default)
        const success = saveTestimonial(testimonial);
        
        if (success) {
            // Show success message
            showNotification('Thank you! Your testimonial has been submitted for review.', 'success');
            
            // Close modal
            closeTestimonialModal();
            
            // Reset form
            form.reset();
            
            console.log('✅ Testimonial submitted successfully');
        } else {
            throw new Error('Failed to save testimonial');
        }
        
    } catch (error) {
        console.error('❌ Error submitting testimonial:', error);
        showNotification('Failed to submit testimonial. Please try again.', 'error');
    }
}

function validateTestimonialForm(formData) {
    const clientName = formData.get('clientName');
    const clientRole = formData.get('clientRole');
    const projectType = formData.get('projectType');
    const projectName = formData.get('projectName');
    const rating = formData.get('rating');
    const testimonialText = formData.get('testimonialText');
    
    // Validate required fields
    if (!clientName || clientName.trim().length < 2) {
        showNotification('Please enter your full name (minimum 2 characters)', 'error');
        return false;
    }
    
    if (!clientRole || clientRole.trim().length < 2) {
        showNotification('Please enter your role or company name', 'error');
        return false;
    }
    
    if (!projectType) {
        showNotification('Please select a project type', 'error');
        return false;
    }
    
    if (!projectName || projectName.trim().length < 2) {
        showNotification('Please enter the project name', 'error');
        return false;
    }
    
    if (!rating) {
        showNotification('Please select a rating', 'error');
        return false;
    }
    
    if (!testimonialText || testimonialText.trim().length < 10) {
        showNotification('Please write a testimonial (minimum 10 characters)', 'error');
        return false;
    }
    
    if (testimonialText.length > 500) {
        showNotification('Testimonial must be 500 characters or less', 'error');
        return false;
    }
    
    return true;
}

// ==========================================
// STATISTICS & UTILITIES
// ==========================================

function updateTestimonialsStats() {
    const totalClients = document.getElementById('totalClients');
    const averageRating = document.getElementById('averageRating');
    const satisfactionRate = document.getElementById('satisfactionRate');
    
    if (totalClients) {
        totalClients.textContent = `${TESTIMONIALS_STATE.testimonials.length}+`;
    }
    
    if (averageRating && TESTIMONIALS_STATE.testimonials.length > 0) {
        const avg = TESTIMONIALS_STATE.testimonials.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS_STATE.testimonials.length;
        averageRating.textContent = avg.toFixed(1);
    }
    
    if (satisfactionRate) {
        // Calculate satisfaction rate (percentage of 4+ star ratings)
        const satisfied = TESTIMONIALS_STATE.testimonials.filter(t => t.rating >= 4).length;
        const rate = TESTIMONIALS_STATE.testimonials.length > 0 ? 
            Math.round((satisfied / TESTIMONIALS_STATE.testimonials.length) * 100) : 98;
        satisfactionRate.textContent = `${rate}%`;
    }
}

function showLoadingState() {
    const grid = document.getElementById('testimonialsGrid');
    const loading = document.getElementById('loadingTestimonials');
    const noResults = document.getElementById('noResults');
    
    if (grid) grid.innerHTML = '';
    if (loading) loading.style.display = 'flex';
    if (noResults) noResults.style.display = 'none';
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==========================================
// INITIALIZATION AFTER DOM LOAD
// ==========================================

// Initialize star rating system after DOM is fully loaded
window.addEventListener('load', function() {
    setupStarRating();
});

// ==========================================
// GLOBAL EXPORTS
// ==========================================

// Make functions available globally
window.openTestimonialModal = openTestimonialModal;
window.closeTestimonialModal = closeTestimonialModal;
window.resetFilters = resetFilters;

console.log('✅ Testimonials.js module loaded successfully');