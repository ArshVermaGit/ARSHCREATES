// ==========================================
// APPS PORTFOLIO - PERFECTED VERSION
// Author: Arsh Verma
// Version: 7.0.0 - Production Ready
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE MANAGEMENT
// ==========================================
const APPS_STATE = {
    allApps: [],
    filteredApps: [],
    currentFilters: {
        category: 'all',
        status: 'all',
        sort: 'newest'
    },
    isLoading: false,
    animationDelay: 100
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Initializing Apps Portfolio...');
    initializeAppsPage();
});

function initializeAppsPage() {
    try {
        initializeTheme();
        
        APPS_STATE.isLoading = true;
        showLoadingState();
        
        loadAppsData();
        setupAppFilters();
        setupAppEventListeners();
        updateHeaderStats();
        
        setTimeout(() => {
            APPS_STATE.isLoading = false;
            applyFilters();
            hideLoadingState();
            console.log('✅ Apps portfolio initialized');
        }, 600);
        
    } catch (error) {
        console.error('❌ Error initializing:', error);
        showNotification('Failed to load apps. Please refresh.', 'error');
        APPS_STATE.isLoading = false;
        displayErrorState();
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
        let appsData = [];
        
        // Try multiple data sources
        if (typeof window.getApps === 'function') {
            appsData = window.getApps();
            console.log('📥 Loaded from window.getApps():', appsData.length);
        } else if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA.apps)) {
            appsData = window.PORTFOLIO_DATA.apps;
            console.log('📥 Loaded from PORTFOLIO_DATA:', appsData.length);
        } else {
            console.warn('⚠️ No data source found');
            appsData = [];
        }
        
        // Validate and assign
        APPS_STATE.allApps = validateAppsData(appsData);
        APPS_STATE.filteredApps = [...APPS_STATE.allApps];
        
        console.log('📱 Apps loaded:', APPS_STATE.allApps.length);
        
    } catch (error) {
        console.error('❌ Error loading apps:', error);
        APPS_STATE.allApps = [];
        APPS_STATE.filteredApps = [];
    }
}

function validateAppsData(apps) {
    if (!Array.isArray(apps)) {
        console.warn('⚠️ Invalid apps data: expected array');
        return [];
    }
    
    return apps.map((app, index) => ({
        id: app.id || `app-${Date.now()}-${index}`,
        name: (app.name || 'Untitled App').trim(),
        category: app.category || 'Uncategorized',
        status: app.status || 'In Development',
        overview: app.overview || app.description || 'A modern mobile application.',
        description: app.description || app.overview || 'Detailed description coming soon.',
        launchDate: app.launchDate || null,
        developmentTime: app.developmentTime || 'Not specified',
        rating: Math.min(5, Math.max(0, app.rating || 0)),
        downloadCount: app.downloadCount || '0',
        platform: app.platform || 'Cross-Platform',
        image: app.image || generatePlaceholderImage(app.name || 'App'),
        features: Array.isArray(app.features) ? app.features.slice(0, 5) : 
                  ['Modern Design', 'Intuitive Interface', 'Fast Performance'],
        repositoryUrl: app.repositoryUrl || null,
        appStoreUrl: app.appStoreUrl || null,
        playStoreUrl: app.playStoreUrl || null,
        technologies: app.technologies || ['React Native', 'Flutter', 'JavaScript'],
        screenshots: app.screenshots || []
    })).filter(app => app.id && app.name);
}

function generatePlaceholderImage(name) {
    const encodedName = encodeURIComponent(name.substring(0, 20));
    return `https://via.placeholder.com/600x350/1A1A2E/FFB800?text=${encodedName}`;
}

// ==========================================
// UI LOADING STATES
// ==========================================
function showLoadingState() {
    const appsGrid = document.getElementById('appsGrid');
    if (appsGrid) {
        appsGrid.innerHTML = `
            <div class="loading-apps">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading apps...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    const loadingElement = document.querySelector('.loading-apps');
    if (loadingElement) {
        loadingElement.style.opacity = '0';
        loadingElement.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
            if (loadingElement.parentNode) {
                loadingElement.remove();
            }
        }, 400);
    }
}

function displayErrorState() {
    const appsGrid = document.getElementById('appsGrid');
    if (appsGrid) {
        appsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Apps</h3>
                <p>There was an error loading the apps portfolio.</p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    <i class="fas fa-redo"></i>
                    <span>Reload Page</span>
                </button>
            </div>
        `;
    }
}

// ==========================================
// UI RENDERING
// ==========================================
function displayApps(apps) {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) {
        console.error('❌ Apps grid not found');
        return;
    }
    
    appsGrid.innerHTML = '';
    
    if (APPS_STATE.isLoading) {
        showLoadingState();
        return;
    }
    
    if (!apps || apps.length === 0) {
        appsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-mobile-alt"></i>
                <h3>No Apps Found</h3>
                <p>No apps match your filters. Try adjusting them.</p>
                <button class="btn btn-primary" onclick="resetFilters()">
                    <i class="fas fa-redo"></i>
                    <span>Reset Filters</span>
                </button>
            </div>
        `;
        return;
    }
    
    // Render apps with animation
    apps.forEach((app, index) => {
        const appCard = createAppCard(app);
        const cardElement = createElementFromHTML(appCard);
        
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(30px)';
        cardElement.style.animationDelay = `${index * APPS_STATE.animationDelay}ms`;
        
        appsGrid.appendChild(cardElement);
        
        setTimeout(() => {
            cardElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            cardElement.style.opacity = '1';
            cardElement.style.transform = 'translateY(0)';
        }, index * APPS_STATE.animationDelay);
    });
    
    setTimeout(() => {
        setupAppCardListeners();
        console.log(`📱 Displayed ${apps.length} apps`);
    }, 100);
}

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function createAppCard(app) {
    const statusClass = app.status.toLowerCase().replace(/\s+/g, '-');
    const shortOverview = (app.overview || '').length > 120 
        ? app.overview.substring(0, 120) + '...' 
        : app.overview;
    
    return `
        <article class="app-card" 
                 data-app-id="${app.id}" 
                 data-category="${app.category}" 
                 data-status="${app.status}"
                 tabindex="0">
            
            <div class="app-image">
                <img src="${app.image}" 
                     alt="${app.name}"
                     loading="lazy"
                     onerror="this.src='${generatePlaceholderImage(app.name)}'">
                
                <div class="app-overlay">
                    <div class="overlay-content">
                        <button class="btn btn-view-details" 
                                data-app-id="${app.id}">
                            <i class="fas fa-eye"></i>
                            <span>View Details</span>
                        </button>
                        ${app.status === 'Live' && (app.appStoreUrl || app.playStoreUrl) ? `
                            <button class="btn btn-download-app" data-app-id="${app.id}">
                                <i class="fas fa-download"></i>
                                <span>Download</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="app-status-badge status-${statusClass}">
                    ${app.status}
                </div>
            </div>
            
            <div class="app-content">
                <header class="app-header">
                    <h3 class="app-title">${escapeHtml(app.name)}</h3>
                    ${app.rating > 0 ? `
                        <div class="app-rating">
                            <div class="rating-stars">${generateStars(app.rating)}</div>
                            <span class="rating-value">${app.rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                </header>
                
                <div class="app-meta">
                    <span class="app-category">
                        <i class="fas fa-tag"></i>
                        ${escapeHtml(app.category)}
                    </span>
                    ${app.launchDate ? `
                        <span class="app-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(app.launchDate)}
                        </span>
                    ` : ''}
                </div>
                
                <p class="app-description">${escapeHtml(shortOverview)}</p>
                
                ${app.features && app.features.length > 0 ? `
                    <div class="app-features">
                        ${app.features.slice(0, 3).map(feature => `
                            <span class="app-feature">
                                <i class="fas fa-check"></i>
                                ${escapeHtml(feature)}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="app-actions">
                    <button class="btn btn-primary btn-view-app" 
                            data-app-id="${app.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>Learn More</span>
                    </button>
                    ${app.repositoryUrl ? `
                        <a href="${app.repositoryUrl}" 
                           class="btn btn-secondary"
                           target="_blank"
                           rel="noopener noreferrer"
                           onclick="event.stopPropagation()">
                            <i class="fab fa-github"></i>
                            <span>View Code</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </article>
    `;
}

// ==========================================
// FILTERING & SORTING
// ==========================================
function setupAppFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!categoryFilter || !statusFilter || !sortFilter) {
        console.warn('⚠️ Filter elements not found');
        return;
    }
    
    // Populate categories
    const categories = [...new Set(APPS_STATE.allApps.map(a => a.category).filter(Boolean))].sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Event listeners
    function handleFilterChange() {
        APPS_STATE.currentFilters.category = categoryFilter.value;
        APPS_STATE.currentFilters.status = statusFilter.value;
        APPS_STATE.currentFilters.sort = sortFilter.value;
        applyFilters();
    }
    
    categoryFilter.addEventListener('change', handleFilterChange);
    statusFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    
    console.log('✅ Filters setup completed');
}

function applyFilters() {
    if (APPS_STATE.isLoading) return;
    
    let filtered = [...APPS_STATE.allApps];
    
    // Category filter
    if (APPS_STATE.currentFilters.category !== 'all') {
        filtered = filtered.filter(a => a.category === APPS_STATE.currentFilters.category);
    }
    
    // Status filter
    if (APPS_STATE.currentFilters.status !== 'all') {
        filtered = filtered.filter(a => a.status === APPS_STATE.currentFilters.status);
    }
    
    // Sort results
    filtered = sortApps(filtered, APPS_STATE.currentFilters.sort);
    
    APPS_STATE.filteredApps = filtered;
    displayApps(filtered);
    
    const resultsText = filtered.length === 1 ? 'app' : 'apps';
    showNotification(`Showing ${filtered.length} ${resultsText}`, 'info', 2000);
}

function sortApps(apps, sortBy) {
    const sorted = [...apps];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => {
                const dateA = a.launchDate ? new Date(a.launchDate) : new Date(0);
                const dateB = b.launchDate ? new Date(b.launchDate) : new Date(0);
                return dateB - dateA;
            });
            
        case 'oldest':
            return sorted.sort((a, b) => {
                const dateA = a.launchDate ? new Date(a.launchDate) : new Date(0);
                const dateB = b.launchDate ? new Date(b.launchDate) : new Date(0);
                return dateA - dateB;
            });
            
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            
        case 'downloads':
            return sorted.sort((a, b) => parseDownloadCount(b.downloadCount || '0') - parseDownloadCount(a.downloadCount || '0'));
            
        default:
            return sorted;
    }
}

function parseDownloadCount(downloadCount) {
    if (!downloadCount || typeof downloadCount !== 'string') return 0;
    const numStr = downloadCount.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return 0;
    
    const upperCase = downloadCount.toUpperCase();
    if (upperCase.includes('M')) return num * 1000000;
    else if (upperCase.includes('K')) return num * 1000;
    return num;
}

function resetFilters() {
    APPS_STATE.currentFilters = {
        category: 'all',
        status: 'all',
        sort: 'newest'
    };
    
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'newest';
    
    applyFilters();
    showNotification('Filters reset', 'success');
}

// ==========================================
// EVENT HANDLERS - PERFECTED
// ==========================================
function setupAppEventListeners() {
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select, button')) return;
        
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            resetFilters();
        }
    });
}

function setupAppCardListeners() {
    console.log('🔗 Setting up app card listeners...');
    
    // View details buttons
    document.querySelectorAll('.btn-view-details, .btn-view-app, .btn-primary[data-app-id]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const appId = this.getAttribute('data-app-id');
            console.log('🖱️ Button clicked, app ID:', appId);
            viewAppDetails(appId);
        });
    });
    
    // Download buttons
    document.querySelectorAll('.btn-download-app').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const appId = this.getAttribute('data-app-id');
            const app = APPS_STATE.allApps.find(a => a.id == appId);
            if (app) {
                showDownloadModal(app);
            }
        });
    });
    
    // Card clicks
    document.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking buttons or links
            if (e.target.closest('button') || e.target.closest('a')) {
                return;
            }
            
            const appId = this.getAttribute('data-app-id');
            console.log('🖱️ Card clicked, app ID:', appId);
            viewAppDetails(appId);
        });
        
        // Keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const appId = this.getAttribute('data-app-id');
                viewAppDetails(appId);
            }
        });
    });
    
    console.log('✅ Card listeners setup complete');
}

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

// ==========================================
// NAVIGATION - PERFECTED
// ==========================================
function viewAppDetails(appId) {
    if (!appId) {
        console.error('❌ No app ID provided');
        showNotification('Invalid app selection', 'error');
        return;
    }
    
    const app = APPS_STATE.allApps.find(a => a.id == appId);
    if (!app) {
        console.error('❌ App not found for ID:', appId);
        showNotification('App not found', 'error');
        return;
    }
    
    console.log(`🔍 Navigating to: ${app.name} (ID: ${appId})`);
    
    // Navigate to detail page
    const detailUrl = `app-detail.html?id=${appId}`;
    console.log('🔗 Navigation URL:', detailUrl);
    
    window.location.href = detailUrl;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const hasFullExtra = rating % 1 > 0.7;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) - (hasFullExtra ? 1 : 0);
    
    let html = '';
    
    for (let i = 0; i < fullStars + (hasFullExtra ? 1 : 0); i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}

function formatDate(dateString) {
    if (!dateString) return 'Coming Soon';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Coming Soon';
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (error) {
        return 'Coming Soon';
    }
}

function updateHeaderStats() {
    const allApps = APPS_STATE.allApps;
    if (allApps.length === 0) return;
    
    const totalApps = allApps.length;
    const avgRating = (allApps.reduce((sum, a) => sum + (a.rating || 0), 0) / totalApps).toFixed(1);
    const totalDownloads = allApps.reduce((sum, a) => sum + parseDownloadCount(a.downloadCount || '0'), 0);
    
    const statNumbers = document.querySelectorAll('.header-stats .stat-number');
    if (statNumbers.length >= 3) {
        animateValue(statNumbers[0], 0, totalApps, 1500, '+');
        animateValue(statNumbers[1], 0, parseFloat(avgRating), 1500, '');
        animateValue(statNumbers[2], 0, totalDownloads, 1500, '+');
    }
}

function animateValue(element, start, end, duration, suffix = '') {
    if (!element) return;
    
    const range = Math.abs(end - start);
    const stepTime = Math.max(Math.floor(duration / range), 20);
    const isDecimal = end % 1 !== 0;
    let current = start;
    
    const timer = setInterval(() => {
        current += (end > start ? 1 : -1) * (isDecimal ? 0.1 : 1);
        
        if ((end > start && current >= end) || (end < start && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, stepTime);
}

function showNotification(message, type = 'info', duration = 3000) {
    try {
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 6rem;
                right: 1.5rem;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-message">${escapeHtml(message)}</div>
            </div>
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
        }, duration);
        
    } catch (error) {
        console.error('❌ Notification error:', error);
    }
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

// ==========================================
// GLOBAL EXPORTS
// ==========================================
window.initializeAppsPage = initializeAppsPage;
window.resetFilters = resetFilters;
window.viewAppDetails = viewAppDetails;
window.applyFilters = applyFilters;
window.showDownloadModal = showDownloadModal;

console.log('📱 Apps portfolio JavaScript loaded!');