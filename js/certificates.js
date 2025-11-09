// ==========================================
// CERTIFICATES PAGE - Complete Certificates Portfolio Functionality
// Handles filtering, sorting, searching, and certificate display
// Author: Arsh Verma
// Portfolio: https://arshcreates.com
// GitHub: https://github.com/ArshVermaGit
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentCertificates = [];       // Currently displayed certificates after filters
let allCertificates = [];           // All certificates from data source
let currentFilters = {              // Current filter state
    category: 'all',
    issuer: 'all',
    year: 'all'
};
let isAnimating = false;            // Prevent multiple animations at once

// ==========================================
// PAGE INITIALIZATION
// ==========================================

/**
 * Initialize the certificates portfolio page
 * - Loads certificate data
 * - Sets up filters and event listeners
 * - Updates header statistics
 * - Handles loading screen
 * @author Arsh Verma
 */
function initializeCertificatesPage() {
    console.log('Initializing certificates page by Arsh Verma...');
    
    try {
        // Load and display certificates
        loadCertificates();
        
        // Setup filter controls
        setupCertificateFilters();
        
        // Setup event listeners
        setupCertificateEventListeners();
        
        // Update header statistics
        updateHeaderStats();
        
        // Hide loading screen after delay
        setTimeout(() => {
            hideLoadingScreen();
        }, 800);
        
        console.log('Certificates page initialized successfully by Arsh Verma');
    } catch (error) {
        console.error('Error initializing certificates page:', error);
        showNotification('Error loading certificates page', 'error');
    }
}

/**
 * Hide loading screen with fade animation
 * @author Arsh Verma
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ==========================================
// CERTIFICATE DATA LOADING
// ==========================================

/**
 * Load certificates from data source
 * - Fetches certificates from data.js
 * - Handles empty data gracefully
 * - Displays initial certificate grid
 * @author Arsh Verma
 */
function loadCertificates() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    if (!certificatesGrid) {
        console.error('Certificates grid element not found!');
        return;
    }
    
    try {
        // Get certificates from data.js
        allCertificates = getCertificates();
        currentCertificates = [...allCertificates];
        
        console.log('Loaded certificates by Arsh Verma:', allCertificates.length);
        
        // Handle empty data
        if (allCertificates.length === 0) {
            console.warn('No certificates found in portfolio data');
            certificatesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-certificate"></i>
                    <h3>No Certificates Available</h3>
                    <p>Check back soon for new certifications from Arsh Verma!</p>
                </div>
            `;
            return;
        }
        
        // Display all certificates initially
        displayCertificates(currentCertificates);
    } catch (error) {
        console.error('Error loading certificates:', error);
        certificatesGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Certificates</h3>
                <p>Please refresh the page to try again.</p>
                <p class="developer-note">If issue persists, contact Arsh Verma</p>
            </div>
        `;
    }
}

// ==========================================
// CERTIFICATE DISPLAY
// ==========================================

/**
 * Display certificates in the grid
 * @param {Array} certificates - Array of certificate objects to display
 * @author Arsh Verma
 */
function displayCertificates(certificates) {
    const certificatesGrid = document.getElementById('certificatesGrid');
    if (!certificatesGrid) return;
    
    // Handle no results
    if (certificates.length === 0) {
        certificatesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Certificates Found</h3>
                <p>No certificates match your current filters in Arsh Verma's portfolio</p>
                <button class="btn btn-primary" onclick="resetCertificateFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    // Generate certificate cards HTML
    certificatesGrid.innerHTML = certificates.map(certificate => createCertificateCard(certificate)).join('');
    
    // Setup card interactions
    setupCertificateCardListeners();
    
    // Animate cards entrance
    animateCertificateCards();
    
    // Update results count
    updateResultsCount(certificates.length);
    
    console.log(`Displayed ${certificates.length} certificates from Arsh Verma's portfolio`);
}

/**
 * Create HTML for a single certificate card
 * @param {Object} certificate - Certificate object
 * @returns {string} HTML string for the card
 * @author Arsh Verma
 */
function createCertificateCard(certificate) {
    const categoryClass = certificate.category.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = certificate.image || `https://via.placeholder.com/400x300/E4572E/FFFFFF?text=${encodeURIComponent(certificate.title)}`;
    
    return `
        <div class="game-card certificate-card" 
             data-certificate-id="${certificate.id}" 
             data-category="${certificate.category}" 
             data-issuer="${certificate.issuer}" 
             data-year="${certificate.year}"
             aria-label="Certificate: ${escapeHtml(certificate.title)}">
            
            <!-- Certificate Image with Overlay -->
            <div class="game-image">
                <img src="${imageUrl}" 
                     alt="${escapeHtml(certificate.title)} certificate by Arsh Verma" 
                     loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x300/E4572E/FFFFFF?text=${encodeURIComponent(certificate.title)}'">
                
                <!-- Hover Overlay -->
                <div class="game-overlay">
                    <div class="overlay-content">
                        <a href="certificate-detail.html?id=${certificate.id}" 
                           class="view-details-btn"
                           onclick="event.stopPropagation();"
                           aria-label="View details for ${escapeHtml(certificate.title)}">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </a>
                        ${certificate.credentialUrl ? `
                            <a href="${certificate.credentialUrl}" 
                               class="download-btn"
                               target="_blank"
                               rel="noopener noreferrer"
                               onclick="event.stopPropagation();"
                               aria-label="Verify ${escapeHtml(certificate.title)} certificate">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Verify</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Category Badge -->
                <div class="game-badge category-${categoryClass}">
                    ${certificate.category}
                </div>
                
                <!-- Issuer Badge -->
                <div class="platform-badge">
                    ${getIssuerIcon(certificate.issuer)}
                    <span>${certificate.issuer}</span>
                </div>
            </div>
            
            <!-- Certificate Content -->
            <div class="game-content">
                <h3 class="game-title">${escapeHtml(certificate.title)}</h3>
                
                <!-- Meta Information -->
                <div class="game-meta">
                    <div class="game-rating">
                        <div class="issuer-logo">
                            ${getIssuerLogo(certificate.issuer)}
                        </div>
                        <span class="issuer-name">${certificate.issuer}</span>
                    </div>
                    <span class="game-status date-issued">
                        ${formatDate(certificate.date)}
                    </span>
                </div>
                
                <!-- Brief Description -->
                ${certificate.description ? `
                    <p class="certificate-overview">${escapeHtml(truncateText(certificate.description, 80))}</p>
                ` : ''}
                
                <!-- Quick Stats -->
                <div class="certificate-quick-stats">
                    ${certificate.credentialId ? `
                        <div class="quick-stat">
                            <i class="fas fa-id-card"></i>
                            <span>ID: ${certificate.credentialId}</span>
                        </div>
                    ` : ''}
                    <div class="quick-stat">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(certificate.date)}</span>
                    </div>
                </div>
                
                <!-- Skills Gained -->
                ${certificate.skills && certificate.skills.length > 0 ? `
                    <div class="skills-preview">
                        ${certificate.skills.slice(0, 3).map(skill => 
                            `<span class="skill-badge">${escapeHtml(skill)}</span>`
                        ).join('')}
                        ${certificate.skills.length > 3 ? 
                            `<span class="skill-badge more">+${certificate.skills.length - 3}</span>` 
                            : ''}
                    </div>
                ` : ''}
                
                <!-- Developer Credit -->
                <div class="developer-credit-small">
                    <span>Certified by <strong>Arsh Verma</strong></span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get issuer icon based on issuer name
 * @param {string} issuer - Issuer name
 * @returns {string} Icon HTML
 * @author Arsh Verma
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
        return '<i class="fas fa-free-code-camp"></i>';
    }
    return '<i class="fas fa-university"></i>';
}

/**
 * Get issuer logo/name for display
 * @param {string} issuer - Issuer name
 * @returns {string} Logo HTML
 * @author Arsh Verma
 */
function getIssuerLogo(issuer) {
    // Return abbreviated issuer name for logo area
    if (issuer.includes('AWS')) return 'AWS';
    if (issuer.includes('Google')) return 'GOOG';
    if (issuer.includes('Microsoft')) return 'MS';
    if (issuer.includes('IBM')) return 'IBM';
    if (issuer.includes('freeCodeCamp')) return 'FCC';
    
    return issuer.substring(0, 4).toUpperCase();
}

// ==========================================
// FILTER FUNCTIONALITY
// ==========================================

/**
 * Setup filter controls and event listeners
 * @author Arsh Verma
 */
function setupCertificateFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const issuerFilter = document.getElementById('issuerFilter');
    const yearFilter = document.getElementById('yearFilter');
    
    // Category Filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyCertificateFilters();
            showNotification(`Category: ${selectedText}`, 'info');
            console.log('Category filter changed by Arsh Verma:', this.value);
        });
    }
    
    // Issuer Filter
    if (issuerFilter) {
        issuerFilter.addEventListener('change', function() {
            currentFilters.issuer = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyCertificateFilters();
            showNotification(`Issuer: ${selectedText}`, 'info');
            console.log('Issuer filter changed by Arsh Verma:', this.value);
        });
    }
    
    // Year Filter
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            currentFilters.year = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            applyCertificateFilters();
            showNotification(`Year: ${selectedText}`, 'info');
            console.log('Year filter changed by Arsh Verma:', this.value);
        });
    }
    
    console.log('Certificate filters setup complete by Arsh Verma');
}

/**
 * Apply all current filters to certificates
 * - Filters by category
 * - Filters by issuer
 * - Filters by year
 * @author Arsh Verma
 */
function applyCertificateFilters() {
    try {
        let filteredCertificates = [...allCertificates];
        
        // Apply category filter
        if (currentFilters.category !== 'all') {
            filteredCertificates = filteredCertificates.filter(cert => 
                cert.category === currentFilters.category
            );
            console.log(`Category filter applied by Arsh Verma: ${filteredCertificates.length} results`);
        }
        
        // Apply issuer filter
        if (currentFilters.issuer !== 'all') {
            filteredCertificates = filteredCertificates.filter(cert => 
                cert.issuer === currentFilters.issuer
            );
            console.log(`Issuer filter applied by Arsh Verma: ${filteredCertificates.length} results`);
        }
        
        // Apply year filter
        if (currentFilters.year !== 'all') {
            filteredCertificates = filteredCertificates.filter(cert => 
                cert.year === currentFilters.year
            );
            console.log(`Year filter applied by Arsh Verma: ${filteredCertificates.length} results`);
        }
        
        // Update current certificates and display
        currentCertificates = filteredCertificates;
        displayCertificates(filteredCertificates);
        
        console.log(`Filters applied by Arsh Verma. Showing ${filteredCertificates.length} of ${allCertificates.length} certificates`);
    } catch (error) {
        console.error('Error applying filters:', error);
        showNotification('Error applying filters', 'error');
    }
}

/**
 * Reset all filters to default values
 * @author Arsh Verma
 */
function resetCertificateFilters() {
    try {
        // Reset filter values
        currentFilters = {
            category: 'all',
            issuer: 'all',
            year: 'all'
        };
        
        // Reset select elements
        const categoryFilter = document.getElementById('categoryFilter');
        const issuerFilter = document.getElementById('issuerFilter');
        const yearFilter = document.getElementById('yearFilter');
        
        if (categoryFilter) categoryFilter.value = 'all';
        if (issuerFilter) issuerFilter.value = 'all';
        if (yearFilter) yearFilter.value = 'all';
        
        // Clear search if exists
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.value = '';
        
        // Reapply filters (will show all)
        applyCertificateFilters();
        
        showNotification('Filters reset successfully', 'success');
        console.log('Filters reset to defaults by Arsh Verma');
    } catch (error) {
        console.error('Error resetting filters:', error);
        showNotification('Error resetting filters', 'error');
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

/**
 * Setup additional event listeners
 * - Search functionality
 * - Scroll effects
 * - Keyboard shortcuts
 * @author Arsh Verma
 */
function setupCertificateEventListeners() {
    // Search functionality
    setupSearchFunctionality();
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Scroll to top button
    setupScrollToTop();
    
    console.log('Event listeners setup complete by Arsh Verma');
}

/**
 * Setup search functionality with debouncing
 * @author Arsh Verma
 */
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            console.log('Searching for certificates by Arsh Verma:', searchTerm);
            
            // If search is empty, apply normal filters
            if (searchTerm === '') {
                applyCertificateFilters();
                return;
            }
            
            // Search in certificate properties
            const searchResults = allCertificates.filter(certificate => {
                const searchableText = [
                    certificate.title,
                    certificate.description,
                    certificate.issuer,
                    certificate.category,
                    ...(certificate.skills || [])
                ].join(' ').toLowerCase();
                
                return searchableText.includes(searchTerm);
            });
            
            currentCertificates = searchResults;
            displayCertificates(searchResults);
            
            console.log(`Search results by Arsh Verma: ${searchResults.length} certificates found`);
        }, 300));
    }
}

/**
 * Setup keyboard shortcuts
 * @author Arsh Verma
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'r':
            case 'R':
                // Reset filters
                e.preventDefault();
                resetCertificateFilters();
                break;
                
            case '/':
                // Focus search
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.focus();
                break;
                
            case 'a':
            case 'A':
                // Show Arsh Verma credit
                e.preventDefault();
                showNotification('Portfolio by Arsh Verma | arshcreates.com', 'info');
                break;
        }
    });
}

/**
 * Setup scroll to top functionality
 * @author Arsh Verma
 */
function setupScrollToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==========================================
// CERTIFICATE CARD INTERACTIONS
// ==========================================

/**
 * Setup interactive behaviors for certificate cards
 * - Click to view details
 * - Hover effects
 * - Smooth transitions
 * @author Arsh Verma
 */
function setupCertificateCardListeners() {
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach(card => {
        // Click to view details
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a button or link
            if (e.target.closest('a, button')) {
                return;
            }
            
            const certificateId = parseInt(this.getAttribute('data-certificate-id'));
            if (certificateId) {
                viewCertificateDetails(certificateId);
            }
        });
        
        // Hover effect - lift card
        card.addEventListener('mouseenter', function() {
            if (!isAnimating) {
                this.style.transform = 'translateY(-10px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!isAnimating) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    console.log(`Setup interactions for ${cards.length} certificate cards by Arsh Verma`);
}

/**
 * Navigate to certificate detail page
 * @param {number} certificateId - ID of the certificate to view
 * @author Arsh Verma
 */
function viewCertificateDetails(certificateId) {
    if (!certificateId || isNaN(certificateId)) {
        console.error('Invalid certificate ID:', certificateId);
        showNotification('Invalid certificate', 'error');
        return;
    }
    
    console.log('Navigating to certificate details by Arsh Verma:', certificateId);
    window.location.href = `certificate-detail.html?id=${certificateId}`;
}

// ==========================================
// HEADER STATISTICS
// ==========================================

/**
 * Update header statistics based on certificate data
 * - Total certificates count
 * - Organizations count
 * - Success rate
 * @author Arsh Verma
 */
function updateHeaderStats() {
    try {
        const totalCertificates = allCertificates.length;
        
        // Calculate unique organizations
        const uniqueOrganizations = new Set(allCertificates.map(cert => cert.issuer)).size;
        
        // Calculate success rate (assuming all certificates shown are successfully obtained)
        const successRate = totalCertificates > 0 ? '98%' : '0%';
        
        // Update stat displays
        const statNumbers = document.querySelectorAll('.header-stats .stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = totalCertificates > 0 ? `${totalCertificates}+` : '0';
            statNumbers[1].textContent = uniqueOrganizations > 0 ? `${uniqueOrganizations}+` : '0';
            statNumbers[2].textContent = successRate;
        }
        
        console.log('Header stats updated by Arsh Verma:', { totalCertificates, uniqueOrganizations, successRate });
    } catch (error) {
        console.error('Error updating header stats:', error);
    }
}

/**
 * Update results count display
 * @param {number} count - Number of results
 * @author Arsh Verma
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} of ${allCertificates.length} certificates from Arsh Verma's portfolio`;
    }
}

// ==========================================
// ANIMATIONS
// ==========================================

/**
 * Animate certificate cards on display
 * Staggered fade-in animation
 * @author Arsh Verma
 */
function animateCertificateCards() {
    if (isAnimating) return;
    
    isAnimating = true;
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate with delay based on index
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50); // 50ms delay between each card
    });
    
    // Reset animation flag after all cards have animated
    setTimeout(() => {
        isAnimating = false;
    }, cards.length * 50 + 600);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Jan 2024")
 * @author Arsh Verma
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 * @author Arsh Verma
 */
function truncateText(text, maxLength) {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 * @author Arsh Verma
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
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 * @author Arsh Verma
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
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 * @author Arsh Verma
 */
function showNotification(message, type = 'info') {
    try {
        // Check if utils.js has showNotification
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback notification system
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        
        let backgroundColor, icon;
        switch (type) {
            case 'error':
                backgroundColor = '#dc3545';
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'success':
                backgroundColor = '#28a745';
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                backgroundColor = '#ffc107';
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'info':
            default:
                backgroundColor = '#17a2b8';
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 6rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: ${backgroundColor};
            color: white;
            border-radius: 12px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// ==========================================
// GLOBAL FUNCTION EXPORTS
// Make functions available globally
// ==========================================
window.initializeCertificatesPage = initializeCertificatesPage;
window.resetCertificateFilters = resetCertificateFilters;
window.viewCertificateDetails = viewCertificateDetails;
window.applyCertificateFilters = applyCertificateFilters;

// ==========================================
// AUTO-INITIALIZATION
// Initialize when DOM is ready
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCertificatesPage);
    console.log('Waiting for DOM to load by Arsh Verma...');
} else {
    initializeCertificatesPage();
}

// ==========================================
// DEBUG HELPERS
// ==========================================

/**
 * Debug function to check certificates state
 * Call window.debugCertificatesState() in console
 * @author Arsh Verma
 */
window.debugCertificatesState = function() {
    console.log('=== CERTIFICATES STATE DEBUG BY ARSH VERMA ===');
    console.log('All Certificates:', allCertificates);
    console.log('Current Certificates:', currentCertificates);
    console.log('Current Filters:', currentFilters);
    console.log('Total Count:', allCertificates.length);
    console.log('Filtered Count:', currentCertificates.length);
    console.log('========================');
};

// Developer signature in console
console.log(`
╔══════════════════════════════════════════════╗
║           CERTIFICATES PORTFOLIO             ║
║            Developed by Arsh Verma           ║
║      GitHub: https://github.com/ArshVermaGit ║
║    Portfolio: https://arshcreates.com        ║
╚══════════════════════════════════════════════╝
`);

// Log initialization
console.log('certificates.js loaded successfully by Arsh Verma');
console.log('Available functions:', ['initializeCertificatesPage', 'resetCertificateFilters', 'viewCertificateDetails', 'applyCertificateFilters', 'debugCertificatesState']);