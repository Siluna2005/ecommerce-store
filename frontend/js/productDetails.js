// Product Details Page Logic
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    loadProduct();
    setupRatingInput();
});

// Get product ID from URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load product details
async function loadProduct() {
    const productId = getProductId();
    if (!productId) {
        window.location.href = '/pages/products.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const data = await response.json();

        if (data.success) {
            currentProduct = data.product;
            displayProduct(currentProduct);
            loadReviews(productId);
            loadRelatedProducts(productId);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('productContent').style.display = 'block';
        } else {
            showToast('Product not found', 'error');
            setTimeout(() => window.location.href = '/pages/products.html', 2000);
        }
    } catch (error) {
        showToast('Error loading product', 'error');
    }
}

// Display product details
function displayProduct(product) {
    document.title = `${product.name} - Fashion Store`;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productBrand').textContent = product.brand || 'N/A';
    document.getElementById('productMaterial').textContent = product.material || 'N/A';

    // Main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = product.imageUrl;
    mainImage.alt = product.name;

    // Thumbnails
    if (product.images && product.images.length > 0) {
        const thumbnails = document.getElementById('thumbnails');
        thumbnails.innerHTML = product.images.map((img, index) => `
            <img src="${img.url}" alt="${product.name}" 
                 class="${index === 0 ? 'active' : ''}"
                 onclick="changeMainImage('${img.url}', this)">
        `).join('');
    }

    // Price
    const priceEl = document.getElementById('productPrice');
    if (product.onSale) {
        priceEl.innerHTML = `
            <span class="original-price">${formatCurrency(product.originalPrice || product.price)}</span>
            <span class="sale-price">${formatCurrency(product.price)}</span>
            <span class="sale-badge">${product.salePercentage}% OFF</span>
        `;
    } else {
        priceEl.innerHTML = `<span>${formatCurrency(product.price)}</span>`;
    }

    // Rating
    document.getElementById('productRating').innerHTML = createStarRating(product.averageRating);
    document.getElementById('reviewCount').textContent = `(${product.numReviews} reviews)`;

    // Sizes
    if (product.sizes && product.sizes.length > 0) {
        document.getElementById('sizeGroup').style.display = 'block';
        const sizeSelector = document.getElementById('sizeSelector');
        sizeSelector.innerHTML = product.sizes.map(s => `
            <button class="size-option ${s.stock === 0 ? 'disabled' : ''}" 
                    data-size="${s.size}"
                    ${s.stock === 0 ? 'disabled' : ''}
                    onclick="selectSize('${s.size}', ${s.stock})">
                ${s.size}
            </button>
        `).join('');
    }

    // Colors
    if (product.colors && product.colors.length > 0) {
        document.getElementById('colorGroup').style.display = 'block';
        const colorSelector = document.getElementById('colorSelector');
        colorSelector.innerHTML = product.colors.map(c => `
            <div class="color-option" 
                 style="background: ${getColorCode(c)}"
                 title="${c}"
                 onclick="selectColor('${c}', this)"></div>
        `).join('');
    }

    // Stock info
    const stockInfo = document.getElementById('stockInfo');
    if (product.stock > 0) {
        stockInfo.textContent = `In Stock (${product.stock} available)`;
        stockInfo.classList.remove('out-of-stock');
    } else {
        stockInfo.textContent = 'Out of Stock';
        stockInfo.classList.add('out-of-stock');
        document.getElementById('addToCartBtn').disabled = true;
        document.getElementById('addToCartBtn').textContent = 'Out of Stock';
    }

    // Show write review if logged in
    if (isAuthenticated()) {
        document.getElementById('writeReview').style.display = 'block';
    }
}

// Change main image
function changeMainImage(url, thumb) {
    document.getElementById('mainImage').src = url;
    document.querySelectorAll('.thumbnail-images img').forEach(img => img.classList.remove('active'));
    thumb.classList.add('active');
}

// Select size
function selectSize(size, stock) {
    if (stock === 0) return;
    selectedSize = size;
    document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('sizeError').textContent = '';
}

// Select color
function selectColor(color, element) {
    selectedColor = color;
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

// Get color code
function getColorCode(colorName) {
    const colors = {
        'White': '#FFFFFF',
        'Black': '#000000',
        'Gray': '#808080',
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Navy': '#000080',
        'Green': '#008000',
        'Yellow': '#FFFF00',
        'Pink': '#FFC0CB',
        'Purple': '#800080',
        'Brown': '#A52A2A',
        'Beige': '#F5F5DC'
    };
    return colors[colorName] || '#CCCCCC';
}

// Change quantity
function changeQuantity(change) {
    const input = document.getElementById('quantity');
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    if (value > currentProduct.stock) value = currentProduct.stock;
    if (value > 10) value = 10;
    input.value = value;
}

// Add to cart handler
function addToCartHandler() {
    // Check if size is required and selected
    if (currentProduct.sizes && currentProduct.sizes.length > 0 && !selectedSize) {
        document.getElementById('sizeError').textContent = 'Please select a size';
        showToast('Please select a size', 'error');
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value);
    addToCart(currentProduct, quantity, selectedSize, selectedColor);
    showToast('Added to cart!', 'success');
}

// Add to wishlist handler
async function addToWishlistHandler() {
    await addToWishlist(currentProduct._id);
}

// Setup rating input
function setupRatingInput() {
    const stars = document.querySelectorAll('.star-rating-input i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            document.getElementById('rating').value = selectedRating;
            updateStarDisplay();
        });

        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });

    document.querySelector('.star-rating-input').addEventListener('mouseleave', () => {
        highlightStars(selectedRating);
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function updateStarDisplay() {
    highlightStars(selectedRating);
}

// Submit review
document.getElementById('reviewForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (selectedRating === 0) {
        document.getElementById('ratingError').textContent = 'Please select a rating';
        return;
    }

    const reviewData = {
        product: currentProduct._id,
        rating: selectedRating,
        title: document.getElementById('reviewTitle').value,
        comment: document.getElementById('reviewComment').value
    };

    try {
        const response = await apiCall('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });

        if (response.success) {
            showToast('Review submitted successfully!', 'success');
            document.getElementById('reviewForm').reset();
            selectedRating = 0;
            updateStarDisplay();
            loadReviews(currentProduct._id);
        } else {
            showToast(response.message, 'error');
        }
    } catch (error) {
        showToast('Error submitting review', 'error');
    }
});

// Load reviews
async function loadReviews(productId) {
    try {
        const response = await fetch(`${API_URL}/reviews/product/${productId}`);
        const data = await response.json();

        if (data.success) {
            displayReviews(data.reviews);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Display reviews
function displayReviews(reviews) {
    const container = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <div class="review-author">${review.userName}</div>
                    <div class="stars">${createStarRating(review.rating)}</div>
                </div>
                <div class="review-date">${new Date(review.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="review-title">${review.title}</div>
            <div class="review-comment">${review.comment}</div>
            ${review.verifiedPurchase ? '<span class="verified-badge">Verified Purchase</span>' : ''}
        </div>
    `).join('');
}

// Load related products
async function loadRelatedProducts(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}/related`);
        const data = await response.json();

        if (data.success) {
            const container = document.getElementById('relatedProducts');
            container.innerHTML = data.products.map(product => createProductCard(product)).join('');
        }
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}