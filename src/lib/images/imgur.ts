/**
 * Service for uploading images to Imgur
 */

// Using our server API instead of direct Imgur uploads for better security
const UPLOAD_API_URL = '/api/upload/image';

interface ImgurResponse {
  success: boolean;
  status: number;
  data?: {
    id: string;
    link: string;
    deletehash?: string;
  };
  error?: string;
}

/**
 * Uploads an image file to Imgur via our server API
 * @param imageFile - The image file to upload
 * @returns Promise with the Imgur response containing the image URL
 */
export async function uploadToImgur(imageFile: File): Promise<ImgurResponse> {
  try {
    // Create form data for the upload
    const formData = new FormData();
    formData.append('image', imageFile);

    // Make the API request to our server endpoint
    const response = await fetch(UPLOAD_API_URL, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Send cookies for authentication
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error('Image upload failed:', jsonResponse);
      return {
        success: false,
        status: response.status,
        error: jsonResponse.error || 'Upload failed',
      };
    }

    return {
      success: true,
      status: response.status,
      data: jsonResponse.data,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Upload multiple images to Imgur
 * @param imageFiles - Array of image files to upload
 * @returns Promise with array of image URLs
 */
export async function uploadMultipleImagesToImgur(
  imageFiles: File[]
): Promise<string[]> {
  const uploadPromises = imageFiles.map((file) => uploadToImgur(file));
  const results = await Promise.all(uploadPromises);
  
  // Filter out failures and extract URLs
  return results
    .filter((result) => result.success && result.data?.link)
    .map((result) => result.data!.link);
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}