// ============================================
// PORTFOLIO DATA MANAGEMENT
// ============================================

// Portfolio data structure
const PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: "Cyber Runner 2077",
            category: "Action",
            overview: "Futuristic parkour adventure in a cyberpunk metropolis",
            description: "Experience the thrill of free-running in a beautifully crafted cyberpunk world. Navigate through neon-lit skyscrapers, evade corporate security, and uncover the secrets of the megacorporation controlling the city.",
            rating: 4.8,
            playCount: 125000,
            launchDate: "2024-01-15",
            developmentTime: "6 months",
            status: "Live",
            image: "assets/images/cyber-runner.jpg",
            url: "games/cyber-runner/index.html",
            repositoryUrl: "https://github.com/ArshVermaGit/cyber-runner",
            technologies: ["Unity", "C#", "HLSL", "Blender", "Substance Painter"],
            features: [
                "Advanced parkour movement system",
                "Dynamic weather and day-night cycle",
                "Procedurally generated city elements",
                "Multiple character customization options",
                "Online leaderboards and achievements"
            ],
            screenshots: [
                "assets/screenshots/cyber-runner-1.jpg",
                "assets/screenshots/cyber-runner-2.jpg",
                "assets/screenshots/cyber-runner-3.jpg"
            ]
        },
        {
            id: 2,
            name: "Mystic Realms",
            category: "RPG",
            overview: "Epic fantasy RPG with deep storytelling and strategic combat",
            description: "Embark on an unforgettable journey through magical realms filled with ancient mysteries, powerful artifacts, and formidable foes. Your choices shape the world and determine the fate of kingdoms.",
            rating: 4.9,
            playCount: 89000,
            launchDate: "2023-11-20",
            developmentTime: "9 months",
            status: "Live",
            image: "assets/images/mystic-realms.jpg",
            url: "games/mystic-realms/index.html",
            repositoryUrl: "https://github.com/ArshVermaGit/mystic-realms",
            technologies: ["Unreal Engine 5", "C++", "Blueprints", "Maya", "ZBrush"],
            features: [
                "Branching narrative with multiple endings",
                "Real-time tactical combat system",
                "Extensive skill trees and character progression",
                "Dynamic world events and NPC relationships",
                "Mod support and content creation tools"
            ],
            screenshots: [
                "assets/screenshots/mystic-realms-1.jpg",
                "assets/screenshots/mystic-realms-2.jpg",
                "assets/screenshots/mystic-realms-3.jpg"
            ]
        },
        {
            id: 3,
            name: "Quantum Drift",
            category: "Racing",
            overview: "High-speed anti-gravity racing with quantum mechanics",
            description: "Push the limits of physics in this futuristic racing experience. Master quantum drifting, manipulate time, and compete in interstellar championships across breathtaking alien landscapes.",
            rating: 4.7,
            playCount: 156000,
            launchDate: "2024-03-10",
            developmentTime: "7 months",
            status: "Live",
            image: "assets/images/quantum-drift.jpg",
            url: "games/quantum-drift/index.html",
            repositoryUrl: "https://github.com/ArshVermaGit/quantum-drift",
            technologies: ["Unity", "C#", "Shader Graph", "Houdini", "FMOD"],
            features: [
                "Advanced physics-based vehicle handling",
                "Time manipulation and rewind mechanics",
                "Dynamic track deformation and destruction",
                "Multiplayer racing with cross-platform support",
                "VR compatibility and motion controller support"
            ],
            screenshots: [
                "assets/screenshots/quantum-drift-1.jpg",
                "assets/screenshots/quantum-drift-2.jpg",
                "assets/screenshots/quantum-drift-3.jpg"
            ]
        }
    ],
    
    websites: [
        {
            id: 1,
            name: "ReelSpot",
            category: "Media Downloader",
            overview: "Modern e-commerce platform with AI-powered recommendations",
            description: "A cutting-edge e-commerce solution featuring personalized shopping experiences, advanced inventory management, and seamless payment integration. Built with scalability and user experience at its core.",
            rating: 4.8,
            playCount: 45000,
            launchDate: "2024-02-01",
            developmentTime: "5 months",
            status: "Live",
            image: "images/websites/ReelSpot.jpg",
            url: "https://arshvermagit.github.io/REELSPOT/",
            repositoryUrl: "https://github.com/ArshVermaGit/REELSPOT",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
            features: [
                "AI-powered product recommendations",
                "Real-time inventory tracking",
                "Multi-vendor marketplace support",
                "Advanced analytics dashboard",
                "Progressive Web App capabilities"
            ]
        }
        
    ],
    
    apps: [
        {
            id: 1,
            name: "TaskFlow Pro",
            category: "Productivity",
            overview: "Intelligent task management with AI assistance",
            description: "Transform your productivity with smart task management, automated scheduling, and intelligent prioritization. TaskFlow Pro learns your work patterns to optimize your daily workflow.",
            rating: 4.8,
            playCount: 125000,
            launchDate: "2024-02-20",
            developmentTime: "5 months",
            status: "Live",
            platform: "Cross-Platform",
            image: "assets/images/taskflow-pro.jpg",
            appStoreUrl: "https://apps.apple.com/app/taskflow-pro",
            playStoreUrl: "https://play.google.com/store/apps/details?id=com.arshcreates.taskflowpro",
            repositoryUrl: "https://github.com/ArshVermaGit/taskflow-pro",
            technologies: ["React Native", "Firebase", "TensorFlow", "Redux", "Expo"],
            features: [
                "AI-powered task prioritization",
                "Natural language task input",
                "Cross-device synchronization",
                "Team collaboration features",
                "Advanced analytics and insights"
            ],
            screenshots: [
                "assets/screenshots/taskflow-1.jpg",
                "assets/screenshots/taskflow-2.jpg",
                "assets/screenshots/taskflow-3.jpg"
            ]
        },
        {
            id: 2,
            name: "FitTrack AI",
            category: "Health & Fitness",
            overview: "Personalized fitness coaching with computer vision",
            description: "Get personalized workout plans and real-time form correction using advanced computer vision. FitTrack AI acts as your personal trainer, adapting to your progress and goals.",
            rating: 4.9,
            playCount: 89000,
            launchDate: "2023-11-10",
            developmentTime: "7 months",
            status: "Live",
            platform: "iOS",
            image: "assets/images/fittrack-ai.jpg",
            appStoreUrl: "https://apps.apple.com/app/fittrack-ai",
            repositoryUrl: "https://github.com/ArshVermaGit/fittrack-ai",
            technologies: ["Swift", "Core ML", "ARKit", "HealthKit", "Firebase"],
            features: [
                "Real-time exercise form analysis",
                "Personalized workout plans",
                "Progress tracking and analytics",
                "Integration with Apple Health",
                "Social challenges and leaderboards"
            ],
            screenshots: [
                "assets/screenshots/fittrack-1.jpg",
                "assets/screenshots/fittrack-2.jpg",
                "assets/screenshots/fittrack-3.jpg"
            ]
        },
        {
            id: 3,
            name: "SocialSphere",
            category: "Social Media",
            overview: "Privacy-focused social networking platform",
            description: "Connect with friends and communities while maintaining full control over your data. SocialSphere offers ad-free experience, end-to-end encryption, and transparent algorithms.",
            rating: 4.7,
            playCount: 156000,
            launchDate: "2024-01-05",
            developmentTime: "8 months",
            status: "Live",
            platform: "Android",
            image: "assets/images/socialsphere.jpg",
            playStoreUrl: "https://play.google.com/store/apps/details?id=com.arshcreates.socialsphere",
            repositoryUrl: "https://github.com/ArshVermaGit/socialsphere",
            technologies: ["Kotlin", "Jetpack Compose", "Room", "WebRTC", "AWS"],
            features: [
                "End-to-end encrypted messaging",
                "Algorithm transparency and control",
                "Zero advertising model",
                "Community moderation tools",
                "Cross-platform compatibility"
            ],
            screenshots: [
                "assets/screenshots/socialsphere-1.jpg",
                "assets/screenshots/socialsphere-2.jpg",
                "assets/screenshots/socialsphere-3.jpg"
            ]
        }
    ],
    
    testimonials: [
        {
            id: 1,
            clientName: "Sarah Johnson",
            clientRole: "CEO, TechInnovate Inc.",
            projectType: "Website",
            projectName: "Nexus E-Commerce",
            rating: 5,
            text: "Arsh delivered an exceptional e-commerce platform that exceeded our expectations. The attention to detail and user experience focus resulted in a 40% increase in conversions. Highly recommended!",
            date: "2024-02-15"
        },
        {
            id: 2,
            clientName: "Michael Chen",
            clientRole: "Game Director, PixelForge Studios",
            projectType: "Game",
            projectName: "Cyber Runner 2077",
            rating: 5,
            text: "Working with Arsh on Cyber Runner was a game-changer. His technical expertise and creative vision brought our cyberpunk world to life in ways we never imagined possible.",
            date: "2024-01-20"
        },
        {
            id: 3,
            clientName: "Dr. Emily Rodriguez",
            clientRole: "Medical Director, HealthFirst Clinic",
            projectType: "App",
            projectName: "HealthSync Pro",
            rating: 4.5,
            text: "The healthcare management app developed by Arsh has revolutionized our clinic operations. It's intuitive, reliable, and has significantly improved patient care coordination.",
            date: "2023-12-10"
        },
        {
            id: 4,
            clientName: "David Thompson",
            clientRole: "Product Manager, FlowSpace",
            projectType: "Website",
            projectName: "FlowSpace SaaS",
            rating: 4.8,
            text: "Arsh's ability to understand complex requirements and translate them into elegant solutions is remarkable. The SaaS platform he built has become essential for our remote teams.",
            date: "2024-02-28"
        },
        {
            id: 5,
            clientName: "Lisa Wang",
            clientRole: "Fitness Entrepreneur",
            projectType: "App",
            projectName: "FitTrack AI",
            rating: 5,
            text: "The AI-powered fitness app developed by Arsh is groundbreaking. The computer vision technology for form correction is incredibly accurate and has helped thousands of users.",
            date: "2023-11-25"
        }
    ]
};

// Initialize data in localStorage if not present
function initializePortfolioData() {
    if (!localStorage.getItem('portfolioData')) {
        localStorage.setItem('portfolioData', JSON.stringify(PORTFOLIO_DATA));
    }
    
    // Initialize contacts array if not present
    if (!localStorage.getItem('portfolioContacts')) {
        localStorage.setItem('portfolioContacts', JSON.stringify([]));
    }
}

// Get data from localStorage
function getPortfolioData() {
    const storedData = localStorage.getItem('portfolioData');
    return storedData ? JSON.parse(storedData) : PORTFOLIO_DATA;
}

// Update data in localStorage
function updatePortfolioData(newData) {
    localStorage.setItem('portfolioData', JSON.stringify(newData));
}

// Get item by ID from any category
function getItemById(category, id) {
    const data = getPortfolioData();
    return data[category]?.find(item => item.id === id) || null;
}

// Get all items from a category
function getItemsByCategory(category) {
    const data = getPortfolioData();
    return data[category] || [];
}

// Add new testimonial
function addTestimonial(testimonial) {
    const data = getPortfolioData();
    testimonial.id = Date.now(); // Simple ID generation
    data.testimonials.unshift(testimonial);
    updatePortfolioData(data);
    return testimonial;
}

// Add new contact submission
function addContactSubmission(contact) {
    const contacts = JSON.parse(localStorage.getItem('portfolioContacts') || '[]');
    contact.id = Date.now();
    contact.timestamp = new Date().toISOString();
    contact.read = false;
    contacts.unshift(contact);
    localStorage.setItem('portfolioContacts', JSON.stringify(contacts));
    return contact;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize data when script loads
initializePortfolioData();

// Make functions available globally
window.PORTFOLIO_DATA = getPortfolioData();
window.getItemById = getItemById;
window.getItemsByCategory = getItemsByCategory;
window.addTestimonial = addTestimonial;
window.addContactSubmission = addContactSubmission;
window.formatDate = formatDate;