// ==========================================
// CERTIFICATE DETAIL PAGE - Individual Certificate Presentation
// ==========================================
// This file handles:
// - Loading and displaying individual certificate details
// - Image preview and navigation
// - Verification button functionality
// - Certificate navigation (previous/next)
// - Share functionality
// - Keyboard shortcuts
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentCertificateId = null;    // Current certificate ID from URL
let currentCertificate = null;      // Current certificate object
let certificateImages = [];         // Array of all certificate images
let currentImageIndex = 0;          // Currently displayed image index

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize Certificate Detail Page
 * Called automatically when page loads
 * Extracts certificate ID from URL and loads certificate details
 */
function initializeCertificateDetailPage() {
    console.log('🚀 Initializing certificate detail page...');
    
    try {
        // Extract URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        currentCertificateId = parseInt(urlParams.get('id'));
        
        // Validate certificate ID
        if (!currentCertificateId || isNaN(currentCertificateId)) {
            console.error('❌ Invalid or missing certificate ID');
            showNotification('Certificate not found', 'error');
            setTimeout(() => window.location.href = 'certificates.html', 2000);
            return;
        }
        
        console.log(`📜 Loading certificate with ID: ${currentCertificateId}`);
        
        // Load certificate details
        loadCertificateDetails(currentCertificateId);
        
        // Setup event listeners
        setupCertificateDetailEventListeners();
        
        console.log('✅ Certificate detail page initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing certificate detail page:', error);
        showNotification('Error loading certificate details', 'error');
        setTimeout(() => window.location.href = 'certificates.html', 2000);
    }
}

// ==========================================
// DATA LOADING
// ==========================================

/**
 * Load Certificate Details from Data
 * @param {number} certificateId - The ID of the certificate to load
 */
function loadCertificateDetails(certificateId) {
    try {
        // Get all certificates from data.js
        const certificates = getCertificates();
        
        // Find the specific certificate
        const certificate = certificates.find(c => c.id === certificateId);
        
        // Handle certificate not found
        if (!certificate) {
            console.error(`❌ Certificate with ID ${certificateId} not found`);
            showNotification('Certificate not found', 'error');
            setTimeout(() => window.location.href = 'certificates.html', 2000);
            return;
        }
        
        console.log('📦 Certificate loaded:', certificate.title);
        
        // Store current certificate globally
        currentCertificate = certificate;
        
        // Prepare images array (main image + additional images)
        certificateImages = [certificate.image];
        if (certificate.additionalImages && certificate.additionalImages.length > 0) {
            certificateImages.push(...certificate.additionalImages);
        }
        
        console.log(`🖼️ Total images: ${certificateImages.length}`);
        
        // Display all certificate details
        displayCertificateDetails(certificate);
        
        // Setup navigation arrows
        setupCertificateNavigation();
        
    } catch (error) {
        console.error('❌ Error loading certificate details:', error);
        showNotification('Error loading certificate', 'error');
    }
}

// ==========================================
// DISPLAY FUNCTIONS
// ==========================================

/**
 * Display All Certificate Details on Page
 * @param {object} certificate - The certificate object to display
 */
function displayCertificateDetails(certificate) {
    try {
        console.log('🎨 Displaying certificate details...');
        
        // Update page title
        document.title = `${certificate.title} - Arsh Verma`;
        
        // Update preview image
        updatePreviewImage(certificate);
        
        // Update certificate header information
        updateCertificateHeader(certificate);
        
        // Update description sections
        updateDescriptions(certificate);
        
        // Update detail cards (issue date, credential ID, etc.)
        updateDetailCards(certificate);
        
        // Update skills list
        updateSkills(certificate);
        
        // Update technologies
        updateTechnologies(certificate);
        
        // Update statistics
        updateStatistics(certificate);
        
        // Update action buttons
        updateActionButtons(certificate);
        
        // Load and display badges
        loadCertificateBadges(certificate);
        
        // Animate content entrance
        animateCertificateDetails();
        
        console.log('✅ Certificate details displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying certificate details:', error);
        showNotification('Error displaying certificate', 'error');
    }
}

/**
 * Update Preview Image
 * @param {object} certificate - The certificate object
 */
function updatePreviewImage(certificate) {
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = certificate.image;
        previewImage.alt = certificate.title;
        
        // Handle image load error
        previewImage.onerror = function() {
            console.warn('⚠️ Preview image failed to load, using placeholder');
            this.src = 'https://via.placeholder.com/600x400/E4572E/FFFFFF?text=' + encodeURIComponent(certificate.title);
        };
    }
}

/**
 * Update Certificate Header Information
 * @param {object} certificate - The certificate object
 */
function updateCertificateHeader(certificate) {
    // Certificate title
    const certificateTitle = document.getElementById('certificateTitle');
    if (certificateTitle) {
        certificateTitle.textContent = certificate.title;
    }
    
    // Certificate category
    const certificateCategory = document.getElementById('certificateCategory');
    if (certificateCategory) {
        certificateCategory.textContent = certificate.category || 'Professional Certificate';
    }
    
    // Certificate issuer
    const certificateIssuer = document.getElementById('certificateIssuer');
    if (certificateIssuer) {
        certificateIssuer.textContent = certificate.issuer || 'Unknown Issuer';
    }
    
    // Certificate date
    const certificateDate = document.getElementById('certificateDate');
    if (certificateDate) {
        certificateDate.textContent = formatDate(certificate.date) || 'Date not specified';
    }
}

/**
 * Update Description Sections
 * @param {object} certificate - The certificate object
 */
function updateDescriptions(certificate) {
    // Description
    const certificateDescription = document.getElementById('certificateDescription');
    if (certificateDescription) {
        certificateDescription.textContent = certificate.description || 'No description available.';
    }
    
    // Details
    const certificateDetails = document.getElementById('certificateDetails');
    if (certificateDetails) {
        certificateDetails.textContent = certificate.details || certificate.description || 'Additional details not available.';
    }
}

/**
 * Update Detail Cards (Issue Date, Credential ID, Validity, Organization)
 * @param {object} certificate - The certificate object
 */
function updateDetailCards(certificate) {
    // Issue Date
    updateDetailCard('issueDate', formatDate(certificate.date));
    
    // Credential ID
    updateDetailCard('credentialId', certificate.credentialId || 'Not specified');
    
    // Certificate Validity
    updateDetailCard('certificateValidity', certificate.validity || 'Lifetime');
    
    // Issuing Organization
    updateDetailCard('issuingOrganization', certificate.issuer || 'Unknown Organization');
}

/**
 * Update Single Detail Card
 * @param {string} elementId - The element ID
 * @param {string} value - The value to display
 */
function updateDetailCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    } else {
        console.warn(`⚠️ Element not found: ${elementId}`);
    }
}

/**
 * Update Skills List
 * @param {object} certificate - The certificate object
 */
function updateSkills(certificate) {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) {
        console.warn('⚠️ Skills list element not found');
        return;
    }
    
    if (certificate.skills && certificate.skills.length > 0) {
        skillsList.innerHTML = certificate.skills.map(skill => 
            `<li><span>${skill}</span></li>`
        ).join('');
    } else {
        skillsList.innerHTML = '<li><span>Skills information not available</span></li>';
    }
}

/**
 * Update Technologies Covered
 * @param {object} certificate - The certificate object
 */
function updateTechnologies(certificate) {
    const techList = document.getElementById('techList');
    if (!techList) {
        console.warn('⚠️ Tech list element not found');
        return;
    }
    
    if (certificate.technologies && certificate.technologies.length > 0) {
        techList.innerHTML = certificate.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    } else {
        techList.innerHTML = '<span class="tech-tag">Technologies not specified</span>';
    }
}

/**
 * Update Certificate Statistics
 * @param {object} certificate - The certificate object
 */
function updateStatistics(certificate) {
    // Difficulty Circle
    updateStatCircle('difficultyCircle', certificate.difficulty || 'Intermediate');
    
    // Duration Circle
    updateStatCircle('durationCircle', certificate.duration || '3 Months');
    
    // Recognition Circle
    updateStatCircle('recognitionCircle', certificate.recognition || 'Global');
}

/**
 * Update Single Stat Circle
 * @param {string} elementId - The element ID
 * @param {string} value - The value to display
 */
function updateStatCircle(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || 'Not specified';
    } else {
        console.warn(`⚠️ Stat circle not found: ${elementId}`);
    }
}

/**
 * Update Action Buttons (Verification, Download)
 * @param {object} certificate - The certificate object
 */
function updateActionButtons(certificate) {
    // Verification button
    const verifyCredentialBtn = document.getElementById('verifyCredentialBtn');
    const credentialUrlBtn = document.getElementById('credentialUrlBtn');
    
    if (verifyCredentialBtn && credentialUrlBtn) {
        if (certificate.credentialUrl && certificate.credentialUrl !== '#') {
            verifyCredentialBtn.href = certificate.credentialUrl;
            credentialUrlBtn.href = certificate.credentialUrl;
            
            verifyCredentialBtn.onclick = (e) => {
                e.preventDefault();
                window.open(certificate.credentialUrl, '_blank');
                showNotification('Opening verification link...', 'success');
            };
            
            credentialUrlBtn.onclick = (e) => {
                e.preventDefault();
                window.open(certificate.credentialUrl, '_blank');
                showNotification('Opening verification link...', 'success');
            };
        } else {
            verifyCredentialBtn.style.display = 'none';
            credentialUrlBtn.style.display = 'none';
        }
    }
    
    // Download button
    const downloadCertificateBtn = document.getElementById('downloadCertificateBtn');
    if (downloadCertificateBtn) {
        downloadCertificateBtn.addEventListener('click', function() {
            downloadCertificate(certificate);
        });
    }
}

// ==========================================
// BADGES FUNCTIONALITY
// ==========================================

/**
 * Load and Display Certificate Badges
 * @param {object} certificate - The certificate object
 */
function loadCertificateBadges(certificate) {
    const badgesContainer = document.getElementById('certificateBadges');
    
    // Check if badges exist
    if (!badgesContainer) {
        console.warn('⚠️ Badges container not found');
        return;
    }
    
    // Hide badges container if no additional images
    if (!certificate.additionalImages || certificate.additionalImages.length === 0) {
        badgesContainer.style.display = 'none';
        console.log('ℹ️ No additional certificate images available');
        return;
    }
    
    console.log(`🛡️ Loading ${certificate.additionalImages.length} certificate badges`);
    
    // Display badges container
    badgesContainer.style.display = 'flex';
    
    // Generate badge thumbnails
    badgesContainer.innerHTML = certificate.additionalImages.map((image, index) => `
        <div class="screenshot-thumbnail ${index === 0 ? 'active' : ''}" 
             data-image-index="${index + 1}"
             role="button"
             tabindex="0"
             aria-label="View certificate badge ${index + 1}">
            <img src="${image}" 
                 alt="${certificate.title} badge ${index + 1}" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/150x150/E4572E/FFFFFF?text=Badge+${index + 1}'">
        </div>
    `).join('');
    
    // Add click events to thumbnails
    const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
    thumbnails.forEach(thumb => {
        // Click event
        thumb.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-image-index'));
            showCertificateImage(index);
        });
        
        // Keyboard event (Enter/Space)
        thumb.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const index = parseInt(this.getAttribute('data-image-index'));
                showCertificateImage(index);
            }
        });
    });
}

/**
 * Show Specific Certificate Image
 * @param {number} index - The image index (1-based for additional images)
 */
function showCertificateImage(index) {
    const previewImage = document.getElementById('previewImage');
    
    if (!previewImage || !certificateImages[index]) {
        console.warn(`⚠️ Certificate image ${index} not found`);
        return;
    }
    
    console.log(`🖼️ Showing certificate image ${index}`);
    
    // Update current index
    currentImageIndex = index;
    
    // Add fade transition
    previewImage.style.transition = 'opacity 0.3s ease';
    previewImage.style.opacity = '0';
    
    // Change image after fade out
    setTimeout(() => {
        previewImage.src = certificateImages[index];
        previewImage.style.opacity = '1';
        
        // Handle image load error
        previewImage.onerror = function() {
            console.warn(`⚠️ Certificate image ${index} failed to load`);
            this.src = 'https://via.placeholder.com/600x400/E4572E/FFFFFF?text=Certificate+' + index;
        };
    }, 300);
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
    thumbnails.forEach((thumb, i) => {
        // Additional images start at index 1 (index 0 is the main certificate image)
        if (i === index - 1) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// ==========================================
// EVENT LISTENERS
// ==========================================

/**
 * Setup All Event Listeners for Certificate Detail Page
 */
function setupCertificateDetailEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareCertificate);
    }
    
    // Close preview button
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreview);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    console.log('✅ Event listeners setup complete');
}

/**
 * Setup Certificate Navigation (Previous/Next Buttons)
 */
function setupCertificateNavigation() {
    const prevCertificateBtn = document.getElementById('prevCertificate');
    const nextCertificateBtn = document.getElementById('nextCertificate');
    
    if (prevCertificateBtn) {
        prevCertificateBtn.addEventListener('click', navigateToPreviousCertificate);
    }
    
    if (nextCertificateBtn) {
        nextCertificateBtn.addEventListener('click', navigateToNextCertificate);
    }
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

/**
 * Navigate to Previous Certificate
 */
function navigateToPreviousCertificate() {
    try {
        const certificates = getCertificates();
        const currentIndex = certificates.findIndex(c => c.id === currentCertificateId);
        
        if (currentIndex === -1) {
            console.error('❌ Current certificate not found in certificates list');
            return;
        }
        
        // Calculate previous index (wrap around)
        const prevIndex = (currentIndex - 1 + certificates.length) % certificates.length;
        const prevCertificate = certificates[prevIndex];
        
        console.log(`⬅️ Navigating to previous certificate: ${prevCertificate.title}`);
        
        // Navigate to previous certificate
        window.location.href = `certificate-detail.html?id=${prevCertificate.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to previous certificate:', error);
        showNotification('Navigation error', 'error');
    }
}

/**
 * Navigate to Next Certificate
 */
function navigateToNextCertificate() {
    try {
        const certificates = getCertificates();
        const currentIndex = certificates.findIndex(c => c.id === currentCertificateId);
        
        if (currentIndex === -1) {
            console.error('❌ Current certificate not found in certificates list');
            return;
        }
        
        // Calculate next index (wrap around)
        const nextIndex = (currentIndex + 1) % certificates.length;
        const nextCertificate = certificates[nextIndex];
        
        console.log(`➡️ Navigating to next certificate: ${nextCertificate.title}`);
        
        // Navigate to next certificate
        window.location.href = `certificate-detail.html?id=${nextCertificate.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to next certificate:', error);
        showNotification('Navigation error', 'error');
    }
}

// ==========================================
// INTERACTION FUNCTIONS
// ==========================================

/**
 * Download Certificate
 * @param {object} certificate - The certificate object
 */
function downloadCertificate(certificate) {
    if (!certificate) {
        console.error('❌ No certificate provided to download');
        return;
    }
    
    console.log(`📥 Downloading certificate: ${certificate.title}`);
    
    // Create a temporary link for download
    const link = document.createElement('a');
    link.href = certificate.image;
    link.download = `${certificate.title.replace(/\s+/g, '_')}_certificate.jpg`;
    link.target = '_blank';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Certificate download started', 'success');
}

/**
 * Close Preview and Return to Certificates Page
 */
function closePreview() {
    console.log('🔙 Closing preview and returning to certificates page');
    window.location.href = 'certificates.html';
}

// ==========================================
// SHARE FUNCTIONALITY
// ==========================================

/**
 * Share Certificate using Web Share API or Clipboard
 */
function shareCertificate() {
    if (!currentCertificate) {
        console.error('❌ No certificate to share');
        return;
    }
    
    console.log(`📤 Sharing certificate: ${currentCertificate.title}`);
    
    const shareData = {
        title: currentCertificate.title,
        text: currentCertificate.description || 'Check out this professional certificate!',
        url: window.location.href
    };
    
    // Try Web Share API first (mobile devices)
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                console.log('✅ Certificate shared successfully via Web Share API');
                showNotification('Certificate shared successfully', 'success');
            })
            .catch((error) => {
                // User cancelled or error occurred
                if (error.name !== 'AbortError') {
                    console.log('⚠️ Web Share failed, using fallback');
                    fallbackShare();
                }
            });
    } else {
        // Fallback to clipboard copy
        console.log('ℹ️ Web Share API not available, using clipboard');
        fallbackShare();
    }
}

/**
 * Fallback Share Method (Copy to Clipboard)
 */
function fallbackShare() {
    const url = window.location.href;
    
    // Try modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                console.log('✅ Link copied to clipboard');
                showNotification('Certificate link copied to clipboard', 'success');
            })
            .catch((error) => {
                console.error('❌ Clipboard write failed:', error);
                showNotification('Could not copy link', 'error');
            });
    } else {
        // Fallback for older browsers
        console.log('ℹ️ Using legacy clipboard method');
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log('✅ Link copied using legacy method');
                showNotification('Certificate link copied to clipboard', 'success');
            } else {
                throw new Error('Copy command failed');
            }
        } catch (err) {
            console.error('❌ Legacy copy failed:', err);
            showNotification('Could not copy link', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================

/**
 * Handle Keyboard Navigation
 * Arrow Left: Previous certificate (or previous image with Shift)
 * Arrow Right: Next certificate (or next image with Shift)
 * Escape: Close preview
 * Enter/Space: Download certificate
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleKeyboardNavigation(e) {
    // Ignore if user is typing in an input field
    if (e.target.tagName === 'INPUT' || 
        e.target.tagName === 'TEXTAREA' || 
        e.target.isContentEditable) {
        return;
    }
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            if (e.shiftKey) {
                // Navigate images backward
                if (currentImageIndex > 1) {
                    showCertificateImage(currentImageIndex - 1);
                } else if (currentImageIndex === 1) {
                    // Go back to main image
                    showCertificateImage(0);
                }
            } else {
                // Navigate to previous certificate
                navigateToPreviousCertificate();
            }
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            if (e.shiftKey) {
                // Navigate images forward
                if (currentImageIndex < certificateImages.length - 1) {
                    showCertificateImage(currentImageIndex + 1);
                }
            } else {
                // Navigate to next certificate
                navigateToNextCertificate();
            }
            break;
            
        case 'Escape':
            e.preventDefault();
            closePreview();
            break;
            
        case ' ':
        case 'Enter':
            // Download certificate
            e.preventDefault();
            if (currentCertificate) {
                downloadCertificate(currentCertificate);
            }
            break;
    }
}

// ==========================================
// ANIMATION
// ==========================================

/**
 * Animate Certificate Details Entrance
 * Adds staggered fade-in animation to detail elements
 */
function animateCertificateDetails() {
    const elements = document.querySelectorAll(
        '.detail-card, .features-list li, .tech-tags span, .stat-item'
    );
    
    console.log(`🎬 Animating ${elements.length} elements`);
    
    elements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        // Animate with stagger delay
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 50); // 50ms delay between each element
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format Date String to Human-Readable Format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    
    try {
        const date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateString; // Return original if invalid
        }
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('❌ Error formatting date:', error);
        return dateString;
    }
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

// Make functions globally available for inline event handlers
window.initializeCertificateDetailPage = initializeCertificateDetailPage;
window.downloadCertificate = downloadCertificate;
window.shareCertificate = shareCertificate;
window.navigateToPreviousCertificate = navigateToPreviousCertificate;
window.navigateToNextCertificate = navigateToNextCertificate;
window.closePreview = closePreview;
window.showCertificateImage = showCertificateImage;

// ==========================================
// AUTO-INITIALIZATION
// ==========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCertificateDetailPage);
} else {
    // DOM already loaded
    initializeCertificateDetailPage();
}

console.log('📜 Certificate Detail module loaded successfully');