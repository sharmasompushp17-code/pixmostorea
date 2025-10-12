// Poster slider data
let posters = JSON.parse(localStorage.getItem('posters')) || [
    {
        id: 1,
        title: "PIXMOS Electronics Store",
        description: "Discover the latest technology and gadgets with unbeatable prices",
        image: "",
        buttonText: "Shop Now",
        buttonLink: "#products",
        isActive: true
    }
];

// Current slide index
let currentSlide = 0;
let slideInterval;

// Function to load products from admin panel
function loadProductsFromAdmin() {
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts'));
    const frontendProducts = JSON.parse(localStorage.getItem('products'));
    
    // Prefer admin products if available, then frontend products, then defaults
    return adminProducts || frontendProducts || defaultProducts;
}

// Default products (fallback)
const defaultProducts = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        category: "smartphones",
        price: 79999,
        originalPrice: 89999,
        description: "Latest iPhone with A17 Pro chip and titanium design",
        rating: 4.8,
        reviews: 1250,
        badge: "New",
        icon: "fas fa-mobile-alt"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "smartphones",
        price: 71999,
        originalPrice: 79999,
        description: "Flagship Android phone with AI photography features",
        rating: 4.7,
        reviews: 980,
        badge: "Sale",
        icon: "fas fa-mobile-alt"
    },
    {
        id: 3,
        name: "MacBook Pro 16\"",
        category: "laptops",
        price: 199999,
        originalPrice: 219999,
        description: "Powerful laptop with M3 Max chip for professionals",
        rating: 4.9,
        reviews: 750,
        badge: "Popular",
        icon: "fas fa-laptop"
    },
    {
        id: 4,
        name: "Dell XPS 13",
        category: "laptops",
        price: 103999,
        originalPrice: 119999,
        description: "Ultra-portable laptop with stunning InfinityEdge display",
        rating: 4.6,
        reviews: 650,
        badge: "Sale",
        icon: "fas fa-laptop"
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        category: "headphones",
        price: 31999,
        originalPrice: 35999,
        description: "Industry-leading noise canceling wireless headphones",
        rating: 4.8,
        reviews: 2100,
        badge: "Best Seller",
        icon: "fas fa-headphones"
    },
    {
        id: 6,
        name: "AirPods Pro 2",
        category: "headphones",
        price: 19999,
        originalPrice: 22999,
        description: "Active noise cancellation with spatial audio",
        rating: 4.7,
        reviews: 1800,
        badge: "New",
        icon: "fas fa-headphones"
    },
    {
        id: 7,
        name: "iPad Pro 12.9\"",
        category: "accessories",
        price: 87999,
        originalPrice: 95999,
        description: "Most advanced iPad with M2 chip and Liquid Retina display",
        rating: 4.8,
        reviews: 920,
        badge: "Popular",
        icon: "fas fa-tablet-alt"
    },
    {
        id: 8,
        name: "Apple Watch Series 9",
        category: "accessories",
        price: 31999,
        originalPrice: 34299,
        description: "Advanced health monitoring and fitness tracking",
        rating: 4.6,
        reviews: 1100,
        badge: "New",
        icon: "fas fa-clock"
    },
    {
        id: 9,
        name: "Gaming Mechanical Keyboard",
        category: "accessories",
        price: 11999,
        originalPrice: 14299,
        description: "RGB backlit mechanical keyboard for gaming",
        rating: 4.5,
        reviews: 450,
        badge: "Sale",
        icon: "fas fa-keyboard"
    },
    {
        id: 10,
        name: "Wireless Mouse",
        category: "accessories",
        price: 6299,
        originalPrice: 7999,
        description: "Ergonomic wireless mouse with precision tracking",
        rating: 4.4,
        reviews: 320,
        badge: null,
        icon: "fas fa-mouse"
    },
    {
        id: 11,
        name: "Google Pixel 8 Pro",
        category: "smartphones",
        price: 71999,
        originalPrice: 79999,
        description: "AI-powered photography with Google's latest features",
        rating: 4.6,
        reviews: 680,
        badge: "Sale",
        icon: "fas fa-mobile-alt"
    },
    {
        id: 12,
        name: "Surface Laptop 5",
        category: "laptops",
        price: 135999,
        originalPrice: 151999,
        description: "Premium Windows laptop with touchscreen display",
        rating: 4.5,
        reviews: 420,
        badge: "Popular",
        icon: "fas fa-laptop"
    }
];

// Load products (refresh from admin panel)
let products = loadProductsFromAdmin();

// Function to refresh products from admin panel
function refreshProducts() {
    const oldCount = products.length;
    products = loadProductsFromAdmin();
    console.log(`🔄 Products refreshed: ${oldCount} → ${products.length} products`);
    console.log('📦 Products with images:', products.filter(p => p.image).length);
    displayProducts();
}

// Shopping cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');

// Change modal image
function changeModalImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('modalMainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update thumbnail borders
    const thumbnails = thumbnail.parentElement.querySelectorAll('img');
    thumbnails.forEach(thumb => {
        thumb.style.border = '2px solid transparent';
    });
    thumbnail.style.border = '2px solid #3b82f6';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializePosterSlider();
    refreshProducts(); // Use refresh instead of renderProducts
    updateCartUI();
    setupEventListeners();
    updateUserUI();
});

// Auto-refresh products when page gets focus (coming back from admin panel)
window.addEventListener('focus', function() {
    refreshProducts();
});

// Auto-refresh products when localStorage changes (admin panel updates)
window.addEventListener('storage', function(e) {
    if (e.key === 'adminProducts' || e.key === 'products') {
        refreshProducts();
    }
});

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            
            // Update filter buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            const targetBtn = document.querySelector(`[data-filter="${category}"]`);
            if (targetBtn) targetBtn.classList.add('active');
            
            // Scroll to products section
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Display products
function displayProducts(productsToRender = products) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    card.innerHTML = `
        <div class="product-image" onclick="goToProduct(${product.id})">
            ${(product.images && product.images.length > 0) ? 
                `<img src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                (product.image ? 
                    `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                    `<i class="${product.icon}"></i>`
                )
            }
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            ${(product.images && product.images.length > 1) ? 
                `<div class="image-count"><i class="fas fa-images"></i> ${product.images.length}</div>` : ''
            }
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title" onclick="goToProduct(${product.id})" style="cursor: pointer;">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">₹${product.price.toLocaleString('en-IN')}</span>
                ${product.originalPrice > product.price ? `<span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
            </div>
            <div class="product-actions" style="margin-top: 1rem;">
                <button class="add-to-cart" onclick="addToCart(${product.id})" style="width: 100%; margin-bottom: 0.5rem;">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                ${product.buyLink ? `
                <button onclick="window.open('${product.buyLink}', '_blank')" style="width: 100%; background: #10b981; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 0.5rem; transition: all 0.3s ease;" onmouseover="this.style.background='#059669';" onmouseout="this.style.background='#10b981';">
                    <i class="fas fa-shopping-bag"></i> Buy Now
                </button>
                ` : ''}
            </div>
            <button class="view-details" onclick="goToProduct(${product.id})" style="width: 100%; background: transparent; border: 2px solid #3b82f6; color: #3b82f6; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;" onmouseover="this.style.background='#3b82f6'; this.style.color='white';" onmouseout="this.style.background='transparent'; this.style.color='#3b82f6';">
                View Details
            </button>
        </div>
    `;
    
    return card;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Filter products
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    renderProducts(filteredProducts);
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCart();
    showCartNotification(product.name);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        saveCart();
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString('en-IN');
    
    // Render cart items
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="price">₹${item.price}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : 'auto';
}

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`Thank you for your order!\n\nItems: ${itemCount}\nTotal: ₹${total.toLocaleString('en-IN')}\n\nYour order will be processed shortly.`);
    
    // Clear cart
    cart = [];
    updateCartUI();
    saveCart();
    toggleCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show cart notification
function showCartNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Add loading animation for products
function showLoadingAnimation() {
    productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #3b82f6;"></i>
            <p style="margin-top: 1rem; color: #64748b;">Loading products...</p>
        </div>
    `;
}

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .feature, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close cart with Escape key
    if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
    
    // Focus search with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// Add product quick view functionality
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2>${product.name}</h2>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div style="text-align: center; margin-bottom: 1rem;">
                <div style="width: 300px; height: 300px; background: linear-gradient(45deg, #f1f5f9, #e2e8f0); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto; overflow: hidden; position: relative;">
                    ${(product.images && product.images.length > 0) ? 
                        `<img id="modalMainImage" src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` : 
                        (product.image ? 
                            `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` : 
                            `<i class="${product.icon}" style="font-size: 4rem; color: #64748b;"></i>`
                        )
                    }
                </div>
                ${(product.images && product.images.length > 1) ? `
                <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
                    ${product.images.map((img, index) => `
                        <img src="${img}" alt="${product.name} ${index + 1}" 
                             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid ${index === 0 ? '#3b82f6' : 'transparent'}; transition: all 0.3s;" 
                             onclick="changeModalImage('${img}', this)">
                    `).join('')}
                </div>
                ` : ''}
            </div>
            <p style="color: #64748b; margin-bottom: 1rem;">${product.description}</p>
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">₹${product.price.toLocaleString('en-IN')}</span>
                ${product.originalPrice > product.price ? `<span style="text-decoration: line-through; color: #64748b;">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                <div style="color: #fbbf24;">${generateStars(product.rating)}</div>
                <span style="color: #64748b;">${product.rating} (${product.reviews} reviews)</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="addToCart(${product.id}); this.closest('.modal').remove();" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                ${product.buyLink ? `
                <button onclick="window.open('${product.buyLink}', '_blank'); this.closest('.modal').remove();" style="flex: 1; background: #10b981; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-shopping-bag"></i> Buy Now
                </button>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Go to product page
function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// User authentication functions
function updateUserUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userAccount = document.getElementById('userAccount');
    const loginLink = document.getElementById('loginLink');
    
    if (currentUser) {
        // User is logged in - show user dropdown
        loginLink.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span>${currentUser.fullName || currentUser.email.split('@')[0]}</span>
            <i class="fas fa-chevron-down" style="font-size: 0.8rem; margin-left: 0.25rem;"></i>
        `;
        loginLink.href = '#';
        loginLink.onclick = toggleUserDropdown;
        
        // Create dropdown if it doesn't exist
        if (!document.querySelector('.user-dropdown')) {
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.innerHTML = `
                <div class="user-info">
                    <div class="user-name">${currentUser.fullName || 'User'}</div>
                    <div class="user-email">${currentUser.email}</div>
                </div>
                <a href="#" onclick="viewProfile()">
                    <i class="fas fa-user"></i>
                    <span>My Profile</span>
                </a>
                <a href="#" onclick="viewOrders()">
                    <i class="fas fa-shopping-bag"></i>
                    <span>My Orders</span>
                </a>
                <a href="#" onclick="viewWishlist()">
                    <i class="fas fa-heart"></i>
                    <span>Wishlist</span>
                </a>
                <a href="#" onclick="userLogout()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            `;
            userAccount.appendChild(dropdown);
        }
    } else {
        // User is not logged in - show login link
        loginLink.innerHTML = `
            <i class="fas fa-user"></i>
            <span>Login</span>
        `;
        loginLink.href = 'login.html';
        loginLink.onclick = null;
        
        // Remove dropdown if exists
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }
}

// Toggle user dropdown
function toggleUserDropdown(e) {
    e.preventDefault();
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// User logout
function userLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        updateUserUI();
        showNotification('You have been logged out successfully.', 'success');
        
        // Close dropdown
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
}

// Placeholder functions for user features
function viewProfile() {
    showNotification('Profile page coming soon!', 'info');
    toggleUserDropdown({ preventDefault: () => {} });
}

function viewOrders() {
    showNotification('Orders page coming soon!', 'info');
    toggleUserDropdown({ preventDefault: () => {} });
}

function viewWishlist() {
    showNotification('Wishlist feature coming soon!', 'info');
    toggleUserDropdown({ preventDefault: () => {} });
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        max-width: 300px;
    `;
    
    // Set colors based on type
    if (type === 'success') {
        notification.style.background = '#10b981';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.background = '#f59e0b';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#3b82f6';
        notification.style.color = 'white';
    }
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 type === 'warning' ? 'fas fa-exclamation-triangle' :
                 'fas fa-info-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const userAccount = document.getElementById('userAccount');
    const dropdown = document.querySelector('.user-dropdown');
    
    if (dropdown && !userAccount.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Poster Slider Functions
function initializePosterSlider() {
    renderPosterSlider();
    startAutoSlide();
}

function renderPosterSlider() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const sliderDots = document.getElementById('sliderDots');
    
    if (!sliderWrapper || !sliderDots) return;
    
    // Render slides
    sliderWrapper.innerHTML = posters.map(poster => `
        <div class="poster-slide ${!poster.image ? 'default' : ''}" ${poster.image ? `style="background-image: url('${poster.image}')"` : ''}>
            ${poster.image ? '<div class="poster-overlay"></div>' : ''}
            <div class="poster-content">
                <h2>${poster.title}</h2>
                <p>${poster.description}</p>
                <a href="${poster.buttonLink}" class="poster-btn" onclick="scrollToProducts()">${poster.buttonText}</a>
            </div>
        </div>
    `).join('');
    
    // Render dots
    sliderDots.innerHTML = posters.map((_, index) => `
        <div class="dot ${index === currentSlide ? 'active' : ''}" onclick="goToSlide(${index})"></div>
    `).join('');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % posters.length;
    updateSlider();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + posters.length) % posters.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function updateSlider() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const dots = document.querySelectorAll('.dot');
    
    if (sliderWrapper) {
        sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Pause auto-slide on hover
document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
});

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}
