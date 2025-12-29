// Email sending utility - wrapper for email config
const { sendEmail, sendOrderConfirmation, sendPasswordResetEmail } = require('../config/email');

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail
};