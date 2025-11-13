// ==========================================
// APP DETAIL PAGE - INDIVIDUAL APP PRESENTATION
// ==========================================
// Developer: Arsh Verma (ArshCreates)
// Portfolio: https://arshcreates.com
// 
// This module handles the complete functionality of the app detail page including:
// - Loading and displaying individual app details from data.js
// - Dynamic image preview with screenshot gallery navigation
// - Download button functionality (App Store & Play Store)
// - App navigation (previous/next) with keyboard shortcuts
// - Share functionality via Web Share API and clipboard fallback
// - Keyboard shortcuts for enhanced navigation
// - Smooth animations and transitions
// - Error handling and user notifications
// 
// Dependencies:
// - data.js: App data source (getApps function)
// - utils.js: Utility functions (showNotification)
// - script.js: Core site functionality
// 
// URL Parameters:
// - id: App ID to display (required)
// - download: Auto-open download modal if 'true'
// 
// Example: app-detail.html?id=1&download=true
// ==========================================

'use strict';

// ==========================================
// GLOBAL VARIABLES
// Stores current app state and navigation data
// ==========================================

let currentAppId = null;           // Current app ID extracted from URL parameters
let currentApp = null;              // Current app object loaded from data.js
let appImages = [];                 // Array of all app images [main image, ...screenshots]
let currentScreenshotIndex = 0;     // Currently displayed image index (0 = main, 1+ = screenshots)

// ==========================================
// INITIALIZATION FUNCTIONS
// ==========================================

/**
 * Initialize App Detail Page
 * 
 * Primary initialization function called when page loads.
 * Extracts app ID from URL, validates it, loads app data,
 * sets up event listeners, and handles auto-download if requested.
 * 
 * URL Parameters:
 * @param {number} id - App ID (required)
 * @param {boolean} download - Auto-download flag (optional)
 * 
 * Flow:
 * 1. Extract and validate URL parameters
 * 2. Load app details from data.js
 * 3. Setup event listeners
 * 4. Handle auto-download if requested
 * 5. Display error and redirect if app not found
 * 
 * Author: Arsh Verma
 */
function initializeAppDetailPage() {
    console.log('🚀 Initializing app detail page...');
    
    try {
        // Extract URL parameters using URLSearchParams API
        const urlParams = new URLSearchParams(window.location.search);
        currentAppId = parseInt(urlParams.get('id'));
        const autoDownload = urlParams.get('download') === 'true';
        
        // Validate app ID - must be a valid number
        if (!currentAppId || isNaN(currentAppId)) {
            console.error('❌ Invalid or missing app ID in URL');
            showNotification('App not found. Redirecting...', 'error');
            
            // Redirect to apps page after 2 seconds
            setTimeout(() => {
                window.location.href = 'apps.html';
            }, 2000);
            return;
        }
        
        console.log(`📱 Loading app with ID: ${currentAppId}`);
        
        // Load app details from data.js
        loadAppDetails(currentAppId);
        
        // Setup all event listeners for interactivity
        setupAppDetailEventListeners();
        
        // Auto-download functionality if URL parameter is set
        // Useful for direct download links from other pages
        if (autoDownload) {
            setTimeout(() => {
                if (currentApp && currentApp.status === 'Live') {
                    console.log('📥 Auto-download triggered from URL parameter');
                    showDownloadModal(currentApp);
                }
            }, 500); // Small delay to ensure page is loaded
        }
        
        console.log('✅ App detail page initialized successfully');
        
    } catch (error) {
        console.error('❌ Critical error initializing app detail page:', error);
        showNotification('Error loading app details', 'error');
        
        // Redirect to apps page on critical error
        setTimeout(() => {
            window.location.href = 'apps.html';
        }, 2000);
    }
}

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

/**
 * Load App Details from Data Source
 * 
 * Fetches app data from data.js using getApps() function,
 * finds the specific app by ID, prepares image arrays,
 * and displays all app information on the page.
 * 
 * @param {number} appId - The ID of the app to load
 * 
 * Error Handling:
 * - App not found: Shows error and redirects
 * - Invalid data: Catches and logs error
 * 
 * Author: Arsh Verma
 */
function loadAppDetails(appId) {
    try {
        // Get all apps from data.js
        const apps = getApps();
        
        // Find the specific app by ID using Array.find()
        const app = apps.find(a => a.id === appId);
        
        // Handle app not found scenario
        if (!app) {
            console.error(`❌ App with ID ${appId} not found in data source`);
            showNotification('App not found. Redirecting...', 'error');
            
            setTimeout(() => {
                window.location.href = 'apps.html';
            }, 2000);
            return;
        }
        
        console.log(`📦 App loaded successfully: ${app.name}`);
        
        // Store current app globally for access across functions
        currentApp = app;
        
        // Prepare images array for gallery navigation
        // Index 0: Main app image/icon
        // Index 1+: Screenshots
        appImages = [app.image];
        if (app.screenshots && app.screenshots.length > 0) {
            appImages.push(...app.screenshots);
        }
        
        console.log(`🖼️ Total images available: ${appImages.length} (1 main + ${app.screenshots?.length || 0} screenshots)`);
        
        // Display all app details on the page
        displayAppDetails(app);
        
        // Setup navigation arrows (previous/next app)
        setupAppNavigation();
        
    } catch (error) {
        console.error('❌ Error loading app details:', error);
        showNotification('Error loading app. Please try again.', 'error');
    }
}

// ==========================================
// DISPLAY FUNCTIONS
// Handles rendering of all app information to the DOM
// ==========================================

/**
 * Display All App Details on Page
 * 
 * Master function that coordinates displaying all app information
 * by calling specialized display functions for each section.
 * 
 * Sections Updated:
 * - Page title
 * - Preview image
 * - Header (title, category, rating, status)
 * - Descriptions (overview & detailed)
 * - Detail cards (date, time, downloads, platform)
 * - Features list
 * - Technologies tags
 * - Statistics circles
 * - Action buttons (download, repository)
 * - Screenshots gallery
 * 
 * @param {Object} app - The app object containing all app data
 * 
 * Author: Arsh Verma
 */
function displayAppDetails(app) {
    try {
        console.log('🎨 Displaying app details on page...');
        
        // Update browser tab title for better UX and SEO
        document.title = `${app.name} - Arsh Verma Portfolio`;
        
        // Update each section of the page
        updatePreviewImage(app);        // Main preview image
        updateAppHeader(app);            // Title, category, rating, status
        updateDescriptions(app);         // Overview and description text
        updateDetailCards(app);          // Launch date, dev time, etc.
        updateFeatures(app);             // Features list
        updateTechnologies(app);         // Technology tags
        updateStatistics(app);           // Statistics circles
        updateActionButtons(app);        // Download and repository buttons
        
        // Load and display screenshot gallery
        loadAppScreenshots(app);
        
        // Animate content entrance for smooth UX
        animateAppDetails();
        
        console.log('✅ All app details displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying app details:', error);
        showNotification('Error displaying app information', 'error');
    }
}

/**
 * Update Preview Image
 * 
 * Sets the main preview image source and handles image load errors
 * with a fallback placeholder image.
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updatePreviewImage(app) {
    const previewImage = document.getElementById('previewImage');
    
    if (previewImage) {
        previewImage.src = app.image;
        previewImage.alt = `${app.name} - App Preview`;
        
        // Handle image load error with placeholder
        previewImage.onerror = function() {
            console.warn('⚠️ Preview image failed to load, using placeholder');
            const encodedName = encodeURIComponent(app.name);
            this.src = `https://via.placeholder.com/400x800/E4572E/FFFFFF?text=${encodedName}`;
        };
        
        console.log(`🖼️ Preview image set: ${app.image}`);
    } else {
        console.warn('⚠️ Preview image element not found in DOM');
    }
}

/**
 * Update App Header Information
 * 
 * Updates the main header section with app title, category,
 * rating, and status badge.
 * 
 * Status Classes:
 * - 'status-live': Green badge for live apps
 * - 'status-dev': Orange badge for apps in development
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updateAppHeader(app) {
    // Update app title
    const appTitle = document.getElementById('appTitle');
    if (appTitle) {
        appTitle.textContent = app.name;
        console.log(`📝 Title: ${app.name}`);
    }
    
    // Update app category badge
    const appCategory = document.getElementById('appCategory');
    if (appCategory) {
        appCategory.textContent = app.category || 'Mobile App';
    }
    
    // Update app rating (out of 5 stars)
    const appRating = document.getElementById('appRating');
    if (appRating) {
        const rating = app.rating || '4.5';
        appRating.textContent = rating;
        console.log(`⭐ Rating: ${rating}/5`);
    }
    
    // Update app status badge with appropriate styling
    const appStatus = document.getElementById('appStatus');
    if (appStatus) {
        const status = app.status || 'In Development';
        appStatus.textContent = status;
        
        // Apply conditional CSS class based on status
        appStatus.className = 'app-status ' + 
            (status === 'Live' ? 'status-live' : 'status-dev');
        
        console.log(`🔴 Status: ${status}`);
    }
}

/**
 * Update Description Sections
 * 
 * Updates both overview and detailed description sections.
 * Falls back to alternate fields if primary fields are empty.
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updateDescriptions(app) {
    // Update overview (short description)
    const appOverview = document.getElementById('appOverview');
    if (appOverview) {
        appOverview.textContent = app.overview || 
                                  app.description || 
                                  'No overview available for this app.';
    }
    
    // Update full description (detailed information)
    const appDescription = document.getElementById('appDescription');
    if (appDescription) {
        appDescription.textContent = app.description || 
                                     app.overview || 
                                     'No detailed description available for this app.';
    }
    
    console.log('📄 Descriptions updated');
}

/**
 * Update Detail Cards (Launch Date, Dev Time, Downloads, Platform)
 * 
 * Updates the four information cards displayed in a grid.
 * Uses helper function for consistent updating.
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updateDetailCards(app) {
    console.log('📊 Updating detail cards...');
    
    // Launch Date - formatted to readable date
    updateDetailCard('launchDate', formatDate(app.launchDate));
    
    // Development Time - e.g., "3 months"
    updateDetailCard('developmentTime', app.developmentTime || 'N/A');
    
    // Download Count - e.g., "10,000+"
    updateDetailCard('downloadCount', app.downloadCount || '0');
    
    // Platform - e.g., "iOS & Android"
    updateDetailCard('appPlatform', app.platform || 'Cross-Platform');
    
    console.log('✅ Detail cards updated');
}

/**
 * Update Single Detail Card
 * 
 * Generic helper function to update any detail card element.
 * Includes error logging if element not found.
 * 
 * @param {string} elementId - The DOM element ID to update
 * @param {string} value - The value to display
 * 
 * Author: Arsh Verma
 */
function updateDetailCard(elementId, value) {
    const element = document.getElementById(elementId);
    
    if (element) {
        element.textContent = value || '-';
    } else {
        console.warn(`⚠️ Detail card element not found: ${elementId}`);
    }
}

/**
 * Update Features List
 * 
 * Dynamically generates and displays the app's key features
 * as a bulleted list. Handles empty features gracefully.
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updateFeatures(app) {
    const featuresList = document.getElementById('featuresList');
    
    if (!featuresList) {
        console.warn('⚠️ Features list element not found in DOM');
        return;
    }
    
    // Check if features exist and have content
    if (app.features && app.features.length > 0) {
        // Generate feature list items dynamically
        featuresList.innerHTML = app.features.map(feature => 
            `<li><span>${feature}</span></li>`
        ).join('');
        
        console.log(`✅ ${app.features.length} features displayed`);
    } else {
        // Show placeholder if no features available
        featuresList.innerHTML = '<li><span>Feature information not available</span></li>';
        console.log('ℹ️ No features available for this app');
    }
}

/**
 * Update Technologies Used
 * 
 * Displays technology stack as styled tags/badges.
 * Shows all technologies used in app development.
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updateTechnologies(app) {
    const techList = document.getElementById('techList');
    
    if (!techList) {
        console.warn('⚠️ Technology list element not found in DOM');
        return;
    }
    
    // Check if technologies exist
    if (app.technologies && app.technologies.length > 0) {
        // Generate technology tags dynamically
        techList.innerHTML = app.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        console.log(`✅ ${app.technologies.length} technologies displayed`);
    } else {
        // Show placeholder if no technologies specified
        techList.innerHTML = '<span class="tech-tag">Technology stack not specified</span>';
        console.log('ℹ️ No technologies specified for this app');
    }
}

/**
 * Update App Statistics
 * 
 * Updates the three circular statistics displays:
 * - Rating (from app data)
 * - Download Count (formatted)
 * - Retention Rate (default 85%)
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updateStatistics(app) {
    console.log('📈 Updating statistics...');
    
    // Rating Circle - display app rating
    const rating = app.rating ? app.rating.toString() : '4.5';
    updateStatCircle('ratingCircle', rating);
    
    // Download Count Circle - format number with K/M suffix
    const downloads = formatStatNumber(app.downloadCount || 0);
    updateStatCircle('downloadCountCircle', downloads);
    
    // Retention Circle - default value (could be from app data in future)
    updateStatCircle('retentionCircle', '85%');
    
    console.log('✅ Statistics updated');
}

/**
 * Update Single Stat Circle
 * 
 * Helper function to update individual statistic circles.
 * 
 * @param {string} elementId - The DOM element ID
 * @param {string} value - The value to display
 * 
 * Author: Arsh Verma
 */
function updateStatCircle(elementId, value) {
    const element = document.getElementById(elementId);
    
    if (element) {
        element.textContent = value || '0';
    } else {
        console.warn(`⚠️ Stat circle element not found: ${elementId}`);
    }
}

/**
 * Update Action Buttons (Repository, Download)
 * 
 * Configures repository button visibility and download buttons
 * based on app availability and status.
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updateActionButtons(app) {
    console.log('🔘 Updating action buttons...');
    
    // Repository Button (GitHub link)
    const repositoryBtn = document.getElementById('repositoryBtn');
    
    if (repositoryBtn) {
        // Only show button if repository URL is available
        if (app.repositoryUrl && app.repositoryUrl !== '#') {
            repositoryBtn.href = app.repositoryUrl;
            repositoryBtn.style.display = 'flex';
            
            // Custom click handler with notification
            repositoryBtn.onclick = (e) => {
                e.preventDefault();
                window.open(app.repositoryUrl, '_blank', 'noopener,noreferrer');
                showNotification('Opening repository...', 'success');
            };
            
            console.log('✅ Repository button enabled');
        } else {
            repositoryBtn.style.display = 'none';
            console.log('ℹ️ Repository button hidden (no URL)');
        }
    }
    
    // Download Buttons (App Store & Play Store)
    updateDownloadButtons(app);
}

/**
 * Update Download Buttons (App Store and Play Store)
 * 
 * Configures download buttons based on app availability.
 * Shows/hides buttons based on store URLs and app status.
 * Hides entire download section if no buttons are visible.
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function updateDownloadButtons(app) {
    const appStoreBtn = document.getElementById('appStoreBtn');
    const playStoreBtn = document.getElementById('playStoreBtn');
    
    let hasVisibleButton = false;
    
    // ===== APP STORE BUTTON =====
    if (appStoreBtn) {
        // Only show if app is Live and App Store URL exists
        if (app.status === 'Live' && app.appStoreUrl && app.appStoreUrl !== '#') {
            appStoreBtn.href = app.appStoreUrl;
            appStoreBtn.style.display = 'flex';
            hasVisibleButton = true;
            
            // Custom click handler
            appStoreBtn.onclick = (e) => {
                e.preventDefault();
                window.open(app.appStoreUrl, '_blank', 'noopener,noreferrer');
                showNotification('Opening App Store...', 'success');
            };
            
            console.log('✅ App Store button enabled');
        } else {
            appStoreBtn.style.display = 'none';
            console.log('ℹ️ App Store button hidden');
        }
    }
    
    // ===== PLAY STORE BUTTON =====
    if (playStoreBtn) {
        // Only show if app is Live and Play Store URL exists
        if (app.status === 'Live' && app.playStoreUrl && app.playStoreUrl !== '#') {
            playStoreBtn.href = app.playStoreUrl;
            playStoreBtn.style.display = 'flex';
            hasVisibleButton = true;
            
            // Custom click handler
            playStoreBtn.onclick = (e) => {
                e.preventDefault();
                window.open(app.playStoreUrl, '_blank', 'noopener,noreferrer');
                showNotification('Opening Google Play...', 'success');
            };
            
            console.log('✅ Play Store button enabled');
        } else {
            playStoreBtn.style.display = 'none';
            console.log('ℹ️ Play Store button hidden');
        }
    }
    
    // ===== DOWNLOAD BUTTONS CONTAINER =====
    // Hide entire container if no download buttons are visible
    const downloadButtons = document.querySelector('.download-buttons');
    if (downloadButtons) {
        downloadButtons.style.display = hasVisibleButton ? 'flex' : 'none';
        console.log(hasVisibleButton ? '✅ Download buttons visible' : 'ℹ️ Download buttons hidden');
    }
}

// ==========================================
// SCREENSHOT FUNCTIONS
// Handles screenshot gallery functionality
// ==========================================

/**
 * Load and Display App Screenshots
 * 
 * Creates interactive screenshot gallery with thumbnails.
 * Each thumbnail is clickable and keyboard-accessible.
 * Handles missing screenshots gracefully.
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function loadAppScreenshots(app) {
    const screenshotsContainer = document.getElementById('appScreenshots');
    
    // Check if screenshots exist and container is available
    if (!screenshotsContainer || !app.screenshots || app.screenshots.length === 0) {
        if (screenshotsContainer) {
            screenshotsContainer.style.display = 'none';
        }
        console.log('ℹ️ No screenshots available for this app');
        return;
    }
    
    console.log(`📸 Loading ${app.screenshots.length} screenshots`);
    
    // Show screenshots container
    screenshotsContainer.style.display = 'flex';
    
    // Generate screenshot thumbnails dynamically
    // Index starts at 1 because index 0 is the main app image
    screenshotsContainer.innerHTML = app.screenshots.map((screenshot, index) => `
        <div class="screenshot-thumbnail ${index === 0 ? 'active' : ''}" 
             data-screenshot-index="${index + 1}"
             role="button"
             tabindex="0"
             aria-label="View screenshot ${index + 1} of ${app.screenshots.length}">
            <img src="${screenshot}" 
                 alt="${app.name} screenshot ${index + 1}" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/150x300/E4572E/FFFFFF?text=Screenshot+${index + 1}'">
        </div>
    `).join('');
    
    // Add interactive event listeners to thumbnails
    const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
    
    thumbnails.forEach(thumb => {
        // Click event - show full screenshot
        thumb.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-screenshot-index'));
            showScreenshot(index);
        });
        
        // Keyboard event - accessibility support (Enter/Space)
        thumb.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const index = parseInt(this.getAttribute('data-screenshot-index'));
                showScreenshot(index);
            }
        });
    });
    
    console.log('✅ Screenshot gallery loaded with interactive thumbnails');
}

/**
 * Show Specific Screenshot
 * 
 * Displays a specific screenshot in the main preview area
 * with smooth fade transition. Updates active thumbnail.
 * 
 * Index Reference:
 * - 0: Main app image
 * - 1+: Screenshots
 * 
 * @param {number} index - The screenshot index (0 = main, 1+ = screenshots)
 * 
 * Author: Arsh Verma
 */
function showScreenshot(index) {
    const previewImage = document.getElementById('previewImage');
    
    // Validate index and image existence
    if (!previewImage || !appImages[index]) {
        console.warn(`⚠️ Screenshot ${index} not found in images array`);
        return;
    }
    
    console.log(`🖼️ Showing image ${index}: ${index === 0 ? 'Main Image' : 'Screenshot ' + index}`);
    
    // Update current index for keyboard navigation
    currentScreenshotIndex = index;
    
    // Add smooth fade transition
    previewImage.style.transition = 'opacity 0.3s ease';
    previewImage.style.opacity = '0';
    
    // Change image after fade out completes
    setTimeout(() => {
        previewImage.src = appImages[index];
        previewImage.style.opacity = '1';
        
        // Handle image load error with placeholder
        previewImage.onerror = function() {
            console.warn(`⚠️ Image ${index} failed to load, using placeholder`);
            const label = index === 0 ? 'App+Icon' : 'Screenshot+' + index;
            this.src = `https://via.placeholder.com/400x800/E4572E/FFFFFF?text=${label}`;
        };
    }, 300); // Match transition duration
    
    // Update active thumbnail highlight
    const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
    thumbnails.forEach((thumb, i) => {
        // Screenshots start at index 1 (index 0 is main image)
        if (i === index - 1) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// ==========================================
// EVENT LISTENERS
// Setup all interactive elements
// ==========================================

/**
 * Setup All Event Listeners for App Detail Page
 * 
 * Initializes event listeners for all interactive elements:
 * - Share button
 * - Close preview button
 * - Keyboard navigation
 * 
 * Called once during page initialization.
 * 
 * Author: Arsh Verma
 */
function setupAppDetailEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Share Button - Opens share modal or copies link
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareApp);
        console.log('✅ Share button listener attached');
    } else {
        console.warn('⚠️ Share button not found');
    }
    
    // Close Preview Button - Returns to apps page
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreview);
        console.log('✅ Close preview listener attached');
    } else {
        console.warn('⚠️ Close preview button not found');
    }
    
    // Keyboard Navigation - Arrow keys, Escape, Enter
    document.addEventListener('keydown', handleKeyboardNavigation);
    console.log('✅ Keyboard navigation listener attached');
    
    console.log('✅ All event listeners setup complete');
}

/**
 * Setup App Navigation (Previous/Next Buttons)
 * 
 * Configures the navigation arrows to browse between apps.
 * Called after app data is loaded.
 * 
 * Author: Arsh Verma
 */
function setupAppNavigation() {
    console.log('🎯 Setting up app navigation...');
    
    const prevAppBtn = document.getElementById('prevApp');
    const nextAppBtn = document.getElementById('nextApp');
    
    if (prevAppBtn) {
        prevAppBtn.addEventListener('click', navigateToPreviousApp);
        console.log('✅ Previous app button listener attached');
    } else {
        console.warn('⚠️ Previous app button not found');
    }
    
    if (nextAppBtn) {
        nextAppBtn.addEventListener('click', navigateToNextApp);
        console.log('✅ Next app button listener attached');
    } else {
        console.warn('⚠️ Next app button not found');
    }
    
    console.log('✅ App navigation setup complete');
}

// ==========================================
// NAVIGATION FUNCTIONS
// Handle app-to-app navigation
// ==========================================

/**
 * Navigate to Previous App
 * 
 * Loads the previous app in the apps list with wrap-around.
 * If on first app, goes to last app.
 * 
 * Navigation Flow:
 * 1. Get all apps from data.js
 * 2. Find current app index
 * 3. Calculate previous index with wrap-around
 * 4. Navigate to previous app detail page
 * 
 * Author: Arsh Verma
 */
function navigateToPreviousApp() {
    try {
        const apps = getApps();
        const currentIndex = apps.findIndex(a => a.id === currentAppId);
        
        // Validate current app exists in list
        if (currentIndex === -1) {
            console.error('❌ Current app not found in apps list');
            showNotification('Navigation error', 'error');
            return;
        }
        
        // Calculate previous index with wrap-around
        // (currentIndex - 1 + apps.length) handles negative values
        const prevIndex = (currentIndex - 1 + apps.length) % apps.length;
        const prevApp = apps[prevIndex];
        
        console.log(`⬅️ Navigating to previous app: ${prevApp.name} (ID: ${prevApp.id})`);
        
        // Navigate to previous app detail page
        window.location.href = `app-detail.html?id=${prevApp.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to previous app:', error);
        showNotification('Navigation error', 'error');
    }
}

/**
 * Navigate to Next App
 * 
 * Loads the next app in the apps list with wrap-around.
 * If on last app, goes to first app.
 * 
 * Navigation Flow:
 * 1. Get all apps from data.js
 * 2. Find current app index
 * 3. Calculate next index with wrap-around
 * 4. Navigate to next app detail page
 * 
 * Author: Arsh Verma
 */
function navigateToNextApp() {
    try {
        const apps = getApps();
        const currentIndex = apps.findIndex(a => a.id === currentAppId);
        
        // Validate current app exists in list
        if (currentIndex === -1) {
            console.error('❌ Current app not found in apps list');
            showNotification('Navigation error', 'error');
            return;
        }
        
        // Calculate next index with wrap-around
        // % apps.length handles wrapping from last to first
        const nextIndex = (currentIndex + 1) % apps.length;
        const nextApp = apps[nextIndex];
        
        console.log(`➡️ Navigating to next app: ${nextApp.name} (ID: ${nextApp.id})`);
        
        // Navigate to next app detail page
        window.location.href = `app-detail.html?id=${nextApp.id}`;
        
    } catch (error) {
        console.error('❌ Error navigating to next app:', error);
        showNotification('Navigation error', 'error');
    }
}

// ==========================================
// INTERACTION FUNCTIONS
// Handle user interactions and modals
// ==========================================

/**
 * Show Download Modal
 * 
 * Handles download links for App Store and Play Store.
 * Intelligently detects available stores and presents options.
 * 
 * Logic Flow:
 * - Both stores: User chooses via confirm dialog
 * - One store: Opens directly
 * - No stores: Shows error message
 * 
 * @param {Object} app - The app object
 * 
 * Author: Arsh Verma
 */
function showDownloadModal(app) {
    if (!app) {
        console.error('❌ No app provided to download modal');
        showNotification('Download error', 'error');
        return;
    }
    
    // Check which stores are available
    const hasAppStore = app.appStoreUrl && app.appStoreUrl !== '#';
    const hasPlayStore = app.playStoreUrl && app.playStoreUrl !== '#';
    
    console.log(`📥 Download modal - App Store: ${hasAppStore}, Play Store: ${hasPlayStore}`);
    
    if (hasAppStore && hasPlayStore) {
        // Both stores available - let user choose
        const choice = confirm(
            `Download ${app.name}:\n\n` +
            `Click OK for App Store (iOS)\n` +
            `Click Cancel for Google Play (Android)`
        );
        
        if (choice) {
            window.open(app.appStoreUrl, '_blank', 'noopener,noreferrer');
            showNotification('Opening App Store...', 'success');
        } else {
            window.open(app.playStoreUrl, '_blank', 'noopener,noreferrer');
            showNotification('Opening Google Play...', 'success');
        }
    } else if (hasAppStore) {
        // Only App Store available
        window.open(app.appStoreUrl, '_blank', 'noopener,noreferrer');
        showNotification('Opening App Store...', 'success');
    } else if (hasPlayStore) {
        // Only Play Store available
        window.open(app.playStoreUrl, '_blank', 'noopener,noreferrer');
        showNotification('Opening Google Play...', 'success');
    } else {
        // No download links available
        console.warn('⚠️ No download links available');
        showNotification('Download links not available yet', 'error');
    }
}

/**
 * Close Preview and Return to Apps Page
 * 
 * Navigates back to the apps gallery page.
 * Triggered by close button or Escape key.
 * 
 * Author: Arsh Verma
 */
function closePreview() {
    console.log('🔙 Closing preview and returning to apps page');
    window.location.href = 'apps.html';
}

// ==========================================
// SHARE FUNCTIONALITY
// Web Share API with clipboard fallback
// ==========================================

/**
 * Share App using Web Share API or Clipboard
 * 
 * Attempts to share using native Web Share API (mobile).
 * Falls back to clipboard copy on desktop or if API unavailable.
 * 
 * Share Data Includes:
 * - App title
 * - App description/overview
 * - Current page URL
 * 
 * Fallback Chain:
 * 1. Web Share API (mobile native share)
 * 2. Modern Clipboard API
 * 3. Legacy document.execCommand (older browsers)
 * 
 * Author: Arsh Verma
 */
function shareApp() {
    if (!currentApp) {
        console.error('❌ No app loaded to share');
        showNotification('Share error', 'error');
        return;
    }
    
    console.log(`📤 Sharing app: ${currentApp.name}`);
    
    // Prepare share data
    const shareData = {
        title: currentApp.name,
        text: currentApp.overview || currentApp.description || 'Check out this amazing app!',
        url: window.location.href
    };
    
    // Try Web Share API first (available on mobile devices)
    if (navigator.share) {
        console.log('📱 Using Web Share API');
        
        navigator.share(shareData)
            .then(() => {
                console.log('✅ App shared successfully via Web Share API');
                showNotification('App shared successfully!', 'success');
            })
            .catch((error) => {
                // User cancelled or error occurred
                if (error.name !== 'AbortError') {
                    console.log('⚠️ Web Share failed, using fallback');
                    fallbackShare();
                } else {
                    console.log('ℹ️ Share cancelled by user');
                }
            });
    } else {
        // Fallback to clipboard copy (desktop browsers)
        console.log('💻 Web Share API not available, using clipboard fallback');
        fallbackShare();
    }
}

/**
 * Fallback Share Method (Copy to Clipboard)
 * 
 * Copies app URL to clipboard when Web Share API is unavailable.
 * Uses modern Clipboard API with legacy fallback.
 * 
 * Method Priority:
 * 1. navigator.clipboard.writeText (modern, secure)
 * 2. document.execCommand('copy') (legacy, wider support)
 * 
 * Author: Arsh Verma
 */
function fallbackShare() {
    const url = window.location.href;
    
    // Try modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        console.log('📋 Using modern Clipboard API');
        
        navigator.clipboard.writeText(url)
            .then(() => {
                console.log('✅ Link copied to clipboard via Clipboard API');
                showNotification('App link copied to clipboard!', 'success');
            })
            .catch((error) => {
                console.error('❌ Clipboard write failed:', error);
                showNotification('Could not copy link. Please try again.', 'error');
            });
    } else {
        // Fallback to legacy method for older browsers
        console.log('📋 Using legacy clipboard method');
        
        // Create temporary textarea element
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
                showNotification('App link copied to clipboard!', 'success');
            } else {
                throw new Error('Copy command returned false');
            }
        } catch (err) {
            console.error('❌ Legacy copy failed:', err);
            showNotification('Could not copy link. Please try again.', 'error');
        }
        
        // Clean up temporary element
        document.body.removeChild(textArea);
    }
}

// ==========================================
// KEYBOARD NAVIGATION
// Enhanced keyboard shortcuts for power users
// ==========================================

/**
 * Handle Keyboard Navigation
 * 
 * Provides keyboard shortcuts for enhanced navigation:
 * 
 * Keyboard Shortcuts:
 * - Arrow Left: Previous app
 * - Arrow Right: Next app
 * - Shift + Arrow Left: Previous screenshot
 * - Shift + Arrow Right: Next screenshot
 * - Escape: Close preview (return to apps page)
 * - Enter/Space: Download app (if Live)
 * - S: Share app
 * 
 * Note: Shortcuts are disabled when typing in input fields.
 * 
 * @param {KeyboardEvent} e - The keyboard event
 * 
 * Author: Arsh Verma
 */
function handleKeyboardNavigation(e) {
    // Ignore shortcuts if user is typing in an input field
    if (e.target.tagName === 'INPUT' || 
        e.target.tagName === 'TEXTAREA' || 
        e.target.isContentEditable) {
        return;
    }
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            if (e.shiftKey) {
                // Shift + Arrow Left: Navigate screenshots backward
                if (currentScreenshotIndex > 1) {
                    showScreenshot(currentScreenshotIndex - 1);
                } else if (currentScreenshotIndex === 1) {
                    // Go back to main image
                    showScreenshot(0);
                }
            } else {
                // Arrow Left: Navigate to previous app
                navigateToPreviousApp();
            }
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            if (e.shiftKey) {
                // Shift + Arrow Right: Navigate screenshots forward
                if (currentScreenshotIndex < appImages.length - 1) {
                    showScreenshot(currentScreenshotIndex + 1);
                }
            } else {
                // Arrow Right: Navigate to next app
                navigateToNextApp();
            }
            break;
            
        case 'Escape':
            // Escape: Close preview and return to apps page
            e.preventDefault();
            closePreview();
            break;
            
        case ' ':
        case 'Enter':
            // Space/Enter: Download app (only if Live)
            if (currentApp && currentApp.status === 'Live') {
                e.preventDefault();
                showDownloadModal(currentApp);
            }
            break;
            
        case 's':
        case 'S':
            // S: Share app
            if (!e.ctrlKey && !e.metaKey) { // Avoid conflicts with browser shortcuts
                e.preventDefault();
                shareApp();
            }
            break;
    }
}

// ==========================================
// ANIMATION FUNCTIONS
// Smooth entrance animations for better UX
// ==========================================

/**
 * Animate App Details Entrance
 * 
 * Adds staggered fade-in animation to detail elements.
 * Creates a smooth, professional loading experience.
 * 
 * Animated Elements:
 * - Detail cards (launch date, dev time, etc.)
 * - Feature list items
 * - Technology tags
 * - Statistic circles
 * 
 * Animation Properties:
 * - Opacity: 0 → 1
 * - Transform: translateY(30px) → translateY(0)
 * - Duration: 0.6s ease
 * - Stagger: 50ms between elements
 * 
 * Author: Arsh Verma
 */
function animateAppDetails() {
    const elements = document.querySelectorAll(
        '.detail-card, .features-list li, .tech-tags span, .stat-item'
    );
    
    console.log(`🎬 Animating ${elements.length} elements with stagger effect`);
    
    elements.forEach((element, index) => {
        // Set initial state (invisible and translated down)
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        // Animate with stagger delay
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 50); // 50ms stagger between each element
    });
    
    console.log('✅ Animation sequence started');
}

// ==========================================
// UTILITY FUNCTIONS
// Helper functions for data formatting
// ==========================================

/**
 * Format Date String to Human-Readable Format
 * 
 * Converts date strings to readable format.
 * Handles invalid dates gracefully.
 * 
 * Examples:
 * - "2024-01-15" → "January 15, 2024"
 * - Invalid date → Returns original string
 * - null/undefined → "Not specified"
 * 
 * @param {string} dateString - The date string to format (YYYY-MM-DD)
 * @returns {string} Formatted date string
 * 
 * Author: Arsh Verma
 */
function formatDate(dateString) {
    if (!dateString) {
        return 'Not specified';
    }
    
    try {
        const date = new Date(dateString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.warn(`⚠️ Invalid date format: ${dateString}`);
            return dateString; // Return original if invalid
        }
        
        // Format options for readable date
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return date.toLocaleDateString('en-US', options);
        
    } catch (error) {
        console.error('❌ Error formatting date:', error);
        return dateString; // Return original on error
    }
}

/**
 * Format Number to Readable Stat (K, M, B)
 * 
 * Converts large numbers to readable format with suffixes.
 * 
 * Examples:
 * - 1500 → "1.5K"
 * - 1500000 → "1.5M"
 * - 1500000000 → "1.5B"
 * - 500 → "500"
 * 
 * @param {number|string} num - The number to format
 * @returns {string} Formatted number string with suffix
 * 
 * Author: Arsh Verma
 */
function formatStatNumber(num) {
    // Convert to number if string
    const number = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    
    // Check if valid number
    if (isNaN(number)) {
        console.warn(`⚠️ Invalid stat number: ${num}`);
        return '0';
    }
    
    // Format based on size
    if (number >= 1000000000) {
        // Billions
        return (number / 1000000000).toFixed(1) + 'B';
    } else if (number >= 1000000) {
        // Millions
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        // Thousands
        return (number / 1000).toFixed(1) + 'K';
    }
    
    // Less than 1000 - return as is
    return number.toString();
}

// ==========================================
// GLOBAL EXPORTS
// Make functions available globally for inline handlers
// ==========================================

/**
 * Export Functions to Window Object
 * 
 * Makes key functions globally accessible for:
 * - Inline event handlers in HTML
 * - Console debugging
 * - External script access
 * 
 * Author: Arsh Verma
 */
window.initializeAppDetailPage = initializeAppDetailPage;
window.showDownloadModal = showDownloadModal;
window.shareApp = shareApp;
window.navigateToPreviousApp = navigateToPreviousApp;
window.navigateToNextApp = navigateToNextApp;
window.closePreview = closePreview;
window.showScreenshot = showScreenshot;

console.log('✅ Functions exported to window object');

// ==========================================
// AUTO-INITIALIZATION
// Automatic page initialization when DOM is ready
// ==========================================

/**
 * Auto-Initialize When DOM is Ready
 * 
 * Ensures initialization runs at the right time:
 * - If DOM is still loading: Wait for DOMContentLoaded event
 * - If DOM already loaded: Initialize immediately
 * 
 * This handles both scenarios reliably.
 * 
 * Author: Arsh Verma
 */
if (document.readyState === 'loading') {
    // DOM still loading - wait for it
    console.log('⏳ DOM loading... waiting for DOMContentLoaded event');
    document.addEventListener('DOMContentLoaded', initializeAppDetailPage);
} else {
    // DOM already loaded - initialize immediately
    console.log('✅ DOM already loaded - initializing immediately');
    initializeAppDetailPage();
}

// ==========================================
// MODULE LOAD CONFIRMATION
// ==========================================

console.log('📱 App Detail module loaded successfully');
console.log('👨‍💻 Developed by: Arsh Verma (ArshCreates)');
console.log('📅 Last updated: 2024');
console.log('🔧 Version: 2.0 - Enhanced & Documented');

// ==========================================
// END OF APP DETAIL MODULE
// ==========================================
// 
// This module provides complete functionality for the
// app detail page including image preview, navigation,
// downloads, sharing, and keyboard shortcuts.
// 
// For best results, ensure these dependencies are loaded:
// - utils.js (notification system)
// - data.js (app data source)
// - script.js (core site functionality)
// 
// Developer: Arsh Verma
// Portfolio: ArshCreates
// ==========================================