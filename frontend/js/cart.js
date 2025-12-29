document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    displayCart();
});

// Display cart items
function displayCart() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a href="/pages/products.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        
        // Hide summary if cart is empty
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }
    
    // Display cart items
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                <p class="price">${formatCurrency(item.price)}</p>
            </div>
            <div class="item-quantity">
                <button onclick="updateQuantity(${index}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="item-total">
                <p>${formatCurrency(item.price * item.quantity)}</p>
                <button class="btn-remove" onclick="removeItem(${index})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    updateSummary();
}

// Update item quantity
function updateQuantity(index, change) {
    const cart = getCart();
    
    if (!cart[index]) {
        console.error('Item not found in cart');
        return;
    }
    
    cart[index].quantity += change;
    
    // Remove item if quantity becomes 0 or negative
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
        showToast('Item removed from cart');
    }
    
    // Check stock limit
    if (cart[index] && cart[index].quantity > cart[index].stock) {
        cart[index].quantity = cart[index].stock;
        showToast(`Only ${cart[index].stock} items available in stock`, 'warning');
    }
    
    // Check maximum quantity limit (10)
    if (cart[index] && cart[index].quantity > 10) {
        cart[index].quantity = 10;
        showToast('Maximum 10 items per product', 'warning');
    }
    
    saveCart(cart);
    displayCart();
}

// Remove item from cart
function removeItem(index) {
    const cart = getCart();
    
    if (!cart[index]) {
        console.error('Item not found in cart');
        return;
    }
    
    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    showToast(`${itemName} removed from cart`);
}

// Update cart summary
function updateSummary() {
    const cart = getCart();
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 0 ? 10 : 0; // $10 flat shipping
    const total = subtotal + tax + shipping;
    
    // Update display
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('shipping').textContent = formatCurrency(shipping);
    document.getElementById('total').textContent = formatCurrency(total);
}

// Proceed to checkout
function goToCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    if (!isAuthenticated()) {
        showToast('Please login to proceed to checkout', 'error');
        setTimeout(() => {
            window.location.href = '/pages/login.html?redirect=checkout';
        }, 1500);
        return;
    }
    
    window.location.href = '/pages/checkout.html';
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        updateCartBadge();
        displayCart();
        showToast('Cart cleared');
    }
}

// Make functions available globally
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.goToCheckout = goToCheckout;
window.clearCart = clearCart;