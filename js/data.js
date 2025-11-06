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
        }
    ],

    // Apps Data
    // In data.js, update the apps array to ensure all fields exist:
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
                "Progress analytics",
                "Cloud sync"
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
        // Add more apps with complete data
        {
            id: 2,
            name: "Fitness Tracker",
            overview: "Comprehensive fitness tracking and workout planning app",
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
                "Exercise library",
                "Social sharing"
            ],
            repositoryUrl: "https://github.com/ArshVermaGit/fitness-tracker",
            appStoreUrl: "https://apps.apple.com/app/fitness-tracker",
            playStoreUrl: "https://play.google.com/store/apps/details?id=com.fitnesstracker",
            screenshots: [
                "assets/apps/app2-1.jpg",
                "assets/apps/app2-2.jpg",
                "assets/apps/app2-3.jpg"
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