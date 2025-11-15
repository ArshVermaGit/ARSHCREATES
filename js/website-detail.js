// ==========================================
// WEBSITE DETAIL PAGE - COMPLETE JAVASCRIPT
// Author: Arsh Verma
// Version: 7.0.0 - Yellow Theme Edition
// Description: Matches main page design perfectly
// Last Updated: November 2024
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE
// ==========================================
let currentWebsiteId = null;
let currentWebsite = null;
let isPreviewActive = false;
let websitesData = [];

// ==========================================
// INITIALIZATION
// ==========================================
function initializeWebsiteDetailPage() {
    console.log('🌐 Initializing website detail page...');
    
    try {
        initializeTheme();
        
        const urlParams = new URLSearchParams(window.location.search);
        currentWebsiteId = parseInt(urlParams.get('id'));
        const autoPreview = urlParams.get('preview') === 'true';
        
        if (!currentWebsiteId || isNaN(currentWebsiteId)) {
            console.error('❌ Invalid website ID');
            showNotification('Website not found', 'error');
            setTimeout(() => window.location.href = 'websites.html', 2000);
            return;
        }
        
        console.log(`📌 Loading website ID: ${currentWebsiteId}`);
        
        loadWebsitesData().then(() => {
            loadWebsiteDetails(currentWebsiteId);
            setupWebsiteDetailEventListeners();
            
            if (autoPreview) {
                setTimeout(() => {
                    if (currentWebsite && currentWebsite.status === 'Live' && currentWebsite.liveUrl) {
                        showWebsitePreview(currentWebsite);
                    }
                }, 1500);
            }
            
            console.log('✅ Website detail initialized');
        }).catch(error => {
            console.error('❌ Failed to load websites data:', error);
            showNotification('Error loading website data', 'error');
        });
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showNotification('Error loading website page', 'error');
    }
}

// ==========================================
// THEME MANAGEMENT
// ==========================================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon i');
    
    try {
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        console.log(`🎨 Theme initialized: ${savedTheme}`);
        
    } catch (error) {
        console.error('❌ Theme error:', error);
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.querySelector('#themeToggle .theme-icon i');
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log(`🎨 Theme toggled: ${newTheme}`);
        
    } catch (error) {
        console.error('❌ Theme toggle error:', error);
    }
}

// ==========================================
// WEBSITE DATA LOADING
// ==========================================
async function loadWebsitesData() {
    try {
        if (typeof getWebsites === 'function') {
            websitesData = getWebsites();
            console.log('📥 Loaded from getWebsites():', websitesData.length);
            return websitesData;
        } else if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.websites)) {
            websitesData = window.PORTFOLIO_DATA.websites;
            console.log('📥 Loaded from PORTFOLIO_DATA:', websitesData.length);
            return websitesData;
        } else {
            websitesData = createSampleWebsites();
            console.log('📥 Using sample data:', websitesData.length);
            return websitesData;
        }
    } catch (error) {
        console.error('❌ Error loading websites data:', error);
        websitesData = createSampleWebsites();
        return websitesData;
    }
}

function getWebsites() {
    return websitesData;
}

function loadWebsiteDetails(websiteId) {
    try {
        const websites = getWebsites();
        
        if (!websites || websites.length === 0) {
            throw new Error('No websites data available');
        }
        
        const website = websites.find(w => w.id === websiteId);
        
        if (!website) {
            console.error(`❌ Website not found: ${websiteId}`);
            showNotification('Website not found', 'error');
            setTimeout(() => window.location.href = 'websites.html', 2000);
            return;
        }
        
        currentWebsite = website;
        displayWebsiteDetails(website);
        setupWebsiteNavigation();
        
        console.log(`✅ Loaded: ${website.name}`);
        
    } catch (error) {
        console.error('❌ Load error:', error);
        showNotification('Error loading website details', 'error');
    }
}

// ==========================================
// DISPLAY WEBSITE DETAILS
// ==========================================
function displayWebsiteDetails(website) {
    try {
        console.log(`📋 Displaying: ${website.name}`);
        
        document.title = `${website.name} - Arsh Verma`;
        
        // Preview image
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = website.image || 'https://via.placeholder.com/1280x720/1A1A2E/FFB800?text=Website+Preview';
            previewImage.alt = `${website.name} - Preview`;
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/1280x720/1A1A2E/FFB800?text=Website+Preview';
            };
        }
        
        // Header info
        updateElement('websiteTitle', website.name || 'Unknown Website');
        
        const websiteCategory = document.getElementById('websiteCategory');
        if (websiteCategory) {
            websiteCategory.innerHTML = `<i class="fas fa-tag"></i>${escapeHtml(website.category || 'Uncategorized')}`;
        }
        
        updateElement('websiteRating', website.rating ? website.rating.toFixed(1) : '0.0');
        
        const websiteStatus = document.getElementById('websiteStatus');
        if (websiteStatus) {
            const statusText = website.status || 'Unknown';
            const statusClass = statusText === 'Live' ? 'status-live' : 'status-dev';
            const statusIcon = statusText === 'Live' ? 'fa-circle' : 'fa-clock';
            websiteStatus.className = `website-status ${statusClass}`;
            websiteStatus.innerHTML = `<i class="fas ${statusIcon}"></i>${escapeHtml(statusText)}`;
        }
        
        // Description
        updateElement('websiteOverview', website.overview || 'No overview available.');
        updateElement('websiteDescription', website.description || website.overview || 'Detailed description coming soon.');
        
        // Details grid
        updateElement('launchDate', formatDate(website.launchDate));
        updateElement('developmentTime', website.developmentTime || 'Not specified');
        updateElement('userBase', website.userBase || '0');
        
        // Features
        const featuresList = document.getElementById('featuresList');
        if (featuresList) {
            if (website.features && Array.isArray(website.features) && website.features.length > 0) {
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
        
        // Technologies
        const techList = document.getElementById('techList');
        if (techList) {
            if (website.technologies && Array.isArray(website.technologies) && website.technologies.length > 0) {
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
        
        // Screenshots
        const screenshotsGrid = document.getElementById('screenshotsGrid');
        if (screenshotsGrid) {
            if (website.screenshots && Array.isArray(website.screenshots) && website.screenshots.length > 0) {
                screenshotsGrid.innerHTML = website.screenshots.map((screenshot, index) => 
                    `<div class="screenshot-item" onclick="viewScreenshot('${screenshot}')">
                        <img src="${screenshot}" alt="${website.name} Screenshot ${index + 1}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x450/1A1A2E/FFB800?text=Screenshot+${index+1}'">
                        <div class="screenshot-overlay">
                            <button class="btn-screenshot-view">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>`
                ).join('');
            } else {
                screenshotsGrid.innerHTML = `
                    <div class="no-screenshots">
                        <i class="fas fa-images"></i>
                        <p>No screenshots available</p>
                    </div>`;
            }
        }
        
        // Statistics
        updateElement('ratingCircle', website.rating ? website.rating.toFixed(1) : '0.0');
        updateElement('userCountCircle', formatStatNumber(website.userBase || 0));
        updateElement('performanceCircle', website.performance ? `${website.performance}%` : '98%');
        
        // Repository button
        const repositoryBtn = document.getElementById('repositoryBtn');
        if (repositoryBtn) {
            if (website.repositoryUrl) {
                repositoryBtn.href = website.repositoryUrl;
                repositoryBtn.style.display = 'flex';
                repositoryBtn.target = '_blank';
                repositoryBtn.rel = 'noopener noreferrer';
            } else {
                repositoryBtn.style.display = 'none';
            }
        }
        
        // Live URL button
        const liveUrlBtn = document.getElementById('liveUrlBtn');
        if (liveUrlBtn) {
            if (website.liveUrl) {
                liveUrlBtn.href = website.liveUrl;
                liveUrlBtn.style.display = 'flex';
                liveUrlBtn.target = '_blank';
                liveUrlBtn.rel = 'noopener noreferrer';
            } else {
                liveUrlBtn.style.display = 'none';
            }
        }
        
        updateVisitButton(website);
        
        console.log('✅ Website details displayed');
        
    } catch (error) {
        console.error('❌ Display error:', error);
        showNotification('Error displaying website information', 'error');
    }
}

function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

function updateVisitButton(website) {
    const visitBtn = document.getElementById('visitBtn');
    if (!visitBtn) return;
    
    try {
        const visitIcon = visitBtn.querySelector('.visit-icon-circle i');
        const visitText = visitBtn.querySelector('.visit-text');
        
        const newVisitBtn = visitBtn.cloneNode(true);
        visitBtn.parentNode.replaceChild(newVisitBtn, visitBtn);
        
        const updatedVisitBtn = document.getElementById('visitBtn');
        
        if (website.status === 'In Development') {
            if (visitIcon) visitIcon.className = 'fas fa-clock';
            if (visitText) visitText.textContent = 'Coming Soon';
            updatedVisitBtn.disabled = true;
            updatedVisitBtn.style.cursor = 'not-allowed';
            updatedVisitBtn.style.opacity = '0.6';
        } else if (!website.liveUrl) {
            if (visitIcon) visitIcon.className = 'fas fa-external-link-alt';
            if (visitText) visitText.textContent = 'View Project';
            updatedVisitBtn.disabled = false;
            updatedVisitBtn.style.cursor = 'pointer';
            updatedVisitBtn.style.opacity = '1';
            updatedVisitBtn.onclick = () => {
                if (website.repositoryUrl) {
                    window.open(website.repositoryUrl, '_blank', 'noopener,noreferrer');
                } else {
                    showNotification('No live version available', 'info');
                }
            };
        } else {
            if (visitIcon) visitIcon.className = 'fas fa-external-link-alt';
            if (visitText) visitText.textContent = 'Preview Website';
            updatedVisitBtn.disabled = false;
            updatedVisitBtn.style.cursor = 'pointer';
            updatedVisitBtn.style.opacity = '1';
            updatedVisitBtn.onclick = () => showWebsitePreview(website);
        }
        
    } catch (error) {
        console.error('❌ Visit button error:', error);
    }
}

// ==========================================
// SCREENSHOTS FUNCTIONALITY
// ==========================================
function viewScreenshot(screenshotUrl) {
    const modal = document.createElement('div');
    modal.className = 'screenshot-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeScreenshotModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeScreenshotModal()">
                <i class="fas fa-times"></i>
            </button>
            <img src="${screenshotUrl}" alt="Website Screenshot">
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    if (!document.querySelector('#screenshot-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'screenshot-modal-styles';
        styles.textContent = `
            .screenshot-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .modal-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
            }
            .screenshot-modal .modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                z-index: 2;
            }
            .screenshot-modal img {
                max-width: 100%;
                max-height: 100%;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .modal-close {
                position: absolute;
                top: -50px;
                right: 0;
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .modal-close:hover {
                background: var(--detail-gradient);
                color: white;
                transform: scale(1.1);
                box-shadow: 0 4px 16px rgba(255, 184, 0, 0.4);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
}

function closeScreenshotModal() {
    const modal = document.querySelector('.screenshot-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupWebsiteDetailEventListeners() {
    try {
        console.log('🔧 Setting up listeners...');
        
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', shareWebsite);
        }
        
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }
        
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        if (closePreviewBtn) {
            closePreviewBtn.addEventListener('click', closePreview);
        }
        
        document.addEventListener('keydown', handleKeyboardNavigation);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        
        console.log('✅ Listeners setup complete');
        
    } catch (error) {
        console.error('❌ Listener setup error:', error);
    }
}

// ==========================================
// WEBSITE NAVIGATION
// ==========================================
function setupWebsiteNavigation() {
    try {
        const prevWebsiteBtn = document.getElementById('prevWebsite');
        const nextWebsiteBtn = document.getElementById('nextWebsite');
        
        const websites = getWebsites();
        if (!websites || websites.length === 0) return;
        
        const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
        if (currentIndex === -1) return;
        
        const prevWebsite = websites[(currentIndex - 1 + websites.length) % websites.length];
        const nextWebsite = websites[(currentIndex + 1) % websites.length];
        
        if (prevWebsiteBtn) {
            prevWebsiteBtn.onclick = () => navigateToWebsite(prevWebsite.id);
        }
        
        if (nextWebsiteBtn) {
            nextWebsiteBtn.onclick = () => navigateToWebsite(nextWebsite.id);
        }
        
        console.log('✅ Navigation setup complete');
        
    } catch (error) {
        console.error('❌ Navigation setup error:', error);
    }
}

function navigateToWebsite(websiteId) {
    window.location.href = `website-detail.html?id=${websiteId}`;
}

// ==========================================
// WEBSITE PREVIEW FUNCTIONALITY
// ==========================================
function showWebsitePreview(website) {
    console.log(`🌐 Previewing: ${website.name}`);
    
    try {
        if (!website.liveUrl) {
            showNotification('No live URL available for this website', 'info');
            if (website.repositoryUrl) {
                window.open(website.repositoryUrl, '_blank', 'noopener,noreferrer');
            }
            return;
        }
        
        const websiteContainer = document.getElementById('websiteContainer');
        const previewImage = document.querySelector('.preview-image');
        const websiteFrame = document.getElementById('websiteFrame');
        
        if (!websiteContainer || !websiteFrame) {
            showNotification('Preview container not found', 'error');
            return;
        }
        
        websiteContainer.style.display = 'block';
        previewImage.style.display = 'none';
        
        isPreviewActive = true;
        
        websiteFrame.src = website.liveUrl;
        
        showNotification(`Loading ${website.name}...`, 'success');
        
        websiteFrame.onload = () => {
            console.log('✅ Website preview loaded successfully');
            showNotification('Preview loaded!', 'success');
        };
        
        websiteFrame.onerror = () => {
            console.error('❌ Failed to load website preview');
            showNotification('Failed to load preview. Opening in new tab...', 'warning');
            
            setTimeout(() => {
                window.open(website.liveUrl, '_blank', 'noopener,noreferrer');
                closePreview();
            }, 1500);
        };
        
    } catch (error) {
        console.error('❌ Preview error:', error);
        showNotification('Error loading preview: ' + error.message, 'error');
        closePreview();
    }
}

function closePreview() {
    try {
        console.log('❌ Closing website preview');
        
        const websiteContainer = document.getElementById('websiteContainer');
        const previewImage = document.querySelector('.preview-image');
        const websiteFrame = document.getElementById('websiteFrame');
        
        if (websiteContainer) {
            websiteContainer.style.display = 'none';
        }
        
        if (previewImage) {
            previewImage.style.display = 'block';
        }
        
        if (websiteFrame) {
            websiteFrame.src = '';
        }
        
        isPreviewActive = false;
        
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
        
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
        
        showNotification('Preview closed', 'info');
        
    } catch (error) {
        console.error('❌ Error closing preview:', error);
        showNotification('Error closing preview', 'error');
    }
}

// ==========================================
// WEBSITE CONTROLS
// ==========================================
function toggleFullscreen() {
    try {
        const websitePreviewWrapper = document.querySelector('.website-preview-wrapper');
        if (!websitePreviewWrapper) return;
        
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
        
        if (!isFullscreen) {
            if (websitePreviewWrapper.requestFullscreen) {
                websitePreviewWrapper.requestFullscreen();
            } else if (websitePreviewWrapper.webkitRequestFullscreen) {
                websitePreviewWrapper.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
        
    } catch (error) {
        console.error('❌ Fullscreen error:', error);
        showNotification('Fullscreen error', 'error');
    }
}

// ==========================================
// SHARE FUNCTIONALITY
// ==========================================
function shareWebsite() {
    if (!currentWebsite) {
        showNotification('No website to share', 'error');
        return;
    }
    
    try {
        const shareData = {
            title: `${currentWebsite.name} - ArshCreates`,
            text: currentWebsite.overview || `Check out ${currentWebsite.name}!`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    showNotification('Shared successfully', 'success');
                })
                .catch((error) => {
                    if (error.name !== 'AbortError') {
                        fallbackShare();
                    }
                });
        } else {
            fallbackShare();
        }
        
    } catch (error) {
        console.error('❌ Share error:', error);
        fallbackShare();
    }
}

function fallbackShare() {
    const url = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showNotification('Link copied to clipboard!', 'success');
            })
            .catch(() => {
                prompt('Copy this link to share:', url);
            });
    } else {
        prompt('Copy this link to share:', url);
    }
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
function handleKeyboardNavigation(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
        case 'Escape':
            if (isPreviewActive) {
                e.preventDefault();
                closePreview();
            } else {
                const modal = document.querySelector('.screenshot-modal');
                if (modal) {
                    closeScreenshotModal();
                }
            }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            navigateToPreviousWebsite();
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextWebsite();
            break;
        case 'f':
        case 'F':
            if (isPreviewActive) {
                e.preventDefault();
                toggleFullscreen();
            }
            break;
    }
}

function navigateToPreviousWebsite() {
    const websites = getWebsites();
    if (!websites || websites.length === 0) return;
    
    const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + websites.length) % websites.length;
    const prevWebsite = websites[prevIndex];
    
    navigateToWebsite(prevWebsite.id);
}

function navigateToNextWebsite() {
    const websites = getWebsites();
    if (!websites || websites.length === 0) return;
    
    const currentIndex = websites.findIndex(w => w.id === currentWebsiteId);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % websites.length;
    const nextWebsite = websites[nextIndex];
    
    navigateToWebsite(nextWebsite.id);
}

// ==========================================
// FULLSCREEN HANDLER
// ==========================================
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    
    const icon = fullscreenBtn.querySelector('i');
    if (icon) {
        icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatDate(dateString) {
    if (!dateString) return 'Coming Soon';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Coming Soon';
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        return 'Coming Soon';
    }
}

function formatStatNumber(num) {
    if (typeof num === 'string') {
        if (num.includes('K') || num.includes('M')) return num;
        num = parseInt(num.replace(/[^\d]/g, ''));
    }
    
    if (isNaN(num)) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    
    return num.toString();
}

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

function showNotification(message, type = 'info') {
    try {
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        
        const icons = {
            error: '<i class="fas fa-exclamation-circle"></i>',
            success: '<i class="fas fa-check-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-message">${escapeHtml(message)}</div>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
        
    } catch (error) {
        console.error('❌ Notification error:', error);
    }
}

// ==========================================
// SAMPLE DATA FALLBACK
// ==========================================
function createSampleWebsites() {
    return [
        {
            id: 1,
            name: "ReelSpot",
            overview: "Modern social media downloader with advanced features and seamless UX",
            description: "ReelSpot is a comprehensive social media content downloader that allows users to save their favorite videos, images, and reels from multiple platforms. Built with modern web technologies, it features a clean interface, fast processing, and support for multiple formats. The platform prioritizes user privacy and doesn't require login for most features.",
            image: "static/images/websites/ReelSpot/ReelSpot.jpg",
            category: "Media Downloader",
            rating: 4.8,
            status: "Live",
            launchDate: "2023-10-25",
            developmentTime: "3 months",
            userBase: "50K+",
            pageLoadTime: "1.2s",
            mobileResponsive: true,
            technologies: ["HTML5", "CSS3", "JavaScript"],
            features: [
                "Multi-platform support (Instagram, Facebook, Twitter)",
                "High-quality video downloads",
                "Batch download capability",
                "No watermarks",
                "Format conversion options",
                "Privacy-focused design"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/REELSPOT",
            liveUrl: "https://arshvermagit.github.io/REELSPOT/",
            screenshots: [
                "static/images/websites/ReelSpot/1.jpg",
                "static/images/websites/ReelSpot/2.jpg",
                "static/images/websites/ReelSpot/3.jpg",
                "static/images/websites/ReelSpot/4.jpg"
            ]
        }
    ];
}

// ==========================================
// CLEANUP
// ==========================================
window.addEventListener('beforeunload', () => {
    if (isPreviewActive) {
        const websiteFrame = document.getElementById('websiteFrame');
        if (websiteFrame) {
            websiteFrame.src = '';
        }
    }
});

// ==========================================
// GLOBAL EXPORTS
// ==========================================
window.initializeWebsiteDetailPage = initializeWebsiteDetailPage;
window.showWebsitePreview = showWebsitePreview;
window.closePreview = closePreview;
window.shareWebsite = shareWebsite;
window.toggleTheme = toggleTheme;
window.toggleFullscreen = toggleFullscreen;
window.viewScreenshot = viewScreenshot;
window.closeScreenshotModal = closeScreenshotModal;

// ==========================================
// AUTO-INITIALIZATION
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsiteDetailPage);
} else {
    setTimeout(initializeWebsiteDetailPage, 100);
}

console.log('🌐 Website detail JavaScript loaded successfully!');