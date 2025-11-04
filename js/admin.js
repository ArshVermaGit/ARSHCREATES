// ============================================
// ADMIN PANEL MANAGEMENT SYSTEM
// ============================================

class AdminPanel {
  constructor() {
    this.feedback = [];
    this.filters = {
      status: 'all',
      search: '',
      sort: 'date-desc'
    };
    this.selectedItems = new Set();
    this.currentView = 'card';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.initializeCharts();
    this.renderFeedback();
    this.updateStats();
    this.renderActivity();
  }

  async loadData() {
    try {
      const stored = localStorage.getItem('portfolio_feedback');
      this.feedback = stored ? JSON.parse(stored) : ADMIN_CONFIG.feedback;
    } catch (error) {
      console.error('Error loading feedback data:', error);
      this.feedback = ADMIN_CONFIG.feedback;
    }
  }

  async saveData() {
    try {
      localStorage.setItem('portfolio_feedback', JSON.stringify(this.feedback));
    } catch (error) {
      console.error('Error saving feedback data:', error);
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById('feedbackSearch');
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(() => {
        this.filters.search = searchInput.value;
        this.currentPage = 1;
        this.renderFeedback();
      }, 300));
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filters.status = btn.dataset.filter;
        this.currentPage = 1;
        this.updateFilterButtons(btn);
        this.renderFeedback();
      });
    });

    document.querySelectorAll('[data-sort]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filters.sort = btn.dataset.sort;
        this.updateSortButtons(btn);
        this.renderFeedback();
      });
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentView = btn.dataset.view;
        this.updateViewButtons(btn);
        this.renderFeedback();
      });
    });

    this.setupBulkActions();
    this.setupExportFunctionality();
    
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshData());
    }

    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }

  updateFilterButtons(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  updateSortButtons(activeBtn) {
    document.querySelectorAll('[data-sort]').forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  updateViewButtons(activeBtn) {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  setupBulkActions() {
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.feedback-checkbox');
        checkboxes.forEach(checkbox => {
          checkbox.checked = e.target.checked;
          this.toggleItemSelection(checkbox);
        });
      });
    }

    const bulkActions = {
      'bulkMarkRead': () => this.bulkUpdateStatus('read'),
      'bulkMarkImportant': () => this.bulkToggleImportant(),
      'bulkArchive': () => this.bulkArchive(),
      'bulkDelete': () => this.bulkDelete(),
      'bulkCancel': () => this.cancelBulkSelection()
    };

    Object.entries(bulkActions).forEach(([id, action]) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', action);
    });
  }

  setupExportFunctionality() {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.openExportModal());
    }

    document.querySelectorAll('.export-option').forEach(option => {
      option.addEventListener('click', () => {
        const format = option.dataset.format;
        this.exportData(format);
      });
    });
  }

  renderFeedback() {
    const filtered = this.getFilteredFeedback();
    const paginated = this.paginateFeedback(filtered);
    
    this.renderFeedbackCards(paginated);
    this.renderFeedbackTable(paginated);
    this.updatePagination(filtered.length);
    this.updateBulkActions();
    this.updateEmptyState(filtered.length);
  }

  getFilteredFeedback() {
    let filtered = [...this.feedback];

    if (this.filters.status !== 'all') {
      filtered = filtered.filter(item => {
        switch (this.filters.status) {
          case 'unread': return item.status === 'unread';
          case 'resolved': return item.resolved;
          case 'important': return item.important;
          default: return true;
        }
      });
    }

    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.message.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      switch (this.filters.sort) {
        case 'date-asc': return dateA - dateB;
        case 'name': return a.name.localeCompare(b.name);
        case 'type': return a.type.localeCompare(b.type);
        case 'date-desc':
        default: return dateB - dateA;
      }
    });

    return filtered;
  }

  paginateFeedback(feedback) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return feedback.slice(start, end);
  }

  renderFeedbackCards(feedback) {
    const container = document.getElementById('feedbackList');
    if (!container) return;

    if (feedback.length === 0) {
      container.innerHTML = '';
      return;
    }

    const cardsHTML = feedback.map(item => this.createFeedbackCard(item)).join('');
    container.innerHTML = cardsHTML;
    
    this.attachCardEventListeners();
  }

  createFeedbackCard(item) {
    const statusClass = item.status === 'unread' ? 'unread' : '';
    const importantClass = item.important ? 'important' : '';
    const resolvedClass = item.resolved ? 'resolved' : '';
    
    return `
      <div class="feedback-card ${statusClass} ${importantClass} ${resolvedClass}" data-id="${item.id}">
        <div class="feedback-select">
          <input type="checkbox" class="feedback-checkbox" data-id="${item.id}">
        </div>
        <div class="feedback-status">
          <span class="status-indicator ${item.status}"></span>
        </div>
        <div class="feedback-header">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info">
            <h4 class="user-name">${item.name}</h4>
            <p class="user-email">${item.email}</p>
          </div>
          <div class="feedback-meta">
            <span class="feedback-time">${formatRelativeTime(item.timestamp)}</span>
            <span class="feedback-type">${item.type}</span>
          </div>
        </div>
        <div class="feedback-body">
          <p class="feedback-message">${item.message}</p>
        </div>
        <div class="feedback-footer">
          <button class="action-btn" data-action="reply" data-id="${item.id}">
            <i class="fas fa-reply"></i> Reply
          </button>
          <button class="action-btn" data-action="star" data-id="${item.id}">
            <i class="${item.important ? 'fas' : 'far'} fa-star"></i> Important
          </button>
          <button class="action-btn" data-action="resolve" data-id="${item.id}">
            <i class="fas fa-check"></i> ${item.resolved ? 'Unresolve' : 'Resolve'}
          </button>
          <button class="action-btn text-danger" data-action="delete" data-id="${item.id}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }

  renderFeedbackTable(feedback) {
    const container = document.getElementById('feedbackTableBody');
    if (!container) return;

    if (feedback.length === 0) {
      container.innerHTML = '';
      return;
    }

    const rowsHTML = feedback.map(item => this.createTableRow(item)).join('');
    container.innerHTML = rowsHTML;
    
    this.attachTableEventListeners();
  }

  createTableRow(item) {
    return `
      <tr data-id="${item.id}" class="${item.status === 'unread' ? 'unread' : ''}">
        <td><input type="checkbox" class="feedback-checkbox" data-id="${item.id}"></td>
        <td>
          <span class="status-indicator ${item.status}"></span>
          ${item.important ? '<i class="fas fa-star text-warning"></i>' : ''}
        </td>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td><span class="badge">${item.type}</span></td>
        <td class="truncate">${item.message}</td>
        <td>${formatRelativeTime(item.timestamp)}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn btn-sm" data-action="reply" data-id="${item.id}" title="Reply">
              <i class="fas fa-reply"></i>
            </button>
            <button class="action-btn btn-sm" data-action="star" data-id="${item.id}" title="Important">
              <i class="${item.important ? 'fas' : 'far'} fa-star"></i>
            </button>
            <button class="action-btn btn-sm" data-action="resolve" data-id="${item.id}" title="${item.resolved ? 'Unresolve' : 'Resolve'}">
              <i class="fas fa-check"></i>
            </button>
            <button class="action-btn btn-sm text-danger" data-action="delete" data-id="${item.id}" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  attachCardEventListeners() {
    document.querySelectorAll('.feedback-card .action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        this.handleAction(action, id);
      });
    });

    document.querySelectorAll('.feedback-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.toggleItemSelection(checkbox));
    });
  }

  attachTableEventListeners() {
    document.querySelectorAll('#feedbackTableBody .action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        this.handleAction(action, id);
      });
    });

    document.querySelectorAll('#feedbackTableBody .feedback-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.toggleItemSelection(checkbox));
    });
  }

  handleAction(action, id) {
    const item = this.feedback.find(f => f.id == id);
    if (!item) return;

    switch (action) {
      case 'reply':
        this.openReplyModal(item);
        break;
      case 'star':
        this.toggleImportant(id);
        break;
      case 'resolve':
        this.toggleResolved(id);
        break;
      case 'delete':
        this.deleteItem(id);
        break;
    }
  }

  toggleItemSelection(checkbox) {
    const id = checkbox.dataset.id;
    
    if (checkbox.checked) {
      this.selectedItems.add(id);
    } else {
      this.selectedItems.delete(id);
    }

    this.updateBulkActions();
  }

  updateBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    const selectAll = document.getElementById('selectAll');

    if (bulkActions && selectedCount) {
      if (this.selectedItems.size > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = this.selectedItems.size;
      } else {
        bulkActions.style.display = 'none';
      }
    }

    if (selectAll) {
      const checkboxes = document.querySelectorAll('.feedback-checkbox');
      const checkedCount = document.querySelectorAll('.feedback-checkbox:checked').length;
      selectAll.checked = checkedCount > 0 && checkedCount === checkboxes.length;
      selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    }
  }

  bulkUpdateStatus(status) {
    this.selectedItems.forEach(id => {
      const item = this.feedback.find(f => f.id == id);
      if (item) item.status = status;
    });
    
    this.saveData();
    this.renderFeedback();
    this.updateStats();
    this.showNotification(`${this.selectedItems.size} items marked as ${status}`, 'success');
    this.cancelBulkSelection();
  }

  bulkToggleImportant() {
    this.selectedItems.forEach(id => {
      const item = this.feedback.find(f => f.id == id);
      if (item) item.important = !item.important;
    });
    
    this.saveData();
    this.renderFeedback();
    this.showNotification(`Important status updated for ${this.selectedItems.size} items`, 'success');
    this.cancelBulkSelection();
  }

  bulkArchive() {
    this.showNotification(`${this.selectedItems.size} items archived`, 'success');
    this.cancelBulkSelection();
  }

  bulkDelete() {
    if (confirm(`Are you sure you want to delete ${this.selectedItems.size} items?`)) {
      this.feedback = this.feedback.filter(item => !this.selectedItems.has(item.id.toString()));
      this.saveData();
      this.renderFeedback();
      this.updateStats();
      this.showNotification(`${this.selectedItems.size} items deleted`, 'success');
      this.cancelBulkSelection();
    }
  }

  cancelBulkSelection() {
    this.selectedItems.clear();
    document.querySelectorAll('.feedback-checkbox').forEach(checkbox => {
      checkbox.checked = false;
    });
    this.updateBulkActions();
  }

  toggleImportant(id) {
    const item = this.feedback.find(f => f.id == id);
    if (item) {
      item.important = !item.important;
      this.saveData();
      this.renderFeedback();
      this.showNotification(`Marked as ${item.important ? 'important' : 'not important'}`, 'success');
    }
  }

  toggleResolved(id) {
    const item = this.feedback.find(f => f.id == id);
    if (item) {
      item.resolved = !item.resolved;
      item.status = 'read';
      this.saveData();
      this.renderFeedback();
      this.updateStats();
      this.showNotification(`Marked as ${item.resolved ? 'resolved' : 'unresolved'}`, 'success');
    }
  }

  deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.feedback = this.feedback.filter(item => item.id != id);
      this.saveData();
      this.renderFeedback();
      this.updateStats();
      this.showNotification('Item deleted successfully', 'success');
    }
  }

  openReplyModal(item) {
    console.log('Opening reply modal for:', item);
  }

  updateStats() {
    const total = this.feedback.length;
    const resolved = this.feedback.filter(item => item.resolved).length;
    const pending = this.feedback.filter(item => !item.resolved).length;
    const unread = this.feedback.filter(item => item.status === 'unread').length;

    this.updateStatCard('totalMessages', total);
    this.updateStatCard('resolvedMessages', resolved);
    this.updateStatCard('pendingMessages', pending);
    
    const badge = document.getElementById('feedbackCount');
    if (badge) badge.textContent = unread;
  }

  updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      this.animateCounter(element, value);
    }
  }

  animateCounter(element, target) {
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    let currentValue = current;

    const timer = setInterval(() => {
      currentValue += increment;
      element.textContent = currentValue;

      if (currentValue === target) {
        clearInterval(timer);
      }
    }, 20);
  }

  updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pagesContainer = document.getElementById('paginationPages');

    if (!pagination) return;

    pagination.style.display = totalPages > 1 ? 'flex' : 'none';

    if (prevBtn) prevBtn.disabled = this.currentPage === 1;
    if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;

    if (pagesContainer) {
      let pagesHTML = '';
      const maxVisiblePages = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pagesHTML += `<span class="page-ellipsis">...</span>`;
      }

      for (let i = startPage; i <= endPage; i++) {
        pagesHTML += `
          <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                  data-page="${i}">${i}</button>
        `;
      }

      if (endPage < totalPages) {
        pagesHTML += `<span class="page-ellipsis">...</span>`;
      }

      pagesContainer.innerHTML = pagesHTML;

      pagesContainer.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentPage = parseInt(btn.dataset.page);
          this.renderFeedback();
        });
      });
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderFeedback();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderFeedback();
        }
      };
    }
  }

  updateEmptyState(itemCount) {
    const emptyState = document.getElementById('emptyState');
    const feedbackList = document.getElementById('feedbackList');
    const feedbackTable = document.getElementById('feedbackTable');

    if (emptyState) {
      emptyState.style.display = itemCount === 0 ? 'block' : 'none';
    }

    if (feedbackList) {
      feedbackList.style.display = itemCount > 0 && this.currentView === 'card' ? 'grid' : 'none';
    }
    if (feedbackTable) {
      feedbackTable.style.display = itemCount > 0 && this.currentView === 'table' ? 'block' : 'none';
    }
  }

  initializeCharts() {
    this.initializeMessagesChart();
    this.initializeTypesChart();
  }

  initializeMessagesChart() {
    const ctx = document.getElementById('messagesChart');
    if (!ctx) return;

    console.log('Initializing messages chart');
  }

  initializeTypesChart() {
    const ctx = document.getElementById('typesChart');
    if (!ctx) return;

    console.log('Initializing types chart');
  }

  renderActivity() {
    const container = document.getElementById('activityList');
    if (!container) return;

    const activities = ADMIN_CONFIG.activity.slice(0, 5);
    const activitiesHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
        </div>
        <div class="activity-content">
          <p>${activity.description}</p>
          <span class="activity-time">${formatRelativeTime(activity.timestamp)}</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = activitiesHTML;
  }

  getActivityIcon(type) {
    const icons = {
      'new_message': 'envelope',
      'message_resolved': 'check',
      'export_data': 'download',
      'login': 'sign-in-alt'
    };
    return icons[type] || 'circle';
  }

  exportData(format) {
    const data = this.getFilteredFeedback();
    exportData(data, format);
    this.showNotification(`Data exported as ${format.toUpperCase()}`, 'success');
  }

  openExportModal() {
    console.log('Opening export modal');
  }

  refreshData() {
    this.loadData().then(() => {
      this.renderFeedback();
      this.updateStats();
      this.showNotification('Data refreshed successfully', 'success');
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    
    const icon = document.querySelector('#themeBtn i');
    if (icon) {
      icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin_session');
      window.location.href = 'index.html';
    }
  }

  showNotification(message, type = 'info') {
    if (window.portfolioApp) {
      window.portfolioApp.showNotification(message, type);
    } else {
      alert(`${type.toUpperCase()}: ${message}`);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.admin-body')) {
    window.adminPanel = new AdminPanel();
  }
});