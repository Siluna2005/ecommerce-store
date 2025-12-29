// Utility functions used across the application

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// Add to cart
function addToCart(product, quantity = 1, size = null, color = null) {
  const cart = getCart();
  
  const existingItem = cart.find(item => 
    item._id === product._id && 
    item.size === size && 
    item.color === color
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      size,
      color,
      stock: product.stock
    });
  }
  
  saveCart(cart);
  showToast('Product added to cart!');
}

// Get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Get user from localStorage
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getToken();
}

// Check if user is admin
function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/pages/login.html';
}

// API call with authentication
async function apiCall(endpoint, options = {}) {
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    logout();
    return;
  }
  
  return response.json();
}

// Create product card HTML
function createProductCard(product) {
  const saleLabel = product.onSale ? `
    <div class="sale-badge">${product.salePercentage}% OFF</div>
  ` : '';
  
  const outOfStock = product.stock === 0 ? `
    <div class="out-of-stock-badge">Out of Stock</div>
  ` : '';
  
  return `
    <div class="product-card">
      ${saleLabel}
      ${outOfStock}
      <div class="product-image">
        <img src="${product.imageUrl}" alt="${product.name}">
        <div class="product-actions">
          <button class="btn-icon" onclick="addToWishlist('${product._id}')">
            <i class="far fa-heart"></i>
          </button>
          <button class="btn-icon" onclick="viewProduct('${product._id}')">
            <i class="far fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          ${createStarRating(product.averageRating)}
          <span>(${product.numReviews})</span>
        </div>
        <div class="product-price">
          ${product.onSale ? `
            <span class="original-price">${formatCurrency(product.originalPrice || product.price)}</span>
            <span class="sale-price">${formatCurrency(product.price)}</span>
          ` : `
            <span class="price">${formatCurrency(product.price)}</span>
          `}
        </div>
        ${product.stock > 0 ? `
          <button class="btn btn-primary btn-block" onclick="quickAddToCart('${product._id}')">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        ` : `
          <button class="btn btn-secondary btn-block" disabled>
            Out of Stock
          </button>
        `}
      </div>
    </div>
  `;
}

// Create star rating HTML
function createStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return `<div class="stars">${stars}</div>`;
}

// View product details
function viewProduct(productId) {
  window.location.href = `/pages/product-details.html?id=${productId}`;
}

// Quick add to cart
async function quickAddToCart(productId) {
  try {
    const response = await apiCall(`/products/${productId}`);
    if (response.success) {
      addToCart(response.product);
    }
  } catch (error) {
    showToast('Error adding to cart', 'error');
  }
}

// Add to wishlist
async function addToWishlist(productId) {
  if (!isAuthenticated()) {
    showToast('Please login to add to wishlist', 'error');
    setTimeout(() => {
      window.location.href = '/pages/login.html';
    }, 1500);
    return;
  }
  
  try {
    const response = await apiCall('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
    
    if (response.success) {
      showToast('Added to wishlist!');
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error adding to wishlist', 'error');
  }
}

// Initialize cart badge on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCartBadge);
} else {
  updateCartBadge();
}