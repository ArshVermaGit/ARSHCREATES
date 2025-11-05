// ============================================
// WEBSITE DETAIL FUNCTIONALITY
// ============================================

class WebsiteDetail {
    constructor() {
        this.currentWebsite = null;
        this.init();
    }

    init() {
        this.loadWebsiteData();
        this.setupEventListeners();
        this.updateNavigation();
    }

    loadWebsiteData() {
        const urlParams = new URLSearchParams(window.location.search);
        const websiteId = urlParams.get('id') || 1;
        
        this.currentWebsite = window.getItemById('websites', websiteId);
        
        if (this.currentWebsite) {
            this.updateWebsiteDetail();
        } else {
            this.showErrorState();
        }
    }

    updateWebsiteDetail() {
        // Update page title
        document.title = `${this.currentWebsite.name} - Website Details | Arsh Verma`;

        // Update hero section
        this.updateHeroSection();
        
        // Update description
        this.updateDescription();
        
        // Update features
        this.updateFeatures();
        
        // Update technology stack
        this.updateTechnologyStack();
        
        // Update related websites
        this.updateRelatedWebsites();
        
        // Update iframe and links
        this.updateLivePreview();
    }

    updateHeroSection() {
        const website = this.currentWebsite;
        
        // Update preview image
        const previewImage = document.querySelector('.website-preview-img');
        if (previewImage) {
            previewImage.src = website.image;
            previewImage.alt = website.name;
        }

        // Update website info
        document.querySelector('.website-title').textContent = website.name;
        document.querySelector('.website-tagline').textContent = website.overview;
        document.querySelector('.website-category').textContent = website.category;

        // Update rating
        const ratingElement = document.querySelector('.website-rating-large');
        if (ratingElement) {
            const stars = ratingElement.querySelector('.stars');
            stars.innerHTML = this.generateStars(website.rating);
            ratingElement.querySelector('.rating-text').textContent = `${website.rating} (${this.formatNumber(website.monthlyUsers)} users)`;
        }

        // Update stats
        const stats = document.querySelectorAll('.website-stats-overview .stat');
        if (stats.length >= 4) {
            stats[0].querySelector('.stat-value').textContent = this.formatNumber(website.monthlyUsers);
            stats[1].querySelector('.stat-value').textContent = website.rating;
            stats[2].querySelector('.stat-value').textContent = this.formatNumber(website.ordersPerMonth || website.monthlyUsers / 3);
            stats[3].querySelector('.stat-value').textContent = '99.9%';
        }

        // Update action buttons
        const liveButton = document.querySelector('.btn-primary');
        if (liveButton && website.url) {
            liveButton.href = website.url;
        }

        const githubButton = document.querySelector('.btn-secondary');
        if (githubButton && website.repositoryUrl) {
            githubButton.href = website.repositoryUrl;
        }
    }

    updateDescription() {
        const descriptionElement = document.querySelector('.website-description');
        if (descriptionElement) {
            descriptionElement.textContent = this.currentWebsite.description;
        }
    }

    updateFeatures() {
        const featuresGrid = document.querySelector('.feature-showcase');
        if (featuresGrid && this.currentWebsite.features) {
            featuresGrid.innerHTML = this.currentWebsite.features.map((feature, index) => `
                <div class="feature-item">
                    <div class="feature-icon">
                        <i class="fas fa-${this.getFeatureIcon(index)}"></i>
                    </div>
                    <h3>${feature}</h3>
                    <p>${this.getFeatureDescription(feature)}</p>
                </div>
            `).join('');
        }
    }

    updateTechnologyStack() {
        const techGrid = document.querySelector('.tech-stack-grid');
        if (techGrid && this.currentWebsite.technologies) {
            // Group technologies by category
            const categories = {
                'Frontend': this.currentWebsite.technologies.filter(tech => 
                    ['React', 'Vue', 'Angular', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript'].includes(tech)
                ),
                'Backend': this.currentWebsite.technologies.filter(tech => 
                    ['Node.js', 'Express', 'PHP', 'Python', 'Ruby', 'Java'].includes(tech)
                ),
                'Database': this.currentWebsite.technologies.filter(tech => 
                    ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase'].includes(tech)
                ),
                'Tools': this.currentWebsite.technologies.filter(tech => 
                    !['React', 'Vue', 'Angular', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 
                      'Node.js', 'Express', 'PHP', 'Python', 'Ruby', 'Java',
                      'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase'].includes(tech)
                )
            };

            techGrid.innerHTML = Object.entries(categories)
                .filter(([_, techs]) => techs.length > 0)
                .map(([category, techs]) => `
                    <div class="tech-category">
                        <h4>${category}</h4>
                        <ul class="tech-list">
                            ${techs.map(tech => `<li>${tech}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');
        }
    }

    updateRelatedWebsites() {
        const relatedGrid = document.querySelector('.related-grid');
        if (relatedGrid) {
            const allWebsites = window.getItemsByCategory('websites');
            const relatedWebsites = allWebsites
                .filter(website => website.id !== this.currentWebsite.id)
                .slice(0, 3);

            relatedGrid.innerHTML = relatedWebsites.map(website => `
                <div class="related-card">
                    <div class="related-image">
                        <img src="${website.image}" alt="${website.name}" loading="lazy">
                    </div>
                    <div class="related-content">
                        <h3>${website.name}</h3>
                        <p>${website.overview}</p>
                        <div class="related-meta">
                            <span class="rating">${website.rating}★</span>
                            <span class="category">${website.category}</span>
                        </div>
                        <a href="website-detail.html?id=${website.id}" class="btn btn-outline">View Details</a>
                    </div>
                </div>
            `).join('');
        }
    }

    updateLivePreview() {
        const iframe = document.getElementById('websiteIframe');
        const liveLink = document.querySelector('.website-actions .btn-primary');
        
        if (iframe && this.currentWebsite.url) {
            iframe.src = this.currentWebsite.url;
        }
        
        if (liveLink && this.currentWebsite.url) {
            liveLink.href = this.currentWebsite.url;
        }
    }

    setupEventListeners() {
        // Preview controls
        const fullscreenBtn = document.getElementById('fullscreenPreview');
        const refreshBtn = document.getElementById('refreshPreview');
        const websiteIframe = document.getElementById('websiteIframe');

        if (fullscreenBtn && websiteIframe) {
            fullscreenBtn.addEventListener('click', () => {
                if (websiteIframe.requestFullscreen) {
                    websiteIframe.requestFullscreen();
                } else if (websiteIframe.webkitRequestFullscreen) {
                    websiteIframe.webkitRequestFullscreen();
                } else if (websiteIframe.msRequestFullscreen) {
                    websiteIframe.msRequestFullscreen();
                }
            });
        }

        if (refreshBtn && websiteIframe) {
            refreshBtn.addEventListener('click', () => {
                websiteIframe.src = websiteIframe.src;
            });
        }

        // Share functionality
        const shareButtons = document.querySelectorAll('.btn-share');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.shareWebsite(e.target.closest('.btn-share').dataset.platform);
            });
        });
    }

    updateNavigation() {
        const prevItem = window.getPrevItem('websites', this.currentWebsite.id);
        const nextItem = window.getNextItem('websites', this.currentWebsite.id);

        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');

        if (prevArrow && prevItem) {
            prevArrow.href = `website-detail.html?id=${prevItem.id}`;
            prevArrow.querySelector('.arrow-title').textContent = prevItem.name;
        }

        if (nextArrow && nextItem) {
            nextArrow.href = `website-detail.html?id=${nextItem.id}`;
            nextArrow.querySelector('.arrow-title').textContent = nextItem.name;
        }
    }

    shareWebsite(platform) {
        const websiteTitle = this.currentWebsite.name;
        const websiteUrl = window.location.href;
        let shareUrl = '';

        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(websiteTitle)}&url=${encodeURIComponent(websiteUrl)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`;
                break;
            case 'link':
                navigator.clipboard.writeText(websiteUrl).then(() => {
                    this.showNotification('Website link copied to clipboard!', 'success');
                });
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    showErrorState() {
        document.querySelector('.website-detail-section').innerHTML = `
            <div class="error-state">
                <i class="fas fa-laptop-code"></i>
                <h2>Website Not Found</h2>
                <p>The website you're looking for doesn't exist or has been moved.</p>
                <a href="websites.html" class="btn btn-primary">Back to Websites</a>
            </div>
        `;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.getElementById('notificationContainer').appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Helper methods
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return '★'.repeat(fullStars) + 
               (halfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    getFeatureIcon(index) {
        const icons = ['search', 'robot', 'mobile-alt', 'shield-alt', 'tachometer-alt', 'chart-line'];
        return icons[index] || 'star';
    }

    getFeatureDescription(feature) {
        const descriptions = {
            'Advanced Search & Filtering': 'Intelligent product search with faceted filtering by price, brand, features, and customer ratings.',
            'AI Recommendations': 'Personalized product suggestions based on browsing history and purchase patterns.',
            'Progressive Web App': 'Fast, app-like experience with offline functionality and push notifications.',
            'Secure Payments': 'Multiple payment options with PCI-compliant security and fraud detection.',
            'Performance Optimized': 'Lightning-fast loading times with optimized images and efficient code.',
            'Analytics Dashboard': 'Comprehensive analytics for sales, user behavior, and inventory management.'
        };
        return descriptions[feature] || 'Enhanced feature that improves user experience and functionality.';
    }
}

// Initialize website detail when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.websiteDetail = new WebsiteDetail();
});