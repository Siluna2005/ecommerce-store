document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    if (!isAuthenticated()) {
        window.location.href = '/pages/login.html';
        return;
    }
    loadWishlist();
});

async function loadWishlist() {
    try {
        const response = await apiCall('/wishlist');
        
        if (response.success) {
            displayWishlist(response.wishlist.products);
        }
    } catch (error) {
        showToast('Error loading wishlist', 'error');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayWishlist(products) {
    if (products.length === 0) {
        document.getElementById('emptyWishlist').style.display = 'block';
        return;
    }

    const container = document.getElementById('wishlistGrid');
    container.innerHTML = products.map(item => {
        const product = item.product;
        return `
            <div class="product-card wishlist-product-card">
                <button class="remove-wishlist-btn" onclick="removeFromWishlist('${product._id}')">
                    <i class="fas fa-times"></i>
                </button>
                ${createProductCard(product)}
            </div>
        `;
    }).join('');
    
    document.getElementById('wishlistContent').style.display = 'block';
}

async function removeFromWishlist(productId) {
    try {
        const response = await apiCall(`/wishlist/${productId}`, { method: 'DELETE' });
        
        if (response.success) {
            showToast('Removed from wishlist', 'success');
            loadWishlist();
        }
    } catch (error) {
        showToast('Error removing from wishlist', 'error');
    }
}
