// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const mediaModal = document.getElementById('mediaModal');
const closeModal = document.getElementById('closeModal');
const mediaDisplay = document.getElementById('mediaDisplay');
const mediaControls = document.getElementById('mediaControls');
const modalTitle = document.getElementById('modalTitle');
const prevMediaBtn = document.getElementById('prevMedia');
const nextMediaBtn = document.getElementById('nextMedia');
const shareWebsiteBtn = document.getElementById('shareWebsite');

// Current state
let currentMediaType = 'photos';
let currentMediaIndex = 0;
let currentVideo = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load initial media
    loadMediaCards('photos');
    
    // Set up tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => pane.classList.add('hidden'));
            document.getElementById(tabId).classList.remove('hidden');
            
            // Load media for this tab
            currentMediaType = tabId;
            loadMediaCards(tabId);
        });
    });
    
    // Modal close functionality
    closeModal.addEventListener('click', function() {
        mediaModal.style.display = 'none';
        if (currentVideo) {
            currentVideo.pause();
            currentVideo = null;
        }
    });
    
    // Navigation between media in modal
    prevMediaBtn.addEventListener('click', showPreviousMedia);
    nextMediaBtn.addEventListener('click', showNextMedia);
    
    // Share website functionality
    if (shareWebsiteBtn) {
        shareWebsiteBtn.addEventListener('click', shareWebsite);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === mediaModal) {
            mediaModal.style.display = 'none';
            if (currentVideo) {
                currentVideo.pause();
                currentVideo = null;
            }
        }
    });
});

// Load media cards for a specific type
function loadMediaCards(type) {
    const mediaGrid = document.querySelector(`#${type} .media-grid`);
    if (!mediaGrid) return;
    
    mediaGrid.innerHTML = '';
    
    mediaData[type].forEach((media, index) => {
        const card = document.createElement('div');
        card.className = 'media-card';
        
        let mediaElement = '';
        let actions = '';
        
        if (type === 'photos') {
            mediaElement = `<img src="${media.src}" alt="${media.title}" class="card-img">`;
            actions = `
                <button class="btn btn-primary" onclick="openMedia('${type}', ${index})">
                    <i class="fas fa-expand"></i> View
                </button>
                <button class="btn btn-secondary" onclick="downloadMedia('${media.src}', '${media.title}')">
                    <i class="fas fa-download"></i> Download
                </button>
            `;
        } else if (type === 'videos') {
            mediaElement = `<img src="${media.thumbnail}" alt="${media.title}" class="card-img">`;
            actions = `
                <button class="btn btn-primary" onclick="openMedia('${type}', ${index})">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="btn btn-secondary" onclick="downloadMedia('${media.src}', '${media.title}')">
                    <i class="fas fa-download"></i> Download
                </button>
            `;
        } else if (type === 'websites') {
            mediaElement = `<img src="${media.thumbnail}" alt="${media.title}" class="card-img">`;
            actions = `
                <button class="btn btn-primary" onclick="openMedia('${type}', ${index})">
                    <i class="fas fa-external-link-alt"></i> Visit
                </button>
            `;
        } else if (type === 'games') {
            mediaElement = `<img src="${media.thumbnail}" alt="${media.title}" class="card-img">`;
            actions = `
                <button class="btn btn-primary" onclick="openMedia('${type}', ${index})">
                    <i class="fas fa-gamepad"></i> Play
                </button>
                <button class="btn btn-secondary" onclick="openMedia('${type}', ${index}, true)">
                    <i class="fas fa-expand"></i> Fullscreen
                </button>
            `;
        }
        
        card.innerHTML = `
            ${mediaElement}
            <div class="card-content">
                <h3 class="card-title">${media.title}</h3>
                <p class="card-description">${media.description}</p>
                <div class="card-actions">
                    ${actions}
                </div>
            </div>
        `;
        
        mediaGrid.appendChild(card);
    });
}

// Open media in modal
function openMedia(type, index, fullscreen = false) {
    currentMediaType = type;
    currentMediaIndex = index;
    const media = mediaData[type][index];
    
    modalTitle.textContent = media.title;
    mediaDisplay.innerHTML = '';
    mediaControls.innerHTML = '';
    
    if (type === 'photos') {
        mediaDisplay.innerHTML = `<img src="${media.src}" alt="${media.title}">`;
        
        mediaControls.innerHTML = `
            <button class="control-btn" onclick="downloadMedia('${media.src}', '${media.title}')">
                <i class="fas fa-download"></i> Download
            </button>
            <button class="control-btn" onclick="toggleFullscreen('image')">
                <i class="fas fa-expand"></i> Fullscreen
            </button>
        `;
    } else if (type === 'videos') {
        mediaDisplay.innerHTML = `
            <video controls id="videoPlayer">
                <source src="${media.src}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
        
        currentVideo = document.getElementById('videoPlayer');
        
        mediaControls.innerHTML = `
            <button class="control-btn" onclick="togglePlayPause()">
                <i class="fas fa-play" id="playPauseIcon"></i> <span id="playPauseText">Play/Pause</span>
            </button>
            <button class="control-btn" onclick="toggleMute()">
                <i class="fas fa-volume-up" id="muteIcon"></i> <span id="muteText">Mute</span>
            </button>
            <button class="control-btn" onclick="downloadMedia('${media.src}', '${media.title}')">
                <i class="fas fa-download"></i> Download
            </button>
            <button class="control-btn" onclick="toggleFullscreen('video')">
                <i class="fas fa-expand"></i> Fullscreen
            </button>
        `;
    } else if (type === 'websites') {
        mediaDisplay.innerHTML = `
            <div class="website-frame">
                <iframe src="${media.url}" width="100%" height="100%" frameborder="0"></iframe>
            </div>
        `;
        
        mediaControls.innerHTML = `
            <button class="control-btn" onclick="visitWebsite('${media.url}')">
                <i class="fas fa-external-link-alt"></i> Visit Website
            </button>
        `;
    } else if (type === 'games') {
        if (fullscreen) {
            mediaDisplay.innerHTML = `
                <div class="game-container" style="height: 70vh;">
                    <div class="game-placeholder">
                        <h3>${media.title}</h3>
                        <p>Game would be playing in fullscreen mode</p>
                        <button class="btn btn-primary" onclick="exitFullscreen()">
                            <i class="fas fa-compress"></i> Exit Fullscreen
                        </button>
                    </div>
                </div>
            `;
        } else {
            mediaDisplay.innerHTML = `
                <div class="game-container">
                    <div class="game-placeholder">
                        <h3>${media.title}</h3>
                        <p>Game interface would appear here</p>
                        <button class="btn btn-primary" onclick="openMedia('${type}', ${index}, true)">
                            <i class="fas fa-expand"></i> Play in Fullscreen
                        </button>
                    </div>
                </div>
            `;
        }
        
        if (!fullscreen) {
            mediaControls.innerHTML = `
                <button class="control-btn" onclick="openMedia('${type}', ${index}, true)">
                    <i class="fas fa-expand"></i> Fullscreen
                </button>
            `;
        }
    }
    
    mediaModal.style.display = 'flex';
}

// Navigation functions
function showPreviousMedia() {
    if (currentMediaIndex > 0) {
        currentMediaIndex--;
    } else {
        currentMediaIndex = mediaData[currentMediaType].length - 1;
    }
    openMedia(currentMediaType, currentMediaIndex);
}

function showNextMedia() {
    if (currentMediaIndex < mediaData[currentMediaType].length - 1) {
        currentMediaIndex++;
    } else {
        currentMediaIndex = 0;
    }
    openMedia(currentMediaType, currentMediaIndex);
}