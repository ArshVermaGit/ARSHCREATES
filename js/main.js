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
    
    // Remove quick actions initialization since we're moving buttons to modals
    const quickActions = document.getElementById('quickActions');
    if (quickActions) {
        quickActions.style.display = 'none';
    }
    
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
    
    // Setup modal actions - NO DOWNLOAD BUTTON FOR GAMES
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
// WEBSITE PREVIEW - FIXED WITH SHARE BUTTON
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
    
    // ADD SHARE BUTTON FOR WEBSITES, NO DOWNLOAD BUTTON
    setupModalActions(`
        <button class="btn btn-primary" id="visitWebsiteBtn">
            <i class="fas fa-external-link-alt"></i> Visit Website
        </button>
        <button class="btn btn-glass" id="shareWebsiteBtn">
            <i class="fas fa-share-alt"></i> Share Website
        </button>
    `);
    
    openModal();
    
    // Setup website buttons after modal is open
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
        
        const shareBtn = document.getElementById('shareWebsiteBtn');
        if (shareBtn) {
            shareBtn.onclick = () => {
                shareWebsite(websiteData);
            };
        }
    }, 50);
    
    // Update navigation arrows visibility
    updateNavigationArrows();
}

// =============================================================================
// SHARE WEBSITE FUNCTION
// =============================================================================
function shareWebsite(websiteData) {
    const shareData = {
        title: websiteData.name,
        text: websiteData.description,
        url: websiteData.url
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Website shared successfully!', 'success'))
            .catch(err => {
                console.log('Error sharing:', err);
                copyToClipboard(websiteData.url);
            });
    } else {
        copyToClipboard(websiteData.url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Link copied to clipboard!', 'success'))
        .catch(err => showNotification('Failed to copy to clipboard', 'error'));
}

// =============================================================================
// PHOTO PREVIEW - FIXED WITH DOWNLOAD BUTTON ONLY
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
    
    // ONLY DOWNLOAD BUTTON FOR PHOTOS, NO SHARE
    setupModalActions(`
        <button class="btn btn-primary" id="downloadPhotoBtn">
            <i class="fas fa-download"></i> Download Photo
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
// VIDEO PREVIEW - FIXED WITH DOWNLOAD BUTTON ONLY
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
            </div>
        `;
        videoPlayer.style.display = 'flex';
    }
    
    if (playBtn) playBtn.style.display = 'none';
    
    // ONLY DOWNLOAD BUTTON FOR VIDEOS, NO SHARE
    setupModalActions(`
        <button class="btn btn-primary" id="downloadVideoBtn">
            <i class="fas fa-download"></i> Download Video
        </button>
    `);
    
    openModal();
    
    // Setup video download button after modal is open
    setTimeout(() => {
        const downloadBtn = document.getElementById('downloadVideoBtn');
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                if (currentItemData && currentItemData.video_url) {
                    downloadMedia(currentItemData.video_url, `${currentItemData.title}.mp4`);
                }
            };
        }
    }, 50);
    
    // Update navigation arrows visibility
    updateNavigationArrows();
}

// =============================================================================
// MEDIA DOWNLOAD FUNCTION
// =============================================================================
function downloadMedia(url, filename) {
    if (!url) {
        showNotification('Download URL not available.', 'error');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification(`Downloading ${filename}...`, 'success');
    } catch (error) {
        console.error('Download failed:', error);
        showNotification('Download failed. Please try again.', 'error');
    }
}

// =============================================================================
// MODAL UTILITY FUNCTIONS - FIXED
// =============================================================================
function updateModalContent({ title, description, image }) {
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    if (modalTitle && title) {
        modalTitle.textContent = title;
        console.log('Modal title set:', title);
    }
    if (modalDescription && description) {
        modalDescription.textContent = description;
        console.log('Modal description set:', description);
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
            <h4>Technologies</h4>
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
        console.log('Modal actions set');
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

function hideAllPreviewElements() {
    const elements = [
        'previewImage', 'itemPreview', 'gameContainer', 
        'photoViewer', 'videoPlayer'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
            if (id === 'previewImage') {
                element.onclick = null;
                element.style.cursor = 'default';
            }
        }
    });
    
    // Hide loading state
    const gameLoading = document.getElementById('gameLoading');
    if (gameLoading) {
        gameLoading.style.display = 'none';
    }
    
    // Hide play button
    const playBtn = document.getElementById('playItemBtn');
    if (playBtn) {
        playBtn.style.display = 'none';
    }
}

// =============================================================================
// MODAL OPEN/CLOSE - ORIGINAL WORKING VERSION
// =============================================================================
function openModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        isModalOpen = true;
        
        console.log('Modal opened successfully');
    }
}

function closeModal() {
    console.log('Closing modal');
    
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    isModalOpen = false;
    
    // Clean up resources
    if (unityInstance) {
        try {
            unityInstance.Quit();
            console.log('Unity instance quit');
        } catch (error) {
            console.warn('Error quitting Unity instance:', error);
        }
        unityInstance = null;
    }
    
    if (currentVideoElement) {
        currentVideoElement.pause();
        currentVideoElement = null;
        console.log('Video element cleaned up');
    }
    
    // Exit fullscreen if active
    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    
    // Reset state
    currentGame = null;
    currentMediaType = null;
    currentItemData = null;
    
    // Reset modal content
    hideAllPreviewElements();
    
    console.log('Modal closed and cleaned up');
}

// =============================================================================
// CONTACT FORM - IMPLEMENTED
// =============================================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }
    
    let isSubmitting = false;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isSubmitting) {
            console.log('Form is already submitting...');
            return;
        }
        
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        isSubmitting = true;
        
        try {
            const formData = {
                full_name: contactForm.querySelector('[name="full_name"]').value.trim(),
                email: contactForm.querySelector('[name="email"]').value.trim(),
                phone: contactForm.querySelector('[name="phone"]').value.trim(),
                contact_type: contactForm.querySelector('[name="contact_type"]').value.trim(),
                comment: contactForm.querySelector('[name="comment"]').value.trim()
            };
            
            // Basic validation
            const requiredFields = ['full_name', 'email', 'contact_type', 'comment'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = contactForm.querySelector(`[name="${field}"]`);
                if (!formData[field]) {
                    input.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                throw new Error('Please fill in all required fields');
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                contactForm.querySelector('[name="email"]').style.borderColor = 'rgba(239, 68, 68, 0.6)';
                throw new Error('Please enter a valid email address');
            }
            
            // Save feedback using data.js functions
            if (typeof saveFeedback === 'function') {
                saveFeedback(formData);
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                
                // Reset border colors
                contactForm.querySelectorAll('input, select, textarea').forEach(input => {
                    input.style.borderColor = '';
                });
            } else {
                throw new Error('Feedback system not available');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message || 'Failed to send message. Please try again.', 'error');
        } finally {
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            isSubmitting = false;
        }
    });
    
    // Real-time validation feedback
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            }
        });
    });
    
    // Email-specific validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            } else {
                this.style.borderColor = '';
            }
        });
        
        emailInput.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }
}

// =============================================================================
// NOTIFICATION SYSTEM - IMPLEMENTED
// =============================================================================
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        notif.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notif.remove(), 300);
    });
    
    const container = document.getElementById('notificationContainer');
    if (!container) {
        console.error('Notification container not found');
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    const title = type === 'success' ? 'Success' : 
                  type === 'error' ? 'Error' : 
                  'Info';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Make functions globally available
window.showNotification = showNotification;
window.initContactForm = initContactForm;
window.closeModal = closeModal;
window.openGamePreview = openGamePreview;
window.openWebsitePreview = openWebsitePreview;
window.openPhotoPreview = openPhotoPreview;
window.openVideoPreview = openVideoPreview;
window.initPortfolioCards = initPortfolioCards;
window.navigateModal = navigateModal;