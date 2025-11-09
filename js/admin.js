// ==========================================
// ADMIN PANEL - Complete & Perfect Version
// ==========================================
// This file handles:
// - Dashboard statistics and analytics
// - Contact submission management
// - Project overview and counts
// - Testimonials approval system
// - Data export, backup, and management
// - Quick actions and bulk operations
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentContacts = [];           // All contact submissions
let currentPage = 1;                 // Current page for pagination
const contactsPerPage = 10;          // Contacts per page
let selectedContactId = null;        // Currently selected contact

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize Admin Page
 * Called automatically when page loads
 * Sets up all admin functionality
 */
function initializeAdminPage() {
    console.log('🚀 ========== INITIALIZING ADMIN PANEL ==========');
    
    try {
        // Load all dashboard components
        loadDashboard();
        
        // Setup all event listeners
        setupAdminEventListeners();
        
        // Load data sections
        loadContacts();
        loadProjects();
        loadTestimonialsAdmin();
        loadCertificatesAdmin(); // Add this line
        loadAnalytics();
        
        console.log('✅ Admin panel initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing admin panel:', error);
        showNotification('Error loading admin panel', 'error');
    }
}

// ==========================================
// DASHBOARD MANAGEMENT
// ==========================================

/**
 * Load Dashboard Overview
 * Updates main statistics and metrics
 */
function loadDashboard() {
    console.log('📊 Loading dashboard...');
    updateAdminStats();
}

/**
 * Update Admin Statistics
 * Updates header stat cards with current counts
 */
function updateAdminStats() {
    try {
        // Total Contacts
        const totalContactsEl = document.getElementById('totalContacts');
        if (totalContactsEl) {
            const contacts = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
            totalContactsEl.textContent = contacts.length;
            console.log(`📬 Total contacts: ${contacts.length}`);
        }
        
        // Total Projects
        const totalProjectsEl = document.getElementById('totalProjects');
        if (totalProjectsEl) {
            let total = 0;
            if (window.PORTFOLIO_DATA) {
                total = (PORTFOLIO_DATA.games?.length || 0) + 
                        (PORTFOLIO_DATA.websites?.length || 0) + 
                        (PORTFOLIO_DATA.apps?.length || 0);
            }
            totalProjectsEl.textContent = total;
            console.log(`📦 Total projects: ${total}`);
        }
        
        // Total Testimonials
        const totalTestimonialsEl = document.getElementById('totalTestimonials');
        if (totalTestimonialsEl) {
            const testimonials = JSON.parse(localStorage.getItem('portfolio_testimonials') || '[]');
            const approved = testimonials.filter(t => t.approved !== false);
            totalTestimonialsEl.textContent = approved.length;
            console.log(`⭐ Total testimonials: ${approved.length}`);
        }
        
    } catch (error) {
        console.error('❌ Error updating admin stats:', error);
    }
}

// ==========================================
// EVENT LISTENERS SETUP
// ==========================================

/**
 * Setup All Admin Event Listeners
 * Initializes all interactive elements
 */
function setupAdminEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Quick action cards
    setupQuickActions();
    
    // Contact management buttons
    setupContactManagement();
    
    // Refresh analytics button
    setupAnalyticsButtons();
    
    // Add project/testimonial buttons
    setupAddButtons();
    
    console.log('✅ Event listeners setup complete');
}

/**
 * Setup Quick Action Cards
 * Export, Clear, Refresh, Backup buttons
 */
function setupQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            console.log(`🎬 Quick action triggered: ${action}`);
            handleQuickAction(action);
        });
    });
    
    console.log(`✅ ${actionCards.length} quick actions setup`);
}

/**
 * Handle Quick Action Click
 * @param {string} action - The action to perform
 */
function handleQuickAction(action) {
    switch (action) {
        case 'export-data':
            exportAllData();
            break;
        case 'clear-data':
            clearAllData();
            break;
        case 'refresh-data':
            refreshAllData();
            break;
        case 'backup-data':
            backupAllData();
            break;
        default:
            console.warn(`⚠️ Unknown action: ${action}`);
    }
}

/**
 * Setup Contact Management Buttons
 */
function setupContactManagement() {
    // Clear all contacts button
    const clearContactsBtn = document.getElementById('clearContacts');
    if (clearContactsBtn) {
        clearContactsBtn.addEventListener('click', clearAllContacts);
    }
    
    // Export contacts to CSV button
    const exportContactsBtn = document.getElementById('exportContacts');
    if (exportContactsBtn) {
        exportContactsBtn.addEventListener('click', exportContactsToCSV);
    }
}

/**
 * Setup Analytics Buttons
 */
function setupAnalyticsButtons() {
    const refreshAnalyticsBtn = document.getElementById('refreshAnalytics');
    if (refreshAnalyticsBtn) {
        refreshAnalyticsBtn.addEventListener('click', () => {
            loadAnalytics();
            showNotification('Analytics refreshed', 'success');
        });
    }
}

/**
 * Setup Add Buttons
 */
function setupAddButtons() {
    // Add Project button
    const addProjectBtn = document.getElementById('addProject');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            showNotification('Project creation coming soon', 'info');
        });
    }
    
    // Add Testimonial button
    const addTestimonialBtn = document.getElementById('addTestimonial');
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', () => {
            showNotification('Testimonial creation coming soon', 'info');
        });
    }
    
    // Add Certificate button (new)
    setupCertificateButtons();
}

// ==========================================
// QUICK ACTIONS
// ==========================================

/**
 * Export All Portfolio Data as JSON
 */
function exportAllData() {
    console.log('📤 Exporting all data...');
    
    try {
        const data = {
            exportDate: new Date().toISOString(),
            contacts: JSON.parse(localStorage.getItem('portfolio_contacts') || '[]'),
            testimonials: JSON.parse(localStorage.getItem('portfolio_testimonials') || '[]'),
            analytics: JSON.parse(localStorage.getItem('portfolio_analytics') || '{}'),
            portfolio: window.PORTFOLIO_DATA || {}
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ Data exported successfully');
        showNotification('Portfolio data exported successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error exporting data:', error);
        showNotification('Error exporting data', 'error');
    }
}

/**
 * Clear All Contact Data
 */
function clearAllData() {
    if (!confirm('⚠️ Are you sure you want to clear ALL contact data?\n\nThis action cannot be undone!')) {
        return;
    }
    
    console.log('🗑️ Clearing all contact data...');
    
    try {
        localStorage.setItem('portfolio_contacts', JSON.stringify([]));
        currentPage = 1;
        loadContacts();
        updateAdminStats();
        
        console.log('✅ Contact data cleared');
        showNotification('All contact data cleared successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        showNotification('Error clearing data', 'error');
    }
}

/**
 * Refresh All Data
 */
function refreshAllData() {
    console.log('🔄 Refreshing all data...');
    
    try {
        loadContacts();
        loadProjects();
        loadTestimonialsAdmin();
        loadAnalytics();
        updateAdminStats();
        
        console.log('✅ All data refreshed');
        showNotification('All data refreshed successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error refreshing data:', error);
        showNotification('Error refreshing data', 'error');
    }
}

/**
 * Create Data Backup
 */
function backupAllData() {
    console.log('💾 Creating backup...');
    
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupData = {
            backupDate: new Date().toISOString(),
            timestamp: timestamp,
            contacts: JSON.parse(localStorage.getItem('portfolio_contacts') || '[]'),
            testimonials: JSON.parse(localStorage.getItem('portfolio_testimonials') || '[]'),
            analytics: JSON.parse(localStorage.getItem('portfolio_analytics') || '{}')
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ Backup created successfully');
        showNotification('Backup created successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error creating backup:', error);
        showNotification('Error creating backup', 'error');
    }
}

// ==========================================
// CONTACT MANAGEMENT
// ==========================================

/**
 * Load All Contact Submissions
 */
function loadContacts() {
    console.log('📬 Loading contact submissions...');
    
    try {
        const storedContacts = localStorage.getItem('portfolio_contacts');
        
        if (!storedContacts) {
            currentContacts = [];
        } else {
            currentContacts = JSON.parse(storedContacts);
        }
        
        // Sort by date (newest first)
        currentContacts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log(`✅ Loaded ${currentContacts.length} contacts`);
        
        displayContacts(currentContacts);
        setupContactPagination();
        
    } catch (error) {
        console.error('❌ Error loading contacts:', error);
        currentContacts = [];
        displayContacts([]);
    }
}

/**
 * Display Contacts in Table
 * @param {Array} contacts - Array of contact objects
 */
function displayContacts(contacts) {
    const tableBody = document.getElementById('contactsTableBody');
    if (!tableBody) {
        console.warn('⚠️ Contacts table body not found');
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;
    const paginatedContacts = contacts.slice(startIndex, endIndex);
    
    // Handle empty state
    if (contacts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 60px 20px;">
                    <div class="no-contacts" style="opacity: 0.6;">
                        <i class="fas fa-inbox" style="font-size: 64px; margin-bottom: 20px; display: block; color: var(--text-secondary);"></i>
                        <p style="font-size: 18px; color: var(--text-secondary); margin: 0;">No contact submissions yet</p>
                        <p style="font-size: 14px; color: var(--text-muted); margin-top: 8px;">Contact submissions will appear here</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Generate table rows
    tableBody.innerHTML = paginatedContacts.map(contact => {
        // Format date
        let formattedDate = 'Recently';
        try {
            const date = new Date(contact.date);
            formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            console.warn('⚠️ Error formatting date:', e);
        }
        
        return `
            <tr class="${contact.status === 'unread' ? 'unread' : ''} ${contact.important ? 'important' : ''}" 
                data-contact-id="${contact.id}">
                <td>
                    <div class="contact-name">
                        ${contact.important ? '<i class="fas fa-star important-star" style="color: #ffc107; margin-right: 8px;"></i>' : ''}
                        <strong>${contact.fullName || 'Unknown'}</strong>
                    </div>
                </td>
                <td>
                    <a href="mailto:${contact.email}" style="color: var(--primary); text-decoration: none;">
                        ${contact.email || 'N/A'}
                    </a>
                </td>
                <td>${contact.phone || 'N/A'}</td>
                <td>
                    <span class="contact-type ${(contact.contactType || 'other').toLowerCase()}" 
                          style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: capitalize; background: var(--primary-transparent); color: var(--primary);">
                        ${contact.contactType || 'Other'}
                    </span>
                </td>
                <td>${formattedDate}</td>
                <td>
                    <span class="status-badge ${contact.status || 'unread'}" 
                          style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: capitalize; background: ${contact.status === 'read' ? '#28a745' : '#ffc107'}22; color: ${contact.status === 'read' ? '#28a745' : '#ffc107'};">
                        ${contact.status || 'unread'}
                    </span>
                </td>
                <td>
                    <div class="contact-actions" style="display: flex; gap: 8px; justify-content: center;">
                        <button class="btn-view-contact" data-contact-id="${contact.id}" 
                                title="View Details"
                                style="padding: 8px 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-mark-important" data-contact-id="${contact.id}" 
                                title="${contact.important ? 'Remove Important' : 'Mark Important'}"
                                style="padding: 8px 12px; background: ${contact.important ? '#ffc107' : 'var(--secondary)'}; color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="btn-delete-contact" data-contact-id="${contact.id}" 
                                title="Delete"
                                style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Setup row event listeners
    setupContactRowListeners();
}

/**
 * Setup Contact Pagination
 */
function setupContactPagination() {
    const pagination = document.getElementById('contactsPagination');
    const contactsCount = document.getElementById('contactsCount');
    
    if (!pagination) return;
    
    const totalPages = Math.ceil(currentContacts.length / contactsPerPage);
    
    // Update count display
    if (contactsCount) {
        if (currentContacts.length === 0) {
            contactsCount.textContent = '0';
        } else {
            const start = (currentPage - 1) * contactsPerPage + 1;
            const end = Math.min(start + contactsPerPage - 1, currentContacts.length);
            contactsCount.textContent = `${start}-${end} of ${currentContacts.length}`;
        }
    }
    
    // No pagination needed for single page
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    // Build pagination HTML
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" data-page="${currentPage - 1}" 
                    style="padding: 8px 16px; background: var(--secondary); color: white; border: none; border-radius: 6px; cursor: pointer; margin: 0 4px;">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
    }
    
    // Page numbers (show max 5 pages)
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // First page
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" data-page="1" 
                    style="padding: 8px 12px; background: var(--secondary); color: white; border: none; border-radius: 6px; cursor: pointer; margin: 0 4px;">
                1
            </button>
        `;
        if (startPage > 2) {
            paginationHTML += `<span style="padding: 8px;">...</span>`;
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        paginationHTML += `
            <button class="pagination-btn ${isActive ? 'active' : ''}" data-page="${i}" 
                    style="padding: 8px 12px; background: ${isActive ? 'var(--primary)' : 'var(--secondary)'}; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 0 4px; ${isActive ? 'font-weight: 700;' : ''}">
                ${i}
            </button>
        `;
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span style="padding: 8px;">...</span>`;
        }
        paginationHTML += `
            <button class="pagination-btn" data-page="${totalPages}" 
                    style="padding: 8px 12px; background: var(--secondary); color: white; border: none; border-radius: 6px; cursor: pointer; margin: 0 4px;">
                ${totalPages}
            </button>
        `;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="pagination-btn" data-page="${currentPage + 1}" 
                    style="padding: 8px 16px; background: var(--secondary); color: white; border: none; border-radius: 6px; cursor: pointer; margin: 0 4px;">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    pagination.innerHTML = paginationHTML;
    
    // Add click events to pagination buttons
    pagination.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            if (page !== currentPage) {
                currentPage = page;
                displayContacts(currentContacts);
                setupContactPagination();
                
                // Scroll to top of table
                const table = document.getElementById('contactsTable');
                if (table) {
                    table.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

/**
 * Setup Contact Row Event Listeners
 */
function setupContactRowListeners() {
    // View contact details
    document.querySelectorAll('.btn-view-contact').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            viewContactDetails(contactId);
        });
    });
    
    // Mark as important
    document.querySelectorAll('.btn-mark-important').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            toggleContactImportant(contactId);
        });
    });
    
    // Delete contact
    document.querySelectorAll('.btn-delete-contact').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            deleteContact(contactId);
        });
    });
}

/**
 * View Contact Details in Modal
 * @param {number} contactId - The contact ID
 */
function viewContactDetails(contactId) {
    console.log(`👁️ Viewing contact: ${contactId}`);
    
    const contact = currentContacts.find(c => c.id === contactId);
    if (!contact) {
        console.error('❌ Contact not found');
        return;
    }
    
    const modal = document.getElementById('contactModal');
    const modalBody = document.getElementById('contactModalBody');
    
    if (!modal || !modalBody) {
        console.error('❌ Modal elements not found');
        return;
    }
    
    // Mark as read when viewing
    if (contact.status === 'unread') {
        updateContactStatus(contactId, { status: 'read' });
    }
    
    // Format date
    let formattedDate = 'Recently';
    try {
        const date = new Date(contact.date);
        formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.warn('⚠️ Error formatting date:', e);
    }
    
    // Build modal content
    modalBody.innerHTML = `
        <div class="contact-details" style="padding: 20px;">
            <div class="detail-group" style="margin-bottom: 20px;">
                <label style="font-weight: 600; color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block;">Full Name</label>
                <p style="font-size: 16px; margin: 0; color: var(--text-primary);">${contact.fullName || 'Not provided'}</p>
            </div>
            <div class="detail-group" style="margin-bottom: 20px;">
                <label style="font-weight: 600; color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block;">Email</label>
                <p style="font-size: 16px; margin: 0;"><a href="mailto:${contact.email}" style="color: var(--primary); text-decoration: none;">${contact.email || 'Not provided'}</a></p>
            </div>
            <div class="detail-group" style="margin-bottom: 20px;">
                <label style="font-weight: 600; color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block;">Phone</label>
                <p style="font-size: 16px; margin: 0; color: var(--text-primary);">${contact.phone || 'Not provided'}</p>
            </div>
            <div class="detail-group" style="margin-bottom: 20px;">
                <label style="font-weight: 600; color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block;">Contact Type</label>
                <p style="font-size: 16px; margin: 0; color: var(--text-primary); text-transform: capitalize;">${contact.contactType || 'Other'}</p>
            </div>
            ${contact.projectDetails ? `
            <div class="detail-group" style="margin-bottom: 20px;">
                <label style="font-weight: 600; color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block;">Project Details</label>
                <p style="font-size: 16px; margin: 0; color: var(--text-primary);">${contact.projectDetails}</p>
            </div>
            ` : ''}
            ${contact.feedback ? `
            <div class="detail-group" style="margin-bottom: 20px;">
                <label style="font-weight: 600; color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block;">Feedback</label>
                <p style="font-size: 16px; margin: 0; color: var(--text-primary);">${contact.feedback}</p>
            </div>
            ` : ''}
            <div class="detail-group" style="margin-bottom: 20px;">
                <label style="font-weight: 600; color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block;">Message</label>
                <p class="contact-message" style="font-size: 16px; margin: 0; color: var(--text-primary); line-height: 1.6; padding: 16px; background: var(--secondary-transparent); border-radius: 8px; border-left: 4px solid var(--primary);">${contact.message || 'No message provided'}</p>
            </div>
            <div class="detail-group" style="margin-bottom: 0;">
                <label style="font-weight: 600; color: var(--text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block;">Submitted</label>
                <p style="font-size: 14px; margin: 0; color: var(--text-muted);">${formattedDate}</p>
            </div>
        </div>
    `;
    
    // Store current contact ID
    selectedContactId = contactId;
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Setup modal close handlers
    setupModalHandlers();
}

/**
 * Setup Modal Event Handlers
 */
function setupModalHandlers() {
    const modal = document.getElementById('contactModal');
    const modalClose = document.getElementById('contactModalClose');
    const closeBtn = document.getElementById('closeContactModal');
    const markReadBtn = document.getElementById('markContactRead');
    
    // Close button (X)
    if (modalClose) {
        modalClose.onclick = closeContactModal;
    }
    
    // Close button (footer)
    if (closeBtn) {
        closeBtn.onclick = closeContactModal;
    }
    
    // Mark as read button
    if (markReadBtn) {
        markReadBtn.onclick = function() {
            if (selectedContactId) {
                updateContactStatus(selectedContactId, { status: 'read' });
                closeContactModal();
                showNotification('Contact marked as read', 'success');
            }
        };
    }
    
    // Close on backdrop click
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeContactModal();
            }
        };
    }
    
    // ESC key to close
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            closeContactModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

/**
 * Close Contact Modal
 */
function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            selectedContactId = null;
        }, 300);
    }
}

/**
 * Update Contact Status
 * @param {number} contactId - The contact ID
 * @param {object} updates - Object with fields to update
 * @returns {boolean} Success status
 */
function updateContactStatus(contactId, updates) {
    try {
        const contacts = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        
        if (contactIndex !== -1) {
            contacts[contactIndex] = { ...contacts[contactIndex], ...updates };
            localStorage.setItem('portfolio_contacts', JSON.stringify(contacts));
            loadContacts();
            updateAdminStats();
            console.log(`✅ Contact ${contactId} updated`);
            return true;
        }
        
        console.warn(`⚠️ Contact ${contactId} not found`);
        return false;
        
    } catch (error) {
        console.error('❌ Error updating contact:', error);
        return false;
    }
}

/**
 * Toggle Contact Important Status
 * @param {number} contactId - The contact ID
 */
function toggleContactImportant(contactId) {
    const contact = currentContacts.find(c => c.id === contactId);
    if (!contact) {
        console.error('❌ Contact not found');
        return;
    }
    
    const important = !contact.important;
    const success = updateContactStatus(contactId, { important });
    
    if (success) {
        showNotification(
            important ? 'Contact marked as important ⭐' : 'Contact removed from important',
            'success'
        );
    }
}

/**
 * Delete Single Contact
 * @param {number} contactId - The contact ID
 */
function deleteContact(contactId) {
    if (!confirm('⚠️ Are you sure you want to delete this contact?\n\nThis action cannot be undone.')) {
        return;
    }
    
    console.log(`🗑️ Deleting contact: ${contactId}`);
    
    try {
        const contacts = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
        const filteredContacts = contacts.filter(c => c.id !== contactId);
        
        localStorage.setItem('portfolio_contacts', JSON.stringify(filteredContacts));
        
        // Adjust current page if needed
        const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        loadContacts();
        updateAdminStats();
        
        console.log('✅ Contact deleted successfully');
        showNotification('Contact deleted successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error deleting contact:', error);
        showNotification('Error deleting contact', 'error');
    }
}

/**
 * Clear All Contacts
 */
function clearAllContacts() {
    if (!confirm('⚠️ Are you sure you want to clear ALL contact submissions?\n\nThis action cannot be undone!')) {
        return;
    }
    
    console.log('🗑️ Clearing all contacts...');
    
    try {
        localStorage.setItem('portfolio_contacts', JSON.stringify([]));
        currentPage = 1;
        loadContacts();
        updateAdminStats();
        
        console.log('✅ All contacts cleared');
        showNotification('All contacts cleared successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error clearing contacts:', error);
        showNotification('Error clearing contacts', 'error');
    }
}

/**
 * Export Contacts to CSV
 */
function exportContactsToCSV() {
    console.log('📤 Exporting contacts to CSV...');
    
    const contacts = JSON.parse(localStorage.getItem('portfolio_contacts') || '[]');
    
    if (contacts.length === 0) {
        showNotification('No contacts to export', 'warning');
        return;
    }
    
    try {
        const csv = convertContactsToCSV(contacts);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ Contacts exported to CSV');
        showNotification(`${contacts.length} contacts exported to CSV`, 'success');
        
    } catch (error) {
        console.error('❌ Error exporting contacts:', error);
        showNotification('Error exporting contacts', 'error');
    }
}

/**
 * Convert Contacts Array to CSV String
 * @param {Array} contacts - Array of contact objects
 * @returns {string} CSV string
 */
function convertContactsToCSV(contacts) {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Type', 'Message', 'Date', 'Status', 'Important'];
    
    const rows = contacts.map(contact => {
        const date = new Date(contact.date).toLocaleDateString();
        return [
            contact.id || '',
            contact.fullName || '',
            contact.email || '',
            contact.phone || '',
            contact.contactType || '',
            (contact.message || '').replace(/"/g, '""'), // Escape quotes
            date,
            contact.status || 'unread',
            contact.important ? 'Yes' : 'No'
        ];
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

// ==========================================
// PROJECT MANAGEMENT
// ==========================================

/**
 * Load Project Statistics
 * Updates game, website, and app counts
 */
function loadProjects() {
    console.log('📦 Loading project statistics...');
    
    const gamesCount = document.getElementById('gamesCount');
    const websitesCount = document.getElementById('websitesCount');
    const appsCount = document.getElementById('appsCount');
    
    try {
        if (window.PORTFOLIO_DATA) {
            const games = PORTFOLIO_DATA.games?.length || 0;
            const websites = PORTFOLIO_DATA.websites?.length || 0;
            const apps = PORTFOLIO_DATA.apps?.length || 0;
            
            if (gamesCount) gamesCount.textContent = games;
            if (websitesCount) websitesCount.textContent = websites;
            if (appsCount) appsCount.textContent = apps;
            
            console.log(`✅ Projects: ${games} games, ${websites} websites, ${apps} apps`);
        } else {
            if (gamesCount) gamesCount.textContent = '0';
            if (websitesCount) websitesCount.textContent = '0';
            if (appsCount) appsCount.textContent = '0';
            
            console.warn('⚠️ PORTFOLIO_DATA not available');
        }
    } catch (error) {
        console.error('❌ Error loading projects:', error);
        if (gamesCount) gamesCount.textContent = '0';
        if (websitesCount) websitesCount.textContent = '0';
        if (appsCount) appsCount.textContent = '0';
    }
}

// ==========================================
// TESTIMONIALS MANAGEMENT
// ==========================================

/**
 * Load Testimonials for Admin Review
 */
function loadTestimonialsAdmin() {
    console.log('⭐ Loading testimonials...');
    
    const testimonialsList = document.getElementById('testimonialsList');
    if (!testimonialsList) {
        console.warn('⚠️ Testimonials list not found');
        return;
    }
    
    let testimonials = [];
    
    try {
        // Try to get from localStorage first
        const stored = localStorage.getItem('portfolio_testimonials');
        if (stored) {
            testimonials = JSON.parse(stored);
        } 
        // Fallback to PORTFOLIO_DATA
        else if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.testimonials) {
            testimonials = window.PORTFOLIO_DATA.testimonials.map(t => ({
                ...t,
                approved: true
            }));
        }
        
        console.log(`✅ Loaded ${testimonials.length} testimonials`);
        
    } catch (error) {
        console.error('❌ Error loading testimonials:', error);
        testimonials = [];
    }
    
    // Display testimonials
    if (testimonials.length === 0) {
        testimonialsList.innerHTML = `
            <div class="no-testimonials" style="text-align: center; padding: 60px 20px; opacity: 0.6;">
                <i class="fas fa-comment-dots" style="font-size: 64px; margin-bottom: 20px; display: block; color: var(--text-secondary);"></i>
                <p style="font-size: 18px; margin: 0; color: var(--text-secondary);">No testimonials yet</p>
                <p style="font-size: 14px; margin-top: 8px; color: var(--text-muted);">Testimonials will appear here for approval</p>
            </div>
        `;
        return;
    }
    
    testimonialsList.innerHTML = testimonials.map(testimonial => {
        const date = testimonial.date ? new Date(testimonial.date).toLocaleDateString() : 'Recent';
        
        return `
            <div class="testimonial-item ${testimonial.approved ? 'approved' : 'pending'}" 
                 data-testimonial-id="${testimonial.id}"
                 style="background: var(--card-bg); border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 2px solid ${testimonial.approved ? '#28a745' : '#ffc107'}33; transition: all 0.3s;">
                <div class="testimonial-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <div class="testimonial-client" style="display: flex; align-items: center; gap: 16px;">
                        <img src="${testimonial.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.clientName)}" 
                             alt="${testimonial.clientName}" 
                             class="client-avatar" 
                             style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary);"
                             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=E4572E&color=fff'">
                        <div class="client-info">
                            <h4 style="margin: 0 0 4px 0; font-size: 18px; color: var(--text-primary);">${testimonial.clientName}</h4>
                            <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">${testimonial.clientRole || 'Client'}</p>
                        </div>
                    </div>
                    <div class="testimonial-actions" style="display: flex; align-items: center; gap: 12px;">
                        ${!testimonial.approved ? `
                            <button class="btn-approve" data-testimonial-id="${testimonial.id}" 
                                    title="Approve Testimonial"
                                    style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                                <i class="fas fa-check"></i> Approve
                            </button>
                        ` : ''}
                        <div class="testimonial-rating" style="color: #ffc107;">
                            ${generateStars(testimonial.rating || 5)}
                        </div>
                    </div>
                </div>
                <div class="testimonial-text" style="margin-bottom: 16px; padding: 16px; background: var(--secondary-transparent); border-radius: 8px; border-left: 4px solid var(--primary); font-size: 15px; line-height: 1.6; color: var(--text-primary);">
                    "${testimonial.testimonialText || testimonial.text || 'No testimonial text provided'}"
                </div>
                <div class="testimonial-meta" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; font-size: 14px; color: var(--text-muted);">
                    <span class="project-info" style="display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-${getProjectTypeIcon(testimonial.projectType || 'Website')}"></i>
                        <strong>${testimonial.projectName || 'Project'}</strong> (${testimonial.projectType || 'Website'})
                    </span>
                    <span class="testimonial-date">
                        <i class="fas fa-calendar"></i> ${date}
                    </span>
                    <span class="testimonial-status ${testimonial.approved ? 'approved' : 'pending'}" 
                          style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${testimonial.approved ? '#28a745' : '#ffc107'}22; color: ${testimonial.approved ? '#28a745' : '#ffc107'};">
                        ${testimonial.approved ? '✓ Approved' : '⏳ Pending Approval'}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners for approval buttons
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', function() {
            const testimonialId = parseInt(this.getAttribute('data-testimonial-id'));
            approveTestimonial(testimonialId);
        });
    });
}

/**
 * Approve Testimonial
 * @param {number} testimonialId - The testimonial ID
 */
function approveTestimonial(testimonialId) {
    console.log(`✅ Approving testimonial: ${testimonialId}`);
    
    try {
        const testimonials = JSON.parse(localStorage.getItem('portfolio_testimonials') || '[]');
        const testimonialIndex = testimonials.findIndex(t => t.id === testimonialId);
        
        if (testimonialIndex !== -1) {
            testimonials[testimonialIndex].approved = true;
            localStorage.setItem('portfolio_testimonials', JSON.stringify(testimonials));
            
            loadTestimonialsAdmin();
            updateAdminStats();
            
            console.log('✅ Testimonial approved');
            showNotification('Testimonial approved successfully ⭐', 'success');
        } else {
            console.warn(`⚠️ Testimonial ${testimonialId} not found`);
        }
    } catch (error) {
        console.error('❌ Error approving testimonial:', error);
        showNotification('Error approving testimonial', 'error');
    }
}

/**
 * Generate Star Rating HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with star icons
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

/**
 * Get Project Type Icon
 * @param {string} projectType - Type of project
 * @returns {string} Font Awesome icon name
 */
function getProjectTypeIcon(projectType) {
    const icons = {
        'Website': 'laptop-code',
        'App': 'mobile-alt',
        'Game': 'gamepad',
        'Consultation': 'comments',
        'Development': 'code'
    };
    
    return icons[projectType] || 'star';
}

// ==========================================
// ANALYTICS
// ==========================================

/**
 * Load Website Analytics
 * Updates analytics cards with metrics
 */
function loadAnalytics() {
    console.log('📊 Loading analytics...');
    
    let analytics = {
        pageViews: 1250,
        averageSession: '4m 30s',
        contactRate: '5.2%'
    };
    
    try {
        const stored = localStorage.getItem('portfolio_analytics');
        if (stored) {
            analytics = { ...analytics, ...JSON.parse(stored) };
        }
        
        // Update page views
        const pageViewsEl = document.getElementById('pageViews');
        if (pageViewsEl) {
            pageViewsEl.textContent = (analytics.pageViews || 0).toLocaleString();
        }
        
        // Update contact rate
        const contactRateEl = document.getElementById('contactRate');
        if (contactRateEl) {
            contactRateEl.textContent = analytics.contactRate || '5.2%';
        }
        
        // Update average session
        const avgSessionEl = document.getElementById('avgSession');
        if (avgSessionEl) {
            avgSessionEl.textContent = analytics.averageSession || '4m 30s';
        }
        
        console.log('✅ Analytics loaded');
        
    } catch (error) {
        console.error('❌ Error loading analytics:', error);
    }
}

// ==========================================
// CERTIFICATES MANAGEMENT
// ==========================================

/**
 * Load Certificates for Admin Management
 */
function loadCertificatesAdmin() {
    console.log('📜 Loading certificates...');
    
    const certificatesTableBody = document.getElementById('certificatesTableBody');
    if (!certificatesTableBody) {
        console.warn('⚠️ Certificates table body not found');
        return;
    }
    
    let certificates = [];
    
    try {
        // Try to get from localStorage first
        const stored = localStorage.getItem('portfolio_certificates');
        if (stored) {
            certificates = JSON.parse(stored);
        } 
        // Fallback to PORTFOLIO_DATA
        else if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.certificates) {
            certificates = window.PORTFOLIO_DATA.certificates;
        }
        
        console.log(`✅ Loaded ${certificates.length} certificates`);
        
        // Update certificate statistics
        updateCertificateStats(certificates);
        
    } catch (error) {
        console.error('❌ Error loading certificates:', error);
        certificates = [];
    }
    
    // Display certificates
    displayCertificates(certificates);
}

/**
 * Update Certificate Statistics
 * @param {Array} certificates - Array of certificate objects
 */
function updateCertificateStats(certificates) {
    const developmentCerts = document.getElementById('developmentCerts');
    const designCerts = document.getElementById('designCerts');
    const securityCerts = document.getElementById('securityCerts');
    const cloudCerts = document.getElementById('cloudCerts');
    
    if (!developmentCerts) return;
    
    const counts = {
        development: 0,
        design: 0,
        security: 0,
        cloud: 0
    };
    
    certificates.forEach(cert => {
        const category = cert.category?.toLowerCase() || 'development';
        if (counts.hasOwnProperty(category)) {
            counts[category]++;
        } else {
            counts.development++;
        }
    });
    
    developmentCerts.textContent = counts.development;
    designCerts.textContent = counts.design;
    securityCerts.textContent = counts.security;
    cloudCerts.textContent = counts.cloud;
    
    console.log(`📊 Certificate stats: ${JSON.stringify(counts)}`);
}

/**
 * Display Certificates in Table
 * @param {Array} certificates - Array of certificate objects
 */
function displayCertificates(certificates) {
    const tableBody = document.getElementById('certificatesTableBody');
    if (!tableBody) return;
    
    // Handle empty state
    if (certificates.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 60px 20px;">
                    <div class="no-certificates" style="opacity: 0.6;">
                        <i class="fas fa-award" style="font-size: 64px; margin-bottom: 20px; display: block; color: var(--text-secondary);"></i>
                        <p style="font-size: 18px; color: var(--text-secondary); margin: 0;">No certificates added yet</p>
                        <p style="font-size: 14px; color: var(--text-muted); margin-top: 8px;">Add certificates to showcase your achievements</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Generate table rows
    tableBody.innerHTML = certificates.map(certificate => {
        // Format date
        let formattedDate = 'Recent';
        try {
            const date = new Date(certificate.date);
            formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
            });
        } catch (e) {
            console.warn('⚠️ Error formatting certificate date:', e);
        }
        
        // Determine status and styling
        const isActive = !certificate.expiryDate || new Date(certificate.expiryDate) > new Date();
        const statusText = isActive ? 'Active' : 'Expired';
        const statusClass = isActive ? 'active' : 'expired';
        
        return `
            <tr data-certificate-id="${certificate.id}">
                <td>
                    <div class="certificate-info" style="display: flex; align-items: center; gap: 12px;">
                        <div class="certificate-icon" style="width: 40px; height: 40px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">
                            <i class="fas fa-award"></i>
                        </div>
                        <div>
                            <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">${certificate.title}</strong>
                            <small style="color: var(--text-muted);">${certificate.credentialId || 'No ID'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span style="color: var(--text-primary);">${certificate.issuer}</span>
                </td>
                <td>
                    <span class="certificate-category ${certificate.category?.toLowerCase() || 'development'}" 
                          style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: capitalize; background: var(--primary-transparent); color: var(--primary);">
                        ${certificate.category || 'Development'}
                    </span>
                </td>
                <td>
                    <span style="color: var(--text-primary);">${formattedDate}</span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}" 
                          style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: capitalize; background: ${isActive ? '#28a745' : '#dc3545'}22; color: ${isActive ? '#28a745' : '#dc3545'};">
                        ${statusText}
                    </span>
                </td>
                <td>
                    <div class="certificate-actions" style="display: flex; gap: 8px; justify-content: center;">
                        <button class="btn-view-certificate" data-certificate-id="${certificate.id}" 
                                title="View Details"
                                style="padding: 8px 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-edit-certificate" data-certificate-id="${certificate.id}" 
                                title="Edit"
                                style="padding: 8px 12px; background: var(--secondary); color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete-certificate" data-certificate-id="${certificate.id}" 
                                title="Delete"
                                style="padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Setup event listeners
    setupCertificateEventListeners();
}

/**
 * Setup Certificate Event Listeners
 */
function setupCertificateEventListeners() {
    // View certificate details
    document.querySelectorAll('.btn-view-certificate').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const certificateId = parseInt(this.getAttribute('data-certificate-id'));
            viewCertificateDetails(certificateId);
        });
    });
    
    // Edit certificate
    document.querySelectorAll('.btn-edit-certificate').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const certificateId = parseInt(this.getAttribute('data-certificate-id'));
            editCertificate(certificateId);
        });
    });
    
    // Delete certificate
    document.querySelectorAll('.btn-delete-certificate').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const certificateId = parseInt(this.getAttribute('data-certificate-id'));
            deleteCertificate(certificateId);
        });
    });
}

/**
 * View Certificate Details
 * @param {number} certificateId - The certificate ID
 */
function viewCertificateDetails(certificateId) {
    console.log(`👁️ Viewing certificate: ${certificateId}`);
    
    const certificates = JSON.parse(localStorage.getItem('portfolio_certificates') || '[]');
    const certificate = certificates.find(c => c.id === certificateId);
    
    if (!certificate) {
        console.error('❌ Certificate not found');
        showNotification('Certificate not found', 'error');
        return;
    }
    
    // Redirect to certificate detail page
    window.location.href = `certificate-detail.html?id=${certificateId}`;
}

/**
 * Edit Certificate
 * @param {number} certificateId - The certificate ID
 */
function editCertificate(certificateId) {
    console.log(`✏️ Editing certificate: ${certificateId}`);
    showNotification('Certificate editing feature coming soon', 'info');
    // Future implementation: Open certificate edit modal/form
}

/**
 * Delete Certificate
 * @param {number} certificateId - The certificate ID
 */
function deleteCertificate(certificateId) {
    if (!confirm('⚠️ Are you sure you want to delete this certificate?\n\nThis action cannot be undone.')) {
        return;
    }
    
    console.log(`🗑️ Deleting certificate: ${certificateId}`);
    
    try {
        const certificates = JSON.parse(localStorage.getItem('portfolio_certificates') || '[]');
        const filteredCertificates = certificates.filter(c => c.id !== certificateId);
        
        localStorage.setItem('portfolio_certificates', JSON.stringify(filteredCertificates));
        
        // Reload certificates
        loadCertificatesAdmin();
        
        console.log('✅ Certificate deleted successfully');
        showNotification('Certificate deleted successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error deleting certificate:', error);
        showNotification('Error deleting certificate', 'error');
    }
}

/**
 * Setup Certificate Buttons
 */
function setupCertificateButtons() {
    // Add certificate button
    const addCertificateBtn = document.getElementById('addCertificate');
    if (addCertificateBtn) {
        addCertificateBtn.addEventListener('click', () => {
            showNotification('Certificate creation coming soon', 'info');
            // Future implementation: Open certificate creation modal/form
        });
    }
    
    // Refresh certificates button
    const refreshCertificatesBtn = document.getElementById('refreshCertificates');
    if (refreshCertificatesBtn) {
        refreshCertificatesBtn.addEventListener('click', () => {
            loadCertificatesAdmin();
            showNotification('Certificates refreshed', 'success');
        });
    }
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

/**
 * Show Notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Check if global showNotification exists
    if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    console.log(`📢 Notification [${type}]: ${message}`);
    
    // Fallback notification system
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        'error': '#dc3545',
        'success': '#28a745',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    
    const icons = {
        'error': 'fas fa-exclamation-circle',
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    notification.style.cssText = `
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 20px;
        margin-bottom: 12px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        min-width: 300px;
        font-weight: 500;
        font-size: 14px;
    `;
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}" style="font-size: 20px;"></i>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.remove()" 
                style="background: none; border: none; color: white; cursor: pointer; padding: 4px; font-size: 18px; opacity: 0.8; transition: opacity 0.3s;"
                onmouseover="this.style.opacity='1'" 
                onmouseout="this.style.opacity='0.8'">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

// Make functions globally available
window.initializeAdminPage = initializeAdminPage;
window.deleteContact = deleteContact;
window.approveTestimonial = approveTestimonial;
window.loadContacts = loadContacts;
window.refreshAllData = refreshAllData;
window.exportAllData = exportAllData;
window.clearAllData = clearAllData;
window.backupAllData = backupAllData;
window.viewContactDetails = viewContactDetails;
window.toggleContactImportant = toggleContactImportant;

// ==========================================
// AUTO-INITIALIZATION
// ==========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM loaded, initializing admin panel...');
        setTimeout(initializeAdminPage, 100);
    });
} else {
    // DOM already loaded
    console.log('📄 DOM already loaded, initializing admin panel...');
    setTimeout(initializeAdminPage, 100);
}

console.log('✅ Admin.js module loaded successfully');
console.log('🎨 Admin Panel v2.0 - All systems ready!');