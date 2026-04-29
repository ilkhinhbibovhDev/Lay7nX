// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    initNavigation();
    setupEventListeners();
    loadUsersFromStorage();
});

// ===== SIDEBAR TOGGLE =====
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    // Load sidebar state from localStorage
    const sidebarActive = localStorage.getItem('sidebarActive') === 'true';
    if (sidebarActive) {
        sidebar.classList.add('active');
    }
    
    // Create toggle button if it doesn't exist
    if (!toggleBtn || !toggleBtn.parentNode) {
        const toggle = document.createElement('button');
        toggle.className = 'sidebar-toggle';
        toggle.innerHTML = '<i class="bi bi-chevron-right"></i>';
        const header = document.querySelector('.sidebar-header');
        header.appendChild(toggle);
        toggle.addEventListener('click', toggleSidebar);
    } else {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
    localStorage.setItem('sidebarActive', sidebar.classList.contains('active'));
}

// ===== NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Get section and show it
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update page title
            updatePageTitle(section);
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const activeSection = document.getElementById(sectionId + '-section');
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

function updatePageTitle(section) {
    const titles = {
        'dashboard': 'Dashboard',
        'users': 'İstifadəçilər Yönetimi',
        'analytics': 'Analitika',
        'security': 'Təhlükəsizlik',
        'reports': 'Hesabatlar',
        'settings': 'Ayarlar'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    pageTitle.textContent = titles[section] || 'Dashboard';
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Add user button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', addNewUser);
    }
    
    // Search users
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('keyup', filterUsers);
    }
    
    // Logout button
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showNotification('Çıxış edildisiz');
            setTimeout(() => {
                location.href = 'index.html';
            }, 1500);
        });
    }
}

// ===== USER MANAGEMENT =====
function addNewUser() {
    const name = prompt('İstifadəçi adı:');
    if (!name) return;
    
    const email = prompt('Email ünvanı:');
    if (!email) return;
    
    const status = confirm('Fəal istifadəçi? (Bəli/Xeyr)') ? 'active' : 'inactive';
    
    const user = {
        id: Date.now(),
        name: name,
        email: email,
        status: status,
        joinDate: new Date().toLocaleDateString('az-AZ')
    };
    
    let users = JSON.parse(localStorage.getItem('dashboardUsers')) || [];
    users.push(user);
    localStorage.setItem('dashboardUsers', JSON.stringify(users));
    
    loadUsersFromStorage();
    showNotification('İstifadəçi əlavə edildi: ' + name);
}

function editUser(userId) {
    let users = JSON.parse(localStorage.getItem('dashboardUsers')) || [];
    const user = users.find(u => u.id == userId);
    
    if (!user) return;
    
    const newName = prompt('Yeni ad:', user.name);
    if (newName === null) return;
    
    user.name = newName;
    localStorage.setItem('dashboardUsers', JSON.stringify(users));
    loadUsersFromStorage();
    showNotification('İstifadəçi redaktə edildi');
}

function deleteUser(userId) {
    if (!confirm('Bunu silmək istədiyinizə əminsiniz?')) return;
    
    let users = JSON.parse(localStorage.getItem('dashboardUsers')) || [];
    users = users.filter(u => u.id != userId);
    localStorage.setItem('dashboardUsers', JSON.stringify(users));
    
    loadUsersFromStorage();
    showNotification('İstifadəçi silindi');
}

function loadUsersFromStorage() {
    const users = JSON.parse(localStorage.getItem('dashboardUsers')) || [];
    const tbody = document.querySelector('.users-table tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge-status ${user.status}">${user.status === 'active' ? 'Fəal' : 'Qeyri-fəal'}</span></td>
            <td>${user.joinDate}</td>
            <td>
                <button class="btn-action" onclick="editUser(${user.id})" title="Redaktə et">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action delete" onclick="deleteUser(${user.id})" title="Sil">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterUsers() {
    const searchValue = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.users-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? '' : 'none';
    });
}

// ===== NOTIFICATIONS =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== DASHBOARD DATA =====
function initDashboardData() {
    // Initialize sample data if needed
    const stats = [
        { label: 'Ümumi İstifadəçilər', value: 1284, change: '+12%', icon: 'bi-people-fill', bgClass: 'bg-primary' },
        { label: 'Aktiv Məturəan', value: 856, change: '+8%', icon: 'bi-graph-up', bgClass: 'bg-success' },
        { label: 'Aylıq Gəlir', value: '$24.5K', change: '+5%', icon: 'bi-cash-coin', bgClass: 'bg-warning' },
        { label: 'Sistem Sağlığı', value: '98%', change: '+2%', icon: 'bi-shield-check', bgClass: 'bg-danger' }
    ];
    
    return stats;
}
