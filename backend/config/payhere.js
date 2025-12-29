const crypto = require('crypto');

/**
 * Generate PayHere hash for security
 */
const generateHash = (merchantId, orderId, amount, currency, merchantSecret) => {
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();
  
  const amountFormatted = parseFloat(amount).toFixed(2);
  const hash = crypto
    .createHash('md5')
    .update(`${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`)
    .digest('hex')
    .toUpperCase();
  
  return hash;
};

/**
 * Verify PayHere notification hash
 */
const verifyHash = (merchantId, orderId, paymentAmount, statusCode, md5sig) => {
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();
  
  const amountFormatted = parseFloat(paymentAmount).toFixed(2);
  const localHash = crypto
    .createHash('md5')
    .update(`${merchantId}${orderId}${amountFormatted}${statusCode}${hashedSecret}`)
    .digest('hex')
    .toUpperCase();
  
  return localHash === md5sig;
};

module.exports = {
  generateHash,
  verifyHash
};
