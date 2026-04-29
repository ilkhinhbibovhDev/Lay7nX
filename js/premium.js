// ========================================
// NEXUS PREMIUM - ADVANCED JAVASCRIPT
// ========================================

// Global State Management
const state = {
    currentPage: 'home',
    darkMode: true,
    scrollPosition: 0,
    mobileMenuOpen: false,
    notifications: []
};

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupScrollAnimations();
    setupIntersectionObserver();
});

// ========================================
// INITIALIZATION FUNCTIONS
// ========================================

function initializeApp() {
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    state.darkMode = savedTheme === 'dark';
    
    // Set initial active page
    const homeSection = document.getElementById('home-section') || document.querySelector('.hero-section');
    if (homeSection) {
        state.currentPage = 'home';
        homeSection.classList.add('active');
    }
    
    console.log('NEXUS Premium initialized');
    showNotification('NEXUS 🚀 yükləndi');
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile Menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
    }

    // Portfolio Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handlePortfolioFilter);
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Modal Close
    const modal = document.getElementById('projectModal');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.querySelector('.close')?.addEventListener('click', closeModal);
    }

    // Window Resize Handler
    window.addEventListener('resize', handleWindowResize);

    // Scroll Events
    window.addEventListener('scroll', handleScroll);
}

// ========================================
// NAVIGATION FUNCTIONS
// ========================================

function handleNavigation(e) {
    e.preventDefault();
    const page = this.getAttribute('data-page');
    navigateToPage(page);
}

function navigateToPage(page) {
    // Remove active class from all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Add active class to new section
    const sectionId = `${page}-section`;
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        state.currentPage = page;
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });

    // Close mobile menu
    if (state.mobileMenuOpen) {
        toggleMobileMenu();
    }

    // Scroll to top with animation
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    console.log(`Navigated to: ${page}`);
}

function scrollToPage(page) {
    navigateToPage(page);
}

// ========================================
// THEME MANAGEMENT
// ========================================

function toggleTheme() {
    state.darkMode = !state.darkMode;
    document.body.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    if (state.darkMode) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }

    showNotification(state.darkMode ? 'Koyu Tema Aktiv' : 'Açıq Tema Aktiv');
}

// ========================================
// MOBILE MENU
// ========================================

function toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    const menu = document.querySelector('.nav-menu');
    
    if (menu) {
        if (state.mobileMenuOpen) {
            menu.style.display = 'flex';
            menu.style.animation = 'slideDown 0.3s ease-out';
        } else {
            menu.style.display = 'none';
        }
    }
}

// ========================================
// PORTFOLIO FILTERING
// ========================================

function handlePortfolioFilter(e) {
    const filter = this.getAttribute('data-filter');
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    this.classList.add('active');

    // Filter portfolio cards
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'grid';
            card.style.animation = 'scaleIn 0.6s ease-out';
        }
    });

    showNotification(`Filtr: ${filter === 'all' ? 'Hamısı' : filter} seçildi`);
}

// ========================================
// CONTACT FORM
// ========================================

function handleContactSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name') || this.children[0].querySelector('input').value;
    const email = formData.get('email') || this.children[1].querySelector('input').value;
    const subject = formData.get('subject') || this.children[2].querySelector('input').value;
    const message = formData.get('message') || this.children[3].querySelector('textarea').value;

    // Validate
    if (!name || !email || !subject || !message) {
        showNotification('Xahişçi bütün xanalar doldurun!', 'error');
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showNotification('Zəhmət olmasa etibarlı bir email ünvanı daxil edin!', 'error');
        return;
    }

    // Simulate sending (in real app, this would be an API call)
    console.log('Form Data:', { name, email, subject, message });

    // Show success
    showNotification('Mesajınız göndərildi! Əvvəlcə cevab verəcəyik.', 'success');

    // Reset form
    this.reset();

    // Add to notifications state
    state.notifications.push({
        from: name,
        email: email,
        subject: subject,
        timestamp: new Date()
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// NOTIFICATIONS SYSTEM
// ========================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${getNotificationIcon(type)}
            </div>
            <div class="notification-text">
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        'info': '<i class="bi bi-info-circle-fill"></i>',
        'success': '<i class="bi bi-check-circle-fill"></i>',
        'error': '<i class="bi bi-exclamation-circle-fill"></i>',
        'warning': '<i class="bi bi-exclamation-triangle-fill"></i>'
    };
    return icons[type] || icons['info'];
}

// Add CSS for notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        .notification-content {
            background: linear-gradient(135deg, #00D4FF, #7C3AED);
            color: #0A0E27;
            padding: 16px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(0, 212, 255, 0.3);
            min-width: 300px;
        }

        .notification-info .notification-content {
            background: linear-gradient(135deg, #00D4FF, #7C3AED);
        }

        .notification-success .notification-content {
            background: linear-gradient(135deg, #4CAF50, #388E3C);
        }

        .notification-error .notification-content {
            background: linear-gradient(135deg, #F44336, #D32F2F);
        }

        .notification-warning .notification-content {
            background: linear-gradient(135deg, #FFC107, #FF8F00);
        }

        .notification-icon {
            font-size: 20px;
            min-width: 24px;
        }

        .notification-text p {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
        }

        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
        }

        @media (max-width: 480px) {
            .notification-content {
                min-width: auto;
                width: calc(100vw - 40px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize notification styles
addNotificationStyles();

// ========================================
// SCROLL ANIMATIONS
// ========================================

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('[class*="animate"]');
    
    window.addEventListener('scroll', () => {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.8) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });
}

// ========================================
// INTERSECTION OBSERVER FOR LAZY LOADING
// ========================================

function setupIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe portfolio cards
    document.querySelectorAll('.portfolio-card').forEach(card => {
        observer.observe(card);
    });

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
}

// ========================================
// SCROLL EVENT HANDLER
// ========================================

function handleScroll() {
    state.scrollPosition = window.scrollY;

    // Hide/show navbar based on scroll
    const nav = document.querySelector('.floating-nav');
    if (nav) {
        if (state.scrollPosition > 50) {
            nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.boxShadow = 'none';
        }
    }

    // Update nav items based on section visibility
    updateActiveNavItem();
}

function updateActiveNavItem() {
    const sections = document.querySelectorAll('.page-section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (state.scrollPosition >= sectionTop - 200 && 
            state.scrollPosition < sectionTop + sectionHeight - 200) {
            const sectionId = section.id.replace('-section', '');
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            const activeItem = document.querySelector(`[data-page="${sectionId}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
            }
        }
    });
}

// ========================================
// MODAL FUNCTIONS
// ========================================

function openModal(projectName) {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'block';
        modal.querySelector('h2').textContent = projectName + ' - Detaylar';
        showNotification(`${projectName} açılıyor...`);
    }
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Add click handlers to portfolio cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectName = this.querySelector('h3').textContent;
            openModal(projectName);
        });
    });
});

// ========================================
// WINDOW RESIZE HANDLER
// ========================================

function handleWindowResize() {
    const width = window.innerWidth;
    
    if (width <= 768 && state.mobileMenuOpen) {
        // Keep menu closed on mobile
    } else if (width > 768 && state.mobileMenuOpen) {
        // Show menu on desktop
    }
}

// ========================================
// PARALLAX SCROLLING
// ========================================

function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const parallaxElements = heroSection.querySelectorAll('.floating-card, .animated-orb');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize parallax on load
window.addEventListener('load', initParallaxEffect);

// ========================================
// MOUSE FOLLOW EFFECT
// ========================================

function initMouseFollowEffect() {
    const orb = document.querySelector('.animated-orb');
    if (!orb) return;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        const moveX = (x / window.innerWidth) * 30 - 15;
        const moveY = (y / window.innerHeight) * 30 - 15;
        
        orb.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
}

window.addEventListener('load', initMouseFollowEffect);

// ========================================
// COUNTER ANIMATION
// ========================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        if (!isNaN(target)) {
            let current = 0;
            const increment = target / 30;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                }
            }, 50);
        }
    });
}

// Trigger counters when stats section is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('stats-section')) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // Alt + H - Home
    if (e.altKey && e.key === 'h') {
        navigateToPage('home');
    }
    // Alt + P - Portfolio
    if (e.altKey && e.key === 'p') {
        navigateToPage('portfolio');
    }
    // Alt + C - Contact
    if (e.altKey && e.key === 'c') {
        navigateToPage('contact');
    }
    // Escape - Close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ========================================
// LOCAL STORAGE MANAGEMENT
// ========================================

function saveUserPreferences() {
    const prefs = {
        theme: state.darkMode ? 'dark' : 'light',
        lastVisited: state.currentPage,
        visitCount: (parseInt(localStorage.getItem('visitCount')) || 0) + 1,
        lastVisitTime: new Date().toISOString()
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
}

function loadUserPreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    return prefs;
}

// Save preferences on unload
window.addEventListener('beforeunload', saveUserPreferences);

// ========================================
// PERFORMANCE MONITORING
// ========================================

function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        const connectTime = timing.responseEnd - timing.requestStart;
        const renderTime = timing.domComplete - timing.domLoading;
        
        console.log('Performance Metrics:');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Connect Time: ${connectTime}ms`);
        console.log(`Render Time: ${renderTime}ms`);
    }
}

window.addEventListener('load', () => {
    setTimeout(logPerformanceMetrics, 0);
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// ANALYTICS
// ========================================

function trackEvent(eventName, data = {}) {
    const event = {
        name: eventName,
        timestamp: new Date(),
        page: state.currentPage,
        scrollPosition: state.scrollPosition,
        ...data
    };
    
    console.log('Event tracked:', event);
    
    // In production, this would send to analytics service
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) })
}

// Track navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        trackEvent('navigation', { page: this.getAttribute('data-page') });
    });
});

// Track form submissions
document.getElementById('contactForm')?.addEventListener('submit', function() {
    trackEvent('form_submission', { form: 'contact' });
});

// ========================================
// API MOCK
// ========================================

async function fetchProjects() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'E-Commerce Platform', category: 'web' },
                { id: 2, name: 'Fitness Tracker', category: 'mobile' },
                { id: 3, name: 'Analytics Dashboard', category: 'web' },
                { id: 4, name: 'AI Chatbot', category: 'ai' },
                { id: 5, name: 'Microservices', category: 'web' },
                { id: 6, name: '3D Experience', category: 'web' }
            ]);
        }, 500);
    });
}

// ========================================
// CONSOLE WELCOME MESSAGE
// ========================================

console.log('%c🚀 NEXUS Premium Dashboard', 'font-size: 20px; font-weight: bold; color: #00D4FF;');
console.log('%cVersion: 1.0.0', 'font-size: 14px; color: #7C3AED;');
console.log('%cFazla məlumat üçün xoş gəldiniz!', 'font-size: 12px; color: #FFD60A;');
console.log('%c📧 Əlaqə: ilkin@nexus.dev', 'font-size: 12px; color: #FF006E;');
