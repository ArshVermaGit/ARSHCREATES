// ============================================
// PORTFOLIO DATA CONFIGURATION
// ============================================

const PORTFOLIO_DATA = {
  // Personal Information
  personal: {
    name: "Arsh Verma",
    title: "Full-Stack Developer & UI/UX Designer",
    email: "arsh@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Passionate developer creating innovative digital experiences with cutting-edge technologies and user-centered design principles.",
    avatar: "images/avatar.jpg",
    resume: "files/resume.pdf"
  },

  // Social Links
  social: [
    { name: "GitHub", icon: "fab fa-github", url: "https://github.com/arsh" },
    { name: "LinkedIn", icon: "fab fa-linkedin", url: "https://linkedin.com/in/arsh" },
    { name: "Twitter", icon: "fab fa-twitter", url: "https://twitter.com/arsh" },
    { name: "Dribbble", icon: "fab fa-dribbble", url: "https://dribbble.com/arsh" }
  ],

  // Skills Data
  skills: {
    technical: [
      { name: "JavaScript", level: 95, icon: "fab fa-js" },
      { name: "React", level: 90, icon: "fab fa-react" },
      { name: "Node.js", level: 88, icon: "fab fa-node-js" },
      { name: "Python", level: 85, icon: "fab fa-python" },
      { name: "TypeScript", level: 82, icon: "fas fa-code" },
      { name: "Vue.js", level: 80, icon: "fab fa-vuejs" }
    ],
    tools: [
      { name: "Git", icon: "fab fa-git-alt" },
      { name: "Docker", icon: "fab fa-docker" },
      { name: "Figma", icon: "fab fa-figma" },
      { name: "VS Code", icon: "fas fa-code" },
      { name: "Postman", icon: "fas fa-cube" },
      { name: "MongoDB", icon: "fas fa-database" }
    ],
    soft: [
      { name: "Problem Solving", level: 95 },
      { name: "Communication", level: 90 },
      { name: "Team Leadership", level: 88 },
      { name: "Project Management", level: 85 },
      { name: "Creativity", level: 92 },
      { name: "Adaptability", level: 90 }
    ],
    certifications: [
      { name: "AWS Certified Developer", issuer: "Amazon", year: 2023 },
      { name: "Google UX Design Professional", issuer: "Google", year: 2023 },
      { name: "React Native Certification", issuer: "Meta", year: 2022 }
    ]
  },

  // Games Portfolio
  games: [
    {
      id: 1,
      name: "Sky Surfers",
      category: "Endless Runner",
      overview: "Blast through a narrow canyon at top speed, relying on pure reflexes to dodge everything trying to wreck your plane.",
      description: "Your plane is locked onto a relentless forward speed, and the sheer walls of the valley are closing in fast. Your only job is to weave, bank, and dive to miss the wreckage, rock formations, or other hazards shooting towards you. It's pure reflex action where one wrong twitch means an immediate, fiery stop. Can you keep your nerve and push the throttle harder?",
      image: "images/games/cosmic-adventure.jpg",
      technologies: ["Unity", "C#"],
      rating: 4.8,
      playCount: 12500,
      likes: 890,
      features: [
        "Procedurally generated galaxies",
        "Real-time space combat",
        "Multiplayer co-op mode",
        "VR compatibility"
      ],
      status: "Live",
      releaseDate: "2023-10-15",
      demoUrl: "https://demo.cosmic-adventure.com",
      sourceUrl: "https://github.com/arsh/cosmic-adventure"
    },
    {
      id: 2,
      name: "Neon Racer",
      category: "Racing",
      overview: "High-speed futuristic racing with neon aesthetics",
      description: "Experience the thrill of high-speed racing in a cyberpunk world. Customize your vehicle, compete in global tournaments, and dominate the leaderboards.",
      image: "images/games/neon-racer.jpg",
      technologies: ["Unreal Engine", "C++", "Substance"],
      rating: 4.6,
      playCount: 8900,
      likes: 654,
      features: [
        "Vehicle customization system",
        "Online multiplayer races",
        "Dynamic weather system",
        "Leaderboard integration"
      ],
      status: "Live",
      releaseDate: "2023-08-22",
      demoUrl: "https://play.neon-racer.com",
      sourceUrl: "https://github.com/arsh/neon-racer"
    }
  ],

  // Websites Portfolio
  websites: [
    {
      id: 1,
      name: "E-Commerce Platform",
      category: "E-Commerce",
      overview: "Modern e-commerce solution with advanced features",
      description: "A fully-featured e-commerce platform built with modern technologies. Includes user authentication, payment processing, inventory management, and analytics dashboard.",
      image: "images/websites/ecommerce-platform.jpg",
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

  // Apps Portfolio (NEW SECTION)
  apps: [
    {
      id: 1,
      name: "TaskFlow Pro",
      category: "Productivity",
      platform: "Mobile",
      overview: "Intelligent task management with AI assistance",
      description: "A smart task manager that uses artificial intelligence to prioritize your work, suggest optimal schedules, and help you stay focused on what matters most.",
      image: "images/apps/taskflow-pro.jpg",
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
  ],

  // Testimonials
  testimonials: [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechInnovate",
      avatar: "images/testimonials/sarah.jpg",
      content: "Working with Arsh was an absolute pleasure. His attention to detail and technical expertise brought our vision to life beyond our expectations.",
      rating: 5,
      project: "E-Commerce Platform"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CTO",
      company: "StartUpGrid",
      avatar: "images/testimonials/michael.jpg",
      content: "Arsh delivered a robust and scalable solution that has been crucial to our company's growth. His code is clean and well-documented.",
      rating: 5,
      project: "Social Media Dashboard"
    }
  ],

  // Experience Timeline
  experience: [
    {
      id: 1,
      title: "Senior Full-Stack Developer",
      company: "TechCorp Solutions",
      period: "2022 - Present",
      description: "Leading development of enterprise web applications and mentoring junior developers.",
      technologies: ["React", "Node.js", "AWS", "MongoDB"]
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Digital Innovations Inc.",
      period: "2020 - 2022",
      description: "Developed responsive web applications and collaborated with UX/UI designers.",
      technologies: ["Vue.js", "TypeScript", "Sass", "Jest"]
    }
  ]
};

// ============================================
// ADMIN DATA & CONFIGURATION
// ============================================

const ADMIN_CONFIG = {
  feedback: [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      type: "Project Inquiry",
      message: "I'm interested in collaborating on a mobile app project. Could we schedule a call to discuss the possibilities?",
      timestamp: "2024-01-15T14:30:00Z",
      status: "unread",
      important: false,
      resolved: false
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma.wilson@creative.com",
      type: "Partnership",
      message: "Your portfolio is impressive! We'd love to explore partnership opportunities for our upcoming design projects.",
      timestamp: "2024-01-14T11:15:00Z",
      status: "read",
      important: true,
      resolved: false
    }
  ],

  analytics: {
    messagesOverTime: {
      week: [12, 19, 8, 15, 22, 18, 25],
      month: [45, 52, 48, 61, 55, 49, 58, 62, 67, 59, 64, 71],
      year: [450, 520, 480, 610, 550, 490, 580, 620, 670, 590, 640, 710]
    },
    inquiryTypes: {
      "Project Inquiry": 35,
      "Hiring": 25,
      "Partnership": 20,
      "Consultation": 15,
      "Other": 5
    }
  },

  activity: [
    {
      id: 1,
      type: "new_message",
      description: "New message from John Smith",
      timestamp: "2024-01-15T14:30:00Z",
      user: "John Smith"
    },
    {
      id: 2,
      type: "message_resolved",
      description: "Marked message from David Brown as resolved",
      timestamp: "2024-01-15T13:15:00Z",
      user: "David Brown"
    }
  ]
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function filterPortfolioItems(items, filters) {
  return items.filter(item => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
      );
    }
    return true;
  });
}

function sortPortfolioItems(items, sortBy) {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return parseInt(b.downloads) - parseInt(a.downloads);
      default:
        return 0;
    }
  });
}

function exportData(data, format) {
  let output = '';
  
  switch (format) {
    case 'csv':
      output = convertToCSV(data);
      break;
    case 'json':
      output = JSON.stringify(data, null, 2);
      break;
    case 'pdf':
      console.log('PDF export would be implemented with a library');
      return;
  }
  
  const blob = new Blob([output], { type: `text/${format}` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-data.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n');
  
  return csv;
}

function validateContactForm(data) {
  const errors = {};
  
  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.email?.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid';
  if (!data.message?.trim()) errors.message = 'Message is required';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

const STORAGE_KEYS = {
  THEME: 'portfolio_theme',
  FEEDBACK: 'portfolio_feedback',
  SETTINGS: 'portfolio_settings'
};

function getStoredData(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

function initializeStorage() {
  if (!getStoredData(STORAGE_KEYS.FEEDBACK)) {
    setStoredData(STORAGE_KEYS.FEEDBACK, ADMIN_CONFIG.feedback);
  }
  
  if (!getStoredData(STORAGE_KEYS.THEME)) {
    setStoredData(STORAGE_KEYS.THEME, 'dark');
  }
}

// Initialize storage on load
initializeStorage();