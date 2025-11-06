// ==========================================
// APP DETAIL PAGE - Individual app presentation
// Handles app preview, navigation, and interactions
// ==========================================

// Global Variables
let currentAppId = null;
let currentApp = null;
let appImages = [];

// Initialize App Detail Page
function initializeAppDetailPage() {
    // Get app ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentAppId = parseInt(urlParams.get('id'));
    
    if (!currentAppId) {
        showNotification('App not found', 'error');
        setTimeout(() => window.location.href = 'apps.html', 2000);
        return;
    }
    
    loadAppDetails(currentAppId);
    setupAppDetailEventListeners();
}

// Load App Details
function loadAppDetails(appId) {
    const app = PORTFOLIO_DATA.apps.find(a => a.id === appId);
    if (!app) {
        showNotification('App not found', 'error');
        setTimeout(() => window.location.href = 'apps.html', 2000);
        return;
    }
    
    currentApp = app;
    appImages = [app.image, ...(app.screenshots || [])];
    
    displayAppDetails(app);
    setupAppNavigation();
}

// Display App Details
function displayAppDetails(app) {
    // Update page title
    document.title = `${app.name} - Arsh Verma`;
    
    // Update preview image
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = app.image;
        previewImage.alt = app.name;
    }
    
    // Update app information
    document.getElementById('appTitle').textContent = app.name;
    document.getElementById('appCategory').textContent = app.category;
    document.getElementById('appRating').textContent = app.rating;
    document.getElementById('appStatus').textContent = app.status;
    
    document.getElementById('appOverview').textContent = app.overview;
    document.getElementById('appDescription').textContent = app.description;
    
    // Update details
    document.getElementById('launchDate').textContent = formatDate(app.launchDate);
    document.getElementById('developmentTime').textContent = app.developmentTime;
    document.getElementById('downloadCount').textContent = app.downloadCount;
    document.getElementById('appPlatform').textContent = app.platform;
    
    // Update features list
    const featuresList = document.getElementById('featuresList');
    if (featuresList) {
        featuresList.innerHTML = app.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
    }
    
    // Update technologies
    const techList = document.getElementById('techList');
    if (techList) {
        techList.innerHTML = app.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    }
    
    // Update stats circles
    document.getElementById('ratingCircle').textContent = app.rating;
    document.getElementById('downloadCountCircle').textContent = app.downloadCount;
    document.getElementById('retentionCircle').textContent = '85%';
    
    // Update repository button
    const repositoryBtn = document.getElementById('repositoryBtn');
    if (repositoryBtn) {
        repositoryBtn.href = app.repositoryUrl;
    }
    
    // Update download buttons
    const appStoreBtn = document.getElementById('appStoreBtn');
    const playStoreBtn = document.getElementById('playStoreBtn');
    
    if (appStoreBtn) {
        if (app.status === 'Live' && app.appStoreUrl && app.appStoreUrl !== '#') {
            appStoreBtn.href = app.appStoreUrl;
        } else {
            appStoreBtn.style.display = 'none';
        }
    }
    
    if (playStoreBtn) {
        if (app.status === 'Live' && app.playStoreUrl && app.playStoreUrl !== '#') {
            playStoreBtn.href = app.playStoreUrl;
        } else {
            playStoreBtn.style.display = 'none';
        }
    }
    
    // Load screenshots
    loadAppScreenshots(app);
}

// Load App Screenshots
function loadAppScreenshots(app) {
    const screenshotsContainer = document.getElementById('appScreenshots');
    if (!screenshotsContainer || !app.screenshots) return;
    
    screenshotsContainer.innerHTML = app.screenshots.map((screenshot, index) => `
        <div class="screenshot-thumbnail" data-screenshot-index="${index}">
            <img src="${screenshot}" alt="${app.name} screenshot ${index + 1}" loading="lazy">
        </div>
    `).join('');
    
    // Add click event to thumbnails
    document.querySelectorAll('.screenshot-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-screenshot-index'));
            showScreenshot(index);
        });
    });
}

// Show Screenshot
function showScreenshot(index) {
    const previewImage = document.getElementById('previewImage');
    if (previewImage && appImages[index]) {
        previewImage.src = appImages[index];
    }
}

// Setup App Detail Event Listeners
function setupAppDetailEventListeners() {
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
}

// Setup App Navigation
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

// Navigation Functions
function navigateToPreviousApp() {
    const apps = PORTFOLIO_DATA.apps;
    const currentIndex = apps.findIndex(a => a.id === currentAppId);
    const prevIndex = (currentIndex - 1 + apps.length) % apps.length;
    const prevApp = apps[prevIndex];
    
    window.location.href = `app-detail.html?id=${prevApp.id}`;
}

function navigateToNextApp() {
    const apps = PORTFOLIO_DATA.apps;
    const currentIndex = apps.findIndex(a => a.id === currentAppId);
    const nextIndex = (currentIndex + 1) % apps.length;
    const nextApp = apps[nextIndex];
    
    window.location.href = `app-detail.html?id=${nextApp.id}`;
}

// Close Preview
function closePreview() {
    window.location.href = 'apps.html';
}

// Share Functionality
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: currentApp.name,
            text: currentApp.overview,
            url: window.location.href
        }).then(() => {
            showNotification('App shared successfully', 'success');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('App link copied to clipboard', 'success');
    }).catch(() => {
        showNotification('Could not share app', 'error');
    });
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateToPreviousApp();
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextApp();
            break;
        case 'Escape':
            closePreview();
            break;
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppDetailPage);
} else {
    initializeAppDetailPage();
}