const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Connected');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ FAILED! Error:', err.message);
    process.exit(1);
  });