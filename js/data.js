// ==========================================
// PORTFOLIO DATA - Complete Dataset
// All games, websites, apps, certificates, and testimonials
// ==========================================

const PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: "Sky Surfers",
            overview: "Fast-paced endless runner with stunning aerial gameplay",
            description: "Soar through the skies in this thrilling endless runner game. Navigate through clouds, avoid obstacles, collect power-ups, and compete for the highest score on global leaderboards.",
            image: "static/images/games/sky_surfers/sky_surfers.jpg",
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
            playUrl: null, // Set to null if using Unity WebGL, or provide external URL
            
            // Unity WebGL Configuration - IMPORTANT: Set this for WebGL games
            unityBuild: {
                enabled: true, // Set to true if this game has Unity WebGL build
                buildName: "sky_surfers", // Name of the build folder
                loaderUrl: "static/games_files/sky_surfers/Build/sky_surfers.loader.js",
                dataUrl: "static/games_files/sky_surfers/Build/sky_surfers.data",
                frameworkUrl: "static/games_files/sky_surfers/Build/sky_surfers.framework.js",
                codeUrl: "static/games_files/sky_surfers/Build/sky_surfers.wasm",
                companyName: "ArshCreates",
                productName: "Sky Surfers",
                productVersion: "1.0"
            },
            
            screenshots: [
                "static/images/games/sky_surfers/1.jpg",
                "static/images/games/sky_surfers/2.jpg",
                "static/images/games/sky_surfers/3.jpg",
                "static/images/games/sky_surfers/4.jpg"
            ]
        }
    ],

    websites: [
        {
            id: 1,
            name: "ReelSpot",
            overview: "Modern social media downloader with advanced features and seamless UX",
            description: "ReelSpot is a comprehensive social media content downloader that allows users to save their favorite videos, images, and reels from multiple platforms. Built with modern web technologies, it features a clean interface, fast processing, and support for multiple formats.",
            image: "static/images/websites/ReelSpot/ReelSpot.jpg",
            category: "Media Downloader",
            rating: 4.8,
            status: "Live",
            launchDate: "2023-10-25",
            developmentTime: "3 months",
            userBase: "50K+",
            performance: "98",
            pageLoadTime: "1.2s",
            mobileResponsive: true,
            technologies: ["HTML5", "CSS3", "JavaScript", "API Integration"],
            features: [
                "Multi-platform support (Instagram, Facebook, Twitter)",
                "High-quality video downloads",
                "Batch download capability",
                "No watermarks",
                "Format conversion options",
                "Privacy-focused design"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/REELSPOT",
            liveUrl: "https://arshvermagit-reelspot.vercel.app",
            screenshots: [
                "static/images/websites/ReelSpot/1.jpg",
                "static/images/websites/ReelSpot/2.jpg",
                "static/images/websites/ReelSpot/3.jpg",
                "static/images/websites/ReelSpot/4.jpg"
            ]
        }
    ],

    apps: [
        {
            id: 1,
            name: "Productivity Pro",
            overview: "All-in-one productivity app for task management and time tracking",
            description: "Productivity Pro is a comprehensive productivity application designed to help users organize their tasks, track time, set goals, and boost overall efficiency.",
            image: "static/apps/app1.jpg",
            category: "Productivity",
            rating: 4.8,
            status: "Live",
            launchDate: "2023-10-15",
            developmentTime: "4 months",
            downloadCount: "50K+",
            platform: "Cross-Platform",
            appSize: "25 MB",
            currentVersion: "2.1.0",
            minOS: "iOS 13.0 / Android 8.0",
            technologies: ["React Native", "Firebase", "Redux", "Expo"],
            features: [
                "Advanced task management",
                "Pomodoro timer",
                "Time tracking with analytics",
                "Goal setting",
                "Cloud synchronization",
                "Offline mode support"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/productivity-pro",
            appStoreUrl: "https://apps.apple.com/app/productivity-pro",
            playStoreUrl: "https://play.google.com/store/apps/details?id=com.productivitypro",
            screenshots: [
                "assets/apps/app1-1.jpg",
                "assets/apps/app1-2.jpg",
                "assets/apps/app1-3.jpg",
                "assets/apps/app1-4.jpg"
            ]
        }
    ],

    certificates: [
        {
            id: 1,
            title: "Intro to AR/VR/MR/XR: Technologies, Applications & Issues",
            issuer: "Coursera",
            date: "2025-11-19",
            category: "AR/VR/MR/XR",
            image: "static/images/certificates/Coursera/1.jpg",
            description: "The conceptual and technological differences between VR, AR, MR, and XR.",
            skills: [
                "Augmented and Virtual Reality",
                "Innovation",
                "Data Ethics",
                "Human Computer Interaction"
            ],
            technologies: ["AR", "VR", "MR", "XR"],
            credentialId: "298DV5MLVE3L",
            credentialUrl: "https://www.coursera.org/account/accomplishments/verify/298DV5MLVE3L",
            year: "2025",
            validity: "Life Time",
            difficulty: "Advanced",
            duration: "1 Months",
            verified: true,
            featured: true
        },
        {
            id: 2,
            title: "Software Engineering Job Simulation",
            issuer: "Forage",
            date: "2025-11-19",
            category: "AR/VR/MR/XR",
            image: "static/images/certificates/forage/1.jpg",
            description: "JPMC Advanced Software Engineering Forage Program.",
            skills: [
                "Project Setup",
                "Kafka Integration",
                "H2 Integration",
                "REST API Integration",
                "REST API Controller "
            ],
            technologies: ["Spring Boot 3.2.5", "Kafka", "Spring Data JPA", "APIs"],
            credentialId: "XdBvxzSdBopcXfk6v",
            credentialUrl: "https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_691ddbabc72988b4c63d861b_1763575348436_completion_certificate.pdf",
            year: "2025",
            validity: "Life Time",
            difficulty: "Advanced",
            duration: "1 Months",
            verified: true,
            featured: true
        }
    ],
};

// ==========================================
// IMMEDIATE GLOBAL ASSIGNMENTS (CRITICAL!)
// Must be at the top before any functions
// ==========================================
window.PORTFOLIO_DATA = PORTFOLIO_DATA;

// ==========================================
// CORE DATA ACCESS FUNCTIONS
// ==========================================

function getGames() {
    return PORTFOLIO_DATA.games || [];
}

function getApps() {
    return PORTFOLIO_DATA.apps || [];
}

function getWebsites() {
    return PORTFOLIO_DATA.websites || [];
}

function getCertificates() {
    return PORTFOLIO_DATA.certificates || [];
}

// Make functions immediately available
window.getGames = getGames;
window.getApps = getApps;
window.getWebsites = getWebsites;
window.getCertificates = getCertificates;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatDate(dateString) {
    if (!dateString) return 'Date not available';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
        return 'Invalid date';
    }
}

function formatDateShort(dateString) {
    if (!dateString) return 'N/A';
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
        return 'Invalid date';
    }
}

function formatRelativeTime(dateString) {
    try {
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
    } catch (error) {
        return 'Recently';
    }
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
    return data.find(item => item.id === parseInt(id)) || null;
}

function getCertificateById(id) {
    return PORTFOLIO_DATA.certificates.find(cert => cert.id === parseInt(id)) || null;
}

function getCertificatesByCategory(category) {
    if (category === 'all') return PORTFOLIO_DATA.certificates;
    return PORTFOLIO_DATA.certificates.filter(cert => 
        cert.category.toLowerCase() === category.toLowerCase()
    );
}

function getCertificatesByIssuer(issuer) {
    if (issuer === 'all') return PORTFOLIO_DATA.certificates;
    return PORTFOLIO_DATA.certificates.filter(cert => 
        cert.issuer.toLowerCase().includes(issuer.toLowerCase())
    );
}

function getCertificatesByYear(year) {
    if (year === 'all') return PORTFOLIO_DATA.certificates;
    return PORTFOLIO_DATA.certificates.filter(cert => cert.year === year);
}

function getFeaturedCertificates() {
    return PORTFOLIO_DATA.certificates.filter(cert => cert.featured);
}

function getCertificateCategories() {
    const categories = [...new Set(PORTFOLIO_DATA.certificates.map(cert => cert.category))];
    return categories.sort();
}

function getCertificateIssuers() {
    const issuers = [...new Set(PORTFOLIO_DATA.certificates.map(cert => cert.issuer))];
    return issuers.sort();
}

function getCertificateYears() {
    const years = [...new Set(PORTFOLIO_DATA.certificates.map(cert => cert.year))];
    return years.sort((a, b) => b - a);
}

function filterCertificates(filters = {}) {
    let certificates = [...PORTFOLIO_DATA.certificates];
    
    if (filters.category && filters.category !== 'all') {
        certificates = certificates.filter(cert => 
            cert.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    
    if (filters.issuer && filters.issuer !== 'all') {
        certificates = certificates.filter(cert => 
            cert.issuer.toLowerCase().includes(filters.issuer.toLowerCase())
        );
    }
    
    if (filters.year && filters.year !== 'all') {
        certificates = certificates.filter(cert => cert.year === filters.year);
    }
    
    if (filters.difficulty && filters.difficulty !== 'all') {
        certificates = certificates.filter(cert => 
            cert.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
    }
    
    if (filters.featured) {
        certificates = certificates.filter(cert => cert.featured);
    }
    
    if (filters.verified) {
        certificates = certificates.filter(cert => cert.verified);
    }
    
    if (filters.sortBy) {
        switch(filters.sortBy) {
            case 'newest':
                certificates.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                certificates.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'difficulty':
                const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
                certificates.sort((a, b) => difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]);
                break;
            case 'issuer':
                certificates.sort((a, b) => a.issuer.localeCompare(b.issuer));
                break;
            default:
                certificates.sort((a, b) => a.id - b.id);
        }
    }
    
    return certificates;
}

function searchCertificates(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return PORTFOLIO_DATA.certificates;
    }
    
    const term = searchTerm.toLowerCase();
    return PORTFOLIO_DATA.certificates.filter(cert => {
        return (
            cert.title.toLowerCase().includes(term) ||
            cert.issuer.toLowerCase().includes(term) ||
            cert.description.toLowerCase().includes(term) ||
            cert.category.toLowerCase().includes(term) ||
            cert.skills.some(skill => skill.toLowerCase().includes(term)) ||
            cert.technologies.some(tech => tech.toLowerCase().includes(term))
        );
    });
}

function getCertificateStats() {
    const certificates = PORTFOLIO_DATA.certificates;
    const total = certificates.length;
    const categories = getCertificateCategories();
    const issuers = getCertificateIssuers();
    
    const categoryCount = {};
    categories.forEach(category => {
        categoryCount[category] = certificates.filter(cert => cert.category === category).length;
    });
    
    const yearCount = {};
    const years = getCertificateYears();
    years.forEach(year => {
        yearCount[year] = certificates.filter(cert => cert.year === year).length;
    });
    
    const difficultyCount = {
        'Beginner': certificates.filter(cert => cert.difficulty === 'Beginner').length,
        'Intermediate': certificates.filter(cert => cert.difficulty === 'Intermediate').length,
        'Advanced': certificates.filter(cert => cert.difficulty === 'Advanced').length
    };
    
    return {
        totalCertificates: total,
        totalCategories: categories.length,
        totalIssuers: issuers.length,
        featuredCount: certificates.filter(cert => cert.featured).length,
        verifiedCount: certificates.filter(cert => cert.verified).length,
        categoryCount: categoryCount,
        yearCount: yearCount,
        difficultyCount: difficultyCount
    };
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
    
    if (filters.category && filters.category !== 'all') {
        items = items.filter(item => 
            item.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    
    if (filters.minRating) {
        items = items.filter(item => item.rating >= parseFloat(filters.minRating));
    }
    
    if (filters.status && filters.status !== 'all') {
        items = items.filter(item => 
            item.status.toLowerCase() === filters.status.toLowerCase()
        );
    }
    
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
    const certificateStats = getCertificateStats();
    
    return {
        totalGames: PORTFOLIO_DATA.games.length,
        totalWebsites: PORTFOLIO_DATA.websites.length,
        totalApps: PORTFOLIO_DATA.apps.length,
        totalCertificates: certificateStats.totalCertificates,
        totalTestimonials: PORTFOLIO_DATA.testimonials.filter(t => t.approved).length,
        totalProjects: PORTFOLIO_DATA.games.length + 
                      PORTFOLIO_DATA.websites.length + 
                      PORTFOLIO_DATA.apps.length,
        averageRating: calculateAverageRating(),
        totalDownloads: calculateTotalDownloads(),
        totalUsers: calculateTotalUsers(),
        certificateStats: certificateStats
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
    
    allProjects.sort((a, b) => {
        const dateA = new Date(a.releaseDate || a.launchDate);
        const dateB = new Date(b.releaseDate || b.launchDate);
        return dateB - dateA;
    });
    
    return allProjects.slice(0, limit);
}

function getFeaturedProjects() {
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
        apps: ['name', 'description', 'category', 'rating', 'status', 'platform', 'technologies'],
        certificates: ['title', 'issuer', 'date', 'category', 'description', 'skills', 'technologies']
    };
    
    const required = requiredFields[type] || [];
    const missing = required.filter(field => !data[field]);
    
    return {
        isValid: missing.length === 0,
        missingFields: missing
    };
}

// ==========================================
// EXPORT ALL FUNCTIONS TO WINDOW OBJECT
// ==========================================

window.formatDate = formatDate;
window.formatDateShort = formatDateShort;
window.formatRelativeTime = formatRelativeTime;
window.generateStars = generateStars;
window.getProjectById = getProjectById;
window.getCertificateById = getCertificateById;
window.getCertificatesByCategory = getCertificatesByCategory;
window.getCertificatesByIssuer = getCertificatesByIssuer;
window.getCertificatesByYear = getCertificatesByYear;
window.getFeaturedCertificates = getFeaturedCertificates;
window.getCertificateCategories = getCertificateCategories;
window.getCertificateIssuers = getCertificateIssuers;
window.getCertificateYears = getCertificateYears;
window.filterCertificates = filterCertificates;
window.searchCertificates = searchCertificates;
window.getCertificateStats = getCertificateStats;
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

// Log successful data load
console.log('✅ Portfolio data loaded successfully');
console.log('📊 Stats:', {
    games: PORTFOLIO_DATA.games.length,
    websites: PORTFOLIO_DATA.websites.length,
    apps: PORTFOLIO_DATA.apps.length,
    certificates: PORTFOLIO_DATA.certificates.length,
    testimonials: PORTFOLIO_DATA.testimonials.length
});

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
        getApps,
        getWebsites,
        getCertificates,
        getCertificateById,
        getCertificatesByCategory,
        getCertificatesByIssuer,
        getCertificatesByYear,
        getFeaturedCertificates,
        getCertificateCategories,
        getCertificateIssuers,
        getCertificateYears,
        filterCertificates,
        searchCertificates,
        getCertificateStats,
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