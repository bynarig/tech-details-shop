"use client";

import { useCallback, useState } from 'react';
import { uploadToImgur } from '@/lib/images/imgur';

interface ImageDropzoneProps {
  onImageUploaded: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

export default function ImageDropzone({ onImageUploaded, onError }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Get the dropped files
    const files = Array.from(e.dataTransfer.files);
    
    // Check if any files were dropped
    if (files.length === 0) return;

    // Find the first image file
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (!imageFile) {
      onError?.('Please drop an image file (PNG, JPEG, etc.)');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadToImgur(imageFile);

      if (result.success && result.data?.link) {
        onImageUploaded(result.data.link);
      } else {
        onError?.(result.error || 'Failed to upload image to Imgur');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  }, [onImageUploaded, onError]);

  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFile = files[0];
    setIsUploading(true);

    try {
      const result = await uploadToImgur(imageFile);

      if (result.success && result.data?.link) {
        onImageUploaded(result.data.link);
      } else {
        onError?.(result.error || 'Failed to upload image to Imgur');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setIsUploading(false);
      // Clear the input so the same file can be selected again
      if (e.target) e.target.value = '';
    }
  }, [onImageUploaded, onError]);

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileInputChange}
        className="hidden" 
        id="image-upload" 
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-md text-primary"></span>
          <p className="mt-2">Uploading to Imgur...</p>
        </div>
      ) : (
        <>
          <label 
            htmlFor="image-upload" 
            className="flex flex-col items-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-4xl text-gray-400">
              cloud_upload
            </span>
            <p className="mt-2 text-sm">Drag & drop an image here or click to select</p>
            <p className="mt-1 text-xs text-gray-500">
              Image will be uploaded to Imgur
            </p>
          </label>
        </>
      )}
    </div>
  );
}