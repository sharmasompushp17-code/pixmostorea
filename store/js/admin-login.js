// Admin Login Page JavaScript

// Admin credentials (in real app, this would be server-side)
const adminCredentials = {
    email: 'admin@techstore.com',
    password: 'admin123',
    securityCode: '123456'
};

// Admin session data
let adminSession = JSON.parse(localStorage.getItem('adminSession')) || null;

// DOM elements
const adminLoginForm = document.getElementById('adminLoginForm');
const alertContainer = document.getElementById('alertContainer');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAdminAuth();
    updateSystemStats();
    startServerTime();
    loadLastLogin();
});

// Setup event listeners
function setupEventListeners() {
    // Admin login form
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    
    // Input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        input.addEventListener('input', handleInputChange);
    });
    
    // Security code formatting
    const codeInput = document.getElementById('adminCode');
    codeInput.addEventListener('input', formatSecurityCode);
    
    // Auto-logout timer
    if (adminSession && adminSession.secureSession) {
        startAutoLogoutTimer();
    }
}

// Handle input focus
function handleInputFocus(e) {
    const wrapper = e.target.closest('.input-wrapper');
    wrapper.classList.add('focused');
    
    // Add glow effect
    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
}

// Handle input blur
function handleInputBlur(e) {
    const wrapper = e.target.closest('.input-wrapper');
    wrapper.classList.remove('focused');
    
    e.target.style.boxShadow = '';
    
    // Validate input
    validateAdminInput(e.target);
}

// Handle input change
function handleInputChange(e) {
    validateAdminInput(e.target);
}

// Format security code input
function formatSecurityCode(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 6) {
        value = value.slice(0, 6);
    }
    e.target.value = value;
    
    // Auto-submit when 6 digits entered
    if (value.length === 6) {
        e.target.blur();
    }
}

// Validate admin input
function validateAdminInput(input) {
    const value = input.value;
    const type = input.type;
    const name = input.name;
    
    // Remove previous validation classes
    input.classList.remove('valid', 'invalid');
    
    if (!value) return;
    
    let isValid = true;
    
    switch (name) {
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.includes('techstore.com');
            break;
        case 'password':
            isValid = value.length >= 6;
            break;
        case 'code':
            isValid = /^\d{6}$/.test(value);
            break;
        default:
            isValid = value.length > 0;
    }
    
    input.classList.add(isValid ? 'valid' : 'invalid');
    
    // Update input icon color
    const icon = input.parentElement.querySelector('.input-icon');
    if (icon) {
        icon.style.color = isValid ? '#10b981' : '#ef4444';
    }
}

// Handle admin login
async function handleAdminLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const code = formData.get('code');
    const secureSession = document.getElementById('secureSession').checked;
    
    // Show loading
    const submitBtn = e.target.querySelector('.admin-login-btn');
    showAdminLoading(submitBtn);
    showLoadingOverlay();
    
    // Simulate authentication delay
    await delay(2000);
    
    // Validate credentials
    if (email === adminCredentials.email && 
        password === adminCredentials.password && 
        code === adminCredentials.securityCode) {
        
        // Success - Create admin session
        adminSession = {
            email: email,
            loginTime: new Date().toISOString(),
            secureSession: secureSession,
            sessionId: generateSessionId(),
            permissions: ['read', 'write', 'delete', 'manage']
        };
        
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        localStorage.setItem('lastAdminLogin', new Date().toISOString());
        
        hideAdminLoading(submitBtn);
        hideLoadingOverlay();
        
        showAlert('Admin authentication successful!', 'success');
        
        // Add success animation
        const adminCard = document.querySelector('.admin-card');
        adminCard.style.animation = 'successPulse 0.6s ease-in-out';
        
        // Redirect to admin panel
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
        
    } else {
        // Error
        hideAdminLoading(submitBtn);
        hideLoadingOverlay();
        
        let errorMessage = 'Invalid credentials. Please check:';
        if (email !== adminCredentials.email) {
            errorMessage += '\n• Email must be admin@techstore.com';
        }
        if (password !== adminCredentials.password) {
            errorMessage += '\n• Incorrect password';
        }
        if (code !== adminCredentials.securityCode) {
            errorMessage += '\n• Invalid security code';
        }
        
        showAlert(errorMessage, 'error');
        
        // Shake animation for error
        const adminCard = document.querySelector('.admin-card');
        adminCard.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            adminCard.style.animation = '';
        }, 500);
        
        // Clear sensitive fields
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminCode').value = '';
    }
}

// Password toggle
function toggleAdminPassword() {
    const passwordInput = document.getElementById('adminPassword');
    const toggleIcon = document.getElementById('adminPasswordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Check admin authentication
function checkAdminAuth() {
    if (adminSession) {
        // Check if session is still valid
        const loginTime = new Date(adminSession.loginTime);
        const now = new Date();
        const sessionDuration = (now - loginTime) / (1000 * 60); // minutes
        
        if (adminSession.secureSession && sessionDuration > 30) {
            // Session expired
            localStorage.removeItem('adminSession');
            adminSession = null;
            showAlert('Admin session expired. Please login again.', 'warning');
        } else {
            // Still valid - redirect to admin panel
            showAlert('You are already logged in as admin!', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 2000);
        }
    }
}

// Update system stats
function updateSystemStats() {
    // Get data from localStorage
    const products = JSON.parse(localStorage.getItem('adminProducts')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Animate counters
    animateCounter('totalProducts', products.length);
    animateCounter('totalUsers', users.length);
    animateCounter('totalOrders', orders.length);
}

// Animate counter
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, duration / steps);
}

// Start server time
function startServerTime() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('serverTime').textContent = timeString;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// Load last login
function loadLastLogin() {
    const lastLogin = localStorage.getItem('lastAdminLogin');
    if (lastLogin) {
        const date = new Date(lastLogin);
        const timeString = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('lastLogin').textContent = timeString;
    }
}

// Start auto-logout timer
function startAutoLogoutTimer() {
    const timeoutDuration = 30 * 60 * 1000; // 30 minutes
    
    setTimeout(() => {
        if (adminSession && adminSession.secureSession) {
            localStorage.removeItem('adminSession');
            adminSession = null;
            showAlert('Session expired due to inactivity.', 'warning');
            
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }, timeoutDuration);
}

// Utility functions
function showAdminLoading(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function hideAdminLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

function showLoadingOverlay() {
    loadingOverlay.classList.add('show');
}

function hideLoadingOverlay() {
    loadingOverlay.classList.remove('show');
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-triangle' : 
                 type === 'warning' ? 'fas fa-exclamation-circle' :
                 'fas fa-info-circle';
    
    alert.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'alertSlideOut 0.3s ease forwards';
        setTimeout(() => {
            if (alert.parentNode) {
                alertContainer.removeChild(alert);
            }
        }, 300);
    }, 5000);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateSessionId() {
    return 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Add CSS animations
const adminStyle = document.createElement('style');
adminStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @keyframes alertSlideOut {
        0% {
            opacity: 1;
            transform: translateX(0);
        }
        100% {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    input.valid {
        border-color: #10b981 !important;
    }
    
    input.invalid {
        border-color: #ef4444 !important;
    }
    
    input.valid ~ .input-border {
        background: #10b981 !important;
    }
    
    input.invalid ~ .input-border {
        background: #ef4444 !important;
    }
    
    .input-wrapper.focused .input-icon {
        color: #3b82f6 !important;
        transform: scale(1.1);
    }
`;
document.head.appendChild(adminStyle);

// Security features
document.addEventListener('contextmenu', function(e) {
    // Disable right-click in production
    // e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+U in production
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')) {
        // e.preventDefault();
    }
    
    // Enter key to submit form
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        adminLoginForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape key to clear form
    if (e.key === 'Escape') {
        adminLoginForm.reset();
        const inputs = adminLoginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
            const icon = input.parentElement.querySelector('.input-icon');
            if (icon) {
                icon.style.color = '';
            }
        });
    }
});

// Monitor failed login attempts
let failedAttempts = parseInt(localStorage.getItem('adminFailedAttempts')) || 0;

function trackFailedAttempt() {
    failedAttempts++;
    localStorage.setItem('adminFailedAttempts', failedAttempts.toString());
    
    if (failedAttempts >= 3) {
        showAlert('Multiple failed attempts detected. Account temporarily locked.', 'error');
        
        // Disable form for 5 minutes
        const inputs = adminLoginForm.querySelectorAll('input, button');
        inputs.forEach(input => input.disabled = true);
        
        setTimeout(() => {
            inputs.forEach(input => input.disabled = false);
            localStorage.removeItem('adminFailedAttempts');
            failedAttempts = 0;
            showAlert('Account unlocked. You may try again.', 'success');
        }, 5 * 60 * 1000); // 5 minutes
    }
}

// Reset failed attempts on successful login
function resetFailedAttempts() {
    localStorage.removeItem('adminFailedAttempts');
    failedAttempts = 0;
}

// Add to login success handler
const originalHandleAdminLogin = handleAdminLogin;
handleAdminLogin = async function(e) {
    try {
        await originalHandleAdminLogin(e);
        resetFailedAttempts();
    } catch (error) {
        trackFailedAttempt();
        throw error;
    }
};

// Initialize security check
if (failedAttempts >= 3) {
    showAlert('Account is temporarily locked due to multiple failed attempts.', 'warning');
    const inputs = adminLoginForm.querySelectorAll('input, button');
    inputs.forEach(input => input.disabled = true);
}
