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
            playUrl: "games/sky-surfers/index.html",
            unityBuild: "static/games_files/sky_surfers/",
            screenshots: [
                "assets/games/game2-1.jpg",
                "assets/games/game2-2.jpg",
                "assets/games/game2-3.jpg"
            ]
        }
    ],

    websites: [
        {
            id: 1,
            name: "ReelSpot",
            overview: "Modern social media downloader with advanced features and seamless UX",
            description: "ReelSpot is a comprehensive social media content downloader that allows users to save their favorite videos, images, and reels from multiple platforms. Built with modern web technologies, it features a clean interface, fast processing, and support for multiple formats. The platform prioritizes user privacy and doesn't require login for most features.",
            image: "static/images/websites/ReelSpot/ReelSpot.jpg",
            category: "Media Downloader",
            rating: 4.8,
            status: "Live",
            launchDate: "2023-10-25",
            developmentTime: "3 months",
            userBase: "50K+",
            pageLoadTime: "1.2s",
            mobileResponsive: true,
            technologies: ["HTML5", "CSS3", "JavaScript"],
            features: [
                "Multi-platform support (Instagram, Facebook, Twitter)",
                "High-quality video downloads",
                "Batch download capability",
                "No watermarks",
                "Format conversion options",
                "Privacy-focused design"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/REELSPOT",
            liveUrl: "file:///Users/arshverma/GitHub/REELSPOT/index.html",
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
            description: "Productivity Pro is a comprehensive productivity application designed to help users organize their tasks, track time, set goals, and boost overall efficiency. With intuitive interfaces, powerful features, and seamless synchronization across devices, it's the perfect companion for professionals, students, and anyone looking to maximize their productivity. Features include task management with priorities, time tracking with detailed analytics, goal setting with progress monitoring, and customizable workflows.",
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
                "Advanced task management with tags and priorities",
                "Pomodoro timer with customizable intervals",
                "Time tracking with detailed analytics",
                "Goal setting and progress monitoring",
                "Calendar integration",
                "Team collaboration features",
                "Cloud synchronization across devices",
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
            title: "AWS Certified Solutions Architect - Associate",
            issuer: "Amazon Web Services",
            date: "2024-01-15",
            category: "Cloud Computing",
            image: "assets/certificates/aws-saa.jpg",
            description: "Demonstrated expertise in designing distributed systems on AWS platform including compute, networking, storage, and database AWS services as well as deployment and management services.",
            skills: [
                "AWS Services Architecture",
                "Cloud Infrastructure Design",
                "Security & Compliance",
                "Cost Optimization",
                "High Availability Systems",
                "Scalable Solutions"
            ],
            technologies: ["AWS", "EC2", "S3", "RDS", "Lambda", "CloudFormation", "VPC"],
            credentialId: "AWS-ASA-12345-67890",
            credentialUrl: "https://www.credly.com/badges/aws-certified-solutions-architect-associate",
            year: "2024",
            validity: "3 Years",
            difficulty: "Advanced",
            duration: "3 Months",
            recognition: "Global",
            additionalImages: [
                "assets/certificates/aws-saa-badge.jpg",
                "assets/certificates/aws-saa-transcript.jpg"
            ],
            verified: true,
            featured: true
        }
    ],

    testimonials: [
        {
            id: 1,
            clientName: "Sarah Johnson",
            clientRole: "CEO, TechStart Inc.",
            projectType: "Website",
            projectName: "E-Commerce Pro",
            rating: 5,
            testimonialText: "Arsh delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise transformed our online business. The site is fast, secure, and our sales have increased by 150% since launch!",
            date: "2024-01-15",
            avatar: "assets/testimonials/client1.jpg",
            approved: true
        },
        {
            id: 2,
            clientName: "Mike Rodriguez",
            clientRole: "Product Manager, FitLife",
            projectType: "App",
            projectName: "Fitness Tracker Pro",
            rating: 5,
            testimonialText: "The fitness app developed by Arsh has been instrumental in our company's growth. The user experience is seamless, the performance is outstanding, and our users love the intuitive design. Highly recommended!",
            date: "2024-02-10",
            avatar: "assets/testimonials/client2.jpg",
            approved: true
        },
        {
            id: 3,
            clientName: "Emily Chen",
            clientRole: "Founder, HealthWell Solutions",
            projectType: "Website",
            projectName: "Health & Wellness Hub",
            rating: 5,
            testimonialText: "Working with Arsh was an absolute pleasure. He understood our vision perfectly and delivered a platform that our users love. The attention to detail and commitment to quality is evident in every aspect of the project.",
            date: "2023-12-20",
            avatar: "assets/testimonials/client3.jpg",
            approved: true
        },
        {
            id: 4,
            clientName: "David Thompson",
            clientRole: "CTO, GameNest Studios",
            projectType: "Game",
            projectName: "Epic Adventure Quest",
            rating: 5,
            testimonialText: "Arsh's game development skills are top-notch. He created an engaging RPG with smooth gameplay and beautiful visuals. The project was delivered on time and exceeded our quality expectations.",
            date: "2023-11-25",
            avatar: "assets/testimonials/client4.jpg",
            approved: true
        },
        {
            id: 5,
            clientName: "Jennifer Lee",
            clientRole: "Marketing Director, BudgetWise",
            projectType: "App",
            projectName: "Budget Master",
            rating: 5,
            testimonialText: "Our finance app has received incredible feedback from users. Arsh's expertise in mobile development and UI/UX design resulted in an app that's both powerful and easy to use. We couldn't be happier!",
            date: "2024-01-05",
            avatar: "assets/testimonials/client5.jpg",
            approved: true
        },
        {
            id: 6,
            clientName: "Robert Martinez",
            clientRole: "Owner, FoodieDelight",
            projectType: "Website",
            projectName: "Food Delivery Platform",
            rating: 4.5,
            testimonialText: "The food delivery platform Arsh built for us is fantastic. Real-time tracking works flawlessly, and the restaurant dashboard is intuitive. Our delivery efficiency has improved significantly!",
            date: "2023-10-15",
            avatar: "assets/testimonials/client6.jpg",
            approved: true
        },
        {
            id: 7,
            clientName: "Amanda Foster",
            clientRole: "Director, LearnSmart Academy",
            projectType: "Website",
            projectName: "Learning Management System",
            rating: 5,
            testimonialText: "Arsh created an outstanding LMS for our academy. The platform handles video streaming, quizzes, and progress tracking perfectly. Our student engagement has doubled, and instructors love the easy-to-use interface.",
            date: "2023-11-30",
            avatar: "assets/testimonials/client7.jpg",
            approved: true
        },
        {
            id: 8,
            clientName: "Chris Anderson",
            clientRole: "Indie Game Developer",
            projectType: "Game",
            projectName: "Puzzle Master Pro",
            rating: 5,
            testimonialText: "Arsh helped bring my puzzle game vision to life. The mechanics are innovative, the design is beautiful, and players are loving it. His expertise in Unity and game design is exceptional.",
            date: "2024-02-01",
            avatar: "assets/testimonials/client8.jpg",
            approved: true
        },
        {
            id: 9,
            clientName: "Lisa Wang",
            clientRole: "Product Owner, LinguaLearn",
            projectType: "App",
            projectName: "Language Learner",
            rating: 4.5,
            testimonialText: "The language learning app exceeded our expectations. The AI-powered pronunciation feedback is a game-changer. Arsh's technical skills and creative problem-solving made this project a success.",
            date: "2023-12-10",
            avatar: "assets/testimonials/client9.jpg",
            approved: true
        },
        {
            id: 10,
            clientName: "Michael Brown",
            clientRole: "Entrepreneur",
            projectType: "Website",
            projectName: "Portfolio Showcase",
            rating: 5,
            testimonialText: "Arsh created a stunning portfolio website for me. The animations are smooth, the design is modern, and I've received so many compliments. It's helped me land several new clients!",
            date: "2024-01-25",
            avatar: "assets/testimonials/client10.jpg",
            approved: true
        },
        {
            id: 11,
            clientName: "Rachel Green",
            clientRole: "Wellness Coach",
            projectType: "App",
            projectName: "Meditation & Sleep",
            rating: 5,
            testimonialText: "The meditation app Arsh developed has been a hit with my clients. The guided sessions are professionally integrated, and the sleep sounds are incredibly relaxing. Highly professional work!",
            date: "2023-10-05",
            avatar: "assets/testimonials/client11.jpg",
            approved: true
        },
        {
            id: 12,
            clientName: "Kevin Patel",
            clientRole: "Food Blogger",
            projectType: "App",
            projectName: "Recipe Hub",
            rating: 4.5,
            testimonialText: "Recipe Hub has become my go-to app for meal planning. Arsh created a beautiful and functional app that makes cooking enjoyable. The recipe scaling feature is particularly clever!",
            date: "2024-02-15",
            avatar: "assets/testimonials/client12.jpg",
            approved: true
        }
    ]
};

// ==========================================
// CERTIFICATE-SPECIFIC UTILITY FUNCTIONS
// ==========================================

/**
 * Get all certificates
 * @returns {Array} Array of certificate objects
 */
function getCertificates() {
    return PORTFOLIO_DATA.certificates;
}

/**
 * Get certificate by ID
 * @param {number} id - Certificate ID
 * @returns {Object|null} Certificate object or null if not found
 */
function getCertificateById(id) {
    return PORTFOLIO_DATA.certificates.find(cert => cert.id === parseInt(id)) || null;
}

/**
 * Get certificates by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered certificates array
 */
function getCertificatesByCategory(category) {
    if (category === 'all') return PORTFOLIO_DATA.certificates;
    return PORTFOLIO_DATA.certificates.filter(cert => 
        cert.category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Get certificates by issuer
 * @param {string} issuer - Issuer to filter by
 * @returns {Array} Filtered certificates array
 */
function getCertificatesByIssuer(issuer) {
    if (issuer === 'all') return PORTFOLIO_DATA.certificates;
    return PORTFOLIO_DATA.certificates.filter(cert => 
        cert.issuer.toLowerCase().includes(issuer.toLowerCase())
    );
}

/**
 * Get certificates by year
 * @param {string} year - Year to filter by
 * @returns {Array} Filtered certificates array
 */
function getCertificatesByYear(year) {
    if (year === 'all') return PORTFOLIO_DATA.certificates;
    return PORTFOLIO_DATA.certificates.filter(cert => cert.year === year);
}

/**
 * Get featured certificates
 * @returns {Array} Array of featured certificates
 */
function getFeaturedCertificates() {
    return PORTFOLIO_DATA.certificates.filter(cert => cert.featured);
}

/**
 * Get certificate categories
 * @returns {Array} Array of unique certificate categories
 */
function getCertificateCategories() {
    const categories = [...new Set(PORTFOLIO_DATA.certificates.map(cert => cert.category))];
    return categories.sort();
}

/**
 * Get certificate issuers
 * @returns {Array} Array of unique certificate issuers
 */
function getCertificateIssuers() {
    const issuers = [...new Set(PORTFOLIO_DATA.certificates.map(cert => cert.issuer))];
    return issuers.sort();
}

/**
 * Get certificate years
 * @returns {Array} Array of unique certificate years
 */
function getCertificateYears() {
    const years = [...new Set(PORTFOLIO_DATA.certificates.map(cert => cert.year))];
    return years.sort((a, b) => b - a); // Descending order
}

/**
 * Filter certificates based on multiple criteria
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered certificates array
 */
function filterCertificates(filters = {}) {
    let certificates = [...PORTFOLIO_DATA.certificates];
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
        certificates = certificates.filter(cert => 
            cert.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    
    // Filter by issuer
    if (filters.issuer && filters.issuer !== 'all') {
        certificates = certificates.filter(cert => 
            cert.issuer.toLowerCase().includes(filters.issuer.toLowerCase())
        );
    }
    
    // Filter by year
    if (filters.year && filters.year !== 'all') {
        certificates = certificates.filter(cert => cert.year === filters.year);
    }
    
    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'all') {
        certificates = certificates.filter(cert => 
            cert.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
    }
    
    // Filter by featured
    if (filters.featured) {
        certificates = certificates.filter(cert => cert.featured);
    }
    
    // Filter by verified
    if (filters.verified) {
        certificates = certificates.filter(cert => cert.verified);
    }
    
    // Sort certificates
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
                // Default sort by ID
                certificates.sort((a, b) => a.id - b.id);
        }
    }
    
    return certificates;
}

/**
 * Search certificates by keyword
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered certificates array
 */
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

/**
 * Get certificate statistics
 * @returns {Object} Certificate statistics
 */
function getCertificateStats() {
    const certificates = PORTFOLIO_DATA.certificates;
    const total = certificates.length;
    const categories = getCertificateCategories();
    const issuers = getCertificateIssuers();
    
    // Count by category
    const categoryCount = {};
    categories.forEach(category => {
        categoryCount[category] = certificates.filter(cert => cert.category === category).length;
    });
    
    // Count by year
    const yearCount = {};
    const years = getCertificateYears();
    years.forEach(year => {
        yearCount[year] = certificates.filter(cert => cert.year === year).length;
    });
    
    // Count by difficulty
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

// ==========================================
// EXISTING UTILITY FUNCTIONS (Updated)
// ==========================================

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

function getApps() {
    return PORTFOLIO_DATA.apps;
}

function getWebsites() {
    return PORTFOLIO_DATA.websites;
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
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ==========================================

window.PORTFOLIO_DATA = PORTFOLIO_DATA;
window.formatDate = formatDate;
window.formatDateShort = formatDateShort;
window.formatRelativeTime = formatRelativeTime;
window.generateStars = generateStars;
window.getProjectById = getProjectById;
window.getGames = getGames;
window.getApps = getApps;
window.getWebsites = getWebsites;
window.getCertificates = getCertificates;
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