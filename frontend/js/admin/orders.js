document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    if (!isAdmin()) {
        window.location.href = '/';
        return;
    }
    loadOrders();
});

async function loadOrders() {
    const response = await apiCall('/orders');
    if (response.success) {
        displayOrders(response.orders);
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTable');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.orderNumber}</td>
            <td>${order.user?.name || 'N/A'}</td>
            <td>${order.orderItems.length}</td>
            <td>${formatCurrency(order.totalPrice)}</td>
            <td><span class="status-badge status-${order.paymentStatus}">${order.paymentStatus}</span></td>
            <td><span class="status-badge status-${order.orderStatus}">${order.orderStatus}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td><button class="btn-table btn-view" onclick="viewOrderDetails('${order._id}')">View</button></td>
        </tr>
    `).join('');
}