// ============================================
// TESTIMONIALS PAGE SCRIPT
// ============================================

class TestimonialsPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupTheme();
        this.loadTestimonials();
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingBar = document.getElementById('loadingBar');
        
        if (!loadingScreen) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.visibility = 'hidden';
                }, 500);
            }
            
            if (loadingBar) loadingBar.style.width = `${progress}%`;
        }, 200);
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

    loadTestimonials() {
        const container = document.getElementById('testimonialsGrid');
        if (!container || !window.PORTFOLIO_DATA) return;

        const testimonials = window.PORTFOLIO_DATA.testimonials;
        container.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <div class="stars">
                        ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                    </div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                </div>
                <div class="testimonial-author">
                    <img src="${testimonial.avatar}" alt="${testimonial.name}" class="author-avatar">
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.role}, ${testimonial.company}</p>
                        <small>Project: ${testimonial.project} (${testimonial.projectType})</small>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsPage();
});