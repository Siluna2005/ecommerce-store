// Home page JavaScript
// Handles hero section, featured products, and navigation

// Load featured products on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize navbar
  initializeNavbar();
  
  // Load featured products
  await loadFeaturedProducts();
  
  // Setup search functionality
  setupSearch();
  
  // Update cart and wishlist badges
  updateCartBadge();
  updateWishlistBadge();
});

// Initialize navigation bar
function initializeNavbar() {
  const navbar = document.getElementById('navbar');
  const navHTML = `
    <div class="container nav-container">
      <a href="/" class="logo">
        <i class="fas fa-shopping-bag"></i>
        <span>Fashion Store</span>
      </a>
      
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search products...">
        <button id="searchBtn"><i class="fas fa-search"></i></button>
      </div>

      <div class="nav-links" id="navLinks">
        <a href="/" class="nav-link active">Home</a>
        <a href="/pages/products.html" class="nav-link">Products</a>
        <a href="/pages/wishlist.html" class="nav-link">
          <i class="far fa-heart"></i> Wishlist
          <span class="badge" id="wishlistBadge">0</span>
        </a>
        <a href="/pages/cart.html" class="nav-link">
          <i class="fas fa-shopping-cart"></i> Cart
          <span class="badge" id="cartBadge">0</span>
        </a>
        
        <div class="user-menu" id="userMenu" style="display: none;">
          <button class="user-btn" id="userBtn">
            <i class="far fa-user-circle"></i>
            <span id="userName">Account</span>
          </button>
          <div class="dropdown" id="userDropdown">
            <a href="/pages/profile.html"><i class="far fa-user"></i> Profile</a>
            <a href="/pages/orders.html"><i class="far fa-box"></i> Orders</a>
            <a href="/pages/admin/dashboard.html" id="adminLink" style="display: none;"><i class="fas fa-cog"></i> Admin Panel</a>
            <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>
        </div>
        
        <div class="auth-links" id="authLinks">
          <a href="/pages/login.html" class="nav-link">Login</a>
          <a href="/pages/register.html" class="btn btn-primary">Register</a>
        </div>
      </div>

      <button class="mobile-menu-btn" id="mobileMenuBtn">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  `;
  
  navbar.innerHTML = navHTML;
  
  // Setup mobile menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  mobileMenuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Setup user dropdown
  const userBtn = document.getElementById('userBtn');
  const userDropdown = document.getElementById('userDropdown');
  
  userBtn?.addEventListener('click', () => {
    userDropdown.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
      userDropdown?.classList.remove('show');
    }
  });
  
  // Handle logout
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
  
  // Check authentication status
  checkAuth();
}

// Check authentication and update navbar
function checkAuth() {
  const user = getUser();
  const userMenu = document.getElementById('userMenu');
  const authLinks = document.getElementById('authLinks');
  const userName = document.getElementById('userName');
  const adminLink = document.getElementById('adminLink');
  
  if (user) {
    userMenu.style.display = 'block';
    authLinks.style.display = 'none';
    userName.textContent = user.name.split(' ')[0]; // First name only
    
    if (user.role === 'admin') {
      adminLink.style.display = 'block';
    }
  } else {
    userMenu.style.display = 'none';
    authLinks.style.display = 'flex';
  }
}

// Load featured products
async function loadFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  
  try {
    const response = await fetch(`${API_URL}/products/featured`);
    const data = await response.json();
    
    if (data.success && data.products.length > 0) {
      container.innerHTML = data.products.map(product => createProductCard(product)).join('');
    } else {
      container.innerHTML = '<p class="text-center">No featured products available</p>';
    }
  } catch (error) {
    console.error('Error loading products:', error);
    container.innerHTML = '<p class="text-center">Error loading products. Please try again later.</p>';
  }
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  const performSearch = () => {
    const query = searchInput?.value.trim();
    if (query) {
      window.location.href = `/pages/products.html?search=${encodeURIComponent(query)}`;
    }
  };
  
  searchBtn?.addEventListener('click', performSearch);
  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}

// Update wishlist badge
async function updateWishlistBadge() {
  if (!isAuthenticated()) return;
  
  try {
    const response = await apiCall('/wishlist');
    if (response.success) {
      const badge = document.getElementById('wishlistBadge');
      if (badge) {
        const count = response.wishlist.products.length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      }
    }
  } catch (error) {
    console.error('Error updating wishlist badge:', error);
  }
}