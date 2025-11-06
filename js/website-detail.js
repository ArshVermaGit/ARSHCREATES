// ==========================================
// WEBSITE DETAIL PAGE - Individual website presentation
// Handles website preview, navigation, and interactions
// ==========================================

// Global Variables
let currentWebsiteId = null;
let currentWebsite = null;
let websiteImages = [];

// Initialize Website Detail Page
function initializeWebsiteDetailPage() {
    // Get website ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentWebsiteId = parseInt(urlParams.get('id'));
    
    if (!currentWebsiteId) {
        showNotification('Website not found', 'error');
        setTimeout(() => window.location.href = 'websites.html', 2000);
        return;
    }
    
    loadWebsiteDetails(currentWebsiteId);
    setupWebsiteDetailEventListeners();
}

// Load Website Details
function loadWebsiteDetails(websiteId) {
    const website = PORTFOLIO_DATA.websites.find(w => w.id === websiteId);
    if (!website) {
        showNotification('Website not found', 'error');
        setTimeout(() => window.location.href = 'websites.html', 2000);
        return;
    }
    
    currentWebsite = website;
    websiteImages = [website.image, ...(website.screenshots || [])];
    
    displayWebsiteDetails(website);
    setupWebsiteNavigation();
}

// Display Website Details
function displayWebsiteDetails(website) {
    // Update page title
    document.title = `${website.name} - Arsh Verma`;
    
    // Update preview image
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = website.image;
        previewImage.alt = website.name;
    }
    
    // Update website information
    document.getElementById('websiteTitle').textContent = website.name;
    document.getElementById('websiteCategory').textContent = website.category;
    document.getElementById('websiteRating').textContent = website.rating;
    document.getElementById('websiteStatus').textContent = website.status;
    
    document.getElementById('websiteOverview').textContent = website.overview;
    document.getElementById('websiteDescription').textContent = website.description;
    
    // Update details
    document.getElementById('launchDate').textContent = formatDate(website.launchDate);
    document.getElementById('developmentTime').textContent = website.developmentTime;
    document.getElementById('userBase').textContent = website.userBase;
    
    // Update features list
    const featuresList = document.getElementById('featuresList');
    if (featuresList) {
        featuresList.innerHTML = website.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
    }
    
    // Update technologies
    const techList = document.getElementById('techList');
    if (techList) {
        techList.innerHTML = website.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    }
    
    // Update stats circles
    document.getElementById('ratingCircle').textContent = website.rating;
    document.getElementById('userCountCircle').textContent = website.userBase;
    document.getElementById('performanceCircle').textContent = '98%';
    
    // Update action buttons
    const repositoryBtn = document.getElementById('repositoryBtn');
    const liveUrlBtn = document.getElementById('liveUrlBtn');
    
    if (repositoryBtn) {
        repositoryBtn.href = website.repositoryUrl;
    }
    
    if (liveUrlBtn) {
        if (website.status === 'Live' && website.liveUrl && website.liveUrl !== '#') {
            liveUrlBtn.href = website.liveUrl;
        } else {
            liveUrlBtn.style.display = 'none';
        }
    }
    
    // Update visit button state
    const visitBtn = document.getElementById('visitBtn');
    if (visitBtn) {
        if (website.status === 'In Development') {
            visitBtn.innerHTML = '<i class="fas fa-clock"></i><span>Coming Soon</span>';
            visitBtn.disabled = true;
        } else {
            visitBtn.innerHTML = '<i class="fas fa-external-link-alt"></i><span>Visit Website</span>';
            visitBtn.onclick = () => visitWebsite(website);
        }
    }
    
    // Load screenshots
    loadWebsiteScreenshots(website);
}

// Load Website Screenshots
function loadWebsiteScreenshots(website) {
    const screenshotsContainer = document.getElementById('appScreenshots');
    if (!screenshotsContainer || !website.screenshots) return;
    
    screenshotsContainer.innerHTML = website.screenshots.map((screenshot, index) => `
        <div class="screenshot-thumbnail" data-screenshot-index="${index}">
            <img src="${screenshot}" alt="${website.name} screenshot ${index + 1}" loading="lazy">
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
    if (previewImage && websiteImages[index]) {
        previewImage.src = websiteImages[index];
    }
}

// Setup Website Detail Event Listeners
function setupWebsiteDetailEventListeners() {
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareWebsite);
    }
    
    // Fullscreen button
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Close preview button
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', closePreview);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Setup Website Navigation
function setupWebsiteNavigation() {
    const prevWebsiteBtn = document.getElementById('prevWebsite');
    const nextWebsiteBtn = document.getElementById('nextWebsite');
    
    if (prevWebsiteBtn) {
        prevWebsiteBtn.addEventListener('click', navigateToPreviousWebsite);
    }
    
    if (nextWebsiteBtn) {
        nextWebsiteBtn.addEventListener('click', navigateToNextWebsite);
    }
}

// Navigation Functions
function navigateToPreviousWebsite() {
    const websites = PORTFOLIO_DATA.websites;
    const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
    const prevIndex = (currentIndex - 1 + websites.length) % websites.length;
    const prevWebsite = websites[prevIndex];
    
    window.location.href = `website-detail.html?id=${prevWebsite.id}`;
}

function navigateToNextWebsite() {
    const websites = PORTFOLIO_DATA.websites;
    const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
    const nextIndex = (currentIndex + 1) % websites.length;
    const nextWebsite = websites[nextIndex];
    
    window.location.href = `website-detail.html?id=${nextWebsite.id}`;
}

// Website Interaction Functions
function visitWebsite(website) {
    if (website.liveUrl && website.liveUrl !== '#') {
        window.open(website.liveUrl, '_blank');
        showNotification(`Opening ${website.name}...`, 'success');
    }
}

function toggleFullscreen() {
    const websiteContainer = document.getElementById('websiteContainer');
    if (!websiteContainer) return;
    
    if (!document.fullscreenElement) {
        if (websiteContainer.requestFullscreen) {
            websiteContainer.requestFullscreen();
        } else if (websiteContainer.webkitRequestFullscreen) {
            websiteContainer.webkitRequestFullscreen();
        } else if (websiteContainer.msRequestFullscreen) {
            websiteContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function closePreview() {
    window.location.href = 'websites.html';
}

// Share Functionality
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: currentWebsite.name,
            text: currentWebsite.overview,
            url: window.location.href
        }).then(() => {
            showNotification('Website shared successfully', 'success');
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
        showNotification('Website link copied to clipboard', 'success');
    }).catch(() => {
        showNotification('Could not share website', 'error');
    });
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateToPreviousWebsite();
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextWebsite();
            break;
        case 'Escape':
            closePreview();
            break;
        case ' ':
        case 'Enter':
            if (currentWebsite.status === 'Live') {
                e.preventDefault();
                visitWebsite(currentWebsite);
            }
            break;
    }
}

// Fullscreen change handler
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        const isFullscreen = !!document.fullscreenElement;
        fullscreenBtn.innerHTML = isFullscreen ? 
            '<i class="fas fa-compress"></i>' : 
            '<i class="fas fa-expand"></i>';
        fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsiteDetailPage);
} else {
    initializeWebsiteDetailPage();
}