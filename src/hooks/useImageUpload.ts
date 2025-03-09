import { useState } from 'react';
import { uploadToImgur, uploadDataUrlToImgur } from '@/lib/images/imgur';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Upload a file to Imgur
  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const result = await uploadToImgur(file);
      
      if (result.success && result.data?.link) {
        return result.data.link;
      } else {
        setUploadError(result.error || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error uploading image';
      setUploadError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Upload a data URL to Imgur
  const uploadDataUrl = async (dataUrl: string): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const result = await uploadDataUrlToImgur(dataUrl);
      
      if (result.success && result.data?.link) {
        return result.data.link;
      } else {
        setUploadError(result.error || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error uploading image';
      setUploadError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    isUploading,
    uploadError,
    uploadImage,
    uploadDataUrl
  };
}