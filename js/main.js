let currentGame = null;
let unityInstance = null;
let currentMediaType = null;
let currentVideoElement = null;
let currentItemData = null;
let isModalOpen = false;
let currentCategory = null;
let currentIndex = 0;
let currentItems = [];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing main.js...');
    initPortfolioCards();
    initContactForm();
    initModalEvents();
    initQuickActions();
    
    // Initialize portfolio if not already done
    if (typeof initializePortfolio === 'function') {
        setTimeout(initializePortfolio, 100);
    }
});

// =============================================================================
// QUICK ACTIONS INITIALIZATION
// =============================================================================
function initQuickActions() {
    const quickActions = document.getElementById('quickActions');
    if (!quickActions) return;
    
    const fullscreenBtn = document.getElementById('fullscreenToggle');
    const downloadBtn = document.getElementById('downloadCurrent');
    const shareBtn = document.getElementById('shareItem');
    
    // Show quick actions when modal is open
    const modalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const modal = document.getElementById('portfolioModal');
                if (modal && modal.classList.contains('active')) {
                    quickActions.style.display = 'flex';
                } else {
                    quickActions.style.display = 'none';
                }
            }
        });
    });
    
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modalObserver.observe(modal, { attributes: true });
    }
    
    // Fullscreen toggle
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Download current item
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCurrentItem);
    }
    
    // Share item
    if (shareBtn) {
        shareBtn.addEventListener('click', shareCurrentItem);
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function downloadCurrentItem() {
    if (!currentItemData) {
        showNotification('No item selected for download', 'info');
        return;
    }
    
    let downloadUrl = '';
    let filename = '';
    
    switch (currentMediaType) {
        case 'photo':
            downloadUrl = currentItemData.image;
            filename = `${currentItemData.title.replace(/\s+/g, '_')}.jpg`;
            break;
        case 'video':
            downloadUrl = currentItemData.video_url;
            filename = `${currentItemData.title.replace(/\s+/g, '_')}.mp4`;
            break;
        default:
            showNotification('Download not available for this item type', 'info');
            return;
    }
    
    if (downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification(`Downloading ${filename}...`, 'success');
    }
}

function shareCurrentItem() {
    if (!currentItemData) {
        showNotification('No item to share', 'info');
        return;
    }
    
    const shareData = {
        title: currentItemData.title || currentItemData.name,
        text: currentItemData.description,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Shared successfully!', 'success'))
            .catch((error) => {
                console.error('Error sharing:', error);
                showNotification('Error sharing item', 'error');
            });
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => showNotification('Link copied to clipboard!', 'success'))
            .catch(() => showNotification('Error copying link', 'error'));
    }
}

// =============================================================================
// PORTFOLIO CARDS INITIALIZATION
// =============================================================================
function initPortfolioCards() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.card-action-btn')) return;
            
            const type = this.dataset.type;
            const itemData = JSON.parse(this.dataset[type]);
            
            switch (type) {
                case 'game':
                    openGamePreview(itemData);
                    break;
                case 'website':
                    openWebsitePreview(itemData);
                    break;
                case 'photo':
                    openPhotoPreview(itemData);
                    break;
                case 'video':
                    openVideoPreview(itemData);
                    break;
            }
        });
    });
}

// =============================================================================
// MODAL EVENTS
// =============================================================================
function initModalEvents() {
    const modalOverlay = document.getElementById('portfolioModal');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (isModalOpen) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateModal(-1);
            if (e.key === 'ArrowRight') navigateModal(1);
        }
    });
    
    if (modalPrev) {
        modalPrev.addEventListener('click', () => navigateModal(-1));
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', () => navigateModal(1));
    }
    
    // Swipe navigation for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    modalOverlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    modalOverlay.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) navigateModal(1); // Swipe left
        if (touchEndX - touchStartX > 50) navigateModal(-1); // Swipe right
    });
}

function navigateModal(direction) {
    if (!currentItems || currentItems.length <= 1) return;
    
    currentIndex = (currentIndex + direction + currentItems.length) % currentItems.length;
    const item = currentItems[currentIndex];
    
    switch (currentCategory) {
        case 'games':
            openGamePreview(item);
            break;
        case 'websites':
            openWebsitePreview(item);
            break;
        case 'photos':
            openPhotoPreview(item);
            break;
        case 'videos':
            openVideoPreview(item);
            break;
    }
}

// =============================================================================
// MODAL OPEN FUNCTIONS
// =============================================================================
function openGamePreview(game) {
    currentMediaType = 'game';
    currentItemData = game;
    currentCategory = 'games';
    currentItems = getItemsByCategory('games');
    currentIndex = currentItems.findIndex(item => item.id === game.id);
    
    const modal = document.getElementById('portfolioModal');
    const gamePreview = document.getElementById('gamePreview');
    const gameContainer = document.getElementById('gameContainer');
    const playBtn = document.getElementById('playItemBtn');
    const gameLoading = document.getElementById('gameLoading');
    
    // Hide other media
    hideAllMediaExcept('gamePreview');
    
    // Reset game container
    gameContainer.innerHTML = '<canvas id="unity-canvas"></canvas>';
    gamePreview.style.display = 'block';
    gameLoading.style.display = 'flex';
    playBtn.style.display = 'block';
    
    // Update modal info
    updateModalInfo(game.name, game.description, game.technologies);
    updateModalStats([
        { label: 'Status', value: game.status },
        { label: 'Engine', value: 'Unity' }
    ]);
    updateModalActions(`
        <button class="btn btn-primary" onclick="loadUnityGame('${game.game_folder}', '${game.build_name}')">
            <i class="fas fa-play"></i> Play Now
        </button>
    `);
    updateNavigationArrows();
    
    // Show modal
    modal.classList.add('active');
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Load game on play button click
    playBtn.addEventListener('click', () => loadUnityGame(game.game_folder, game.build_name), { once: true });
}

function loadUnityGame(folder, buildName) {
    const playBtn = document.getElementById('playItemBtn');
    const gameLoading = document.getElementById('gameLoading');
    const loadingProgress = document.getElementById('loadingProgress');
    
    playBtn.style.display = 'none';
    gameLoading.style.display = 'flex';
    
    const buildUrl = `static/games/${folder}/Build`;
    
    const loaderUrl = `${buildUrl}/${buildName}.loader.js`;
    
    const config = {
        dataUrl: `${buildUrl}/${buildName}.data`,
        frameworkUrl: `${buildUrl}/${buildName}.framework.js`,
        codeUrl: `${buildUrl}/${buildName}.wasm`,
        streamingAssetsUrl: "StreamingAssets",
        companyName: "ArshVerma",
        productName: currentItemData.name,
        productVersion: "1.0",
    };
    
    const script = document.createElement('script');
    script.src = loaderUrl;
    script.onload = () => {
        createUnityInstance(document.getElementById('unity-canvas'), config, (progress) => {
            loadingProgress.style.width = `${progress * 100}%`;
        }).then((instance) => {
            unityInstance = instance;
            gameLoading.style.display = 'none';
            
            // Initialize game controls
            initGameControls();
        }).catch((message) => {
            showNotification('Error loading game: ' + message, 'error');
            gameLoading.style.display = 'none';
            playBtn.style.display = 'block';
        });
    };
    
    document.body.appendChild(script);
}

function initGameControls() {
    const fullscreenBtn = document.getElementById('gameFullscreenBtn');
    const restartBtn = document.getElementById('gameRestartBtn');
    const muteBtn = document.getElementById('gameMuteBtn');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (unityInstance) {
                unityInstance.SetFullscreen(1);
            }
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (unityInstance) {
                unityInstance.Quit().then(() => {
                    loadUnityGame(currentItemData.game_folder, currentItemData.build_name);
                });
            }
        });
    }
    
    if (muteBtn) {
        let isMuted = false;
        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            if (unityInstance) {
                unityInstance.Module.WebGLSendMessage('AudioManager', isMuted ? 'Mute' : 'Unmute');
            }
            muteBtn.querySelector('i').className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        });
    }
}

function openWebsitePreview(itemData) {
  updateModalTitle(itemData.name);
  updateModalDescription(itemData.description);
  updateModalTech(itemData.technologies);
  updateModalStatus(itemData.status); // Assuming this function exists from pattern
  
  const iframe = document.getElementById('websiteIframe');
  const modalMedia = document.getElementById('modalMedia');
  
  // Clear any previous placeholders
  const existingPlaceholder = modalMedia.querySelector('.placeholder-coming-soon');
  if (existingPlaceholder) {
    existingPlaceholder.remove();
  }
  
  if (itemData.url && itemData.url !== '#') {
    iframe.src = itemData.url;
    iframe.style.display = '';
    updateModalActions(`<a href="${itemData.url}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Visit Website</a>`);
  } else {
    iframe.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'empty-state placeholder-coming-soon';
    placeholder.innerHTML = `<i class="fas fa-clock"></i><h3>Coming Soon</h3><p>This website is under development.</p>`;
    modalMedia.appendChild(placeholder);
    updateModalActions('<button class="btn btn-glass" disabled>Coming Soon</button>');
  }
  
  hideAllMediaExcept('website');
  openModal();
}

// ... (keep other functions like openGamePreview, etc.)

function openPhotoPreview(photo) {
    currentMediaType = 'photo';
    currentItemData = photo;
    currentCategory = 'photos';
    currentItems = getItemsByCategory('photos');
    currentIndex = currentItems.findIndex(item => item.id === photo.id);
    
    const modal = document.getElementById('portfolioModal');
    const photoViewer = document.getElementById('photoViewer');
    const photoImage = document.getElementById('photoImage');
    
    hideAllMediaExcept('photoViewer');
    
    photoImage.src = photo.image;
    photoViewer.style.display = 'block';
    
    updateModalInfo(photo.title, photo.description);
    updateModalStats([
        { label: 'Category', value: photo.category },
        { label: 'Camera', value: photo.camera },
        { label: 'Location', value: photo.location }
    ]);
    updateModalActions(`
        <button class="btn btn-primary" onclick="downloadMedia('${photo.image}', '${photo.title.replace(/\s+/g, '_')}.jpg')">
            <i class="fas fa-download"></i> Download
        </button>
    `);
    updateNavigationArrows();
    
    modal.classList.add('active');
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
    
    initPhotoZoom(photoImage);
}

function initPhotoZoom(image) {
    let zoomLevel = 1;
    const zoomStep = 0.5;
    const maxZoom = 3;
    const minZoom = 1;
    
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetBtn = document.getElementById('resetZoomBtn');
    
    function updateZoom() {
        image.style.transform = `scale(${zoomLevel})`;
    }
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            zoomLevel = Math.min(zoomLevel + zoomStep, maxZoom);
            updateZoom();
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            zoomLevel = Math.max(zoomLevel - zoomStep, minZoom);
            updateZoom();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            zoomLevel = 1;
            updateZoom();
        });
    }
    
    // Wheel zoom
    image.parentElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel + (e.deltaY > 0 ? -zoomStep : zoomStep)));
        updateZoom();
    });
}

function openVideoPreview(video) {
    currentMediaType = 'video';
    currentItemData = video;
    currentCategory = 'videos';
    currentItems = getItemsByCategory('videos');
    currentIndex = currentItems.findIndex(item => item.id === video.id);
    
    const modal = document.getElementById('portfolioModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const mainVideo = document.getElementById('mainVideo');
    
    hideAllMediaExcept('videoPlayer');
    
    mainVideo.src = video.video_url;
    mainVideo.load();
    videoPlayer.style.display = 'block';
    
    updateModalInfo(video.title, video.description);
    updateModalStats([
        { label: 'Category', value: video.category },
        { label: 'Duration', value: video.duration },
        { label: 'Resolution', value: video.resolution }
    ]);
    updateModalActions(`
        <button class="btn btn-primary" onclick="downloadMedia('${video.video_url}', '${video.title.replace(/\s+/g, '_')}.mp4')">
            <i class="fas fa-download"></i> Download
        </button>
    `);
    updateNavigationArrows();
    
    modal.classList.add('active');
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
    
    initVideoControls(mainVideo);
}

function initVideoControls(video) {
    const playPauseBtn = document.getElementById('videoPlayPauseBtn');
    const muteBtn = document.getElementById('videoMuteBtn');
    const volumeSlider = document.getElementById('videoVolume');
    const progressSlider = document.getElementById('videoProgress');
    const progressTime = document.getElementById('progressTime');
    const speedBtn = document.getElementById('videoSpeedBtn');
    const fullscreenBtn = document.getElementById('videoFullscreenBtn');
    
    let playbackSpeeds = [1, 1.5, 2, 0.5];
    let currentSpeedIndex = 0;
    
    // Play/Pause
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.querySelector('i').className = 'fas fa-pause';
            } else {
                video.pause();
                playPauseBtn.querySelector('i').className = 'fas fa-play';
            }
        });
    }
    
    // Mute
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            muteBtn.querySelector('i').className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        });
    }
    
    // Volume
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            video.volume = volumeSlider.value / 100;
        });
    }
    
    // Progress
    if (progressSlider && progressTime) {
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressSlider.value = progress;
            progressTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        });
        
        progressSlider.addEventListener('input', () => {
            video.currentTime = (progressSlider.value / 100) * video.duration;
        });
    }
    
    // Speed
    if (speedBtn) {
        speedBtn.addEventListener('click', () => {
            currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
            video.playbackRate = playbackSpeeds[currentSpeedIndex];
            speedBtn.querySelector('span').textContent = `${playbackSpeeds[currentSpeedIndex]}x`;
        });
    }
    
    // Fullscreen
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                video.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// =============================================================================
// MODAL UTILITIES
// =============================================================================
function hideAllMediaExcept(activeId) {
    const mediaContainers = ['websitePreview', 'gamePreview', 'photoViewer', 'videoPlayer'];
    mediaContainers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === activeId ? 'block' : 'none';
    });
    
    // Clean up previous content
    if (activeId !== 'websitePreview') document.getElementById('websiteIframe').src = '';
    if (activeId !== 'photoViewer') document.getElementById('photoImage').src = '';
    if (activeId !== 'videoPlayer') {
        const video = document.getElementById('mainVideo');
        video.pause();
        video.src = '';
    }
    if (activeId !== 'gamePreview') {
        if (unityInstance) {
            unityInstance.Quit();
            unityInstance = null;
        }
        document.getElementById('gameContainer').innerHTML = '<canvas id="unity-canvas"></canvas>';
        document.getElementById('playItemBtn').style.display = 'none';
        document.getElementById('gameLoading').style.display = 'none';
    }
}

function updateModalInfo(title, description, technologies = []) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = description;
    
    const modalTech = document.getElementById('modalTech');
    if (modalTech && technologies.length > 0) {
        modalTech.innerHTML = `
            <h4>Technologies Used</h4>
            <div class="tech-tags">
                ${technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        `;
    } else if (modalTech) {
        modalTech.innerHTML = '';
    }
}

function updateModalStats(stats) {
    const modalStats = document.getElementById('modalStats');
    if (modalStats && stats) {
        modalStats.innerHTML = stats.map(stat => `
            <div class="stat-item">
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    } else if (modalStats) {
        modalStats.innerHTML = '';
    }
}

function updateModalActions(html) {
    const modalActions = document.getElementById('modalActions');
    if (modalActions) {
        modalActions.innerHTML = html;
    }
}

function updateNavigationArrows() {
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    if (modalPrev && modalNext && currentItems && currentItems.length > 1) {
        modalPrev.style.display = 'flex';
        modalNext.style.display = 'flex';
    } else if (modalPrev && modalNext) {
        modalPrev.style.display = 'none';
        modalNext.style.display = 'none';
    }
}

function closeModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.remove('active');
    }
    isModalOpen = false;
    document.body.style.overflow = '';
    
    // Cleanup
    hideAllMediaExcept(null);
    if (unityInstance) {
        unityInstance.Quit();
        unityInstance = null;
    }
    currentMediaType = null;
    currentItemData = null;
    currentCategory = null;
    currentItems = [];
    currentIndex = 0;
}

// =============================================================================
// CONTACT FORM INITIALIZATION
// =============================================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const feedbackData = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            contact_type: formData.get('contact_type'),
            comment: formData.get('comment'),
            timestamp: new Date().toISOString()
        };
        
        // Basic validation
        if (!feedbackData.full_name || !feedbackData.email || !feedbackData.contact_type || !feedbackData.comment) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(feedbackData.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Save feedback
        if (typeof saveFeedback === 'function') {
            const saved = saveFeedback(feedbackData);
            if (saved) {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showNotification('Error sending message. Please try again.', 'error');
            }
        } else {
            showNotification('Thank you for your message!', 'success');
            contactForm.reset();
        }
    });
}

// =============================================================================
// NOTIFICATION SYSTEM
// =============================================================================
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="notification-text">
                <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, duration);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
function downloadMedia(url, filename) {
    if (!url) {
        showNotification('Download URL not available', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Downloading ${filename}...`, 'success');
}

function getItemsByCategory(category) {
    if (typeof window.getItemsByCategory === 'function') {
        return window.getItemsByCategory(category);
    }
    
    // Fallback if function not available
    switch (category) {
        case 'games': return window.PORTFOLIO_DATA?.games || [];
        case 'websites': return window.PORTFOLIO_DATA?.websites || [];
        case 'photos': return window.PORTFOLIO_DATA?.photos || [];
        case 'videos': return window.PORTFOLIO_DATA?.videos || [];
        default: return [];
    }
}

// =============================================================================
// GLOBAL EXPORTS
// =============================================================================
window.openGamePreview = openGamePreview;
window.openWebsitePreview = openWebsitePreview;
window.openPhotoPreview = openPhotoPreview;
window.openVideoPreview = openVideoPreview;
window.closeModal = closeModal;
window.showNotification = showNotification;