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
    initQuickNavigation();
    initQuickActions();
    
    // Initialize portfolio if not already done
    if (typeof initializePortfolio === 'function') {
        setTimeout(initializePortfolio, 100);
    }
});

// =============================================================================
// QUICK NAVIGATION INITIALIZATION
// =============================================================================
function initQuickNavigation() {
    const quickNav = document.getElementById('quickNav');
    const quickNavBtns = document.querySelectorAll('.quick-nav-btn');
    
    if (!quickNav || !quickNavBtns.length) return;
    
    // Show quick nav after hero section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                quickNav.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
    
    // Quick nav button click handlers
    quickNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section) {
                // Update active state
                quickNavBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to section
                const targetSection = document.getElementById(section);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Update active state on scroll
    window.addEventListener('scroll', function() {
        const sections = ['games', 'websites', 'photos', 'videos'];
        let currentSection = '';
        
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    currentSection = section;
                }
            }
        });
        
        if (currentSection) {
            quickNavBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.section === currentSection);
            });
        }
    });
}

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
        showNotification('No item selected to share', 'info');
        return;
    }
    
    const shareData = {
        title: currentItemData.name || currentItemData.title,
        text: currentItemData.description,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Item shared successfully!', 'success'))
            .catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        const textToCopy = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => showNotification('Link copied to clipboard!', 'success'))
            .catch(err => showNotification('Failed to copy to clipboard', 'error'));
    }
}

// =============================================================================
// MODAL EVENT LISTENERS INITIALIZATION
// =============================================================================
function initModalEvents() {
    // Modal close event listeners
    const closeModalBtn = document.getElementById('closeModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Escape key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
        
        // Navigation with arrow keys
        if (isModalOpen && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') {
                navigateModal('prev');
            } else {
                navigateModal('next');
            }
        }
    });
    
    // Prevent modal content click from closing modal
    const modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Modal navigation arrows
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    if (modalPrev) {
        modalPrev.addEventListener('click', () => navigateModal('prev'));
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', () => navigateModal('next'));
    }
}

// =============================================================================
// MODAL NAVIGATION
// =============================================================================
function navigateModal(direction) {
    if (!currentCategory || !currentItems.length) return;
    
    let newIndex;
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % currentItems.length;
    } else {
        newIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    }
    
    currentIndex = newIndex;
    const item = currentItems[currentIndex];
    
    // Reopen modal with new item
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
// PORTFOLIO CARDS INITIALIZATION - FIXED
// =============================================================================
function initPortfolioCards() {
    const cards = document.querySelectorAll('.portfolio-card');
    console.log('Initializing portfolio cards:', cards.length);
    
    cards.forEach(card => {
        const type = card.dataset.type;
        
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                // Set current category and items for navigation
                currentCategory = type + 's'; // games, websites, etc.
                currentItems = getItemsByCategory(currentCategory);
                
                let itemData;
                switch (type) {
                    case 'game':
                        itemData = JSON.parse(card.dataset.game);
                        currentIndex = currentItems.findIndex(item => item.id === itemData.id);
                        openGamePreview(itemData);
                        break;
                    case 'website':
                        itemData = JSON.parse(card.dataset.website);
                        currentIndex = currentItems.findIndex(item => item.id === itemData.id);
                        openWebsitePreview(itemData);
                        break;
                    case 'photo':
                        itemData = JSON.parse(card.dataset.photo);
                        currentIndex = currentItems.findIndex(item => item.id === itemData.id);
                        openPhotoPreview(itemData);
                        break;
                    case 'video':
                        itemData = JSON.parse(card.dataset.video);
                        currentIndex = currentItems.findIndex(item => item.id === itemData.id);
                        openVideoPreview(itemData);
                        break;
                }
            } catch (error) {
                console.error('Error opening preview:', error);
                showNotification('Error loading content. Please try again.', 'error');
            }
        });
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        
        // Add tabindex for accessibility
        card.setAttribute('tabindex', '0');
    });
}

function openGamePreview(gameData) {
    if (!gameData) {
        showNotification('Game data not available.', 'error');
        return;
    }
    
    currentGame = gameData;
    currentItemData = gameData;
    currentMediaType = 'game';
    
    const modal = document.getElementById('portfolioModal');
    if (!modal) {
        showNotification('Modal not found.', 'error');
        return;
    }
    
    // Update modal content
    updateModalContent({
        title: gameData.name,
        description: gameData.description || gameData.overview,
        image: gameData.image
    });
    
    // Setup modal meta info
    updateModalMeta(`
        <div class="meta-item">
            <i class="fas fa-tags"></i>
            <span>${gameData.status || 'Playable'}</span>
        </div>
        ${gameData.technologies ? `
        <div class="meta-item">
            <i class="fas fa-code"></i>
            <span>${gameData.technologies.join(', ')}</span>
        </div>
        ` : ''}
    `);
    
    // Setup modal tech tags
    if (gameData.technologies && gameData.technologies.length > 0) {
        updateModalTech(gameData.technologies);
    }
    
    // Setup game-specific elements
    const playBtn = document.getElementById('playItemBtn');
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    
    hideAllPreviewElements();
    
    // Show preview image
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = gameData.image;
        previewImage.style.display = 'block';
        previewImage.alt = gameData.name;
    }
    
    // Setup game preview area
    if (gamePreview) {
        gamePreview.style.display = 'flex';
    }
    if (gameContainer) {
        gameContainer.style.display = 'none';
    }
    
    // Setup play button
    if (playBtn) {
        playBtn.style.display = 'flex';
        playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Game</span>';
        playBtn.onclick = loadUnityGame;
    }
    
    // Setup modal actions
    setupModalActions(`
        <button class="btn btn-glass" id="fullscreenBtn" style="display:none;">
            <i class="fas fa-expand"></i> Fullscreen
        </button>
    `);
    
    // Open modal
    openModal();
    
    // Update navigation arrows visibility
    updateNavigationArrows();
}

function loadUnityGame() {
    if (!currentGame) {
        showNotification('No game selected.', 'error');
        return;
    }
    
    console.log('Loading Unity game:', currentGame.name);
    
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const gameLoading = document.getElementById('gameLoading');
    const loadingProgress = document.getElementById('loadingProgress');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // CRITICAL: Hide preview and show game container
    if (gamePreview) {
        gamePreview.style.display = 'none';
        console.log('Preview hidden');
    }
    if (gameContainer) {
        gameContainer.style.display = 'flex';
        console.log('Game container shown');
    }
    if (gameLoading) {
        gameLoading.style.display = 'flex';
        console.log('Loading screen shown');
    }
    if (loadingProgress) {
        loadingProgress.style.width = '0%';
    }
    
    if (fullscreenBtn) {
        fullscreenBtn.style.display = 'inline-flex';
        fullscreenBtn.onclick = toggleGameFullscreen;
    }
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            if (gameLoading) gameLoading.style.display = 'none';
            showNotification('Game demo loaded successfully! (Unity integration ready)', 'success');
        }
        if (loadingProgress) {
            loadingProgress.style.width = progress + '%';
        }
    }, 200);
}

function toggleGameFullscreen() {
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) return;
    
    if (!document.fullscreenElement) {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// =============================================================================
// WEBSITE PREVIEW - FIXED
// =============================================================================
function openWebsitePreview(websiteData) {
    if (!websiteData) {
        showNotification('Website data not available.', 'error');
        return;
    }
    
    console.log('Opening website preview:', websiteData);
    
    currentItemData = websiteData;
    currentMediaType = 'website';
    
    updateModalContent({
        title: websiteData.name,
        description: websiteData.description,
        image: websiteData.image
    });
    
    // Setup modal meta info
    updateModalMeta(`
        <div class="meta-item">
            <i class="fas fa-globe"></i>
            <span>${websiteData.status || 'Live'}</span>
        </div>
        ${websiteData.technologies ? `
        <div class="meta-item">
            <i class="fas fa-code"></i>
            <span>${websiteData.technologies.join(', ')}</span>
        </div>
        ` : ''}
    `);
    
    // Setup modal tech tags
    if (websiteData.technologies && websiteData.technologies.length > 0) {
        updateModalTech(websiteData.technologies);
    }
    
    hideAllPreviewElements();
    
    const itemPreview = document.getElementById('itemPreview');
    const previewImage = document.getElementById('previewImage');
    const playBtn = document.getElementById('playItemBtn');
    
    if (itemPreview) {
        itemPreview.style.display = 'flex';
    }
    
    if (previewImage) {
        previewImage.src = websiteData.image;
        previewImage.style.display = 'block';
        previewImage.style.cursor = 'pointer';
        previewImage.alt = websiteData.name;
        
        // Setup click event for image
        previewImage.onclick = () => {
            if (websiteData.url && websiteData.url !== '#') {
                window.open(websiteData.url, '_blank');
                showNotification('Opening website...', 'info');
            } else {
                showNotification('Website URL not available', 'info');
            }
        };
    }
    
    if (playBtn) playBtn.style.display = 'none';
    
    setupModalActions(`
        <button class="btn btn-primary" id="visitWebsiteBtn">
            <i class="fas fa-external-link-alt"></i> Visit Website
        </button>
    `);
    
    openModal();
    
    // Setup website button after modal is open
    setTimeout(() => {
        const visitBtn = document.getElementById('visitWebsiteBtn');
        if (visitBtn) {
            visitBtn.onclick = () => {
                if (websiteData.url && websiteData.url !== '#') {
                    window.open(websiteData.url, '_blank');
                    showNotification('Opening website...', 'info');
                } else {
                    showNotification('Website URL not available', 'info');
                }
            };
        }
    }, 50);
    
    // Update navigation arrows visibility
    updateNavigationArrows();
}

// =============================================================================
// PHOTO PREVIEW - FIXED
// =============================================================================
function openPhotoPreview(photoData) {
    if (!photoData) {
        showNotification('Photo data not available.', 'error');
        return;
    }
    
    console.log('Opening photo preview:', photoData);
    
    currentItemData = photoData;
    currentMediaType = 'photo';
    
    updateModalContent({
        title: photoData.title,
        description: photoData.description
    });
    
    // Setup modal meta info
    updateModalMeta(`
        <div class="meta-item">
            <i class="fas fa-image"></i>
            <span>${photoData.category}</span>
        </div>
        ${photoData.camera ? `
        <div class="meta-item">
            <i class="fas fa-camera"></i>
            <span>${photoData.camera}</span>
        </div>
        ` : ''}
        ${photoData.location ? `
        <div class="meta-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${photoData.location}</span>
        </div>
        ` : ''}
    `);
    
    hideAllPreviewElements();
    
    const photoViewer = document.getElementById('photoViewer');
    const playBtn = document.getElementById('playItemBtn');
    
    if (photoViewer) {
        photoViewer.innerHTML = `
            <div class="photo-container">
                <img src="${photoData.image}" alt="${photoData.title}" 
                     style="width: 100%; height: 100%; object-fit: contain; cursor: pointer;" 
                     id="photoImage">
                <div class="photo-zoom-controls">
                    <button class="zoom-btn" id="zoomInBtn">
                        <i class="fas fa-search-plus"></i>
                    </button>
                    <button class="zoom-btn" id="zoomOutBtn">
                        <i class="fas fa-search-minus"></i>
                    </button>
                    <button class="zoom-btn" id="resetZoomBtn">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
        `;
        photoViewer.style.display = 'flex';
    }
    
    if (playBtn) playBtn.style.display = 'none';
    
    setupModalActions(`
        <button class="btn btn-glass" id="downloadPhotoBtn">
            <i class="fas fa-download"></i> Download
        </button>
        <button class="btn btn-glass" id="fullscreenPhotoBtn">
            <i class="fas fa-expand"></i> Fullscreen
        </button>
    `);
    
    openModal();
    
    // Setup photo buttons after modal is open
    setTimeout(() => {
        initPhotoViewer();
    }, 50);
    
    // Update navigation arrows visibility
    updateNavigationArrows();
}

function initPhotoViewer() {
    const downloadBtn = document.getElementById('downloadPhotoBtn');
    const fullscreenBtn = document.getElementById('fullscreenPhotoBtn');
    const photoImg = document.getElementById('photoImage');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetZoomBtn = document.getElementById('resetZoomBtn');
    
    let scale = 1;
    
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            if (currentItemData && currentItemData.image) {
                downloadMedia(currentItemData.image, `${currentItemData.title}.jpg`);
            }
        };
    }
    
    if (fullscreenBtn && photoImg) {
        fullscreenBtn.onclick = () => {
            if (photoImg.requestFullscreen) {
                photoImg.requestFullscreen();
            }
        };
    }
    
    if (zoomInBtn) {
        zoomInBtn.onclick = () => {
            scale = Math.min(scale + 0.25, 3);
            photoImg.style.transform = `scale(${scale})`;
        };
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.onclick = () => {
            scale = Math.max(scale - 0.25, 0.5);
            photoImg.style.transform = `scale(${scale})`;
        };
    }
    
    if (resetZoomBtn) {
        resetZoomBtn.onclick = () => {
            scale = 1;
            photoImg.style.transform = `scale(${scale})`;
        };
    }
    
    if (photoImg) {
        photoImg.onclick = function() {
            if (this.requestFullscreen) {
                this.requestFullscreen();
            }
        };
        
        // Enable panning when zoomed
        let isDragging = false;
        let startX, startY, scrollLeft, scrollTop;
        
        photoImg.addEventListener('mousedown', (e) => {
            if (scale > 1) {
                isDragging = true;
                startX = e.pageX - photoImg.offsetLeft;
                startY = e.pageY - photoImg.offsetTop;
                scrollLeft = photoImg.scrollLeft;
                scrollTop = photoImg.scrollTop;
                photoImg.style.cursor = 'grabbing';
            }
        });
        
        photoImg.addEventListener('mouseleave', () => {
            isDragging = false;
            photoImg.style.cursor = 'grab';
        });
        
        photoImg.addEventListener('mouseup', () => {
            isDragging = false;
            photoImg.style.cursor = 'grab';
        });
        
        photoImg.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - photoImg.offsetLeft;
            const y = e.pageY - photoImg.offsetTop;
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            photoImg.scrollLeft = scrollLeft - walkX;
            photoImg.scrollTop = scrollTop - walkY;
        });
    }
}

// =============================================================================
// VIDEO PREVIEW - FIXED
// =============================================================================
function openVideoPreview(videoData) {
    if (!videoData) {
        showNotification('Video data not available.', 'error');
        return;
    }
    
    console.log('Opening video preview:', videoData);
    
    currentItemData = videoData;
    currentMediaType = 'video';
    
    updateModalContent({
        title: videoData.title,
        description: videoData.description
    });
    
    // Setup modal meta info
    updateModalMeta(`
        <div class="meta-item">
            <i class="fas fa-film"></i>
            <span>${videoData.category}</span>
        </div>
        ${videoData.duration ? `
        <div class="meta-item">
            <i class="fas fa-clock"></i>
            <span>${videoData.duration}</span>
        </div>
        ` : ''}
        ${videoData.resolution ? `
        <div class="meta-item">
            <i class="fas fa-hd-video"></i>
            <span>${videoData.resolution}</span>
        </div>
        ` : ''}
    `);
    
    hideAllPreviewElements();
    
    const videoPlayer = document.getElementById('videoPlayer');
    const playBtn = document.getElementById('playItemBtn');
    
    if (videoPlayer) {
        videoPlayer.innerHTML = `
            <div class="video-container">
                <video id="mainVideo" controls>
                    <source src="${videoData.video_url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-controls-overlay">
                    <div class="video-progress">
                        <input type="range" id="videoProgress" min="0" max="100" value="0" class="progress-bar">
                        <div class="progress-time" id="progressTime">0:00 / 0:00</div>
                    </div>
                    <div class="video-controls">
                        <button class="video-control-btn" id="videoPlayPauseBtn">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="video-control-btn" id="videoMuteBtn">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <input type="range" id="videoVolume" min="0" max="100" value="100" class="volume-bar">
                        <button class="video-control-btn" id="videoSpeedBtn">
                            <span>1x</span>
                        </button>
                        <button class="video-control-btn" id="videoFullscreenBtn">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        videoPlayer.style.display = 'flex';
    }
    
    if (playBtn) playBtn.style.display = 'none';
    
    setupModalActions(`
        <button class="btn btn-glass" id="downloadVideoBtn">
            <i class="fas fa-download"></i> Download
        </button>
    `);
    
    openModal();
    
    // Setup video controls after modal is open
    setTimeout(() => {
        initVideoPlayer();
    }, 50);
    
    // Update navigation arrows visibility
    updateNavigationArrows();
}

function initVideoPlayer() {
    const video = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('videoPlayPauseBtn');
    const muteBtn = document.getElementById('videoMuteBtn');
    const volumeSlider = document.getElementById('videoVolume');
    const speedBtn = document.getElementById('videoSpeedBtn');
    const fullscreenBtn = document.getElementById('videoFullscreenBtn');
    const progressBar = document.getElementById('videoProgress');
    const progressTime = document.getElementById('progressTime');
    const downloadBtn = document.getElementById('downloadVideoBtn');
    
    if (!video) return;
    
    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.onclick = () => {
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        };
    }
    
    // Mute button
    if (muteBtn) {
        muteBtn.onclick = () => {
            video.muted = !video.muted;
            muteBtn.innerHTML = video.muted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        };
    }
    
    // Volume slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            video.volume = volumeSlider.value / 100;
        });
    }
    
    // Speed control
    if (speedBtn) {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        let speedIndex = 2; // Start at 1x
        
        speedBtn.onclick = () => {
            speedIndex = (speedIndex + 1) % speeds.length;
            video.playbackRate = speeds[speedIndex];
            speedBtn.innerHTML = `<span>${speeds[speedIndex]}x</span>`;
        };
    }
    
    // Fullscreen button
    if (fullscreenBtn) {
        fullscreenBtn.onclick = () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        };
    }
    
    // Progress bar
    if (progressBar) {
        progressBar.addEventListener('input', () => {
            const percent = progressBar.value;
            video.currentTime = (percent / 100) * video.duration;
        });
    }
    
    // Update progress bar as video plays
    video.addEventListener('timeupdate', () => {
        if (progressBar && video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.value = percent;
        }
        
        if (progressTime) {
            const currentTime = formatTime(video.currentTime);
            const duration = formatTime(video.duration);
            progressTime.textContent = `${currentTime} / ${duration}`;
        }
    });
    
    // Download button
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            if (currentItemData && currentItemData.video_url) {
                downloadMedia(currentItemData.video_url, `${currentItemData.title}.mp4`);
            }
        };
    }
    
    // Video ended
    video.addEventListener('ended', () => {
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Update time display initially
    if (progressTime) {
        progressTime.textContent = `0:00 / ${formatTime(video.duration)}`;
    }
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// =============================================================================
// MODAL UTILITY FUNCTIONS
// =============================================================================
function openModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.add('active');
        isModalOpen = true;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus trap for accessibility
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.remove('active');
        isModalOpen = false;
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // Stop any playing videos
        const video = document.getElementById('mainVideo');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        
        // Reset photo zoom
        const photoImg = document.getElementById('photoImage');
        if (photoImg) {
            photoImg.style.transform = 'scale(1)';
        }
        
        // Hide quick actions
        const quickActions = document.getElementById('quickActions');
        if (quickActions) {
            quickActions.style.display = 'none';
        }
        
        modal.setAttribute('aria-hidden', 'true');
    }
}

function hideAllPreviewElements() {
    const elements = [
        'itemPreview',
        'photoViewer', 
        'videoPlayer',
        'gameContainer'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function updateModalContent({ title, description, image }) {
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    if (modalTitle && title) {
        modalTitle.textContent = title;
    }
    
    if (modalDescription && description) {
        modalDescription.textContent = description;
    }
}

function updateModalMeta(html) {
    const modalMeta = document.getElementById('modalMeta');
    if (modalMeta) {
        modalMeta.innerHTML = html;
    }
}

function updateModalTech(technologies) {
    const modalTech = document.getElementById('modalTech');
    if (modalTech && technologies && technologies.length > 0) {
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

function setupModalActions(html) {
    const modalActions = document.getElementById('modalActions');
    if (modalActions) {
        modalActions.innerHTML = html;
    }
}

function updateNavigationArrows() {
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    if (modalPrev && modalNext && currentItems && currentItems.length > 0) {
        modalPrev.style.display = currentItems.length > 1 ? 'flex' : 'none';
        modalNext.style.display = currentItems.length > 1 ? 'flex' : 'none';
    }
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
            comment: formData.get('comment')
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