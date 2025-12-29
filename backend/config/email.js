// Email configuration using Nodemailer
const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * Configure with Gmail SMTP or any other email service
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Use app-specific password for Gmail
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send email
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise<object>} Send result
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `E-Commerce Store <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`📧 Email sent: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error(`❌ Email send error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send order confirmation email
 * @param {object} orderData - Order details
 */
const sendOrderConfirmation = async (orderData) => {
  const { email, name, orderId, products, totalAmount } = orderData;

  const productsHtml = products.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .order-details { background: #fff; padding: 20px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for your order! We're excited to confirm that we've received it.</p>
          
          <div class="order-details">
            <h2>Order #${orderId}</h2>
            <table>
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Quantity</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
            </table>
            <div class="total">
              Total: $${totalAmount.toFixed(2)}
            </div>
          </div>

          <p>We'll send you another email when your order ships.</p>
          <p>If you have any questions, feel free to contact us.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Order Confirmation - #${orderId}`,
    html: html
  });
};

/**
 * Send password reset email
 * @param {object} data - Reset data
 */
const sendPasswordResetEmail = async (data) => {
  const { email, name, resetToken } = data;
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>You recently requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: html
  });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendPasswordResetEmail
};