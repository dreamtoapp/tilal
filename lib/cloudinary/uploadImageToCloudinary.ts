// lib/cloudinary/config.ts

import { optimizeCloudinaryUrl } from './optimizer';
import {
  formatErrorMessage,
  validateImageFile,
} from './validator';

// lib/cloudinary/types.ts
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

// lib/cloudinary/service.ts
export const ImageToCloudinary = async (
  imageFile: File | Blob | string,
  uploadPreset: string,
): Promise<{ result?: CloudinaryUploadResult; error?: string }> => {
  try {
    // 1. Validate inputs
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return { error: formatErrorMessage('MISSING_CLOUD_CONFIG') };
    }

    if (!uploadPreset) {
      return { error: formatErrorMessage('MISSING_UPLOAD_PRESET') };
    }

    // 2. Validate image file
    const { valid, error: validationError } = await validateImageFile(imageFile);
    if (!valid) {
      return { error: formatErrorMessage(validationError || 'INVALID_IMAGE') };
    }

    // 3. Prepare request
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);

    // 4. Execute request
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData },
    );

    // 5. Handle response
    if (!response.ok) {
      let errorDetails = `Upload failed with status: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorDetails += ` - Cloudinary error: ${errorData?.error?.message || JSON.stringify(errorData)}`;
      } catch (e) {
        // Failed to parse error JSON, try to get text response
        try {
          const textError = await response.text();
          if (textError) { // Only append if there's actual text
            errorDetails += ` - Response body: ${textError}`;
          }
        } catch (textE) {
          // Ignore if reading text also fails, errorDetails will have status info
        }
      }
      return { error: `فشل رفع الصورة: ${errorDetails}` }; // More detailed error
    }

    const data: CloudinaryUploadResult = await response.json();

    // 6. Validate response structure
    if (!data.secure_url || !data.public_id) {
      return { error: formatErrorMessage('INVALID_RESPONSE') };
    }

    // 7. Optimize URL
    return { result: optimizeCloudinaryUrl(data) };
  } catch (error: unknown) {
    let message: string;
    if (error instanceof Error) {
      message = error.message;
    } else {
      // 2) Fallback for non-Error throws (strings, objects, etc.)
      message = String(error);
    }

    return { error: formatErrorMessage(message) };
  }
};
