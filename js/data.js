// ==========================================
// PORTFOLIO DATA - Complete Dataset
// All games, websites, apps, and testimonials
// ==========================================

// In data.js, make sure all portfolio items have complete data
const PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: "Epic Adventure Quest",
            overview: "An immersive action RPG with stunning visuals and engaging gameplay",
            description: "Embark on an epic journey through mystical lands, battling fearsome creatures and uncovering ancient secrets.",
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
                "Multiplayer support"
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
            description: "Experience the thrill of high-speed racing in a neon-lit futuristic world.",
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
                "Leaderboards"
            ],
            technologies: ["Unity", "C#", "Substance Painter", "FMOD"],
            repositoryUrl: "https://github.com/ArshVermaGit/neon-racer-x",
            playUrl: "games/neon-racer-x/index.html",
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
            name: "E-Commerce Pro",
            overview: "Modern e-commerce platform with advanced features and seamless UX",
            description: "A full-featured e-commerce solution built with modern web technologies.",
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
                "User accounts"
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
            overview: "Comprehensive health tracking and wellness platform",
            description: "A modern health platform for tracking wellness metrics and connecting with healthcare providers.",
            image: "assets/websites/website2.jpg",
            category: "Health & Wellness",
            rating: 4.7,
            status: "Live",
            launchDate: "2023-06-15",
            developmentTime: "5 months",
            userBase: "25K+",
            technologies: ["Vue.js", "Express", "PostgreSQL", "Firebase"],
            features: [
                "Health tracking",
                "Appointment scheduling",
                "Progress analytics",
                "Community features"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/health-wellness-hub",
            liveUrl: "https://healthhub.example.com",
            screenshots: [
                "assets/websites/website2-1.jpg",
                "assets/websites/website2-2.jpg",
                "assets/websites/website2-3.jpg"
            ]
        }
    ],

    apps: [
        {
            id: 1,
            name: "Productivity Pro",
            overview: "All-in-one productivity app for task management and time tracking",
            description: "A comprehensive productivity app that helps you organize tasks, track time, set goals, and boost your efficiency.",
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
                "Progress analytics"
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
            name: "Fitness Tracker Pro",
            overview: "Advanced fitness tracking and workout planning application",
            description: "Track your workouts, set fitness goals, and monitor your progress with this intuitive fitness app.",
            image: "assets/apps/app2.jpg",
            category: "Health & Fitness",
            rating: 4.6,
            status: "Live",
            launchDate: "2023-08-20",
            developmentTime: "3 months",
            downloadCount: "25K+",
            platform: "iOS & Android",
            technologies: ["Flutter", "Firebase", "Dart"],
            features: [
                "Workout tracking",
                "Goal setting",
                "Progress charts",
                "Exercise library"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/fitness-tracker-pro",
            appStoreUrl: "https://apps.apple.com/app/fitness-tracker-pro",
            playStoreUrl: "https://play.google.com/store/apps/details?id=com.fitnesstrackerpro",
            screenshots: [
                "assets/apps/app2-1.jpg",
                "assets/apps/app2-2.jpg",
                "assets/apps/app2-3.jpg"
            ]
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
            testimonialText: "Arsh delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise transformed our online business.",
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
            testimonialText: "The fitness app developed by Arsh has been instrumental in our company's growth. The user experience is seamless and the performance is outstanding.",
            date: "2024-02-10",
            avatar: "assets/testimonials/client2.jpg",
            approved: true
        }
    ]
};

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

// Make data globally available
window.PORTFOLIO_DATA = PORTFOLIO_DATA;
window.formatDate = formatDate;
window.generateStars = generateStars;