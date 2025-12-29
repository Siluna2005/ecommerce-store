document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    if (!isAuthenticated()) {
        window.location.href = '/pages/login.html';
        return;
    }
    loadOrders();
});

async function loadOrders() {
    try {
        const response = await apiCall('/orders/user');
        
        if (response.success) {
            displayOrders(response.orders);
        }
    } catch (error) {
        showToast('Error loading orders', 'error');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContent');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-box-open"></i>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here!</p>
                <a href="/pages/products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        container.style.display = 'block';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-number">Order #${order.orderNumber}</div>
                    <div class="order-date">${new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <span class="order-status status-${order.orderStatus}">${order.orderStatus}</span>
            </div>
            <div class="order-items">
                ${order.orderItems.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-details">Qty: ${item.quantity} × ${formatCurrency(item.price)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: ${formatCurrency(order.totalPrice)}</div>
                <button class="btn btn-outline" onclick="viewOrder('${order._id}')">View Details</button>
            </div>
        </div>
    `).join('');
    
    container.style.display = 'block';
}