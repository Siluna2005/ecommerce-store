// Products page JavaScript
// Handles product listing, filtering, sorting, and pagination

let currentPage = 1;
let currentFilters = {
  category: 'all',
  minPrice: 0,
  maxPrice: 500,
  onSale: false,
  sort: 'featured',
  search: ''
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeNavbar();
  setupFilters();
  loadProducts();
  
  // Check for search query in URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    currentFilters.search = searchQuery;
    document.getElementById('searchInput').value = searchQuery;
  }
});

// Setup filter controls
function setupFilters() {
  // Category filter
  const categoryRadios = document.querySelectorAll('input[name="category"]');
  categoryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilters.category = e.target.value;
    });
  });
  
  // Price range filters
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const minPriceValue = document.getElementById('minPriceValue');
  const maxPriceValue = document.getElementById('maxPriceValue');
  
  minPrice?.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    currentFilters.minPrice = value;
    minPriceValue.textContent = value;
  });
  
  maxPrice?.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    currentFilters.maxPrice = value;
    maxPriceValue.textContent = value;
  });
  
  // On sale filter
  const onSaleFilter = document.getElementById('onSaleFilter');
  onSaleFilter?.addEventListener('change', (e) => {
    currentFilters.onSale = e.target.checked;
  });
  
  // Sort options
  const sortBy = document.getElementById('sortBy');
  sortBy?.addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    currentPage = 1;
    loadProducts();
  });
  
  // Apply filters button
  const applyBtn = document.getElementById('applyFilters');
  applyBtn?.addEventListener('click', () => {
    currentPage = 1;
    loadProducts();
  });
  
  // Clear filters button
  const clearBtn = document.getElementById('clearFilters');
  clearBtn?.addEventListener('click', () => {
    currentFilters = {
      category: 'all',
      minPrice: 0,
      maxPrice: 500,
      onSale: false,
      sort: 'featured',
      search: ''
    };
    
    document.querySelector('input[name="category"][value="all"]').checked = true;
    minPrice.value = 0;
    maxPrice.value = 500;
    minPriceValue.textContent = 0;
    maxPriceValue.textContent = 500;
    onSaleFilter.checked = false;
    sortBy.value = 'featured';
    
    currentPage = 1;
    loadProducts();
  });
}

// Load products with filters
async function loadProducts() {
  const container = document.getElementById('productsGrid');
  container.innerHTML = '<div class="loading">Loading products...</div>';
  
  try {
    // Build query string
    const params = new URLSearchParams({
      page: currentPage,
      limit: 12,
      sort: currentFilters.sort
    });
    
    if (currentFilters.category !== 'all') {
      params.append('category', currentFilters.category);
    }
    
    if (currentFilters.minPrice > 0) {
      params.append('minPrice', currentFilters.minPrice);
    }
    
    if (currentFilters.maxPrice < 500) {
      params.append('maxPrice', currentFilters.maxPrice);
    }
    
    if (currentFilters.onSale) {
      params.append('onSale', 'true');
    }
    
    if (currentFilters.search) {
      params.append('search', currentFilters.search);
    }
    
    const response = await fetch(`${API_URL}/products?${params}`);
    const data = await response.json();
    
    if (data.success) {
      displayProducts(data.products);
      displayPagination(data.pagination);
      updateResultsCount(data.pagination.total);
    } else {
      container.innerHTML = '<p class="text-center">No products found</p>';
    }
  } catch (error) {
    console.error('Error loading products:', error);
    container.innerHTML = '<p class="text-center">Error loading products. Please try again.</p>';
  }
}

// Display products in grid
function displayProducts(products) {
  const container = document.getElementById('productsGrid');
  
  if (products.length === 0) {
    container.innerHTML = '<p class="text-center">No products match your filters</p>';
    return;
  }
  
  container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Display pagination controls
function displayPagination(pagination) {
  const container = document.getElementById('pagination');
  
  if (pagination.pages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '<div class="pagination-controls">';
  
  // Previous button
  if (pagination.page > 1) {
    html += `<button class="btn btn-outline" onclick="changePage(${pagination.page - 1})">
      <i class="fas fa-chevron-left"></i> Previous
    </button>`;
  }
  
  // Page numbers
  html += '<div class="page-numbers">';
  for (let i = 1; i <= pagination.pages; i++) {
    if (i === 1 || i === pagination.pages || (i >= pagination.page - 2 && i <= pagination.page + 2)) {
      html += `<button class="page-btn ${i === pagination.page ? 'active' : ''}" 
                onclick="changePage(${i})">${i}</button>`;
    } else if (i === pagination.page - 3 || i === pagination.page + 3) {
      html += '<span class="page-dots">...</span>';
    }
  }
  html += '</div>';
  
  // Next button
  if (pagination.page < pagination.pages) {
    html += `<button class="btn btn-outline" onclick="changePage(${pagination.page + 1})">
      Next <i class="fas fa-chevron-right"></i>
    </button>`;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

// Change page
function changePage(page) {
  currentPage = page;
  loadProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update results count
function updateResultsCount(total) {
  const countElement = document.getElementById('resultsCount');
  if (countElement) {
    countElement.textContent = `${total} Product${total !== 1 ? 's' : ''}`;
  }
}

// Make changePage available globally
window.changePage = changePage;