"use client";

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  helperText?: string;
  onImageProcessed?: (files: { file5x5: File, file3x4: File } | File) => void;
  isPassportPhoto?: boolean; // If true, triggers cropping to 5x5 and 3x4
}

export default function ImageUploader({ label, helperText, onImageProcessed, isPassportPhoto }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // TODO: Implement actual cropping logic using react-avatar-editor or react-easy-crop
      if (onImageProcessed) {
        if (isPassportPhoto) {
          // Stub: return original file twice for now
          onImageProcessed({ file5x5: file, file3x4: file });
        } else {
          onImageProcessed(file);
        }
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors bg-slate-50 dark:bg-slate-800/30 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none">
        <div className="space-y-1 text-center">
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto h-32 object-contain rounded" />
          ) : (
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-400" />
          )}
          <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center mt-2">
            <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
              Upload a file
            </span>
            <input type="file" className="sr-only" accept="image/*,.pdf" onChange={handleFileChange} />
            <span className="pl-1">or drag and drop</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 5MB</p>
        </div>
      </label>
      {helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
}
