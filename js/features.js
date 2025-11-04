// ============================================
// INNOVATIVE FEATURES IMPLEMENTATION
// ============================================

class PortfolioFeatures {
  constructor() {
    this.commandPaletteActive = false;
    this.particles = [];
    this.cursorTrail = [];
    this.init();
  }

  init() {
    try {
      this.initializeCommandPalette();
      this.initializeParticleCursor();
      this.initializeProgressNavigation();
      this.initialize3DEffects();
      this.initializeLoadingScreen();
      this.initializeFloatingActionButton();
      this.initializeQuickNavigation();
      this.initializeScrollAnimations();
      this.initializeParallaxEffects();
    } catch (error) {
      console.error('Error initializing PortfolioFeatures:', error);
      // If there's an error, we still want to remove the loading screen if it exists.
      const loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen) {
        loadingScreen.remove();
      }
    }
  }

  // ============================================
  // COMMAND PALETTE (Ctrl+K)
  // ============================================

  initializeCommandPalette() {
    this.createCommandPalette();
    this.setupCommandPaletteListeners();
  }

  createCommandPalette() {
    const paletteHTML = `
      <div id="commandPalette" class="command-palette">
        <div class="command-palette-overlay"></div>
        <div class="command-palette-container">
          <div class="command-palette-header">
            <div class="search-icon">
              <i class="fas fa-search"></i>
            </div>
            <input type="text" 
                   class="command-palette-input" 
                   placeholder="Type a command or search...">
            <kbd>Esc</kbd>
          </div>
          <div class="command-palette-results">
            <div class="command-group">
              <div class="command-group-title">Navigation</div>
              <div class="command-item" data-action="navigate" data-target="#home">
                <i class="fas fa-home"></i>
                <span>Go to Home</span>
                <kbd>Home</kbd>
              </div>
              <div class="command-item" data-action="navigate" data-target="#portfolio">
                <i class="fas fa-briefcase"></i>
                <span>Go to Portfolio</span>
                <kbd>P</kbd>
              </div>
              <div class="command-item" data-action="navigate" data-target="#contact">
                <i class="fas fa-envelope"></i>
                <span>Go to Contact</span>
                <kbd>C</kbd>
              </div>
            </div>
            <div class="command-group">
              <div class="command-group-title">Actions</div>
              <div class="command-item" data-action="theme">
                <i class="fas fa-palette"></i>
                <span>Toggle Theme</span>
                <kbd>T</kbd>
              </div>
              <div class="command-item" data-action="search">
                <i class="fas fa-search"></i>
                <span>Search Portfolio</span>
                <kbd>S</kbd>
              </div>
              <div class="command-item" data-action="contact">
                <i class="fas fa-paper-plane"></i>
                <span>Send Message</span>
                <kbd>M</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', paletteHTML);
  }

  setupCommandPaletteListeners() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.toggleCommandPalette();
      }

      if (e.key === 'Escape' && this.commandPaletteActive) {
        this.hideCommandPalette();
      }
    });

    const input = document.querySelector('.command-palette-input');
    const results = document.querySelector('.command-palette-results');
    const overlay = document.querySelector('.command-palette-overlay');

    if (input) {
      input.addEventListener('input', (e) => {
        this.filterCommands(e.target.value);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateCommands(e.key === 'ArrowDown' ? 1 : -1);
        }

        if (e.key === 'Enter') {
          this.executeSelectedCommand();
        }
      });
    }

    if (results) {
      results.addEventListener('click', (e) => {
        const commandItem = e.target.closest('.command-item');
        if (commandItem) {
          this.executeCommand(commandItem);
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        this.hideCommandPalette();
      });
    }
  }

  toggleCommandPalette() {
    const palette = document.getElementById('commandPalette');
    if (!palette) return;

    if (this.commandPaletteActive) {
      this.hideCommandPalette();
    } else {
      this.showCommandPalette();
    }
  }

  showCommandPalette() {
    const palette = document.getElementById('commandPalette');
    const input = document.querySelector('.command-palette-input');
    
    if (!palette || !input) return;

    palette.classList.add('active');
    input.value = '';
    input.focus();
    this.filterCommands('');
    this.commandPaletteActive = true;
  }

  hideCommandPalette() {
    const palette = document.getElementById('commandPalette');
    if (palette) {
      palette.classList.remove('active');
    }
    this.commandPaletteActive = false;
  }

  filterCommands(query) {
    const commandItems = document.querySelectorAll('.command-item');
    const groups = document.querySelectorAll('.command-group');

    let hasVisibleItems = false;

    commandItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const matches = text.includes(query.toLowerCase());
      item.style.display = matches ? 'flex' : 'none';
      
      if (matches) hasVisibleItems = true;
    });

    groups.forEach(group => {
      const visibleItems = group.querySelectorAll('.command-item[style*="display: flex"]');
      group.style.display = visibleItems.length > 0 ? 'block' : 'none';
    });

    const firstVisible = document.querySelector('.command-item[style*="display: flex"]');
    if (firstVisible) {
      this.selectCommand(firstVisible);
    }
  }

  navigateCommands(direction) {
    const visibleItems = Array.from(document.querySelectorAll('.command-item[style*="display: flex"]'));
    const currentIndex = visibleItems.findIndex(item => item.classList.contains('selected'));
    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = visibleItems.length - 1;
    if (newIndex >= visibleItems.length) newIndex = 0;

    this.selectCommand(visibleItems[newIndex]);
  }

  selectCommand(item) {
    document.querySelectorAll('.command-item').forEach(i => {
      i.classList.remove('selected');
    });
    item.classList.add('selected');

    item.scrollIntoView({ block: 'nearest' });
  }

  executeSelectedCommand() {
    const selected = document.querySelector('.command-item.selected');
    if (selected) {
      this.executeCommand(selected);
    }
  }

  executeCommand(commandItem) {
    const action = commandItem.dataset.action;
    const target = commandItem.dataset.target;

    switch (action) {
      case 'navigate':
        this.navigateToSection(target);
        break;
      case 'theme':
        if (window.portfolioApp) {
          window.portfolioApp.toggleTheme();
        }
        break;
      case 'search':
        this.focusSearch();
        break;
      case 'contact':
        this.openContactModal();
        break;
    }

    this.hideCommandPalette();
  }

  navigateToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  focusSearch() {
    const searchInput = document.querySelector('[data-search]');
    if (searchInput) {
      searchInput.focus();
    }
  }

  openContactModal() {
    if (window.modalSystem) {
      window.modalSystem.open('contactModal');
    }
  }

  // ============================================
  // PARTICLE CURSOR TRAIL
  // ============================================

  initializeParticleCursor() {
    this.createCursorCanvas();
    this.setupCursorParticles();
  }

  createCursorCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursorCanvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(canvas);

    this.cursorCanvas = canvas;
    this.cursorCtx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setupCursorParticles() {
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (this.particles.length < 20) {
        this.addParticle(mouseX, mouseY);
      }
    });

    const animate = () => {
      this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
      
      this.particles.forEach((particle, index) => {
        particle.update();
        particle.draw(this.cursorCtx);

        if (particle.alpha <= 0) {
          this.particles.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  addParticle(x, y) {
    const particle = {
      x: x,
      y: y,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      alpha: 1,
      color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,

      update: function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
        this.size *= 0.98;
      },

      draw: function(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    this.particles.push(particle);
  }

  // ============================================
  // PROGRESS RING NAVIGATION
  // ============================================

  initializeProgressNavigation() {
    this.createProgressRing();
    this.setupProgressTracking();
  }

  createProgressRing() {
    const ringHTML = `
      <div id="progressRing" class="progress-ring">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle class="progress-ring-bg" cx="30" cy="30" r="26"/>
          <circle class="progress-ring-fill" cx="30" cy="30" r="26"/>
        </svg>
        <div class="progress-ring-content">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', ringHTML);

    const progressRing = document.getElementById('progressRing');
    if (progressRing) {
      progressRing.addEventListener('click', () => {
        this.scrollToNextSection();
      });
    }
  }

  setupProgressTracking() {
    const ringFill = document.querySelector('.progress-ring-fill');
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    const updateProgress = () => {
      const scrollProgress = (window.scrollY / totalHeight) * 100;
      const circumference = 2 * Math.PI * 26;
      const offset = circumference - (scrollProgress / 100) * circumference;

      if (ringFill) {
        ringFill.style.strokeDasharray = `${circumference} ${circumference}`;
        ringFill.style.strokeDashoffset = offset;
      }

      const ringContent = document.querySelector('.progress-ring-content i');
      if (ringContent) {
        if (scrollProgress > 90) {
          ringContent.className = 'fas fa-chevron-up';
        } else {
          ringContent.className = 'fas fa-chevron-down';
        }
      }
    };

    window.addEventListener('scroll', this.throttle(updateProgress, 16));
    updateProgress();
  }

  scrollToNextSection() {
    const currentScroll = window.scrollY;
    const sections = Array.from(document.querySelectorAll('section[id]'));
    
    const nextSection = sections.find(section => {
      return section.offsetTop > currentScroll + 100;
    });

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ============================================
  // 3D EFFECTS AND ANIMATIONS
  // ============================================

  initialize3DEffects() {
    this.setupTiltEffects();
    this.setupParallaxCards();
    this.setupMagneticButtons();
  }

  setupTiltEffects() {
    const tiltElements = document.querySelectorAll('.portfolio-card, .stat-card');

    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;

        element.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          scale3d(1.05, 1.05, 1.05)
        `;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  setupParallaxCards() {
    const parallaxElements = document.querySelectorAll('.parallax-card');

    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
    };

    window.addEventListener('scroll', this.throttle(handleParallax, 16));
  }

  setupMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');

    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) * 0.3;
        const deltaY = (y - centerY) * 0.3;

        button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ============================================
  // LOADING SCREEN
  // ============================================

  initializeLoadingScreen() {
    // Only simulate loading if the loading screen exists
    if (document.getElementById('loadingScreen')) {
        this.simulateLoading();
    }
  }

  simulateLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingStatus = document.getElementById('loadingStatus');
    
    if (!loadingScreen) return;

    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          loadingScreen.classList.add('loaded');
          setTimeout(() => {
            loadingScreen.remove();
          }, 500);
        }, 500);
      }

      if (loadingBar) {
        loadingBar.style.width = `${progress}%`;
      }
      if (loadingPercentage) {
        loadingPercentage.textContent = `${Math.round(progress)}%`;
      }
      if (loadingStatus) {
        // Update status text based on progress
        if (progress < 30) {
          loadingStatus.textContent = 'Initializing...';
        } else if (progress < 60) {
          loadingStatus.textContent = 'Loading assets...';
        } else if (progress < 90) {
          loadingStatus.textContent = 'Almost there...';
        } else {
          loadingStatus.textContent = 'Ready!';
        }
      }
    }, 200);
  }

  // ============================================
  // FLOATING ACTION BUTTON
  // ============================================

  initializeFloatingActionButton() {
    this.createFloatingActionButton();
  }

  createFloatingActionButton() {
    const fabHTML = `
      <div id="fabContainer" class="fab-container">
        <button class="fab-main">
          <i class="fas fa-plus"></i>
        </button>
        <div class="fab-menu">
          <button class="fab-item" data-action="theme" title="Toggle Theme">
            <i class="fas fa-palette"></i>
          </button>
          <button class="fab-item" data-action="search" title="Search">
            <i class="fas fa-search"></i>
          </button>
          <button class="fab-item" data-action="contact" title="Contact">
            <i class="fas fa-envelope"></i>
          </button>
          <button class="fab-item" data-action="top" title="Scroll to Top">
            <i class="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', fabHTML);

    const fabMain = document.querySelector('.fab-main');
    const fabItems = document.querySelectorAll('.fab-item');

    if (fabMain) {
      fabMain.addEventListener('click', () => {
        document.getElementById('fabContainer').classList.toggle('active');
      });
    }

    fabItems.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        this.handleFabAction(action);
        document.getElementById('fabContainer').classList.remove('active');
      });
    });
  }

  handleFabAction(action) {
    switch (action) {
      case 'theme':
        if (window.portfolioApp) {
          window.portfolioApp.toggleTheme();
        }
        break;
      case 'search':
        this.focusSearch();
        break;
      case 'contact':
        this.openContactModal();
        break;
      case 'top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
    }
  }

  // ============================================
  // QUICK NAVIGATION
  // ============================================

  initializeQuickNavigation() {
    this.createQuickNavigation();
  }

  createQuickNavigation() {
    const quickNavHTML = `
      <div id="quickNav" class="quick-nav">
        <div class="quick-nav-items">
          <a href="#home" class="quick-nav-item" data-section="home">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href="#portfolio" class="quick-nav-item" data-section="portfolio">
            <i class="fas fa-briefcase"></i>
            <span>Portfolio</span>
          </a>
          <a href="#skills" class="quick-nav-item" data-section="skills">
            <i class="fas fa-code"></i>
            <span>Skills</span>
          </a>
          <a href="#contact" class="quick-nav-item" data-section="contact">
            <i class="fas fa-envelope"></i>
            <span>Contact</span>
          </a>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', quickNavHTML);

    this.updateQuickNav();
    window.addEventListener('scroll', this.throttle(() => this.updateQuickNav(), 100));
  }

  updateQuickNav() {
    const sections = document.querySelectorAll('section[id]');
    const quickNavItems = document.querySelectorAll('.quick-nav-item');

    let currentSection = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id;
      }
    });

    quickNavItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  }

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================

  initializeScrollAnimations() {
    this.setupScrollReveal();
    this.setupStaggerAnimations();
  }

  setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  setupStaggerAnimations() {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 100);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-animate').forEach(el => {
      staggerObserver.observe(el);
    });
  }

  // ============================================
  // PARALLAX EFFECTS
  // ============================================

  initializeParallaxEffects() {
    this.setupBackgroundParallax();
    this.setupLayeredParallax();
  }

  setupBackgroundParallax() {
    const parallaxBg = document.querySelector('.parallax-background');
    if (!parallaxBg) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      parallaxBg.style.transform = `translateY(${rate}px)`;
    });
  }

  setupLayeredParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      layers.forEach((layer, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        layer.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ============================================
// ERROR HANDLING FEATURES
// ============================================

class ErrorFeatures {
  static setup404Features() {
    this.setup404Search();
    this.setupAutoRetry();
    this.setupHelpfulSuggestions();
  }

  static setup404Search() {
    const searchInput = document.querySelector('.error-search');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performErrorSearch(searchInput.value);
        }
      });
    }
  }

  static performErrorSearch(query) {
    console.log('Searching for:', query);
  }

  static setupAutoRetry() {
    const retryBtn = document.querySelector('.retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.retryPageLoad();
      });
    }
  }

  static retryPageLoad() {
    window.location.reload();
  }

  static setupHelpfulSuggestions() {
    const suggestions = [
      'Check the URL for typos',
      'Visit our homepage',
      'Browse our portfolio',
      'Contact us for help'
    ];

    const container = document.querySelector('.error-suggestions');
    if (container) {
      suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        container.appendChild(li);
      });
    }
  }
}

// ============================================
// APP PREVIEW SYSTEM
// ============================================

class AppPreviewSystem {
  static showAppPreview(appData) {
    const previewHTML = `
      <div class="app-preview-modal">
        <div class="app-preview-container">
          <div class="app-preview-header">
            <div class="app-icon">
              <img src="${appData.icon}" alt="${appData.name}">
            </div>
            <div class="app-info">
              <h3>${appData.name}</h3>
              <p>${appData.category} • ${appData.platform}</p>
              <div class="app-rating">
                ${this.generateStarRating(appData.rating)}
                <span>${appData.rating} (${appData.downloads})</span>
              </div>
            </div>
            <button class="close-preview">&times;</button>
          </div>
          <div class="app-preview-content">
            <div class="app-screenshots">
              <img src="${appData.image}" alt="${appData.name}">
            </div>
            <div class="app-details">
              <p>${appData.description}</p>
              <div class="app-features">
                <h4>Features</h4>
                <ul>
                  ${appData.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
              </div>
              <div class="app-actions">
                ${this.generateAppActions(appData)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', previewHTML);

    const modal = document.querySelector('.app-preview-modal');
    const closeBtn = document.querySelector('.close-preview');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (modal) {
          modal.remove();
        }
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
  }

  static generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < (5 - fullStars - (hasHalfStar ? 1 : 0)); i++) stars += '<i class="far fa-star"></i>';
    
    return stars;
  }

  static generateAppActions(appData) {
    let actions = '';
    
    if (appData.appStoreUrl) {
      actions += `<a href="${appData.appStoreUrl}" class="btn btn-primary" target="_blank">
        <i class="fab fa-apple"></i> App Store
      </a>`;
    }
    
    if (appData.playStoreUrl) {
      actions += `<a href="${appData.playStoreUrl}" class="btn btn-primary" target="_blank">
        <i class="fab fa-google-play"></i> Play Store
      </a>`;
    }
    
    if (appData.webUrl) {
      actions += `<a href="${appData.webUrl}" class="btn btn-outline" target="_blank">
        <i class="fas fa-external-link-alt"></i> Visit Website
      </a>`;
    }

    return actions;
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  window.portfolioFeatures = new PortfolioFeatures();

  if (document.querySelector('.error-page')) {
    ErrorFeatures.setup404Features();
  }
});