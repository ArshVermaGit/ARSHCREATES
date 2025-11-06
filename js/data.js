// ==========================================
// PORTFOLIO DATA - Complete Dataset
// All games, websites, apps, and testimonials
// ==========================================

const PORTFOLIO_DATA = {
    // Games Data
    games: [
        {
            id: 1,
            name: "Epic Adventure Quest",
            overview: "An immersive action RPG with stunning visuals and engaging gameplay",
            description: "Embark on an epic journey through mystical lands, battling fearsome creatures and uncovering ancient secrets. This Unity-based RPG features advanced AI, dynamic weather systems, and a compelling storyline that will keep players engaged for hours.",
            image: "assets/games/game1.jpg",
            category: "Action RPG",
            rating: 4.8,
            status: "Live",
            releaseDate: "2023-11-15",
            developmentTime: "6 months",
            teamSize: "4 developers",
            likes: 1250,
            playCount: 8900,
            platforms: ["WebGL", "Windows", "Mac"],
            features: [
                "Open world exploration",
                "Dynamic combat system",
                "Character progression",
                "Multiplayer support",
                "Advanced AI enemies",
                "Weather system",
                "Day/night cycle"
            ],
            technologies: ["Unity", "C#", "Blender", "Photoshop"],
            repositoryUrl: "https://github.com/ArshVermaGit/epic-adventure-quest",
            playUrl: "games/epic-adventure-quest/index.html",
            screenshots: [
                "assets/games/game1-1.jpg",
                "assets/games/game1-2.jpg",
                "assets/games/game1-3.jpg"
            ]
        },
        {
            id: 2,
            name: "Neon Racer X",
            overview: "High-speed futuristic racing game with stunning visual effects",
            description: "Experience the thrill of high-speed racing in a neon-lit futuristic world. With customizable vehicles, multiple tracks, and competitive multiplayer, this game brings arcade racing to the next level.",
            image: "assets/games/game2.jpg",
            category: "Racing",
            rating: 4.6,
            status: "Live",
            releaseDate: "2023-08-22",
            developmentTime: "4 months",
            teamSize: "3 developers",
            likes: 890,
            playCount: 5600,
            platforms: ["WebGL", "Android", "iOS"],
            features: [
                "Multiple game modes",
                "Vehicle customization",
                "Online multiplayer",
                "Leaderboards",
                "Power-ups system",
                "Dynamic obstacles",
                "Visual effects"
            ],
            technologies: ["Unity", "C#", "Substance Painter", "FMOD"],
            repositoryUrl: "https://github.com/ArshVermaGit/neon-racer-x",
            playUrl: "games/neon-racer-x/index.html",
            screenshots: [
                "assets/games/game2-1.jpg",
                "assets/games/game2-2.jpg",
                "assets/games/game2-3.jpg"
            ]
        },
        {
            id: 3,
            name: "Mystic Dungeon Crawler",
            overview: "Procedurally generated dungeon crawler with rogue-like elements",
            description: "Dive into randomly generated dungeons filled with treasures and dangers. Each playthrough offers unique challenges and rewards in this addictive rogue-like adventure.",
            image: "assets/games/game3.jpg",
            category: "Fantasy RPG",
            rating: 4.9,
            status: "Live",
            releaseDate: "2024-01-10",
            developmentTime: "5 months",
            teamSize: "2 developers",
            likes: 2100,
            playCount: 12300,
            platforms: ["WebGL", "Windows"],
            features: [
                "Procedural generation",
                "Permadeath system",
                "Item collection",
                "Boss battles",
                "Skill trees",
                "Secret areas",
                "Daily challenges"
            ],
            technologies: ["Unity", "C#", "Aseprite", "Wwise"],
            repositoryUrl: "https://github.com/ArshVermaGit/mystic-dungeon",
            playUrl: "games/mystic-dungeon/index.html",
            screenshots: [
                "assets/games/game3-1.jpg",
                "assets/games/game3-2.jpg",
                "assets/games/game3-3.jpg"
            ]
        },
        {
            id: 4,
            name: "Space Defender Pro",
            overview: "Intense space shooter with upgradeable ships and boss battles",
            description: "Defend the galaxy from alien invaders in this action-packed space shooter. Upgrade your ship, unlock powerful weapons, and face challenging boss encounters.",
            image: "assets/games/game4.jpg",
            category: "Shooter",
            rating: 4.5,
            status: "In Development",
            releaseDate: "2024-03-15",
            developmentTime: "3 months",
            teamSize: "1 developer",
            likes: 450,
            playCount: 0,
            platforms: ["WebGL", "Mobile"],
            features: [
                "Ship customization",
                "Weapon upgrades",
                "Boss battles",
                "Multiple levels",
                "Power-ups",
                "Online leaderboard",
                "Achievement system"
            ],
            technologies: ["Unity", "C#", "Blender"],
            repositoryUrl: "https://github.com/ArshVermaGit/space-defender",
            playUrl: "games/space-defender/index.html",
            screenshots: [
                "assets/games/game4-1.jpg",
                "assets/games/game4-2.jpg",
                "assets/games/game4-3.jpg"
            ]
        }
    ],

    // Websites Data
    websites: [
        {
            id: 1,
            name: "E-Commerce Pro",
            overview: "Modern e-commerce platform with advanced features and seamless UX",
            description: "A full-featured e-commerce solution built with modern web technologies. Features include product management, shopping cart, payment integration, and admin dashboard.",
            image: "assets/websites/website1.jpg",
            category: "E-commerce",
            rating: 4.8,
            status: "Live",
            launchDate: "2023-09-10",
            developmentTime: "3 months",
            userBase: "50K+",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            features: [
                "Product catalog",
                "Shopping cart",
                "Payment processing",
                "User accounts",
                "Order tracking",
                "Admin dashboard",
                "Responsive design"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/ecommerce-pro",
            liveUrl: "https://ecommerce-pro.example.com",
            screenshots: [
                "assets/websites/website1-1.jpg",
                "assets/websites/website1-2.jpg",
                "assets/websites/website1-3.jpg"
            ]
        },
        {
            id: 2,
            name: "Health & Wellness Hub",
            overview: "Comprehensive health platform with tracking and community features",
            description: "A wellness platform that helps users track their health metrics, connect with professionals, and join community challenges for better health outcomes.",
            image: "assets/websites/website2.jpg",
            category: "Health & Wellness",
            rating: 4.7,
            status: "Live",
            launchDate: "2023-11-05",
            developmentTime: "4 months",
            userBase: "25K+",
            technologies: ["Vue.js", "Express", "PostgreSQL", "D3.js"],
            features: [
                "Health tracking",
                "Professional directory",
                "Community forums",
                "Progress analytics",
                "Mobile app sync",
                "Secure messaging",
                "Challenge system"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/health-hub",
            liveUrl: "https://healthhub.example.com",
            screenshots: [
                "assets/websites/website2-1.jpg",
                "assets/websites/website2-2.jpg",
                "assets/websites/website2-3.jpg"
            ]
        },
        {
            id: 3,
            name: "SaaS Business Platform",
            overview: "Scalable SaaS solution for business management and analytics",
            description: "A comprehensive software-as-a-service platform that helps businesses manage operations, analyze data, and make informed decisions with powerful analytics tools.",
            image: "assets/websites/website3.jpg",
            category: "SaaS Platform",
            rating: 4.9,
            status: "Live",
            launchDate: "2024-01-20",
            developmentTime: "6 months",
            userBase: "10K+",
            technologies: ["Angular", "NestJS", "MySQL", "Redis"],
            features: [
                "Dashboard analytics",
                "User management",
                "Billing system",
                "API integration",
                "Real-time updates",
                "Custom reporting",
                "Multi-tenant architecture"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/saas-platform",
            liveUrl: "https://saasplatform.example.com",
            screenshots: [
                "assets/websites/website3-1.jpg",
                "assets/websites/website3-2.jpg",
                "assets/websites/website3-3.jpg"
            ]
        },
        {
            id: 4,
            name: "Food Delivery Service",
            overview: "Modern food delivery platform with real-time tracking",
            description: "A feature-rich food delivery platform connecting restaurants with customers. Includes real-time order tracking, multiple payment options, and restaurant management tools.",
            image: "assets/websites/website4.jpg",
            category: "Food Delivery",
            rating: 4.6,
            status: "In Development",
            launchDate: "2024-04-01",
            developmentTime: "5 months",
            userBase: "Coming Soon",
            technologies: ["React Native", "Node.js", "MongoDB", "Socket.io"],
            features: [
                "Restaurant listings",
                "Real-time tracking",
                "Multiple payments",
                "Order history",
                "Rating system",
                "Delivery management",
                "Promotions system"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/food-delivery",
            liveUrl: "https://fooddelivery.example.com",
            screenshots: [
                "assets/websites/website4-1.jpg",
                "assets/websites/website4-2.jpg",
                "assets/websites/website4-3.jpg"
            ]
        }
    ],

    // Apps Data
    apps: [
        {
            id: 1,
            name: "Productivity Pro",
            overview: "All-in-one productivity app for task management and time tracking",
            description: "A comprehensive productivity app that helps you organize tasks, track time, set goals, and boost your efficiency. With intuitive design and powerful features, it's your ultimate productivity companion.",
            image: "assets/apps/app1.jpg",
            category: "Productivity",
            rating: 4.8,
            status: "Live",
            launchDate: "2023-10-15",
            developmentTime: "4 months",
            downloadCount: "50K+",
            platform: "Cross-Platform",
            technologies: ["React Native", "Firebase", "Redux"],
            features: [
                "Task management",
                "Time tracking",
                "Goal setting",
                "Progress analytics",
                "Cloud sync",
                "Team collaboration",
                "Custom notifications"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/productivity-pro",
            appStoreUrl: "https://apps.apple.com/app/productivity-pro",
            playStoreUrl: "https://play.google.com/store/apps/details?id=com.productivitypro",
            screenshots: [
                "assets/apps/app1-1.jpg",
                "assets/apps/app1-2.jpg",
                "assets/apps/app1-3.jpg"
            ]
        },
        {
            id: 2,
            name: "Fitness Tracker Plus",
            overview: "Comprehensive fitness app with workout plans and nutrition tracking",
            description: "Transform your fitness journey with personalized workout plans, nutrition tracking, and progress analytics. Whether you're a beginner or expert, this app adapts to your fitness goals.",
            image: "assets/apps/app2.jpg",
            category: "Health & Fitness",
            rating: 4.7,
            status: "Live",
            launchDate: "2023-12-01",
            developmentTime: "5 months",
            downloadCount: "75K+",
            platform: "iOS & Android",
            technologies: ["Flutter", "Node.js", "MongoDB"],
            features: [
                "Workout plans",
                "Nutrition tracking",
                "Progress photos",
                "Community challenges",
                "Wearable integration",
                "Personal coaching",
                "Meal planning"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/fitness-tracker",
            appStoreUrl: "https://apps.apple.com/app/fitness-tracker-plus",
            playStoreUrl: "https://play.google.com/store/apps/details?id=com.fitnesstracker",
            screenshots: [
                "assets/apps/app2-1.jpg",
                "assets/apps/app2-2.jpg",
                "assets/apps/app2-3.jpg"
            ]
        },
        {
            id: 3,
            name: "Social Connect",
            overview: "Modern social media platform with focus on meaningful connections",
            description: "A fresh approach to social networking that prioritizes genuine connections over algorithms. Share moments, join communities, and connect with like-minded people in a positive environment.",
            image: "assets/apps/app3.jpg",
            category: "Social Media",
            rating: 4.5,
            status: "Live",
            launchDate: "2024-02-14",
            developmentTime: "6 months",
            downloadCount: "100K+",
            platform: "Cross-Platform",
            technologies: ["React Native", "GraphQL", "AWS"],
            features: [
                "Profile customization",
                "Community groups",
                "Private messaging",
                "Content sharing",
                "Event planning",
                "Interest matching",
                "Privacy controls"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/social-connect",
            appStoreUrl: "https://apps.apple.com/app/social-connect",
            playStoreUrl: "https://play.google.com/store/apps/details?id=com.socialconnect",
            screenshots: [
                "assets/apps/app3-1.jpg",
                "assets/apps/app3-2.jpg",
                "assets/apps/app3-3.jpg"
            ]
        },
        {
            id: 4,
            name: "E-Commerce Mobile",
            overview: "Mobile shopping app with AR product preview and instant checkout",
            description: "Revolutionize your shopping experience with augmented reality product previews, personalized recommendations, and seamless checkout process. Shop smarter with our intelligent mobile platform.",
            image: "assets/apps/app4.jpg",
            category: "E-commerce",
            rating: 4.9,
            status: "In Development",
            launchDate: "2024-05-01",
            developmentTime: "7 months",
            downloadCount: "Coming Soon",
            platform: "iOS & Android",
            technologies: ["Swift", "Kotlin", "ARKit", "ARCore"],
            features: [
                "AR product preview",
                "Personalized recommendations",
                "One-tap checkout",
                "Wishlist sharing",
                "Price tracking",
                "Loyalty program",
                "Live support"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/ecommerce-mobile",
            appStoreUrl: "#",
            playStoreUrl: "#",
            screenshots: [
                "assets/apps/app4-1.jpg",
                "assets/apps/app4-2.jpg",
                "assets/apps/app4-3.jpg"
            ]
        }
    ],

    // Testimonials Data
    testimonials: [
        {
            id: 1,
            clientName: "Sarah Johnson",
            clientRole: "CEO, TechStart Inc.",
            projectType: "Website",
            projectName: "E-Commerce Pro",
            rating: 5,
            testimonialText: "Arsh delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise transformed our online business. The platform has increased our sales by 40% and customer satisfaction is at an all-time high.",
            date: "2024-01-15",
            avatar: "assets/testimonials/client1.jpg"
        },
        {
            id: 2,
            clientName: "Mike Chen",
            clientRole: "Game Director, Pixel Studios",
            projectType: "Game",
            projectName: "Epic Adventure Quest",
            rating: 5,
            testimonialText: "Working with Arsh on our flagship RPG was a game-changer. His Unity expertise and creative problem-solving helped us overcome technical challenges and deliver a polished, engaging game that players love. Highly recommended!",
            date: "2023-12-08",
            avatar: "assets/testimonials/client2.jpg"
        },
        {
            id: 3,
            clientName: "Emily Rodriguez",
            clientRole: "Product Manager, HealthPlus",
            projectType: "App",
            projectName: "Fitness Tracker Plus",
            rating: 4,
            testimonialText: "Arsh developed our fitness app with precision and care. The user experience is seamless, and the technical implementation is robust. Our users love the app's features and reliability. Great work!",
            date: "2024-02-20",
            avatar: "assets/testimonials/client3.jpg"
        },
        {
            id: 4,
            clientName: "David Thompson",
            clientRole: "CTO, BusinessSolutions",
            projectType: "Website",
            projectName: "SaaS Business Platform",
            rating: 5,
            testimonialText: "The SaaS platform Arsh built for us is technically excellent and scalable. His ability to understand complex business requirements and translate them into elegant solutions is impressive. We're already planning our next project with him.",
            date: "2024-01-30",
            avatar: "assets/testimonials/client4.jpg"
        },
        {
            id: 5,
            clientName: "Lisa Wang",
            clientRole: "Founder, FoodExpress",
            projectType: "Website",
            projectName: "Food Delivery Service",
            rating: 4,
            testimonialText: "Arsh is currently developing our food delivery platform and the progress has been outstanding. His communication is excellent, and he consistently delivers quality work ahead of schedule. Excited to launch soon!",
            date: "2024-03-10",
            avatar: "assets/testimonials/client5.jpg"
        },
        {
            id: 6,
            clientName: "Alex Kumar",
            clientRole: "Studio Head, DreamGames",
            projectType: "Game",
            projectName: "Neon Racer X",
            rating: 5,
            testimonialText: "Arsh's work on our racing game was phenomenal. The performance optimization and visual effects he implemented took the game to a whole new level. Players are loving the smooth gameplay and stunning graphics.",
            date: "2023-11-18",
            avatar: "assets/testimonials/client6.jpg"
        }
    ]
};

// Local Storage Management
const STORAGE_KEYS = {
    CONTACTS: 'portfolio_contacts',
    TESTIMONIALS: 'portfolio_testimonials',
    THEME: 'portfolio_theme',
    ANALYTICS: 'portfolio_analytics'
};

// Initialize local storage data
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(PORTFOLIO_DATA.testimonials));
    }
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
        const initialAnalytics = {
            pageViews: 1250,
            contactSubmissions: 45,
            averageSession: '4m 30s',
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(initialAnalytics));
    }
}

// Contact Form Management
function saveContact(formData) {
    const contacts = getContacts();
    const newContact = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString(),
        status: 'unread',
        important: false
    };
    contacts.unshift(newContact);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    updateAnalytics('contactSubmissions');
    return newContact;
}

function getContacts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
}

function updateContactStatus(contactId, updates) {
    const contacts = getContacts();
    const contactIndex = contacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
        contacts[contactIndex] = { ...contacts[contactIndex], ...updates };
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
        return true;
    }
    return false;
}

function deleteContact(contactId) {
    const contacts = getContacts();
    const filteredContacts = contacts.filter(contact => contact.id !== contactId);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filteredContacts));
    return filteredContacts.length !== contacts.length;
}

// Testimonials Management
function getTestimonials() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]');
}

function addTestimonial(testimonialData) {
    const testimonials = getTestimonials();
    const newTestimonial = {
        id: Date.now(),
        ...testimonialData,
        date: new Date().toISOString(),
        approved: false
    };
    testimonials.unshift(newTestimonial);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    return newTestimonial;
}

function approveTestimonial(testimonialId) {
    const testimonials = getTestimonials();
    const testimonialIndex = testimonials.findIndex(t => t.id === testimonialId);
    if (testimonialIndex !== -1) {
        testimonials[testimonialIndex].approved = true;
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
        return true;
    }
    return false;
}

// Analytics Management
function getAnalytics() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '{}');
}

function updateAnalytics(type, value = 1) {
    const analytics = getAnalytics();
    if (type === 'pageViews') {
        analytics.pageViews = (analytics.pageViews || 0) + value;
    } else if (type === 'contactSubmissions') {
        analytics.contactSubmissions = (analytics.contactSubmissions || 0) + value;
    }
    analytics.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
    return analytics;
}

// Theme Management
function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}

function setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
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

// Filter and Sort Functions
function filterItems(items, filters) {
    return items.filter(item => {
        if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
            return false;
        }
        if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
            return false;
        }
        if (filters.platform && filters.platform !== 'all' && item.platform !== filters.platform) {
            return false;
        }
        if (filters.rating && item.rating < parseFloat(filters.rating)) {
            return false;
        }
        return true;
    });
}

function sortItems(items, sortBy) {
    const sortedItems = [...items];
    switch (sortBy) {
        case 'newest':
            return sortedItems.sort((a, b) => new Date(b.releaseDate || b.launchDate) - new Date(a.releaseDate || a.launchDate));
        case 'oldest':
            return sortedItems.sort((a, b) => new Date(a.releaseDate || a.launchDate) - new Date(b.releaseDate || b.launchDate));
        case 'rating':
            return sortedItems.sort((a, b) => b.rating - a.rating);
        case 'popular':
            return sortedItems.sort((a, b) => (b.playCount || b.downloadCount || b.userBase) - (a.playCount || a.downloadCount || a.userBase));
        case 'users':
            return sortedItems.sort((a, b) => parseInt(b.userBase) - parseInt(a.userBase));
        default:
            return sortedItems;
    }
}

// Initialize storage when script loads
initializeStorage();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PORTFOLIO_DATA,
        STORAGE_KEYS,
        initializeStorage,
        saveContact,
        getContacts,
        updateContactStatus,
        deleteContact,
        getTestimonials,
        addTestimonial,
        approveTestimonial,
        getAnalytics,
        updateAnalytics,
        getTheme,
        setTheme,
        formatDate,
        getRelativeTime,
        generateStars,
        filterItems,
        sortItems
    };
}