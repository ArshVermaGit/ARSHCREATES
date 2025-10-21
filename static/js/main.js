let currentGame = null;
let unityInstance = null;
let currentMediaType = null;
let currentVideoElement = null;
let currentItemData = null;
let isModalOpen = false;

// Portfolio data
const PORTFOLIO_DATA = {
    games: [
        {
            'id': 1,
            'name': 'Sky Surfers',
            'overview': 'I built this as a high-speed dodging challenge to test your absolute precision.',
            'description': 'Ready for the Test? I built this intense flight game to challenge your piloting skills. Take control and see if you can master the narrow, hazard-filled canyon—you will need precision dodging and nerves of steel to set that high score I know you are aiming for.',
            'image': 'static/images/games/Game1.jpg',
            'game_folder': 'sky_surfers',
            'build_name': 'sky_surfers'
        }
    ],
    websites: [
        {
            'id': 1,
            'name': 'ReelSpot',
            'description': 'I built the fastest way to save your media. You find the link, I handle the rest. Multi-platform downloading is finally quick, simple, and painless.',
            'image': 'static/images/websites/ReelSpot.jpg',
            'url': 'https://arshvermagit.github.io/REELSPOT/',
            'technologies': ['JavaScript', 'HTML', 'CSS']
        }
    ],
    photos: [
        {
            'id': 1,
            'title': 'The Heart Of Love',
            'description': 'It Showcases The Symbol of Love.',
            'category': 'Love',
            'image': 'static/images/photos/photo1.jpg'
        },
        {
            'id': 2,
            'title': 'The Peacock',
            'description': 'A Beautiful Peacock Structure made of Iron Rods.',
            'category': 'Animals',
            'image': 'static/images/photos/photo2.jpg'
        },
        {
            'id': 3,
            'title': 'The Acadamic Block',
            'description': 'A Beautiful Click of The Acadamic Block.',
            'category': 'VIT Bhopal',
            'image': 'static/images/photos/photo3.jpg'
        },
        {
            'id': 4,
            'title': 'The Block-1',
            'description': 'A Beautiful Click of the Block-1.',
            'category': 'VIT Bhopal',
            'image': 'static/images/photos/photo4.jpg'
        }
    ],
    videos: [
        {
            'id': 1,
            'title': 'Brand Showcase',
            'description': 'Professional brand video with cinematic storytelling',
            'category': 'Commercial',
            'thumbnail': 'static/images/videos/video1-thumb.jpg',
            'video_url': 'static/videos/video1.mp4'
        }
    ]
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioData();
    initPortfolioCards();
    initContactForm();
    initModalEvents();
    setCurrentYear();
});

function setCurrentYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

function loadPortfolioData() {
    // Load games
    const gamesGrid = document.getElementById('gamesGrid');
    if (gamesGrid && PORTFOLIO_DATA.games.length > 0) {
        gamesGrid.innerHTML = PORTFOLIO_DATA.games.map(game => `
            <div class="portfolio-card" data-game='${JSON.stringify(game).replace(/'/g, "&#39;")}' data-type="game">
                <div class="portfolio-image">
                    <img src="${game.image}" alt="${game.name}" loading="lazy">
                    <div class="portfolio-overlay">
                        <button class="play-btn" aria-label="Play game">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="portfolio-info">
                    <span class="portfolio-badge">Playable</span>
                    <h3 class="portfolio-title">${game.name}</h3>
                    <p class="portfolio-description">${game.overview}</p>
                </div>
            </div>
        `).join('');
    } else if (gamesGrid) {
        gamesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-gamepad"></i>
                <h3>Games Coming Soon</h3>
                <p>Exciting game projects are currently in development!</p>
            </div>
        `;
    }

    // Load websites
    const websitesGrid = document.getElementById('websitesGrid');
    if (websitesGrid && PORTFOLIO_DATA.websites.length > 0) {
        websitesGrid.innerHTML = PORTFOLIO_DATA.websites.map(website => `
            <div class="portfolio-card website-card" data-website='${JSON.stringify(website).replace(/'/g, "&#39;")}' data-type="website">
                <div class="portfolio-image website-image">
                    <img src="${website.image}" alt="${website.name}" loading="lazy">
                    <div class="portfolio-overlay">
                        <button class="view-btn" aria-label="View website">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="portfolio-info">
                    <span class="portfolio-badge">Live</span>
                    <h3 class="portfolio-title">${website.name}</h3>
                    <p class="portfolio-description">${website.description}</p>
                </div>
            </div>
        `).join('');
    } else if (websitesGrid) {
        websitesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-laptop-code"></i>
                <h3>Websites Coming Soon</h3>
                <p>Web projects are currently under development!</p>
            </div>
        `;
    }

    // Load photos
    const photosGrid = document.getElementById('photosGrid');
    if (photosGrid && PORTFOLIO_DATA.photos.length > 0) {
        photosGrid.innerHTML = PORTFOLIO_DATA.photos.map(photo => `
            <div class="portfolio-card" data-photo='${JSON.stringify(photo).replace(/'/g, "&#39;")}' data-type="photo">
                <div class="portfolio-image">
                    <img src="${photo.image}" alt="${photo.title}" loading="lazy">
                    <div class="portfolio-overlay">
                        <button class="view-btn" aria-label="View photo">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="portfolio-info">
                    <span class="portfolio-badge">${photo.category}</span>
                    <h3 class="portfolio-title">${photo.title}</h3>
                    <p class="portfolio-description">${photo.description}</p>
                </div>
            </div>
        `).join('');
    } else if (photosGrid) {
        photosGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-camera"></i>
                <h3>Photography Coming Soon</h3>
                <p>Photo gallery is being curated!</p>
            </div>
        `;
    }

    // Load videos
    const videosGrid = document.getElementById('videosGrid');
    if (videosGrid && PORTFOLIO_DATA.videos.length > 0) {
        videosGrid.innerHTML = PORTFOLIO_DATA.videos.map(video => `
            <div class="portfolio-card" data-video='${JSON.stringify(video).replace(/'/g, "&#39;")}' data-type="video">
                <div class="portfolio-image">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                    <div class="portfolio-overlay">
                        <button class="play-btn" aria-label="Play video">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="portfolio-info">
                    <span class="portfolio-badge">${video.category}</span>
                    <h3 class="portfolio-title">${video.title}</h3>
                    <p class="portfolio-description">${video.description}</p>
                </div>
            </div>
        `).join('');
    } else if (videosGrid) {
        videosGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-video"></i>
                <h3>Videos Coming Soon</h3>
                <p>Video content is being produced!</p>
            </div>
        `;
    }
}

// Rest of the main.js code remains the same as your original...
// [Include all the modal functions, contact form, notification system from your original main.js]

// Initialize portfolio cards after data is loaded
function initPortfolioCards() {
    // This will be called after a short delay to ensure DOM is updated
    setTimeout(() => {
        const cards = document.querySelectorAll('.portfolio-card');
        
        cards.forEach(card => {
            const type = card.dataset.type;
            
            card.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    if (type === 'game') {
                        const gameData = JSON.parse(card.dataset.game.replace(/&#39;/g, "'"));
                        openGamePreview(gameData);
                    } else if (type === 'website') {
                        const websiteData = JSON.parse(card.dataset.website.replace(/&#39;/g, "'"));
                        openWebsitePreview(websiteData);
                    } else if (type === 'photo') {
                        const photoData = JSON.parse(card.dataset.photo.replace(/&#39;/g, "'"));
                        openPhotoPreview(photoData);
                    } else if (type === 'video') {
                        const videoData = JSON.parse(card.dataset.video.replace(/&#39;/g, "'"));
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
    }, 100);
}

// Contact form handling with localStorage
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
                full_name: document.getElementById('full_name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                contact_type: document.getElementById('contact_type').value,
                comment: document.getElementById('comment').value.trim(),
                timestamp: new Date().toISOString(),
                id: Date.now().toString()
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
            
            // Save to localStorage
            saveFeedback(formData);
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset border colors
            contactForm.querySelectorAll('input, select, textarea').forEach(input => {
                input.style.borderColor = '';
            });
            
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
}

function saveFeedback(feedback) {
    try {
        let feedbacks = JSON.parse(localStorage.getItem('portfolio_feedbacks') || '[]');
        feedbacks.push(feedback);
        localStorage.setItem('portfolio_feedbacks', JSON.stringify(feedbacks));
        return true;
    } catch (error) {
        console.error('Error saving feedback:', error);
        return false;
    }
}

// [Include all the other functions from your original main.js - openGamePreview, loadUnityGame, openWebsitePreview, openPhotoPreview, openVideoPreview, modal functions, etc.]

// Make functions globally available
window.showNotification = showNotification;
window.initContactForm = initContactForm;
window.closeModal = closeModal;

console.log('Portfolio JS initialized successfully');