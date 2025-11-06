// ==========================================
// APP DETAIL PAGE - Individual app presentation
// Handles app preview, navigation, and interactions
// ==========================================

// Global Variables
let currentAppId = null;
let currentApp = null;
let appImages = [];
let currentScreenshotIndex = 0;

// Initialize App Detail Page
function initializeAppDetailPage() {
    console.log('Initializing app detail page...');
    
    // Get app ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentAppId = parseInt(urlParams.get('id'));
    const autoDownload = urlParams.get('download') === 'true';
    
    if (!currentAppId || isNaN(currentAppId)) {
        showNotification('App not found', 'error');
        setTimeout(() => window.location.href = 'apps.html', 2000);
        return;
    }
    
    loadAppDetails(currentAppId);
    setupAppDetailEventListeners();
    
    // Auto-download if requested
    if (autoDownload) {
        setTimeout(() => {
            if (currentApp && currentApp.status === 'Live') {
                showDownloadModal(currentApp);
            }
        }, 500);
    }
}

// Load App Details
function loadAppDetails(appId) {
    const apps = getApps();
    const app = apps.find(a => a.id === appId);
    
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
    
    // Update app title and meta
    const appTitle = document.getElementById('appTitle');
    if (appTitle) appTitle.textContent = app.name;
    
    const appCategory = document.getElementById('appCategory');
    if (appCategory) appCategory.textContent = app.category;
    
    const appRating = document.getElementById('appRating');
    if (appRating) appRating.textContent = app.rating;
    
    const appStatus = document.getElementById('appStatus');
    if (appStatus) {
        appStatus.textContent = app.status;
        appStatus.className = 'app-status ' + (app.status === 'Live' ? 'status-live' : 'status-dev');
    }
    
    // Update overview and description
    const appOverview = document.getElementById('appOverview');
    if (appOverview) appOverview.textContent = app.overview;
    
    const appDescription = document.getElementById('appDescription');
    if (appDescription) appDescription.textContent = app.description;
    
    // Update detail cards
    updateDetailCard('launchDate', formatDate(app.launchDate));
    updateDetailCard('developmentTime', app.developmentTime);
    updateDetailCard('downloadCount', app.downloadCount);
    updateDetailCard('appPlatform', app.platform);
    
    // Update features list
    const featuresList = document.getElementById('featuresList');
    if (featuresList && app.features) {
        featuresList.innerHTML = app.features.map(feature => 
            `<li><span>${feature}</span></li>`
        ).join('');
    }
    
    // Update technologies
    const techList = document.getElementById('techList');
    if (techList && app.technologies) {
        techList.innerHTML = app.technologies.map(tech => 
            `<span>${tech}</span>`
        ).join('');
    }
    
    // Update stats circles
    updateStatCircle('ratingCircle', app.rating.toString());
    updateStatCircle('downloadCountCircle', app.downloadCount);
    updateStatCircle('retentionCircle', '85%');
    
    // Update repository button
    const repositoryBtn = document.getElementById('repositoryBtn');
    if (repositoryBtn && app.repositoryUrl) {
        repositoryBtn.href = app.repositoryUrl;
        repositoryBtn.style.display = 'flex';
    } else if (repositoryBtn) {
        repositoryBtn.style.display = 'none';
    }
    
    // Update download buttons
    updateDownloadButtons(app);
    
    // Load screenshots
    loadAppScreenshots(app);
    
    // Animate content
    animateAppDetails();
}

// Update Detail Card
function updateDetailCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

// Update Stat Circle
function updateStatCircle(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '0';
    }
}

// Update Download Buttons
function updateDownloadButtons(app) {
    const appStoreBtn = document.getElementById('appStoreBtn');
    const playStoreBtn = document.getElementById('playStoreBtn');
    
    if (appStoreBtn) {
        if (app.status === 'Live' && app.appStoreUrl && app.appStoreUrl !== '#') {
            appStoreBtn.href = app.appStoreUrl;
            appStoreBtn.style.display = 'flex';
            appStoreBtn.onclick = (e) => {
                e.preventDefault();
                window.open(app.appStoreUrl, '_blank');
                showNotification('Opening App Store...', 'success');
            };
        } else {
            appStoreBtn.style.display = 'none';
        }
    }
    
    if (playStoreBtn) {
        if (app.status === 'Live' && app.playStoreUrl && app.playStoreUrl !== '#') {
            playStoreBtn.href = app.playStoreUrl;
            playStoreBtn.style.display = 'flex';
            playStoreBtn.onclick = (e) => {
                e.preventDefault();
                window.open(app.playStoreUrl, '_blank');
                showNotification('Opening Google Play...', 'success');
            };
        } else {
            playStoreBtn.style.display = 'none';
        }
    }
    
    // Hide overlay if no download buttons are available
    const downloadButtons = document.querySelector('.download-buttons');
    if (downloadButtons) {
        const hasButtons = (appStoreBtn && appStoreBtn.style.display !== 'none') || 
                          (playStoreBtn && playStoreBtn.style.display !== 'none');
        downloadButtons.style.display = hasButtons ? 'flex' : 'none';
    }
}

// Load App Screenshots
function loadAppScreenshots(app) {
    const screenshotsContainer = document.getElementById('appScreenshots');
    if (!screenshotsContainer || !app.screenshots || app.screenshots.length === 0) {
        if (screenshotsContainer) screenshotsContainer.style.display = 'none';
        return;
    }
    
    screenshotsContainer.style.display = 'flex';
    screenshotsContainer.innerHTML = app.screenshots.map((screenshot, index) => `
        <div class="screenshot-thumbnail ${index === 0 ? 'active' : ''}" 
             data-screenshot-index="${index}">
            <img src="${screenshot}" alt="${app.name} screenshot ${index + 1}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/150x300/E4572E/FFFFFF?text=Screenshot'">
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
        currentScreenshotIndex = index;
        
        // Add fade transition
        previewImage.style.transition = 'opacity 0.3s ease';
        previewImage.style.opacity = '0';
        
        setTimeout(() => {
            previewImage.src = appImages[index];
            previewImage.style.opacity = '1';
        }, 300);
        
        // Update active thumbnail
        document.querySelectorAll('.screenshot-thumbnail').forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
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
    const apps = getApps();
    const currentIndex = apps.findIndex(a => a.id === currentAppId);
    
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + apps.length) % apps.length;
    const prevApp = apps[prevIndex];
    
    window.location.href = `app-detail.html?id=${prevApp.id}`;
}

function navigateToNextApp() {
    const apps = getApps();
    const currentIndex = apps.findIndex(a => a.id === currentAppId);
    
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % apps.length;
    const nextApp = apps[nextIndex];
    
    window.location.href = `app-detail.html?id=${nextApp.id}`;
}

// App Interaction Functions
function showDownloadModal(app) {
    const hasAppStore = app.appStoreUrl && app.appStoreUrl !== '#';
    const hasPlayStore = app.playStoreUrl && app.playStoreUrl !== '#';
    
    if (hasAppStore && hasPlayStore) {
        const choice = confirm(`Download ${app.name}:\n\nClick OK for App Store\nClick Cancel for Google Play`);
        if (choice) {
            window.open(app.appStoreUrl, '_blank');
            showNotification('Opening App Store...', 'success');
        } else {
            window.open(app.playStoreUrl, '_blank');
            showNotification('Opening Google Play...', 'success');
        }
    } else if (hasAppStore) {
        window.open(app.appStoreUrl, '_blank');
        showNotification('Opening App Store...', 'success');
    } else if (hasPlayStore) {
        window.open(app.playStoreUrl, '_blank');
        showNotification('Opening Google Play...', 'success');
    } else {
        showNotification('Download links not available', 'error');
    }
}

function closePreview() {
    window.location.href = 'apps.html';
}

// Share Functionality
function shareApp() {
    if (!currentApp) return;
    
    const shareData = {
        title: currentApp.name,
        text: currentApp.overview,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                showNotification('App shared successfully', 'success');
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    fallbackShare();
                }
            });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    // Copy URL to clipboard
    const url = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('App link copied to clipboard', 'success');
            })
            .catch(() => {
                showNotification('Could not copy link', 'error');
            });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('App link copied to clipboard', 'success');
        } catch (err) {
            showNotification('Could not copy link', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // Ignore if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            if (e.shiftKey) {
                // Navigate screenshots
                if (currentScreenshotIndex > 0) {
                    showScreenshot(currentScreenshotIndex - 1);
                }
            } else {
                // Navigate apps
                navigateToPreviousApp();
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (e.shiftKey) {
                // Navigate screenshots
                if (currentScreenshotIndex < appImages.length - 1) {
                    showScreenshot(currentScreenshotIndex + 1);
                }
            } else {
                // Navigate apps
                navigateToNextApp();
            }
            break;
        case 'Escape':
            closePreview();
            break;
        case ' ':
        case 'Enter':
            if (currentApp && currentApp.status === 'Live') {
                e.preventDefault();
                showDownloadModal(currentApp);
            }
            break;
    }
}

// Animate App Details
function animateAppDetails() {
    const elements = document.querySelectorAll('.detail-card, .features-list li, .tech-tags span, .stat-item');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatStatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Make functions globally available
window.initializeAppDetailPage = initializeAppDetailPage;
window.showDownloadModal = showDownloadModal;
window.shareApp = shareApp;
window.navigateToPreviousApp = navigateToPreviousApp;
window.navigateToNextApp = navigateToNextApp;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppDetailPage);
} else {
    initializeAppDetailPage();
}