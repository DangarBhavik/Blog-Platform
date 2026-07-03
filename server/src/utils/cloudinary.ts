import { v2 as cloudinary } from "cloudinary";
import config from "../config/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary from file buffer
 * @param fileBuffer - Buffer containing the image data
 * @param fileName - Original file name
 * @param folder - Cloudinary folder path (e.g., "blog/cover-images")
 * @returns Promise containing upload response with secure URL
 */
export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "blog/cover-images"
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: fileName.split(".")[0], // Remove extension for public_id
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID of the image
 * @returns Promise containing deletion response
 */
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

/**
 * Get optimized Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param quality - Image quality (auto, low, mid, high)
 * @returns Optimized Cloudinary URL
 */
export const getOptimizedImageUrl = (
  publicId: string,
  width: number = 800,
  height: number = 400,
  quality: string = "auto"
): string => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: "fill",
    quality,
    fetch_format: "auto",
  });
};
