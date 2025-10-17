let currentGame = null;
let unityInstance = null;
let currentMediaType = null;
let currentVideoElement = null;
let currentItemData = null;

// ==================================================
// INITIALIZATION SECTION
// ==================================================
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioCards();
    initContactForm();
});

// ==================================================
// PORTFOLIO CARDS SECTION
// ==================================================
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

// ==================================================
// GAME PREVIEW SECTION
// ==================================================
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

// ==================================================
// WEBSITE PREVIEW SECTION
// ==================================================
function openWebsitePreview(websiteData) {
    currentItemData = websiteData;
    currentMediaType = 'website';
    const modal = document.getElementById('portfolioModal');
    const websiteFrame = document.getElementById('websiteFrame');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const playBtn = document.getElementById('playItemBtn');
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const modalActions = document.getElementById('modalActions');
    
    hideAllPreviewElements();
    
    websiteFrame.src = websiteData.url;
    websiteFrame.style.display = 'block';
    modalTitle.textContent = websiteData.name;
    modalDescription.textContent = websiteData.description;
    
    gamePreview.style.display = 'flex';
    gameContainer.style.display = 'none';
    playBtn.style.display = 'none';
    
    modalActions.innerHTML = `
        <a href="${websiteData.url}" target="_blank" class="btn btn-primary">
            <i class="fas fa-external-link-alt"></i> Visit Website
        </a>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==================================================
// PHOTO PREVIEW SECTION
// ==================================================
function openPhotoPreview(photoData) {
    currentItemData = photoData;
    currentMediaType = 'photo';
    const modal = document.getElementById('portfolioModal');
    const previewImage = document.getElementById('previewImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const playBtn = document.getElementById('playItemBtn');
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const modalActions = document.getElementById('modalActions');
    
    hideAllPreviewElements();
    
    previewImage.src = photoData.image;
    previewImage.style.display = 'block';
    modalTitle.textContent = photoData.title;
    modalDescription.textContent = photoData.description;
    
    gamePreview.style.display = 'flex';
    gameContainer.style.display = 'none';
    playBtn.style.display = 'none';
    
    modalActions.innerHTML = `
        <button class="btn btn-glass" onclick="zoomImage()">
            <i class="fas fa-search-plus"></i> Zoom
        </button>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==================================================
// VIDEO PREVIEW SECTION
// ==================================================
function openVideoPreview(videoData) {
    currentItemData = videoData;
    currentMediaType = 'video';
    const modal = document.getElementById('portfolioModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const playBtn = document.getElementById('playItemBtn');
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const modalActions = document.getElementById('modalActions');
    
    hideAllPreviewElements();
    
    videoPlayer.innerHTML = `
        <video controls>
            <source src="${videoData.video_url}" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    videoPlayer.style.display = 'block';
    modalTitle.textContent = videoData.title;
    modalDescription.textContent = videoData.description;
    
    gamePreview.style.display = 'flex';
    gameContainer.style.display = 'none';
    playBtn.style.display = 'none';
    
    modalActions.innerHTML = `
        <button class="btn btn-glass" onclick="toggleVideoFullscreen()">
            <i class="fas fa-expand"></i> Fullscreen
        </button>
    `;
    
    currentVideoElement = videoPlayer.querySelector('video');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function toggleVideoFullscreen() {
    if (currentVideoElement) {
        if (!document.fullscreenElement) {
            if (currentVideoElement.requestFullscreen) {
                currentVideoElement.requestFullscreen();
            } else if (currentVideoElement.webkitRequestFullscreen) {
                currentVideoElement.webkitRequestFullscreen();
            } else if (currentVideoElement.msRequestFullscreen) {
                currentVideoElement.msRequestFullscreen();
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
}

// ==================================================
// MODAL UTILITY SECTION
// ==================================================
function hideAllPreviewElements() {
    const previewImage = document.getElementById('previewImage');
    const websiteFrame = document.getElementById('websiteFrame');
    const photoViewer = document.getElementById('photoViewer');
    const videoPlayer = document.getElementById('videoPlayer');
    
    previewImage.style.display = 'none';
    websiteFrame.style.display = 'none';
    photoViewer.style.display = 'none';
    videoPlayer.style.display = 'none';
    websiteFrame.src = '';
    videoPlayer.innerHTML = '';
    
    if (currentVideoElement) {
        currentVideoElement.pause();
        currentVideoElement = null;
    }
}

function closeModal() {
    const modal = document.getElementById('portfolioModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    if (unityInstance) {
        unityInstance.Quit();
        unityInstance = null;
    }
    
    hideAllPreviewElements();
    currentGame = null;
    currentItemData = null;
    currentMediaType = null;
}

function zoomImage() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage.style.transform === 'scale(1.5)') {
        previewImage.style.transform = 'scale(1)';
    } else {
        previewImage.style.transform = 'scale(1.5)';
    }
}

// ==================================================
// CONTACT FORM SECTION
// ==================================================
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    let isSubmitting = false;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (isSubmitting) return;
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        isSubmitting = true;
        
        try {
            const formData = new FormData(contactForm);
            
            const requiredFields = ['full_name', 'email', 'contact_type', 'comment'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = contactForm.querySelector(`[name="${field}"]`);
                if (!input.value.trim()) {
                    input.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                throw new Error('Please fill in all required fields');
            }
            
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                contactForm.querySelector('[name="email"]').style.borderColor = 'rgba(239, 68, 68, 0.6)';
                throw new Error('Please enter a valid email address');
            }
            
            const response = await fetch('/submit_feedback', {
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
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                contactForm.querySelectorAll('input, select, textarea').forEach(input => {
                    input.style.borderColor = '';
                });
            } else {
                throw new Error(result.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message || 'Network error. Please check your connection and try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            isSubmitting = false;
        }
    });
    
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
    
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            } else {
                this.style.borderColor = '';
            }
        });
        
        emailInput.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }
}

// ==================================================
// NOTIFICATION SECTION
// ==================================================
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

// Expose functions globally
window.showNotification = showNotification;
window.initContactForm = initContactForm;
window.closeModal = closeModal;