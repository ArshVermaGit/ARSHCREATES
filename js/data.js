// Portfolio Data Configuration
const PORTFOLIO_DATA = {
  games: [
    {
      id: 1,
      name: "Sky Surfers",
      category: "Endless Runner",
      overview: "Blast through a narrow canyon at top speed, relying on pure reflexes to dodge everything.",
      description: "Your plane is locked onto a relentless forward speed, and the sheer walls of the valley are closing in fast. Your only job is to weave, bank, and dive to miss the wreckage, rock formations, or other hazards shooting towards you. It's pure reflex action where one wrong twitch means an immediate, fiery stop.",
      image: "images/games/sky-surfers.jpg",
      gameFile: "game_files/sky-surfers/index.html",
      technologies: ["Unity", "C#", "WebGL"],
      rating: 4.8,
      playCount: 12500,
      likes: 890,
      features: [
        "Procedurally generated obstacles",
        "High-speed gameplay mechanics",
        "Score tracking system",
        "Responsive controls"
      ],
      status: "Live"
    },
    {
      id: 2,
      name: "Neon Racer",
      category: "Racing",
      overview: "High-speed futuristic racing with neon aesthetics",
      description: "Experience the thrill of high-speed racing in a cyberpunk world. Customize your vehicle, compete in tournaments, and dominate the leaderboards.",
      image: "images/games/neon-racer.jpg",
      gameFile: "game_files/neon-racer/index.html",
      technologies: ["Unity", "C#", "Shader Graph"],
      rating: 4.6,
      playCount: 8900,
      likes: 654,
      features: [
        "Vehicle customization",
        "Multiple racing tracks",
        "Power-up system",
        "Time trial mode"
      ],
      status: "Live"
    }
  ],

  websites: [
    {
      id: 1,
      name: "E-Commerce Platform",
      category: "E-Commerce",
      overview: "Modern e-commerce solution with advanced features",
      description: "A fully-featured e-commerce platform built with modern technologies. Includes user authentication, payment processing, inventory management, and analytics dashboard.",
      image: "images/websites/ecommerce.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      rating: 4.7,
      features: [
        "Real-time inventory management",
        "Multi-payment gateway support",
        "Admin dashboard with analytics",
        "Mobile-responsive design"
      ],
      status: "Live",
      url: "https://demo-ecommerce.com",
      githubUrl: "https://github.com/arsh/ecommerce-platform"
    },
    {
      id: 2,
      name: "Social Media Dashboard",
      category: "Dashboard",
      overview: "Comprehensive social media analytics and management",
      description: "A powerful dashboard for managing multiple social media accounts. Schedule posts, analyze engagement, and track performance across platforms.",
      image: "images/websites/social-dashboard.jpg",
      technologies: ["Vue.js", "Express", "PostgreSQL", "D3.js"],
      rating: 4.5,
      features: [
        "Multi-platform integration",
        "Advanced analytics charts",
        "Automated post scheduling",
        "Team collaboration tools"
      ],
      status: "Live",
      url: "https://social-dashboard.com",
      githubUrl: "https://github.com/arsh/social-dashboard"
    }
  ],

  apps: [
    {
      id: 1,
      name: "TaskFlow Pro",
      category: "Productivity",
      platform: "Mobile",
      overview: "Intelligent task management with AI assistance",
      description: "A smart task manager that uses artificial intelligence to prioritize your work, suggest optimal schedules, and help you stay focused on what matters most.",
      image: "images/apps/taskflow.jpg",
      icon: "images/apps/taskflow-icon.png",
      technologies: ["React Native", "Firebase", "TensorFlow"],
      rating: 4.8,
      downloads: "50K+",
      users: "45K+",
      price: "Free",
      features: [
        "AI-powered task prioritization",
        "Cross-platform sync",
        "Team collaboration",
        "Advanced analytics"
      ],
      status: "Live",
      appStoreUrl: "https://apps.apple.com/taskflow",
      playStoreUrl: "https://play.google.com/taskflow",
      webUrl: "https://taskflow.com"
    },
    {
      id: 2,
      name: "HealthTrack",
      category: "Health & Fitness",
      platform: "Mobile",
      overview: "Comprehensive health monitoring and fitness tracking",
      description: "Track your fitness journey with detailed analytics, personalized workout plans, and integration with popular health devices and apps.",
      image: "images/apps/healthtrack.jpg",
      icon: "images/apps/healthtrack-icon.png",
      technologies: ["Flutter", "Node.js", "MongoDB"],
      rating: 4.6,
      downloads: "35K+",
      users: "30K+",
      price: "Freemium",
      features: [
        "Wearable device integration",
        "Personalized workout plans",
        "Nutrition tracking",
        "Progress visualization"
      ],
      status: "Live",
      appStoreUrl: "https://apps.apple.com/healthtrack",
      playStoreUrl: "https://play.google.com/healthtrack",
      webUrl: "https://healthtrack.com"
    }
  ]
};

// Utility Functions
function getItemById(category, id) {
  return PORTFOLIO_DATA[category]?.find(item => item.id == id);
}

function getAllItems(category) {
  return PORTFOLIO_DATA[category] || [];
}

function getNextItem(category, currentId) {
  const items = PORTFOLIO_DATA[category];
  const currentIndex = items.findIndex(item => item.id == currentId);
  const nextIndex = (currentIndex + 1) % items.length;
  return items[nextIndex];
}

function getPrevItem(category, currentId) {
  const items = PORTFOLIO_DATA[category];
  const currentIndex = items.findIndex(item => item.id == currentId);
  const prevIndex = (currentIndex - 1 + items.length) % items.length;
  return items[prevIndex];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PORTFOLIO_DATA, getItemById, getAllItems, getNextItem, getPrevItem };
}