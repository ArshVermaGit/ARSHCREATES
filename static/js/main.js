// main.js - Core functionality with clickability fixes

class PortfolioApp {
    constructor() {
        this.currentTheme = 'dark';
        this.portfolioItems = [];
        this.init();
    }

    init() {
        console.log('Portfolio App Initializing...');
        this.setupEventListeners();
        this.loadTheme();
        this.loadPortfolioData();
        this.setupModalSystem();
        this.setupNavigation();
        this.setupContactForm();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile navigation
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleMobileNav());
        }

        // Close mobile menu on link click
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileNav());
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Ensure all portfolio items are clickable
        this.setupPortfolioClickHandlers();
    }

    setupPortfolioClickHandlers() {
        // Use event delegation for dynamic content
        document.addEventListener('click', (e) => {
            const portfolioCard = e.target.closest('.portfolio-card');
            if (portfolioCard) {
                this.handlePortfolioClick(portfolioCard);
                return;
            }

            const playBtn = e.target.closest('.play-btn, .view-btn, .modal-play-btn');
            if (playBtn) {
                this.handlePlayButton(playBtn);
                return;
            }

            const closeBtn = e.target.closest('.modal-close');
            if (closeBtn) {
                this.closeModal();
                return;
            }
        });

        // Also attach direct handlers for reliability
        setTimeout(() => {
            const portfolioCards = document.querySelectorAll('.portfolio-card');
            portfolioCards.forEach(card => {
                card.removeEventListener('click', this.handlePortfolioClick);
                card.addEventListener('click', (e) => this.handlePortfolioClick(card));
            });

            const playButtons = document.querySelectorAll('.play-btn, .view-btn, .modal-play-btn');
            playButtons.forEach(btn => {
                btn.removeEventListener('click', this.handlePlayButton);
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handlePlayButton(btn);
                });
            });

            const closeButtons = document.querySelectorAll('.modal-close');
            closeButtons.forEach(btn => {
                btn.removeEventListener('click', this.closeModal);
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closeModal();
                });
            });
        }, 100);
    }

    handlePortfolioClick(card) {
        console.log('Portfolio card clicked:', card);
        
        const itemId = card.dataset.itemId || card.getAttribute('data-item-id');
        if (!itemId) {
            console.warn('No item ID found on portfolio card');
            return;
        }

        const item = this.portfolioItems.find(item => item.id === itemId);
        if (item) {
            this.openModal(item);
        } else {
            console.warn('Portfolio item not found:', itemId);
        }
    }

    handlePlayButton(button) {
        console.log('Play button clicked:', button);
        
        const itemId = button.dataset.itemId || button.closest('.portfolio-card')?.dataset.itemId;
        if (itemId) {
            const item = this.portfolioItems.find(item => item.id === itemId);
            if (item) {
                this.openModal(item);
            }
        }
        
        // If it's a modal play button, trigger the preview
        if (button.classList.contains('modal-play-btn')) {
            this.triggerPreview(button.dataset.type, button.dataset.src);
        }
    }

    setupModalSystem() {
        console.log('Setting up modal system...');
        
        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('portfolio-modal') || 
                e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Ensure modal is properly layered
        const modal = document.querySelector('.portfolio-modal');
        if (modal) {
            modal.style.zIndex = '9999';
        }
    }

    openModal(item) {
        console.log('Opening modal for item:', item);
        
        const modal = document.querySelector('.portfolio-modal');
        const modalPreview = document.querySelector('.modal-preview');
        const modalInfo = document.querySelector('.modal-info');
        
        if (!modal || !modalPreview || !modalInfo) {
            console.error('Modal elements not found');
            return;
        }

        // Set modal content
        this.setModalContent(item);
        
        // Show modal
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Reset and setup preview
        this.resetPreview();
        this.setupPreview(item);
    }

    setModalContent(item) {
        // Set title
        const titleEl = document.querySelector('.modal-title');
        if (titleEl) titleEl.textContent = item.title;

        // Set description
        const descEl = document.querySelector('.modal-description');
        if (descEl) descEl.textContent = item.description;

        // Set features
        const featuresEl = document.querySelector('.modal-features');
        if (featuresEl && item.features) {
            featuresEl.innerHTML = item.features.map(feature => 
                `<div class="feature-item">
                    <i class="fas fa-check"></i>
                    <span>${feature}</span>
                </div>`
            ).join('');
        }

        // Set action buttons
        const actionsEl = document.querySelector('.modal-actions');
        if (actionsEl && item.links) {
            actionsEl.innerHTML = item.links.map(link => 
                `<a href="${link.url}" target="_blank" class="btn ${link.type === 'primary' ? 'btn-primary' : 'btn-glass'}">
                    <i class="${link.icon}"></i>
                    ${link.text}
                </a>`
            ).join('');
        }
    }

    setupPreview(item) {
        const previewContainer = document.getElementById('itemPreview');
        if (!previewContainer) return;

        // Clear previous content
        previewContainer.innerHTML = '';

        if (item.type === 'image') {
            this.setupImagePreview(item);
        } else if (item.type === 'video') {
            this.setupVideoPreview(item);
        } else if (item.type === 'website') {
            this.setupWebsitePreview(item);
        } else if (item.type === 'game') {
            this.setupGamePreview(item);
        }
    }

    setupImagePreview(item) {
        const previewContainer = document.getElementById('itemPreview');
        const img = document.createElement('img');
        img.id = 'previewImage';
        img.src = item.previewImage || item.image;
        img.alt = item.title;
        
        previewContainer.appendChild(img);
    }

    setupVideoPreview(item) {
        const previewContainer = document.getElementById('itemPreview');
        
        const playButton = document.createElement('button');
        playButton.className = 'modal-play-btn';
        playButton.innerHTML = '<i class="fas fa-play"></i> Watch Video';
        playButton.dataset.type = 'video';
        playButton.dataset.src = item.videoUrl;
        
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playVideo(item.videoUrl);
        });

        previewContainer.appendChild(playButton);
    }

    setupWebsitePreview(item) {
        const previewContainer = document.getElementById('itemPreview');
        
        const viewButton = document.createElement('button');
        viewButton.className = 'modal-play-btn';
        viewButton.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit Website';
        viewButton.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(item.websiteUrl, '_blank');
        });

        previewContainer.appendChild(viewButton);

        // Also show preview image if available
        if (item.previewImage) {
            const img = document.createElement('img');
            img.id = 'previewImage';
            img.src = item.previewImage;
            img.alt = item.title;
            img.style.opacity = '0.5';
            previewContainer.appendChild(img);
        }
    }

    setupGamePreview(item) {
        const previewContainer = document.getElementById('itemPreview');
        
        const playButton = document.createElement('button');
        playButton.className = 'modal-play-btn';
        playButton.innerHTML = '<i class="fas fa-gamepad"></i> Play Game';
        playButton.dataset.type = 'game';
        playButton.dataset.src = item.gameUrl;
        
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playGame(item.gameUrl);
        });

        previewContainer.appendChild(playButton);
    }

    playVideo(videoUrl) {
        console.log('Playing video:', videoUrl);
        
        const videoPlayer = document.getElementById('videoPlayer');
        const itemPreview = document.getElementById('itemPreview');
        
        if (!videoPlayer) return;

        // Hide preview, show video player
        if (itemPreview) itemPreview.style.display = 'none';
        videoPlayer.style.display = 'flex';

        // Set up video element
        const video = videoPlayer.querySelector('video');
        if (video) {
            video.src = videoUrl;
            video.load();
        }
    }

    playGame(gameUrl) {
        console.log('Loading game:', gameUrl);
        
        const gameContainer = document.getElementById('gameContainer');
        const itemPreview = document.getElementById('itemPreview');
        
        if (!gameContainer) return;

        // Hide preview, show game container
        if (itemPreview) itemPreview.style.display = 'none';
        gameContainer.style.display = 'flex';

        // For Unity WebGL games
        if (typeof createUnityInstance !== 'undefined') {
            this.loadUnityGame(gameUrl);
        } else {
            // If no Unity, show iframe or redirect
            gameContainer.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <a href="${gameUrl}" target="_blank" class="btn btn-primary" style="z-index: 1000;">
                        <i class="fas fa-external-link-alt"></i>
                        Play Game in New Tab
                    </a>
                </div>
            `;
        }
    }

    triggerPreview(type, src) {
        console.log('Triggering preview:', type, src);
        
        if (type === 'video') {
            this.playVideo(src);
        } else if (type === 'game') {
            this.playGame(src);
        }
    }

    resetPreview() {
        // Hide all preview containers
        const containers = ['itemPreview', 'photoViewer', 'videoPlayer', 'gameContainer'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.display = id === 'itemPreview' ? 'flex' : 'none';
            }
        });

        // Stop any playing media
        const video = document.querySelector('#videoPlayer video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }

    closeModal() {
        console.log('Closing modal');
        
        const modal = document.querySelector('.portfolio-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
        
        document.body.style.overflow = 'auto';
        this.resetPreview();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    toggleMobileNav() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        }
    }

    closeMobileNav() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    loadPortfolioData() {
        // This would typically come from an API or JSON file
        // For now, we'll use sample data
        this.portfolioItems = [
            {
                id: 'project1',
                title: 'Project One',
                description: 'A beautiful project showcasing modern design principles.',
                type: 'image',
                image: 'images/project1.jpg',
                previewImage: 'images/project1-preview.jpg',
                features: ['Responsive Design', 'Modern UI', 'Fast Performance'],
                links: [
                    { text: 'View Live', url: '#', icon: 'fas fa-external-link-alt', type: 'primary' },
                    { text: 'GitHub', url: '#', icon: 'fab fa-github', type: 'secondary' }
                ]
            },
            {
                id: 'project2',
                title: 'Video Project',
                description: 'An engaging video project with stunning visuals.',
                type: 'video',
                image: 'images/project2.jpg',
                videoUrl: 'videos/project2.mp4',
                features: ['4K Quality', 'Smooth Playback', 'Engaging Content'],
                links: [
                    { text: 'Watch Video', url: '#', icon: 'fas fa-play', type: 'primary' }
                ]
            },
            {
                id: 'project3',
                title: 'Web Application',
                description: 'A powerful web application with modern features.',
                type: 'website',
                image: 'images/project3.jpg',
                websiteUrl: 'https://example.com',
                previewImage: 'images/project3-preview.jpg',
                features: ['User Authentication', 'Real-time Updates', 'Mobile Friendly'],
                links: [
                    { text: 'Visit Website', url: 'https://example.com', icon: 'fas fa-external-link-alt', type: 'primary' },
                    { text: 'View Code', url: '#', icon: 'fab fa-github', type: 'secondary' }
                ]
            }
        ];

        this.renderPortfolioItems();
    }

    renderPortfolioItems() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = this.portfolioItems.map(item => `
            <div class="portfolio-card" data-item-id="${item.id}">
                <div class="portfolio-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="portfolio-overlay">
                        ${item.type === 'video' ? 
                            '<div class="play-btn"><i class="fas fa-play"></i></div>' : 
                            '<div class="view-btn"><i class="fas fa-eye"></i></div>'
                        }
                    </div>
                </div>
                <div class="portfolio-info">
                    <span class="portfolio-badge">${item.type}</span>
                    <h3 class="portfolio-title">${item.title}</h3>
                    <p class="portfolio-description">${item.description}</p>
                </div>
            </div>
        `).join('');

        // Re-attach click handlers after rendering
        this.setupPortfolioClickHandlers();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            // Here you would typically send to your backend
            console.log('Contact form submitted:', data);
            this.showNotification('Message sent successfully!', 'success');
            e.target.reset();
        } catch (error) {
            console.error('Contact form error:', error);
            this.showNotification('Error sending message. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
                </div>
                <div class="notification-text">
                    <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    <p>${message}</p>
                </div>
            </div>
            <div class="notification-progress">
                <div class="notification-progress-bar"></div>
            </div>
        `;

        container.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOutUp 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new PortfolioApp();
    });
} else {
    window.portfolioApp = new PortfolioApp();
}