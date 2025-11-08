// ==========================================
// APP DETAIL PAGE - Individual App Presentation
// ==========================================
// This file handles:
// - Loading and displaying individual app details
// - Image preview and screenshot navigation
// - Download button functionality
// - App navigation (previous/next)
// - Share functionality
// - Keyboard shortcuts
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentAppId = null;           // Current app ID from URL
let currentApp = null;              // Current app object
let appImages = [];                 // Array of all app images (icon + screenshots)
let currentScreenshotIndex = 0;     // Currently displayed screenshot index

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize App Detail Page
 * Called automatically when page loads
 * Extracts app ID from URL and loads app details
 */
function initializeAppDetailPage() {
    console.log('🚀 Initializing app detail page...');
    
    try {
        // Extract URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        currentAppId = parseInt(urlParams.get('id'));
        const autoDownload = urlParams.get('download') === 'true';
        
        // Validate app ID
        if (!currentAppId || isNaN(currentAppId)) {
            console.error('❌ Invalid or missing app ID');
            showNotification('App not found', 'error');
            setTimeout(() => window.location.href = 'apps.html', 2000);
            return;
        }
        
        console.log(`📱 Loading app with ID: ${currentAppId}`);
        
        // Load app details
        loadAppDetails(currentAppId);
        
        // Setup event listeners
        setupAppDetailEventListeners();
        
        // Auto-download if requested via URL parameter
        if (autoDownload) {
            setTimeout(() => {
                if (currentApp && currentApp.status === 'Live') {
                    showDownloadModal(currentApp);
                }
            }, 500);
        }
        
        console.log('✅ App detail page initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing app detail page:', error);
        showNotification('Error loading app details', 'error');
        setTimeout(() => window.location.href = 'apps.html', 2000);
    }
}

// ==========================================
// DATA LOADING
// ==========================================

/**
 * Load App Details from Data
 * @param {number} appId - The ID of the app to load
 */
function loadAppDetails(appId) {
    try {
        // Get all apps from data.js
        const apps = getApps();
        
        // Find the specific app
        const app = apps.find(a => a.id === appId);
        
        // Handle app not found
        if (!app) {
            console.error(`❌ App with ID ${appId} not found`);
            showNotification('App not found', 'error');
            setTimeout(() => window.location.href = 'apps.html', 2000);
            return;
        }
        
        console.log('📦 App loaded:', app.name);
        
        // Store current app globally
        currentApp = app;
        
        // Prepare images array (main image + screenshots)
        appImages = [app.image];
        if (app.screenshots && app.screenshots.length > 0) {
            appImages.push(...app.screenshots);
        }
        
        console.log(`🖼️ Total images: ${appImages.length}`);
        
        // Display all app details
        displayAppDetails(app);
        
        // Setup navigation arrows
        setupAppNavigation();
        
    } catch (error) {
        console.error('❌ Error loading app details:', error);
        showNotification('Error loading app', 'error');
    }
}

// ==========================================
// DISPLAY FUNCTIONS
// ==========================================

/**
 * Display All App Details on Page
 * @param {object} app - The app object to display
 */
function displayAppDetails(app) {
    try {
        console.log('🎨 Displaying app details...');
        
        // Update page title
        document.title = `${app.name} - Arsh Verma`;
        
        // Update preview image
        updatePreviewImage(app);
        
        // Update app header information
        updateAppHeader(app);
        
        // Update description sections
        updateDescriptions(app);
        
        // Update detail cards (launch date, dev time, etc.)
        updateDetailCards(app);
        
        // Update features list
        updateFeatures(app);
        
        // Update technologies
        updateTechnologies(app);
        
        // Update statistics
        updateStatistics(app);
        
        // Update action buttons
        updateActionButtons(app);
        
        // Load and display screenshots
        loadAppScreenshots(app);
        
        // Animate content entrance
        animateAppDetails();
        
        console.log('✅ App details displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying app details:', error);
        showNotification('Error displaying app', 'error');
    }
}

/**
 * Update Preview Image
 * @param {object} app - The app object
 */
function updatePreviewImage(app) {
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = app.image;
        previewImage.alt = app.name;
        
        // Handle image load error
        previewImage.onerror = function() {
            console.warn('⚠️ Preview image failed to load, using placeholder');
            this.src = 'https://via.placeholder.com/400x800/E4572E/FFFFFF?text=' + encodeURIComponent(app.name);
        };
    }
}

/**
 * Update App Header Information
 * @param {object} app - The app object
 */
function updateAppHeader(app) {
    // App title
    const appTitle = document.getElementById('appTitle');
    if (appTitle) {
        appTitle.textContent = app.name;
    }
    
    // App category
    const appCategory = document.getElementById('appCategory');
    if (appCategory) {
        appCategory.textContent = app.category || 'Mobile App';
    }
    
    // App rating
    const appRating = document.getElementById('appRating');
    if (appRating) {
        appRating.textContent = app.rating || '4.5';
    }
    
    // App status
    const appStatus = document.getElementById('appStatus');
    if (appStatus) {
        appStatus.textContent = app.status || 'In Development';
        appStatus.className = 'app-status ' + (app.status === 'Live' ? 'status-live' : 'status-dev');
    }
}

/**
 * Update Description Sections
 * @param {object} app - The app object
 */
function updateDescriptions(app) {
    // Overview
    const appOverview = document.getElementById('appOverview');
    if (appOverview) {
        appOverview.textContent = app.overview || app.description || 'No overview available.';
    }
    
    // Description
    const appDescription = document.getElementById('appDescription');
    if (appDescription) {
        appDescription.textContent = app.description || app.overview || 'No description available.';
    }
}

/**
 * Update Detail Cards (Launch Date, Dev Time, Downloads, Platform)
 * @param {object} app - The app object
 */
function updateDetailCards(app) {
    // Launch Date
    updateDetailCard('launchDate', formatDate(app.launchDate));
    
    // Development Time
    updateDetailCard('developmentTime', app.developmentTime || 'N/A');
    
    // Download Count
    updateDetailCard('downloadCount', app.downloadCount || '0');
    
    // Platform
    updateDetailCard('appPlatform', app.platform || 'Cross-Platform');
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
 * Update Features List
 * @param {object} app - The app object
 */
function updateFeatures(app) {
    const featuresList = document.getElementById('featuresList');
    if (!featuresList) {
        console.warn('⚠️ Features list element not found');
        return;
    }
    
    if (app.features && app.features.length > 0) {
        featuresList.innerHTML = app.features.map(feature => 
            `<li><span>${feature}</span></li>`
        ).join('');
    } else {
        featuresList.innerHTML = '<li><span>Feature information not available</span></li>';
    }
}

/**
 * Update Technologies Used
 * @param {object} app - The app object
 */
function updateTechnologies(app) {
    const techList = document.getElementById('techList');
    if (!techList) {
        console.warn('⚠️ Tech list element not found');
        return;
    }
    
    if (app.technologies && app.technologies.length > 0) {
        techList.innerHTML = app.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    } else {
        techList.innerHTML = '<span class="tech-tag">Technology stack not specified</span>';
    }
}

/**
 * Update App Statistics
 * @param {object} app - The app object
 */
function updateStatistics(app) {
    // Rating Circle
    updateStatCircle('ratingCircle', app.rating ? app.rating.toString() : '4.5');
    
    // Download Count Circle
    updateStatCircle('downloadCountCircle', formatStatNumber(app.downloadCount || 0));
    
    // Retention Circle (default value)
    updateStatCircle('retentionCircle', '85%');
}

/**
 * Update Single Stat Circle
 * @param {string} elementId - The element ID
 * @param {string} value - The value to display
 */
function updateStatCircle(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '0';
    } else {
        console.warn(`⚠️ Stat circle not found: ${elementId}`);
    }
}

/**
 * Update Action Buttons (Repository, Download)
 * @param {object} app - The app object
 */
function updateActionButtons(app) {
    // Repository button
    const repositoryBtn = document.getElementById('repositoryBtn');
    if (repositoryBtn) {
        if (app.repositoryUrl && app.repositoryUrl !== '#') {
            repositoryBtn.href = app.repositoryUrl;
            repositoryBtn.style.display = 'flex';
            repositoryBtn.onclick = (e) => {
                e.preventDefault();
                window.open(app.repositoryUrl, '_blank');
                showNotification('Opening repository...', 'success');
            };
        } else {
            repositoryBtn.style.display = 'none';
        }
    }
    
    // Download buttons (App Store & Play Store)
    updateDownloadButtons(app);
}

/**
 * Update Download Buttons (App Store and Play Store)
 * @param {object} app - The app object
 */
function updateDownloadButtons(app) {
    const appStoreBtn = document.getElementById('appStoreBtn');
    const playStoreBtn = document.getElementById('playStoreBtn');
    
    let hasVisibleButton = false;
    
    // App Store Button
    if (appStoreBtn) {
        if (app.status === 'Live' && app.appStoreUrl && app.appStoreUrl !== '#') {
            appStoreBtn.href = app.appStoreUrl;
            appStoreBtn.style.display = 'flex';
            hasVisibleButton = true;
            
            appStoreBtn.onclick = (e) => {
                e.preventDefault();
                window.open(app.appStoreUrl, '_blank');
                showNotification('Opening App Store...', 'success');
            };
        } else {
            appStoreBtn.style.display = 'none';
        }
    }
    
    // Play Store Button
    if (playStoreBtn) {
        if (app.status === 'Live' && app.playStoreUrl && app.playStoreUrl !== '#') {
            playStoreBtn.href = app.playStoreUrl;
            playStoreBtn.style.display = 'flex';
            hasVisibleButton = true;
            
            playStoreBtn.onclick = (e) => {
                e.preventDefault();
                window.open(app.playStoreUrl, '_blank');
                showNotification('Opening Google Play...', 'success');
            };
        } else {
            playStoreBtn.style.display = 'none';
        }
    }
    
    // Hide entire download buttons container if no buttons are visible
    const downloadButtons = document.querySelector('.download-buttons');
    if (downloadButtons) {
        downloadButtons.style.display = hasVisibleButton ? 'flex' : 'none';
    }
}

// ==========================================
// SCREENSHOT FUNCTIONS
// ==========================================

/**
 * Load and Display App Screenshots
 * @param {object} app - The app object
 */
function loadAppScreenshots(app) {
    const screenshotsContainer = document.getElementById('appScreenshots');
    
    // Check if screenshots exist
    if (!screenshotsContainer || !app.screenshots || app.screenshots.length === 0) {
        if (screenshotsContainer) {
            screenshotsContainer.style.display = 'none';
        }
        console.log('ℹ️ No screenshots available');
        return;
    }
    
    console.log(`📸 Loading ${app.screenshots.length} screenshots`);
    
    // Display screenshots container
    screenshotsContainer.style.display = 'flex';
    
    // Generate screenshot thumbnails
    screenshotsContainer.innerHTML = app.screenshots.map((screenshot, index) => `
        <div class="screenshot-thumbnail ${index === 0 ? 'active' : ''}" 
             data-screenshot-index="${index + 1}"
             role="button"
             tabindex="0"
             aria-label="View screenshot ${index + 1}">
            <img src="${screenshot}" 
                 alt="${app.name} screenshot ${index + 1}" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/150x300/E4572E/FFFFFF?text=Screenshot+${index + 1}'">
        </div>
    `).join('');
    
    // Add click events to thumbnails
    const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
    thumbnails.forEach(thumb => {
        // Click event
        thumb.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-screenshot-index'));
            showScreenshot(index);
        });
        
        // Keyboard event (Enter/Space)
        thumb.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const index = parseInt(this.getAttribute('data-screenshot-index'));
                showScreenshot(index);
            }
        });
    });
}

/**
 * Show Specific Screenshot
 * @param {number} index - The screenshot index (1-based for screenshots)
 */
function showScreenshot(index) {
    const previewImage = document.getElementById('previewImage');
    
    if (!previewImage || !appImages[index]) {
        console.warn(`⚠️ Screenshot ${index} not found`);
        return;
    }
    
    console.log(`🖼️ Showing screenshot ${index}`);
    
    // Update current index
    currentScreenshotIndex = index;
    
    // Add fade transition
    previewImage.style.transition = 'opacity 0.3s ease';
    previewImage.style.opacity = '0';
    
    // Change image after fade out
    setTimeout(() => {
        previewImage.src = appImages[index];
        previewImage.style.opacity = '1';
        
        // Handle image load error
        previewImage.onerror = function() {
            console.warn(`⚠️ Screenshot ${index} failed to load`);
            this.src = 'https://via.placeholder.com/400x800/E4572E/FFFFFF?text=Screenshot+' + index;
        };
    }, 300);
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
    thumbnails.forEach((thumb, i) => {
        // Screenshots start at index 1 (index 0 is the main app image)
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
 * Setup All Event Listeners for App Detail Page
 */
function setupAppDetailEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareApp);
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
 * Setup App Navigation (Previous/Next Buttons)
 */
function setupAppNavigation() {
    const prevAppBtn = document.getElementById('prevApp');
    const nextAppBtn = document.getElementById('nextApp');
    
    if (prevAppBtn) {
        prevAppBtn.addEventListener('click', navigateToPreviousApp);
    }
    
    if (nextAppBtn) {
        nextAppBtn.addEventListener('click', navigateToNextApp);
    }
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

/**
 * Navigate to Previous App
 */
function navigateToPreviousApp() {
    try {
        const apps = getApps();
        const currentIndex = apps.findIndex(a => a.id === currentAppId);
        
        if (currentIndex === -1) {
            console.error('❌ Current app not found in apps list');
            return;
        }
        
        // Calculate previous index (wrap around)
        const prevIndex = (currentIndex - 1 + apps.length) % apps.length;
        const prevApp = apps[prevIndex];
        
        console.log(`⬅️ Navigating to previous app: ${prevApp.name}`);
        
        // Navigate to previous app
        window.location.href = `app-detail.html?id=${prevApp.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to previous app:', error);
        showNotification('Navigation error', 'error');
    }
}

/**
 * Navigate to Next App
 */
function navigateToNextApp() {
    try {
        const apps = getApps();
        const currentIndex = apps.findIndex(a => a.id === currentAppId);
        
        if (currentIndex === -1) {
            console.error('❌ Current app not found in apps list');
            return;
        }
        
        // Calculate next index (wrap around)
        const nextIndex = (currentIndex + 1) % apps.length;
        const nextApp = apps[nextIndex];
        
        console.log(`➡️ Navigating to next app: ${nextApp.name}`);
        
        // Navigate to next app
        window.location.href = `app-detail.html?id=${nextApp.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to next app:', error);
        showNotification('Navigation error', 'error');
    }
}

// ==========================================
// INTERACTION FUNCTIONS
// ==========================================

/**
 * Show Download Modal
 * Handles download links for App Store and Play Store
 * @param {object} app - The app object
 */
function showDownloadModal(app) {
    if (!app) {
        console.error('❌ No app provided to download modal');
        return;
    }
    
    const hasAppStore = app.appStoreUrl && app.appStoreUrl !== '#';
    const hasPlayStore = app.playStoreUrl && app.playStoreUrl !== '#';
    
    console.log(`📥 Download modal - App Store: ${hasAppStore}, Play Store: ${hasPlayStore}`);
    
    if (hasAppStore && hasPlayStore) {
        // Both stores available - let user choose
        const choice = confirm(
            `Download ${app.name}:\n\n` +
            `Click OK for App Store\n` +
            `Click Cancel for Google Play`
        );
        
        if (choice) {
            window.open(app.appStoreUrl, '_blank');
            showNotification('Opening App Store...', 'success');
        } else {
            window.open(app.playStoreUrl, '_blank');
            showNotification('Opening Google Play...', 'success');
        }
    } else if (hasAppStore) {
        // Only App Store available
        window.open(app.appStoreUrl, '_blank');
        showNotification('Opening App Store...', 'success');
    } else if (hasPlayStore) {
        // Only Play Store available
        window.open(app.playStoreUrl, '_blank');
        showNotification('Opening Google Play...', 'success');
    } else {
        // No download links available
        showNotification('Download links not available yet', 'error');
    }
}

/**
 * Close Preview and Return to Apps Page
 */
function closePreview() {
    console.log('🔙 Closing preview and returning to apps page');
    window.location.href = 'apps.html';
}

// ==========================================
// SHARE FUNCTIONALITY
// ==========================================

/**
 * Share App using Web Share API or Clipboard
 */
function shareApp() {
    if (!currentApp) {
        console.error('❌ No app to share');
        return;
    }
    
    console.log(`📤 Sharing app: ${currentApp.name}`);
    
    const shareData = {
        title: currentApp.name,
        text: currentApp.overview || currentApp.description || 'Check out this app!',
        url: window.location.href
    };
    
    // Try Web Share API first (mobile devices)
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                console.log('✅ App shared successfully via Web Share API');
                showNotification('App shared successfully', 'success');
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
                showNotification('App link copied to clipboard', 'success');
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
                showNotification('App link copied to clipboard', 'success');
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
 * Arrow Left: Previous app (or previous screenshot with Shift)
 * Arrow Right: Next app (or next screenshot with Shift)
 * Escape: Close preview
 * Enter/Space: Download app
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
                // Navigate screenshots backward
                if (currentScreenshotIndex > 1) {
                    showScreenshot(currentScreenshotIndex - 1);
                } else if (currentScreenshotIndex === 1) {
                    // Go back to main image
                    showScreenshot(0);
                }
            } else {
                // Navigate to previous app
                navigateToPreviousApp();
            }
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            if (e.shiftKey) {
                // Navigate screenshots forward
                if (currentScreenshotIndex < appImages.length - 1) {
                    showScreenshot(currentScreenshotIndex + 1);
                }
            } else {
                // Navigate to next app
                navigateToNextApp();
            }
            break;
            
        case 'Escape':
            e.preventDefault();
            closePreview();
            break;
            
        case ' ':
        case 'Enter':
            // Download app (only if Live)
            if (currentApp && currentApp.status === 'Live') {
                e.preventDefault();
                showDownloadModal(currentApp);
            }
            break;
    }
}

// ==========================================
// ANIMATION
// ==========================================

/**
 * Animate App Details Entrance
 * Adds staggered fade-in animation to detail elements
 */
function animateAppDetails() {
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

/**
 * Format Number to Readable Stat (K, M)
 * @param {number|string} num - The number to format
 * @returns {string} Formatted number string
 */
function formatStatNumber(num) {
    // Convert to number if string
    const number = typeof num === 'string' ? parseFloat(num) : num;
    
    // Check if valid number
    if (isNaN(number)) return '0';
    
    // Format based on size
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    
    return number.toString();
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

// Make functions globally available for inline event handlers
window.initializeAppDetailPage = initializeAppDetailPage;
window.showDownloadModal = showDownloadModal;
window.shareApp = shareApp;
window.navigateToPreviousApp = navigateToPreviousApp;
window.navigateToNextApp = navigateToNextApp;
window.closePreview = closePreview;
window.showScreenshot = showScreenshot;

// ==========================================
// AUTO-INITIALIZATION
// ==========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppDetailPage);
} else {
    // DOM already loaded
    initializeAppDetailPage();
}

console.log('📱 App Detail module loaded successfully');