// App Detail Page Script
class AppDetailPage {
  constructor() {
    this.currentApp = null;
    this.init();
  }

  init() {
    this.loadApp();
    this.setupNavigation();
    this.setupTheme();
  }

  loadApp() {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');

    if (!appId) {
      window.location.href = 'index.html#apps';
      return;
    }

    this.currentApp = getItemById('apps', appId);

    if (!this.currentApp) {
      window.location.href = 'index.html#apps';
      return;
    }

    this.displayAppInfo();
  }

  displayAppInfo() {
    const app = this.currentApp;

    // Update page elements
    document.title = `${app.name} - Arsh Verma`;
    
    document.getElementById('appTitle').textContent = app.name;
    document.getElementById('appCategory').textContent = app.category;
    document.getElementById('appPlatform').textContent = app.platform;
    document.getElementById('appRating').textContent = `${app.rating}/5`;
    document.getElementById('appDownloads').textContent = app.downloads;
    document.getElementById('appOverview').textContent = app.overview;
    document.getElementById('appDescription').textContent = app.description;
    
    // App images
    document.getElementById('appIcon').src = app.icon;
    document.getElementById('appIcon').alt = `${app.name} Icon`;
    document.getElementById('appImage').src = app.image;
    document.getElementById('appImage').alt = app.name;

    // Features list
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = app.features.map(feature => 
      `<li>${feature}</li>`
    ).join('');

    // Technologies
    const techList = document.getElementById('techList');
    techList.innerHTML = app.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');

    // Statistics
    document.getElementById('downloads').textContent = app.downloads;
    document.getElementById('users').textContent = app.users;
    document.getElementById('rating').textContent = app.rating;

    // Action buttons
    const appStoreBtn = document.getElementById('appStore');
    const playStoreBtn = document.getElementById('playStore');
    const webUrlBtn = document.getElementById('webUrl');

    if (app.appStoreUrl) {
      appStoreBtn.href = app.appStoreUrl;
      appStoreBtn.style.display = 'inline-flex';
    }

    if (app.playStoreUrl) {
      playStoreBtn.href = app.playStoreUrl;
      playStoreBtn.style.display = 'inline-flex';
    }

    if (app.webUrl) {
      webUrlBtn.href = app.webUrl;
      webUrlBtn.style.display = 'inline-flex';
    }
  }

  setupNavigation() {
    const prevBtn = document.getElementById('prevApp');
    const nextBtn = document.getElementById('nextApp');

    prevBtn.addEventListener('click', () => {
      const prevApp = getPrevItem('apps', this.currentApp.id);
      window.location.href = `app.html?id=${prevApp.id}`;
    });

    nextBtn.addEventListener('click', () => {
      const nextApp = getNextItem('apps', this.currentApp.id);
      window.location.href = `app.html?id=${nextApp.id}`;
    });

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', () => this.shareApp());
  }

  shareApp() {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: this.currentApp.name,
        text: this.currentApp.overview,
        url: url
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        this.showNotification('Link copied to clipboard!');
      });
    }
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AppDetailPage();
});