// Main Portfolio App
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupTypewriter();
    this.setupCounters();
    this.setupSkillBars();
    this.loadPortfolioItems();
    this.setupContactForm();
    this.setupBackToTop();
    this.setupMobileMenu();
  }

  // Theme Management
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

  // Navigation
  setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      this.updateActiveLink();
    });

    // Smooth scroll
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          const offset = 70;
          const targetPosition = target.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Typewriter Effect
  setupTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const texts = [
      'Game Developer',
      'Web Developer',
      'App Developer',
      'Creative Coder'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 150;

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    };

    type();
  }

  // Stat Counters
  setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // Skill Bars
  setupSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = entry.target.getAttribute('data-progress');
          entry.target.style.width = progress + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
  }

  // Load Portfolio Items
  loadPortfolioItems() {
    this.loadGames();
    this.loadWebsites();
    this.loadApps();
  }

  loadGames() {
    const container = document.getElementById('gamesGrid');
    if (!container) return;

    const games = PORTFOLIO_DATA.games;
    container.innerHTML = games.map(game => `
      <div class="portfolio-card" onclick="window.location.href='game.html?id=${game.id}'">
        <img src="${game.image}" alt="${game.name}" class="portfolio-image">
        <div class="portfolio-info">
          <h3 class="portfolio-title">${game.name}</h3>
          <p class="portfolio-category">${game.category}</p>
          <p class="portfolio-description">${game.overview}</p>
          <div class="portfolio-tags">
            ${game.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  loadWebsites() {
    const container = document.getElementById('websitesGrid');
    if (!container) return;

    const websites = PORTFOLIO_DATA.websites;
    container.innerHTML = websites.map(site => `
      <div class="portfolio-card" onclick="window.location.href='website.html?id=${site.id}'">
        <img src="${site.image}" alt="${site.name}" class="portfolio-image">
        <div class="portfolio-info">
          <h3 class="portfolio-title">${site.name}</h3>
          <p class="portfolio-category">${site.category}</p>
          <p class="portfolio-description">${site.overview}</p>
          <div class="portfolio-tags">
            ${site.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  loadApps() {
    const container = document.getElementById('appsGrid');
    if (!container) return;

    const apps = PORTFOLIO_DATA.apps;
    container.innerHTML = apps.map(app => `
      <div class="portfolio-card" onclick="window.location.href='app.html?id=${app.id}'">
        <img src="${app.image}" alt="${app.name}" class="portfolio-image">
        <div class="portfolio-info">
          <h3 class="portfolio-title">${app.name}</h3>
          <p class="portfolio-category">${app.category} • ${app.platform}</p>
          <p class="portfolio-description">${app.overview}</p>
          <div class="portfolio-tags">
            ${app.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Contact Form
  setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save to localStorage (for admin panel)
      this.saveContact(data);

      // Show success message
      this.showNotification('Message sent successfully!', 'success');
      form.reset();

      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  }

  saveContact(data) {
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push({
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'unread'
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  // Notifications
  showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Back to Top Button
  setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile Menu
  setupMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
      });

      // Close menu when clicking a link
      menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('active');
          toggle.classList.remove('active');
        });
      });
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});