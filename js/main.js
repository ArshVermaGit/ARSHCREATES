// ============================================
// MODAL MANAGEMENT SYSTEM
// ============================================

class ModalSystem {
  constructor() {
    this.modals = new Map();
    this.currentModal = null;
    this.history = [];
    this.init();
  }

  init() {
    this.registerModals();
    this.setupGlobalListeners();
  }

  registerModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      const id = modal.id;
      this.modals.set(id, {
        element: modal,
        isOpen: false,
        data: null
      });
    });
  }

  setupGlobalListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.closeCurrent();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentModal) {
        this.closeCurrent();
      }
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal]');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        const action = trigger.dataset.modalAction || 'open';
        
        if (action === 'open') {
          this.open(modalId, this.getModalData(trigger));
        }
      }
    });
  }

  open(modalId, data = null) {
    if (this.currentModal) {
      this.history.push(this.currentModal);
      this.close(this.currentModal, false);
    }

    const modal = this.modals.get(modalId);
    if (!modal) {
      console.error(`Modal ${modalId} not found`);
      return;
    }

    this.currentModal = modalId;
    modal.isOpen = true;
    modal.data = data;

    modal.element.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.triggerEvent('modalOpen', { modalId, data });
    this.focusFirstElement(modal.element);
  }

  closeCurrent() {
    if (this.currentModal) {
      this.close(this.currentModal);
    }
  }

  close(modalId, restoreHistory = true) {
    const modal = this.modals.get(modalId);
    if (!modal || !modal.isOpen) return;

    modal.isOpen = false;
    modal.element.classList.remove('active');

    this.triggerEvent('modalClose', { modalId, data: modal.data });

    this.currentModal = null;

    if (restoreHistory && this.history.length > 0) {
      const previousModal = this.history.pop();
      this.open(previousModal);
    } else {
      document.body.style.overflow = '';
    }

    modal.data = null;
  }

  getModalData(trigger) {
    const data = {};
    
    for (const [key, value] of Object.entries(trigger.dataset)) {
      if (key.startsWith('modalData')) {
        const cleanKey = key.replace('modalData', '').toLowerCase();
        data[cleanKey] = value;
      }
    }

    return data;
  }

  focusFirstElement(modalElement) {
    const focusable = modalElement.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusable) {
      focusable.focus();
    }
  }

  triggerEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
}

// ============================================
// PORTFOLIO MODAL SYSTEM
// ============================================

class PortfolioModal extends ModalSystem {
  constructor() {
    super();
    this.currentItem = null;
    this.currentCategory = null;
    this.currentIndex = 0;
    this.items = [];
  }

  openPortfolioItem(category, itemId) {
    const items = this.getItemsByCategory(category);
    const itemIndex = items.findIndex(item => item.id == itemId);
    
    if (itemIndex === -1) return;

    this.currentCategory = category;
    this.currentItem = items[itemIndex];
    this.currentIndex = itemIndex;
    this.items = items;

    this.loadPortfolioModalData();
    this.open('portfolioModal');
  }

  getItemsByCategory(category) {
    switch (category) {
      case 'games':
        return PORTFOLIO_DATA.games;
      case 'websites':
        return PORTFOLIO_DATA.websites;
      case 'apps':
        return PORTFOLIO_DATA.apps;
      default:
        return [];
    }
  }

  loadPortfolioModalData() {
    if (!this.currentItem) return;

    const modal = document.getElementById('portfolioModal');
    if (!modal) return;

    this.updateModalContent(modal, this.currentItem);
    this.updateNavigation();
  }

  updateModalContent(modal, item) {
    modal.querySelector('[data-item-title]').textContent = item.name;
    modal.querySelector('[data-item-category]').textContent = item.category;
    modal.querySelector('[data-item-description]').textContent = item.description;
    modal.querySelector('[data-item-image]').src = item.image;
    modal.querySelector('[data-item-image]').alt = item.name;

    const techContainer = modal.querySelector('[data-item-technologies]');
    if (techContainer) {
      techContainer.innerHTML = item.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
      ).join('');
    }

    const featuresContainer = modal.querySelector('[data-item-features]');
    if (featuresContainer && item.features) {
      featuresContainer.innerHTML = item.features.map(feature => 
        `<li>${feature}</li>`
      ).join('');
    }

    this.updateItemStats(modal, item);
    this.updateActionButtons(modal, item);
  }

  updateItemStats(modal, item) {
    const ratingContainer = modal.querySelector('[data-item-rating]');
    if (ratingContainer && item.rating) {
      ratingContainer.innerHTML = this.generateStarRating(item.rating);
    }

    const playCount = modal.querySelector('[data-item-play-count]');
    if (playCount && item.playCount) {
      playCount.textContent = item.playCount.toLocaleString();
    }

    const downloads = modal.querySelector('[data-item-downloads]');
    if (downloads && item.downloads) {
      downloads.textContent = item.downloads;
    }

    const likes = modal.querySelector('[data-item-likes]');
    if (likes && item.likes) {
      likes.textContent = item.likes.toLocaleString();
    }
  }

  generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }

    return stars + ` <span class="rating-text">${rating}</span>`;
  }

  updateActionButtons(modal, item) {
    const actionsContainer = modal.querySelector('[data-item-actions]');
    if (!actionsContainer) return;

    let buttons = '';

    if (item.demoUrl) {
      buttons += `<a href="${item.demoUrl}" target="_blank" class="btn btn-primary">
        <i class="fas fa-play"></i> Live Demo
      </a>`;
    }

    if (item.sourceUrl) {
      buttons += `<a href="${item.sourceUrl}" target="_blank" class="btn btn-outline">
        <i class="fab fa-github"></i> Source Code
      </a>`;
    }

    if (item.platform === 'Mobile') {
      if (item.appStoreUrl) {
        buttons += `<a href="${item.appStoreUrl}" target="_blank" class="btn btn-success">
          <i class="fab fa-apple"></i> App Store
        </a>`;
      }
      if (item.playStoreUrl) {
        buttons += `<a href="${item.playStoreUrl}" target="_blank" class="btn btn-success">
          <i class="fab fa-google-play"></i> Play Store
        </a>`;
      }
    }

    if (item.url) {
      buttons += `<a href="${item.url}" target="_blank" class="btn btn-primary">
        <i class="fas fa-external-link-alt"></i> Visit Website
      </a>`;
    }

    actionsContainer.innerHTML = buttons;
  }

  updateNavigation() {
    const prevBtn = document.querySelector('[data-modal-prev]');
    const nextBtn = document.querySelector('[data-modal-next]');

    if (prevBtn) {
      prevBtn.style.visibility = this.currentIndex > 0 ? 'visible' : 'hidden';
      prevBtn.onclick = () => this.navigate(-1);
    }

    if (nextBtn) {
      nextBtn.style.visibility = this.currentIndex < this.items.length - 1 ? 'visible' : 'hidden';
      nextBtn.onclick = () => this.navigate(1);
    }
  }

  navigate(direction) {
    const newIndex = this.currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.items.length) {
      this.currentIndex = newIndex;
      this.currentItem = this.items[newIndex];
      this.loadPortfolioModalData();
    }
  }

  shareItem() {
    if (!this.currentItem) return;

    const shareData = {
      title: this.currentItem.name,
      text: this.currentItem.overview,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      this.copyToClipboard(shareData.url);
      if (window.portfolioApp) {
        window.portfolioApp.showNotification('Link copied to clipboard!', 'success');
      }
    }
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}

// ============================================
// CONTACT FORM MODAL SYSTEM
// ============================================

class ContactModal extends ModalSystem {
  constructor() {
    super();
    this.currentStep = 1;
    this.formData = {};
    this.initContactForm();
  }

  initContactForm() {
    this.setupStepNavigation();
    this.setupFormValidation();
  }

  setupStepNavigation() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-contact-next]')) {
        this.nextStep();
      }
      if (e.target.matches('[data-contact-prev]')) {
        this.prevStep();
      }
    });
  }

  setupFormValidation() {
    document.addEventListener('input', (e) => {
      if (e.target.matches('.contact-form input, .contact-form textarea, .contact-form select')) {
        this.validateField(e.target);
      }
    });
  }

  nextStep() {
    if (!this.validateStep(this.currentStep)) return;

    this.currentStep++;
    this.updateStepUI();
  }

  prevStep() {
    this.currentStep--;
    this.updateStepUI();
  }

  validateStep(step) {
    const fields = document.querySelectorAll(`[data-step="${step}"] [required]`);
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    this.clearFieldError(field);

    if (field.required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  updateStepUI() {
    const progress = document.querySelector('[data-contact-progress]');
    if (progress) {
      const percentage = ((this.currentStep - 1) / 2) * 100;
      progress.style.width = `${percentage}%`;
    }

    document.querySelectorAll('[data-step-indicator]').forEach(indicator => {
      const step = parseInt(indicator.dataset.stepIndicator);
      indicator.classList.toggle('active', step === this.currentStep);
      indicator.classList.toggle('completed', step < this.currentStep);
    });

    document.querySelectorAll('[data-step]').forEach(stepElement => {
      const step = parseInt(stepElement.dataset.step);
      stepElement.style.display = step === this.currentStep ? 'block' : 'none';
    });

    this.updateNavigationButtons();
  }

  updateNavigationButtons() {
    const prevBtn = document.querySelector('[data-contact-prev]');
    const nextBtn = document.querySelector('[data-contact-next]');
    const submitBtn = document.querySelector('[data-contact-submit]');

    if (prevBtn) {
      prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = this.currentStep < 3 ? 'inline-flex' : 'none';
    }

    if (submitBtn) {
      submitBtn.style.display = this.currentStep === 3 ? 'inline-flex' : 'none';
    }
  }

  collectFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return {};

    const formData = new FormData(form);
    return Object.fromEntries(formData);
  }

  async submitForm() {
    const formData = this.collectFormData();
    
    try {
      await this.sendFormData(formData);
      this.showSuccessMessage();
      this.close('contactModal');
    } catch (error) {
      this.showErrorMessage(error.message);
    }
  }

  async sendFormData(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.1 ? resolve() : reject(new Error('Failed to send message'));
      }, 2000);
    });
  }

  showSuccessMessage() {
    if (window.portfolioApp) {
      window.portfolioApp.showNotification('Message sent successfully!', 'success');
    }
  }

  showErrorMessage(message) {
    if (window.portfolioApp) {
      window.portfolioApp.showNotification(message, 'error');
    }
  }
}

// ============================================
// MEETING SCHEDULER MODAL
// ============================================

class MeetingScheduler extends ModalSystem {
  constructor() {
    super();
    this.selectedDate = null;
    this.selectedTime = null;
    this.availableSlots = [];
    this.initScheduler();
  }

  initScheduler() {
    this.generateCalendar();
    this.setupTimeSlots();
  }

  generateCalendar() {
    const calendar = document.querySelector('[data-calendar]');
    if (!calendar) return;

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let calendarHTML = '<div class="calendar-grid">';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
      calendarHTML += `<div class="calendar-header">${day}</div>`;
    });

    for (let i = 0; i < firstDay.getDay(); i++) {
      calendarHTML += '<div class="calendar-day empty"></div>';
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isToday = this.isSameDay(date, today);
      const isAvailable = this.isDateAvailable(date);
      
      calendarHTML += `
        <div class="calendar-day ${isToday ? 'today' : ''} ${isAvailable ? 'available' : 'unavailable'}" 
             data-date="${date.toISOString()}">
          ${day}
        </div>
      `;
    }

    calendarHTML += '</div>';
    calendar.innerHTML = calendarHTML;

    calendar.addEventListener('click', (e) => {
      const dayElement = e.target.closest('.calendar-day.available');
      if (dayElement) {
        this.selectDate(dayElement.dataset.date);
      }
    });
  }

  isSameDay(date1, date2) {
    return date1.toDateString() === date2.toDateString();
  }

  isDateAvailable(date) {
    const today = new Date();
    const dayOfWeek = date.getDay();
    
    return date >= today && dayOfWeek !== 0 && dayOfWeek !== 6;
  }

  selectDate(dateString) {
    this.selectedDate = new Date(dateString);
    
    document.querySelectorAll('.calendar-day').forEach(day => {
      day.classList.remove('selected');
    });
    
    const selectedDay = document.querySelector(`[data-date="${dateString}"]`);
    if (selectedDay) {
      selectedDay.classList.add('selected');
    }

    this.generateTimeSlots();
  }

  generateTimeSlots() {
    const timeSlotsContainer = document.querySelector('[data-time-slots]');
    if (!timeSlotsContainer || !this.selectedDate) return;

    const slots = this.getAvailableTimeSlots();
    let slotsHTML = '';

    slots.forEach(slot => {
      slotsHTML += `
        <div class="time-slot ${slot.available ? 'available' : 'booked'}" 
             data-time="${slot.time}">
          ${slot.display}
        </div>
      `;
    });

    timeSlotsContainer.innerHTML = slotsHTML;

    timeSlotsContainer.addEventListener('click', (e) => {
      const slotElement = e.target.closest('.time-slot.available');
      if (slotElement) {
        this.selectTime(slotElement.dataset.time);
      }
    });
  }

  getAvailableTimeSlots() {
    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = this.formatTimeDisplay(hour, minute);
        
        slots.push({
          time: timeString,
          display: displayTime,
          available: Math.random() > 0.3
        });
      }
    }

    return slots;
  }

  formatTimeDisplay(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  selectTime(time) {
    this.selectedTime = time;
    
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.classList.remove('selected');
    });
    
    const selectedSlot = document.querySelector(`[data-time="${time}"]`);
    if (selectedSlot) {
      selectedSlot.classList.add('selected');
    }

    this.updateSelectedDateTime();
  }

  updateSelectedDateTime() {
    const displayElement = document.querySelector('[data-selected-datetime]');
    if (displayElement && this.selectedDate && this.selectedTime) {
      const dateStr = this.selectedDate.toLocaleDateString();
      const timeStr = this.formatTimeDisplay(...this.selectedTime.split(':').map(Number));
      displayElement.textContent = `${dateStr} at ${timeStr}`;
    }
  }

  setupTimeSlots() {
    // Additional time slot setup
  }

  async scheduleMeeting() {
    if (!this.selectedDate || !this.selectedTime) {
      if (window.portfolioApp) {
        window.portfolioApp.showNotification('Please select a date and time', 'warning');
      }
      return;
    }

    try {
      await this.confirmSchedule();
      this.showSchedulingSuccess();
      this.close('meetingModal');
    } catch (error) {
      this.showSchedulingError(error.message);
    }
  }

  async confirmSchedule() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.1 ? resolve() : reject(new Error('Scheduling failed'));
      }, 1500);
    });
  }

  showSchedulingSuccess() {
    if (window.portfolioApp) {
      window.portfolioApp.showNotification('Meeting scheduled successfully!', 'success');
    }
  }

  showSchedulingError(message) {
    if (window.portfolioApp) {
      window.portfolioApp.showNotification(message, 'error');
    }
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  window.modalSystem = new ModalSystem();
  window.portfolioModal = new PortfolioModal();
  window.contactModal = new ContactModal();
  window.meetingScheduler = new MeetingScheduler();
});

function openPortfolioItem(category, itemId) {
  if (window.portfolioModal) {
    window.portfolioModal.openPortfolioItem(category, itemId);
  }
}

function openMeetingScheduler() {
  if (window.modalSystem) {
    window.modalSystem.open('meetingModal');
  }
}