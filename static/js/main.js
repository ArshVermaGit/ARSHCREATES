// =============================================================================
// main.js - Portfolio JavaScript (upgraded: theme toggle + refined interactions)
// =============================================================================

let currentGame = null;
let unityInstance = null;
let currentMediaType = null;
let currentVideoElement = null;
let currentItemData = null;

// Run initializers when DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioCards();
    initContactForm();
    initTheme();
});

// ------------------------------
// PORTFOLIO CARDS INIT
// ------------------------------
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

// ------------------------------
// GAME PREVIEW & UNITY LOADER
// ------------------------------
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
    playBtn.style.display = 'inline-flex';
    playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Game</span>';

    modalActions.innerHTML = `<button class="btn btn-glass" id="fullscreenBtn" style="display:none;"><i class="fas fa-expand"></i> Fullscreen</button>`;

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
        showNotification('Failed to load game. Please check game files.', 'error');
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
        if (gameContainer.requestFullscreen) gameContainer.requestFullscreen();
        else if (gameContainer.webkitRequestFullscreen) gameContainer.webkitRequestFullscreen();
        else if (gameContainer.msRequestFullscreen) gameContainer.msRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }
}

// ------------------------------
// WEBSITE / PHOTO / VIDEO PREVIEWS
// ------------------------------
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

    modalActions.innerHTML = `<button class="btn btn-primary" id="visitWebsiteBtn"><i class="fas fa-external-link-alt"></i> Visit Website</button>`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    previewImage.onclick = () => window.open(websiteData.url, '_blank');

    setTimeout(() => {
        document.getElementById('visitWebsiteBtn').onclick = () => window.open(websiteData.url, '_blank');
    }, 100);
}

function openPhotoPreview(photoData) {
    currentItemData = photoData;
    currentMediaType = 'photo';
    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const gamePreview = document.getElementById('itemPreview');
    const photoViewer = document.getElementById('photoViewer');
    const playBtn = document.getElementById('playItemBtn');

    hideAllPreviewElements();

    photoViewer.innerHTML = `<img src="${photoData.image}" alt="${photoData.title}" style="width:100%;height:100%;object-fit:contain;cursor:pointer" id="photoImage">`;
    photoViewer.style.display = 'flex';

    modalTitle.textContent = photoData.title;
    modalDescription.textContent = photoData.description;

    playBtn.style.display = 'none';
    gamePreview.style.display = 'flex';

    modalActions.innerHTML = `
        <button class="btn btn-glass" id="downloadPhotoBtn"><i class="fas fa-download"></i> Download</button>
        <button class="btn btn-glass" id="fullscreenPhotoBtn"><i class="fas fa-expand"></i> Fullscreen</button>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        document.getElementById('downloadPhotoBtn').onclick = () => downloadMedia(photoData.image, photoData.title + '.jpg');
        document.getElementById('fullscreenPhotoBtn').onclick = () => {
            const photoImg = document.getElementById('photoImage');
            if (photoImg.requestFullscreen) photoImg.requestFullscreen();
            else if (photoImg.webkitRequestFullscreen) photoImg.webkitRequestFullscreen();
        };

        document.getElementById('photoImage').onclick = function() {
            if (this.requestFullscreen) this.requestFullscreen();
            else if (this.webkitRequestFullscreen) this.webkitRequestFullscreen();
        };
    }, 100);
}

function openVideoPreview(videoData) {
    currentItemData = videoData;
    currentMediaType = 'video';
    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const gamePreview = document.getElementById('itemPreview');
    const videoPlayer = document.getElementById('videoPlayer');

    hideAllPreviewElements();

    videoPlayer.innerHTML = `
        <video id="mainVideo" controls style="width:100%;height:100%;object-fit:contain;">
            <source src="${videoData.video_url}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;
    videoPlayer.style.display = 'flex';

    currentVideoElement = videoPlayer.querySelector('#mainVideo');

    modalTitle.textContent = videoData.title;
    modalDescription.textContent = videoData.description;

    gamePreview.style.display = 'flex';

    modalActions.innerHTML = `
        <button class="btn btn-glass" id="playPauseBtn"><i class="fas fa-pause"></i> Pause</button>
        <button class="btn btn-glass" id="muteBtn"><i class="fas fa-volume-up"></i> Mute</button>
        <button class="btn btn-glass" id="downloadVideoBtn"><i class="fas fa-download"></i> Download</button>
        <button class="btn btn-glass" id="fullscreenVideoBtn"><i class="fas fa-expand"></i> Fullscreen</button>
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
            if (currentVideoElement.requestFullscreen) currentVideoElement.requestFullscreen();
            else if (currentVideoElement.webkitRequestFullscreen) currentVideoElement.webkitRequestFullscreen();
        };

        currentVideoElement.play();

        currentVideoElement.addEventListener('play', () => { playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause'; });
        currentVideoElement.addEventListener('pause', () => { playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Play'; });
    }, 100);
}

// ------------------------------
// MEDIA CONTROLS
// ------------------------------
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
    a.remove();
    showNotification('Download started!', 'success');
}

function hideAllPreviewElements() {
    const previewImage = document.getElementById('previewImage');
    const websiteFrame = document.getElementById('websiteFrame');
    const photoViewer = document.getElementById('photoViewer');
    const videoPlayer = document.getElementById('videoPlayer');

    if (previewImage) { previewImage.style.display = 'none'; previewImage.onclick = null; previewImage.style.cursor = 'default'; }
    if (websiteFrame) websiteFrame.style.display = 'none';
    if (photoViewer) { photoViewer.style.display = 'none'; photoViewer.innerHTML = ''; }
    if (videoPlayer) { videoPlayer.style.display = 'none'; videoPlayer.innerHTML = ''; }
}

// ------------------------------
// CLOSE MODAL
// ------------------------------
function closeModal() {
    const modal = document.getElementById('portfolioModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    if (unityInstance) { try { unityInstance.Quit(); } catch(e){} unityInstance = null; }
    if (currentVideoElement) { currentVideoElement.pause(); currentVideoElement = null; }

    const gamePreview = document.getElementById('itemPreview');
    const gameContainer = document.getElementById('gameContainer');

    if (gamePreview) {
        gamePreview.innerHTML = `
            <img src="" alt="Preview" id="previewImage" style="display:none;">
            <iframe id="websiteFrame" style="display:none;"></iframe>
            <div id="photoViewer" style="display:none;"></div>
            <div id="videoPlayer" style="display:none;"></div>
            <button class="modal-play-btn" id="playItemBtn"><i class="fas fa-play"></i><span>Play Game</span></button>
        `;
    }

    if (gameContainer) gameContainer.style.display = 'none';

    if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }

    currentGame = null;
    currentMediaType = null;
    currentItemData = null;
}

// bind close buttons safely
document.getElementById('closeModal')?.addEventListener('click', closeModal);
document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

// ------------------------------
// CONTACT FORM (preserve behavior; adjust visual feedback)
// ------------------------------
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (!contactForm) return;

    let isSubmitting = false;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (isSubmitting) return;

        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        isSubmitting = true;

        try {
            const formData = new FormData(contactForm);

            // Basic validation
            const required = ['full_name', 'email', 'contact_type', 'comment'];
            let ok = true;
            required.forEach(name => {
                const el = contactForm.querySelector(`[name="${name}"]`);
                if (!el || !el.value.trim()) {
                    el.style.borderColor = 'rgba(239,68,68,0.6)';
                    ok = false;
                } else {
                    el.style.borderColor = '';
                }
            });
            if (!ok) throw new Error('Please fill in all required fields');

            // Email validation
            const email = (contactForm.querySelector('[name="email"]').value || '').trim();
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(email)) {
                contactForm.querySelector('[name="email"]').style.borderColor = 'rgba(239,68,68,0.6)';
                throw new Error('Please enter a valid email address');
            }

            const resp = await fetch('/submit_feedback', {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`Server error: ${resp.status}`);
            }
            const result = await resp.json();
            if (result.success) {
                showNotification("Message sent successfully! I'll get back to you soon.", 'success');
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Failed to send message.');
            }
        } catch (err) {
            console.error(err);
            showNotification(err.message || 'Network error. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            isSubmitting = false;
        }
    });

    // live validation styling
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) this.style.borderColor = '';
        });
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'rgba(239,68,68,0.6)';
            }
        });
    });
}

// ------------------------------
// NOTIFICATION SYSTEM
// ------------------------------
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer') || createNotificationContainer();
    // remove existing to keep UI tidy
    const existing = container.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    const el = document.createElement('div');
    el.className = `notification ${type} liquid-base`;
    el.style.padding = '12px 18px';
    el.style.borderRadius = '12px';
    el.style.minWidth = '260px';
    el.style.boxShadow = 'var(--shadow-1)';
    el.innerHTML = `
        <div style="display:flex;gap:12px;align-items:flex-start">
            <div style="font-size:20px;"><i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i></div>
            <div style="flex:1">
                <div style="font-weight:700;margin-bottom:6px">${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</div>
                <div style="font-size:14px;color:var(--text-secondary)">${message}</div>
            </div>
        </div>
    `;
    container.appendChild(el);

    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
    }, 4200);
}

function createNotificationContainer() {
    const c = document.createElement('div');
    c.id = 'notificationContainer';
    c.setAttribute('role', 'status');
    document.body.appendChild(c);
    return c;
}

// ------------------------------
// THEME (dark/light) - smooth toggle using localStorage
// ------------------------------
function initTheme() {
    const saved = localStorage.getItem('site-theme');
    if (saved === 'light') document.body.classList.add('light'), document.body.classList.remove('dark');
    else document.body.classList.remove('light'), document.body.classList.add('dark');

    // If user created toggle in page, bind it
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        updateThemeIcon();
        themeBtn.addEventListener('click', toggleTheme);
    } else {
        // try creating a small floating toggle if not present
        createFloatingThemeToggle();
    }
}

function toggleTheme() {
    if (document.body.classList.contains('light')) {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        localStorage.setItem('site-theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        localStorage.setItem('site-theme', 'light');
    }
    updateThemeIcon();
    // subtle page transition
    document.documentElement.animate([{opacity:0.96},{opacity:1}], {duration:220, easing:'ease-out'});
}

function updateThemeIcon() {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (document.body.classList.contains('light')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

function createFloatingThemeToggle() {
    if (document.getElementById('themeBtn')) return;
    const toggle = document.createElement('div');
    toggle.className = 'theme-toggle-floating';
    toggle.style.position = 'fixed';
    toggle.style.right = '18px';
    toggle.style.top = '18px';
    toggle.style.zIndex = '1200';
    toggle.innerHTML = `<button id="themeBtn" class="btn btn-icon" aria-label="Toggle theme"><i class="fas fa-moon"></i></button>`;
    document.body.appendChild(toggle);
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    updateThemeIcon();
}

// expose some functions globally
window.showNotification = showNotification;
window.initContactForm = initContactForm;
window.closeModal = closeModal;
