// API Base URL
const API_URL = 'http://localhost:5000/api';

// PayHere Configuration (will be fetched from backend)
let PAYHERE_MERCHANT_ID = '';
let PAYHERE_MODE = 'sandbox'; // sandbox or live

// Fetch PayHere config on load
async function loadPayHereConfig() {
  try {
    const response = await fetch(`${API_URL}/payment/payhere-config`);
    const data = await response.json();
    if (data.success) {
      PAYHERE_MERCHANT_ID = data.merchantId;
      PAYHERE_MODE = data.mode;
    }
  } catch (error) {
    console.error('Error loading PayHere config:', error);
  }
}

// Load config when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPayHereConfig);
} else {
  loadPayHereConfig();
}
