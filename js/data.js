// Portfolio Data Storage with corrected image paths and enhanced data structure
const PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: 'Sky Surfers',
            overview: 'High-speed dodging challenge to test your absolute precision',
            description: 'An intense flight game that challenges your piloting skills. Take control and master the narrow, hazard-filled canyon with precision dodging and nerves of steel.',
            image: 'images/games/game1.jpg',
            game_folder: 'sky_surfers',
            build_name: 'sky_surfers',
            technologies: ['Unity', 'C#', '3D Modeling'],
            status: 'Playable'
        },
        {
            id: 2,
            name: 'Adventure Quest',
            overview: 'Epic adventure game with immersive storytelling',
            description: 'Embark on an unforgettable journey through mystical lands. Solve puzzles, battle creatures, and uncover ancient secrets in this epic adventure.',
            image: 'images/games/game2.jpg',
            game_folder: 'adventure_quest',
            build_name: 'adventure_quest',
            technologies: ['Unity', 'C#', 'Blender'],
            status: 'Playable'
        }
    ],
    
    websites: [
        {
            id: 1,
            name: 'ReelSpot',
            description: 'The fastest way to save your media. Multi-platform downloading made quick, simple, and painless.',
            image: 'images/websites/website1.jpg',
            url: 'https://arshvermagit.github.io/REELSPOT/',
            technologies: ['JavaScript', 'HTML', 'CSS'],
            status: 'Live'
        },
        {
            id: 2,
            name: 'Creative Portfolio',
            description: 'Modern responsive portfolio showcasing creative development work and digital artistry.',
            image: 'images/websites/website2.jpg',
            url: '#',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            status: 'Coming Soon'
        }
    ],
    
    photos: [
        {
            id: 1,
            title: 'The Heart Of Love',
            description: 'Showcasing the symbol of love and connection in a beautiful artistic composition.',
            category: 'Love',
            image: 'images/photos/photo1.jpg',
            camera: 'Canon EOS R5',
            location: 'Art Gallery'
        },
        {
            id: 2,
            title: 'The Peacock',
            description: 'Beautiful peacock structure crafted from iron rods, showcasing artistic metalwork.',
            category: 'Art',
            image: 'images/photos/photo2.jpg',
            camera: 'Sony A7III',
            location: 'Sculpture Park'
        },
        {
            id: 3,
            title: 'Academic Block',
            description: 'Architectural beauty of the academic building with modern design elements.',
            category: 'Architecture',
            image: 'images/photos/photo3.jpg',
            camera: 'Nikon Z6',
            location: 'University Campus'
        },
        {
            id: 4,
            title: 'Block-1 Structure',
            description: 'Modern architectural design of Block-1 with clean lines and aesthetic appeal.',
            category: 'Architecture',
            image: 'images/photos/photo4.jpg',
            camera: 'Canon 5D Mark IV',
            location: 'Educational Complex'
        }
    ],
    
    videos: [
        {
            id: 1,
            title: 'Brand Showcase',
            description: 'Professional brand video with cinematic storytelling and visual appeal that captures attention.',
            category: 'Commercial',
            thumbnail: 'images/videos/video1.jpg',
            video_url: 'videos/demo.mp4',
            duration: '2:30',
            resolution: '4K'
        },
        {
            id: 2,
            title: 'Creative Montage',
            description: 'Collection of creative moments and visual stories that inspire and engage viewers.',
            category: 'Creative',
            thumbnail: 'images/videos/video2.jpg',
            video_url: 'videos/montage.mp4',
            duration: '1:45',
            resolution: '1080p'
        }
    ]
};

// Feedback Storage
let feedbackStorage = [];

// Initialize feedback from localStorage
function initializeFeedback() {
    try {
        const stored = localStorage.getItem('portfolio_feedback');
        if (stored) {
            feedbackStorage = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('localStorage not available, using in-memory storage only');
        feedbackStorage = [];
    }
}

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
    
    try {
        localStorage.setItem('portfolio_feedback', JSON.stringify(feedbackStorage));
    } catch (e) {
        console.warn('localStorage not available');
    }
    
    return feedback;
}

function getAllFeedback() {
    return [...feedbackStorage].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
}

function deleteFeedback(feedbackId) {
    const initialLength = feedbackStorage.length;
    feedbackStorage = feedbackStorage.filter(f => f.id !== feedbackId);
    
    try {
        localStorage.setItem('portfolio_feedback', JSON.stringify(feedbackStorage));
    } catch (e) {
        console.warn('localStorage not available');
    }
    
    return feedbackStorage.length < initialLength;
}

// Get items by category for navigation
function getItemsByCategory(category) {
    return PORTFOLIO_DATA[category] || [];
}

// Create placeholder images dynamically
function createPlaceholderImages() {
    const images = [
        'images/games/game1.jpg',
        'images/games/game2.jpg',
        'images/websites/website1.jpg',
        'images/websites/website2.jpg',
        'images/photos/photo1.jpg',
        'images/photos/photo2.jpg',
        'images/photos/photo3.jpg',
        'images/photos/photo4.jpg',
        'images/videos/video1.jpg',
        'images/videos/video2.jpg'
    ];
    
    console.log('Required images for portfolio:', images);
}

// Enhanced portfolio rendering with image fallbacks
function renderGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;
    
    const games = PORTFOLIO_DATA.games || [];
    
    if (games.length > 0) {
        gamesGrid.innerHTML = games.map((game, index) => `
            <div class="portfolio-card" data-game='${JSON.stringify(game).replace(/'/g, "&apos;")}' data-type="game" style="animation-delay: ${index * 0.1}s">
                <div class="portfolio-image">
                    <img src="${game.image}" alt="${game.name}" 
                         onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxQTJBMzEiLz48cGF0aCBkPSJNMzAwIDIwMEwzNTAgMjUwTDMwMCAzMDBMMjUwIDI1MEwzMDAgMjAwWiIgZmlsbD0iI0ExODU2RCIvPjx0ZXh0IHg9IjMwMCIgeT0iMzUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkFGOEY1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiPiR7Z2FtZS5uYW1lfTwvdGV4dD48L3N2Zz4='; this.alt='${game.name}'">
                    <div class="portfolio-overlay">
                        <button class="play-btn" aria-label="Play ${game.name}">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="portfolio-info">
                    <span class="portfolio-badge">${game.status || 'Playable'}</span>
                    <h3 class="portfolio-title">${game.name}</h3>
                    <p class="portfolio-description">${game.overview}</p>
                </div>
            </div>
        `).join('');
        
        setTimeout(() => {
            if (typeof initPortfolioCards === 'function') {
                initPortfolioCards();
            }
        }, 100);
    } else {
        gamesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-gamepad"></i>
                <h3>Games Coming Soon</h3>
                <p>Exciting game projects are currently in development!</p>
            </div>
        `;
    }
}

function renderWebsites() {
    const websitesGrid = document.getElementById('websitesGrid');
    if (!websitesGrid) return;
    
    const websites = PORTFOLIO_DATA.websites || [];
    
    if (websites.length > 0) {
        websitesGrid.innerHTML = websites.map((website, index) => `
            <div class="portfolio-card" data-website='${JSON.stringify(website).replace(/'/g, "&apos;")}' data-type="website" style="animation-delay: ${index * 0.1}s">
                <div class="portfolio-image">
                    <img src="${website.image}" alt="${website.name}" 
                         onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxQTJBMzEiLz48cGF0aCBkPSJNMjAwIDE1MEg0MDBWMTUwSDQwMFYzNTBIMjAwVjE1MFoiIGZpbGw9IiNBMTg1NkQiLz48dGV4dCB4PSIzMDAiIHk9IjM1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZBRjhGNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4Ij4ke3dlYnNpdGUubmFtZX08L3RleHQ+PC9zdmc+'; this.alt='${website.name}'">
                    <div class="portfolio-overlay">
                        <button class="view-btn" aria-label="View ${website.name}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="portfolio-info">
                    <span class="portfolio-badge">${website.status || 'Live'}</span>
                    <h3 class="portfolio-title">${website.name}</h3>
                    <p class="portfolio-description">${website.description}</p>
                </div>
            </div>
        `).join('');
        
        setTimeout(() => {
            if (typeof initPortfolioCards === 'function') {
                initPortfolioCards();
            }
        }, 100);
    } else {
        websitesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-laptop-code"></i>
                <h3>Websites Coming Soon</h3>
                <p>Web projects are currently under development!</p>
            </div>
        `;
    }
}

function renderPhotos() {
    const photosGrid = document.getElementById('photosGrid');
    if (!photosGrid) return;
    
    const photos = PORTFOLIO_DATA.photos || [];
    
    if (photos.length > 0) {
        photosGrid.innerHTML = photos.map((photo, index) => `
            <div class="portfolio-card" data-photo='${JSON.stringify(photo).replace(/'/g, "&apos;")}' data-type="photo" style="animation-delay: ${index * 0.1}s">
                <div class="portfolio-image">
                    <img src="${photo.image}" alt="${photo.title}" 
                         onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxQTJBMzEiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSIyMDAiIHI9IjgwIiBmaWxsPSIjQTE4NTZEIi8+PHRleHQgeD0iMzAwIiB5PSIzNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGQUY4RjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCI+JHtwaG90by50aXRsZX08L3RleHQ+PC9zdmc+'; this.alt='${photo.title}'">
                    <div class="portfolio-overlay">
                        <button class="view-btn" aria-label="View ${photo.title}">
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
        
        setTimeout(() => {
            if (typeof initPortfolioCards === 'function') {
                initPortfolioCards();
            }
        }, 100);
    } else {
        photosGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-camera"></i>
                <h3>Photography Coming Soon</h3>
                <p>Photo gallery is being curated!</p>
            </div>
        `;
    }
}

function renderVideos() {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid) return;
    
    const videos = PORTFOLIO_DATA.videos || [];
    
    if (videos.length > 0) {
        videosGrid.innerHTML = videos.map((video, index) => `
            <div class="portfolio-card" data-video='${JSON.stringify(video).replace(/'/g, "&apos;")}' data-type="video" style="animation-delay: ${index * 0.1}s">
                <div class="portfolio-image">
                    <img src="${video.thumbnail}" alt="${video.title}" 
                         onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxQTJBMzEiLz48cGF0aCBkPSJNMjI1IDE3NVYzMjVMMzc1IDI1MEwyMjUgMTc1WiIgZmlsbD0iI0ExODU2RCIvPjx0ZXh0IHg9IjMwMCIgeT0iMzUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkFGOEY1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiPiR7dmlkZW8udGl0bGV9PC90ZXh0Pjwvc3ZnPg=='; this.alt='${video.title}'">
                    <div class="portfolio-overlay">
                        <button class="play-btn" aria-label="Play ${video.title}">
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
        
        setTimeout(() => {
            if (typeof initPortfolioCards === 'function') {
                initPortfolioCards();
            }
        }, 100);
    } else {
        videosGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-video"></i>
                <h3>Videos Coming Soon</h3>
                <p>Video content is being produced!</p>
            </div>
        `;
    }
}

// Initialize portfolio
function initializePortfolio() {
    console.log('Initializing portfolio...');
    
    // Set current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize feedback storage
    initializeFeedback();
    
    // Create placeholder images
    createPlaceholderImages();
    
    // Render all portfolio sections
    renderGames();
    renderWebsites();
    renderPhotos();
    renderVideos();
    
    console.log('Portfolio initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

// Make functions globally available
window.PORTFOLIO_DATA = PORTFOLIO_DATA;
window.saveFeedback = saveFeedback;
window.getAllFeedback = getAllFeedback;
window.deleteFeedback = deleteFeedback;
window.initializePortfolio = initializePortfolio;
window.getItemsByCategory = getItemsByCategory;