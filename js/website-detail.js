// ==========================================
// WEBSITE DETAIL PAGE - Individual website presentation
// Handles website preview, navigation, and interactions
// ==========================================

// Global Variables
let currentWebsiteId = null;
let currentWebsite = null;
let websiteImages = [];
let isPreviewActive = false;

// Initialize Website Detail Page
function initializeWebsiteDetailPage() {
    console.log('Initializing website detail page...');
    
    // Get website ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentWebsiteId = parseInt(urlParams.get('id'));
    const autoVisit = urlParams.get('visit') === 'true';
    
    if (!currentWebsiteId || isNaN(currentWebsiteId)) {
        showNotification('Website not found', 'error');
        setTimeout(() => window.location.href = 'websites.html', 2000);
        return;
    }
    
    loadWebsiteDetails(currentWebsiteId);
    setupWebsiteDetailEventListeners();
    
    // Auto-visit if requested
    if (autoVisit) {
        setTimeout(() => {
            if (currentWebsite && currentWebsite.status === 'Live') {
                visitWebsiteExternal(currentWebsite);
            }
        }, 500);
    }
}

// Load Website Details
function loadWebsiteDetails(websiteId) {
    const websites = getWebsites();
    const website = websites.find(w => w.id === websiteId);
    
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
    
    // Update website title and meta
    const websiteTitle = document.getElementById('websiteTitle');
    if (websiteTitle) websiteTitle.textContent = website.name;
    
    const websiteCategory = document.getElementById('websiteCategory');
    if (websiteCategory) websiteCategory.textContent = website.category;
    
    const websiteRating = document.getElementById('websiteRating');
    if (websiteRating) websiteRating.textContent = website.rating;
    
    const websiteStatus = document.getElementById('websiteStatus');
    if (websiteStatus) {
        websiteStatus.textContent = website.status;
        websiteStatus.className = 'website-status ' + (website.status === 'Live' ? 'status-live' : 'status-dev');
    }
    
    // Update overview and description
    const websiteOverview = document.getElementById('websiteOverview');
    if (websiteOverview) websiteOverview.textContent = website.overview;
    
    const websiteDescription = document.getElementById('websiteDescription');
    if (websiteDescription) websiteDescription.textContent = website.description;
    
    // Update detail cards
    updateDetailCard('launchDate', formatDate(website.launchDate));
    updateDetailCard('developmentTime', website.developmentTime);
    updateDetailCard('userBase', website.userBase);
    
    // Update features list
    const featuresList = document.getElementById('featuresList');
    if (featuresList && website.features) {
        featuresList.innerHTML = website.features.map(feature => 
            `<li><span>${feature}</span></li>`
        ).join('');
    }
    
    // Update technologies
    const techList = document.getElementById('techList');
    if (techList && website.technologies) {
        techList.innerHTML = website.technologies.map(tech => 
            `<span>${tech}</span>`
        ).join('');
    }
    
    // Update stats circles
    updateStatCircle('ratingCircle', website.rating.toString());
    updateStatCircle('userCountCircle', website.userBase);
    updateStatCircle('performanceCircle', '98%');
    
    // Update action buttons
    const repositoryBtn = document.getElementById('repositoryBtn');
    if (repositoryBtn && website.repositoryUrl) {
        repositoryBtn.href = website.repositoryUrl;
        repositoryBtn.style.display = 'flex';
    } else if (repositoryBtn) {
        repositoryBtn.style.display = 'none';
    }
    
    const liveUrlBtn = document.getElementById('liveUrlBtn');
    if (liveUrlBtn) {
        if (website.status === 'Live' && website.liveUrl && website.liveUrl !== '#') {
            liveUrlBtn.href = website.liveUrl;
            liveUrlBtn.style.display = 'flex';
        } else {
            liveUrlBtn.style.display = 'none';
        }
    }
    
    // Update visit button state
    updateVisitButton(website);
    
    // Animate content
    animateWebsiteDetails();
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

// Update Visit Button
function updateVisitButton(website) {
    const visitBtn = document.getElementById('visitBtn');
    if (!visitBtn) return;
    
    if (website.status === 'In Development' || !website.liveUrl || website.liveUrl === '#') {
        visitBtn.innerHTML = '<i class="fas fa-clock"></i><span>Coming Soon</span>';
        visitBtn.disabled = true;
        visitBtn.style.cursor = 'not-allowed';
        visitBtn.style.opacity = '0.6';
    } else {
        visitBtn.innerHTML = '<i class="fas fa-external-link-alt"></i><span>Visit Website</span>';
        visitBtn.disabled = false;
        visitBtn.style.cursor = 'pointer';
        visitBtn.style.opacity = '1';
        visitBtn.onclick = () => visitWebsiteExternal(website);
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
    
    // Fullscreen change handlers
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
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
    const websites = getWebsites();
    const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
    
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + websites.length) % websites.length;
    const prevWebsite = websites[prevIndex];
    
    window.location.href = `website-detail.html?id=${prevWebsite.id}`;
}

function navigateToNextWebsite() {
    const websites = getWebsites();
    const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
    
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % websites.length;
    const nextWebsite = websites[nextIndex];
    
    window.location.href = `website-detail.html?id=${nextWebsite.id}`;
}

// Website Interaction Functions
function visitWebsiteExternal(website) {
    if (!website.liveUrl || website.liveUrl === '#') {
        showNotification('Website URL not available', 'error');
        return;
    }
    
    // Open website in new tab
    window.open(website.liveUrl, '_blank');
    showNotification(`Opening ${website.name}...`, 'success');
}

function toggleFullscreen() {
    const websitePreview = document.querySelector('.website-preview');
    if (!websitePreview) return;
    
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
    }
}

function closePreview() {
    window.location.href = 'websites.html';
}

// Share Functionality
function shareWebsite() {
    if (!currentWebsite) return;
    
    const shareData = {
        title: currentWebsite.name,
        text: currentWebsite.overview,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                showNotification('Website shared successfully', 'success');
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
                showNotification('Website link copied to clipboard', 'success');
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
            showNotification('Website link copied to clipboard', 'success');
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
            navigateToPreviousWebsite();
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextWebsite();
            break;
        case 'Escape':
            if (isPreviewActive) {
                closePreview();
            }
            break;
        case ' ':
        case 'Enter':
            if (!isPreviewActive && currentWebsite && currentWebsite.status === 'Live') {
                e.preventDefault();
                visitWebsiteExternal(currentWebsite);
            }
            break;
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            break;
    }
}

// Fullscreen Change Handler
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                            document.mozFullScreenElement || document.msFullscreenElement);
    
    fullscreenBtn.innerHTML = isFullscreen ? 
        '<i class="fas fa-compress"></i>' : 
        '<i class="fas fa-expand"></i>';
    fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';
}

// Animate Website Details
function animateWebsiteDetails() {
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

// Load Website Screenshots (if implemented)
function loadWebsiteScreenshots(website) {
    const screenshotsContainer = document.getElementById('websiteScreenshots');
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
        previewImage.style.transition = 'opacity 0.3s ease';
        previewImage.style.opacity = '0';
        
        setTimeout(() => {
            previewImage.style.opacity = '1';
        }, 50);
    }
}

// Make functions globally available
window.initializeWebsiteDetailPage = initializeWebsiteDetailPage;
window.visitWebsiteExternal = visitWebsiteExternal;
window.shareWebsite = shareWebsite;
window.navigateToPreviousWebsite = navigateToPreviousWebsite;
window.navigateToNextWebsite = navigateToNextWebsite;

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsiteDetailPage);
} else {
    initializeWebsiteDetailPage();
}