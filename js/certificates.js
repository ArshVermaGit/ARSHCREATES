// ==========================================
// CERTIFICATES PORTFOLIO - Complete Production-Ready Implementation
// Author: Arsh Verma
// Version: 2.2.0
// Description: Handles all certificates portfolio functionality for preview showcase
//              - Filters, searching, card rendering, and navigation to details
//              - Error handling, accessibility, and performance optimized
//              - Inspired by websites.js: Modern card design with dark bg, badges, skills preview
// Last Updated: November 12, 2024
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// Centralized state for certificates data and UI interactions
// ==========================================
const CERTIFICATES_STATE = {
    allCertificates: [],        // Complete list of certificates from data source
    filteredCertificates: [],   // Currently displayed certificates after filtering/sorting/search
    currentFilters: {           // Active filter settings
        category: 'all',
        issuer: 'all',
        year: 'all'
    },
    searchTerm: '',             // Current search query
    isLoading: false,           // Loading state to prevent race conditions
    animationDelay: 100         // Staggered animation timing for card entrance
};

// ==========================================
// INITIALIZATION
// Entry point for certificates page functionality
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏆 Certificates page initializing...');
    initializeCertificatesPage();
});

/**
 * Main initialization function
 * - Orchestrates data loading, UI setup, and initial render
 * - Wrapped in try-catch for robust error handling
 */
function initializeCertificatesPage() {
    try {
        initializeTheme();
        CERTIFICATES_STATE.isLoading = true;
        
        loadCertificatesData();
        setupCertificateFilters();
        setupCertificateEventListeners();
        updateHeaderStats();
        
        setTimeout(() => {
            CERTIFICATES_STATE.isLoading = false;
            applyCertificateFilters(); // Initial display
            hideLoadingScreen();
        }, 800);
        
        console.log('✅ Certificates page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing certificates page:', error);
        showNotification('Failed to load certificates. Please refresh the page.', 'error');
        CERTIFICATES_STATE.isLoading = false;
        displayCertificates([]);
        hideLoadingScreen();
    }
}

/**
 * Load certificates data from data source
 * - Prioritizes global functions/data, falls back to sample
 * - Handles missing data gracefully
 */
function loadCertificatesData() {
    try {
        let certificatesData = [];
        
        if (typeof window.getCertificates === 'function') {
            certificatesData = window.getCertificates();
            console.log('📦 Certificates loaded from getCertificates() function');
        } else if (typeof PORTFOLIO_DATA !== 'undefined' && Array.isArray(PORTFOLIO_DATA.certificates)) {
            certificatesData = PORTFOLIO_DATA.certificates;
            console.log('📦 Certificates loaded from PORTFOLIO_DATA');
        } else {
            console.warn('⚠️ No certificates data found, using sample data for preview');
            certificatesData = createSampleCertificates();
        }
        
        CERTIFICATES_STATE.allCertificates = validateCertificatesData(certificatesData);
        CERTIFICATES_STATE.filteredCertificates = [...CERTIFICATES_STATE.allCertificates];
        
        console.log(`📦 Loaded ${CERTIFICATES_STATE.allCertificates.length} certificates`);
    } catch (error) {
        console.error('❌ Error loading certificates:', error);
        CERTIFICATES_STATE.allCertificates = [];
        CERTIFICATES_STATE.filteredCertificates = [];
        showNotification('Error loading certificates data.', 'error');
    }
}

/**
 * Validate certificates data structure
 * - Ensures each certificate has required fields
 * - Sanitizes and defaults missing values
 * @param {Array} certificates - Raw certificates data
 * @returns {Array} Validated certificates array
 */
function validateCertificatesData(certificates) {
    if (!Array.isArray(certificates)) return [];
    
    return certificates.map(cert => ({
        id: cert.id || Date.now() + Math.random(),
        title: cert.title || 'Untitled Certificate',
        category: cert.category || 'Uncategorized',
        issuer: cert.issuer || 'Unknown',
        year: cert.year || new Date().getFullYear(),
        date: cert.date || new Date().toISOString(),
        description: cert.description || 'Certificate details coming soon.',
        image: cert.image || generatePlaceholderImage(cert.title),
        skills: Array.isArray(cert.skills) ? cert.skills.slice(0, 5) : [],
        credentialUrl: cert.credentialUrl || null,
        credentialId: cert.credentialId || null,
        validity: cert.validity || 'Lifetime',
        technologies: cert.technologies || [],
        additionalImages: cert.additionalImages || [],
        details: cert.details || cert.description || 'Additional details not available.',
        difficulty: cert.difficulty || 'Intermediate',
        duration: cert.duration || '3 Months',
        recognition: cert.recognition || 'Global'
    })).filter(cert => cert.id);
}

/**
 * Generate placeholder image URL
 * - Uses via.placeholder.com for production-ready fallbacks
 * @param {string} title - Certificate title for text overlay
 * @returns {string} Image URL
 */
function generatePlaceholderImage(title) {
    const encodedTitle = encodeURIComponent(title.substring(0, 20));
    return `https://via.placeholder.com/400x250/E4572E/FFFFFF?text=${encodedTitle}`;
}

/**
 * Display certificates in the grid
 * - Handles loading, empty, and populated states
 * - Renders cards with preview focus (limited details)
 * @param {Array} certificates - Certificates to display
 */
function displayCertificates(certificates) {
    const certificatesGrid = document.getElementById('certificatesGrid');
    if (!certificatesGrid) {
        console.error('❌ Certificates grid element not found');
        return;
    }
    
    if (CERTIFICATES_STATE.isLoading) {
        certificatesGrid.innerHTML = `
            <div class="loading-certificates">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading certifications...</p>
            </div>
        `;
        return;
    }
    
    if (!certificates || certificates.length === 0) {
        certificatesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-certificate"></i>
                <h3>No Certificates Found</h3>
                <p>No certificates match your current filters. Try adjusting them.</p>
                <button class="btn btn-primary" onclick="resetCertificateFilters()" aria-label="Reset filters">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        updateResultsCount(0);
        return;
    }
    
    certificatesGrid.innerHTML = certificates.map(cert => createCertificateCard(cert)).join('');
    
    setupCertificateCardListeners();
    animateCertificateCards();
    updateResultsCount(certificates.length);
    
    console.log(`🎨 Displayed ${certificates.length} certificates`);
}

/**
 * Create HTML for a single certificate card (preview only)
 * - Dark bg, rounded, category badge top-left, issuer badge top-right, meta, desc, skills list, buttons
 * - Links to certificate-detail.html for full info
 * @param {Object} certificate - Certificate data object
 * @returns {string} HTML string for card
 */
function createCertificateCard(certificate) {
    const categoryClass = certificate.category.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = certificate.image;
    const shortDescription = truncateText(certificate.description, 120);
    
    const issuerIcon = getIssuerIcon(certificate.issuer);
    
    return `
        <article class="certificate-card" 
                 data-certificate-id="${certificate.id}" 
                 data-category="${certificate.category}" 
                 data-issuer="${certificate.issuer}" 
                 data-year="${certificate.year}"
                 role="article"
                 aria-labelledby="certificate-title-${certificate.id}">
            
            <div class="certificate-image">
                <img src="${imageUrl}" 
                     alt="${escapeHtml(certificate.title)} certificate preview"
                     loading="lazy"
                     onerror="this.src='${generatePlaceholderImage(certificate.title)}'">
                
                <!-- Category Badge -->
                <div class="certificate-badge category-${categoryClass}" aria-label="Category: ${certificate.category}">${certificate.category}</div>
                
                <!-- Issuer Badge -->
                <div class="issuer-badge">
                    ${issuerIcon}
                    <span>${truncateText(certificate.issuer, 15)}</span>
                </div>
                
                <!-- Overlay with action buttons -->
                <div class="certificate-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-view-details" data-certificate-id="${certificate.id}">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${certificate.credentialUrl ? `
                            <a href="${certificate.credentialUrl}" 
                               class="btn" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               onclick="event.stopPropagation()">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Verify Online</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="certificate-content">
                <header class="certificate-header">
                    <h3 class="certificate-title" id="certificate-title-${certificate.id}">${escapeHtml(certificate.title)}</h3>
                </header>
                
                <div class="certificate-meta">
                    <span class="certificate-issuer" aria-label="Issuer: ${certificate.issuer}">
                        <i class="fas fa-university" aria-hidden="true"></i>
                        ${truncateText(certificate.issuer, 20)}
                    </span>
                    <span class="certificate-date" aria-label="Issued: ${formatDate(certificate.date)}">
                        <i class="fas fa-calendar" aria-hidden="true"></i>
                        ${formatDate(certificate.date)}
                    </span>
                </div>
                
                <p class="certificate-description">${shortDescription}</p>
                
                ${certificate.skills && certificate.skills.length > 0 ? `
                    <div class="certificate-skills" aria-label="Key skills learned">
                        ${certificate.skills.slice(0, 4).map(skill => `
                            <div class="skill-item">
                                <i class="fas fa-check" aria-hidden="true"></i>
                                <span>${escapeHtml(skill)}</span>
                            </div>
                        `).join('')}
                        ${certificate.skills.length > 4 ? `<div class="skill-item more">+${certificate.skills.length - 4} more</div>` : ''}
                    </div>
                ` : ''}
                
                <div class="certificate-actions">
                    <button class="btn btn-primary btn-view-details" 
                            data-certificate-id="${certificate.id}"
                            aria-label="View details for ${escapeHtml(certificate.title)}">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                        <span>View Details</span>
                    </button>
                    ${certificate.credentialUrl ? `
                        <a href="${certificate.credentialUrl}" 
                           class="btn btn-secondary btn-verify-cert"
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label="Verify ${escapeHtml(certificate.title)}">
                            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                            <span>Verify</span>
                        </a>
                    ` : ''}
                </div>
                
                <!-- Developer Credit -->
                <div class="developer-credit-small">
                    <span>Certified by <strong>Arsh Verma</strong></span>
                </div>
            </div>
        </article>
    `;
}

/**
 * Get issuer icon based on issuer name
 * @param {string} issuer - Issuer name
 * @returns {string} Icon HTML
 */
function getIssuerIcon(issuer) {
    if (issuer.includes('AWS') || issuer.includes('Amazon')) {
        return '<i class="fab fa-aws"></i>';
    } else if (issuer.includes('Google')) {
        return '<i class="fab fa-google"></i>';
    } else if (issuer.includes('Microsoft')) {
        return '<i class="fab fa-microsoft"></i>';
    } else if (issuer.includes('IBM')) {
        return '<i class="fas fa-brain"></i>';
    } else if (issuer.includes('freeCodeCamp')) {
        return '<i class="fab fa-free-code-camp"></i>';
    } else if (issuer.includes('Cisco')) {
        return '<i class="fas fa-network-wired"></i>';
    } else if (issuer.includes('Meta')) {
        return '<i class="fab fa-facebook"></i>';
    }
    return '<i class="fas fa-university"></i>';
}

/**
 * Setup filter controls
 * - Dynamically populates categories, issuers, years from data
 * - Attaches change listeners for real-time filtering
 */
function setupCertificateFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const issuerFilter = document.getElementById('issuerFilter');
    const yearFilter = document.getElementById('yearFilter');
    
    if (!categoryFilter || !issuerFilter || !yearFilter) {
        console.warn('⚠️ Filter elements not found');
        return;
    }
    
    // Populate categories
    const categories = [...new Set(CERTIFICATES_STATE.allCertificates.map(cert => cert.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Populate issuers
    const issuers = [...new Set(CERTIFICATES_STATE.allCertificates.map(cert => cert.issuer).filter(Boolean))].sort();
    issuers.forEach(issuer => {
        const option = document.createElement('option');
        option.value = issuer;
        option.textContent = issuer;
        issuerFilter.appendChild(option);
    });
    
    // Populate years (descending)
    const years = [...new Set(CERTIFICATES_STATE.allCertificates.map(cert => cert.year).filter(Boolean))].sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
    
    // Attach listeners
    categoryFilter.addEventListener('change', handleFilterChange);
    issuerFilter.addEventListener('change', handleFilterChange);
    yearFilter.addEventListener('change', handleFilterChange);
    
    function handleFilterChange() {
        CERTIFICATES_STATE.currentFilters.category = categoryFilter.value;
        CERTIFICATES_STATE.currentFilters.issuer = issuerFilter.value;
        CERTIFICATES_STATE.currentFilters.year = yearFilter.value;
        applyCertificateFilters();
        showNotification('Filters updated', 'info');
    }
    
    console.log('🔧 Certificate filters setup complete');
}

/**
 * Apply all active filters and search
 * - Chains category/issuer/year filters, then searches if term present
 * - Updates display immediately
 */
function applyCertificateFilters() {
    let filtered = [...CERTIFICATES_STATE.allCertificates];
    
    // Apply category filter
    if (CERTIFICATES_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(cert => cert.category === CERTIFICATES_STATE.currentFilters.category);
    }
    
    // Apply issuer filter
    if (CERTIFICATES_STATE.currentFilters.issuer !== 'all') {
        filtered = filtered.filter(cert => cert.issuer === CERTIFICATES_STATE.currentFilters.issuer);
    }
    
    // Apply year filter
    if (CERTIFICATES_STATE.currentFilters.year !== 'all') {
        filtered = filtered.filter(cert => cert.year === parseInt(CERTIFICATES_STATE.currentFilters.year));
    }
    
    // Apply search if term exists
    if (CERTIFICATES_STATE.searchTerm.trim()) {
        const searchResults = filtered.filter(cert => {
            const searchableText = [
                cert.title,
                cert.description,
                cert.issuer,
                cert.category,
                ...cert.skills
            ].join(' ').toLowerCase();
            return searchableText.includes(CERTIFICATES_STATE.searchTerm.toLowerCase());
        });
        filtered = searchResults;
    }
    
    CERTIFICATES_STATE.filteredCertificates = filtered;
    displayCertificates(filtered);
    
    console.log(`🔍 Applied filters: ${filtered.length} results`);
}

/**
 * Reset all filters and search to defaults
 * - Clears selections and reapplies
 * - Shows success notification
 */
function resetCertificateFilters() {
    CERTIFICATES_STATE.currentFilters = { category: 'all', issuer: 'all', year: 'all' };
    CERTIFICATES_STATE.searchTerm = '';
    
    const categoryFilter = document.getElementById('categoryFilter');
    const issuerFilter = document.getElementById('issuerFilter');
    const yearFilter = document.getElementById('yearFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (issuerFilter) issuerFilter.value = 'all';
    if (yearFilter) yearFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    applyCertificateFilters();
    showNotification('Filters reset successfully', 'success');
    console.log('🔄 Filters reset');
}

/**
 * Setup global event listeners
 * - Search with debounce, keyboard shortcuts (e.g., 'R' for reset, '/' for search)
 * - Ignores inputs to avoid conflicts
 */
function setupCertificateEventListeners() {
    setupSearchFunctionality();
    setupKeyboardShortcuts();
    setupScrollToTop();
    
    console.log('👂 Event listeners setup complete');
}

/**
 * Setup search functionality with debouncing
 * - Real-time search across title, desc, issuer, category, skills
 */
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        CERTIFICATES_STATE.searchTerm = e.target.value;
        applyCertificateFilters();
        console.log(`🔍 Searching: "${CERTIFICATES_STATE.searchTerm}"`);
    }, 300));
}

/**
 * Setup keyboard shortcuts
 * - 'R': Reset filters, '/': Focus search, 'A': Show credit
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select, button')) return;
        
        switch(e.key) {
            case 'r':
            case 'R':
                e.preventDefault();
                resetCertificateFilters();
                break;
            case '/':
                e.preventDefault();
                document.getElementById('searchInput').focus();
                break;
            case 'a':
            case 'A':
                e.preventDefault();
                showNotification('Portfolio by Arsh Verma | arshcreates.com', 'info');
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
 * Setup interactive listeners on certificate cards
 * - View details, verify, hover effects
 * - Prevents event bubbling on buttons
 */
function setupCertificateCardListeners() {
    document.querySelectorAll('.btn-view-details').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const certId = this.getAttribute('data-certificate-id');
            viewCertificateDetails(certId);
        });
    });
    
    document.querySelectorAll('.btn-verify-cert').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    document.querySelectorAll('.certificate-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const certId = this.getAttribute('data-certificate-id');
                viewCertificateDetails(certId);
            }
        });
        
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
    
    console.log(`🖱️ Setup interactions for ${document.querySelectorAll('.certificate-card').length} cards`);
}

/**
 * Navigate to certificate details page
 * - Appends query params for SPA-like routing
 * @param {string|number} certId - Certificate ID
 */
function viewCertificateDetails(certId) {
    if (!certId) {
        showNotification('Invalid certificate ID', 'error');
        return;
    }
    window.location.href = `certificate-detail.html?id=${encodeURIComponent(certId)}`;
    console.log(`📄 Navigating to certificate details: ${certId}`);
}

/**
 * Update header statistics dynamically
 * - Calculates totals from loaded data
 * - Updates DOM elements safely
 */
function updateHeaderStats() {
    const allCertificates = CERTIFICATES_STATE.allCertificates;
    if (allCertificates.length === 0) return;
    
    const totalCertificates = allCertificates.length;
    const uniqueIssuers = new Set(allCertificates.map(cert => cert.issuer)).size;
    const successRate = '98%'; // Hardcoded as per original, or calculate if attempts data available
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        animateValue(statNumbers[0], 0, totalCertificates, 1500, '+');
        animateValue(statNumbers[1], 0, uniqueIssuers, 1500, '+');
        statNumbers[2].textContent = successRate;
    }
    
    console.log('📊 Header stats updated:', { totalCertificates, uniqueIssuers, successRate });
}

/**
 * Update results count display
 * @param {number} count - Number of results
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const total = CERTIFICATES_STATE.allCertificates.length;
        resultsCount.textContent = `Showing ${count} of ${total} certificate${total !== 1 ? 's' : ''}`;
    }
}

/**
 * Animate cards entrance with stagger
 * - Fade-in and slide-up for polished UX
 */
function animateCertificateCards() {
    const cards = document.querySelectorAll('.certificate-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'none';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * CERTIFICATES_STATE.animationDelay);
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
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength).trim() + '...';
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
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date or 'N/A'
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.warn('Invalid date format:', dateString);
        return 'N/A';
    }
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

/**
 * Animate value counting up
 * @param {HTMLElement} element - Element to animate
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration
 * @param {string} suffix - Suffix to append
 */
function animateValue(element, start, end, duration, suffix = '') {
    if (!element) return;
    
    const range = Math.abs(end - start);
    const stepTime = Math.max(Math.floor(duration / range), 20);
    const isDecimal = end % 1 !== 0;
    let current = start;
    
    const timer = setInterval(() => {
        current += (end > start ? 1 : -1) * (isDecimal ? 0.1 : 1);
        
        if ((end > start && current >= end) || (end < start && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, stepTime);
}

/**
 * Initialize theme from localStorage or system preference
 */
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log(`🎨 Theme initialized: ${savedTheme}`);
        
    } catch (error) {
        console.error('❌ Theme error:', error);
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('#themeToggle .theme-icon i');
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log(`🎨 Theme toggled: ${newTheme}`);
        
    } catch (error) {
        console.error('❌ Theme toggle error:', error);
    }
}

// ==========================================
// SAMPLE DATA FALLBACK
// Production-ready sample certificates for preview/demo mode
// Edit here to add/remove sample entries
// ==========================================
function createSampleCertificates() {
    return [
        {
            id: 1,
            title: "AWS Certified Solutions Architect - Associate",
            category: "Cloud Computing",
            issuer: "Amazon Web Services",
            year: 2024,
            date: "2024-03-15",
            description: "Professional certification validating expertise in designing and deploying scalable systems on AWS.",
            image: "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=AWS+Certified",
            skills: ["Cloud Architecture", "EC2", "S3", "VPC", "IAM", "Lambda"],
            credentialUrl: "https://www.credly.com/badges/abc123",
            credentialId: "AWS-SA-2024-001",
            validity: "3 Years",
            technologies: ["AWS", "CloudFormation", "EC2", "S3", "Lambda"],
            additionalImages: [
                "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=AWS+Badge+1",
                "https://via.placeholder.com/400x250/E4572E/FFFFFF?text=AWS+Badge+2"
            ],
            details: "This certification demonstrates proficiency in designing and deploying scalable, highly available, and fault-tolerant systems on AWS.",
            difficulty: "Advanced",
            duration: "6 Months",
            recognition: "Global"
        },
        {
            id: 2,
            title: "Google Cloud Professional Data Engineer",
            category: "Cloud Computing",
            issuer: "Google Cloud",
            year: 2024,
            date: "2024-05-20",
            description: "Certification demonstrating proficiency in building and managing data processing systems on Google Cloud.",
            image: "https://via.placeholder.com/400x250/4285F4/FFFFFF?text=Google+Cloud",
            skills: ["BigQuery", "Dataflow", "Dataproc", "Pub/Sub", "Machine Learning"],
            credentialUrl: "https://www.credly.com/badges/def456",
            credentialId: "GCP-DE-2024-002",
            validity: "2 Years",
            technologies: ["BigQuery", "Dataflow", "Dataproc", "Pub/Sub"],
            additionalImages: [
                "https://via.placeholder.com/400x250/4285F4/FFFFFF?text=GCP+Badge+1"
            ],
            details: "Validates skills in designing data processing systems, building and operationalizing data processing systems.",
            difficulty: "Advanced",
            duration: "4 Months",
            recognition: "Global"
        },
        {
            id: 3,
            title: "Responsive Web Design",
            category: "Programming",
            issuer: "freeCodeCamp",
            year: 2023,
            date: "2023-11-10",
            description: "Entry-level certification in modern web development fundamentals and responsive design principles.",
            image: "https://via.placeholder.com/400x250/006400/FFFFFF?text=freeCodeCamp",
            skills: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design"],
            credentialUrl: "https://www.freecodecamp.org/certification/ghi789",
            credentialId: "FCC-RWD-2023-003",
            validity: "Lifetime",
            technologies: ["HTML5", "CSS3", "JavaScript"],
            additionalImages: [],
            details: "Covers fundamental web development concepts including HTML5, CSS3, and responsive web design principles.",
            difficulty: "Beginner",
            duration: "2 Months",
            recognition: "Global"
        },
        {
            id: 4,
            title: "Microsoft Certified: Azure Fundamentals",
            category: "Cloud Computing",
            issuer: "Microsoft",
            year: 2023,
            date: "2023-08-05",
            description: "Foundational certification covering core Azure services and cloud concepts.",
            image: "https://via.placeholder.com/400x250/0078D4/FFFFFF?text=Azure+Fundamentals",
            skills: ["Azure Services", "Cloud Computing", "Security", "Pricing"],
            credentialUrl: "https://www.credly.com/badges/jkl012",
            credentialId: "AZ-900-2023-004",
            validity: "Lifetime",
            technologies: ["Azure", "Cloud Computing"],
            additionalImages: [
                "https://via.placeholder.com/400x250/0078D4/FFFFFF?text=Azure+Badge+1",
                "https://via.placeholder.com/400x250/0078D4/FFFFFF?text=Azure+Badge+2"
            ],
            details: "Demonstrates foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
            difficulty: "Beginner",
            duration: "1 Month",
            recognition: "Global"
        },
        {
            id: 5,
            title: "IBM Data Science Professional Certificate",
            category: "Programming",
            issuer: "IBM",
            year: 2024,
            date: "2024-01-30",
            description: "Comprehensive program covering data science tools, Python, SQL, and machine learning.",
            image: "https://via.placeholder.com/400x250/192BC2/FFFFFF?text=IBM+Data+Science",
            skills: ["Python", "SQL", "Machine Learning", "Data Visualization", "Pandas"],
            credentialUrl: "https://www.credly.com/badges/mno345",
            credentialId: "IBM-DS-2024-005",
            validity: "Lifetime",
            technologies: ["Python", "SQL", "Jupyter", "Pandas", "Scikit-learn"],
            additionalImages: [
                "https://via.placeholder.com/400x250/192BC2/FFFFFF?text=IBM+Badge+1"
            ],
            details: "Comprehensive data science program covering tools and technologies, methodology, and Python programming.",
            difficulty: "Intermediate",
            duration: "5 Months",
            recognition: "Global"
        },
        {
            id: 6,
            title: "Meta Front-End Developer Professional Certificate",
            category: "Programming",
            issuer: "Meta",
            year: 2024,
            date: "2024-07-15",
            description: "Professional certificate covering React, JavaScript, and modern front-end development practices.",
            image: "https://via.placeholder.com/400x250/1877F2/FFFFFF?text=Meta+Frontend",
            skills: ["React", "JavaScript", "HTML/CSS", "UI/UX", "Git"],
            credentialUrl: "https://coursera.org/verify/specialization/xyz789",
            credentialId: "META-FE-2024-006",
            validity: "Lifetime",
            technologies: ["React", "JavaScript", "HTML5", "CSS3", "Git"],
            additionalImages: [],
            details: "Comprehensive front-end development program focusing on React, JavaScript, and modern web development practices.",
            difficulty: "Intermediate",
            duration: "4 Months",
            recognition: "Global"
        }
    ];
}

// ==========================================
// GLOBAL EXPORTS
// Make key functions available globally for HTML onclicks and utils integration
// ==========================================
window.initializeCertificatesPage = initializeCertificatesPage;
window.resetCertificateFilters = resetCertificateFilters;
window.viewCertificateDetails = viewCertificateDetails;
window.applyCertificateFilters = applyCertificateFilters;
window.toggleTheme = toggleTheme;

console.log('✅ Certificates.js loaded successfully');
console.log('📝 Created by: Arsh Verma');
console.log('🔧 Version: 2.2.0 - Websites-Inspired Design Applied');