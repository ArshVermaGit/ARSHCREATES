let currentGame = null;
let unityInstance = null;
let currentMediaType = null;
let currentVideoElement = null;
let currentItemData = null;
let isModalOpen = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioCards();
    initContactForm();
    initModalEvents();
});

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
    });
    
    // Prevent modal content click from closing modal
    const modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// =============================================================================
// PORTFOLIO CARDS INITIALIZATION - FIXED
// =============================================================================
function initPortfolioCards() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        const type = card.dataset.type;
        
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                if (type === 'game') {
                    const gameData = JSON.parse(card.dataset.game);
                    openGamePreview(gameData);
                } else if (type === 'website') {
                    const websiteData = JSON.parse(card.dataset.website);
                    openWebsitePreview(websiteData);
                } else if (type === 'photo') {
                    const photoData = JSON.parse(card.dataset.photo);
                    openPhotoPreview(photoData);
                } else if (type === 'video') {
                    const videoData = JSON.parse(card.dataset.video);
                    openVideoPreview(videoData);
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
    
    // Load Unity game
    const buildUrl = `/static/games/${currentGame.game_folder}/Build`;
    const loaderUrl = `${buildUrl}/${currentGame.build_name}.loader.js`;
    const config = {
        dataUrl: `${buildUrl}/${currentGame.build_name}.data`,
        frameworkUrl: `${buildUrl}/${currentGame.build_name}.framework.js`,
        codeUrl: `${buildUrl}/${currentGame.build_name}.wasm`,
        streamingAssetsUrl: "StreamingAssets",
        companyName: "ArshVerma",
        productName: currentGame.name,
        productVersion: "1.0",
    };
    
    console.log('Unity config:', config);
    
    const canvas = document.querySelector("#unity-canvas");
    if (!canvas) {
        showNotification('Game canvas not found.', 'error');
        return;
    }
    
    // Remove existing Unity script if any
    const existingScript = document.querySelector(`script[src="${loaderUrl}"]`);
    if (existingScript) {
        existingScript.remove();
        console.log('Removed existing Unity script');
    }
    
    const script = document.createElement("script");
    script.src = loaderUrl;
    
    script.onload = () => {
        console.log('Unity loader script loaded');
        
        if (typeof createUnityInstance !== 'function') {
            showNotification('Unity loader failed to initialize.', 'error');
            console.error('createUnityInstance not found');
            return;
        }
        
        createUnityInstance(canvas, config, (progress) => {
            if (loadingProgress) {
                loadingProgress.style.width = (progress * 100) + "%";
            }
            console.log('Loading progress:', (progress * 100) + '%');
        }).then((instance) => {
            unityInstance = instance;
            if (gameLoading) gameLoading.style.display = 'none';
            showNotification('Game loaded successfully!', 'success');
            console.log('Unity instance created successfully');
        }).catch((error) => {
            console.error('Unity instance creation failed:', error);
            showNotification('Failed to load game. Please try again.', 'error');
            closeModal();
        });
    };
    
    script.onerror = (error) => {
        console.error('Script loading error:', error);
        showNotification('Failed to load game files. Please check if game files exist.', 'error');
        closeModal();
    };
    
    document.body.appendChild(script);
    console.log('Unity script appended to body');
}

function toggleGameFullscreen() {
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) return;
    
    if (!document.fullscreenElement) {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
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
            window.open(websiteData.url, '_blank');
            showNotification('Opening website...', 'info');
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
                window.open(websiteData.url, '_blank');
                showNotification('Opening website...', 'info');
            };
        }
    }, 50);
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
    
    hideAllPreviewElements();
    
    const photoViewer = document.getElementById('photoViewer');
    const playBtn = document.getElementById('playItemBtn');
    
    if (photoViewer) {
        photoViewer.innerHTML = `
            <img src="${photoData.image}" alt="${photoData.title}" 
                 style="width: 100%; height: 100%; object-fit: contain; cursor: pointer;" 
                 id="photoImage">
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
        const downloadBtn = document.getElementById('downloadPhotoBtn');
        const fullscreenBtn = document.getElementById('fullscreenPhotoBtn');
        const photoImg = document.getElementById('photoImage');
        
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                downloadMedia(photoData.image, `${photoData.title}.jpg`);
            };
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.onclick = () => {
                if (photoImg && photoImg.requestFullscreen) {
                    photoImg.requestFullscreen();
                }
            };
        }
        
        if (photoImg) {
            photoImg.onclick = function() {
                if (this.requestFullscreen) {
                    this.requestFullscreen();
                }
            };
        }
    }, 50);
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
    
    hideAllPreviewElements();
    
    const videoPlayer = document.getElementById('videoPlayer');
    const playBtn = document.getElementById('playItemBtn');
    
    if (videoPlayer) {
        videoPlayer.innerHTML = `
            <video id="mainVideo" controls style="width: 100%; height: 100%; object-fit: contain;">
                <source src="${videoData.video_url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
        videoPlayer.style.display = 'flex';
        
        // Store video element reference
        currentVideoElement = videoPlayer.querySelector('#mainVideo');
    }
    
    if (playBtn) playBtn.style.display = 'none';
    
    setupModalActions(`
        <button class="btn btn-glass" id="playPauseBtn">
            <i class="fas fa-pause"></i> Pause
        </button>
        <button class="btn btn-glass" id="muteBtn">
            <i class="fas fa-volume-up"></i> Mute
        </button>
        <button class="btn btn-glass" id="downloadVideoBtn">
            <i class="fas fa-download"></i> Download
        </button>
        <button class="btn btn-glass" id="fullscreenVideoBtn">
            <i class="fas fa-expand"></i> Fullscreen
        </button>
    `);
    
    openModal();
    
    // Setup video controls after modal is open
    setTimeout(() => {
        setupVideoControls();
    }, 50);
}

function setupVideoControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const downloadBtn = document.getElementById('downloadVideoBtn');
    const fullscreenBtn = document.getElementById('fullscreenVideoBtn');
    
    if (!currentVideoElement) return;
    
    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.onclick = () => togglePlayPause(playPauseBtn);
    }
    
    // Mute button
    if (muteBtn) {
        muteBtn.onclick = () => toggleMute(muteBtn);
    }
    
    // Download button
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            downloadMedia(currentItemData.video_url, `${currentItemData.title}.mp4`);
        };
    }
    
    // Fullscreen button
    if (fullscreenBtn) {
        fullscreenBtn.onclick = () => {
            if (currentVideoElement.requestFullscreen) {
                currentVideoElement.requestFullscreen();
            }
        };
    }
    
    // Auto-play video
    const playPromise = currentVideoElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Auto-play prevented:', error);
            showNotification('Click play to start video', 'info');
        });
    }
    
    // Update play/pause button state
    currentVideoElement.addEventListener('play', () => {
        const btn = document.getElementById('playPauseBtn');
        if (btn) btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    });
    
    currentVideoElement.addEventListener('pause', () => {
        const btn = document.getElementById('playPauseBtn');
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Play';
    });
}

// =============================================================================
// MEDIA CONTROLS - FIXED
// =============================================================================
function togglePlayPause(btn) {
    if (!currentVideoElement) return;
    
    if (currentVideoElement.paused) {
        currentVideoElement.play().catch(error => {
            console.error('Play failed:', error);
            showNotification('Failed to play video', 'error');
        });
    } else {
        currentVideoElement.pause();
    }
}

function toggleMute(btn) {
    if (!currentVideoElement) return;
    
    currentVideoElement.muted = !currentVideoElement.muted;
    btn.innerHTML = currentVideoElement.muted ? 
        '<i class="fas fa-volume-mute"></i> Unmute' : 
        '<i class="fas fa-volume-up"></i> Mute';
}

function downloadMedia(url, filename) {
    if (!url) {
        showNotification('Download URL not available.', 'error');
        return;
    }
    
    try {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'download';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showNotification('Download started!', 'success');
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

function setupModalActions(html) {
    const modalActions = document.getElementById('modalActions');
    if (modalActions) {
        modalActions.innerHTML = html;
        console.log('Modal actions set');
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

console.log('Portfolio JS initialized successfully');