// lib/cloudinary/uploadImageToCloudinary.ts
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Upload image to Cloudinary and return an optimized secure URL.
 * @param filePath - Local path or remote URL
 * @param preset - Cloudinary upload preset
 * @returns Optimized secure URL string
 */
export async function uploadImageToCloudinary(filePath: string, preset: string, folder: string): Promise<string> {
  // Validate Cloudinary configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary configuration. Please check environment variables.');
  }

  // Upload options - try with preset first, fallback without preset
  const uploadOptions: any = {
    folder: folder || 'products',
    resource_type: 'image',
    // Basic transformations during upload
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  };

  // Add preset if provided, otherwise rely on default settings
  if (preset && preset.trim()) {
    uploadOptions.upload_preset = preset;
  }

  let result;
  try {
    result = await cloudinary.v2.uploader.upload(filePath, uploadOptions);
  } catch (error) {
    // If preset fails, try without preset
    if (preset && error instanceof Error && error.message.includes('preset')) {
      // console.warn('[CLOUDINARY] Preset failed, trying without preset:', preset);
      delete uploadOptions.upload_preset;
      result = await cloudinary.v2.uploader.upload(filePath, uploadOptions);
    } else {
      throw error;
    }
  }

  // Generate an optimized URL with auto format, quality, and responsive width
  return cloudinary.v2.url(result.public_id, {
    secure: true,
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' },
      { width: 'auto', crop: 'scale' },
    ],
  });
}
