// ==========================================
// ADMIN PANEL - SIMPLIFIED VERSION
// Only contact management and testimonial approval
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
        loadTestimonialsAdmin();
        
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
 */
function loadDashboard() {
    console.log('📊 Loading dashboard...');
    updateAdminStats();
}

/**
 * Update Admin Statistics
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
 */
function setupAdminEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Contact management buttons
    setupContactManagement();
    
    console.log('✅ Event listeners setup complete');
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
        // Fallback to sample data
        else {
            testimonials = [
                {
                    id: 1,
                    clientName: "Sarah Johnson",
                    clientRole: "Product Manager at TechInnovate",
                    projectType: "website",
                    projectName: "E-Commerce Platform",
                    rating: 5,
                    testimonialText: "Arsh delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise transformed our online presence.",
                    date: "2024-10-15",
                    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=E4572E&color=fff",
                    approved: true
                },
                {
                    id: 2,
                    clientName: "Mike Chen",
                    clientRole: "CEO at GameStudio Pro",
                    projectType: "game",
                    projectName: "Mobile Adventure Game",
                    rating: 5,
                    testimonialText: "Working with Arsh on our mobile game was a fantastic experience. His Unity expertise and creative problem-solving helped us launch 2 weeks ahead of schedule.",
                    date: "2024-09-22",
                    avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=E4572E&color=fff",
                    approved: false
                }
            ];
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
                        <img src="${testimonial.avatar}" 
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
                        ` : `
                            <button class="btn-delete-testimonial" data-testimonial-id="${testimonial.id}" 
                                    title="Delete Testimonial"
                                    style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        `}
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
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.btn-delete-testimonial').forEach(btn => {
        btn.addEventListener('click', function() {
            const testimonialId = parseInt(this.getAttribute('data-testimonial-id'));
            deleteTestimonial(testimonialId);
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
 * Delete Testimonial
 * @param {number} testimonialId - The testimonial ID
 */
function deleteTestimonial(testimonialId) {
    if (!confirm('⚠️ Are you sure you want to delete this testimonial?\n\nThis action cannot be undone.')) {
        return;
    }
    
    console.log(`🗑️ Deleting testimonial: ${testimonialId}`);
    
    try {
        const testimonials = JSON.parse(localStorage.getItem('portfolio_testimonials') || '[]');
        const filteredTestimonials = testimonials.filter(t => t.id !== testimonialId);
        
        localStorage.setItem('portfolio_testimonials', JSON.stringify(filteredTestimonials));
        
        loadTestimonialsAdmin();
        updateAdminStats();
        
        console.log('✅ Testimonial deleted successfully');
        showNotification('Testimonial deleted successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error deleting testimonial:', error);
        showNotification('Error deleting testimonial', 'error');
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
window.deleteTestimonial = deleteTestimonial;
window.loadContacts = loadContacts;
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
console.log('🎨 Admin Panel - Simplified & Ready!');