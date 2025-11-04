// Game Detail Page Script
class GameDetailPage {
  constructor() {
    this.currentGame = null;
    this.isPlaying = false;
    this.init();
  }

  init() {
    this.loadGame();
    this.setupControls();
    this.setupNavigation();
    this.setupTheme();
  }

  loadGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
      window.location.href = 'index.html#games';
      return;
    }

    this.currentGame = getItemById('games', gameId);

    if (!this.currentGame) {
      window.location.href = 'index.html#games';
      return;
    }

    this.displayGameInfo();
  }

  displayGameInfo() {
    const game = this.currentGame;

    // Update page elements
    document.title = `${game.name} - Arsh Verma`;
    
    document.getElementById('gameTitle').textContent = game.name;
    document.getElementById('gameCategory').textContent = game.category;
    document.getElementById('gameRating').textContent = `${game.rating}/5`;
    document.getElementById('playCount').textContent = `${game.playCount.toLocaleString()} plays`;
    document.getElementById('gameOverview').textContent = game.overview;
    document.getElementById('gameDescription').textContent = game.description;
    
    // Preview image
    document.getElementById('previewImage').src = game.image;
    document.getElementById('previewImage').alt = game.name;

    // Features list
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = game.features.map(feature => 
      `<li>${feature}</li>`
    ).join('');

    // Technologies
    const techList = document.getElementById('techList');
    techList.innerHTML = game.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');
  }

  setupControls() {
    const playBtn = document.getElementById('playBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const restartBtn = document.getElementById('restartBtn');
    const closeGameBtn = document.getElementById('closeGameBtn');

    playBtn.addEventListener('click', () => this.startGame());
    fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    restartBtn.addEventListener('click', () => this.restartGame());
    closeGameBtn.addEventListener('click', () => this.closeGame());
  }

  startGame() {
    const preview = document.getElementById('gamePreview');
    const container = document.getElementById('gameContainer');
    const frame = document.getElementById('gameFrame');
    const playBtn = document.getElementById('playBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const restartBtn = document.getElementById('restartBtn');
    const closeGameBtn = document.getElementById('closeGameBtn');

    // Hide preview, show game
    preview.style.display = 'none';
    container.style.display = 'block';
    playBtn.style.display = 'none';
    fullscreenBtn.style.display = 'inline-flex';
    restartBtn.style.display = 'inline-flex';
    closeGameBtn.style.display = 'inline-flex';

    // Load game
    frame.src = this.currentGame.gameFile;
    this.isPlaying = true;
  }

  closeGame() {
    const preview = document.getElementById('gamePreview');
    const container = document.getElementById('gameContainer');
    const frame = document.getElementById('gameFrame');
    const playBtn = document.getElementById('playBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const restartBtn = document.getElementById('restartBtn');
    const closeGameBtn = document.getElementById('closeGameBtn');

    // Show preview, hide game
    preview.style.display = 'block';
    container.style.display = 'none';
    playBtn.style.display = 'inline-flex';
    fullscreenBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    closeGameBtn.style.display = 'none';

    // Stop game
    frame.src = '';
    this.isPlaying = false;
  }

  restartGame() {
    const frame = document.getElementById('gameFrame');
    const currentSrc = frame.src;
    frame.src = '';
    setTimeout(() => {
      frame.src = currentSrc;
    }, 100);
  }

  toggleFullscreen() {
    const container = document.getElementById('gameContainer');
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  setupNavigation() {
    const prevBtn = document.getElementById('prevGame');
    const nextBtn = document.getElementById('nextGame');

    prevBtn.addEventListener('click', () => {
      const prevGame = getPrevItem('games', this.currentGame.id);
      window.location.href = `game.html?id=${prevGame.id}`;
    });

    nextBtn.addEventListener('click', () => {
      const nextGame = getNextItem('games', this.currentGame.id);
      window.location.href = `game.html?id=${nextGame.id}`;
    });

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', () => this.shareGame());
  }

  shareGame() {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: this.currentGame.name,
        text: this.currentGame.overview,
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
  new GameDetailPage();
});