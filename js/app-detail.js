// ==========================================
// APP DETAIL PAGE - PERFECTED VERSION
// Author: Arsh Verma
// Version: 8.0.0 - Production Ready
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE
// ==========================================
let currentAppId = null;
let currentApp = null;
let isPreviewActive = false;
let appsData = [];
let appImages = [];
let currentScreenshotIndex = 0;

// ==========================================
// INITIALIZATION
// ==========================================
function initializeAppDetailPage() {
    console.log('📱 Initializing app detail page...');
    
    try {
        initializeTheme();
        
        const urlParams = new URLSearchParams(window.location.search);
        currentAppId = parseInt(urlParams.get('id'));
        const autoDownload = urlParams.get('download') === 'true';
        
        if (!currentAppId || isNaN(currentAppId)) {
            console.error('❌ Invalid app ID');
            showNotification('App not found', 'error');
            setTimeout(() => window.location.href = 'apps.html', 2000);
            return;
        }
        
        console.log(`🔌 Loading app ID: ${currentAppId}`);
        
        // Load data and display
        loadAppsData();
        loadAppDetails(currentAppId);
        setupAppDetailEventListeners();
        
        if (autoDownload) {
            setTimeout(() => {
                if (currentApp && currentApp.status === 'Live') {
                    showDownloadModal(currentApp);
                }
            }, 1500);
        }
        
        console.log('✅ App detail initialized');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showNotification('Error loading app page', 'error');
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
// APP DATA LOADING - PERFECTED
// ==========================================
function loadAppsData() {
    try {
        // Try to get data from global functions
        if (typeof window.getApps === 'function') {
            appsData = window.getApps();
            console.log('📥 Loaded from window.getApps():', appsData.length);
        } else if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.apps)) {
            appsData = window.PORTFOLIO_DATA.apps;
            console.log('📥 Loaded from PORTFOLIO_DATA:', appsData.length);
        } else {
            console.warn('⚠️ No data source found, using sample data');
            appsData = [];
        }
        
        return appsData;
    } catch (error) {
        console.error('❌ Error loading apps data:', error);
        appsData = [];
        return appsData;
    }
}

function loadAppDetails(appId) {
    try {
        const apps = appsData;
        
        if (!apps || apps.length === 0) {
            throw new Error('No apps data available');
        }
        
        const app = apps.find(a => a.id === appId);
        
        if (!app) {
            console.error(`❌ App not found: ${appId}`);
            showNotification('App not found', 'error');
            setTimeout(() => window.location.href = 'apps.html', 2000);
            return;
        }
        
        currentApp = app;
        
        // Prepare images array for gallery navigation
        appImages = [app.image];
        if (app.screenshots && app.screenshots.length > 0) {
            appImages.push(...app.screenshots);
        }
        
        displayAppDetails(app);
        setupAppNavigation();
        
        console.log(`✅ Loaded: ${app.name}`);
        
    } catch (error) {
        console.error('❌ Load error:', error);
        showNotification('Error loading app details', 'error');
    }
}

// ==========================================
// DISPLAY APP DETAILS
// ==========================================
function displayAppDetails(app) {
    try {
        console.log(`📋 Displaying: ${app.name}`);
        
        document.title = `${app.name} - Arsh Verma`;
        
        // Preview image
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = app.image || 'https://via.placeholder.com/600x350/1A1A2E/FFB800?text=App+Preview';
            previewImage.alt = `${app.name} - Preview`;
            previewImage.onerror = function() {
                this.src = 'https://via.placeholder.com/600x350/1A1A2E/FFB800?text=App+Preview';
            };
        }
        
        // Header info
        updateElement('appTitle', app.name || 'Unknown App');
        
        const appCategory = document.getElementById('appCategory');
        if (appCategory) {
            appCategory.innerHTML = `<i class="fas fa-tag"></i>${escapeHtml(app.category || 'Uncategorized')}`;
        }
        
        updateElement('appRating', app.rating ? app.rating.toFixed(1) : '0.0');
        
        const appStatus = document.getElementById('appStatus');
        if (appStatus) {
            const statusText = app.status || 'Unknown';
            const statusClass = statusText === 'Live' ? 'status-live' : 'status-dev';
            const statusIcon = statusText === 'Live' ? 'fa-circle' : 'fa-clock';
            appStatus.className = `app-status ${statusClass}`;
            appStatus.innerHTML = `<i class="fas ${statusIcon}"></i>${escapeHtml(statusText)}`;
        }
        
        // Description
        updateElement('appOverview', app.overview || 'No overview available.');
        updateElement('appDescription', app.description || app.overview || 'Detailed description coming soon.');
        
        // Details grid
        updateElement('launchDate', formatDate(app.launchDate));
        updateElement('developmentTime', app.developmentTime || 'Not specified');
        updateElement('downloadCount', app.downloadCount || '0');
        updateElement('appPlatform', app.platform || 'Cross-Platform');
        
        // Features
        const featuresList = document.getElementById('featuresList');
        if (featuresList) {
            if (app.features && Array.isArray(app.features) && app.features.length > 0) {
                featuresList.innerHTML = app.features.map(feature => 
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
            if (app.technologies && Array.isArray(app.technologies) && app.technologies.length > 0) {
                techList.innerHTML = app.technologies.map(tech => 
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
        displayScreenshots(app);
        
        // Statistics
        updateElement('ratingCircle', app.rating ? app.rating.toFixed(1) : '0.0');
        updateElement('downloadCountCircle', formatStatNumber(app.downloadCount || 0));
        updateElement('retentionCircle', '85%');
        
        // Repository button
        const repositoryBtn = document.getElementById('repositoryBtn');
        if (repositoryBtn) {
            if (app.repositoryUrl) {
                repositoryBtn.href = app.repositoryUrl;
                repositoryBtn.style.display = 'flex';
                repositoryBtn.target = '_blank';
                repositoryBtn.rel = 'noopener noreferrer';
            } else {
                repositoryBtn.style.display = 'none';
            }
        }
        
        // Store buttons
        updateStoreButtons(app);
        updateDownloadButton(app);
        
        console.log('✅ App details displayed');
        
    } catch (error) {
        console.error('❌ Display error:', error);
        showNotification('Error displaying app information', 'error');
    }
}

function displayScreenshots(app) {
    const screenshotsGrid = document.getElementById('screenshotsGrid');
    if (!screenshotsGrid) return;
    
    console.log('📸 Processing screenshots:', app.screenshots);
    
    if (app.screenshots && Array.isArray(app.screenshots) && app.screenshots.length > 0) {
        const validScreenshots = app.screenshots.filter(screenshot => 
            screenshot && typeof screenshot === 'string' && screenshot.trim() !== ''
        );
        
        console.log('✅ Valid screenshots:', validScreenshots.length);
        
        if (validScreenshots.length > 0) {
            screenshotsGrid.innerHTML = validScreenshots.map((screenshot, index) => {
                const screenshotPath = screenshot.trim();
                const fallbackUrl = `https://via.placeholder.com/300x600/1A1A2E/FFB800?text=Screenshot+${index+1}`;
                
                return `<div class="screenshot-item" onclick="viewScreenshot(${index + 1})">
                    <img src="${escapeHtml(screenshotPath)}" 
                         alt="${escapeHtml(app.name)} Screenshot ${index + 1}" 
                         loading="lazy" 
                         onerror="this.onerror=null; this.src='${fallbackUrl}';">
                    <div class="screenshot-overlay">
                        <button class="btn-screenshot-view" aria-label="View screenshot">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>`;
            }).join('');
            
            console.log('✅ Screenshots rendered successfully');
        } else {
            screenshotsGrid.innerHTML = `
                <div class="no-screenshots">
                    <i class="fas fa-images"></i>
                    <p>No screenshots available</p>
                </div>`;
        }
    } else {
        console.log('⚠️ No screenshots data available');
        screenshotsGrid.innerHTML = `
            <div class="no-screenshots">
                <i class="fas fa-images"></i>
                <p>No screenshots available</p>
            </div>`;
    }
}

function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || '-';
    }
}

function updateStoreButtons(app) {
    const appStoreBtn = document.getElementById('appStoreBtn');
    const playStoreBtn = document.getElementById('playStoreBtn');
    
    if (appStoreBtn) {
        if (app.appStoreUrl && app.appStoreUrl !== '#') {
            appStoreBtn.href = app.appStoreUrl;
            appStoreBtn.style.display = 'flex';
        } else {
            appStoreBtn.style.display = 'none';
        }
    }
    
    if (playStoreBtn) {
        if (app.playStoreUrl && app.playStoreUrl !== '#') {
            playStoreBtn.href = app.playStoreUrl;
            playStoreBtn.style.display = 'flex';
        } else {
            playStoreBtn.style.display = 'none';
        }
    }
}

function updateDownloadButton(app) {
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadSidebarBtn = document.getElementById('downloadSidebarBtn');
    
    if (downloadBtn) {
        if (app.status === 'Live' && (app.appStoreUrl || app.playStoreUrl)) {
            downloadBtn.style.display = 'flex';
            downloadBtn.onclick = () => showDownloadModal(app);
        } else {
            downloadBtn.style.display = 'none';
        }
    }
    
    if (downloadSidebarBtn) {
        if (app.status === 'Live' && (app.appStoreUrl || app.playStoreUrl)) {
            downloadSidebarBtn.style.display = 'flex';
            downloadSidebarBtn.onclick = () => showDownloadModal(app);
        } else {
            downloadSidebarBtn.style.display = 'none';
        }
    }
}

// ==========================================
// SCREENSHOTS FUNCTIONALITY
// ==========================================
function viewScreenshot(screenshotIndex) {
    console.log('🖼️ Opening screenshot:', screenshotIndex);
    
    const screenshotUrl = appImages[screenshotIndex];
    if (!screenshotUrl) return;
    
    try {
        const existingModal = document.querySelector('.screenshot-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'screenshot-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeScreenshotModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeScreenshotModal()" aria-label="Close screenshot">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${escapeHtml(screenshotUrl)}" 
                     alt="App Screenshot" 
                     onerror="this.src='https://via.placeholder.com/300x600/1A1A2E/FFB800?text=Screenshot'">
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
                    cursor: pointer;
                }
                .screenshot-modal .modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    z-index: 2;
                }
                .screenshot-modal img {
                    max-width: 100%;
                    max-height: 90vh;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    display: block;
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
                    background: linear-gradient(135deg, #FFB800 0%, #FF9500 100%);
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
        
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                closeScreenshotModal();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        
        console.log('✅ Screenshot modal opened');
        
    } catch (error) {
        console.error('❌ Error opening screenshot:', error);
        showNotification('Error displaying screenshot', 'error');
    }
}

function closeScreenshotModal() {
    const modal = document.querySelector('.screenshot-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
        
        console.log('✅ Screenshot modal closed');
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupAppDetailEventListeners() {
    try {
        console.log('🔧 Setting up listeners...');
        
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', shareApp);
        }
        
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        if (closePreviewBtn) {
            closePreviewBtn.addEventListener('click', closePreview);
        }
        
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        console.log('✅ Listeners setup complete');
        
    } catch (error) {
        console.error('❌ Listener setup error:', error);
    }
}

// ==========================================
// APP NAVIGATION
// ==========================================
function setupAppNavigation() {
    try {
        const prevAppBtn = document.getElementById('prevApp');
        const nextAppBtn = document.getElementById('nextApp');
        
        if (!appsData || appsData.length === 0) return;
        
        const currentIndex = appsData.findIndex(a => a.id === currentAppId);
        if (currentIndex === -1) return;
        
        const prevApp = appsData[(currentIndex - 1 + appsData.length) % appsData.length];
        const nextApp = appsData[(currentIndex + 1) % appsData.length];
        
        if (prevAppBtn) {
            prevAppBtn.onclick = () => navigateToApp(prevApp.id);
        }
        
        if (nextAppBtn) {
            nextAppBtn.onclick = () => navigateToApp(nextApp.id);
        }
        
        console.log('✅ Navigation setup complete');
        
    } catch (error) {
        console.error('❌ Navigation setup error:', error);
    }
}

function navigateToApp(appId) {
    window.location.href = `app-detail.html?id=${appId}`;
}

// ==========================================
// DOWNLOAD & CONTROLS
// ==========================================
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

function closePreview() {
    try {
        window.location.href = 'apps.html';
        showNotification('Returning to apps...', 'info');
        
    } catch (error) {
        console.error('❌ Error closing preview:', error);
    }
}

function shareApp() {
    if (!currentApp) return;
    
    try {
        const shareData = {
            title: `${currentApp.name} - ArshCreates`,
            text: currentApp.overview || `Check out ${currentApp.name}!`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => showNotification('Shared successfully', 'success'))
                .catch((error) => {
                    if (error.name !== 'AbortError') {
                        fallbackShare();
                    }
                });
        } else {
            fallbackShare();
        }
    } catch (error) {
        fallbackShare();
    }
}

function fallbackShare() {
    const url = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => showNotification('Link copied!', 'success'))
            .catch(() => prompt('Copy this link:', url));
    } else {
        prompt('Copy this link:', url);
    }
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
function handleKeyboardNavigation(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
        case 'Escape':
            e.preventDefault();
            closePreview();
            break;
        case 'ArrowLeft':
            if (!isPreviewActive) {
                e.preventDefault();
                const prevBtn = document.getElementById('prevApp');
                if (prevBtn) prevBtn.click();
            }
            break;
        case 'ArrowRight':
            if (!isPreviewActive) {
                e.preventDefault();
                const nextBtn = document.getElementById('nextApp');
                if (nextBtn) nextBtn.click();
            }
            break;
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
// GLOBAL EXPORTS
// ==========================================
window.initializeAppDetailPage = initializeAppDetailPage;
window.showDownloadModal = showDownloadModal;
window.closePreview = closePreview;
window.shareApp = shareApp;
window.toggleTheme = toggleTheme;
window.viewScreenshot = viewScreenshot;
window.closeScreenshotModal = closeScreenshotModal;

// ==========================================
// AUTO-INITIALIZATION
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAppDetailPage);
} else {
    initializeAppDetailPage();
}

console.log('📱 App detail JavaScript loaded!');