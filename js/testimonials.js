// ==========================================
// TESTIMONIALS PAGE - Complete Production-Ready Implementation
// Author: Arsh Verma
// Version: 2.2.0
// Description: Handles all testimonials portfolio functionality for client feedback showcase
//              - Filters, sorting, card rendering, modal submission, and localStorage integration
//              - Error handling, accessibility, and performance optimized
//              - Inspired by websites.js: Modern card design with dark bg, ratings, project info
// Last Updated: November 12, 2025
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// Centralized state for testimonials data and UI interactions
// ==========================================
const TESTIMONIALS_STATE = {
    allTestimonials: [],        // Complete list of testimonials from data/localStorage
    filteredTestimonials: [],   // Currently displayed testimonials after filtering/sorting
    currentFilters: {           // Active filter and sort settings
        projectType: 'all',
        rating: '0',
        sort: 'newest'
    },
    isLoading: false,           // Loading state to prevent race conditions
    animationDelay: 100         // Staggered animation timing for card entrance
};

// ==========================================
// INITIALIZATION
// Entry point for testimonials page functionality
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('💬 Testimonials page initializing...');
    initializeTestimonialsPage();
});

/**
 * Main initialization function
 * - Orchestrates data loading, UI setup, and initial render
 * - Wrapped in try-catch for robust error handling
 */
function initializeTestimonialsPage() {
    try {
        TESTIMONIALS_STATE.isLoading = true;
        
        loadTestimonialsData();
        
        setupTestimonialFilters();
        setupTestimonialEventListeners();
        setupTestimonialModal();
        
        updateHeaderStats();
        
        setTimeout(() => {
            TESTIMONIALS_STATE.isLoading = false;
            applyTestimonialFilters();
            hideLoadingScreen();
        }, 800);
        
        console.log('✅ Testimonials page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing testimonials page:', error);
        showNotification('Failed to load testimonials. Please refresh the page.', 'error');
        TESTIMONIALS_STATE.isLoading = false;
        displayTestimonials([]);
        hideLoadingScreen();
    }
}

/**
 * Load testimonials data from data source or localStorage
 * - Prioritizes localStorage for user submissions, falls back to data.js or sample
 * - Handles missing data gracefully
 */
function loadTestimonialsData() {
    try {
        let testimonialsData = [];
        
        // Check localStorage first for user-submitted testimonials
        const stored = localStorage.getItem('portfolio_testimonials');
        if (stored) {
            testimonialsData = JSON.parse(stored);
            console.log('📦 Testimonials loaded from localStorage');
        } else if (typeof window.getTestimonials === 'function') {
            testimonialsData = window.getTestimonials();
            console.log('📦 Testimonials loaded from getTestimonials() function');
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && Array.isArray(PORTFOLIO_DATA.testimonials)) {
            testimonialsData = PORTFOLIO_DATA.testimonials.map(t => ({ ...t, approved: true }));
            console.log('📦 Testimonials loaded from PORTFOLIO_DATA');
        } else {
            console.warn('⚠️ No testimonials data found, using sample data for preview');
            testimonialsData = createSampleTestimonials();
        }
        
        TESTIMONIALS_STATE.allTestimonials = validateTestimonialsData(testimonialsData);
        TESTIMONIALS_STATE.filteredTestimonials = [...TESTIMONIALS_STATE.allTestimonials];
        
        console.log(`📦 Loaded ${TESTIMONIALS_STATE.allTestimonials.length} testimonials`);
    } catch (error) {
        console.error('❌ Error loading testimonials:', error);
        TESTIMONIALS_STATE.allTestimonials = [];
        TESTIMONIALS_STATE.filteredTestimonials = [];
        showNotification('Error loading testimonials data.', 'error');
    }
}

/**
 * Validate testimonials data structure
 * - Ensures each testimonial has required fields
 * - Sanitizes and defaults missing values, marks unapproved as false
 * @param {Array} testimonials - Raw testimonials data
 * @returns {Array} Validated testimonials array
 */
function validateTestimonialsData(testimonials) {
    if (!Array.isArray(testimonials)) return [];
    
    return testimonials.map(testimonial => ({
        id: testimonial.id || Date.now() + Math.random(),
        clientName: testimonial.clientName || 'Anonymous Client',
        clientRole: testimonial.clientRole || 'Collaborator',
        projectType: testimonial.projectType || 'Website',
        projectName: testimonial.projectName || 'Untitled Project',
        rating: testimonial.rating || 5,
        testimonialText: testimonial.testimonialText || testimonial.text || 'Great experience working together!',
        date: testimonial.date || new Date().toISOString(),
        approved: testimonial.approved !== undefined ? testimonial.approved : true,
        avatar: testimonial.avatar || generateAvatar(testimonial.clientName)
    })).filter(testimonial => testimonial.id && testimonial.approved !== false);
}

/**
 * Generate avatar URL using UI Avatars
 * @param {string} name - Client name for avatar
 * @returns {string} Avatar URL
 */
function generateAvatar(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E4572E&color=fff&size=80`;
}

/**
 * Display testimonials in the grid
 * - Handles loading, empty, and populated states
 * - Renders cards with client info, rating, text, project details
 * @param {Array} testimonials - Testimonials to display
 */
function displayTestimonials(testimonials) {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) {
        console.error('❌ Testimonials grid element not found');
        return;
    }
    
    if (TESTIMONIALS_STATE.isLoading) {
        testimonialsGrid.innerHTML = `
            <div class="loading-testimonials">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading client stories...</p>
            </div>
        `;
        return;
    }
    
    if (!testimonials || testimonials.length === 0) {
        testimonialsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-comment-dots"></i>
                <h3>No Testimonials Found</h3>
                <p>No testimonials match your current filters. Try adjusting them.</p>
                <button class="btn btn-primary" onclick="resetTestimonialFilters()" aria-label="Reset filters">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    testimonialsGrid.innerHTML = testimonials.map(testimonial => createTestimonialCard(testimonial)).join('');
    
    setupTestimonialCardListeners();
    animateTestimonialCards();
    
    console.log(`🎨 Displayed ${testimonials.length} testimonials`);
}

/**
 * Create HTML for a single testimonial card
 * - Dark bg, rounded, client avatar, rating stars, quote text, project footer
 * @param {Object} testimonial - Testimonial data object
 * @returns {string} HTML string for card
 */
function createTestimonialCard(testimonial) {
    const avatar = testimonial.avatar;
    const rating = testimonial.rating;
    const projectIcon = getProjectTypeIcon(testimonial.projectType);
    
    return `
        <article class="testimonial-card" 
                 data-testimonial-id="${testimonial.id}" 
                 data-project-type="${testimonial.projectType}" 
                 data-rating="${rating}"
                 role="article"
                 aria-labelledby="testimonial-title-${testimonial.id}">
            
            <div class="testimonial-header">
                <div class="testimonial-client">
                    <img src="${avatar}" 
                         alt="${escapeHtml(testimonial.clientName)} avatar"
                         class="client-avatar" 
                         loading="lazy"
                         onerror="this.src='${generateAvatar(testimonial.clientName)}'">
                    <div class="client-info">
                        <h3 class="client-name" id="testimonial-title-${testimonial.id}">${escapeHtml(testimonial.clientName)}</h3>
                        <p class="client-role">${escapeHtml(testimonial.clientRole)}</p>
                    </div>
                </div>
                <div class="testimonial-rating" aria-label="Rating: ${rating} out of 5">
                    ${generateStars(rating)}
                    <span class="rating-value">${rating}</span>
                </div>
            </div>
            
            <div class="testimonial-content">
                <div class="quote-icon">
                    <i class="fas fa-quote-left" aria-hidden="true"></i>
                </div>
                <p class="testimonial-text">${escapeHtml(testimonial.testimonialText)}</p>
            </div>
            
            <div class="testimonial-footer">
                <div class="project-info">
                    <i class="fas fa-${projectIcon}" aria-hidden="true"></i>
                    <span><strong>${escapeHtml(testimonial.projectName)}</strong> (${testimonial.projectType})</span>
                </div>
                <div class="testimonial-date" aria-label="Date: ${formatRelativeDate(testimonial.date)}">
                    <i class="far fa-calendar" aria-hidden="true"></i>
                    <span>${formatRelativeDate(testimonial.date)}</span>
                </div>
            </div>
            
            <!-- Developer Credit -->
            <div class="developer-credit-small">
                <span>Featured by <strong>Arsh Verma</strong></span>
            </div>
        </article>
    `;
}

/**
 * Get project type icon based on type
 * @param {string} projectType - Project type
 * @returns {string} Icon class
 */
function getProjectTypeIcon(projectType) {
    const icons = {
        'Website': 'laptop-code',
        'App': 'mobile-alt',
        'Game': 'gamepad',
        'Consultation': 'comments'
    };
    return icons[projectType] || 'star';
}

/**
 * Setup filter controls
 * - Dynamically populates project types, ratings from data
 * - Attaches change listeners for real-time filtering
 */
function setupTestimonialFilters() {
    const projectTypeFilter = document.getElementById('projectTypeFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!projectTypeFilter || !ratingFilter || !sortFilter) {
        console.warn('⚠️ Filter elements not found');
        return;
    }
    
    // Populate project types
    const projectTypes = [...new Set(TESTIMONIALS_STATE.allTestimonials.map(t => t.projectType).filter(Boolean))].sort();
    projectTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        projectTypeFilter.appendChild(option);
    });
    
    // Populate ratings (static 4+, 4.5+, 5)
    const ratingOptions = ['4', '4.5', '5'];
    ratingOptions.forEach(rating => {
        const option = document.createElement('option');
        option.value = rating;
        option.textContent = `${rating}+ Stars`;
        ratingFilter.appendChild(option);
    });
    
    // Attach listeners
    projectTypeFilter.addEventListener('change', handleFilterChange);
    ratingFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    
    function handleFilterChange() {
        TESTIMONIALS_STATE.currentFilters.projectType = projectTypeFilter.value;
        TESTIMONIALS_STATE.currentFilters.rating = ratingFilter.value;
        TESTIMONIALS_STATE.currentFilters.sort = sortFilter.value;
        applyTestimonialFilters();
        showNotification('Filters updated', 'info');
    }
    
    console.log('🔧 Testimonial filters setup complete');
}

/**
 * Apply all active filters and sort
 * - Chains project type/rating filters, then sorts
 * - Updates display immediately
 */
function applyTestimonialFilters() {
    let filtered = [...TESTIMONIALS_STATE.allTestimonials];
    
    // Apply project type filter
    if (TESTIMONIALS_STATE.currentFilters.projectType !== 'all') {
        filtered = filtered.filter(t => t.projectType === TESTIMONIALS_STATE.currentFilters.projectType);
    }
    
    // Apply rating filter
    if (TESTIMONIALS_STATE.currentFilters.rating !== '0') {
        const minRating = parseFloat(TESTIMONIALS_STATE.currentFilters.rating);
        filtered = filtered.filter(t => t.rating >= minRating);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        switch (TESTIMONIALS_STATE.currentFilters.sort) {
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
    displayTestimonials(filtered);
    
    console.log(`🔍 Applied filters: ${filtered.length} results`);
}

/**
 * Reset all filters to defaults
 * - Clears selections and reapplies
 * - Shows success notification
 */
function resetTestimonialFilters() {
    TESTIMONIALS_STATE.currentFilters = { projectType: 'all', rating: '0', sort: 'newest' };
    
    const projectTypeFilter = document.getElementById('projectTypeFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (projectTypeFilter) projectTypeFilter.value = 'all';
    if (ratingFilter) ratingFilter.value = '0';
    if (sortFilter) sortFilter.value = 'newest';
    
    applyTestimonialFilters();
    showNotification('Filters reset successfully', 'success');
    console.log('🔄 Filters reset');
}

/**
 * Setup global event listeners
 * - Keyboard shortcuts (e.g., 'R' for reset, 'N' for new testimonial)
 * - Scroll to top
 */
function setupTestimonialEventListeners() {
    setupKeyboardShortcuts();
    setupScrollToTop();
    
    console.log('👂 Event listeners setup complete');
}

/**
 * Setup keyboard shortcuts
 * - 'R': Reset filters, 'N': Open modal
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select, button')) return;
        
        switch(e.key) {
            case 'r':
            case 'R':
                e.preventDefault();
                resetTestimonialFilters();
                break;
            case 'n':
            case 'N':
                e.preventDefault();
                openTestimonialModal();
                break;
        }
    });
}

/**
 * Setup scroll to top functionality
 * - Shows button after 300px scroll
 */
function setupScrollToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Setup testimonial card interactions
 * - Hover effects, click to expand (if needed)
 */
function setupTestimonialCardListeners() {
    document.querySelectorAll('.testimonial-card').forEach(card => {
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
    
    console.log(`🖱️ Setup interactions for ${document.querySelectorAll('.testimonial-card').length} cards`);
}

/**
 * Setup modal functionality
 * - Open/close, form submission with validation and localStorage save
 */
function setupTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    const form = document.getElementById('testimonialForm');
    const openBtn = document.getElementById('addTestimonialBtn');
    const closeBtn = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelTestimonial');
    const ratingStars = document.getElementById('ratingStars');
    const projectTypeSelect = document.getElementById('projectType');
    
    if (!modal || !form || !openBtn || !closeBtn || !cancelBtn || !ratingStars || !projectTypeSelect) return;
    
    // Populate project types in modal
    const projectTypes = [...new Set(TESTIMONIALS_STATE.allTestimonials.map(t => t.projectType))].sort();
    projectTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        projectTypeSelect.appendChild(option);
    });
    
    // Rating stars interaction
    ratingStars.addEventListener('click', function(e) {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            setRating(rating);
        }
    });
    
    ratingStars.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const focused = document.activeElement;
            if (focused.classList.contains('star')) {
                const rating = parseInt(focused.dataset.rating);
                setRating(rating);
            }
        }
    });
    
    function setRating(rating) {
        Array.from(ratingStars.children).forEach((star, index) => {
            if (index < rating) {
                star.classList.add('selected');
                star.setAttribute('aria-checked', 'true');
            } else {
                star.classList.remove('selected');
                star.setAttribute('aria-checked', 'false');
            }
        });
        document.getElementById('rating').value = rating;
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitTestimonial();
    });
    
    // Open modal
    openBtn.addEventListener('click', openTestimonialModal);
    
    // Close modal
    closeBtn.addEventListener('click', closeTestimonialModal);
    cancelBtn.addEventListener('click', closeTestimonialModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeTestimonialModal();
    });
    
    // Close on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeTestimonialModal();
        }
    });
    
    console.log('🔧 Testimonial modal setup complete');
}

/**
 * Open testimonial modal
 */
function openTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.getElementById('clientName').focus();
    }
    console.log('📝 Testimonial modal opened');
}

/**
 * Close testimonial modal
 */
function closeTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.getElementById('testimonialForm').reset();
        setRating(0); // Reset stars
    }
    console.log('❌ Testimonial modal closed');
}

/**
 * Submit new testimonial
 * - Validates form, saves to localStorage, reloads data
 */
function submitTestimonial() {
    const form = document.getElementById('testimonialForm');
    const formData = new FormData(form);
    const testimonialData = Object.fromEntries(formData);
    
    // Validation
    if (!testimonialData.clientName || !testimonialData.clientRole || 
        !testimonialData.projectType || !testimonialData.projectName ||
        testimonialData.rating < 1 || testimonialData.testimonialText.length < 20) {
        showNotification('Please complete all fields with a detailed testimonial (20+ characters).', 'error');
        return;
    }
    
    try {
        // Get existing testimonials
        let testimonials = TESTIMONIALS_STATE.allTestimonials;
        const stored = localStorage.getItem('portfolio_testimonials');
        if (stored) {
            testimonials = JSON.parse(stored);
        }
        
        // Create new testimonial
        const newTestimonial = {
            id: Date.now(),
            ...testimonialData,
            date: new Date().toISOString(),
            approved: false, // Pending review
            avatar: generateAvatar(testimonialData.clientName)
        };
        
        // Add to beginning
        testimonials.unshift(newTestimonial);
        
        // Save to localStorage
        localStorage.setItem('portfolio_testimonials', JSON.stringify(testimonials));
        
        showNotification('Thank you! Your testimonial is submitted for review and will be published soon.', 'success');
        closeTestimonialModal();
        
        // Reload after delay
        setTimeout(() => {
            loadTestimonialsData();
            applyTestimonialFilters();
            updateHeaderStats();
        }, 500);
        
        console.log('✓ New testimonial submitted');
    } catch (error) {
        console.error('❌ Error submitting testimonial:', error);
        showNotification('Error submitting testimonial. Please try again.', 'error');
    }
}

/**
 * Update header statistics dynamically
 * - Calculates totals from loaded data
 * - Updates DOM elements safely
 */
function updateHeaderStats() {
    const allTestimonials = TESTIMONIALS_STATE.allTestimonials;
    if (allTestimonials.length === 0) return;
    
    const totalClients = allTestimonials.length;
    const averageRating = (allTestimonials.reduce((sum, t) => sum + t.rating, 0) / totalClients).toFixed(1);
    const satisfied = allTestimonials.filter(t => t.rating >= 4).length;
    const satisfactionRate = Math.round((satisfied / totalClients) * 100);
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalClients}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = `${satisfactionRate}%`;
    }
    
    console.log('📊 Header stats updated:', { totalClients, averageRating, satisfactionRate });
}

/**
 * Animate cards entrance with stagger
 * - Fade-in and slide-up for polished UX
 */
function animateTestimonialCards() {
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'none';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * TESTIMONIALS_STATE.animationDelay);
    });
}

/**
 * Hide loading screen with fade-out
 * - Ensures smooth transition to content
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// Reusable helpers for formatting, escaping, and notifications
// ==========================================

/**
 * Generate star rating HTML
 * - Full, half, and empty stars based on rating
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML for stars
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star"></i>';
    if (hasHalfStar) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) html += '<i class="far fa-star"></i>';
    return html;
}

/**
 * Format relative date
 * - Shows 'Today', 'Yesterday', 'X days ago', etc.
 * @param {string} dateString - ISO date string
 * @returns {string} Relative date string
 */
function formatRelativeDate(dateString) {
    if (!dateString) return 'Recently';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'month' : 'months'} ago`;
        return `${Math.floor(diffDays / 365)} ${Math.floor(diffDays / 365) === 1 ? 'year' : 'years'} ago`;
    } catch (error) {
        console.warn('Invalid date format:', dateString);
        return 'Recently';
    }
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Show notification (fallback to console if no global function)
 * - Integrates with utils.js showNotification if available
 * @param {string} message - Notification text
 * @param {string} type - Type: info, success, error
 */
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ==========================================
// SAMPLE DATA FALLBACK
// Production-ready sample testimonials for preview/demo mode
// Edit here to add/remove sample entries
// ==========================================
function createSampleTestimonials() {
    return [
        {
            id: 1,
            clientName: "Sarah Johnson",
            clientRole: "CEO, TechStart Inc.",
            projectType: "Website",
            projectName: "E-Commerce Platform",
            rating: 5,
            testimonialText: "Arsh delivered an outstanding e-commerce site that exceeded our expectations. Professional, timely, and innovative solutions throughout the project.",
            date: "2025-10-15",
            approved: true,
            avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=E4572E&color=fff&size=80"
        },
        {
            id: 2,
            clientName: "Mike Chen",
            clientRole: "Product Manager, HealthApp Co.",
            projectType: "App",
            projectName: "Fitness Tracker App",
            rating: 4.8,
            testimonialText: "Exceptional mobile app development with seamless integration. Arsh's attention to detail and user experience focus made all the difference.",
            date: "2025-09-20",
            approved: true,
            avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=E4572E&color=fff&size=80"
        },
        {
            id: 3,
            clientName: "Emily Rodriguez",
            clientRole: "Game Studio Lead, PixelGames",
            projectType: "Game",
            projectName: "Adventure Quest Game",
            rating: 4.9,
            testimonialText: "Creative and technically proficient – Arsh brought our game vision to life with stunning graphics and smooth gameplay mechanics.",
            date: "2025-08-10",
            approved: true,
            avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=E4572E&color=fff&size=80"
        },
        {
            id: 4,
            clientName: "David Kim",
            clientRole: "CTO, CloudSolutions Ltd.",
            projectType: "Consultation",
            projectName: "Cloud Migration Strategy",
            rating: 5,
            testimonialText: "Invaluable consulting expertise that streamlined our cloud transition. Arsh's strategic insights saved us time and resources.",
            date: "2025-07-05",
            approved: true,
            avatar: "https://ui-avatars.com/api/?name=David+Kim&background=E4572E&color=fff&size=80"
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// Make key functions available globally for HTML onclicks and utils integration
// ==========================================
window.initializeTestimonialsPage = initializeTestimonialsPage;
window.resetTestimonialFilters = resetTestimonialFilters;
window.openTestimonialModal = openTestimonialModal;
window.closeTestimonialModal = closeTestimonialModal;
window.submitTestimonial = submitTestimonial;
window.applyTestimonialFilters = applyTestimonialFilters;

console.log('✅ Testimonials.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔧 Version: 2.2.0 - Websites-Inspired Design Applied');