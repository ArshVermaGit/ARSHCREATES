// ============================================================================================================
// WEBSITE DETAIL PAGE - PROFESSIONAL SHOWCASE LAYOUT
// ============================================================================================================
// 
// Description: Comprehensive website detail page with interactive preview and navigation
// Features: Dynamic website loading, iframe preview, navigation, theme switching, and social sharing
// Layout: Professional design with primary content and interactive website preview
// 
// Author: Arsh Verma
// Portfolio: ArshCreates
// Created: 2024
// 
// ============================================================================================================

// ============================================================================================================
// GLOBAL STATE VARIABLES
// ============================================================================================================

let currentWebsiteId = null;       // Current website ID from URL parameter
let currentWebsite = null;         // Current website object with all data
let isPreviewActive = false;       // Flag indicating if preview iframe is currently active

// ============================================================================================================
// PAGE INITIALIZATION
// ============================================================================================================

/**
 * Initialize the website detail page
 * Called automatically when DOM is ready
 * Sets up theme, loads website data, initializes event listeners, and handles auto-preview
 */
function initializeWebsiteDetailPage() {
    console.log('🌐 Initializing website detail page...');
    
    try {
        // Step 1: Initialize theme system
        initializeTheme();
        
        // Step 2: Extract URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        currentWebsiteId = parseInt(urlParams.get('id'));
        const autoPreview = urlParams.get('preview') === 'true';
        
        // Step 3: Validate website ID
        if (!currentWebsiteId || isNaN(currentWebsiteId)) {
            console.error('❌ Invalid or missing website ID in URL');
            showNotification('Website not found', 'error');
            setTimeout(() => window.location.href = 'websites.html', 2000);
            return;
        }
        
        console.log(`🔌 Loading website with ID: ${currentWebsiteId}`);
        
        // Step 4: Load and display website details
        loadWebsiteDetails(currentWebsiteId);
        
        // Step 5: Setup all event listeners
        setupWebsiteDetailEventListeners();
        
        // Step 6: Auto-preview if requested via URL parameter
        if (autoPreview) {
            console.log('🎯 Auto-preview requested via URL');
            setTimeout(() => {
                if (currentWebsite && currentWebsite.liveUrl) {
                    showWebsitePreview(currentWebsite);
                }
            }, 1500);
        }
        
        // Step 7: Hide loading screen with smooth fade animation
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        console.log('✅ Website detail page initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing website detail page:', error);
        showNotification('Error loading website page', 'error');
    }
}

// ============================================================================================================
// THEME MANAGEMENT SYSTEM
// ============================================================================================================

/**
 * Initialize theme system
 * Loads saved theme preference from localStorage and sets up toggle functionality
 */
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        // Load saved theme preference or default to dark mode
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme toggle icon based on current theme
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Attach click event listener to theme toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log(`🎨 Theme initialized: ${savedTheme}`);
        
    } catch (error) {
        console.error('❌ Error initializing theme:', error);
    }
}

/**
 * Toggle between light and dark theme
 * Updates DOM, saves preference, and changes icon
 */
function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('.theme-icon i');
        
        // Apply new theme to document
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon: sun for dark mode, moon for light mode
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log(`🎨 Theme toggled to: ${newTheme}`);
        
    } catch (error) {
        console.error('❌ Error toggling theme:', error);
    }
}

// ============================================================================================================
// WEBSITE DATA LOADING
// ============================================================================================================

/**
 * Load website details from data source
 * Fetches website data by ID and displays all information
 * 
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
            console.error(`❌ Website not found with ID: ${websiteId}`);
            showNotification('Website not found', 'error');
            setTimeout(() => window.location.href = 'websites.html', 2000);
            return;
        }
        
        // Store current website globally
        currentWebsite = website;
        
        // Display all website information
        displayWebsiteDetails(website);
        
        // Setup navigation arrows for previous/next website
        setupWebsiteNavigation();
        
        console.log(`✅ Website details loaded: ${website.name}`);
        
    } catch (error) {
        console.error('❌ Error loading website details:', error);
        showNotification('Error loading website details', 'error');
    }
}

// ============================================================================================================
// WEBSITE DETAILS DISPLAY
// ============================================================================================================

/**
 * Display all website details in the UI
 * Updates all DOM elements with website information
 * 
 * @param {Object} website - Website object containing all details
 */
function displayWebsiteDetails(website) {
    try {
        console.log('📄 Displaying website details for:', website.name);
        
        // ===== UPDATE BROWSER TAB TITLE =====
        document.title = `${website.name} - Arsh Verma`;
        
        // ===== PREVIEW IMAGE =====
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = website.image || 'https://via.placeholder.com/1280x720/1a1a2e/ffffff?text=Website+Preview';
            previewImage.alt = `${website.name} - Website Preview`;
            
            // Fallback for broken images
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/1280x720/1a1a2e/ffffff?text=Website+Preview';
                console.warn('⚠️ Failed to load website image, using placeholder');
            };
        }
        
        // ===== WEBSITE HEADER SECTION =====
        updateElement('websiteTitle', website.name || 'Unknown Website');
        
        // Update category badge
        updateElement('websiteCategory', website.category || 'Uncategorized');
        
        // Update rating
        updateElement('websiteRating', website.rating ? website.rating.toFixed(1) : '0.0');
        
        // Update status with proper class
        const websiteStatus = document.getElementById('websiteStatus');
        if (websiteStatus) {
            const statusText = website.status || 'Unknown';
            websiteStatus.innerHTML = `<i class="fas fa-circle"></i> ${statusText}`;
            websiteStatus.className = `website-status ${website.status === 'Active' ? 'status-active' : 
                                       website.status === 'Development' ? 'status-dev' : 'status-archived'}`;
        }
        
        // ===== WEBSITE DESCRIPTION SECTION =====
        updateElement('websiteOverview', website.overview || 'No overview available for this website.');
        updateElement('websiteDescription', website.description || 'Detailed description coming soon.');
        
        // ===== WEBSITE DETAIL CARDS =====
        updateElement('launchDate', formatDate(website.launchDate));
        updateElement('developmentTime', website.developmentTime || '-');
        updateElement('userBase', website.userBase || '-');
        
        // ===== FEATURES LIST =====
        const featuresList = document.getElementById('featuresList');
        if (featuresList && website.features && Array.isArray(website.features)) {
            if (website.features.length > 0) {
                featuresList.innerHTML = website.features.map(feature => 
                    `<li>
                        <i class="fas fa-check-circle"></i>
                        <span>${escapeHtml(feature)}</span>
                    </li>`
                ).join('');
            } else {
                featuresList.innerHTML = '<li><i class="fas fa-info-circle"></i><span>No features listed</span></li>';
            }
        }
        
        // ===== TECHNOLOGIES TAGS =====
        const techList = document.getElementById('techList');
        if (techList && website.technologies && Array.isArray(website.technologies)) {
            if (website.technologies.length > 0) {
                techList.innerHTML = website.technologies.map(tech => 
                    `<span class="tech-tag">
                        <i class="fas fa-code"></i>
                        ${escapeHtml(tech)}
                    </span>`
                ).join('');
            } else {
                techList.innerHTML = '<span class="tech-tag"><i class="fas fa-info-circle"></i>No technologies listed</span>';
            }
        }
        
        // ===== STATISTICS SECTION =====
        updateElement('ratingCircle', website.rating ? website.rating.toFixed(1) : '0.0');
        updateElement('userCountCircle', formatStatNumber(website.userCount || 0));
        updateElement('performanceCircle', website.performance ? `${website.performance}%` : '98%');
        
        // ===== REPOSITORY BUTTON =====
        const repositoryBtn = document.getElementById('repositoryBtn');
        if (repositoryBtn) {
            if (website.repositoryUrl) {
                repositoryBtn.href = website.repositoryUrl;
                repositoryBtn.style.display = 'inline-flex';
                repositoryBtn.target = '_blank';
                repositoryBtn.rel = 'noopener noreferrer';
            } else {
                repositoryBtn.style.display = 'none';
            }
        }
        
        // ===== LIVE URL BUTTON =====
        const liveUrlBtn = document.getElementById('liveUrlBtn');
        if (liveUrlBtn) {
            if (website.liveUrl) {
                liveUrlBtn.href = website.liveUrl;
                liveUrlBtn.style.display = 'inline-flex';
                liveUrlBtn.target = '_blank';
                liveUrlBtn.rel = 'noopener noreferrer';
            } else {
                liveUrlBtn.style.display = 'none';
            }
        }
        
        // ===== VISIT BUTTON (Main Preview Button) =====
        const visitBtn = document.getElementById('visitBtn');
        if (visitBtn) {
            if (website.liveUrl) {
                visitBtn.onclick = () => showWebsitePreview(website);
            } else {
                visitBtn.disabled = true;
                visitBtn.style.opacity = '0.5';
                visitBtn.style.cursor = 'not-allowed';
            }
        }
        
        console.log('✅ Website details displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying website details:', error);
        showNotification('Error displaying website information', 'error');
    }
}

/**
 * Update a single DOM element's text content
 * Helper function to reduce code repetition
 * 
 * @param {string} elementId - ID of the element to update
 * @param {string} value - Value to display
 */
function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

// ============================================================================================================
// EVENT LISTENERS SETUP
// ============================================================================================================

/**
 * Setup all event listeners for the website detail page
 * Attaches click handlers to all interactive elements
 */
function setupWebsiteDetailEventListeners() {
    try {
        console.log('🔧 Setting up event listeners...');
        
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
        
        // ===== VISIT BUTTON (Large Button on Preview Image) =====
        const visitBtn = document.getElementById('visitBtn');
        if (visitBtn && currentWebsite) {
            visitBtn.addEventListener('click', () => showWebsitePreview(currentWebsite));
        }
        
        // ===== KEYBOARD NAVIGATION =====
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // ===== FULLSCREEN CHANGE EVENTS (Cross-browser) =====
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        console.log('✅ Event listeners setup complete');
        
    } catch (error) {
        console.error('❌ Error setting up event listeners:', error);
    }
}

// ============================================================================================================
// WEBSITE NAVIGATION (PREVIOUS/NEXT)
// ============================================================================================================

/**
 * Setup previous/next website navigation arrows
 * Attaches click handlers to navigation buttons
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
        
        console.log('✅ Website navigation setup complete');
        
    } catch (error) {
        console.error('❌ Error setting up website navigation:', error);
    }
}

/**
 * Navigate to the previous website in the list
 * Wraps around to the last website if at the beginning
 */
function navigateToPreviousWebsite() {
    try {
        const websites = getWebsites();
        if (!websites || !Array.isArray(websites)) {
            console.error('❌ Websites data not available');
            return;
        }
        
        const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
        if (currentIndex === -1) {
            console.error('❌ Current website not found in websites list');
            return;
        }
        
        // Wrap around to last website if at beginning
        const prevIndex = (currentIndex - 1 + websites.length) % websites.length;
        const prevWebsite = websites[prevIndex];
        
        console.log(`⬅️ Navigating to previous website: ${prevWebsite.name}`);
        
        // Navigate to previous website
        window.location.href = `website-detail.html?id=${prevWebsite.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to previous website:', error);
        showNotification('Navigation error', 'error');
    }
}

/**
 * Navigate to the next website in the list
 * Wraps around to the first website if at the end
 */
function navigateToNextWebsite() {
    try {
        const websites = getWebsites();
        if (!websites || !Array.isArray(websites)) {
            console.error('❌ Websites data not available');
            return;
        }
        
        const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
        if (currentIndex === -1) {
            console.error('❌ Current website not found in websites list');
            return;
        }
        
        // Wrap around to first website if at end
        const nextIndex = (currentIndex + 1) % websites.length;
        const nextWebsite = websites[nextIndex];
        
        console.log(`➡️ Navigating to next website: ${nextWebsite.name}`);
        
        // Navigate to next website
        window.location.href = `website-detail.html?id=${nextWebsite.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to next website:', error);
        showNotification('Navigation error', 'error');
    }
}

// ============================================================================================================
// WEBSITE PREVIEW FUNCTIONS
// ============================================================================================================

/**
 * Show website preview in iframe
 * Loads the live website URL in an embedded iframe for preview
 * 
 * @param {Object} website - Website object with liveUrl property
 */
function showWebsitePreview(website) {
    console.log(`🌐 Loading website preview: ${website.name}`);
    
    try {
        // Check if website has live URL
        if (!website.liveUrl) {
            showNotification('No live URL available for this website', 'info');
            
            // Fallback to repository if available
            if (website.repositoryUrl) {
                window.open(website.repositoryUrl, '_blank', 'noopener,noreferrer');
            }
            return;
        }
        
        // Get necessary DOM elements
        const websiteContainer = document.getElementById('websiteContainer');
        const previewImage = document.querySelector('.preview-image');
        const websiteFrame = document.getElementById('websiteFrame');
        
        if (!websiteContainer || !websiteFrame) {
            showNotification('Preview container not found', 'error');
            console.error('❌ Preview container elements not found in DOM');
            return;
        }
        
        // Show iframe container and hide preview image
        websiteContainer.style.display = 'block';
        if (previewImage) {
            previewImage.style.display = 'none';
        }
        
        // Set iframe source to live URL
        websiteFrame.src = website.liveUrl;
        
        isPreviewActive = true;
        
        showNotification(`Loading ${website.name}...`, 'success');
        
        // Handle iframe load event
        websiteFrame.onload = () => {
            console.log('✅ Website preview loaded successfully');
            showNotification('Preview loaded!', 'success');
        };
        
        // Handle iframe error
        websiteFrame.onerror = () => {
            console.error('❌ Failed to load website preview');
            showNotification('Failed to load preview. Opening in new tab...', 'warning');
            
            // Fallback: Open in new tab
            setTimeout(() => {
                window.open(website.liveUrl, '_blank', 'noopener,noreferrer');
                closePreview();
            }, 1500);
        };
        
        console.log('✅ Website preview initialization started');
        
    } catch (error) {
        console.error('❌ Error showing website preview:', error);
        showNotification('Error loading preview: ' + error.message, 'error');
        closePreview();
    }
}

/**
 * Close the preview and return to static image view
 * Removes iframe source and shows preview image again
 */
function closePreview() {
    try {
        console.log('❌ Closing website preview');
        
        const websiteContainer = document.getElementById('websiteContainer');
        const previewImage = document.querySelector('.preview-image');
        const websiteFrame = document.getElementById('websiteFrame');
        
        // Hide iframe container
        if (websiteContainer) {
            websiteContainer.style.display = 'none';
        }
        
        // Show preview image
        if (previewImage) {
            previewImage.style.display = 'block';
        }
        
        // Clear iframe source to stop loading
        if (websiteFrame) {
            websiteFrame.src = '';
        }
        
        isPreviewActive = false;
        
        // Exit fullscreen if active
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                document.mozFullScreenElement || document.msFullscreenElement);
        
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        
        showNotification('Preview closed', 'info');
        console.log('✅ Preview closed successfully');
        
    } catch (error) {
        console.error('❌ Error closing preview:', error);
        showNotification('Error closing preview', 'error');
    }
}

// ============================================================================================================
// PREVIEW CONTROL FUNCTIONS
// ============================================================================================================

/**
 * Toggle fullscreen mode for preview container
 * Supports cross-browser fullscreen API
 */
function toggleFullscreen() {
    try {
        const websitePreviewContainer = document.querySelector('.website-preview-container');
        if (!websitePreviewContainer) {
            console.error('❌ Website preview container element not found');
            return;
        }
        
        // Check if already in fullscreen
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                document.mozFullScreenElement || document.msFullscreenElement);
        
        if (!isFullscreen) {
            // Enter fullscreen
            console.log('🖥️ Entering fullscreen mode');
            
            if (websitePreviewContainer.requestFullscreen) {
                websitePreviewContainer.requestFullscreen();
            } else if (websitePreviewContainer.webkitRequestFullscreen) {
                websitePreviewContainer.webkitRequestFullscreen();
            } else if (websitePreviewContainer.mozRequestFullScreen) {
                websitePreviewContainer.mozRequestFullScreen();
            } else if (websitePreviewContainer.msRequestFullscreen) {
                websitePreviewContainer.msRequestFullscreen();
            }
            
        } else {
            // Exit fullscreen
            console.log('🖥️ Exiting fullscreen mode');
            
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        
    } catch (error) {
        console.error('❌ Error toggling fullscreen:', error);
        showNotification('Fullscreen error', 'error');
    }
}

// ============================================================================================================
// SHARE FUNCTIONALITY
// ============================================================================================================

/**
 * Share website using Web Share API or fallback to clipboard
 * Allows users to share website via native share dialog or copy link
 */
function shareWebsite() {
    if (!currentWebsite) {
        showNotification('No website to share', 'error');
        return;
    }
    
    try {
        const shareData = {
            title: `${currentWebsite.name} - ArshCreates`,
            text: currentWebsite.overview || `Check out ${currentWebsite.name} by Arsh Verma!`,
            url: window.location.href
        };
        
        // Check if Web Share API is available (mobile/modern browsers)
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    showNotification('Website shared successfully', 'success');
                    console.log('✅ Website shared via Web Share API');
                })
                .catch((error) => {
                    // User cancelled or error occurred
                    if (error.name !== 'AbortError') {
                        console.error('❌ Share error:', error);
                        fallbackShare();
                    }
                });
        } else {
            // Web Share API not available, use fallback
            fallbackShare();
        }
        
    } catch (error) {
        console.error('❌ Error sharing website:', error);
        fallbackShare();
    }
}

/**
 * Fallback share function - copies link to clipboard
 * Used when Web Share API is not available
 */
function fallbackShare() {
    const url = window.location.href;
    
    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Link copied to clipboard!', 'success');
                console.log('✅ Link copied to clipboard');
            })
            .catch((error) => {
                console.error('❌ Clipboard error:', error);
                showManualCopyDialog(url);
            });
    } else {
        // Clipboard API not available - show manual copy dialog
        showManualCopyDialog(url);
    }
}

/**
 * Show manual copy dialog for browsers without clipboard access
 * 
 * @param {string} url - URL to display for copying
 */
function showManualCopyDialog(url) {
    const dialog = prompt('Copy this link to share:', url);
    if (dialog !== null) {
        showNotification('Please copy the link manually', 'info');
    }
}

// ============================================================================================================
// KEYBOARD NAVIGATION
// ============================================================================================================

/**
 * Handle keyboard shortcuts for navigation and preview control
 * 
 * Keyboard shortcuts:
 * - Arrow Left: Navigate to previous website
 * - Arrow Right: Navigate to next website
 * - Escape: Close preview
 * - F: Toggle fullscreen
 * 
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
            console.log('⌨️ Keyboard: Previous website');
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextWebsite();
            console.log('⌨️ Keyboard: Next website');
            break;
            
        case 'Escape':
            if (isPreviewActive) {
                e.preventDefault();
                closePreview();
                console.log('⌨️ Keyboard: Close preview');
            }
            break;
            
        case 'f':
        case 'F':
            if (isPreviewActive) {
                e.preventDefault();
                toggleFullscreen();
                console.log('⌨️ Keyboard: Toggle fullscreen');
            }
            break;
    }
}

// ============================================================================================================
// FULLSCREEN CHANGE HANDLER
// ============================================================================================================

/**
 * Handle fullscreen state changes
 * Updates fullscreen button icon and text based on current state
 */
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    // Check if currently in fullscreen
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                           document.mozFullScreenElement || document.msFullscreenElement);
    
    // Update button icon
    const icon = fullscreenBtn.querySelector('i');
    if (icon) {
        icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    }
    
    // Update button title
    fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview';
    
    console.log(`🖥️ Fullscreen state: ${isFullscreen ? 'active' : 'inactive'}`);
}

// ============================================================================================================
// UTILITY FUNCTIONS
// ============================================================================================================

/**
 * Format date string to readable format
 * Converts ISO date string to human-readable format
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (e.g., "January 15, 2024")
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
        console.error('❌ Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Format large numbers with K/M suffixes
 * Converts large numbers to compact format with suffixes
 * 
 * @param {number} num - Number to format
 * @returns {string} Formatted number string (e.g., "1.5K", "2.3M")
 */
function formatStatNumber(num) {
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
 * Escape HTML special characters to prevent XSS attacks
 * Sanitizes user input before displaying in DOM
 * 
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML insertion
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
 * Displays temporary notification in top-right corner
 * 
 * @param {string} message - Notification message to display
 * @param {string} type - Notification type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        
        // Set notification style and icon based on type
        let icon;
        
        switch (type) {
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'info':
            default:
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        // Set notification content with icon
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${escapeHtml(message)}</div>
        `;
        
        // Get or create notification container
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Add notification to container
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        console.log(`📢 Notification [${type}]: ${message}`);
        
    } catch (error) {
        console.error('❌ Error showing notification:', error);
    }
}

// ============================================================================================================
// PAGE VISIBILITY HANDLER
// ============================================================================================================

/**
 * Handle page visibility changes
 * Optional: Can be used to pause iframe or show notification when tab is not visible
 */
function handleVisibilityChange() {
    if (document.hidden && isPreviewActive) {
        console.log('👁️ Page hidden, preview is active');
        // Optional: Show notification or pause preview
    } else if (!document.hidden && isPreviewActive) {
        console.log('👁️ Page visible, preview is active');
        // Optional: Resume preview
    }
}

// Listen for visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// ============================================================================================================
// WINDOW UNLOAD HANDLER
// ============================================================================================================

/**
 * Cleanup when page is about to unload
 * Ensures iframe is properly cleaned up
 */
window.addEventListener('beforeunload', () => {
    if (isPreviewActive) {
        console.log('🧹 Page unloading, cleaning up preview');
        const websiteFrame = document.getElementById('websiteFrame');
        if (websiteFrame) {
            websiteFrame.src = '';
        }
    }
});

// ============================================================================================================
// GLOBAL FUNCTION EXPORTS
// ============================================================================================================
// Make functions available globally for inline HTML event handlers and console debugging

window.initializeWebsiteDetailPage = initializeWebsiteDetailPage;
window.showWebsitePreview = showWebsitePreview;
window.closePreview = closePreview;
window.shareWebsite = shareWebsite;
window.navigateToPreviousWebsite = navigateToPreviousWebsite;
window.navigateToNextWebsite = navigateToNextWebsite;
window.toggleTheme = toggleTheme;
window.toggleFullscreen = toggleFullscreen;

// ============================================================================================================
// DEBUG HELPERS
// ============================================================================================================
// Helpful functions for debugging - can be removed in production

/**
 * Debug function to check current website state
 * Usage: Open browser console and type: window.debugWebsiteState()
 */
window.debugWebsiteState = function() {
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║     WEBSITE STATE DEBUG INFO              ║');
    console.log('╚═══════════════════════════════════════════╝');
    console.log('Current Website ID:', currentWebsiteId);
    console.log('Current Website Object:', currentWebsite);
    console.log('Is Preview Active:', isPreviewActive);
    console.log('Available Websites:', getWebsites());
    console.log('Theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Fullscreen:', !!(document.fullscreenElement || document.webkitFullscreenElement));
    console.log('═══════════════════════════════════════════');
};

/**
 * Debug function to test notifications
 * Usage: window.testNotifications()
 */
window.testNotifications = function() {
    showNotification('This is an info notification', 'info');
    setTimeout(() => showNotification('This is a success notification', 'success'), 500);
    setTimeout(() => showNotification('This is a warning notification', 'warning'), 1000);
    setTimeout(() => showNotification('This is an error notification', 'error'), 1500);
};

/**
 * Debug function to test preview functionality
 * Usage: window.testPreview()
 */
window.testPreview = function() {
    if (currentWebsite && currentWebsite.liveUrl) {
        console.log('🧪 Testing preview with current website');
        showWebsitePreview(currentWebsite);
    } else {
        console.error('❌ No website loaded or no live URL available');
        showNotification('Cannot test preview - no live URL', 'error');
    }
};

/**
 * Debug function to check iframe status
 * Usage: window.checkIframeStatus()
 */
window.checkIframeStatus = function() {
    const websiteFrame = document.getElementById('websiteFrame');
    const websiteContainer = document.getElementById('websiteContainer');
    
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║       IFRAME STATUS DEBUG INFO            ║');
    console.log('╚═══════════════════════════════════════════╝');
    console.log('Iframe Element:', websiteFrame);
    console.log('Container Element:', websiteContainer);
    console.log('Iframe Source:', websiteFrame?.src || 'No source');
    console.log('Container Display:', websiteContainer?.style.display || 'default');
    console.log('Is Preview Active:', isPreviewActive);
    console.log('═══════════════════════════════════════════');
};

// ============================================================================================================
// AUTO-INITIALIZATION
// ============================================================================================================
// Initialize page when DOM is ready

if (document.readyState === 'loading') {
    // DOM still loading, wait for DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', initializeWebsiteDetailPage);
    console.log('⏳ Waiting for DOM to load...');
} else {
    // DOM already loaded, initialize immediately
    initializeWebsiteDetailPage();
}

// ============================================================================================================
// INITIALIZATION COMPLETE
// ============================================================================================================

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║  WEBSITE DETAIL PAGE - JavaScript Loaded Successfully            ║');
console.log('║  Author: Arsh Verma                                              ║');
console.log('║  Portfolio: ArshCreates                                          ║');
console.log('║                                                                  ║');
console.log('║  Available Debug Commands:                                       ║');
console.log('║  • window.debugWebsiteState()  - View current state              ║');
console.log('║  • window.testNotifications()  - Test notification system        ║');
console.log('║  • window.testPreview()        - Test preview functionality      ║');
console.log('║  • window.checkIframeStatus()  - Check iframe status             ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝');

// ============================================================================================================
// END OF FILE
// ============================================================================================================