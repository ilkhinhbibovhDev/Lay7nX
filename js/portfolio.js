// ==================== PORTFOLIO FİLTRİ (Advanced) ====================

// Portfolio filter state
let currentFilter = '*';

// Portfolio filter buttons
const portfolioFilterBtns = document.querySelectorAll('[data-filter]');
const portfolioItems = document.querySelectorAll('.portfolio-card, .gallery-item');

portfolioFilterBtns.forEach(button => {
    button.addEventListener('click', function() {
        // Öncəki active-i kaldır
        portfolioFilterBtns.forEach(btn => btn.classList.remove('active'));
        
        // Yeni active düyməni seç
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        
        // Kartları filtrə
        filterPortfolio(currentFilter);
    });
});

function filterPortfolio(filter) {
    portfolioItems.forEach(item => {
        // Filtri əməl meydan çəkdir
        if (filter === '*' || item.classList.contains(filter.substring(1))) {
            // Göstər
            item.style.display = '';
            // Animation ilə yavaş-yavaş göstər
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            });
        } else {
            // Gizlət
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Portfolio items üzərində animation
portfolioItems.forEach(item => {
    item.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // Hover animasyon
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
        if (currentFilter === '*' || this.classList.contains(currentFilter.substring(1))) {
            this.style.transform = 'scale(1)';
        }
    });
});

// ==================== PORTFOLIO SEARCH ====================
const searchInput = document.querySelector('[data-portfolio-search]');

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        portfolioItems.forEach(item => {
            const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = '';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
}

// ==================== PORTFOLIO SORTING ====================
const sortSelect = document.querySelector('[data-portfolio-sort]');

if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const itemsArray = Array.from(portfolioItems);
        const parent = portfolioItems[0]?.parentElement;
        
        if (sortValue === 'newest') {
            itemsArray.reverse();
        } else if (sortValue === 'oldest') {
            itemsArray.sort();
        } else if (sortValue === 'popular') {
            itemsArray.sort(() => Math.random() - 0.5);
        }
        
        itemsArray.forEach(item => {
            parent?.appendChild(item);
        });
    });
}

// ==================== PORTFOLIO MODAL ====================
let currentImageIndex = 0;
let filteredImages = [];

function initPortfolioModal() {
    const viewButtons = document.querySelectorAll('.portfolio-card a, .gallery-item .view-btn, .gallery-overlay .view-btn');
    
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('view-btn') || this.getAttribute('href') === '#') {
                e.preventDefault();
                currentImageIndex = index;
                openPortfolioModal(this);
            }
        });
    });
}

function openPortfolioModal(element) {
    // Modal HTML-i yaradırsa
    if (!document.getElementById('portfolioModal')) {
        const modal = document.createElement('div');
        modal.id = 'portfolioModal';
        modal.className = 'portfolio-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="" alt="" id="modalImage">
                <div class="modal-title" id="modalTitle"></div>
                <div class="modal-nav">
                    <button class="modal-prev">❮</button>
                    <button class="modal-next">❯</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Modalı close et
        document.querySelector('.close-modal')?.addEventListener('click', closePortfolioModal);
        document.getElementById('portfolioModal')?.addEventListener('click', closePortfolioModal);
        document.querySelector('.modal-content')?.addEventListener('click', (e) => e.stopPropagation());
        
        // Navigation
        document.querySelector('.modal-prev')?.addEventListener('click', prevImage);
        document.querySelector('.modal-next')?.addEventListener('click', nextImage);
    }
    
    showPortfolioImage(element);
}

function showPortfolioImage(element) {
    const title = element.querySelector('h3')?.textContent || 'Portfolio';
    const image = element.querySelector('[style*="background"]');
    
    document.getElementById('portfolioModal')?.classList.add('show');
    document.getElementById('modalTitle').textContent = title;
    
    // Background-ı image olaraq göstər
    if (image) {
        const bgImage = image.style.backgroundImage;
        document.getElementById('modalImage').alt = title;
    }
}

function closePortfolioModal() {
    document.getElementById('portfolioModal')?.classList.remove('show');
}

function nextImage() {
    currentImageIndex++;
    if (currentImageIndex >= portfolioItems.length) {
        currentImageIndex = 0;
    }
}

function prevImage() {
    currentImageIndex--;
    if (currentImageIndex < 0) {
        currentImageIndex = portfolioItems.length - 1;
    }
}

// Initialize
initPortfolioModal();

// ==================== PORTFOLIO STATS ====================
function calculatePortfolioStats() {
    const categories = {};
    
    portfolioItems.forEach(item => {
        if (item.classList.contains('web')) categories.web = (categories.web || 0) + 1;
        if (item.classList.contains('mobile')) categories.mobile = (categories.mobile || 0) + 1;
        if (item.classList.contains('ui')) categories.ui = (categories.ui || 0) + 1;
        if (item.classList.contains('ai')) categories.ai = (categories.ai || 0) + 1;
    });
    
    console.log('📊 Portfolio Statistikası:', {
        total: portfolioItems.length,
        categories: categories
    });
    
    return categories;
}

const portfolioStats = calculatePortfolioStats();

// ==================== GALLERY LAZY LOADING ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Lazy load image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ==================== TIMELINE ANIMATION ====================
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) return;
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInLeft 0.6s ease-out forwards';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => timelineObserver.observe(item));
}

initTimelineAnimation();

// ==================== COMPARE PROJECTS ====================
function compareProjects(project1, project2) {
    const p1 = document.querySelector(`[data-project="${project1}"]`);
    const p2 = document.querySelector(`[data-project="${project2}"]`);
    
    if (p1 && p2) {
        console.log('📊 Proyektləri müqayisə et:');
        console.log('Project 1:', p1.textContent);
        console.log('Project 2:', p2.textContent);
    }
}

// ==================== PORTFOLIO ANIMATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const portfolioContainer = document.querySelector('.portfolio-grid');
    
    if (portfolioContainer) {
        portfolioContainer.style.animation = 'fadeIn 0.8s ease-out';
    }
});

console.log('Portfolio.js yükləndi');
