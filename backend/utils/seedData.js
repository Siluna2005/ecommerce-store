// Seed database with initial data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

// Sample products data - 10 clothing items
const products = [
  {
    name: "Classic White T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with a relaxed fit.",
    price: 29.99,
    originalPrice: 39.99,
    onSale: true,
    salePercentage: 25,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" }
    ],
    category: "Men",
    subCategory: "T-Shirts",
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 20 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 12 }
    ],
    stock: 65,
    colors: ["White", "Black", "Gray"],
    material: "100% Cotton",
    brand: "StyleCo",
    tags: ["casual", "basic", "essential"],
    isFeatured: true,
    averageRating: 4.5,
    numReviews: 28
  },
  {
    name: "Slim Fit Blue Jeans",
    description: "Modern slim fit jeans with stretch comfort. Classic 5-pocket styling with a contemporary cut.",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    images: [
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800" }
    ],
    category: "Men",
    subCategory: "Jeans",
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    stock: 45,
    colors: ["Dark Blue", "Light Blue"],
    material: "98% Cotton, 2% Elastane",
    brand: "DenimPro",
    tags: ["jeans", "denim", "casual"],
    isFeatured: true,
    averageRating: 4.7,
    numReviews: 35
  },
  {
    name: "Floral Summer Dress",
    description: "Beautiful floral print dress perfect for summer days. Lightweight fabric with a flattering A-line cut.",
    price: 59.99,
    originalPrice: 89.99,
    onSale: true,
    salePercentage: 33,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    images: [
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800" }
    ],
    category: "Women",
    subCategory: "Dresses",
    sizes: [
      { size: "XS", stock: 8 },
      { size: "S", stock: 12 },
      { size: "M", stock: 15 },
      { size: "L", stock: 10 }
    ],
    stock: 45,
    colors: ["Floral Multi", "Blue Floral"],
    material: "100% Rayon",
    brand: "SummerStyle",
    tags: ["dress", "summer", "floral"],
    isFeatured: true,
    averageRating: 4.8,
    numReviews: 42
  }
];

// Connect to database and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('📡 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@store.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      role: 'admin',
      phone: '+1234567890'
    });
    console.log('✅ Admin user created');

    // Create sample regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'User123!',
      role: 'user',
      phone: '+1987654321'
    });
    console.log('✅ Sample user created');

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products created`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin:');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
    console.log('\nUser:');
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: User123!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();