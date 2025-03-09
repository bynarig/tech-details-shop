"use client";

import { useCallback, useState, useRef } from 'react';
import { uploadToImgur } from '@/lib/images/imgur';

interface ImageDropzoneProps {
  onImageUploaded: (imageUrl: string) => void;
  onError?: (error: string) => void;
  autoUpload?: boolean; // New prop to control auto-upload behavior
}

export default function ImageDropzone({ 
  onImageUploaded, 
  onError,
  autoUpload = true 
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Process the file - either upload directly or return the file
  const processFile = useCallback(async (file: File) => {
    // Show local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      
      // If not auto-uploading, pass the data URL to the parent
      if (!autoUpload) {
        onImageUploaded(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    
    // If auto-upload is enabled, upload to Imgur
    if (autoUpload) {
      setIsUploading(true);
      try {
        const result = await uploadToImgur(file);
  
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
    }
  }, [autoUpload, onImageUploaded, onError]);

  // Handle drag-and-drop events
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

    await processFile(imageFile);
  }, [processFile, onError]);

  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFile = files[0];
    await processFile(imageFile);
    
    // Clear the input so the same file can be selected again
    if (e.target) e.target.value = '';
  }, [processFile]);

  // Programmatically click the file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input 
        ref={fileInputRef}
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
      ) : previewUrl && !autoUpload ? (
        <div className="flex flex-col items-center">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-48 object-contain mb-2" 
          />
          <p className="text-sm">Image ready for upload</p>
        </div>
      ) : (
        <>
          <span className="material-symbols-outlined text-4xl text-gray-400">
            cloud_upload
          </span>
          <p className="mt-2 text-sm">Drag & drop an image here or click to select</p>
          <p className="mt-1 text-xs text-gray-500">
            Image will be uploaded to Imgur
          </p>
        </>
      )}
    </div>
  );
}