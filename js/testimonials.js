// ==========================================
// TESTIMONIALS PAGE - 100% WORKING VERSION
// Client testimonials functionality
// Handles filtering, sorting, and adding testimonials
// ==========================================

// Global Variables
let currentTestimonials = [];
let currentFilters = {
    projectType: 'all',
    rating: '0',
    sort: 'newest'
};
let selectedRating = 0;

// Initialize Testimonials Page
function initializeTestimonialsPage() {
    console.log('=== INITIALIZING TESTIMONIALS PAGE ===');
    loadTestimonials();
    setupTestimonialFilters();
    setupTestimonialEventListeners();
    setupTestimonialModal();
    updateHeaderStats();
}

// Load Testimonials - FIXED: Direct localStorage access
function loadTestimonials() {
    console.log('Loading testimonials...');
    
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) {
        console.error('Testimonials grid not found!');
        return;
    }
    
    // Get testimonials directly from localStorage
    let testimonials = [];
    
    try {
        const stored = localStorage.getItem('portfolio_testimonials');
        console.log('Raw testimonials data:', stored);
        
        if (stored) {
            testimonials = JSON.parse(stored);
        } else if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.testimonials) {
            // Fallback to PORTFOLIO_DATA
            testimonials = window.PORTFOLIO_DATA.testimonials.map(t => ({
                ...t,
                approved: true
            }));
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        // Try PORTFOLIO_DATA as fallback
        if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.testimonials) {
            testimonials = window.PORTFOLIO_DATA.testimonials.map(t => ({
                ...t,
                approved: true
            }));
        }
    }
    
    console.log('Loaded testimonials:', testimonials.length);
    currentTestimonials = testimonials;
    
    if (testimonials.length === 0) {
        console.warn('No testimonials found');
        testimonialsGrid.innerHTML = `
            <div class="no-games" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-comment-dots" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px; display: block;"></i>
                <h3 style="font-size: 24px; margin-bottom: 10px;">No testimonials yet</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">Be the first to share your experience!</p>
                <button onclick="openTestimonialModal()" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    <span>Add Testimonial</span>
                </button>
            </div>
        `;
        return;
    }
    
    displayTestimonials(testimonials);
}

// Display Testimonials - FIXED
function displayTestimonials(testimonials) {
    console.log('=== DISPLAYING TESTIMONIALS ===');
    console.log('Testimonials to display:', testimonials);
    
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) {
        console.error('Grid not found!');
        return;
    }
    
    // Filter approved testimonials only
    const approvedTestimonials = testimonials.filter(t => t.approved !== false);
    console.log('Approved testimonials:', approvedTestimonials.length);
    
    if (approvedTestimonials.length === 0) {
        testimonialsGrid.innerHTML = `
            <div class="no-games" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-filter" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px; display: block;"></i>
                <h3 style="font-size: 24px; margin-bottom: 10px;">No testimonials match your filters</h3>
                <button onclick="resetTestimonialFilters()" class="btn btn-primary">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    testimonialsGrid.innerHTML = approvedTestimonials.map(testimonial => {
        const avatar = testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=E4572E&color=fff&size=80`;
        const rating = testimonial.rating || 5;
        const projectType = testimonial.projectType || 'Website';
        const date = testimonial.date || new Date().toISOString();
        
        return `
        <div class="game-card testimonial-card" data-testimonial-id="${testimonial.id}">
            <div class="testimonial-header">
                <div class="testimonial-client">
                    <img src="${avatar}" alt="${testimonial.clientName}" 
                         class="client-avatar" loading="lazy"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=E4572E&color=fff&size=80'">
                    <div class="client-info">
                        <h4 class="client-name">${testimonial.clientName}</h4>
                        <p class="client-role">${testimonial.clientRole}</p>
                    </div>
                </div>
                <div class="testimonial-rating">
                    ${generateStars(rating)}
                    <span class="rating-value">${rating}</span>
                </div>
            </div>
            
            <div class="testimonial-content">
                <div class="quote-icon">
                    <i class="fas fa-quote-left"></i>
                </div>
                <p class="testimonial-text">${testimonial.testimonialText || testimonial.text || ''}</p>
            </div>
            
            <div class="testimonial-footer">
                <div class="project-info">
                    <i class="fas fa-${getProjectTypeIcon(projectType)}"></i>
                    <span><strong>${testimonial.projectName}</strong> (${projectType})</span>
                </div>
                <div class="testimonial-date">
                    <i class="far fa-calendar"></i>
                    <span>${formatRelativeDate(date)}</span>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    console.log('✓ Testimonials displayed');
    
    // Animate testimonial cards
    animateTestimonialCards();
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
            if (typeof showNotification === 'function') {
                showNotification(`Filtered by: ${this.options[this.selectedIndex].text}`, 'info');
            }
        });
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', function() {
            currentFilters.rating = this.value;
            applyTestimonialFilters();
            if (typeof showNotification === 'function') {
                showNotification(`Filtered by: ${this.options[this.selectedIndex].text}`, 'info');
            }
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyTestimonialFilters();
            if (typeof showNotification === 'function') {
                showNotification(`Sorted by: ${this.options[this.selectedIndex].text}`, 'info');
            }
        });
    }
}

// Apply Filters - FIXED
function applyTestimonialFilters() {
    console.log('Applying filters:', currentFilters);
    
    // Get testimonials from localStorage
    let testimonials = [];
    try {
        const stored = localStorage.getItem('portfolio_testimonials');
        if (stored) {
            testimonials = JSON.parse(stored);
        } else if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.testimonials) {
            testimonials = window.PORTFOLIO_DATA.testimonials.map(t => ({
                ...t,
                approved: true
            }));
        }
    } catch (error) {
        console.error('Error in applyTestimonialFilters:', error);
        return;
    }
    
    let filteredTestimonials = testimonials.filter(t => t.approved !== false);
    
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
            (testimonial.rating || 5) >= minRating
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
            return sortedTestimonials.sort((a, b) => 
                new Date(b.date || 0) - new Date(a.date || 0)
            );
        case 'oldest':
            return sortedTestimonials.sort((a, b) => 
                new Date(a.date || 0) - new Date(b.date || 0)
            );
        case 'rating':
            return sortedTestimonials.sort((a, b) => (b.rating || 5) - (a.rating || 5));
        case 'project':
            return sortedTestimonials.sort((a, b) => 
                (a.projectType || '').localeCompare(b.projectType || '')
            );
        default:
            return sortedTestimonials;
    }
}

// Reset Filters
function resetTestimonialFilters() {
    currentFilters = {
        projectType: 'all',
        rating: '0',
        sort: 'newest'
    };
    
    // Reset select elements
    const projectTypeFilter = document.getElementById('projectTypeFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (projectTypeFilter) projectTypeFilter.value = 'all';
    if (ratingFilter) ratingFilter.value = '0';
    if (sortFilter) sortFilter.value = 'newest';
    
    applyTestimonialFilters();
    
    if (typeof showNotification === 'function') {
        showNotification('Filters reset', 'success');
    }
}

// Setup Testimonial Event Listeners
function setupTestimonialEventListeners() {
    // Add testimonial button
    const addTestimonialBtn = document.getElementById('addTestimonialBtn');
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', openTestimonialModal);
    }
    
    // Search functionality (if search input exists)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounceSearch);
    }
}

// Debounced search
const debounceSearch = (function() {
    let timeout;
    return function(e) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                applyTestimonialFilters();
                return;
            }
            
            let testimonials = [];
            try {
                const stored = localStorage.getItem('portfolio_testimonials');
                if (stored) {
                    testimonials = JSON.parse(stored);
                } else if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.testimonials) {
                    testimonials = window.PORTFOLIO_DATA.testimonials;
                }
            } catch (error) {
                console.error('Error in search:', error);
                return;
            }
            
            const filteredTestimonials = testimonials
                .filter(t => t.approved !== false)
                .filter(testimonial => 
                    (testimonial.clientName || '').toLowerCase().includes(searchTerm) ||
                    (testimonial.clientRole || '').toLowerCase().includes(searchTerm) ||
                    (testimonial.projectName || '').toLowerCase().includes(searchTerm) ||
                    (testimonial.testimonialText || testimonial.text || '').toLowerCase().includes(searchTerm) ||
                    (testimonial.projectType || '').toLowerCase().includes(searchTerm)
                );
            
            displayTestimonials(filteredTestimonials);
        }, 300);
    };
})();

// Testimonial Modal
function setupTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelTestimonial');
    const form = document.getElementById('testimonialForm');
    
    if (!modal) return;
    
    // Close modal handlers
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
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
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
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closeTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
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
    
    if (!stars.length || !ratingInput) return;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectedRating = rating;
            setStarRating(rating);
            if (ratingInput) {
                ratingInput.value = rating;
            }
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });
    });
    
    // Reset stars when mouse leaves container
    const starsContainer = document.getElementById('ratingStars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            highlightStars(selectedRating);
        });
    }
}

function setStarRating(rating) {
    const stars = document.querySelectorAll('#ratingStars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.style.color = 'var(--accent-secondary)';
        } else {
            star.classList.remove('active');
            star.style.color = 'var(--text-muted)';
        }
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('#ratingStars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = 'var(--accent-secondary)';
            star.style.transform = 'scale(1.1)';
        } else {
            star.style.color = 'var(--text-muted)';
            star.style.transform = 'scale(1)';
        }
    });
}

function resetStarRating() {
    selectedRating = 0;
    const stars = document.querySelectorAll('#ratingStars .star');
    stars.forEach(star => {
        star.classList.remove('active');
        star.style.color = 'var(--text-muted)';
        star.style.transform = 'scale(1)';
    });
    
    const ratingInput = document.getElementById('rating');
    if (ratingInput) {
        ratingInput.value = '';
    }
}

// Handle Testimonial Submission - FIXED
function handleTestimonialSubmit(e) {
    e.preventDefault();
    
    console.log('=== SUBMITTING TESTIMONIAL ===');
    
    const formData = new FormData(e.target);
    const testimonialData = {
        clientName: formData.get('clientName').trim(),
        clientRole: formData.get('clientRole').trim(),
        projectType: formData.get('projectType'),
        projectName: formData.get('projectName').trim(),
        rating: parseInt(formData.get('rating')),
        testimonialText: formData.get('testimonialText').trim()
    };
    
    console.log('Testimonial data:', testimonialData);
    
    // Validation
    if (!testimonialData.clientName || !testimonialData.clientRole || 
        !testimonialData.projectType || !testimonialData.projectName ||
        !testimonialData.rating || !testimonialData.testimonialText) {
        if (typeof showNotification === 'function') {
            showNotification('Please fill in all fields', 'error');
        } else {
            alert('Please fill in all fields');
        }
        return;
    }
    
    if (testimonialData.rating < 1 || testimonialData.rating > 5) {
        if (typeof showNotification === 'function') {
            showNotification('Please select a rating from 1 to 5 stars', 'error');
        } else {
            alert('Please select a rating from 1 to 5 stars');
        }
        return;
    }
    
    if (testimonialData.testimonialText.length < 20) {
        if (typeof showNotification === 'function') {
            showNotification('Please write a more detailed testimonial (at least 20 characters)', 'warning');
        } else {
            alert('Please write a more detailed testimonial (at least 20 characters)');
        }
        return;
    }
    
    try {
        // Get existing testimonials
        let testimonials = [];
        const stored = localStorage.getItem('portfolio_testimonials');
        if (stored) {
            testimonials = JSON.parse(stored);
        }
        
        // Create new testimonial
        const newTestimonial = {
            id: Date.now(),
            ...testimonialData,
            date: new Date().toISOString(),
            approved: false,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonialData.clientName)}&background=E4572E&color=fff&size=80`
        };
        
        console.log('New testimonial:', newTestimonial);
        
        // Add to beginning
        testimonials.unshift(newTestimonial);
        
        // Save to localStorage
        localStorage.setItem('portfolio_testimonials', JSON.stringify(testimonials));
        
        console.log('✓ Testimonial saved');
        
        if (typeof showNotification === 'function') {
            showNotification('Thank you for your testimonial! It will be reviewed and published soon.', 'success');
        } else {
            alert('Thank you for your testimonial! It will be reviewed and published soon.');
        }
        
        closeTestimonialModal();
        
        // Reload testimonials after a short delay
        setTimeout(() => {
            loadTestimonials();
            updateHeaderStats();
        }, 500);
        
    } catch (error) {
        console.error('Error adding testimonial:', error);
        if (typeof showNotification === 'function') {
            showNotification('There was an error submitting your testimonial. Please try again.', 'error');
        } else {
            alert('There was an error submitting your testimonial. Please try again.');
        }
    }
}

// Update Header Stats - FIXED
function updateHeaderStats() {
    let testimonials = [];
    
    try {
        const stored = localStorage.getItem('portfolio_testimonials');
        if (stored) {
            testimonials = JSON.parse(stored);
        } else if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.testimonials) {
            testimonials = window.PORTFOLIO_DATA.testimonials;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
        return;
    }
    
    const allTestimonials = testimonials.filter(t => t.approved !== false);
    
    // Calculate stats
    const totalClients = allTestimonials.length;
    const averageRating = totalClients > 0 
        ? (allTestimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / totalClients).toFixed(1)
        : '0.0';
    const satisfied = allTestimonials.filter(t => (t.rating || 5) >= 4).length;
    const satisfactionRate = totalClients > 0 
        ? Math.round((satisfied / totalClients) * 100)
        : 0;
    
    // Update stat numbers
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = `${totalClients}+`;
        statNumbers[1].textContent = averageRating;
        statNumbers[2].textContent = `${satisfactionRate}%`;
    }
}

// Animate Testimonial Cards
function animateTestimonialCards() {
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });
}

// Utility: Generate Stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Utility: Format Relative Date
function formatRelativeDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        }
    } catch (error) {
        return 'Recently';
    }
}

// Make functions globally available
window.initializeTestimonialsPage = initializeTestimonialsPage;
window.resetTestimonialFilters = resetTestimonialFilters;
window.openTestimonialModal = openTestimonialModal;
window.closeTestimonialModal = closeTestimonialModal;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeTestimonialsPage, 100);
    });
} else {
    setTimeout(initializeTestimonialsPage, 100);
}

console.log('✓ Testimonials.js loaded successfully');