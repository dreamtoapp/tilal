import cloudinary from 'cloudinary';

export const cloudinaryConfig = (): { error?: string } => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return { error: 'MISSING_CLOUD_CONFIG' };
  }

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return {};
};
