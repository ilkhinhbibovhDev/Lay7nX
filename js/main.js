// ==================== GLOBAL FONKSİYONLAR ====================

// Tema dəyişdirmə
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  if (!themeToggle) return;

  // Tema öz-özünə yüklənsin
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    body.classList.remove("dark-mode");
    themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
    }
  });
}

// DOM hazır olduğunda tema toggle'ı başlat
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
  initThemeToggle();
}

// ==================== MOBİL MENU ====================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (!mobileMenuBtn || !mobileMenu) return;

  // Menu aç
  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("active");
  });

  // Links kliklenirse menu kapat
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
    });
  });

  // Dış klike menu kapat
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.remove("active");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileMenu);
} else {
  initMobileMenu();
}

// ==================== NAVİGASYON ACTIVE LINK ====================
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isActive =
      href === currentPage || (currentPage === "" && href === "index.html");

    if (isActive) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Navigation'ı Page yüklenince her seferinde güncelle
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setActiveNavLink);
} else {
  setActiveNavLink();
}

// ==================== STATISTICS COUNTER ====================
function animateCounter(element, target, duration = 2000) {
  const hasPlus = element.textContent.includes("+");
  let current = 0;
  const step = target / (duration / 16);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    element.textContent = Math.floor(current) + (hasPlus ? "+" : "");
  }, 16);
}

// Sayğacları görüldüyü zaman başlat
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length === 0) return;

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const number = parseInt(entry.target.textContent);
        if (!isNaN(number)) {
          animateCounter(entry.target, number);
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach((num) => observer.observe(num));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCounterAnimation);
} else {
  initCounterAnimation();
}

// ==================== PORTFOLIO FİLTRİ ====================
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioCards = document.querySelectorAll(
    ".portfolio-card, .gallery-item",
  );

  if (filterButtons.length === 0 || portfolioCards.length === 0) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Active düyməni dəyişdir
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      // Kartları göstər/gizlət
      portfolioCards.forEach((card) => {
        const shouldShow =
          filterValue === "*" ||
          card.classList.contains(filterValue.substring(1));

        if (shouldShow) {
          card.style.display = "";
          // Reflow zorla
          card.offsetHeight;
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolioFilter);
} else {
  initPortfolioFilter();
}

// ==================== FAQ ACCORDION ====================
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll(".faq-header, .faq-question");

  if (faqHeaders.length === 0) return;

  faqHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const faqItem = header.closest(".faq-item");
      if (!faqItem) return;

      const isActive = faqItem.classList.contains("active");

      // Məcburi: bütün FAQ-ları qapat
      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove("active");
          // Smooth close animation
          const content = item.querySelector(".faq-content, .faq-answer");
          if (content && content.style.maxHeight) {
            content.style.maxHeight = "0";
            content.style.overflow = "hidden";
            content.style.transition = "max-height 0.3s ease";
          }
        }
      });

      // Açılan FAQ-u aç yada kapat
      if (!isActive) {
        faqItem.classList.add("active");
        // Smooth open animation
        const content = faqItem.querySelector(".faq-content, .faq-answer");
        if (content) {
          content.style.overflow = "hidden";
          content.style.transition = "max-height 0.3s ease";
          content.style.maxHeight = content.scrollHeight + "px";
        }
      } else {
        faqItem.classList.remove("active");
        // Smooth close animation
        const content = faqItem.querySelector(".faq-content, .faq-answer");
        if (content) {
          content.style.maxHeight = "0";
        }
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFAQAccordion);
} else {
  initFAQAccordion();
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // "#" karakteri varsa işleme sok
      if (href === "#" || href.length <= 1) {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offset = target.offsetTop - 80; // Nav bar offset
        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSmoothScroll);
} else {
  initSmoothScroll();
}

// ==================== PARALLAX ANIM ====================
function initParallax() {
  const parallaxElements = document.querySelectorAll("[data-parallax]");
  if (parallaxElements.length === 0) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach((el) => {
          const speed = parseFloat(el.getAttribute("data-parallax")) || 0.5;
          el.style.transform = `translateY(${scrolled * speed}px)`;
        });

        ticking = false;
      });

      ticking = true;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initParallax);
} else {
  initParallax();
}

// ==================== DEFAULT EXPORT ====================
console.log("Main.js yükləndi");
