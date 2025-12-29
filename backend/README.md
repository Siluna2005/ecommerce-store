# 🛍️ E-Commerce Clothing Store

A full-stack e-commerce platform built with Node.js, Express, MongoDB, and Vanilla JavaScript.

## 📋 Features

### Customer Features
- ✅ User registration and authentication (JWT)
- ✅ Google OAuth login integration
- ✅ Browse products with filtering and sorting
- ✅ Search functionality
- ✅ Product details with image zoom
- ✅ Add to cart and wishlist
- ✅ Shopping cart management
- ✅ Secure checkout with Stripe & PayPal
- ✅ Order tracking and history
- ✅ Product reviews and ratings
- ✅ User profile management
- ✅ Email notifications
- ✅ Password reset functionality

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Product management (CRUD operations)
- ✅ Image upload with Cloudinary
- ✅ Order management
- ✅ Order status updates
- ✅ View all orders and customers

### Technical Features
- ✅ RESTful API architecture
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ MongoDB database with Mongoose ODM
- ✅ File upload handling
- ✅ Email service with Nodemailer
- ✅ Payment processing (Stripe & PayPal)
- ✅ Responsive design (mobile-friendly)
- ✅ Error handling and validation
- ✅ Security best practices (Helmet, CORS, Rate Limiting)

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **PayPal** - Alternative payment
- **Nodemailer** - Email service

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Interactivity
- **Font Awesome** - Icons

## 📁 Project Structure

```
ecommerce-store/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── email.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Wishlist.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── paymentRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── wishlistController.js
│   │   └── paymentController.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js
│   │   └── seedData.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── css/
    │   ├── style.css
    │   ├── navbar.css
    │   ├── products.css
    │   ├── cart.css
    │   ├── admin.css
    │   └── responsive.css
    ├── js/
    │   ├── config.js
    │   ├── auth.js
    │   ├── utils.js
    │   ├── home.js
    │   ├── products.js
    │   ├── cart.js
    │   ├── checkout.js
    │   ├── orders.js
    │   ├── profile.js
    │   └── wishlist.js
    ├── pages/
    │   ├── products.html
    │   ├── product-details.html
    │   ├── cart.html
    │   ├── checkout.html
    │   ├── order-success.html
    │   ├── orders.html
    │   ├── profile.html
    │   ├── wishlist.html
    │   ├── login.html
    │   ├── register.html
    │   ├── forgot-password.html
    │   └── admin/
    │       ├── dashboard.html
    │       ├── products.html
    │       └── orders.html
    ├── index.html
    └── _redirects
```

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Stripe account
- Gmail account (for email)

### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd ecommerce-store
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

### Step 3: Environment Variables

Create `.env` file in `backend/` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=your_very_long_random_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_MODE=sandbox

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@store.com
ADMIN_PASSWORD=Admin123!
```

### Step 4: Seed Database
```bash
npm run seed
```

This creates:
- Admin account: `admin@store.com` / `Admin123!`
- Test user: `john@example.com` / `User123!`
- 10 sample products

### Step 5: Start Backend
```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### Step 6: Frontend Setup
```bash
cd ../frontend
```

Update `js/config.js` with your API keys

### Step 7: Start Frontend
```bash
# Using Python
python -m http.server 3000

# OR using Node
npx serve -p 3000
```

Frontend runs on: `http://localhost:3000`

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile (Protected)
PUT    /api/auth/profile           - Update profile (Protected)
PUT    /api/auth/change-password   - Change password (Protected)
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password/:token - Reset password
POST   /api/auth/address           - Add address (Protected)
PUT    /api/auth/address/:id       - Update address (Protected)
DELETE /api/auth/address/:id       - Delete address (Protected)
```

### Products
```
GET    /api/products               - Get all products
GET    /api/products/featured      - Get featured products
GET    /api/products/:id           - Get single product
GET    /api/products/:id/related   - Get related products
POST   /api/products               - Create product (Admin)
PUT    /api/products/:id           - Update product (Admin)
DELETE /api/products/:id           - Delete product (Admin)
```

### Orders
```
POST   /api/orders                 - Create order (Protected)
GET    /api/orders/user            - Get user orders (Protected)
GET    /api/orders/:id             - Get single order (Protected)
GET    /api/orders                 - Get all orders (Admin)
PUT    /api/orders/:id/status      - Update order status (Admin)
PUT    /api/orders/:id/payment     - Update payment status (Admin)
```

### Reviews
```
POST   /api/reviews                - Create review (Protected)
GET    /api/reviews/product/:id    - Get product reviews
PUT    /api/reviews/:id/helpful    - Mark helpful (Protected)
DELETE /api/reviews/:id            - Delete review (Protected/Admin)
```

### Wishlist
```
GET    /api/wishlist               - Get wishlist (Protected)
POST   /api/wishlist               - Add to wishlist (Protected)
DELETE /api/wishlist/:productId    - Remove from wishlist (Protected)
DELETE /api/wishlist               - Clear wishlist (Protected)
```

### Payment
```
GET    /api/payment/stripe-key     - Get Stripe key
GET    /api/payment/paypal-key     - Get PayPal key
POST   /api/payment/stripe         - Create payment intent (Protected)
```

## 🧪 Testing

### Test Accounts
```
Admin:
Email: admin@store.com
Password: Admin123!

User:
Email: john@example.com
Password: User123!
```

### Test Card (Stripe)
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

## 🌐 Deployment

### Backend Deployment (Railway)

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project from GitHub
4. Add all environment variables
5. Deploy!

### Frontend Deployment (Netlify)

1. Create `_redirects` file:
```
/*    /index.html   200
```

2. Update `js/config.js` with production API URL

3. Deploy to Netlify:
   - Connect GitHub repo
   - Build command: (none)
   - Publish directory: ./
   - Deploy!

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user/admin),
  addresses: Array,
  googleId: String,
  isActive: Boolean,
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  onSale: Boolean,
  salePercentage: Number,
  images: Array,
  imageUrl: String,
  category: String,
  subCategory: String,
  sizes: Array,
  stock: Number,
  colors: Array,
  material: String,
  brand: String,
  tags: Array,
  averageRating: Number,
  numReviews: Number,
  isFeatured: Boolean,
  isActive: Boolean
}
```

### Order
```javascript
{
  user: ObjectId,
  orderItems: Array,
  shippingAddress: Object,
  paymentMethod: String,
  paymentResult: Object,
  paymentStatus: String,
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  orderStatus: String,
  isDelivered: Boolean,
  deliveredAt: Date,
  trackingNumber: String,
  orderNumber: String
}
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected routes (middleware)
- Admin authorization
- Input validation
- Rate limiting
- Helmet security headers
- CORS configuration
- XSS protection
- SQL injection prevention (NoSQL)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check connection string
- Whitelist IP in MongoDB Atlas
- Verify credentials

### CORS Error
- Check `FRONTEND_URL` in backend `.env`
- Ensure servers are running

### Email Not Sending
- Use Gmail app password
- Enable 2-factor authentication
- Check spam folder

### Payment Not Working
- Verify Stripe test keys
- Use test card: 4242 4242 4242 4242
- Check console for errors

## 📝 Scripts

### Backend
```bash
npm start        # Start production server
npm run dev      # Start development server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
# Using Python
python -m http.server 3000

# Using Node
npx serve -p 3000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email: your-email@example.com

## 🎯 Roadmap

- [ ] Add product variants
- [ ] Implement live chat
- [ ] Add gift cards
- [ ] Social media integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Inventory management
- [ ] Loyalty program
- [ ] Referral system

## ⭐ Acknowledgments

- Font Awesome for icons
- Unsplash for sample images
- MongoDB Atlas for database hosting
- Cloudinary for image hosting
- Stripe for payment processing

---

**Made with ❤️ for learning and development**

**Version:** 1.0.0  
**Last Updated:** December 2024