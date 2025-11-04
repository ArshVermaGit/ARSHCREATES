// Admin Panel Script
class AdminPanel {
  constructor() {
    this.messages = [];
    this.currentMessage = null;
    this.init();
  }

  init() {
    this.loadMessages();
    this.setupTheme();
    this.setupEventListeners();
    this.renderMessages();
    this.updateStats();
  }

  loadMessages() {
    // Load messages from localStorage
    this.messages = JSON.parse(localStorage.getItem('contacts') || '[]');
  }

  saveMessages() {
    localStorage.setItem('contacts', JSON.stringify(this.messages));
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

  setupEventListeners() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
      this.loadMessages();
      this.renderMessages();
      this.updateStats();
      this.showNotification('Data refreshed');
    });

    // Clear all button
    document.getElementById('clearAllBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all messages?')) {
        this.messages = [];
        this.saveMessages();
        this.renderMessages();
        this.updateStats();
        this.showNotification('All messages deleted');
      }
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.filterMessages(e.target.value);
    });

    // Modal close
    document.getElementById('closeModal').addEventListener('click', () => {
      this.closeModal();
    });

    document.querySelector('.modal-overlay').addEventListener('click', () => {
      this.closeModal();
    });

    // Modal actions
    document.getElementById('markReadBtn').addEventListener('click', () => {
      this.markAsRead();
    });

    document.getElementById('deleteMessageBtn').addEventListener('click', () => {
      this.deleteMessage();
    });
  }

  renderMessages() {
    const container = document.getElementById('feedbackList');
    const emptyState = document.getElementById('emptyState');

    if (this.messages.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    container.style.display = 'flex';
    emptyState.style.display = 'none';

    // Sort by timestamp (newest first)
    const sortedMessages = [...this.messages].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    container.innerHTML = sortedMessages.map(msg => this.createMessageCard(msg)).join('');

    // Add click listeners
    document.querySelectorAll('.feedback-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.action-btn')) {
          const id = parseInt(item.dataset.id);
          this.showMessageDetail(id);
        }
      });
    });

    // Add action button listeners
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === 'delete') {
          this.quickDelete(id);
        } else if (action === 'read') {
          this.quickMarkRead(id);
        }
      });
    });
  }

  createMessageCard(msg) {
    const isUnread = msg.status === 'unread';
    const timeAgo = this.getTimeAgo(msg.timestamp);

    return `
      <div class="feedback-item ${isUnread ? 'unread' : ''}" data-id="${msg.id}">
        <div class="feedback-header">
          <div class="feedback-user">
            <div class="feedback-name">${msg.name}</div>
            <div class="feedback-email">${msg.email}</div>
          </div>
          <div class="feedback-meta">
            <div class="feedback-time">${timeAgo}</div>
            <span class="feedback-status ${msg.status}">${msg.status}</span>
          </div>
        </div>
        <div class="feedback-message">${msg.message}</div>
        <div class="feedback-actions">
          ${isUnread ? `
            <button class="action-btn" data-id="${msg.id}" data-action="read">
              <i class="fas fa-check"></i> Mark Read
            </button>
          ` : ''}
          <button class="action-btn danger" data-id="${msg.id}" data-action="delete">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }

  filterMessages(query) {
    const items = document.querySelectorAll('.feedback-item');
    const searchQuery = query.toLowerCase();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchQuery)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  showMessageDetail(id) {
    const message = this.messages.find(m => m.id === id);
    if (!message) return;

    this.currentMessage = message;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
      <div class="message-detail">
        <div class="detail-row">
          <div class="detail-label">Name</div>
          <div class="detail-value">${message.name}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Email</div>
          <div class="detail-value">${message.email}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Date</div>
          <div class="detail-value">${new Date(message.timestamp).toLocaleString()}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status</div>
          <div class="detail-value">${message.status}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Message</div>
          <div class="detail-value">${message.message}</div>
        </div>
      </div>
    `;

    document.getElementById('messageModal').classList.add('active');
  }

  closeModal() {
    document.getElementById('messageModal').classList.remove('active');
    this.currentMessage = null;
  }

  markAsRead() {
    if (!this.currentMessage) return;

    const index = this.messages.findIndex(m => m.id === this.currentMessage.id);
    if (index !== -1) {
      this.messages[index].status = 'read';
      this.saveMessages();
      this.renderMessages();
      this.updateStats();
      this.closeModal();
      this.showNotification('Message marked as read');
    }
  }

  quickMarkRead(id) {
    const index = this.messages.findIndex(m => m.id === id);
    if (index !== -1) {
      this.messages[index].status = 'read';
      this.saveMessages();
      this.renderMessages();
      this.updateStats();
      this.showNotification('Message marked as read');
    }
  }

  deleteMessage() {
    if (!this.currentMessage) return;

    if (confirm('Are you sure you want to delete this message?')) {
      this.messages = this.messages.filter(m => m.id !== this.currentMessage.id);
      this.saveMessages();
      this.renderMessages();
      this.updateStats();
      this.closeModal();
      this.showNotification('Message deleted');
    }
  }

  quickDelete(id) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messages = this.messages.filter(m => m.id !== id);
      this.saveMessages();
      this.renderMessages();
      this.updateStats();
      this.showNotification('Message deleted');
    }
  }

  updateStats() {
    const total = this.messages.length;
    const unread = this.messages.filter(m => m.status === 'unread').length;
    const read = total - unread;

    document.getElementById('totalMessages').textContent = total;
    document.getElementById('unreadMessages').textContent = unread;
    document.getElementById('readMessages').textContent = read;
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return past.toLocaleDateString();
  }

  showNotification(message) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;

    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
  new AdminPanel();
});