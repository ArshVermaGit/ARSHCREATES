// =============================================================================
// MAIN.JS - Updated Portfolio JavaScript with New Preview Logic
// =============================================================================

let currentGame = null;
let unityInstance = null;
let currentMediaType = null;
let currentVideoElement = null;
let currentItemData = null;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioCards();
    initContactForm();
});

// =============================================================================
// PORTFOLIO CARDS INITIALIZATION
// =============================================================================
function initPortfolioCards() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        const type = card.dataset.type;
        
        if (type === 'game') {
            const gameData = JSON.parse(card.dataset.game);
            card.addEventListener('click', () => openGamePreview(gameData));
        } else if (type === 'website') {
            const websiteData = JSON.parse(card.dataset.website);
            card.addEventListener('click', () => openWebsitePreview(websiteData));
        } else if (type === 'photo') {
            const photoData = JSON.parse(card.dataset.photo);
            card.addEventListener('click', () => openPhotoPreview(photoData));
        } else if (type === 'video') {
            const videoData = JSON.parse(card.dataset.video);
            card.addEventListener('click', () => openVideoPreview(videoData));
        }
    });
}

// =============================================================================
// GAME PREVIEW & MODAL
// =============================================================================
function openGamePreview(gameData) {
    currentGame = gameData;
    currentItemData = gameData;
    currentMediaType = 'game';
    const modal = document.getElementById('portfolioModal');
    const previewImage = document.getElementById('previewImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const playBtn = document.getElementById('playItemBtn');
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const modalActions = document.getElementById('modalActions');
    
    hideAllPreviewElements();
    
    previewImage.src = gameData.image;
    previewImage.style.display = 'block';
    modalTitle.textContent = gameData.name;
    modalDescription.textContent = gameData.description;
    
    gamePreview.style.display = 'flex';
    gameContainer.style.display = 'none';
    playBtn.style.display = 'flex';
    playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Game</span>';
    
    modalActions.innerHTML = `
        <button class="btn btn-glass" id="fullscreenBtn" style="display:none;">
            <i class="fas fa-expand"></i> Fullscreen
        </button>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    playBtn.onclick = () => loadUnityGame();
}

function loadUnityGame() {
    if (!currentGame) return;
    
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const gameLoading = document.getElementById('gameLoading');
    const loadingProgress = document.getElementById('loadingProgress');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    gamePreview.style.display = 'none';
    gameContainer.style.display = 'block';
    gameLoading.style.display = 'flex';
    
    if (fullscreenBtn) fullscreenBtn.style.display = 'inline-flex';
    
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
    
    const canvas = document.querySelector("#unity-canvas");
    
    const script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
            loadingProgress.style.width = (100 * progress) + "%";
        }).then((instance) => {
            unityInstance = instance;
            gameLoading.style.display = 'none';
        }).catch((message) => {
            showNotification('Failed to load game: ' + message, 'error');
            closeModal();
        });
    };
    script.onerror = () => {
        showNotification('Failed to load game. Please check if game files exist.', 'error');
        closeModal();
    };
    
    document.body.appendChild(script);
    
    setTimeout(() => {
        document.getElementById('fullscreenBtn').onclick = toggleGameFullscreen;
    }, 100);
}

function toggleGameFullscreen() {
    const gameContainer = document.getElementById('gameContainer');
    
    if (!document.fullscreenElement) {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
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
// WEBSITE PREVIEW
// =============================================================================
function openWebsitePreview(websiteData) {
    currentItemData = websiteData;
    currentMediaType = 'website';
    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const modalActions = document.getElementById('modalActions');
    const previewImage = document.getElementById('previewImage');
    const playBtn = document.getElementById('playItemBtn');
    
    hideAllPreviewElements();
    
    previewImage.src = websiteData.image;
    previewImage.style.display = 'block';
    previewImage.style.cursor = 'pointer';
    
    modalTitle.textContent = websiteData.name;
    modalDescription.textContent = websiteData.description;
    
    gamePreview.style.display = 'flex';
    gameContainer.style.display = 'none';
    playBtn.style.display = 'none';
    
    modalActions.innerHTML = `
        <button class="btn btn-primary" id="visitWebsiteBtn">
            <i class="fas fa-external-link-alt"></i> Visit Website
        </button>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Click on preview image to open website
    previewImage.onclick = () => window.open(websiteData.url, '_blank');
    
    setTimeout(() => {
        document.getElementById('visitWebsiteBtn').onclick = () => {
            window.open(websiteData.url, '_blank');
        };
    }, 100);
}

// =============================================================================
// PHOTO PREVIEW
// =============================================================================
function openPhotoPreview(photoData) {
    currentItemData = photoData;
    currentMediaType = 'photo';
    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const modalActions = document.getElementById('modalActions');
    const photoViewer = document.getElementById('photoViewer');
    const playBtn = document.getElementById('playItemBtn');
    
    hideAllPreviewElements();
    
    photoViewer.innerHTML = `<img src="${photoData.image}" alt="${photoData.title}" style="width: 100%; height: 100%; object-fit: contain; cursor: pointer;" id="photoImage">`;
    photoViewer.style.display = 'flex';
    photoViewer.style.alignItems = 'center';
    photoViewer.style.justifyContent = 'center';
    photoViewer.style.width = '100%';
    photoViewer.style.height = '100%';
    
    modalTitle.textContent = photoData.title;
    modalDescription.textContent = photoData.description;
    
    playBtn.style.display = 'none';
    gamePreview.style.display = 'flex';
    gameContainer.style.display = 'none';
    
    modalActions.innerHTML = `
        <button class="btn btn-glass" id="downloadPhotoBtn">
            <i class="fas fa-download"></i> Download
        </button>
        <button class="btn btn-glass" id="fullscreenPhotoBtn">
            <i class="fas fa-expand"></i> Fullscreen
        </button>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.getElementById('downloadPhotoBtn').onclick = () => downloadMedia(photoData.image, photoData.title + '.jpg');
        document.getElementById('fullscreenPhotoBtn').onclick = () => {
            const photoImg = document.getElementById('photoImage');
            if (photoImg.requestFullscreen) {
                photoImg.requestFullscreen();
            } else if (photoImg.webkitRequestFullscreen) {
                photoImg.webkitRequestFullscreen();
            }
        };
        
        // Click photo to view fullscreen
        document.getElementById('photoImage').onclick = function() {
            if (this.requestFullscreen) {
                this.requestFullscreen();
            } else if (this.webkitRequestFullscreen) {
                this.webkitRequestFullscreen();
            }
        };
    }, 100);
}

// =============================================================================
// VIDEO PREVIEW
// =============================================================================
function openVideoPreview(videoData) {
    currentItemData = videoData;
    currentMediaType = 'video';
    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const modalActions = document.getElementById('modalActions');
    const videoPlayer = document.getElementById('videoPlayer');
    const playBtn = document.getElementById('playItemBtn');
    
    hideAllPreviewElements();
    
    videoPlayer.innerHTML = `
        <video id="mainVideo" controls style="width: 100%; height: 100%; object-fit: contain;">
            <source src="${videoData.video_url}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;
    videoPlayer.style.display = 'flex';
    videoPlayer.style.width = '100%';
    videoPlayer.style.height = '100%';
    
    currentVideoElement = videoPlayer.querySelector('#mainVideo');
    
    modalTitle.textContent = videoData.title;
    modalDescription.textContent = videoData.description;
    
    playBtn.style.display = 'none';
    gamePreview.style.display = 'flex';
    gameContainer.style.display = 'none';
    
    modalActions.innerHTML = `
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
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const muteBtn = document.getElementById('muteBtn');
        
        playPauseBtn.onclick = () => togglePlayPause(playPauseBtn);
        muteBtn.onclick = () => toggleMute(muteBtn);
        document.getElementById('downloadVideoBtn').onclick = () => downloadMedia(videoData.video_url, videoData.title + '.mp4');
        document.getElementById('fullscreenVideoBtn').onclick = () => {
            if (currentVideoElement.requestFullscreen) {
                currentVideoElement.requestFullscreen();
            } else if (currentVideoElement.webkitRequestFullscreen) {
                currentVideoElement.webkitRequestFullscreen();
            }
        };
        
        currentVideoElement.play();
        
        currentVideoElement.addEventListener('play', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        });
        
        currentVideoElement.addEventListener('pause', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play';
        });
    }, 100);
}

// =============================================================================
// MEDIA CONTROLS
// =============================================================================
function togglePlayPause(btn) {
    if (!currentVideoElement) return;
    
    if (currentVideoElement.paused) {
        currentVideoElement.play();
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    } else {
        currentVideoElement.pause();
        btn.innerHTML = '<i class="fas fa-play"></i> Play';
    }
}

function toggleMute(btn) {
    if (!currentVideoElement) return;
    
    if (currentVideoElement.muted) {
        currentVideoElement.muted = false;
        btn.innerHTML = '<i class="fas fa-volume-up"></i> Mute';
    } else {
        currentVideoElement.muted = true;
        btn.innerHTML = '<i class="fas fa-volume-mute"></i> Unmute';
    }
}

function downloadMedia(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('Download started!', 'success');
}

function hideAllPreviewElements() {
    const previewImage = document.getElementById('previewImage');
    const websiteFrame = document.getElementById('websiteFrame');
    const photoViewer = document.getElementById('photoViewer');
    const videoPlayer = document.getElementById('videoPlayer');
    
    if (previewImage) {
        previewImage.style.display = 'none';
        previewImage.onclick = null;
        previewImage.style.cursor = 'default';
    }
    if (websiteFrame) websiteFrame.style.display = 'none';
    if (photoViewer) {
        photoViewer.style.display = 'none';
        photoViewer.innerHTML = '';
    }
    if (videoPlayer) {
        videoPlayer.style.display = 'none';
        videoPlayer.innerHTML = '';
    }
}

// =============================================================================
// CLOSE MODAL
// =============================================================================
function closeModal() {
    const modal = document.getElementById('portfolioModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    if (unityInstance) {
        unityInstance.Quit();
        unityInstance = null;
    }
    
    if (currentVideoElement) {
        currentVideoElement.pause();
        currentVideoElement = null;
    }
    
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    
    gamePreview.innerHTML = `
        <img src="" alt="Preview" id="previewImage">
        <iframe id="websiteFrame" style="display:none;"></iframe>
        <div id="photoViewer" style="display:none;"></div>
        <div id="videoPlayer" style="display:none;"></div>
        <button class="modal-play-btn" id="playItemBtn">
            <i class="fas fa-play"></i>
            <span>Play Game</span>
        </button>
    `;
    
    gameContainer.style.display = 'none';
    
    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    
    currentGame = null;
    currentMediaType = null;
    currentItemData = null;
}

// Modal close event listeners
document.getElementById('closeModal')?.addEventListener('click', closeModal);
document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('portfolioModal');
        if (modal && modal.classList.contains('active')) {
            closeModal();
        }
    }
});

// =============================================================================
// CONTACT FORM - WORKING VERSION
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
        
        // Validate form fields
        const fullName = document.getElementById('full_name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const contactType = document.getElementById('contact_type')?.value;
        const comment = document.getElementById('comment')?.value.trim();
        
        if (!fullName || !email || !contactType || !comment) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        isSubmitting = true;
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Create FormData
        const formData = new FormData(this);
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                showNotification(result.message || 'Message sent successfully! We will get back to you soon.', 'success');
                this.reset();
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                showNotification(result.message || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Error sending message. Please try again or contact us directly via email.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            isSubmitting = false;
        }
    });
    
    // Real-time validation feedback
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
// NOTIFICATION SYSTEM
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