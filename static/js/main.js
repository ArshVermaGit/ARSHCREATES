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

// =============================================================================
// GAME PREVIEW & MODAL - FIXED
// =============================================================================
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
        description: gameData.description,
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
    if (gamePreview) gamePreview.style.display = 'flex';
    if (gameContainer) gameContainer.style.display = 'none';
    
    // Setup play button
    if (playBtn) {
        playBtn.style.display = 'flex';
        playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Game</span>';
        
        // Remove existing event listeners and add new one
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
    
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    const gameLoading = document.getElementById('gameLoading');
    const loadingProgress = document.getElementById('loadingProgress');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // Show loading state
    if (gamePreview) gamePreview.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'block';
    if (gameLoading) gameLoading.style.display = 'flex';
    if (loadingProgress) loadingProgress.style.width = '0%';
    
    if (fullscreenBtn) {
        fullscreenBtn.style.display = 'inline-flex';
        // Setup fullscreen button
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
    
    const canvas = document.querySelector("#unity-canvas");
    if (!canvas) {
        showNotification('Game canvas not found.', 'error');
        return;
    }
    
    // Remove existing Unity script if any
    const existingScript = document.querySelector(`script[src="${loaderUrl}"]`);
    if (existingScript) {
        existingScript.remove();
    }
    
    const script = document.createElement("script");
    script.src = loaderUrl;
    
    script.onload = () => {
        if (typeof createUnityInstance !== 'function') {
            showNotification('Unity loader failed to initialize.', 'error');
            return;
        }
        
        createUnityInstance(canvas, config, (progress) => {
            if (loadingProgress) {
                loadingProgress.style.width = (progress * 100) + "%";
            }
        }).then((instance) => {
            unityInstance = instance;
            if (gameLoading) gameLoading.style.display = 'none';
            showNotification('Game loaded successfully!', 'success');
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
    
    currentItemData = websiteData;
    currentMediaType = 'website';
    
    updateModalContent({
        title: websiteData.name,
        description: websiteData.description,
        image: websiteData.image
    });
    
    const previewImage = document.getElementById('previewImage');
    const playBtn = document.getElementById('playItemBtn');
    
    hideAllPreviewElements();
    
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
    
    currentItemData = photoData;
    currentMediaType = 'photo';
    
    updateModalContent({
        title: photoData.title,
        description: photoData.description
    });
    
    const photoViewer = document.getElementById('photoViewer');
    const playBtn = document.getElementById('playItemBtn');
    
    hideAllPreviewElements();
    
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
    
    currentItemData = videoData;
    currentMediaType = 'video';
    
    updateModalContent({
        title: videoData.title,
        description: videoData.description
    });
    
    const videoPlayer = document.getElementById('videoPlayer');
    const playBtn = document.getElementById('playItemBtn');
    
    hideAllPreviewElements();
    
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
// MODAL UTILITY FUNCTIONS
// =============================================================================
function updateModalContent({ title, description, image }) {
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    if (modalTitle && title) modalTitle.textContent = title;
    if (modalDescription && description) modalDescription.textContent = description;
}

function setupModalActions(html) {
    const modalActions = document.getElementById('modalActions');
    if (modalActions) {
        modalActions.innerHTML = html;
    }
}

function hideAllPreviewElements() {
    const elements = [
        'previewImage', 'websiteFrame', 'photoViewer', 'videoPlayer'
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
    
    // Reset game preview area
    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');
    
    if (gamePreview) gamePreview.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'none';
}

function openModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        isModalOpen = true;
        
        // Add animation class for smooth opening
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

// =============================================================================
// CLOSE MODAL - FIXED
// =============================================================================
function closeModal() {
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;
    
    // Add closing animation
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        isModalOpen = false;
        
        // Clean up resources
        if (unityInstance) {
            try {
                unityInstance.Quit();
            } catch (error) {
                console.warn('Error quitting Unity instance:', error);
            }
            unityInstance = null;
        }
        
        if (currentVideoElement) {
            currentVideoElement.pause();
            currentVideoElement = null;
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
        const gamePreview = document.getElementById('itemPreview');
        const gameContainer = document.getElementById('gameContainer');
        
        if (gamePreview) gamePreview.style.display = 'none';
        if (gameContainer) gameContainer.style.display = 'none';
        
    }, 300); // Match CSS transition duration
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
            const formData = new FormData(contactForm);
            
            // Basic validation
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
            
            // Email validation
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
                
                // Reset border colors
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

// =============================================================================
// ADMIN FEEDBACK MANAGEMENT
// =============================================================================

// Update today's feedback count
function updateTodayCount() {
    const today = new Date().toISOString().split('T')[0];
    const todayRows = document.querySelectorAll(`.feedback-row[data-date="${today}"]`);
    document.getElementById('todayCount').textContent = todayRows.length;
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll('.feedback-row');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const name = row.dataset.name || '';
            const email = row.dataset.email || '';
            const phone = row.dataset.phone || '';
            const message = row.dataset.message || '';
            
            const matches = name.includes(searchTerm) || 
                           email.includes(searchTerm) || 
                           phone.includes(searchTerm) || 
                           message.includes(searchTerm);
            
            row.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
        });
        
        document.getElementById('visibleCount').textContent = visibleCount;
    });
}

// Filter functionality
function initFilters() {
    const typeFilter = document.getElementById('filterType');
    const dateFilter = document.getElementById('dateFilter');
    
    // Type filter
    typeFilter.addEventListener('change', applyFilters);
    
    // Date filter
    dateFilter.addEventListener('change', applyFilters);
    
    function applyFilters() {
        const selectedType = typeFilter.value;
        const selectedDate = dateFilter.value;
        const rows = document.querySelectorAll('.feedback-row');
        let visibleCount = 0;
        
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        rows.forEach(row => {
            const rowType = row.dataset.type;
            const rowDate = new Date(row.dataset.date);
            
            // Type filter
            const typeMatch = !selectedType || rowType === selectedType;
            
            // Date filter
            let dateMatch = true;
            if (selectedDate === 'today') {
                dateMatch = rowDate.toDateString() === today.toDateString();
            } else if (selectedDate === 'week') {
                dateMatch = rowDate >= startOfWeek;
            } else if (selectedDate === 'month') {
                dateMatch = rowDate >= startOfMonth;
            }
            
            const shouldShow = typeMatch && dateMatch;
            row.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCount++;
        });
        
        document.getElementById('visibleCount').textContent = visibleCount;
    }
}

// Export functionality
function initExport() {
    const exportBtn = document.getElementById('exportBtn');
    
    exportBtn.addEventListener('click', function() {
        const rows = document.querySelectorAll('.feedback-row:not([style*="display: none"])');
        const csvData = [];
        
        // Add header row
        csvData.push(['Name', 'Email', 'Phone', 'Type', 'Message', 'Date', 'Time']);
        
        // Add data rows
        rows.forEach(row => {
            const name = row.dataset.fullName || '';
            const email = row.dataset.fullEmail || '';
            const phone = row.querySelector('.contact-phone')?.textContent || '';
            const type = row.dataset.fullType || '';
            const message = row.dataset.fullComment || '';
            const date = row.dataset.date || '';
            const time = row.querySelector('.time')?.textContent || '';
            
            csvData.push([name, email, phone, type, message, date, time]);
        });
        
        // Convert to CSV string
        const csvContent = csvData.map(row => 
            row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `feedback_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Feedback exported successfully!', 'success');
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('messageModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', closeMessageModal);
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeMessageModal();
        }
    });
}

// View message in modal
function viewMessage(feedbackId) {
    const row = document.querySelector(`.feedback-row[data-id="${feedbackId}"]`);
    if (!row) return;
    
    const name = row.dataset.fullName || 'Unknown';
    const email = row.dataset.fullEmail || 'No email';
    const phone = row.querySelector('.contact-phone')?.textContent || 'Not provided';
    const type = row.dataset.fullType || 'Unknown type';
    const message = row.dataset.fullComment || 'No message';
    const date = row.dataset.date || 'Unknown date';
    const time = row.querySelector('.time')?.textContent || 'Unknown time';
    
    const modalContent = document.getElementById('modalMessageContent');
    modalContent.innerHTML = `
        <div class="message-details">
            <div class="message-contact">
                <div class="message-contact-name">${name}</div>
                <div class="message-contact-email">${email}</div>
                <div class="message-contact-phone">${phone}</div>
                <span class="message-type">${type}</span>
            </div>
            
            <div class="message-content">${message}</div>
            
            <div class="message-meta">
                <div>Received: ${date} at ${time}</div>
                <div>ID: ${feedbackId}</div>
            </div>
        </div>
    `;
    
    // Store current message data for reply functionality
    window.currentMessageData = { name, email, type, message };
    
    // Show modal
    const modal = document.getElementById('messageModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close message modal
function closeMessageModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    window.currentMessageData = null;
}

// Reply to current message
function replyToCurrentMessage() {
    if (!window.currentMessageData) {
        showNotification('No message selected to reply to.', 'error');
        return;
    }
    
    const { name, email, type, message } = window.currentMessageData;
    
    // Create mailto link with pre-filled content
    const subject = `Re: Your ${type} feedback`;
    const body = `Hi ${name},\n\nThank you for your message:\n"${message}"\n\nBest regards,\nArsh Verma`;
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Close modal after a short delay
    setTimeout(closeMessageModal, 500);
}

// Delete feedback
function deleteFeedback(feedbackId) {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
        return;
    }
    
    // Show loading state
    const deleteBtn = document.querySelector(`.feedback-row[data-id="${feedbackId}"] .delete-btn`);
    const originalHTML = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    deleteBtn.disabled = true;
    
    // Make API call to delete feedback
    fetch(`/admin/delete_feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the row from the table
            const row = document.querySelector(`.feedback-row[data-id="${feedbackId}"]`);
            if (row) {
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    updateTodayCount();
                    
                    // Update visible count
                    const visibleRows = document.querySelectorAll('.feedback-row:not([style*="display: none"])');
                    document.getElementById('visibleCount').textContent = visibleRows.length;
                    
                    showNotification('Feedback deleted successfully!', 'success');
                }, 300);
            }
        } else {
            throw new Error(data.error || 'Failed to delete feedback');
        }
    })
    .catch(error => {
        console.error('Error deleting feedback:', error);
        showNotification('Failed to delete feedback. Please try again.', 'error');
        deleteBtn.innerHTML = originalHTML;
        deleteBtn.disabled = false;
    });
}

// Make functions globally available
window.showNotification = showNotification;
window.initContactForm = initContactForm;
window.closeModal = closeModal;
window.openGamePreview = openGamePreview;
window.openWebsitePreview = openWebsitePreview;
window.openPhotoPreview = openPhotoPreview;
window.openVideoPreview = openVideoPreview;

// Admin functions
window.viewMessage = viewMessage;
window.closeMessageModal = closeMessageModal;
window.replyToCurrentMessage = replyToCurrentMessage;
window.deleteFeedback = deleteFeedback;
window.updateTodayCount = updateTodayCount;
window.initSearch = initSearch;
window.initFilters = initFilters;
window.initExport = initExport;
window.initModal = initModal;

console.log('Portfolio JS initialized successfully');