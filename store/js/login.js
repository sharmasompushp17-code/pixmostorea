// Cool User Login Page JavaScript

// User data storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM elements
const loginCard = document.querySelector('.login-card');
const registerCard = document.getElementById('registerCard');
const forgotCard = document.getElementById('forgotCard');
const messageContainer = document.getElementById('messageContainer');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
    startParticleAnimation();
});

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Forgot password form
    document.getElementById('forgotForm').addEventListener('submit', handleForgotPassword);
    
    // Input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        input.addEventListener('input', handleInputChange);
    });
    
    // Add floating label effect
    inputs.forEach(input => {
        if (input.value) {
            input.classList.add('has-value');
        }
    });
}

// Handle input focus
function handleInputFocus(e) {
    const wrapper = e.target.closest('.input-wrapper');
    wrapper.classList.add('focused');
    
    // Add ripple effect
    createRipple(e.target, e);
}

// Handle input blur
function handleInputBlur(e) {
    const wrapper = e.target.closest('.input-wrapper');
    wrapper.classList.remove('focused');
    
    if (e.target.value) {
        e.target.classList.add('has-value');
    } else {
        e.target.classList.remove('has-value');
    }
}

// Handle input change
function handleInputChange(e) {
    if (e.target.value) {
        e.target.classList.add('has-value');
    } else {
        e.target.classList.remove('has-value');
    }
    
    // Real-time validation
    validateInput(e.target);
}

// Create ripple effect
function createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    // Show loading
    const submitBtn = form.querySelector('.login-btn');
    showLoading(submitBtn);
    
    // Simulate API call delay
    await delay(1500);
    
    // Debug: Log login attempt
    console.log('Login attempt:', { email, password });
    console.log('Registered users:', users);
    
    // Validate credentials
    const user = users.find(u => u.email === email && u.password === password);
    console.log('Found user:', user);
    
    if (user) {
        // Success
        currentUser = { ...user, lastLogin: new Date().toISOString() };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Success - store current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Track login
        const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
        loginHistory.push({
            email: email,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
        
        hideLoading(submitBtn);
        showMessage('Login successful! Redirecting...', 'success');
        
        // Add success animation
        loginCard.classList.add('success-animation');
        
        // Redirect after animation
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } else {
        // Error
        hideLoading(submitBtn);
        
        // Check if email exists but password is wrong
        const emailExists = users.find(u => u.email === email);
        if (emailExists) {
            showMessage('Incorrect password. Please try again.', 'error');
            console.log('Email exists but password is wrong');
        } else {
            showMessage('Email not found. Please register first or check your email.', 'error');
            console.log('Email not found in registered users');
        }
        
        // Shake animation for error
        loginCard.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginCard.style.animation = '';
        }, 500);
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showMessage('Email already exists!', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('.login-btn');
    showLoading(submitBtn);
    
    // Simulate API call delay
    await delay(2000);
    
    // Success - store user data
    const userData = {
        id: Date.now().toString(),
        email: email,
        fullName: fullName,
        password: password, // This was missing!
        registrationDate: new Date().toISOString(),
        isActive: true
    };
    
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Debug: Confirm user was saved with password
    console.log('User registered successfully:', userData);
    console.log('Total users now:', users.length);
    
    hideLoading(submitBtn);
    showMessage('Account created successfully! Please sign in.', 'success');
    
    // Switch to login after delay
    setTimeout(() => {
        showLogin();
        // Pre-fill email
        document.getElementById('email').value = email;
    }, 2000);
}

// Handle forgot password
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    
    // Show loading
    const submitBtn = form.querySelector('.login-btn');
    showLoading(submitBtn);
    
    // Simulate API call delay
    await delay(2000);
    
    // Check if user exists
    const user = users.find(u => u.email === email);
    
    if (user) {
        hideLoading(submitBtn);
        showMessage('Password reset link sent to your email!', 'success');
        
        // Switch to login after delay
        setTimeout(() => {
            showLogin();
        }, 3000);
    } else {
        hideLoading(submitBtn);
        showMessage('Email not found in our records.', 'error');
    }
}

// Show/Hide different cards
function showLogin() {
    hideAllCards();
    loginCard.classList.remove('hide');
    loginCard.classList.add('card-transition');
}

function showRegister() {
    hideAllCards();
    registerCard.classList.remove('hide');
    registerCard.classList.add('active', 'card-transition');
}

function showForgotPassword() {
    hideAllCards();
    forgotCard.classList.remove('hide');
    forgotCard.classList.add('active', 'card-transition');
}

function hideAllCards() {
    loginCard.classList.add('hide');
    registerCard.classList.remove('active');
    registerCard.classList.add('hide');
    forgotCard.classList.remove('active');
    forgotCard.classList.add('hide');
}

// Password toggle functions
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
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

function toggleRegPassword() {
    const passwordInput = document.getElementById('regPassword');
    const toggleIcon = document.getElementById('regPasswordToggleIcon');
    
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

// Social login functions
function socialLogin(provider) {
    showMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
    
    // Simulate social login
    setTimeout(() => {
        // For demo purposes, create a demo user
        const demoUser = {
            id: Date.now(),
            fullName: `Demo User (${provider})`,
            email: `demo@${provider}.com`,
            provider: provider,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        currentUser = demoUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showMessage(`Successfully signed in with ${provider}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1000);
}

// Utility functions
function showLoading(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function hideLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    message.innerHTML = `
        <i class="${icon}"></i>
        <span>${text}</span>
    `;
    
    messageContainer.appendChild(message);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        message.style.animation = 'messageSlideOut 0.3s ease forwards';
        setTimeout(() => {
            if (message.parentNode) {
                messageContainer.removeChild(message);
            }
        }, 300);
    }, 5000);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function validateInput(input) {
    const value = input.value;
    const type = input.type;
    
    // Remove previous validation classes
    input.classList.remove('valid', 'invalid');
    
    if (!value) return;
    
    let isValid = true;
    
    switch (type) {
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'password':
            isValid = value.length >= 6;
            break;
        default:
            isValid = value.length > 0;
    }
    
    input.classList.add(isValid ? 'valid' : 'invalid');
}

function checkAuthStatus() {
    // Check if user is already logged in
    if (currentUser) {
        showMessage('You are already logged in!', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
        document.getElementById('email').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
}

// Particle animation
function startParticleAnimation() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 15 + 's';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.8 + 0.2;
    });
}

// Add shake animation CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes messageSlideOut {
        0% {
            opacity: 1;
            transform: translateX(0);
        }
        100% {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .input-wrapper.focused .input-icon {
        color: #667eea !important;
        transform: scale(1.1);
    }
    
    input.valid {
        border-bottom: 2px solid #10b981 !important;
    }
    
    input.invalid {
        border-bottom: 2px solid #ef4444 !important;
    }
    
    input.valid ~ .input-line {
        background: #10b981 !important;
    }
    
    input.invalid ~ .input-line {
        background: #ef4444 !important;
    }
`;
document.head.appendChild(shakeStyle);

// Add some demo users for testing
if (users.length === 0) {
    const demoUsers = [
        {
            id: 1,
            fullName: 'John Doe',
            email: 'john@example.com',
            password: '123456',
            createdAt: new Date().toISOString(),
            isActive: true
        },
        {
            id: 2,
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password',
            createdAt: new Date().toISOString(),
            isActive: true
        }
    ];
    
    users.push(...demoUsers);
    localStorage.setItem('users', JSON.stringify(users));
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit active form
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const activeCard = document.querySelector('.login-card:not(.hide), .register-card.active, .forgot-card.active');
        if (activeCard) {
            const form = activeCard.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    }
    
    // Escape key to go back to login
    if (e.key === 'Escape') {
        showLogin();
    }
});

// Add cool hover effects to buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize tooltips for better UX
function addTooltips() {
    const tooltipElements = [
        { selector: '.password-toggle', text: 'Show/Hide Password' },
        { selector: '.back-home', text: 'Return to Store' },
        { selector: '.social-btn', text: 'Sign in with social account' }
    ];
    
    tooltipElements.forEach(({ selector, text }) => {
        document.querySelectorAll(selector).forEach(el => {
            el.setAttribute('title', text);
        });
    });
}

// Call tooltip initialization
addTooltips();

// Debug function to reset login system (for testing)
function resetLoginSystem() {
    localStorage.removeItem('users');
    localStorage.removeItem('registeredUsers');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginHistory');
    users = [];
    currentUser = null;
    console.log('Login system reset! You can now register new accounts.');
    showMessage('Login system reset! You can register new accounts.', 'success');
}

// Make reset function available globally for debugging
window.resetLoginSystem = resetLoginSystem;

// Debug function to show all registered users
function showRegisteredUsers() {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    console.log('All registered users:', allUsers);
    console.log('Total users:', allUsers.length);
    return allUsers;
}

// Make debug function available globally
window.showRegisteredUsers = showRegisteredUsers;
