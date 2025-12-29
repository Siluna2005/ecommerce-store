document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    if (!isAdmin()) {
        window.location.href = '/';
        return;
    }
    loadDashboardStats();
});

async function loadDashboardStats() {
    try {
        // Load orders
        const ordersRes = await apiCall('/orders');
        if (ordersRes.success) {
            const orders = ordersRes.orders;
            document.getElementById('totalOrders').textContent = orders.length;
            
            const revenue = orders
                .filter(o => o.paymentStatus === 'paid')
                .reduce((sum, o) => sum + o.totalPrice, 0);
            document.getElementById('totalRevenue').textContent = formatCurrency(revenue);
            
            displayRecentOrders(orders.slice(0, 5));
        }

        // Load products
        const productsRes = await apiCall('/products');
        if (productsRes.success) {
            document.getElementById('totalProducts').textContent = productsRes.products.length;
            displayLowStock(productsRes.products.filter(p => p.stock < 10));
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayRecentOrders(orders) {
    const tbody = document.getElementById('recentOrders');
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No orders yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.orderNumber}</td>
            <td>${order.user?.name || 'N/A'}</td>
            <td>${formatCurrency(order.totalPrice)}</td>
            <td><span class="status-badge status-${order.orderStatus}">${order.orderStatus}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td><button class="btn-table btn-view" onclick="viewOrder('${order._id}')">View</button></td>
        </tr>
    `).join('');
}

function displayLowStock(products) {
    const tbody = document.getElementById('lowStockProducts');
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">All products are well stocked</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td><span style="color: ${product.stock < 5 ? '#f44336' : '#ff9800'}">${product.stock}</span></td>
            <td><button class="btn-table btn-edit" onclick="editProduct('${product._id}')">Restock</button></td>
        </tr>
    `).join('');
}