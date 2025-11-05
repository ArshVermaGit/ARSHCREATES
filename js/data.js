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
            image: "images/games/Game1.jpg", // Fixed path
            gameFile: "games/sky_surfers/index.html", // Path to your game
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
                "images/games/Game1.jpg",
                "images/games/Game1.jpg",
                "images/games/Game1.jpg"
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
            image: "images/games/Game1.jpg",
            gameFile: "games/sky_surfers/index.html", // Your actual game path
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
                "images/games/Game1.jpg",
                "images/games/Game1.jpg"
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
            playCount: 45000, // Using as user count
            launchDate: "2024-02-01",
            developmentTime: "5 months",
            status: "Live",
            image: "images/websites/ReelSpot.jpg",
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
            playCount: 1000,
            launchDate: "2024-01-10",
            developmentTime: "3 months",
            status: "Live",
            image: "images/websites/ReelSpot.jpg", // Add your image
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
            image: "images/apps/app1.jpg", // Add your app images
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
                "images/apps/screenshot1.jpg",
                "images/apps/screenshot2.jpg",
                "images/apps/screenshot3.jpg"
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
            text: "Arsh delivered an exceptional web application that exceeded our expectations. The attention to detail and user experience focus resulted in a 40% increase in user engagement. Highly recommended!",
            date: "2024-02-15"
        }
    ]
};

// Helper function to get next item ID
function getNextItemId(category) {
    const items = PORTFOLIO_DATA[category];
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Function to add new item
function addPortfolioItem(category, itemData) {
    if (!PORTFOLIO_DATA[category]) {
        PORTFOLIO_DATA[category] = [];
    }
    
    const newItem = {
        id: getNextItemId(category),
        ...itemData,
        timestamp: new Date().toISOString()
    };
    
    PORTFOLIO_DATA[category].push(newItem);
    updatePortfolioData(PORTFOLIO_DATA);
    return newItem;
}

// Function to get previous and next items
function getPrevItem(category, currentId) {
    const items = PORTFOLIO_DATA[category];
    const currentIndex = items.findIndex(item => item.id === currentId);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    return items[prevIndex];
}

function getNextItem(category, currentId) {
    const items = PORTFOLIO_DATA[category];
    const currentIndex = items.findIndex(item => item.id === currentId);
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    return items[nextIndex];
}

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
    return data[category]?.find(item => item.id === parseInt(id)) || null;
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
window.getPrevItem = getPrevItem;
window.getNextItem = getNextItem;
window.addPortfolioItem = addPortfolioItem;