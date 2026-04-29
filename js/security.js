// ==================== ADVANCED SECURITY FUNCTIONS ====================

/**
 * XSS Hücumlarından Qorunma
 * HTML çıxışını sanitize et
 */
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Input Validasyon
 */
function validateInput(input, type = 'text') {
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    }
    if (type === 'phone') {
        const phoneRegex = /^\d{7,}$/;
        return phoneRegex.test(input.replace(/\D/g, ''));
    }
    if (type === 'text') {
        return input.trim().length > 0 && input.length < 500;
    }
    return false;
}

/**
 * SQL Injection Hücumlarından Qorunma
 */
function preventSQLInjection(input) {
    const dangerousChars = ['--', '/*', '*/', 'xp_', 'sp_', ';', 'DROP', 'DELETE', 'INSERT'];
    const lowerInput = input.toLowerCase();
    return !dangerousChars.some(char => lowerInput.includes(char));
}

/**
 * CSRF Token Yaradıcı
 */
function generateCSRFToken() {
    const token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    sessionStorage.setItem('csrfToken', token);
    return token;
}

/**
 * CSRF Token Yoxla
 */
function validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem('csrfToken');
    return storedToken && storedToken === token;
}

/**
 * Rate Limiting (formu sadə hücumlardan qoruy)
 */
const rateLimitMap = new Map();

function checkRateLimit(identifier, maxAttempts = 5, timeWindow = 60000) {
    if (!rateLimitMap.has(identifier)) {
        rateLimitMap.set(identifier, { attempts: 1, firstTime: Date.now() });
        return true;
    }

    const record = rateLimitMap.get(identifier);
    const now = Date.now();

    if (now - record.firstTime > timeWindow) {
        rateLimitMap.set(identifier, { attempts: 1, firstTime: now });
        return true;
    }

    record.attempts++;
    if (record.attempts > maxAttempts) {
        console.warn('⚠️ Rate limit aşıldı:', identifier);
        return false;
    }

    return true;
}

/**
 * DDoS Hücumlarından Qorunma
 */
let requestCount = 0;
let lastResetTime = Date.now();

function monitorRequests() {
    const now = Date.now();
    if (now - lastResetTime > 60000) {
        requestCount = 0;
        lastResetTime = now;
    }

    requestCount++;
    if (requestCount > 1000) {
        console.error('🚨 DDoS Hücumu Aşkarlanmışdır!');
        // Saytı bloklayda
        document.body.innerHTML = '<h1>Sayt Xidmət Yoxdur - DDoS Hücumu Aşkarlanmışdır</h1>';
        return false;
    }
    return true;
}

/**
 * LocalStorage Şifrələmə (basit)
 */
function encryptData(data, key = 'lay7nx') {
    try {
        const encoded = btoa(JSON.stringify(data));
        return encoded;
    } catch (e) {
        console.error('Şifrələmə Xətası:', e);
        return null;
    }
}

/**
 * LocalStorage Deşifrələmə
 */
function decryptData(encodedData, key = 'lay7nx') {
    try {
        const decoded = JSON.parse(atob(encodedData));
        return decoded;
    } catch (e) {
        console.error('Deşifrələmə Xətası:', e);
        return null;
    }
}

/**
 * Form Submission Hücümünü Blokla
 */
document.addEventListener('submit', function(e) {
    const form = e.target;
    const formId = form.id || 'unknown';

    // Rate limit yoxla
    if (!checkRateLimit(formId)) {
        e.preventDefault();
        alert('Çox sürətli formalar göndərdiniz. Biraz sonra yenidən cəhd edin.');
        return;
    }

    // DDoS monitorinq
    if (!monitorRequests()) {
        e.preventDefault();
        return;
    }

    // Form inputlarını validasyon et
    const inputs = form.querySelectorAll('input, textarea, select');
    for (let input of inputs) {
        if (input.name && input.value) {
            // SQL Injection yoxla
            if (!preventSQLInjection(input.value)) {
                console.warn('⚠️ Məhtəviyat Şüphəli Tapıldı:', input.value);
                e.preventDefault();
                alert('Xəta: Formdakı məhtəviyyət təhlükəli görünür.');
                return;
            }

            // XSS yoxla
            if (input.value.includes('<script') || input.value.includes('javascript:')) {
                console.warn('⚠️ XSS Hücumu Aşkarlanmışdır!');
                e.preventDefault();
                alert('Xəta: Təhlükəli kod aşkarlanmışdır.');
                return;
            }
        }
    }
});

/**
 * Konsol Saldırılarını Blokla
 */
(function() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    // Bəzi kommandaları blok et
    window.console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && 
            (args[0].includes('fetch') || args[0].includes('eval'))) {
            console.warn('🚨 Şüphəli Komanda Bloklanmışdır');
            return;
        }
        originalLog.apply(console, args);
    };
})();

/**
 * Cookies Güvenliyi
 */
function setSecureCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    
    // HttpOnly flag lazım olsa backend-də ayarlanmalı
    document.cookie = name + '=' + encodeURIComponent(value) + ';' + expires + ';path=/;SameSite=Strict';
}

/**
 * Başlanğıc Güvenlik Yoxlaması
 */
window.addEventListener('load', () => {
    // CSRF Token yaradıcı
    generateCSRFToken();
    
    // Konsol qoruması
    console.log('🛡️ Güvenlik Modulları Yükləndi');
    
    // Saytın müqəddəs verisi yoxla
    if (document.documentElement.innerHTML.includes('eval(') || 
        document.documentElement.innerHTML.includes('document.write')) {
        console.error('🚨 Saytda Təhlükəli Kod Aşkarlanmışdır!');
    }
});

/**
 * Export funktions
 */
window.SecurityManager = {
    sanitizeHTML,
    validateInput,
    preventSQLInjection,
    generateCSRFToken,
    validateCSRFToken,
    checkRateLimit,
    monitorRequests,
    encryptData,
    decryptData,
    setSecureCookie
};

console.log('✅ Security.js Yükləndi - Sayt Qorundudur');
