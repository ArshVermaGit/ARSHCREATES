// ==========================================
// PORTFOLIO DATA - Complete Dataset
// All games, websites, apps, and testimonials
// ==========================================

const PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: "Sky Surfers",
            overview: "Fast-paced endless runner with stunning aerial gameplay",
            description: "Soar through the skies in this thrilling endless runner game. Navigate through clouds, avoid obstacles, collect power-ups, and compete for the highest score on global leaderboards.",
            image: "static/images/games/Game1.jpg",
            category: "Endless Runner",
            rating: 4.6,
            status: "Live",
            releaseDate: "2023-09-20",
            developmentTime: "3 months",
            teamSize: "2 developers",
            likes: 890,
            playCount: 12500,
            platforms: ["WebGL", "Mobile"],
            features: [
                "Smooth endless gameplay mechanics",
                "Power-up system with unique abilities",
                "Global leaderboards",
                "Daily challenges and rewards",
                "Multiple character skins",
                "Progressive difficulty system"
            ],
            technologies: ["Unity", "C#", "Unity Ads", "Firebase"],
            repositoryUrl: "https://github.com/ArshVermaGit/sky-surfers",
            playUrl: "static/games_files/sky_surfers",
            unityBuild: "sky-surfers", // Added this field
            screenshots: [
                "assets/games/game2-1.jpg",
                "assets/games/game2-2.jpg",
                "assets/games/game2-3.jpg"
            ]
        },
        {
            id: 2,
            name: "Epic Adventure Quest",
            overview: "Immersive RPG with rich storyline and stunning visuals",
            description: "Embark on an epic journey through magical realms in this captivating RPG. Features include character customization, skill trees, dynamic combat system, and multiplayer co-op.",
            image: "assets/games/game2.jpg",
            category: "RPG",
            rating: 4.8,
            status: "Live",
            releaseDate: "2024-01-15",
            developmentTime: "6 months",
            teamSize: "4 developers",
            likes: 1250,
            playCount: 18500,
            platforms: ["WebGL", "PC", "Mobile"],
            features: [
                "Character customization system",
                "Skill trees and progression",
                "Dynamic combat mechanics",
                "Multiplayer co-op mode",
                "Rich storyline with choices",
                "Stunning visual effects"
            ],
            technologies: ["Unity", "C#", "Photon", "Blender"],
            repositoryUrl: "https://github.com/ArshVermaGit/epic-adventure",
            playUrl: "static/games_files/epic_adventure",
            unityBuild: "epic-adventure",
            screenshots: [
                "assets/games/game2-1.jpg",
                "assets/games/game2-2.jpg",
                "assets/games/game2-3.jpg"
            ]
        }
    ],

    websites: [
        // ... existing websites data (unchanged)
    ],

    apps: [
        // ... existing apps data (unchanged)
    ],

    testimonials: [
        // ... existing testimonials data (unchanged)
    ]
};

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateShort(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function getProjectById(type, id) {
    const data = PORTFOLIO_DATA[type];
    if (!data) return null;
    return data.find(item => item.id === parseInt(id));
}

function getGames() {
    return PORTFOLIO_DATA.games;
}

function getTestimonialsByType(type) {
    if (type === 'all') return PORTFOLIO_DATA.testimonials;
    return PORTFOLIO_DATA.testimonials.filter(t => t.projectType.toLowerCase() === type.toLowerCase());
}

function getTestimonialsByRating(minRating) {
    return PORTFOLIO_DATA.testimonials.filter(t => t.rating >= parseFloat(minRating));
}

function filterProjects(type, filters = {}) {
    let items = [...PORTFOLIO_DATA[type]];
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
        items = items.filter(item => 
            item.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    
    // Filter by rating
    if (filters.minRating) {
        items = items.filter(item => item.rating >= parseFloat(filters.minRating));
    }
    
    // Filter by status
    if (filters.status && filters.status !== 'all') {
        items = items.filter(item => 
            item.status.toLowerCase() === filters.status.toLowerCase()
        );
    }
    
    // Filter by platform (for games and apps)
    if (filters.platform && filters.platform !== 'all') {
        items = items.filter(item => {
            if (item.platforms) {
                return item.platforms.some(p => 
                    p.toLowerCase().includes(filters.platform.toLowerCase())
                );
            }
            if (item.platform) {
                return item.platform.toLowerCase().includes(filters.platform.toLowerCase());
            }
            return false;
        });
    }
    
    // Sort
    if (filters.sortBy) {
        switch(filters.sortBy) {
            case 'newest':
                items.sort((a, b) => 
                    new Date(b.releaseDate || b.launchDate) - 
                    new Date(a.releaseDate || a.launchDate)
                );
                break;
            case 'oldest':
                items.sort((a, b) => 
                    new Date(a.releaseDate || a.launchDate) - 
                    new Date(b.releaseDate || b.launchDate)
                );
                break;
            case 'rating':
                items.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                items.sort((a, b) => {
                    const aPopularity = a.playCount || a.downloadCount || a.userBase || 0;
                    const bPopularity = b.playCount || b.downloadCount || b.userBase || 0;
                    return bPopularity - aPopularity;
                });
                break;
            default:
                // Default sort by ID
                items.sort((a, b) => a.id - b.id);
        }
    }
    
    return items;
}

function searchProjects(type, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return PORTFOLIO_DATA[type];
    }
    
    const term = searchTerm.toLowerCase();
    return PORTFOLIO_DATA[type].filter(item => {
        return (
            item.name.toLowerCase().includes(term) ||
            item.overview.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term) ||
            (item.technologies && item.technologies.some(tech => 
                tech.toLowerCase().includes(term)
            )) ||
            (item.features && item.features.some(feature => 
                feature.toLowerCase().includes(term)
            ))
        );
    });
}

function getCategories(type) {
    const items = PORTFOLIO_DATA[type];
    const categories = [...new Set(items.map(item => item.category))];
    return categories.sort();
}

function getTechnologies(type) {
    const items = PORTFOLIO_DATA[type];
    const techSet = new Set();
    
    items.forEach(item => {
        if (item.technologies) {
            item.technologies.forEach(tech => techSet.add(tech));
        }
    });
    
    return Array.from(techSet).sort();
}

function getStats() {
    return {
        totalGames: PORTFOLIO_DATA.games.length,
        totalWebsites: PORTFOLIO_DATA.websites.length,
        totalApps: PORTFOLIO_DATA.apps.length,
        totalTestimonials: PORTFOLIO_DATA.testimonials.filter(t => t.approved).length,
        totalProjects: PORTFOLIO_DATA.games.length + 
                      PORTFOLIO_DATA.websites.length + 
                      PORTFOLIO_DATA.apps.length,
        averageRating: calculateAverageRating(),
        totalDownloads: calculateTotalDownloads(),
        totalUsers: calculateTotalUsers()
    };
}

function calculateAverageRating() {
    const allProjects = [
        ...PORTFOLIO_DATA.games,
        ...PORTFOLIO_DATA.websites,
        ...PORTFOLIO_DATA.apps
    ];
    
    if (allProjects.length === 0) return 0;
    
    const totalRating = allProjects.reduce((sum, project) => sum + project.rating, 0);
    return (totalRating / allProjects.length).toFixed(1);
}

function calculateTotalDownloads() {
    const apps = PORTFOLIO_DATA.apps;
    let total = 0;
    
    apps.forEach(app => {
        if (app.downloadCount) {
            const count = app.downloadCount.replace(/[^0-9]/g, '');
            total += parseInt(count) || 0;
        }
    });
    
    return total;
}

function calculateTotalUsers() {
    const websites = PORTFOLIO_DATA.websites;
    let total = 0;
    
    websites.forEach(website => {
        if (website.userBase) {
            const count = website.userBase.replace(/[^0-9]/g, '');
            total += parseInt(count) || 0;
        }
    });
    
    return total;
}

function getRecentProjects(limit = 6) {
    const allProjects = [
        ...PORTFOLIO_DATA.games.map(g => ({...g, type: 'game'})),
        ...PORTFOLIO_DATA.websites.map(w => ({...w, type: 'website'})),
        ...PORTFOLIO_DATA.apps.map(a => ({...a, type: 'app'}))
    ];
    
    // Sort by date (newest first)
    allProjects.sort((a, b) => {
        const dateA = new Date(a.releaseDate || a.launchDate);
        const dateB = new Date(b.releaseDate || b.launchDate);
        return dateB - dateA;
    });
    
    return allProjects.slice(0, limit);
}

function getFeaturedProjects() {
    // Get highest rated projects from each category
    const topGame = PORTFOLIO_DATA.games.reduce((prev, current) => 
        (prev.rating > current.rating) ? prev : current
    );
    
    const topWebsite = PORTFOLIO_DATA.websites.reduce((prev, current) => 
        (prev.rating > current.rating) ? prev : current
    );
    
    const topApp = PORTFOLIO_DATA.apps.reduce((prev, current) => 
        (prev.rating > current.rating) ? prev : current
    );
    
    return {
        game: {...topGame, type: 'game'},
        website: {...topWebsite, type: 'website'},
        app: {...topApp, type: 'app'}
    };
}

function validateProjectData(type, data) {
    const requiredFields = {
        games: ['name', 'description', 'category', 'rating', 'status', 'technologies'],
        websites: ['name', 'description', 'category', 'rating', 'status', 'technologies'],
        apps: ['name', 'description', 'category', 'rating', 'status', 'platform', 'technologies']
    };
    
    const required = requiredFields[type] || [];
    const missing = required.filter(field => !data[field]);
    
    return {
        isValid: missing.length === 0,
        missingFields: missing
    };
}

// Make data and functions globally available
window.PORTFOLIO_DATA = PORTFOLIO_DATA;
window.formatDate = formatDate;
window.formatDateShort = formatDateShort;
window.formatRelativeTime = formatRelativeTime;
window.generateStars = generateStars;
window.getProjectById = getProjectById;
window.getGames = getGames;
window.getTestimonialsByType = getTestimonialsByType;
window.getTestimonialsByRating = getTestimonialsByRating;
window.filterProjects = filterProjects;
window.searchProjects = searchProjects;
window.getCategories = getCategories;
window.getTechnologies = getTechnologies;
window.getStats = getStats;
window.getRecentProjects = getRecentProjects;
window.getFeaturedProjects = getFeaturedProjects;
window.validateProjectData = validateProjectData;

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PORTFOLIO_DATA,
        formatDate,
        formatDateShort,
        formatRelativeTime,
        generateStars,
        getProjectById,
        getGames,
        getTestimonialsByType,
        getTestimonialsByRating,
        filterProjects,
        searchProjects,
        getCategories,
        getTechnologies,
        getStats,
        getRecentProjects,
        getFeaturedProjects,
        validateProjectData
    };
}