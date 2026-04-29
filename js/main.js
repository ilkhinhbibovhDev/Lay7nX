// ==================== GLOBAL FONKSİYONLAR ====================

// Tema dəyişdirmə
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Tema öz-özünə yüklənsin
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
}

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
  }
});

// ==================== MOBİL MENU ====================
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-link");

mobileMenuBtn?.addEventListener("click", () => {
  mobileMenu?.classList.add("active");
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu?.classList.remove("active");
  });
});

// ==================== NAVİGASYON ACTIVE LINK ====================
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

setActiveNavLink();

// ==================== STATISTICS COUNTER ====================
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const step = target / (duration / 16);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    element.textContent =
      Math.floor(current) + (element.textContent.includes("+") ? "+" : "");
  }, 16);
}

// Sayğacları görüldüyü zaman başlat
const statNumbers = document.querySelectorAll(".stat-number");
if (statNumbers.length > 0) {
  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const number = parseInt(entry.target.textContent);
        animateCounter(entry.target, number);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach((num) => observer.observe(num));
}

// ==================== PORTFOLIO FİLTRİ ====================
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll(
  ".portfolio-card, .gallery-item",
);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Active düyməni dəyişdir
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    // Kartları göstər/gizlət
    portfolioCards.forEach((card) => {
      if (
        filterValue === "*" ||
        card.classList.contains(filterValue.substring(1))
      ) {
        card.style.display = "";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        }, 10);
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

// ==================== FAQ ACCORDION ====================
const faqHeaders = document.querySelectorAll(".faq-header, .faq-question");

faqHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const faqItem = header.parentElement;
    const isActive = faqItem.classList.contains("active");

    // Məcburi: bütün FAQ-ları qapat
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Açılan FAQ-u aç
    if (!isActive) {
      faqItem.classList.add("active");
    }
  });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });
});

// ==================== PARALLAX ANIM ====================
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  parallaxElements.forEach((el) => {
    const speed = el.getAttribute("data-parallax") || 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ==================== DEFAULT EXPORT ====================
console.log("Main.js yükləndi");
