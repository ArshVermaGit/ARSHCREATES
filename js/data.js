// ============================================
// PORTFOLIO DATA MANAGEMENT
// ============================================

// Portfolio data structure
const PORTFOLIO_DATA = {
    games: [
        {
            id: 1,
            name: "Cyber Runner 2077",
            category: "Action RPG",
            overview: "Futuristic parkour adventure in a cyberpunk metropolis",
            description: "Experience the thrill of free-running in a beautifully crafted cyberpunk world. Navigate through neon-lit skyscrapers, evade corporate security, and uncover the secrets of the megacorporation controlling the city.",
            rating: 4.8,
            playCount: 125000,
            likes: 8900,
            launchDate: "2024-01-15",
            developmentTime: "6 months",
            status: "Live",
            image: "images/games/cyber-runner.jpg",
            gameFile: "games/cyber-runner/index.html",
            repositoryUrl: "https://github.com/ArshVermaGit/cyber-runner",
            technologies: ["Unity", "C#", "HLSL", "Blender", "Substance Painter"],
            features: [
                "Advanced parkour movement system",
                "Dynamic weather and day-night cycle",
                "Procedurally generated city elements",
                "Multiple character customization options",
                "Online leaderboards and achievements"
            ],
            platforms: ["WebGL", "PC"],
            teamSize: 3,
            screenshots: [
                "images/games/cyber-runner-1.jpg",
                "images/games/cyber-runner-2.jpg",
                "images/games/cyber-runner-3.jpg"
            ]
        },
        {
            id: 2,
            name: "Sky Surfers",
            category: "Racing",
            overview: "High-speed aerial racing game with stunning visuals",
            description: "Soar through breathtaking skies in this high-octane aerial racing game. Master advanced flying mechanics and compete in global tournaments.",
            rating: 4.7,
            playCount: 89000,
            likes: 5600,
            launchDate: "2024-03-20",
            developmentTime: "5 months",
            status: "Live",
            image: "images/games/sky-surfers.jpg",
            gameFile: "games/sky-surfers/index.html",
            repositoryUrl: "https://github.com/ArshVermaGit/sky-surfers",
            technologies: ["Unity", "C#", "Shader Graph"],
            features: [
                "Advanced aerial physics",
                "Multiple game modes",
                "Global leaderboards",
                "Customizable aircraft",
                "Dynamic weather system"
            ],
            platforms: ["WebGL"],
            teamSize: 2,
            screenshots: [
                "images/games/sky-surfers-1.jpg",
                "images/games/sky-surfers-2.jpg"
            ]
        }
    ],
    
    websites: [
        {
            id: 1,
            name: "ReelSpot",
            category: "Media Downloader",
            overview: "Modern social media video downloader with premium features",
            description: "A cutting-edge web application that allows users to download videos from various social media platforms with high quality and fast processing speeds.",
            rating: 4.8,
            monthlyUsers: 45000,
            launchDate: "2024-02-01",
            developmentTime: "5 months",
            status: "Live",
            image: "images/websites/reelspot.jpg",
            url: "https://arshvermagit.github.io/REELSPOT/",
            repositoryUrl: "https://github.com/ArshVermaGit/REELSPOT",
            technologies: ["HTML5", "CSS3", "JavaScript", "FFmpeg", "Node.js"],
            features: [
                "Support for multiple platforms",
                "High-quality video downloads",
                "Fast processing speeds",
                "User-friendly interface",
                "No watermark downloads"
            ],
            userBase: "45K+ Users"
        },
        {
            id: 2,
            name: "Portfolio Website",
            category: "Portfolio",
            overview: "Modern responsive portfolio website",
            description: "A fully responsive portfolio website showcasing my projects and skills with modern design and smooth animations.",
            rating: 4.9,
            monthlyUsers: 1000,
            launchDate: "2024-01-10",
            developmentTime: "3 months",
            status: "Live",
            image: "images/websites/portfolio.jpg",
            url: "https://arshverma.com",
            repositoryUrl: "https://github.com/ArshVermaGit/portfolio",
            technologies: ["HTML5", "CSS3", "JavaScript", "GSAP"],
            features: [
                "Fully responsive design",
                "Smooth animations",
                "Dark/Light mode",
                "Project filtering",
                "Contact form"
            ],
            userBase: "1K+ Visitors"
        }
    ],
    
    apps: [
        {
            id: 1,
            name: "FocusFlow",
            category: "Productivity",
            overview: "AI-Powered Productivity & Focus Assistant",
            description: "FocusFlow is an AI-powered productivity app that helps you manage your time, eliminate distractions, and achieve your goals with intelligent task prioritization and focus tracking.",
            rating: 4.9,
            downloads: 150000,
            activeUsers: 45000,
            launchDate: "2024-03-15",
            developmentTime: "6 months",
            status: "Live",
            platform: "iOS",
            image: "images/apps/focusflow.jpg",
            appStoreUrl: "https://apps.apple.com/app/focusflow",
            playStoreUrl: "",
            repositoryUrl: "https://github.com/ArshVermaGit/focusflow",
            technologies: ["Swift", "Core Data", "CloudKit", "Core ML"],
            features: [
                "AI Task Prioritization",
                "Smart Focus Timer",
                "Productivity Analytics",
                "Distraction Blocking",
                "Cross-Device Sync"
            ],
            screenshots: [
                "images/apps/focusflow-1.jpg",
                "images/apps/focusflow-2.jpg",
                "images/apps/focusflow-3.jpg"
            ]
        }
    ],
    
    testimonials: [
        {
            id: 1,
            clientName: "Sarah Johnson",
            clientRole: "CEO, TechInnovate Inc.",
            projectType: "Website",
            projectName: "ReelSpot",
            rating: 5,
            text: "Arsh delivered an exceptional web application that exceeded our expectations. The attention to detail and user experience focus resulted in a 40% increase in user engagement. His technical expertise and professional approach made the entire development process smooth and efficient.",
            date: "2024-02-15",
            verified: true,
            clientType: "enterprise"
        },
        {
            id: 2,
            clientName: "Alex Thompson",
            clientRole: "Game Director, Playful Studios",
            projectType: "Game",
            projectName: "Cyber Runner 2077",
            rating: 4,
            text: "Arsh delivered a polished game that exceeded our technical requirements. Great communication throughout the project and a solid understanding of game development principles.",
            date: "2024-01-20",
            verified: true,
            clientType: "agency"
        }
    ]
};

// Data management functions
function initializePortfolioData() {
    if (!localStorage.getItem('portfolioData')) {
        localStorage.setItem('portfolioData', JSON.stringify(PORTFOLIO_DATA));
    }
    if (!localStorage.getItem('portfolioContacts')) {
        localStorage.setItem('portfolioContacts', JSON.stringify([]));
    }
}

function getPortfolioData() {
    const storedData = localStorage.getItem('portfolioData');
    return storedData ? JSON.parse(storedData) : PORTFOLIO_DATA;
}

function updatePortfolioData(newData) {
    localStorage.setItem('portfolioData', JSON.stringify(newData));
}

function getItemById(category, id) {
    const data = getPortfolioData();
    const item = data[category]?.find(item => item.id === parseInt(id));
    return item || null;
}

function getItemsByCategory(category) {
    const data = getPortfolioData();
    return data[category] || [];
}

function getPrevItem(category, currentId) {
    const items = getItemsByCategory(category);
    const currentIndex = items.findIndex(item => item.id === parseInt(currentId));
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    return items[prevIndex] || items[0];
}

function getNextItem(category, currentId) {
    const items = getItemsByCategory(category);
    const currentIndex = items.findIndex(item => item.id === parseInt(currentId));
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    return items[nextIndex] || items[0];
}

function addTestimonial(testimonial) {
    const data = getPortfolioData();
    if (!data.testimonials) data.testimonials = [];
    testimonial.id = Date.now();
    data.testimonials.unshift(testimonial);
    updatePortfolioData(data);
    return testimonial;
}

function addContactSubmission(contact) {
    const contacts = JSON.parse(localStorage.getItem('portfolioContacts') || '[]');
    contact.id = Date.now();
    contact.timestamp = new Date().toISOString();
    contact.read = false;
    contacts.unshift(contact);
    localStorage.setItem('portfolioContacts', JSON.stringify(contacts));
    return contact;
}

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
window.getPrevItem = getPrevItem;
window.getNextItem = getNextItem;