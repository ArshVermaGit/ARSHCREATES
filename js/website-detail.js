// ==========================================
// WEBSITE DETAIL PAGE - Complete & Corrected Version
// Handles website preview, navigation, and all interactive features
// Author: Arsh Verma
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentWebsiteId = null;        // ID of the currently displayed website
let currentWebsite = null;          // Current website object with all details
let websiteImages = [];             // Array of website images (main + screenshots)
let isPreviewActive = false;        // Flag to track if preview is active
let currentImageIndex = 0;          // Current image index for gallery

// ==========================================
// PAGE INITIALIZATION
// ==========================================

/**
 * Initialize the website detail page
 * - Sets up theme
 * - Loads website data from URL parameters
 * - Sets up event listeners
 * - Handles auto-visit if requested
 */
function initializeWebsiteDetailPage() {
    console.log('Initializing website detail page...');
    
    try {
        // Initialize theme first
        initializeTheme();
        
        // Extract website ID and auto-visit flag from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        currentWebsiteId = parseInt(urlParams.get('id'));
        const autoVisit = urlParams.get('visit') === 'true';
        
        // Validate website ID
        if (!currentWebsiteId || isNaN(currentWebsiteId)) {
            console.error('Invalid or missing website ID');
            showNotification('Website not found', 'error');
            setTimeout(() => window.location.href = 'websites.html', 2000);
            return;
        }
        
        // Load and display website details
        loadWebsiteDetails(currentWebsiteId);
        
        // Setup all event listeners
        setupWebsiteDetailEventListeners();
        
        // Auto-visit website if requested via URL parameter
        if (autoVisit) {
            setTimeout(() => {
                if (currentWebsite && currentWebsite.status === 'Live' && currentWebsite.liveUrl) {
                    visitWebsiteExternal(currentWebsite);
                }
            }, 1000);
        }
        
        // Hide loading screen with fade animation
        setTimeout(() => {
            hideLoadingScreen();
        }, 1000);
        
        console.log('Website detail page initialized successfully');
    } catch (error) {
        console.error('Error initializing website detail page:', error);
        showNotification('Error loading website page', 'error');
    }
}

/**
 * Hide loading screen with fade animation
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
// THEME MANAGEMENT
// ==========================================

/**
 * Initialize theme system
 * - Loads saved theme preference from localStorage
 * - Sets up theme toggle button
 */
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme icon
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Attach theme toggle event listener
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log('Theme initialized:', savedTheme);
    } catch (error) {
        console.error('Error initializing theme:', error);
    }
}

/**
 * Toggle between light and dark theme
 * - Updates DOM attribute
 * - Saves preference to localStorage
 * - Updates theme icon
 */
function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('.theme-icon i');
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log('Theme toggled to:', newTheme);
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

// ==========================================
// WEBSITE DATA LOADING
// ==========================================

/**
 * Load website details from data source
 * @param {number} websiteId - ID of the website to load
 */
function loadWebsiteDetails(websiteId) {
    try {
        // Fetch websites array from data.js
        const websites = getWebsites();
        
        // Validate websites data
        if (!websites || !Array.isArray(websites)) {
            throw new Error('Websites data not available or invalid');
        }
        
        // Find the specific website by ID
        const website = websites.find(w => w.id === websiteId);
        
        if (!website) {
            console.error('Website not found with ID:', websiteId);
            showNotification('Website not found', 'error');
            setTimeout(() => window.location.href = 'websites.html', 2000);
            return;
        }
        
        // Store current website globally
        currentWebsite = website;
        
        // Build images array (main image + screenshots)
        websiteImages = [website.image];
        if (website.screenshots && Array.isArray(website.screenshots)) {
            websiteImages.push(...website.screenshots);
        }
        
        // Display all website information
        displayWebsiteDetails(website);
        
        // Setup navigation arrows
        setupWebsiteNavigation();
        
        console.log('Website details loaded:', website.name);
    } catch (error) {
        console.error('Error loading website details:', error);
        showNotification('Error loading website details', 'error');
    }
}

// ==========================================
// WEBSITE DETAILS DISPLAY
// ==========================================

/**
 * Display all website details in the UI
 * @param {Object} website - Website object containing all details
 */
function displayWebsiteDetails(website) {
    try {
        // Update browser tab title
        document.title = `${website.name} - Arsh Verma`;
        
        // ===== PREVIEW IMAGE =====
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = website.image || 'https://via.placeholder.com/1200x675/E4572E/FFFFFF?text=Website+Preview';
            previewImage.alt = website.name;
            
            // Fallback for broken images
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/1200x675/E4572E/FFFFFF?text=Website+Preview';
            };
        }
        
        // ===== WEBSITE HEADER SECTION =====
        const websiteTitle = document.getElementById('websiteTitle');
        if (websiteTitle) websiteTitle.textContent = website.name || 'Unknown Website';
        
        const websiteCategory = document.getElementById('websiteCategory');
        if (websiteCategory) websiteCategory.textContent = website.category || 'Uncategorized';
        
        const websiteRating = document.getElementById('websiteRating');
        if (websiteRating) websiteRating.textContent = website.rating || '0';
        
        const websiteStatus = document.getElementById('websiteStatus');
        if (websiteStatus) {
            websiteStatus.textContent = website.status || 'Unknown';
            const statusClass = (website.status === 'Live' ? 'status-live' : 'status-dev');
            websiteStatus.className = 'website-status ' + statusClass;
        }
        
        // ===== WEBSITE DESCRIPTION =====
        const websiteOverview = document.getElementById('websiteOverview');
        if (websiteOverview) {
            websiteOverview.textContent = website.overview || 'No overview available.';
        }
        
        const websiteDescription = document.getElementById('websiteDescription');
        if (websiteDescription) {
            websiteDescription.textContent = website.description || 'No description available.';
        }
        
        // ===== DETAIL CARDS =====
        updateDetailCard('launchDate', formatDate(website.launchDate));
        updateDetailCard('developmentTime', website.developmentTime || '-');
        updateDetailCard('userBase', website.userBase || '-');
        
        // ===== FEATURES LIST =====
        const featuresList = document.getElementById('featuresList');
        if (featuresList && website.features && Array.isArray(website.features)) {
            featuresList.innerHTML = website.features.map(feature => 
                `<li><i class="fas fa-check"></i><span>${escapeHtml(feature)}</span></li>`
            ).join('');
        }
        
        // ===== TECHNOLOGIES TAGS =====
        const techList = document.getElementById('techList');
        if (techList && website.technologies && Array.isArray(website.technologies)) {
            techList.innerHTML = website.technologies.map(tech => 
                `<span class="tech-tag">${escapeHtml(tech)}</span>`
            ).join('');
        }
        
        // ===== STATISTICS CIRCLES =====
        updateStatCircle('ratingCircle', website.rating ? website.rating.toString() : '0.0');
        updateStatCircle('userCountCircle', formatUserCount(website.userBase || '0'));
        updateStatCircle('performanceCircle', '98%'); // Default performance metric
        
        // ===== ACTION BUTTONS =====
        
        // Repository Button
        const repositoryBtn = document.getElementById('repositoryBtn');
        if (repositoryBtn) {
            if (website.repositoryUrl && website.repositoryUrl !== '#') {
                repositoryBtn.href = website.repositoryUrl;
                repositoryBtn.style.display = 'flex';
                repositoryBtn.target = '_blank';
                repositoryBtn.rel = 'noopener noreferrer';
            } else {
                repositoryBtn.style.display = 'none';
            }
        }
        
        // Live URL Button
        const liveUrlBtn = document.getElementById('liveUrlBtn');
        if (liveUrlBtn) {
            if (website.status === 'Live' && website.liveUrl && website.liveUrl !== '#') {
                liveUrlBtn.href = website.liveUrl;
                liveUrlBtn.style.display = 'flex';
                liveUrlBtn.target = '_blank';
                liveUrlBtn.rel = 'noopener noreferrer';
                liveUrlBtn.onclick = (e) => {
                    e.preventDefault();
                    visitWebsiteExternal(website);
                };
            } else {
                liveUrlBtn.style.display = 'none';
            }
        }
        
        // ===== VISIT BUTTON STATE =====
        updateVisitButton(website);
        
        // ===== ANIMATE CONTENT =====
        animateWebsiteDetails();
        
        console.log('Website details displayed successfully');
    } catch (error) {
        console.error('Error displaying website details:', error);
        showNotification('Error displaying website information', 'error');
    }
}

/**
 * Update a detail card element
 * @param {string} elementId - ID of the element to update
 * @param {string} value - Value to display
 */
function updateDetailCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

/**
 * Update a statistic circle element
 * @param {string} elementId - ID of the stat circle element
 * @param {string} value - Value to display
 */
function updateStatCircle(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '0';
    }
}

/**
 * Update the visit button based on website status
 * @param {Object} website - Website object
 */
function updateVisitButton(website) {
    const visitBtn = document.getElementById('visitBtn');
    if (!visitBtn) return;
    
    try {
        if (website.status === 'In Development' || !website.liveUrl || website.liveUrl === '#') {
            // Website is not yet live
            visitBtn.innerHTML = '<i class="fas fa-clock"></i><span>Coming Soon</span>';
            visitBtn.disabled = true;
            visitBtn.style.cursor = 'not-allowed';
            visitBtn.style.opacity = '0.6';
            visitBtn.onclick = null;
        } else {
            // Website is live and accessible
            visitBtn.innerHTML = '<i class="fas fa-external-link-alt"></i><span>Visit Website</span>';
            visitBtn.disabled = false;
            visitBtn.style.cursor = 'pointer';
            visitBtn.style.opacity = '1';
            visitBtn.onclick = () => visitWebsiteExternal(website);
        }
    } catch (error) {
        console.error('Error updating visit button:', error);
    }
}

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================

/**
 * Setup all event listeners for the website detail page
 */
function setupWebsiteDetailEventListeners() {
    try {
        // ===== SHARE BUTTON =====
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', shareWebsite);
        }
        
        // ===== FULLSCREEN BUTTON =====
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }
        
        // ===== CLOSE PREVIEW BUTTON =====
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        if (closePreviewBtn) {
            closePreviewBtn.addEventListener('click', closePreview);
        }
        
        // ===== KEYBOARD NAVIGATION =====
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // ===== FULLSCREEN CHANGE EVENTS =====
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        console.log('Event listeners setup complete');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// ==========================================
// WEBSITE NAVIGATION
// ==========================================

/**
 * Setup previous/next website navigation arrows
 */
function setupWebsiteNavigation() {
    try {
        const prevWebsiteBtn = document.getElementById('prevWebsite');
        const nextWebsiteBtn = document.getElementById('nextWebsite');
        
        if (prevWebsiteBtn) {
            prevWebsiteBtn.addEventListener('click', navigateToPreviousWebsite);
        }
        
        if (nextWebsiteBtn) {
            nextWebsiteBtn.addEventListener('click', navigateToNextWebsite);
        }
        
        console.log('Website navigation setup complete');
    } catch (error) {
        console.error('Error setting up website navigation:', error);
    }
}

/**
 * Navigate to the previous website in the list
 */
function navigateToPreviousWebsite() {
    try {
        const websites = getWebsites();
        if (!websites || !Array.isArray(websites)) {
            console.error('Websites data not available');
            return;
        }
        
        const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
        if (currentIndex === -1) {
            console.error('Current website not found in websites list');
            return;
        }
        
        // Wrap around to last website if at beginning
        const prevIndex = (currentIndex - 1 + websites.length) % websites.length;
        const prevWebsite = websites[prevIndex];
        
        // Navigate to previous website
        window.location.href = `website-detail.html?id=${prevWebsite.id}`;
    } catch (error) {
        console.error('Error navigating to previous website:', error);
        showNotification('Navigation error', 'error');
    }
}

/**
 * Navigate to the next website in the list
 */
function navigateToNextWebsite() {
    try {
        const websites = getWebsites();
        if (!websites || !Array.isArray(websites)) {
            console.error('Websites data not available');
            return;
        }
        
        const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
        if (currentIndex === -1) {
            console.error('Current website not found in websites list');
            return;
        }
        
        // Wrap around to first website if at end
        const nextIndex = (currentIndex + 1) % websites.length;
        const nextWebsite = websites[nextIndex];
        
        // Navigate to next website
        window.location.href = `website-detail.html?id=${nextWebsite.id}`;
    } catch (error) {
        console.error('Error navigating to next website:', error);
        showNotification('Navigation error', 'error');
    }
}

// ==========================================
// WEBSITE INTERACTION FUNCTIONS
// ==========================================

/**
 * Visit website in new tab
 * @param {Object} website - Website object with liveUrl
 */
function visitWebsiteExternal(website) {
    try {
        if (!website.liveUrl || website.liveUrl === '#') {
            showNotification('Website URL not available', 'error');
            console.warn('No live URL available for website:', website.name);
            return;
        }
        
        // Open website in new tab with security measures
        window.open(website.liveUrl, '_blank', 'noopener,noreferrer');
        showNotification(`Opening ${website.name}...`, 'success');
        
        console.log('Opening website:', website.liveUrl);
    } catch (error) {
        console.error('Error opening website:', error);
        showNotification('Error opening website', 'error');
    }
}

/**
 * Toggle fullscreen mode for website preview
 */
function toggleFullscreen() {
    try {
        const websitePreview = document.querySelector('.website-preview');
        if (!websitePreview) {
            console.error('Website preview element not found');
            return;
        }
        
        // Check if already in fullscreen
        if (!document.fullscreenElement && !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && !document.msFullscreenElement) {
            
            // Enter fullscreen
            if (websitePreview.requestFullscreen) {
                websitePreview.requestFullscreen();
            } else if (websitePreview.webkitRequestFullscreen) {
                websitePreview.webkitRequestFullscreen();
            } else if (websitePreview.mozRequestFullScreen) {
                websitePreview.mozRequestFullScreen();
            } else if (websitePreview.msRequestFullscreen) {
                websitePreview.msRequestFullscreen();
            }
            
            console.log('Entering fullscreen mode');
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            console.log('Exiting fullscreen mode');
        }
    } catch (error) {
        console.error('Error toggling fullscreen:', error);
        showNotification('Fullscreen error', 'error');
    }
}

/**
 * Close preview and return to websites list
 */
function closePreview() {
    try {
        console.log('Closing preview, returning to websites list');
        window.location.href = 'websites.html';
    } catch (error) {
        console.error('Error closing preview:', error);
    }
}

// ==========================================
// SHARE FUNCTIONALITY
// ==========================================

/**
 * Share website using Web Share API or fallback to clipboard
 */
function shareWebsite() {
    if (!currentWebsite) {
        showNotification('No website to share', 'error');
        return;
    }
    
    try {
        const shareData = {
            title: currentWebsite.name,
            text: currentWebsite.overview || `Check out ${currentWebsite.name}!`,
            url: window.location.href
        };
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    showNotification('Website shared successfully', 'success');
                    console.log('Website shared via Web Share API');
                })
                .catch((error) => {
                    // User cancelled or error occurred
                    if (error.name !== 'AbortError') {
                        console.error('Share error:', error);
                        fallbackShare();
                    }
                });
        } else {
            // Web Share API not available, use fallback
            fallbackShare();
        }
    } catch (error) {
        console.error('Error sharing website:', error);
        fallbackShare();
    }
}

/**
 * Fallback share function - copies link to clipboard
 */
function fallbackShare() {
    const url = window.location.href;
    
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Website link copied to clipboard', 'success');
                console.log('Link copied to clipboard');
            })
            .catch((error) => {
                console.error('Clipboard error:', error);
                fallbackCopyToClipboard(url);
            });
    } else {
        // Use fallback method for older browsers
        fallbackCopyToClipboard(url);
    }
}

/**
 * Fallback method to copy text to clipboard (older browsers)
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showNotification('Website link copied to clipboard', 'success');
        } else {
            showNotification('Could not copy link', 'error');
        }
    } catch (error) {
        console.error('Fallback copy error:', error);
        showNotification('Could not copy link', 'error');
    }
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================

/**
 * Handle keyboard shortcuts
 * - Arrow Left/Right: Navigate between websites
 * - Escape: Close preview
 * - Space/Enter: Visit website
 * - F: Toggle fullscreen
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardNavigation(e) {
    // Don't interfere with form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateToPreviousWebsite();
            console.log('Keyboard: Navigate to previous website');
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextWebsite();
            console.log('Keyboard: Navigate to next website');
            break;
            
        case 'Escape':
            if (isPreviewActive) {
                e.preventDefault();
                closePreview();
                console.log('Keyboard: Close preview');
            }
            break;
            
        case ' ':
        case 'Enter':
            if (!isPreviewActive && currentWebsite && 
                currentWebsite.status === 'Live' && currentWebsite.liveUrl) {
                e.preventDefault();
                visitWebsiteExternal(currentWebsite);
                console.log('Keyboard: Visit website');
            }
            break;
            
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            console.log('Keyboard: Toggle fullscreen');
            break;
            
        case 's':
        case 'S':
            e.preventDefault();
            shareWebsite();
            console.log('Keyboard: Share website');
            break;
    }
}

// ==========================================
// FULLSCREEN CHANGE HANDLER
// ==========================================

/**
 * Handle fullscreen state changes
 * Updates fullscreen button icon and tooltip
 */
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    // Check if currently in fullscreen
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                           document.mozFullScreenElement || document.msFullscreenElement);
    
    // Update button icon and title
    const icon = fullscreenBtn.querySelector('i');
    if (icon) {
        icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    } else {
        fullscreenBtn.innerHTML = isFullscreen ? 
            '<i class="fas fa-compress"></i>' : 
            '<i class="fas fa-expand"></i>';
    }
    
    fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';
    
    console.log('Fullscreen state:', isFullscreen ? 'active' : 'inactive');
}

// ==========================================
// ANIMATIONS
// ==========================================

/**
 * Animate website details on display
 * Staggered fade-in animation for all elements
 */
function animateWebsiteDetails() {
    try {
        const elements = document.querySelectorAll(
            '.detail-card, .features-list li, .tech-tags span, .stat-item'
        );
        
        elements.forEach((element, index) => {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            // Animate with delay based on index
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 50); // 50ms delay between each element
        });
        
        console.log(`Animated ${elements.length} elements`);
    } catch (error) {
        console.error('Error animating website details:', error);
    }
}

// ==========================================
// SCREENSHOT GALLERY (OPTIONAL FEATURE)
// ==========================================

/**
 * Load and display website screenshots
 * @param {Object} website - Website object with screenshots
 */
function loadWebsiteScreenshots(website) {
    const screenshotsContainer = document.getElementById('websiteScreenshots');
    if (!screenshotsContainer || !website.screenshots || !Array.isArray(website.screenshots)) {
        return;
    }
    
    try {
        screenshotsContainer.innerHTML = website.screenshots.map((screenshot, index) => `
            <div class="screenshot-thumbnail" data-screenshot-index="${index}">
                <img src="${screenshot}" 
                     alt="${escapeHtml(website.name)} screenshot ${index + 1}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/200x150/E4572E/FFFFFF?text=Image+${index + 1}'">
            </div>
        `).join('');
        
        // Add click event to thumbnails
        document.querySelectorAll('.screenshot-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-screenshot-index'));
                showScreenshot(index);
            });
        });
        
        console.log(`Loaded ${website.screenshots.length} screenshots`);
    } catch (error) {
        console.error('Error loading screenshots:', error);
    }
}

/**
 * Show specific screenshot in preview
 * @param {number} index - Index of screenshot to display
 */
function showScreenshot(index) {
    try {
        if (index < 0 || index >= websiteImages.length) {
            console.error('Invalid screenshot index:', index);
            return;
        }
        
        const previewImage = document.getElementById('previewImage');
        if (previewImage && websiteImages[index]) {
            currentImageIndex = index;
            
            // Fade out
            previewImage.style.transition = 'opacity 0.3s ease';
            previewImage.style.opacity = '0';
            
            // Change image and fade in
            setTimeout(() => {
                previewImage.src = websiteImages[index];
                previewImage.style.opacity = '1';
            }, 300);
            
            console.log('Showing screenshot:', index);
        }
    } catch (error) {
        console.error('Error showing screenshot:', error);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    
    try {
        const date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        
        // Format: Month Day, Year (e.g., "January 15, 2024")
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Format large numbers with K/M suffixes
 * @param {number|string} num - Number to format
 * @returns {string} Formatted number string
 */
function formatStatNumber(num) {
    if (typeof num === 'string') {
        num = parseFloat(num.replace(/[^0-9.]/g, ''));
    }
    
    if (typeof num !== 'number' || isNaN(num)) {
        return '0';
    }
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toString();
}

/**
 * Format user count (handles strings like "50K+", "1.2M+")
 * @param {string} userBase - User base string
 * @returns {string} Formatted user count
 */
function formatUserCount(userBase) {
    if (!userBase || typeof userBase !== 'string') return '0';
    
    // If already formatted (contains K or M), return as is
    if (userBase.includes('K') || userBase.includes('M')) {
        return userBase;
    }
    
    // Otherwise, format as number
    const num = parseFloat(userBase.replace(/[^0-9.]/g, ''));
    return formatStatNumber(num);
}

/**
 * Escape HTML special characters to prevent XSS
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
 * Show notification toast message
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    try {
        // Check if utils.js has showNotification
        if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback notification system
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        
        // Set notification style based on type
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
        
        // Apply styles
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
            min-width: 250px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            font-family: 'Inter', sans-serif;
        `;
        
        // Set content with icon
        notification.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        console.log(`Notification [${type}]:`, message);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// ==========================================
// VISIBILITY CHANGE HANDLER
// ==========================================

/**
 * Handle page visibility changes
 * Optional: Pause/resume any animations when tab is not visible
 */
function handleVisibilityChange() {
    if (document.hidden) {
        console.log('Page hidden');
        // Optional: Pause animations or videos
    } else {
        console.log('Page visible');
        // Optional: Resume animations or videos
    }
}

// Listen for visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// ==========================================
// WINDOW UNLOAD HANDLER
// ==========================================

/**
 * Cleanup when page is about to unload
 */
window.addEventListener('beforeunload', () => {
    console.log('Page unloading, cleaning up...');
    // Cleanup operations if needed
});

// ==========================================
// GLOBAL FUNCTION EXPORTS
// Make functions available globally for HTML onclick handlers
// ==========================================
window.initializeWebsiteDetailPage = initializeWebsiteDetailPage;
window.visitWebsiteExternal = visitWebsiteExternal;
window.shareWebsite = shareWebsite;
window.navigateToPreviousWebsite = navigateToPreviousWebsite;
window.navigateToNextWebsite = navigateToNextWebsite;
window.toggleTheme = toggleTheme;
window.toggleFullscreen = toggleFullscreen;
window.closePreview = closePreview;
window.showScreenshot = showScreenshot;

// ==========================================
// AUTO-INITIALIZATION
// Initialize page when DOM is ready
// ==========================================
if (document.readyState === 'loading') {
    // DOM still loading, wait for DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', initializeWebsiteDetailPage);
    console.log('Waiting for DOM to load...');
} else {
    // DOM already loaded, initialize immediately
    initializeWebsiteDetailPage();
}

// ==========================================
// CSS ANIMATIONS (Add to your stylesheet if not present)
// ==========================================
/*
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
*/

// ==========================================
// DEBUG HELPERS (Remove in production)
// ==========================================

/**
 * Debug function to check website state
 * Call window.debugWebsiteState() in console
 */
window.debugWebsiteState = function() {
    console.log('=== WEBSITE STATE DEBUG ===');
    console.log('Current Website ID:', currentWebsiteId);
    console.log('Current Website:', currentWebsite);
    console.log('Website Images:', websiteImages);
    console.log('Is Preview Active:', isPreviewActive);
    console.log('Current Image Index:', currentImageIndex);
    console.log('Available Websites:', getWebsites());
    console.log('===========================');
};

/**
 * Test all interactive buttons
 * Call window.testButtons() in console
 */
window.testButtons = function() {
    console.log('=== TESTING ALL BUTTONS ===');
    
    const buttons = {
        visitBtn: document.getElementById('visitBtn'),
        shareBtn: document.getElementById('shareBtn'),
        fullscreenBtn: document.getElementById('fullscreenBtn'),
        closePreviewBtn: document.getElementById('closePreviewBtn'),
        repositoryBtn: document.getElementById('repositoryBtn'),
        liveUrlBtn: document.getElementById('liveUrlBtn'),
        prevWebsite: document.getElementById('prevWebsite'),
        nextWebsite: document.getElementById('nextWebsite'),
        themeToggle: document.getElementById('themeToggle')
    };
    
    Object.entries(buttons).forEach(([name, button]) => {
        if (button) {
            console.log(`✅ ${name}: Found and clickable`);
        } else {
            console.log(`❌ ${name}: Not found`);
        }
    });
    
    console.log('==========================');
};

/**
 * Test keyboard shortcuts
 * Call window.testKeyboardShortcuts() in console
 */
window.testKeyboardShortcuts = function() {
    console.log('=== KEYBOARD SHORTCUTS ===');
    console.log('← → : Navigate between websites');
    console.log('ESC : Close preview');
    console.log('Space/Enter : Visit website');
    console.log('F : Toggle fullscreen');
    console.log('S : Share website');
    console.log('==========================');
};

// Log initialization
console.log('website-detail.js loaded successfully');
console.log('Available functions:', [
    'initializeWebsiteDetailPage',
    'visitWebsiteExternal',
    'shareWebsite',
    'navigateToPreviousWebsite',
    'navigateToNextWebsite',
    'toggleTheme',
    'toggleFullscreen',
    'closePreview',
    'showScreenshot',
    'debugWebsiteState',
    'testButtons',
    'testKeyboardShortcuts'
]);

// ==========================================
// ADDITIONAL ENHANCEMENTS
// ==========================================

/**
 * Auto-update relative timestamps (e.g., "2 days ago")
 * Call this if you want to show relative dates
 */
function updateRelativeTimestamps() {
    const launchDate = document.getElementById('launchDate');
    if (launchDate && currentWebsite && currentWebsite.launchDate) {
        const date = new Date(currentWebsite.launchDate);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let relativeText = '';
        if (diffDays === 0) {
            relativeText = ' (Today)';
        } else if (diffDays === 1) {
            relativeText = ' (Yesterday)';
        } else if (diffDays < 30) {
            relativeText = ` (${diffDays} days ago)`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            relativeText = ` (${months} ${months === 1 ? 'month' : 'months'} ago)`;
        } else {
            const years = Math.floor(diffDays / 365);
            relativeText = ` (${years} ${years === 1 ? 'year' : 'years'} ago)`;
        }
        
        // Append relative time to existing date
        const currentText = launchDate.textContent;
        if (!currentText.includes('ago') && !currentText.includes('Today')) {
            launchDate.textContent = currentText + relativeText;
        }
    }
}

/**
 * Track website views (if analytics is implemented)
 */
function trackWebsiteView() {
    if (currentWebsite) {
        console.log('Website view tracked:', currentWebsite.name);
        // Implement your analytics tracking here
        // Example: gtag('event', 'page_view', { page_title: currentWebsite.name });
    }
}

// Call tracking after page loads
setTimeout(trackWebsiteView, 1000);

/**
 * Add smooth scroll to sections
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup smooth scroll
setupSmoothScroll();

console.log('🚀 Website detail page fully loaded and ready!');