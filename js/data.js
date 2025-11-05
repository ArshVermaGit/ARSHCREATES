// ============================================
// PORTFOLIO DATA CONFIGURATION
// ============================================

window.PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: "Cosmic Adventure",
            category: "Action RPG",
            overview: "An epic space exploration game with stunning visuals and immersive gameplay.",
            description: "Embark on an interstellar journey through uncharted galaxies in this action-packed RPG. Explore diverse planets, battle alien creatures, and uncover ancient cosmic secrets. With stunning visuals, immersive sound design, and engaging storyline, Cosmic Adventure offers hours of captivating gameplay.",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            gameFile: "games/cosmic-adventure/index.html",
            technologies: ["Unity", "C#", "Blender", "Photoshop", "FMOD"],
            rating: 4.8,
            playCount: 12500,
            likes: 890,
            features: [
                "Open World Exploration",
                "Multiplayer Support",
                "VR Compatibility",
                "Dynamic Weather System",
                "Advanced AI Enemies",
                "Customizable Spaceships",
                "Procedural Generation"
            ],
            status: "Live",
            releaseDate: "2023-11-15",
            developmentTime: "6 months",
            teamSize: 3,
            platforms: ["PC", "PlayStation", "Xbox"]
        },
        {
            id: 2,
            name: "Pixel Quest",
            category: "Platformer",
            overview: "A retro-style platformer with modern mechanics and challenging levels.",
            description: "Experience the nostalgia of classic platformers with modern enhancements in Pixel Quest. Navigate through meticulously designed levels, defeat pixel-perfect enemies, and collect power-ups in this challenging adventure. Perfect for both retro gaming enthusiasts and new players.",
            image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            gameFile: "games/pixel-quest/index.html",
            technologies: ["Unity", "C#", "Aseprite", "Audacity"],
            rating: 4.6,
            playCount: 8900,
            likes: 654,
            features: [
                "100+ Challenging Levels",
                "Character Customization",
                "Global Leaderboards",
                "Secret Areas",
                "Time Trial Mode",
                "Boss Battles",
                "Achievement System"
            ],
            status: "Live",
            releaseDate: "2023-08-22",
            developmentTime: "4 months",
            teamSize: 2,
            platforms: ["PC", "Mobile", "Switch"]
        },
        {
            id: 3,
            name: "Neon Racer",
            category: "Racing",
            overview: "High-speed futuristic racing with stunning neon visuals and intense competition.",
            description: "Immerse yourself in the cyberpunk world of Neon Racer, where speed meets style. Race through neon-lit cityscapes, customize your high-tech vehicles, and compete against AI or real players in this adrenaline-pumping racing experience.",
            image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            gameFile: "games/neon-racer/index.html",
            technologies: ["Unity", "C#", "Substance Painter", "Wwise"],
            rating: 4.9,
            playCount: 10500,
            likes: 720,
            features: [
                "Multiplayer Racing",
                "Custom Track Creation",
                "VR Support",
                "Vehicle Customization",
                "Dynamic Soundtrack",
                "Weather Effects",
                "Online Tournaments"
            ],
            status: "In Development",
            releaseDate: "2024-03-01",
            developmentTime: "8 months",
            teamSize: 4,
            platforms: ["PC", "VR", "PlayStation"]
        }
    ],

    websites: [
        {
            id: 1,
            name: "EcoMarket",
            category: "E-commerce",
            overview: "Sustainable marketplace connecting eco-conscious consumers with ethical brands.",
            description: "EcoMarket is a comprehensive e-commerce platform dedicated to sustainable living. It connects environmentally conscious consumers with verified ethical brands, offering a seamless shopping experience while promoting eco-friendly products and practices.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
            rating: 4.7,
            features: [
                "Secure Payment Integration",
                "AI Product Recommendations",
                "Mobile-First Design",
                "Real-time Inventory",
                "Multi-vendor Support",
                "Advanced Analytics",
                "Carbon Footprint Tracking"
            ],
            status: "Live",
            url: "https://ecomarket-demo.com",
            githubUrl: "https://github.com/arsh/ecomarket",
            launchDate: "2023-09-10",
            developmentTime: "5 months"
        },
        {
            id: 2,
            name: "Mindful App",
            category: "Health & Wellness",
            overview: "Comprehensive mental wellness platform with meditation and therapy features.",
            description: "Mindful App provides a holistic approach to mental wellness, offering guided meditations, therapy sessions, mood tracking, and community support. Built with privacy and accessibility in mind, it helps users manage stress and improve mental health.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            technologies: ["Vue.js", "Firebase", "Stripe", "Twilio", "Chart.js"],
            rating: 4.9,
            features: [
                "Real-time Video Therapy",
                "Progress Tracking",
                "Community Support",
                "Meditation Library",
                "Mood Journal",
                "Sleep Tracking",
                "Emergency Resources"
            ],
            status: "Live",
            url: "https://mindful-app.com",
            githubUrl: "https://github.com/arsh/mindful-app",
            launchDate: "2023-06-22",
            developmentTime: "6 months"
        },
        {
            id: 3,
            name: "TechFlow",
            category: "SaaS Platform",
            overview: "Project management solution for tech teams with advanced collaboration tools.",
            description: "TechFlow revolutionizes project management for technology teams with its intuitive interface and powerful features. From agile development to resource planning, it streamlines workflows and enhances team collaboration.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            technologies: ["Angular", "Python", "PostgreSQL", "Docker", "Redis"],
            rating: 4.8,
            features: [
                "Real-time Collaboration",
                "Advanced Analytics",
                "API Integration",
                "Custom Workflows",
                "Time Tracking",
                "Resource Management",
                "Automated Reporting"
            ],
            status: "Live",
            url: "https://techflow-saas.com",
            githubUrl: "https://github.com/arsh/techflow",
            launchDate: "2023-11-05",
            developmentTime: "7 months"
        }
    ],

    apps: [
        {
            id: 1,
            name: "FitTrack Pro",
            category: "Health & Fitness",
            platform: "Mobile",
            overview: "Advanced fitness tracking app with AI-powered workout recommendations.",
            description: "FitTrack Pro is your personal fitness companion, offering AI-driven workout plans, nutrition tracking, and progress analytics. Whether you're a beginner or professional athlete, it adapts to your fitness journey.",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            technologies: ["Flutter", "Firebase", "TensorFlow", "HealthKit", "Google Fit"],
            rating: 4.8,
            downloads: "500K+",
            users: "200K+",
            price: "Free (Premium $9.99/month)",
            features: [
                "AI Workout Plans",
                "Social Challenges",
                "Wearable Integration",
                "Nutrition Tracking",
                "Progress Photos",
                "Community Support",
                "Personal Trainer Connect"
            ],
            status: "Live",
            appStoreUrl: "https://apps.apple.com/fittrack-pro",
            playStoreUrl: "https://play.google.com/fittrack-pro",
            webUrl: "https://fittrack-pro.com",
            lastUpdate: "2023-12-01"
        },
        {
            id: 2,
            name: "BudgetWise",
            category: "Finance",
            platform: "Mobile & Web",
            overview: "Intelligent budgeting app that helps users save money and track expenses.",
            description: "Take control of your finances with BudgetWise. This intelligent app analyzes your spending patterns, suggests budgets, and helps you achieve your financial goals through smart insights and automation.",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            technologies: ["React Native", "Node.js", "Plaid API", "MongoDB", "Chart.js"],
            rating: 4.7,
            downloads: "300K+",
            users: "150K+",
            price: "Free",
            features: [
                "Bank Account Integration",
                "AI Spending Insights",
                "Bill Reminders",
                "Investment Tracking",
                "Goal Setting",
                "Receipt Scanning",
                "Multi-currency Support"
            ],
            status: "Live",
            appStoreUrl: "https://apps.apple.com/budgetwise",
            playStoreUrl: "https://play.google.com/budgetwise",
            webUrl: "https://budgetwise.com",
            lastUpdate: "2023-11-15"
        },
        {
            id: 3,
            name: "LearnLingo",
            category: "Education",
            platform: "Mobile",
            overview: "Interactive language learning app with speech recognition and AI tutors.",
            description: "Master new languages with LearnLingo's innovative approach. Featuring AI-powered tutors, speech recognition, and interactive lessons, it makes language learning engaging and effective for all skill levels.",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            technologies: ["Swift", "Kotlin", "Google Cloud", "OpenAI", "Firebase"],
            rating: 4.9,
            downloads: "1M+",
            users: "750K+",
            price: "Freemium",
            features: [
                "Speech Recognition",
                "AI Language Tutor",
                "Offline Mode",
                "Progress Tracking",
                "Cultural Lessons",
                "Live Tutoring",
                "Gamified Learning"
            ],
            status: "Live",
            appStoreUrl: "https://apps.apple.com/learnlingo",
            playStoreUrl: "https://play.google.com/learnlingo",
            webUrl: "https://learnlingo.com",
            lastUpdate: "2023-12-10"
        }
    ],

    testimonials: [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "CEO, TechStart Inc.",
            company: "TechStart Inc.",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            text: "Arsh transformed our mobile app vision into reality. His attention to detail and technical expertise exceeded our expectations. The app has already gained 50K+ downloads in the first month!",
            rating: 5,
            project: "FitTrack Pro",
            projectType: "Mobile App"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Product Manager",
            company: "EcoSolutions",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            text: "Working with Arsh on our e-commerce platform was exceptional. He delivered a scalable, user-friendly solution that boosted our conversion rates by 35%. Highly recommended!",
            rating: 5,
            project: "EcoMarket",
            projectType: "Website"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Game Director",
            company: "Neon Games Studio",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            text: "Arsh's game development skills are outstanding. He brought our vision for Cosmic Adventure to life with incredible attention to gameplay mechanics and visual details.",
            rating: 5,
            project: "Cosmic Adventure",
            projectType: "Game"
        },
        {
            id: 4,
            name: "David Thompson",
            role: "CTO",
            company: "FinanceFlow",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            text: "The BudgetWise app developed by Arsh has revolutionized how our users manage their finances. The AI insights and seamless user experience are remarkable.",
            rating: 5,
            project: "BudgetWise",
            projectType: "Mobile App"
        }
    ]
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getItemById(data, id) {
    return data.find(item => item.id == id);
}

function getAllItems(data) {
    return data || [];
}

function getNextItem(data, currentId) {
    const currentIndex = data.findIndex(item => item.id == currentId);
    const nextIndex = (currentIndex + 1) % data.length;
    return data[nextIndex];
}

function getPrevItem(data, currentId) {
    const currentIndex = data.findIndex(item => item.id == currentId);
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    return data[prevIndex];
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}