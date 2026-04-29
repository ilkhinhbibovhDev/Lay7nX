// ==================== CONTACT FORM VALİDASYON ====================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Form məlumatlarını al
    const fullName = document.getElementById("fullName")?.value;
    const email = document.getElementById("email")?.value;
    const phone = document.getElementById("phone")?.value;
    const subject = document.getElementById("subject")?.value;
    const message = document.getElementById("message")?.value;
    const terms = document.querySelector('input[name="terms"]')?.checked;

    // Validasyon
    let isValid = true;
    let errorMessage = "";

    // Adı yoxla
    if (!fullName || fullName.trim().length < 3) {
      errorMessage += "Ad ən azı 3 xarakter olmalıdır.\n";
      isValid = false;
    }

    // Email yoxla
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errorMessage += "Düzün email adresi daxil edin.\n";
      isValid = false;
    }

    // Telefonu yoxla (opsiyonal amma düzün məlumat olarsa)
    if (phone && !/^\d{7,}$/.test(phone.replace(/\D/g, ""))) {
      errorMessage += "Telefon nömrəsi düzün deyil.\n";
      isValid = false;
    }

    // Mövzuyu yoxla
    if (!subject) {
      errorMessage += "Mövzunu seçin.\n";
      isValid = false;
    }

    // Mesajı yoxla
    if (!message || message.trim().length < 10) {
      errorMessage += "Mesaj ən azı 10 xarakter olmalıdır.\n";
      isValid = false;
    }

    // Şərtləri yoxla
    if (!terms) {
      errorMessage += "Şərtləri qəbul etməlisiniz.\n";
      isValid = false;
    }

    // Nəticə göstər
    const successDiv = document.querySelector(".success-message");

    if (isValid) {
      // Formu sıfırla
      contactForm.reset();

      // Uğun mesajı göstər
      if (successDiv) {
        successDiv.style.borderLeftColor = "#10B981";
        successDiv.style.background =
          "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))";
        successDiv.style.color = "var(--text-dark)";
        successDiv.innerHTML =
          '<i class="bi bi-check-circle"></i><p>✓ Məsələniz uğurla göndərildi! 2-3 iş günü ərzində sizinlə əlaqə saxlayacağıq.</p>';
        successDiv.classList.add("show");

        // 5 saniyədən sonra gizlət
        setTimeout(() => {
          successDiv.classList.remove("show");
        }, 5000);
      }

      // LocalStorage-a saxla (Backup üçün)
      const formData = {
        fullName,
        email,
        phone,
        subject,
        message,
        timestamp: new Date().toLocaleString("az-AZ"),
      };
      localStorage.setItem("lastContactForm", JSON.stringify(formData));

      console.log("✓ Form məlumatları:", formData);
    } else {
      // Xəta mesajı göstər
      if (successDiv) {
        successDiv.innerHTML =
          "✗ Xəta:\n" + errorMessage.replace(/\n/g, "<br>");
        successDiv.style.borderLeftColor = "#FF6B6B";
        successDiv.style.background = "rgba(255, 107, 107, 0.1)";
        successDiv.style.color = "#FF6B6B";
        successDiv.classList.add("show");

        // 5 saniyədən sonra gizlət
        setTimeout(() => {
          successDiv.classList.remove("show");
          // Style-u sıfırla
          successDiv.style.borderLeftColor = "";
          successDiv.style.background = "";
          successDiv.style.color = "";
        }, 5000);
      }

      console.log("✗ Validasyon xətası:", errorMessage);
    }
  });

  // Real-time email validasyon
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("blur", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value && !emailRegex.test(emailInput.value)) {
        emailInput.style.borderColor = "#FF6B6B";
      } else {
        emailInput.style.borderColor = "";
      }
    });
  }

  // Real-time ad validasyon
  const fullNameInput = document.getElementById("fullName");
  if (fullNameInput) {
    fullNameInput.addEventListener("blur", () => {
      if (fullNameInput.value && fullNameInput.value.trim().length < 3) {
        fullNameInput.style.borderColor = "#FF6B6B";
      } else {
        fullNameInput.style.borderColor = "";
      }
    });
  }

  // Real-time mesaj validasyon
  const messageInput = document.getElementById("message");
  if (messageInput) {
    messageInput.addEventListener("blur", () => {
      if (messageInput.value && messageInput.value.trim().length < 10) {
        messageInput.style.borderColor = "#FF6B6B";
      } else {
        messageInput.style.borderColor = "";
      }
    });
  }
}

// ==================== NEWSLETTER FORM ====================
const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput?.value;

    // Email validasyon
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      alert("Düzün email adresi daxil edin.");
      return;
    }

    // Abunəlliyi saxla
    const subscribers = JSON.parse(localStorage.getItem("newsletters") || "[]");
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem("newsletters", JSON.stringify(subscribers));
    }

    // Formu sıfırla
    newsletterForm.reset();

    // Uğun mesajı göstər
    alert("Abunəlik uğurlu! Ən son xəbərləri e-mail ilə alacaqsınız.");
    console.log("✓ Abunəlik məlumatları:", {
      email,
      timestamp: new Date().toLocaleString("az-AZ"),
    });
  });
}

// ==================== AUTO-SAVE DRAFT ====================
const formInputs = document.querySelectorAll(
  ".contact-form input, .contact-form textarea, .contact-form select",
);

formInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const formData = {};
    formInputs.forEach((field) => {
      formData[field.id || field.name] = field.value;
    });
    localStorage.setItem("contactFormDraft", JSON.stringify(formData));
  });
});

// Draft-ı yüklə
function loadContactFormDraft() {
  const draft = localStorage.getItem("contactFormDraft");
  if (draft) {
    const formData = JSON.parse(draft);
    formInputs.forEach((input) => {
      if (formData[input.id || input.name]) {
        input.value = formData[input.id || input.name];
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadContactFormDraft);
} else {
  loadContactFormDraft();
}

console.log("Contact.js yükləndi");
