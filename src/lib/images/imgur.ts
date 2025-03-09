/**
 * Imgur Image Upload Service
 * Handles image upload operations to Imgur API
 */
const IMGUR_CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'YOUR_IMGUR_CLIENT_ID';
const IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image';

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
 * Uploads an image file to Imgur and returns the URL
 */
export async function uploadToImgur(imageFile: File): Promise<ImgurResponse> {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(IMGUR_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data.data?.error || 'Failed to upload image',
      };
    }

    return {
      success: true,
      status: response.status,
      data: {
        id: data.data.id,
        link: data.data.link,
        deletehash: data.data.deletehash,
      },
    };
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Uploads a data URL to Imgur
 * Converts the data URL to a file first
 */
export async function uploadDataUrlToImgur(dataUrl: string): Promise<ImgurResponse> {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // Create a File object from the blob
    const file = new File([blob], "image.jpg", { type: blob.type });
    
    // Upload the file
    return await uploadToImgur(file);
  } catch (error) {
    console.error('Error processing data URL:', error);
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Failed to process image',
    };
  }
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

/**
 * Check if a string is a data URL
 */
export function isDataUrl(str: string): boolean {
  return typeof str === 'string' && str.startsWith('data:');
}