const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file, folder = 'ecommerce') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result: result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage
};