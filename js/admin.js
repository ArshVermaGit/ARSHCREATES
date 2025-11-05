// ============================================
// ADMIN PANEL SCRIPT
// ============================================

class AdminPanel {
    constructor() {
        this.contacts = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.loadData();
        this.setupEventListeners();
        this.setupQuickActions();
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingBar = document.getElementById('loadingBar');
        
        if (!loadingScreen) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.visibility = 'hidden';
                }, 500);
            }
            
            if (loadingBar) loadingBar.style.width = `${progress}%`;
        }, 200);
    }

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const theme = document.documentElement.getAttribute('data-theme');
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
            });
        }
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    loadData() {
        // Load contacts from localStorage
        this.loadContacts();
        
        // Update statistics
        this.updateStatistics();
        
        // Render contacts table
        this.renderContactsTable();
        
        // Update project counts
        this.updateProjectCounts();
        
        // Load testimonials
        this.loadTestimonials();
        
        // Update analytics
        this.updateAnalytics();
    }

    loadContacts() {
        const storedContacts = localStorage.getItem('portfolioContacts');
        if (storedContacts) {
            this.contacts = JSON.parse(storedContacts);
        } else {
            this.contacts = [];
        }
    }

    updateStatistics() {
        document.getElementById('totalContacts').textContent = this.contacts.length;
        document.getElementById('contactsCount').textContent = this.contacts.length;
    }

    updateProjectCounts() {
        if (!window.PORTFOLIO_DATA) return;

        const gamesCount = window.PORTFOLIO_DATA.games.length;
        const websitesCount = window.PORTFOLIO_DATA.websites.length;
        const appsCount = window.PORTFOLIO_DATA.apps.length;
        const testimonialsCount = window.PORTFOLIO_DATA.testimonials.length;

        document.getElementById('gamesCount').textContent = gamesCount;
        document.getElementById('websitesCount').textContent = websitesCount;
        document.getElementById('appsCount').textContent = appsCount;
        document.getElementById('totalProjects').textContent = gamesCount + websitesCount + appsCount;
        document.getElementById('totalTestimonials').textContent = testimonialsCount;
    }

    renderContactsTable() {
        const tableBody = document.getElementById('contactsTableBody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentContacts = this.contacts.slice(startIndex, endIndex);

        if (this.contacts.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-table">
                        <i class="fas fa-inbox"></i>
                        <p>No contact submissions yet</p>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = currentContacts.map((contact, index) => `
            <tr class="${contact.read ? 'read' : 'unread'}" data-index="${startIndex + index}">
                <td class="contact-name">
                    <div class="name-avatar">
                        <div class="avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <strong>${contact.fullName}</strong>
                            <small>${this.formatDate(contact.timestamp)}</small>
                        </div>
                    </div>
                </td>
                <td class="contact-email">${contact.email}</td>
                <td class="contact-phone">${contact.phone || 'N/A'}</td>
                <td class="contact-type">
                    <span class="type-badge ${contact.type.toLowerCase()}">${contact.type}</span>
                </td>
                <td class="contact-date">${this.formatDate(contact.timestamp)}</td>
                <td class="contact-status">
                    <span class="status-badge ${contact.read ? 'read' : 'unread'}">
                        ${contact.read ? 'Read' : 'Unread'}
                    </span>
                </td>
                <td class="contact-actions">
                    <button class="btn-view" data-index="${startIndex + index}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-delete" data-index="${startIndex + index}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.contacts.length / this.itemsPerPage);
        const pagination = document.getElementById('contactsPagination');

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage - 1}">Previous</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="page-btn active" data-page="${i}">${i}</button>`;
            } else {
                paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage + 1}">Next</button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    setupEventListeners() {
        // Contact table actions
        document.getElementById('contactsTableBody').addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const index = parseInt(target.getAttribute('data-index'));
            
            if (target.classList.contains('btn-view')) {
                this.viewContactDetails(index);
            } else if (target.classList.contains('btn-delete')) {
                this.deleteContact(index);
            }
        });

        // Pagination
        document.getElementById('contactsPagination').addEventListener('click', (e) => {
            const target = e.target.closest('.page-btn');
            if (!target) return;

            const page = parseInt(target.getAttribute('data-page'));
            this.currentPage = page;
            this.renderContactsTable();
        });

        // Clear contacts
        document.getElementById('clearContacts').addEventListener('click', () => {
            this.clearAllContacts();
        });

        // Export contacts
        document.getElementById('exportContacts').addEventListener('click', () => {
            this.exportContactsToCSV();
        });

        // Modal events
        this.setupModalEvents();
    }

    setupQuickActions() {
        const actions = document.querySelectorAll('.action-card');
        actions.forEach(action => {
            action.addEventListener('click', () => {
                const actionType = action.getAttribute('data-action');
                this.handleQuickAction(actionType);
            });
        });

        // Add new project button
        const addProjectBtn = document.getElementById('addProject');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => this.addNewProject());
        }

        // Add new testimonial button
        const addTestimonialBtn = document.getElementById('addTestimonial');
        if (addTestimonialBtn) {
            addTestimonialBtn.addEventListener('click', () => this.addNewTestimonial());
        }
    }

    handleQuickAction(actionType) {
        switch (actionType) {
            case 'export-data':
                this.exportAllData();
                break;
            case 'clear-data':
                this.clearAllData();
                break;
            case 'refresh-data':
                this.refreshData();
                break;
            case 'backup-data':
                this.backupData();
                break;
            case 'add-project':
                this.addNewProject();
                break;
            case 'add-testimonial':
                this.addNewTestimonial();
                break;
            default:
                this.showNotification(`Action "${actionType}" not implemented`, 'warning');
        }
    }

    addNewProject() {
        const category = prompt('Enter category (games/websites/apps):');
        if (!category || !['games', 'websites', 'apps'].includes(category)) {
            this.showNotification('Invalid category. Please enter: games, websites, or apps', 'error');
            return;
        }

        const name = prompt('Enter project name:');
        if (!name) {
            this.showNotification('Project name is required', 'error');
            return;
        }

        const overview = prompt('Enter project overview:') || 'An amazing project description';
        const image = prompt('Enter image path (e.g., images/games/project.jpg):') || 'images/placeholder.jpg';

        // Base project structure
        const newProject = {
            name: name,
            category: this.getDefaultCategory(category),
            overview: overview,
            description: overview + ' - Full description goes here with more details about the project.',
            rating: 4.5,
            playCount: Math.floor(Math.random() * 10000) + 1000,
            launchDate: new Date().toISOString().split('T')[0],
            developmentTime: '3 months',
            status: 'Live',
            image: image,
            technologies: ['JavaScript', 'HTML5', 'CSS3'],
            features: ['Responsive Design', 'Modern UI/UX', 'Cross-Platform Compatibility']
        };

        // Category-specific properties
        if (category === 'websites') {
            newProject.url = prompt('Enter website URL:') || '#';
            newProject.repositoryUrl = prompt('Enter repository URL (optional):') || '#';
        }

        if (category === 'apps') {
            newProject.platform = 'Cross-Platform';
            newProject.appStoreUrl = prompt('Enter App Store URL (optional):') || '#';
            newProject.playStoreUrl = prompt('Enter Play Store URL (optional):') || '#';
            newProject.repositoryUrl = prompt('Enter repository URL (optional):') || '#';
        }

        if (category === 'games') {
            newProject.platforms = ['WebGL'];
            newProject.teamSize = 1;
            newProject.likes = Math.floor(Math.random() * 5000) + 100;
            newProject.gameFile = prompt('Enter game file path (e.g., games/your-game/index.html):') || '#';
            newProject.repositoryUrl = prompt('Enter repository URL (optional):') || '#';
        }

        try {
            // Use the global function to add the project
            if (window.addPortfolioItem) {
                window.addPortfolioItem(category, newProject);
                this.showNotification(`Project "${name}" added successfully to ${category}!`, 'success');
                this.loadData(); // Refresh the data display
                
                // Show confirmation with next steps
                setTimeout(() => {
                    if (confirm('Project added! Would you like to edit the data.js file to add more details?')) {
                        this.showNotification('Edit the data.js file to add more properties like screenshots, detailed descriptions, etc.', 'info');
                    }
                }, 1000);
            } else {
                throw new Error('addPortfolioItem function not available');
            }
        } catch (error) {
            console.error('Error adding project:', error);
            this.showNotification('Failed to add project. Please check the console for errors.', 'error');
        }
    }

    // Helper method to get default category based on type
    getDefaultCategory(categoryType) {
        const categories = {
            'games': 'Action RPG',
            'websites': 'Web Application', 
            'apps': 'Productivity'
        };
        return categories[categoryType] || 'General';
    }

    // Method to add new testimonial
    addNewTestimonial() {
        const clientName = prompt('Enter client name:');
        if (!clientName) {
            this.showNotification('Client name is required', 'error');
            return;
        }

        const clientRole = prompt('Enter client role/company:') || 'Client';
        const projectType = prompt('Enter project type (Website/App/Game/Consultation):') || 'Website';
        const projectName = prompt('Enter project name:') || 'Project';
        const rating = parseFloat(prompt('Enter rating (1-5):') || '5');
        const text = prompt('Enter testimonial text:') || 'Great work!';

        const newTestimonial = {
            clientName: clientName,
            clientRole: clientRole,
            projectType: projectType,
            projectName: projectName,
            rating: Math.min(5, Math.max(1, rating)), // Ensure rating is between 1-5
            text: text,
            date: new Date().toISOString().split('T')[0]
        };

        try {
            if (window.addTestimonial) {
                window.addTestimonial(newTestimonial);
                this.showNotification(`Testimonial from ${clientName} added successfully!`, 'success');
                this.loadData(); // Refresh the data display
            } else {
                throw new Error('addTestimonial function not available');
            }
        } catch (error) {
            console.error('Error adding testimonial:', error);
            this.showNotification('Failed to add testimonial. Please check the console for errors.', 'error');
        }
    }

    viewContactDetails(index) {
        const contact = this.contacts[index];
        const modal = document.getElementById('contactModal');
        const modalBody = document.getElementById('contactModalBody');

        modalBody.innerHTML = `
            <div class="contact-details">
                <div class="detail-group">
                    <label>Full Name</label>
                    <p>${contact.fullName}</p>
                </div>
                <div class="detail-group">
                    <label>Email</label>
                    <p>${contact.email}</p>
                </div>
                <div class="detail-group">
                    <label>Phone</label>
                    <p>${contact.phone || 'Not provided'}</p>
                </div>
                <div class="detail-group">
                    <label>Contact Type</label>
                    <p>${contact.type}</p>
                </div>
                <div class="detail-group">
                    <label>Project Details</label>
                    <p>${contact.projectDetails || 'Not provided'}</p>
                </div>
                <div class="detail-group">
                    <label>Message</label>
                    <p class="message-content">${contact.message}</p>
                </div>
                <div class="detail-group">
                    <label>Submission Date</label>
                    <p>${this.formatDate(contact.timestamp, true)}</p>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Mark as read
        if (!contact.read) {
            contact.read = true;
            this.saveContacts();
            this.renderContactsTable();
            this.updateStatistics();
        }
    }

    deleteContact(index) {
        if (confirm('Are you sure you want to delete this contact submission?')) {
            this.contacts.splice(index, 1);
            this.saveContacts();
            this.renderContactsTable();
            this.updateStatistics();
            this.showNotification('Contact submission deleted successfully', 'success');
        }
    }

    clearAllContacts() {
        if (this.contacts.length === 0) {
            this.showNotification('No contacts to clear', 'warning');
            return;
        }

        if (confirm('Are you sure you want to delete ALL contact submissions? This action cannot be undone.')) {
            this.contacts = [];
            this.saveContacts();
            this.renderContactsTable();
            this.updateStatistics();
            this.showNotification('All contact submissions cleared', 'success');
        }
    }

    exportContactsToCSV() {
        if (this.contacts.length === 0) {
            this.showNotification('No contacts to export', 'warning');
            return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Type', 'Project Details', 'Message', 'Date'];
        const csvData = this.contacts.map(contact => [
            contact.fullName,
            contact.email,
            contact.phone || '',
            contact.type,
            contact.projectDetails || '',
            contact.message,
            this.formatDate(contact.timestamp)
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contacts-${this.formatDate(new Date(), 'file')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Contacts exported successfully', 'success');
    }

    exportAllData() {
        const data = {
            contacts: this.contacts,
            portfolio: window.PORTFOLIO_DATA
        };

        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${this.formatDate(new Date(), 'file')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('All data exported successfully', 'success');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This will delete all contacts and reset the portfolio. This action cannot be undone.')) {
            localStorage.removeItem('portfolioContacts');
            localStorage.removeItem('portfolioData');
            this.contacts = [];
            this.saveContacts();
            this.renderContactsTable();
            this.updateStatistics();
            this.showNotification('All data cleared successfully', 'success');
        }
    }

    refreshData() {
        this.loadData();
        this.showNotification('Data refreshed successfully', 'success');
    }

    backupData() {
        const backup = {
            timestamp: new Date().toISOString(),
            contacts: this.contacts,
            portfolio: window.PORTFOLIO_DATA
        };

        localStorage.setItem('portfolioBackup', JSON.stringify(backup));
        this.showNotification('Data backup created successfully', 'success');
    }

    loadTestimonials() {
        if (!window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.testimonials) return;

        const testimonialsList = document.getElementById('testimonialsList');
        const testimonials = window.PORTFOLIO_DATA.testimonials.slice(0, 5); // Show latest 5

        if (testimonials.length === 0) {
            testimonialsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comment-dots"></i>
                    <p>No testimonials yet</p>
                </div>
            `;
            return;
        }

        testimonialsList.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-item">
                <div class="testimonial-header">
                    <div class="client-info">
                        <div class="client-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="client-details">
                            <h4>${testimonial.clientName}</h4>
                            <p>${testimonial.clientRole}</p>
                        </div>
                    </div>
                    <div class="testimonial-meta">
                        <span class="project-type">${testimonial.projectType}</span>
                        <div class="rating">
                            ${this.renderStars(testimonial.rating)}
                        </div>
                    </div>
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-footer">
                    <span class="date">${this.formatDate(testimonial.date)}</span>
                    <span class="project">${testimonial.projectName}</span>
                </div>
            </div>
        `).join('');
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (hasHalfStar && i === fullStars + 1) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }

        return stars;
    }

    updateAnalytics() {
        // Simulate analytics data
        document.getElementById('pageViews').textContent = this.formatNumber(12543);
        document.getElementById('contactRate').textContent = '4.2%';
        document.getElementById('avgSession').textContent = '3m 45s';
    }

    setupModalEvents() {
        const modal = document.getElementById('contactModal');
        const closeBtn = document.getElementById('contactModalClose');
        const closeBtn2 = document.getElementById('closeContactModal');
        const markReadBtn = document.getElementById('markContactRead');

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (closeBtn2) closeBtn2.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        if (markReadBtn) {
            markReadBtn.addEventListener('click', () => {
                // Mark as read functionality is already handled in viewContactDetails
                closeModal();
            });
        }
    }

    saveContacts() {
        localStorage.setItem('portfolioContacts', JSON.stringify(this.contacts));
    }

    formatDate(dateString, full = false) {
        const date = new Date(dateString);
        if (full) {
            return date.toLocaleString();
        }
        return date.toLocaleDateString();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showNotification(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});