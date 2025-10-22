// Portfolio Data Storage
// This file contains all portfolio items (games, websites, photos, videos)

const PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: 'Sky Surfers',
            overview: 'I built this as a high-speed dodging challenge to test your absolute precision.',
            description: 'Ready for the Test? I built this intense flight game to challenge your piloting skills. Take control and see if you can master the narrow, hazard-filled canyon—you will need precision dodging and nerves of steel to set that high score I know you are aiming for.',
            image: '/images/games/Game1.jpg',
            game_folder: 'sky_surfers',
            build_name: 'sky_surfers'
        }
    ],
    
    websites: [
        {
            id: 1,
            name: 'ReelSpot',
            description: 'I built the fastest way to save your media. You find the link, I handle the rest. Multi-platform downloading is finally quick, simple, and painless.',
            image: '/images/websites/ReelSpot.jpg',
            url: 'https://arshvermagit.github.io/REELSPOT/',
            technologies: ['JavaScript', 'HTML', 'CSS']
        }
    ],
    
    photos: [
        {
            id: 1,
            title: 'The Heart Of Love',
            description: 'It Showcases The Symbol of Love.',
            category: 'Love',
            image: '/images/photos/photo1.jpg'
        },
        {
            id: 2,
            title: 'The Peacock',
            description: 'A Beautiful Peacock Structure made of Iron Rods.',
            category: 'Animals',
            image: '/images/photos/photo2.jpg'
        },
        {
            id: 3,
            title: 'The Acadamic Block',
            description: 'A Beautiful Click of The Acadamic Block.',
            category: 'VIT Bhopal',
            image: '/images/photos/photo3.jpg'
        },
        {
            id: 4,
            title: 'The Block-1',
            description: 'A Beautiful Click of the Block-1.',
            category: 'VIT Bhopal',
            image: '/images/photos/photo4.jpg'
        }
    ],
    
    videos: [
        {
            id: 1,
            title: 'Brand Showcase',
            description: 'Professional brand video with cinematic storytelling',
            category: 'Commercial',
            thumbnail: '/images/videos/video1-thumb.jpg',
            video_url: '/videos/video1.mp4'
        }
    ]
};

// Feedback Storage (in-memory for demo - replace with real backend)
let feedbackStorage = [];

// Feedback Management Functions
function saveFeedback(feedbackData) {
    const feedback = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        full_name: feedbackData.full_name,
        email: feedbackData.email,
        phone: feedbackData.phone || 'N/A',
        contact_type: feedbackData.contact_type,
        comment: feedbackData.comment,
        timestamp: new Date().toISOString()
    };
    
    feedbackStorage.push(feedback);
    
    // Try to save to localStorage if available
    try {
        localStorage.setItem('portfolio_feedback', JSON.stringify(feedbackStorage));
    } catch (e) {
        console.warn('localStorage not available, feedback will be lost on page refresh');
    }
    
    return feedback;
}

function getAllFeedback() {
    // Try to load from localStorage if available
    try {
        const stored = localStorage.getItem('portfolio_feedback');
        if (stored) {
            feedbackStorage = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('localStorage not available');
    }
    
    return feedbackStorage.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
}

function deleteFeedback(feedbackId) {
    feedbackStorage = feedbackStorage.filter(f => f.id !== feedbackId);
    
    // Update localStorage
    try {
        localStorage.setItem('portfolio_feedback', JSON.stringify(feedbackStorage));
    } catch (e) {
        console.warn('localStorage not available');
    }
    
    return true;
}

// Initialize portfolio data on page load
function initializePortfolio() {
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Load games
    const gamesGrid = document.getElementById('gamesGrid');
    if (gamesGrid && PORTFOLIO_DATA.games.length > 0) {
        gamesGrid.innerHTML = PORTFOLIO_DATA.games.map(game => `
            <div class="portfolio-card" data-game='${JSON.stringify(game)}' data-type="game">
                <div class="portfolio-image">
                    <img src="${game.image}" alt="${game.name}">
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
            <div class="portfolio-card website-card" data-website='${JSON.stringify(website)}' data-type="website">
                <div class="portfolio-image website-image">
                    <img src="${website.image}" alt="${website.name}">
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
            <div class="portfolio-card" data-photo='${JSON.stringify(photo)}' data-type="photo">
                <div class="portfolio-image">
                    <img src="${photo.image}" alt="${photo.title}">
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
            <div class="portfolio-card" data-video='${JSON.stringify(video)}' data-type="video">
                <div class="portfolio-image">
                    <img src="${video.thumbnail}" alt="${video.title}">
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

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}