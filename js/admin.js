// ==========================================
// ADMIN PANEL - Admin dashboard functionality
// Handles contact management, analytics, and data export
// ==========================================

// Global Variables
let currentContacts = [];
let currentPage = 1;
const contactsPerPage = 10;

// Initialize Admin Page
function initializeAdminPage() {
    loadDashboard();
    setupAdminEventListeners();
    loadContacts();
    loadProjects();
    loadTestimonialsAdmin();
    loadAnalytics();
}

// Load Dashboard
function loadDashboard() {
    updateAdminStats();
}

// Update Admin Stats
function updateAdminStats() {
    const totalContacts = document.getElementById('totalContacts');
    const totalProjects = document.getElementById('totalProjects');
    const totalTestimonials = document.getElementById('totalTestimonials');
    
    if (totalContacts) {
        const contacts = getContacts();
        totalContacts.textContent = contacts.length;
    }
    
    if (totalProjects) {
        const total = PORTFOLIO_DATA.games.length + PORTFOLIO_DATA.websites.length + PORTFOLIO_DATA.apps.length;
        totalProjects.textContent = total;
    }
    
    if (totalTestimonials) {
        const testimonials = getTestimonials().filter(t => t.approved !== false);
        totalTestimonials.textContent = testimonials.length;
    }
}

// Setup Admin Event Listeners
function setupAdminEventListeners() {
    // Quick actions
    setupQuickActions();
    
    // Contact management
    setupContactManagement();
    
    // Export functionality
    setupExportFunctionality();
}

// Quick Actions
function setupQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    switch (action) {
        case 'export-data':
            exportData();
            break;
        case 'clear-data':
            clearData();
            break;
        case 'refresh-data':
            refreshData();
            break;
        case 'backup-data':
            backupData();
            break;
    }
}

function exportData() {
    const data = {
        contacts: getContacts(),
        testimonials: getTestimonials(),
        analytics: getAnalytics(),
        portfolio: PORTFOLIO_DATA
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
    
    showNotification('Data exported successfully', 'success');
}

function clearData() {
    if (confirm('Are you sure you want to clear all contact data? This action cannot be undone.')) {
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
        loadContacts();
        updateAdminStats();
        showNotification('Contact data cleared successfully', 'success');
    }
}

function refreshData() {
    loadContacts();
    loadProjects();
    loadTestimonialsAdmin();
    loadAnalytics();
    showNotification('Data refreshed successfully', 'success');
}

function backupData() {
    // In a real application, this would send data to a backup service
    showNotification('Backup functionality would be implemented here', 'info');
}

// Contact Management
function setupContactManagement() {
    const clearContactsBtn = document.getElementById('clearContacts');
    const exportContactsBtn = document.getElementById('exportContacts');
    
    if (clearContactsBtn) {
        clearContactsBtn.addEventListener('click', clearContacts);
    }
    
    if (exportContactsBtn) {
        exportContactsBtn.addEventListener('click', exportContacts);
    }
}

function loadContacts() {
    currentContacts = getContacts();
    displayContacts(currentContacts);
    setupContactPagination();
}

function displayContacts(contacts) {
    const tableBody = document.getElementById('contactsTableBody');
    if (!tableBody) return;
    
    // Pagination
    const startIndex = (currentPage - 1) * contactsPerPage;
    const paginatedContacts = contacts.slice(startIndex, startIndex + contactsPerPage);
    
    if (contacts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="no-contacts">
                        <i class="fas fa-inbox"></i>
                        <p>No contact submissions yet</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = paginatedContacts.map(contact => `
        <tr class="${contact.status === 'unread' ? 'unread' : ''} ${contact.important ? 'important' : ''}">
            <td>
                <div class="contact-name">
                    ${contact.important ? '<i class="fas fa-star important-star"></i>' : ''}
                    ${contact.fullName}
                </div>
            </td>
            <td>${contact.email}</td>
            <td>${contact.phone || 'N/A'}</td>
            <td>
                <span class="contact-type ${contact.contactType}">
                    ${contact.contactType}
                </span>
            </td>
            <td>${formatDate(contact.date)}</td>
            <td>
                <span class="status-badge ${contact.status}">
                    ${contact.status}
                </span>
            </td>
            <td>
                <div class="contact-actions">
                    <button class="btn-view-contact" data-contact-id="${contact.id}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-mark-important" data-contact-id="${contact.id}" title="${contact.important ? 'Remove Important' : 'Mark Important'}">
                        <i class="fas ${contact.important ? 'fa-star' : 'fa-star'}"></i>
                    </button>
                    <button class="btn-delete-contact" data-contact-id="${contact.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners
    setupContactRowListeners();
}

function setupContactPagination() {
    const pagination = document.getElementById('contactsPagination');
    const contactsCount = document.getElementById('contactsCount');
    
    if (!pagination) return;
    
    const totalPages = Math.ceil(currentContacts.length / contactsPerPage);
    
    if (contactsCount) {
        const start = (currentPage - 1) * contactsPerPage + 1;
        const end = Math.min(start + contactsPerPage - 1, currentContacts.length);
        contactsCount.textContent = `${start}-${end} of ${currentContacts.length}`;
    }
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" data-page="${currentPage - 1}">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active" data-page="${i}">${i}</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" data-page="${currentPage + 1}">Next</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
    
    // Add event listeners to pagination buttons
    pagination.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            currentPage = page;
            displayContacts(currentContacts);
        });
    });
}

function setupContactRowListeners() {
    // View contact details
    document.querySelectorAll('.btn-view-contact').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            viewContactDetails(contactId);
        });
    });
    
    // Mark as important
    document.querySelectorAll('.btn-mark-important').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            toggleContactImportant(contactId);
        });
    });
    
    // Delete contact
    document.querySelectorAll('.btn-delete-contact').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            deleteContact(contactId);
        });
    });
}

function viewContactDetails(contactId) {
    const contact = currentContacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const modal = document.getElementById('contactModal');
    const modalBody = document.getElementById('contactModalBody');
    
    if (!modal || !modalBody) return;
    
    // Mark as read when viewing
    if (contact.status === 'unread') {
        updateContactStatus(contactId, { status: 'read' });
        loadContacts(); // Reload to update status
    }
    
    modalBody.innerHTML = `
        <div class="contact-details">
            <div class="detail-group">
                <label>Full Name:</label>
                <p>${contact.fullName}</p>
            </div>
            <div class="detail-group">
                <label>Email:</label>
                <p><a href="mailto:${contact.email}">${contact.email}</a></p>
            </div>
            <div class="detail-group">
                <label>Phone:</label>
                <p>${contact.phone || 'Not provided'}</p>
            </div>
            <div class="detail-group">
                <label>Contact Type:</label>
                <p>${contact.contactType}</p>
            </div>
            ${contact.projectDetails ? `
            <div class="detail-group">
                <label>Project Details:</label>
                <p>${contact.projectDetails}</p>
            </div>
            ` : ''}
            ${contact.feedback ? `
            <div class="detail-group">
                <label>Feedback:</label>
                <p>${contact.feedback}</p>
            </div>
            ` : ''}
            <div class="detail-group">
                <label>Message:</label>
                <p class="contact-message">${contact.message}</p>
            </div>
            <div class="detail-group">
                <label>Submitted:</label>
                <p>${formatDate(contact.date)}</p>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Setup modal close
    const modalClose = document.getElementById('contactModalClose');
    const closeBtn = document.getElementById('closeContactModal');
    const markReadBtn = document.getElementById('markContactRead');
    
    if (modalClose) {
        modalClose.onclick = closeContactModal;
    }
    
    if (closeBtn) {
        closeBtn.onclick = closeContactModal;
    }
    
    if (markReadBtn) {
        markReadBtn.onclick = function() {
            updateContactStatus(contactId, { status: 'read' });
            closeContactModal();
            loadContacts();
            showNotification('Contact marked as read', 'success');
        };
    }
    
    // Close on backdrop click
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeContactModal();
        }
    };
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

function toggleContactImportant(contactId) {
    const contact = currentContacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const important = !contact.important;
    updateContactStatus(contactId, { important });
    loadContacts();
    
    showNotification(
        important ? 'Contact marked as important' : 'Contact removed from important',
        'success'
    );
}

function clearContacts() {
    if (confirm('Are you sure you want to clear all contact submissions? This action cannot be undone.')) {
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify([]));
        loadContacts();
        updateAdminStats();
        showNotification('All contacts cleared successfully', 'success');
    }
}

function exportContacts() {
    const contacts = getContacts();
    const csv = convertToCSV(contacts);
    const blob = new Blob([csv], { type: 'text/csv' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Contacts exported to CSV successfully', 'success');
}

function convertToCSV(contacts) {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Message', 'Date'];
    const rows = contacts.map(contact => [
        contact.fullName,
        contact.email,
        contact.phone || '',
        contact.contactType,
        contact.message.replace(/"/g, '""'),
        formatDate(contact.date)
    ]);
    
    return [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
}

// Projects Management
function loadProjects() {
    const gamesCount = document.getElementById('gamesCount');
    const websitesCount = document.getElementById('websitesCount');
    const appsCount = document.getElementById('appsCount');
    
    if (gamesCount) gamesCount.textContent = PORTFOLIO_DATA.games.length;
    if (websitesCount) websitesCount.textContent = PORTFOLIO_DATA.websites.length;
    if (appsCount) appsCount.textContent = PORTFOLIO_DATA.apps.length;
}

// Testimonials Management (Admin)
function loadTestimonialsAdmin() {
    const testimonialsList = document.getElementById('testimonialsList');
    if (!testimonialsList) return;
    
    const testimonials = getTestimonials();
    
    if (testimonials.length === 0) {
        testimonialsList.innerHTML = `
            <div class="no-testimonials">
                <i class="fas fa-comment-dots"></i>
                <p>No testimonials yet</p>
            </div>
        `;
        return;
    }
    
    testimonialsList.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-item ${testimonial.approved ? 'approved' : 'pending'}" data-testimonial-id="${testimonial.id}">
            <div class="testimonial-header">
                <div class="testimonial-client">
                    <img src="${testimonial.avatar}" alt="${testimonial.clientName}" class="client-avatar">
                    <div class="client-info">
                        <h4>${testimonial.clientName}</h4>
                        <p>${testimonial.clientRole}</p>
                    </div>
                </div>
                <div class="testimonial-actions">
                    ${!testimonial.approved ? `
                        <button class="btn-approve" data-testimonial-id="${testimonial.id}" title="Approve">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <div class="testimonial-rating">
                        ${generateStars(testimonial.rating)}
                    </div>
                </div>
            </div>
            <div class="testimonial-text">
                "${testimonial.testimonialText}"
            </div>
            <div class="testimonial-meta">
                <span class="project-info">
                    <i class="fas fa-${getProjectTypeIcon(testimonial.projectType)}"></i>
                    ${testimonial.projectName} (${testimonial.projectType})
                </span>
                <span class="testimonial-date">
                    ${formatDate(testimonial.date)}
                </span>
                <span class="testimonial-status ${testimonial.approved ? 'approved' : 'pending'}">
                    ${testimonial.approved ? 'Approved' : 'Pending Approval'}
                </span>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for approval
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', function() {
            const testimonialId = parseInt(this.getAttribute('data-testimonial-id'));
            approveTestimonial(testimonialId);
            loadTestimonialsAdmin();
            showNotification('Testimonial approved successfully', 'success');
        });
    });
}

// Analytics
function loadAnalytics() {
    const analytics = getAnalytics();
    
    const pageViews = document.getElementById('pageViews');
    const contactRate = document.getElementById('contactRate');
    const avgSession = document.getElementById('avgSession');
    
    if (pageViews) pageViews.textContent = analytics.pageViews?.toLocaleString() || '0';
    if (contactRate) contactRate.textContent = '5.2%'; // This would be calculated from analytics
    if (avgSession) avgSession.textContent = analytics.averageSession || '4m 30s';
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminPage);
} else {
    initializeAdminPage();
}