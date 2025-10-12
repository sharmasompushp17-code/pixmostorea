// Admin Panel JavaScript

// Get products from localStorage or use default products
let adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [
    {
        id: 1,
        name: "iPhone 15 Pro",
        category: "smartphones",
        price: 82999,
        originalPrice: 91299,
        description: "Latest iPhone with A17 Pro chip and titanium design",
        rating: 4.8,
        reviews: 1250,
        badge: "New",
        icon: "fas fa-mobile-alt",
        stock: 50,
        image: "",
        buyLink: "https://apple.com/iphone-15-pro"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "smartphones",
        price: 74699,
        originalPrice: 82999,
        description: "Flagship Android phone with AI photography features",
        rating: 4.7,
        reviews: 980,
        badge: "Sale",
        icon: "fas fa-mobile-alt",
        stock: 35,
        image: "",
        buyLink: "https://samsung.com/galaxy-s24"
    },
    {
        id: 3,
        name: "MacBook Pro 16\"",
        category: "laptops",
        price: 207499,
        originalPrice: 224199,
        description: "Powerful laptop with M3 Max chip for professionals",
        rating: 4.9,
        reviews: 750,
        badge: "Popular",
        icon: "fas fa-laptop",
        stock: 20,
        image: "",
        buyLink: "https://apple.com/macbook-pro"
    },
    {
        id: 4,
        name: "Dell XPS 13",
        category: "laptops",
        price: 107899,
        originalPrice: 124599,
        description: "Ultra-portable laptop with stunning InfinityEdge display",
        rating: 4.6,
        reviews: 650,
        badge: "Sale",
        icon: "fas fa-laptop",
        stock: 25,
        image: "",
        buyLink: "https://dell.com/xps-13"
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        category: "headphones",
        price: 33199,
        originalPrice: 37299,
        description: "Industry-leading noise canceling wireless headphones",
        rating: 4.8,
        reviews: 2100,
        badge: "Best Seller",
        icon: "fas fa-headphones",
        stock: 40,
        image: "",
        buyLink: "https://sony.com/wh-1000xm5"
    },
    {
        id: 6,
        name: "AirPods Pro 2",
        category: "headphones",
        price: 20699,
        originalPrice: 23199,
        description: "Active noise cancellation with spatial audio",
        rating: 4.7,
        reviews: 1800,
        badge: "New",
        icon: "fas fa-headphones",
        stock: 60,
        image: "",
        buyLink: "https://apple.com/airpods-pro"
    }
];

// Categories data
const categories = [
    { id: 'smartphones', name: 'Smartphones', icon: 'fas fa-mobile-alt', description: 'Latest mobile devices' },
    { id: 'laptops', name: 'Laptops', icon: 'fas fa-laptop', description: 'High-performance computers' },
    { id: 'headphones', name: 'Audio', icon: 'fas fa-headphones', description: 'Premium sound experience' },
    { id: 'accessories', name: 'Accessories', icon: 'fas fa-plug', description: 'Essential tech accessories' }
];

// Current editing product ID
let editingProductId = null;
let deletingProductId = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Force close all modals on page load
    closeAllModals();
    
    loadProducts();
    loadCategories();
    loadUsers();
    loadProfile();
    setupEventListeners();
    
    // Show products section by default
    showSection('products');
});

// Force close all modals
function closeAllModals() {
    // Close all modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
        modal.style.display = 'none';
    });
    
    // Reset editing states
    editingProductId = null;
    deletingProductId = null;
    
    // Remove any overlay elements
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => overlay.remove());
}

// Setup event listeners
function setupEventListeners() {
    // Product form submission
    document.getElementById('productForm').addEventListener('submit', handleAddProduct);
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);
    
    // Store settings form
    document.getElementById('storeSettingsForm').addEventListener('submit', handleStoreSettings);
    
    // Profile form
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });
    
    // Password form
    document.getElementById('passwordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        changePassword();
    });
    
    // Modal close events
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Add close buttons to all modals
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to corresponding nav item
    const navLink = document.querySelector(`[href="#${sectionId}"]`);
    if (navLink) {
        navLink.closest('.nav-item').classList.add('active');
    }
}

// Load products into table
function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    
    if (adminProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No products found</h3>
                    <p>Add your first product to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminProducts.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <div class="product-image-cell">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}">` : 
                        `<i class="${product.icon}"></i>`
                    }
                </div>
            </td>
            <td>
                <strong>${product.name}</strong>
                <br>
                <small style="color: #64748b;">${product.description.substring(0, 50)}...</small>
            </td>
            <td>
                <span class="category-badge">${product.category}</span>
            </td>
            <td>
                <strong>₹${product.price}</strong>
                ${product.originalPrice && product.originalPrice > product.price ? 
                    `<br><small style="text-decoration: line-through; color: #64748b;">₹${product.originalPrice}</small>` : 
                    ''
                }
            </td>
            <td>
                <span class="${product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-danger'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <span class="status-badge ${product.stock > 0 ? 'status-active' : 'status-inactive'}">
                    ${product.stock > 0 ? 'Active' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewProduct(${product.id})" title="View Product">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Edit Product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})" title="Delete Product">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load categories
function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    
    grid.innerHTML = categories.map(category => {
        const productCount = adminProducts.filter(p => p.category === category.id).length;
        return `
            <div class="category-card">
                <i class="${category.icon}"></i>
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <p><strong>${productCount} products</strong></p>
                <div class="category-actions">
                    <button class="btn btn-primary btn-sm" onclick="filterByCategory('${category.id}')">
                        View Products
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Handle add product
function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData.entries());
    
    const images = getImageUrls('imageUrlInputs');
    
    const newProduct = {
        id: Date.now(),
        name: productData.name,
        category: productData.category,
        price: parseFloat(productData.price),
        originalPrice: parseFloat(productData.originalPrice) || parseFloat(productData.price),
        description: productData.description,
        rating: parseFloat(productData.rating) || 4.5,
        reviews: parseInt(productData.reviews) || 0,
        badge: productData.badge || '',
        icon: productData.icon,
        stock: parseInt(productData.stock),
        images: images,
        image: images[0] || '', // Keep first image as main image for backward compatibility
        buyLink: productData.buyLink || ''
    };
    
    adminProducts.push(newProduct);
    saveProducts();
    loadProducts();
    loadCategories();
    
    // Reset form and show success message
    e.target.reset();
    showNotification('Product added successfully!', 'success');
    
    // Switch to products view
    showSection('products');
}

// Handle edit product
function handleEditProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData.entries());
    
    const productIndex = adminProducts.findIndex(p => p.id === editingProductId);
    if (productIndex === -1) return;
    
    const images = getImageUrls('editImageUrlInputs');
    
    adminProducts[productIndex] = {
        ...adminProducts[productIndex],
        name: productData.name,
        category: productData.category,
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        description: productData.description,
        rating: parseFloat(productData.rating),
        reviews: parseInt(productData.reviews),
        badge: productData.badge || null,
        icon: productData.icon,
        stock: parseInt(productData.stock),
        images: images,
        image: images[0] || '', // Keep first image as main image for backward compatibility
        buyLink: productData.buyLink || ''
    };
    
    saveProducts();
    loadProducts();
    loadCategories();
    closeEditModal();
    
    showNotification('Product updated successfully!', 'success');
}

// Edit product
function editProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    
    // Fill form with product data
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductOriginalPrice').value = product.originalPrice || '';
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductRating').value = product.rating;
    document.getElementById('editProductReviews').value = product.reviews;
    document.getElementById('editProductBadge').value = product.badge || '';
    document.getElementById('editProductIcon').value = product.icon;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductBuyLink').value = product.buyLink || '';
    
    // Set multiple images
    const productImages = product.images || (product.image ? [product.image] : []);
    setImageUrls('editImageUrlInputs', productImages);
    
    // Show modal
    document.getElementById('editModal').classList.add('show');
}

// Delete product
function deleteProduct(id) {
    console.log('Delete product called with ID:', id);
    deletingProductId = id;
    const modal = document.getElementById('deleteModal');
    console.log('Delete modal element:', modal);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('Delete modal should be visible now');
    } else {
        console.error('Delete modal not found!');
    }
}

// Confirm delete
function confirmDelete() {
    console.log('Confirm delete called, deletingProductId:', deletingProductId);
    if (deletingProductId) {
        const productToDelete = adminProducts.find(p => p.id === deletingProductId);
        console.log('Product to delete:', productToDelete);
        
        adminProducts = adminProducts.filter(p => p.id !== deletingProductId);
        console.log('Products after deletion:', adminProducts.length);
        
        saveProducts();
        loadProducts();
        loadCategories();
        closeDeleteModal();
        showNotification('Product deleted successfully!', 'success');
        deletingProductId = null;
    } else {
        console.error('No product ID set for deletion');
        showNotification('Error: No product selected for deletion', 'error');
    }
}

// View product
function viewProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (!product) return;
    
    // Open product page in new tab
    const productUrl = `product.html?id=${id}`;
    window.open(productUrl, '_blank');
}

// Close modals
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    editingProductId = null;
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
    deletingProductId = null;
    console.log('Delete modal closed');
}

function closeModal(modal) {
    modal.classList.remove('show');
}

// Reset form
function resetForm() {
    document.getElementById('productForm').reset();
}

// Filter by category
function filterByCategory(categoryId) {
    showSection('products');
    // You could add filtering logic here
}

// Add category (placeholder)
function addCategory() {
    showNotification('Category management coming soon!', 'warning');
}

// Handle store settings
function handleStoreSettings(e) {
    e.preventDefault();
    showNotification('Settings saved successfully!', 'success');
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(adminProducts, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'products-export.json';
    link.click();
    
    showNotification('Products exported successfully!', 'success');
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedProducts = JSON.parse(e.target.result);
                if (Array.isArray(importedProducts)) {
                    adminProducts = importedProducts;
                    saveProducts();
                    loadProducts();
                    loadCategories();
                    showNotification('Products imported successfully!', 'success');
                } else {
                    showNotification('Invalid file format!', 'error');
                }
            } catch (error) {
                showNotification('Error reading file!', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to delete all products? This action cannot be undone.')) {
        adminProducts = [];
        saveProducts();
        loadProducts();
        loadCategories();
        showNotification('All products deleted!', 'success');
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
    
    // Also update the main products array for the frontend
    const frontendProducts = adminProducts.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        description: product.description,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge,
        icon: product.icon,
        image: product.image,
        buyLink: product.buyLink
    }));
    
    localStorage.setItem('products', JSON.stringify(frontendProducts));
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-exclamation-triangle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Generate product pages
function generateProductPages() {
    adminProducts.forEach(product => {
        generateProductPage(product);
    });
    showNotification('Product pages generated!', 'success');
}

// Generate individual product page
function generateProductPage(product) {
    // This would typically be done server-side
    // For now, we'll create the product page template
    const productPageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} - TechStore</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/product.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <h2><a href="index.html"><i class="fas fa-bolt"></i> TechStore</a></h2>
                </div>
                <ul class="nav-menu">
                    <li><a href="index.html#home">Home</a></li>
                    <li><a href="index.html#products">Products</a></li>
                    <li><a href="index.html#about">About</a></li>
                    <li><a href="index.html#contact">Contact</a></li>
                </ul>
                <div class="nav-icons">
                    <div class="cart-icon" onclick="toggleCart()">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-count" id="cartCount">0</span>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <!-- Product Details -->
    <main class="product-main">
        <div class="container">
            <div class="breadcrumb">
                <a href="index.html">Home</a>
                <span>/</span>
                <a href="index.html#products">Products</a>
                <span>/</span>
                <span>${product.name}</span>
            </div>

            <div class="product-details">
                <div class="product-image-section">
                    <div class="product-main-image">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}">` : 
                            `<div class="placeholder-image"><i class="${product.icon}"></i></div>`
                        }
                    </div>
                </div>

                <div class="product-info-section">
                    <div class="product-category">${product.category}</div>
                    <h1 class="product-title">${product.name}</h1>
                    
                    <div class="product-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                    </div>

                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice && product.originalPrice > product.price ? 
                            `<span class="original-price">$${product.originalPrice}</span>
                             <span class="discount">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>` : 
                            ''
                        }
                    </div>

                    <div class="product-description">
                        <p>${product.description}</p>
                    </div>

                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        ${product.buyLink ? 
                            `<a href="${product.buyLink}" target="_blank" class="btn btn-success buy-now">
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
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Product data for this page
        const currentProduct = ${JSON.stringify(product)};
        
        // Add to cart functionality
        function addToCart(productId) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    icon: currentProduct.icon,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(currentProduct.name + ' added to cart!');
        }
        
        // Update cart count
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cartCount').textContent = totalItems;
            document.getElementById('cartCount').style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        // Show notification
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = \`
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
            \`;
            notification.innerHTML = \`
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-check-circle"></i>
                    <span>\${message}</span>
                </div>
            \`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
        
        // Generate stars
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
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
        });
    </script>
</body>
</html>
    `;
    
    // In a real application, you would save this to a file
    // For now, we'll store it in localStorage for demonstration
    localStorage.setItem(`product-page-${product.id}`, productPageContent);
}

// User Management Functions
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    // Update user statistics
    updateUserStats(users, loginHistory);
    
    // Render users table
    renderUsersTable(users, loginHistory);
}

function updateUserStats(users, loginHistory) {
    const totalUsers = users.length;
    const totalLogins = loginHistory.length;
    
    // Calculate active users (logged in today)
    const today = new Date().toDateString();
    const activeUsers = loginHistory.filter(login => 
        new Date(login.timestamp).toDateString() === today
    ).length;
    
    // Update DOM elements
    const totalUsersEl = document.getElementById('totalUsers');
    const totalLoginsEl = document.getElementById('totalLogins');
    const activeUsersEl = document.getElementById('activeUsers');
    
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (totalLoginsEl) totalLoginsEl.textContent = totalLogins;
    if (activeUsersEl) activeUsersEl.textContent = activeUsers;
}

function renderUsersTable(users, loginHistory) {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;"><i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>No users registered yet</td></tr>';
        return;
    }
    
    const userRows = users.map(user => {
        const userLogins = loginHistory.filter(login => login.email === user.email);
        const lastLogin = userLogins.length > 0 ? 
            new Date(userLogins[userLogins.length - 1].timestamp).toLocaleString() : 
            'Never';
        
        const status = getUserStatus(user, userLogins);
        const initials = getUserInitials(user.fullName || user.email);
        
        return '<tr>' +
            '<td>' +
                '<div class="user-info">' +
                    '<div class="user-avatar">' + initials + '</div>' +
                    '<div class="user-details">' +
                        '<h4>' + (user.fullName || 'User') + '</h4>' +
                        '<p>ID: ' + user.id + '</p>' +
                    '</div>' +
                '</div>' +
            '</td>' +
            '<td>' + user.email + '</td>' +
            '<td>' + new Date(user.registrationDate).toLocaleDateString() + '</td>' +
            '<td>' + lastLogin + '</td>' +
            '<td>' + userLogins.length + '</td>' +
            '<td><span class="status-badge ' + status.class + '">' + status.text + '</span></td>' +
            '<td>' +
                '<div class="user-actions">' +
                    '<button class="action-btn view" onclick="viewUserDetails(\'' + user.email + '\')" title="View Details">' +
                        '<i class="fas fa-eye"></i>' +
                    '</button>' +
                    '<button class="action-btn delete" onclick="deleteUser(\'' + user.email + '\')" title="Delete User">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    });
    
    tableBody.innerHTML = userRows.join('');
}

function getUserInitials(name) {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
}

function getUserStatus(user, userLogins) {
    const now = new Date();
    const registrationDate = new Date(user.registrationDate);
    const daysSinceRegistration = (now - registrationDate) / (1000 * 60 * 60 * 24);
    
    if (userLogins.length === 0) {
        return { class: 'inactive', text: 'Never Logged In' };
    }
    
    const lastLogin = new Date(userLogins[userLogins.length - 1].timestamp);
    const daysSinceLastLogin = (now - lastLogin) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastLogin < 1) {
        return { class: 'active', text: 'Active' };
    } else if (daysSinceRegistration < 7) {
        return { class: 'new', text: 'New User' };
    } else if (daysSinceLastLogin < 30) {
        return { class: 'active', text: 'Active' };
    } else {
        return { class: 'inactive', text: 'Inactive' };
    }
}

function viewUserDetails(email) {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    const user = users.find(u => u.email === email);
    if (!user) return;
    
    const userLogins = loginHistory.filter(login => login.email === email);
    
    const modalContent = document.getElementById('userDetailsContent');
    if (!modalContent) return;
    
    let modalHTML = '<div class="user-detail-item">' +
        '<span class="user-detail-label">Full Name:</span>' +
        '<span class="user-detail-value">' + (user.fullName || 'Not provided') + '</span>' +
    '</div>' +
    '<div class="user-detail-item">' +
        '<span class="user-detail-label">Email:</span>' +
        '<span class="user-detail-value">' + user.email + '</span>' +
    '</div>' +
    '<div class="user-detail-item">' +
        '<span class="user-detail-label">Registration Date:</span>' +
        '<span class="user-detail-value">' + new Date(user.registrationDate).toLocaleString() + '</span>' +
    '</div>' +
    '<div class="user-detail-item">' +
        '<span class="user-detail-label">Total Logins:</span>' +
        '<span class="user-detail-value">' + userLogins.length + '</span>' +
    '</div>' +
    '<div class="user-detail-item">' +
        '<span class="user-detail-label">Last Login:</span>' +
        '<span class="user-detail-value">' + (userLogins.length > 0 ? 
            new Date(userLogins[userLogins.length - 1].timestamp).toLocaleString() : 
            'Never') + '</span>' +
    '</div>' +
    '<div class="login-history">' +
        '<h4>Recent Login History</h4>';
    
    if (userLogins.length > 0) {
        const recentLogins = userLogins.slice(-10).reverse();
        for (let i = 0; i < recentLogins.length; i++) {
            const login = recentLogins[i];
            modalHTML += '<div class="login-item">' +
                '<span>' +
                    '<i class="fas fa-sign-in-alt" style="color: #10b981; margin-right: 0.5rem;"></i>' +
                    'Login' +
                '</span>' +
                '<span>' + new Date(login.timestamp).toLocaleString() + '</span>' +
            '</div>';
        }
    } else {
        modalHTML += '<p style="color: #64748b; text-align: center; padding: 1rem;">No login history available</p>';
    }
    
    modalHTML += '</div>';
    
    modalContent.innerHTML = modalHTML;
    
    const modal = document.getElementById('userDetailsModal');
    if (modal) modal.style.display = 'flex';
}

function closeUserModal() {
    const modal = document.getElementById('userDetailsModal');
    if (modal) modal.style.display = 'none';
}

function deleteUser(email) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    // Remove from registered users
    let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    users = users.filter(user => user.email !== email);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Remove from login history
    let loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    loginHistory = loginHistory.filter(login => login.email !== email);
    localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    
    // Reload users
    loadUsers();
    
    showNotification('User deleted successfully', 'success');
}

function filterUsers() {
    const filter = document.getElementById('userFilter').value;
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    let filteredUsers = users;
    
    switch (filter) {
        case 'active':
            filteredUsers = users.filter(user => {
                const userLogins = loginHistory.filter(login => login.email === user.email);
                if (userLogins.length === 0) return false;
                const lastLogin = new Date(userLogins[userLogins.length - 1].timestamp);
                const daysSinceLastLogin = (new Date() - lastLogin) / (1000 * 60 * 60 * 24);
                return daysSinceLastLogin < 30;
            });
            break;
        case 'recent':
            filteredUsers = users.filter(user => {
                const userLogins = loginHistory.filter(login => login.email === user.email);
                if (userLogins.length === 0) return false;
                const lastLogin = new Date(userLogins[userLogins.length - 1].timestamp);
                const daysSinceLastLogin = (new Date() - lastLogin) / (1000 * 60 * 60 * 24);
                return daysSinceLastLogin < 7;
            });
            break;
        case 'inactive':
            filteredUsers = users.filter(user => {
                const userLogins = loginHistory.filter(login => login.email === user.email);
                if (userLogins.length === 0) return true;
                const lastLogin = new Date(userLogins[userLogins.length - 1].timestamp);
                const daysSinceLastLogin = (new Date() - lastLogin) / (1000 * 60 * 60 * 24);
                return daysSinceLastLogin >= 30;
            });
            break;
        default:
            filteredUsers = users;
    }
    
    renderUsersTable(filteredUsers, loginHistory);
}

function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm) ||
        (user.fullName && user.fullName.toLowerCase().includes(searchTerm))
    );
    
    renderUsersTable(filteredUsers, loginHistory);
}

// Emergency reset function (call from console if stuck)
window.resetAdminPanel = function() {
    console.log('🔧 Resetting admin panel...');
    
    // Force close all modals
    closeAllModals();
    
    // Reset all states
    editingProductId = null;
    deletingProductId = null;
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show products section
    showSection('products');
    
    // Reload data
    loadProducts();
    loadCategories();
    loadUsers();
    
    console.log('✅ Admin panel reset complete!');
    showNotification('Admin panel reset successfully!', 'success');
};

// Multiple Images Functions
function addImageInput() {
    const container = document.getElementById('imageUrlInputs');
    const groups = container.querySelectorAll('.image-url-group');
    
    if (groups.length >= 5) {
        showNotification('Maximum 5 images allowed', 'error');
        return;
    }
    
    const newGroup = document.createElement('div');
    newGroup.className = 'image-url-group';
    newGroup.innerHTML = `
        <input type="url" name="imageUrl" placeholder="https://example.com/image${groups.length + 1}.jpg" class="image-url-input">
        <button type="button" class="btn-remove-image" onclick="removeImageInput(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    container.appendChild(newGroup);
    
    // Show remove buttons if more than 1 image
    if (groups.length >= 1) {
        container.querySelectorAll('.btn-remove-image').forEach(btn => {
            btn.style.display = 'flex';
        });
    }
}

function addEditImageInput() {
    const container = document.getElementById('editImageUrlInputs');
    const groups = container.querySelectorAll('.image-url-group');
    
    if (groups.length >= 5) {
        showNotification('Maximum 5 images allowed', 'error');
        return;
    }
    
    const newGroup = document.createElement('div');
    newGroup.className = 'image-url-group';
    newGroup.innerHTML = `
        <input type="url" name="imageUrl" placeholder="https://example.com/image${groups.length + 1}.jpg" class="image-url-input">
        <button type="button" class="btn-remove-image" onclick="removeImageInput(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    container.appendChild(newGroup);
    
    // Show remove buttons if more than 1 image
    if (groups.length >= 1) {
        container.querySelectorAll('.btn-remove-image').forEach(btn => {
            btn.style.display = 'flex';
        });
    }
}

function removeImageInput(button) {
    const group = button.closest('.image-url-group');
    const container = group.parentElement;
    
    group.remove();
    
    // Hide remove buttons if only 1 image left
    const remainingGroups = container.querySelectorAll('.image-url-group');
    if (remainingGroups.length <= 1) {
        container.querySelectorAll('.btn-remove-image').forEach(btn => {
            btn.style.display = 'none';
        });
    }
}

function getImageUrls(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('.image-url-input');
    const urls = [];
    
    inputs.forEach(input => {
        if (input.value.trim()) {
            urls.push(input.value.trim());
        }
    });
    
    return urls;
}

function setImageUrls(containerId, urls) {
    const container = document.getElementById(containerId);
    
    // Clear existing inputs
    container.innerHTML = '';
    
    // Add inputs for each URL
    urls.forEach((url, index) => {
        const group = document.createElement('div');
        group.className = 'image-url-group';
        group.innerHTML = `
            <input type="url" name="imageUrl" value="${url}" placeholder="https://example.com/image${index + 1}.jpg" class="image-url-input">
            <button type="button" class="btn-remove-image" onclick="removeImageInput(this)" style="${urls.length > 1 ? 'display: flex;' : 'display: none;'}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(group);
    });
    
    // Add empty input if no URLs
    if (urls.length === 0) {
        const group = document.createElement('div');
        group.className = 'image-url-group';
        group.innerHTML = `
            <input type="url" name="imageUrl" placeholder="https://example.com/image1.jpg" class="image-url-input">
            <button type="button" class="btn-remove-image" onclick="removeImageInput(this)" style="display: none;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(group);
    }
}

// Profile Management Functions
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('adminProfile')) || {
        name: 'Admin User',
        email: 'admin@pixmos.com',
        phone: '',
        role: 'super_admin',
        bio: '',
        joinDate: new Date().toISOString()
    };
    
    // Update profile display
    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileAvatar').textContent = profile.name.charAt(0).toUpperCase();
    
    // Update stats
    document.getElementById('totalProductsManaged').textContent = adminProducts.length;
    document.getElementById('totalUsersManaged').textContent = JSON.parse(localStorage.getItem('registeredUsers') || '[]').length;
    document.getElementById('adminSince').textContent = new Date(profile.joinDate).getFullYear();
    
    // Update form fields
    document.getElementById('adminName').value = profile.name;
    document.getElementById('adminEmail').value = profile.email;
    document.getElementById('adminPhone').value = profile.phone || '';
    document.getElementById('adminRole').value = profile.role;
    document.getElementById('adminBio').value = profile.bio || '';
    
    // Update last login
    const lastLogin = localStorage.getItem('lastAdminLogin');
    if (lastLogin) {
        document.getElementById('lastLogin').textContent = new Date(lastLogin).toLocaleDateString();
    }
}

function saveProfile() {
    const profile = {
        name: document.getElementById('adminName').value,
        email: document.getElementById('adminEmail').value,
        phone: document.getElementById('adminPhone').value,
        role: document.getElementById('adminRole').value,
        bio: document.getElementById('adminBio').value,
        joinDate: JSON.parse(localStorage.getItem('adminProfile') || '{}').joinDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('adminProfile', JSON.stringify(profile));
    loadProfile();
    showNotification('Profile updated successfully!', 'success');
}

function resetProfileForm() {
    loadProfile();
    showNotification('Profile form reset', 'info');
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill all password fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // In a real app, you would verify the current password
    localStorage.setItem('adminPassword', newPassword);
    document.getElementById('passwordForm').reset();
    showNotification('Password changed successfully!', 'success');
}

// Test delete modal function (for debugging)
function testDeleteModal() {
    console.log('Testing delete modal...');
    const modal = document.getElementById('deleteModal');
    console.log('Modal element:', modal);
    if (modal) {
        modal.style.display = 'flex';
        console.log('Modal should be visible now');
    }
}

// Make functions globally available for debugging
window.testDeleteModal = testDeleteModal;
window.deleteProduct = deleteProduct;
window.confirmDelete = confirmDelete;
window.closeDeleteModal = closeDeleteModal;

// Initialize with existing products
saveProducts();
