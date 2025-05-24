import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, ChevronLeft, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { cn } from '../utils/cn';

interface ImageUploadProps {
  onBack: () => void;
  onProcess: () => void;
  isProcessing: boolean;
  canProceed: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onBack, 
  onProcess, 
  isProcessing,
  canProceed,
}) => {
  const { uploadedImage, setUploadedImage } = useAppStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  }, [setUploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedImage(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary-100 text-secondary-700 mb-4 dark:bg-secondary-900/40 dark:text-secondary-300">
          <ImageIcon size={24} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Upload Your Image</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload an image that will inspire your music recommendation
        </p>
      </div>

      {!previewUrl ? (
        <div 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
            isDragActive 
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
              : "border-gray-300 hover:border-primary-400 dark:border-gray-700"
          )}
        >
          <input {...getInputProps()} />
          <Upload 
            className="mx-auto text-gray-400 mb-3" 
            size={36}
          />
          <p className="text-lg font-medium mb-1">
            {isDragActive ? "Drop your image here" : "Drag & drop your image here"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            - or -
          </p>
          <button className="btn btn-outline">
            Select from your device
          </button>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Supported formats: JPEG, PNG, WebP (max 5MB)
          </p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700"
        >
          <img 
            src={previewUrl} 
            alt="Uploaded preview" 
            className="w-full max-h-[400px] object-contain bg-gray-100 dark:bg-gray-800"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
            <button 
              onClick={handleRemoveImage}
              className="btn bg-white text-gray-800 hover:bg-gray-100"
            >
              Replace Image
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="btn btn-outline"
          disabled={isProcessing}
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>
        <button
          onClick={onProcess}
          disabled={!canProceed || isProcessing}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" /> Processing
            </>
          ) : (
            <>
              Get Recommendation <ArrowRight size={16} className="ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};