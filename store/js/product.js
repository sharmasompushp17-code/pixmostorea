// Product Page JavaScript

// Get product ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

// Get products from localStorage or use default products
let products = JSON.parse(localStorage.getItem('adminProducts')) || JSON.parse(localStorage.getItem('products')) || [];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Current product
let currentProduct = null;

// Initialize the product page
document.addEventListener('DOMContentLoaded', function() {
    if (productId) {
        loadProduct(productId);
    } else {
        showError('Product not found', 'No product ID specified in the URL.');
    }
    
    updateCartUI();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Redirect to main page with search
            if (this.value.trim()) {
                window.location.href = `index.html?search=${encodeURIComponent(this.value.trim())}`;
            }
        });
    }
}

// Load product details
function loadProduct(id) {
    currentProduct = products.find(p => p.id === id);
    
    if (!currentProduct) {
        showError('Product Not Found', 'The requested product could not be found.');
        return;
    }
    
    // Update page title and breadcrumb
    document.title = `${currentProduct.name} - TechStore`;
    document.getElementById('productBreadcrumb').textContent = currentProduct.name;
    
    // Render product details
    renderProductDetails();
    
    // Load related products
    loadRelatedProducts();
}

// Render product details
function renderProductDetails() {
    const productDetails = document.getElementById('productDetails');
    
    const discount = currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price 
        ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
        : 0;
    
    const stockStatus = getStockStatus(currentProduct.stock || 0);
    
    productDetails.innerHTML = `
        <div class="product-image-section">
            <div class="product-main-image">
                ${currentProduct.image ? 
                    `<img src="${currentProduct.image}" alt="${currentProduct.name}">` : 
                    `<div class="placeholder-image"><i class="${currentProduct.icon}"></i></div>`
                }
            </div>
        </div>

        <div class="product-info-section">
            <div class="product-category">${currentProduct.category}</div>
            <h1 class="product-title">${currentProduct.name}</h1>
            
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(currentProduct.rating)}
                </div>
                <span class="rating-text">${currentProduct.rating} (${currentProduct.reviews} reviews)</span>
            </div>

            <div class="product-price">
                <span class="current-price">$${currentProduct.price}</span>
                ${currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price ? 
                    `<span class="original-price">$${currentProduct.originalPrice}</span>
                     <span class="discount">${discount}% OFF</span>` : 
                    ''
                }
            </div>

            ${currentProduct.stock !== undefined ? `
                <div class="stock-status ${stockStatus.class}">
                    <i class="${stockStatus.icon}"></i>
                    <span>${stockStatus.text}</span>
                </div>
            ` : ''}

            <div class="product-description">
                <p>${currentProduct.description}</p>
            </div>

            <div class="quantity-selector">
                <label for="quantity">Quantity:</label>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(-1)">-</button>
                    <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="${currentProduct.stock || 99}">
                    <button class="quantity-btn" onclick="updateQuantity(1)">+</button>
                </div>
            </div>

            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${currentProduct.id})" ${!currentProduct.stock || currentProduct.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                ${currentProduct.buyLink ? 
                    `<a href="${currentProduct.buyLink}" target="_blank" class="btn btn-success">
                        <i class="fas fa-shopping-bag"></i> Buy Now
                    </a>` : 
                    ''
                }
            </div>

            <div class="product-features">
                <div class="feature">
                    <i class="fas fa-shipping-fast"></i>
                    <span>Free Shipping</span>
                </div>
                <div class="feature">
                    <i class="fas fa-shield-alt"></i>
                    <span>1 Year Warranty</span>
                </div>
                <div class="feature">
                    <i class="fas fa-undo"></i>
                    <span>30 Day Returns</span>
                </div>
                <div class="feature">
                    <i class="fas fa-headset"></i>
                    <span>24/7 Support</span>
                </div>
            </div>

            <div class="product-specs">
                <h3>Product Information</h3>
                <table class="specs-table">
                    <tr>
                        <td>Category</td>
                        <td>${currentProduct.category}</td>
                    </tr>
                    <tr>
                        <td>Rating</td>
                        <td>${currentProduct.rating}/5 (${currentProduct.reviews} reviews)</td>
                    </tr>
                    ${currentProduct.badge ? `
                        <tr>
                            <td>Badge</td>
                            <td><span class="product-badge">${currentProduct.badge}</span></td>
                        </tr>
                    ` : ''}
                    ${currentProduct.stock !== undefined ? `
                        <tr>
                            <td>Availability</td>
                            <td>${stockStatus.text}</td>
                        </tr>
                    ` : ''}
                </table>
            </div>
        </div>
    `;
    
    // Add loaded class for animation
    setTimeout(() => {
        productDetails.classList.add('loaded');
    }, 100);
}

// Get stock status
function getStockStatus(stock) {
    if (stock === 0) {
        return {
            class: 'out-of-stock',
            icon: 'fas fa-times-circle',
            text: 'Out of Stock'
        };
    } else if (stock <= 5) {
        return {
            class: 'low-stock',
            icon: 'fas fa-exclamation-triangle',
            text: `Only ${stock} left in stock`
        };
    } else {
        return {
            class: 'in-stock',
            icon: 'fas fa-check-circle',
            text: 'In Stock'
        };
    }
}

// Load related products
function loadRelatedProducts() {
    const relatedProductsGrid = document.getElementById('relatedProductsGrid');
    
    // Get products from the same category, excluding current product
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        // Get random products if no related products found
        const randomProducts = products
            .filter(p => p.id !== currentProduct.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        relatedProducts.push(...randomProducts);
    }
    
    relatedProductsGrid.innerHTML = relatedProducts.map(product => `
        <div class="related-product-card" onclick="goToProduct(${product.id})">
            <div class="related-product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}">` : 
                    `<i class="${product.icon}"></i>`
                }
            </div>
            <div class="related-product-info">
                <h3 class="related-product-title">${product.name}</h3>
                <div class="related-product-price">$${product.price}</div>
                <button class="related-product-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Go to product page
function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// Update quantity
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    const currentQuantity = parseInt(quantityInput.value);
    const newQuantity = currentQuantity + change;
    const maxStock = currentProduct.stock || 99;
    
    if (newQuantity >= 1 && newQuantity <= maxStock) {
        quantityInput.value = newQuantity;
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = productId === currentProduct.id ? 
        parseInt(document.getElementById('quantity').value) : 1;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            image: product.image,
            quantity: quantity
        });
    }
    
    updateCartUI();
    saveCart();
    showCartNotification(product.name, quantity);
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
    
    // Render cart items
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
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
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` : 
                    `<i class="${item.icon}"></i>`
                }
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Update cart quantity
function updateCartQuantity(productId, change) {
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

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
        document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : 'auto';
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`Thank you for your order!\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nYour order will be processed shortly.`);
    
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
function showCartNotification(productName, quantity = 1) {
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
            <span>${quantity > 1 ? `${quantity}x ` : ''}${productName} added to cart!</span>
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
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

// Show error
function showError(title, message) {
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>${title}</h2>
            <p>${message}</p>
            <a href="index.html" class="btn">
                <i class="fas fa-home"></i> Back to Home
            </a>
        </div>
    `;
}

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
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
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    }
});

// Handle quantity input changes
document.addEventListener('input', function(e) {
    if (e.target.id === 'quantity') {
        const value = parseInt(e.target.value);
        const maxStock = currentProduct.stock || 99;
        
        if (value < 1) {
            e.target.value = 1;
        } else if (value > maxStock) {
            e.target.value = maxStock;
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close cart with Escape key
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
    
    // Focus search with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});
