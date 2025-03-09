"use client";

import { useState } from 'react';
import { isValidUrl } from '@/lib/images/imgur';
import ImageDropzone from '@/components/admin/products/ImageComponent';

interface ImageInputProps {
  imageUrl: string;
  onUrlChange: (url: string) => void;
  onImageUploaded: (url: string) => void;
  onRemove?: () => void;
  imageIndex?: number;
}

export default function ImageInput({ 
  imageUrl, 
  onUrlChange, 
  onImageUploaded, 
  onRemove,
  imageIndex = 0 
}: ImageInputProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const handleImageUploadError = (error: string) => {
    setUploadError(error);
  };
  
  const handleImageUploaded = (url: string) => {
    onImageUploaded(url);
    setShowUploader(false);
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-4 mb-3">
        <div className="font-medium">Image {imageIndex + 1}</div>
        <div className="flex-grow"></div>
        <button 
          type="button"
          onClick={() => setShowUploader(true)}
          className="btn btn-sm btn-outline"
          title="Upload new image"
        >
          <span className="material-symbols-outlined">upload</span>
        </button>
        {onRemove && (
          <button 
            type="button"
            onClick={onRemove}
            className="btn btn-sm btn-error btn-outline"
            title="Remove image"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        )}
      </div>
      
      {/* Image preview */}
      {imageUrl && isValidUrl(imageUrl) ? (
        <div className="relative aspect-square w-full mb-2 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={`Image ${imageIndex + 1}`}
            className="object-contain h-full w-full"
          />
        </div>
      ) : (
        <div className="aspect-square w-full mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-gray-400">image</span>
        </div>
      )}
      
      <div className="form-control">
        <input 
          type="text" 
          value={imageUrl} 
          onChange={(e) => onUrlChange(e.target.value)}
          className="input input-bordered text-sm" 
          placeholder="Image URL or drag & drop an image"
        />
      </div>
      
      {uploadError && (
        <div className="text-error text-sm mt-1">{uploadError}</div>
      )}
      
      {/* Image uploader modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Upload Image</h3>
            <ImageDropzone 
              onImageUploaded={handleImageUploaded}
              onError={handleImageUploadError}
            />
            <div className="mt-4 flex justify-between">
              <button 
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setShowUploader(false)}
              >
                Cancel
              </button>
              <div className="text-sm text-gray-500">
                Image will be hosted on Imgur
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}