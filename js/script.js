// ============================================
// CORE PORTFOLIO FUNCTIONALITY
// ============================================

class PortfolioApp {
  constructor() {
    this.currentTheme = 'dark';
    this.activeModal = null;
    this.isLoading = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTheme();
    this.initializeComponents();
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
  }

  setupEventListeners() {
    // Theme toggle
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-theme-toggle]')) {
        this.toggleTheme();
      }
    });

    // Modal handling
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal-open]')) {
        this.openModal(e.target.dataset.modalOpen);
      }
      if (e.target.matches('[data-modal-close]') || e.target.closest('[data-modal-close]')) {
        this.closeModal();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal-overlay')) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });

    // Form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.matches('#contactForm')) {
        e.preventDefault();
        this.handleContactForm(e.target);
      }
    });

    // Navigation smooth scroll
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]') && !e.target.matches('[data-no-smooth]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          this.scrollToElement(target);
        }
      }
    });
  }

  initializeComponents() {
    this.initializeNavigation();
    this.initializePortfolioFilters();
    this.initializeTestimonials();
    this.initializeSkills();
    this.initializeTypewriter();
    this.initializeStatsCounter();
    this.initialize3DCards();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
    
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.activeModal = modal;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  closeModal() {
    if (!this.activeModal) return;

    this.activeModal.classList.remove('active');
    document.body.style.overflow = '';
    this.activeModal = null;
  }

  initializeNavigation() {
    const header = document.querySelector('.navbar');
    if (!header) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (window.scrollY > lastScrollY && window.scrollY > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollY = window.scrollY;
      this.updateActiveNavLink();
    };

    window.addEventListener('scroll', this.throttle(handleScroll, 100));
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScrolling() {
    this.scrollToElement = (element, offset = 80) => {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    };
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.portfolio-card, .stat-card, .skill-item').forEach(el => {
      observer.observe(el);
    });
  }

  initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const searchInputs = document.querySelectorAll('[data-search]');
    const sortSelects = document.querySelectorAll('[data-sort]');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.dataset.filter;
        this.filterPortfolioItems(filterValue);
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    searchInputs.forEach(input => {
      input.addEventListener('input', this.debounce(() => {
        this.searchPortfolioItems(input.value);
      }, 300));
    });

    sortSelects.forEach(select => {
      select.addEventListener('change', () => {
        this.sortPortfolioItems(select.value);
      });
    });
  }

  filterPortfolioItems(category) {
    const items = document.querySelectorAll('.portfolio-item');
    
    items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  searchPortfolioItems(query) {
    const items = document.querySelectorAll('.portfolio-item');
    const lowercaseQuery = query.toLowerCase();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(lowercaseQuery)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  sortPortfolioItems(criteria) {
    console.log('Sorting by:', criteria);
  }

  initializeTestimonials() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    let currentIndex = 0;
    const items = carousel.querySelectorAll('.testimonial-item');
    const totalItems = items.length;

    const showSlide = (index) => {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    };

    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalItems;
      showSlide(currentIndex);
    }, 5000);

    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        showSlide(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        showSlide(currentIndex);
      });
    }
  }

  initializeSkills() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const level = entry.target.dataset.level;
          entry.target.style.width = level + '%';
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
  }

  initializeTypewriter() {
    const typewriterElement = document.querySelector('[data-typewriter]');
    if (!typewriterElement) return;

    const texts = JSON.parse(typewriterElement.dataset.texts || '[]');
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentText = texts[currentTextIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
      } else {
        typewriterElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && currentCharIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    };

    setTimeout(type, 1000);
  }

  initializeStatsCounter() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.counter);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }

  initialize3DCards() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  async handleContactForm(form) {
    if (this.isLoading) return;

    this.isLoading = true;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    try {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      const validation = validateContactForm(data);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      await this.simulateAPICall(data);
      this.showNotification('Message sent successfully!', 'success');
      form.reset();
      
    } catch (error) {
      this.showNotification(error.message, 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      this.isLoading = false;
    }
  }

  simulateAPICall(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.1 ? resolve() : reject(new Error('Failed to send message. Please try again.'));
      }, 2000);
    });
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer') || this.createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
  }

  preloadImages() {
    const images = [];
    PORTFOLIO_DATA.games.forEach(item => images.push(item.image));
    PORTFOLIO_DATA.websites.forEach(item => images.push(item.image));
    PORTFOLIO_DATA.apps.forEach(item => images.push(item.image));
    
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
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
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
  
  if (window.PortfolioFeatures) {
    window.portfolioFeatures = new PortfolioFeatures();
  }
  
  if (document.querySelector('.admin-body') && window.AdminPanel) {
    window.adminPanel = new AdminPanel();
  }
});

window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  
  if (window.portfolioApp) {
    window.portfolioApp.showNotification(
      'Something went wrong. Please refresh the page.', 
      'error'
    );
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  e.preventDefault();
});