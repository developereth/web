/* ============================================================
   WebBuilder - Core JavaScript (Shared Across All Pages)
   Version: 2.0
   ============================================================ */

const App = {
    name: 'WebBuilder',
    version: '2.0',
    
    init() {
        this.setupHeader();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupAnimations();
        this.updateAuthUI();
    },
    
    setupHeader() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    },
    
    setupMobileMenu() {
        const toggle = document.querySelector('.navbar-toggle');
        const menu = document.querySelector('.navbar-menu');
        if (!toggle || !menu) return;
        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('active');
            toggle.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        document.querySelectorAll('.navbar-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    },
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 72;
                    window.scrollTo({ top: target.offsetTop - headerHeight - 20, behavior: 'smooth' });
                }
            });
        });
    },
    
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    },
    
    updateAuthUI() {
        const user = JSON.parse(localStorage.getItem('wb_current_user'));
        document.querySelectorAll('[data-auth]').forEach(el => {
            const action = el.dataset.auth;
            if (action === 'hide-logged-in' && user) el.classList.add('hidden');
            if (action === 'show-logged-in' && !user) el.classList.add('hidden');
            if (action === 'user-name' && user) el.textContent = user.name;
        });
    }
};

/* Storage Helper */
const Storage = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
    remove(key) { localStorage.removeItem(key); },
    getUsers() { return this.get('wb_users') || []; },
    saveUser(user) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.email === user.email);
        if (index >= 0) users[index] = { ...users[index], ...user };
        else users.push(user);
        this.set('wb_users', users);
    },
    findUser(email) { return this.getUsers().find(u => u.email === email); },
    getCurrentUser() { return this.get('wb_current_user'); },
    setCurrentUser(user) { this.set('wb_current_user', user); },
    logout() { this.remove('wb_current_user'); window.location.href = '/web/login.html'; },
    getSites() {
        const sites = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('wb_site_')) {
                sites.push({ name: key.replace('wb_site_', ''), content: localStorage.getItem(key) });
            }
        }
        return sites;
    },
    saveSite(name, content) { localStorage.setItem('wb_site_' + name, content); },
    deleteSite(name) { localStorage.removeItem('wb_site_' + name); },
    getPayments() { return this.get('wb_payments') || []; },
    savePayment(payment) {
        const payments = this.getPayments();
        payments.push(payment);
        this.set('wb_payments', payments);
    }
};

/* Toast Notifications */
const Toast = {
    container: null,
    init() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    },
    show(message, type = 'success', duration = 3000) {
        if (!this.container) this.init();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        this.container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error', 5000); },
    warning(msg) { this.show(msg, 'warning', 4000); }
};

/* Utility Functions */
const Util = {
    formatDate(dateString) { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); },
    formatCurrency(amount) { return 'Br ' + Number(amount).toLocaleString(); },
    generateId() { return 'wb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); },
    isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); },
    isValidEthiopianPhone(phone) { return /^09[0-9]{8}$/.test(phone); },
    getQueryParam(name) { return new URLSearchParams(window.location.search).get(name); },
    requireAuth() {
        const user = Storage.getCurrentUser();
        if (!user) { window.location.href = '/web/login.html'; return false; }
        return user;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    Toast.init();
});
