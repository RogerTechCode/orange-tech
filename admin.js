/**
 * Orange FC Admin Shared Logic
 */

// Basic Auth Check
function checkAuth() {
    if (localStorage.getItem('admin_auth') !== 'true') {
        window.location.href = 'login.html';
    }
}

// Storage moved to firebase-init.js

// Global Logout
function logout() {
    localStorage.removeItem('admin_auth');
    window.location.href = 'login.html';
}

// Mobile Menu Logic
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('admin-mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }

    // Close on overlay click
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Only check auth if not on login page
    const isLoginPage = window.location.pathname.includes('login.html');
    if (!isLoginPage) {
        checkAuth();
    }

    setupMobileMenu();

    // Setup all logout buttons (desktop and mobile)
    const logoutButtons = [
        document.getElementById('logout-btn'),
        document.getElementById('logout-btn-desktop'),
        document.getElementById('logout-btn-mobile')
    ];

    logoutButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', logout);
    });
});
