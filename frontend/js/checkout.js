document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    checkAuth();
    loadCart();
    setupCheckoutForm();
});

function loadCart() {
    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = '/pages/cart.html';
        return;
    }

    const container = document.getElementById('orderItems');
    container.innerHTML = cart.map(item => `
        <div class="order-item">
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-details">Qty: ${item.quantity} × ${formatCurrency(item.price)}</div>
            </div>
            <div class="item-price">${formatCurrency(item.price * item.quantity)}</div>
        </div>
    `).join('');

    updateOrderSummary();
}

function updateOrderSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = 10;
    const total = subtotal + tax + shipping;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('shipping').textContent = formatCurrency(shipping);
    document.getElementById('total').textContent = formatCurrency(total);
}

function setupCheckoutForm() {
    const user = getUser();
    if (user) {
        document.getElementById('fullName').value = user.name || '';
        document.getElementById('email').value = user.email || '';
    }

    document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        if (paymentMethod === 'payhere') {
            await processPayHerePayment();
        } else if (paymentMethod === 'cash') {
            await processCashOnDelivery();
        }
    });
}

async function processPayHerePayment() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = (subtotal * 1.08 + 10).toFixed(2);
    
    // Create order first
    const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    
    try {
        // Get payment data from backend
        const response = await apiCall('/payment/create', {
            method: 'POST',
            body: JSON.stringify({
                orderId: orderId,
                amount: total,
                items: cart.map(item => item.name).join(', '),
                customer: {
                    firstName: document.getElementById('fullName').value.split(' ')[0],
                    lastName: document.getElementById('fullName').value.split(' ').slice(1).join(' ') || '',
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('addressLine1').value,
                    city: document.getElementById('city').value
                }
            })
        });

        if (response.success) {
            // Save order to database
            await createOrder(orderId, 'payhere', 'pending');
            
            // Redirect to PayHere
            const payment = response.paymentData;
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = payment.merchant_id.includes('test') 
                ? 'https://sandbox.payhere.lk/pay/checkout'
                : 'https://www.payhere.lk/pay/checkout';

            // Add all payment fields
            Object.keys(payment).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = payment[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } else {
            showToast('Payment initialization failed', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showToast('Payment processing error', 'error');
    }
}

async function processCashOnDelivery() {
    const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    await createOrder(orderId, 'cash', 'pending');
    
    // Redirect to success page
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08 + 10;
    
    localStorage.setItem('lastOrder', JSON.stringify({
        orderNumber: orderId,
        totalAmount: total,
        items: cart
    }));
    
    window.location.href = '/pages/order-success.html';
}

async function createOrder(orderId, paymentMethod, paymentStatus) {
    const cart = getCart();
    const orderData = {
        orderItems: cart.map(item => ({
            product: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.imageUrl,
            size: item.size,
            color: item.color
        })),
        shippingAddress: {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            addressLine1: document.getElementById('addressLine1').value,
            addressLine2: document.getElementById('addressLine2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            country: document.getElementById('country').value
        },
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        itemsPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        taxPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08,
        shippingPrice: 10,
        totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08 + 10
    };

    const response = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });

    return response.success;
}