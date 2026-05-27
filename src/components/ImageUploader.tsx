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
      <label className="block text-sm font-medium text-slate-200">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl hover:border-blue-500/50 transition-colors bg-slate-800/30">
        <div className="space-y-1 text-center">
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto h-32 object-contain rounded" />
          ) : (
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
          )}
          <div className="flex text-sm text-slate-400 justify-center">
            <label className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none">
              <span>Upload a file</span>
              <input type="file" className="sr-only" accept="image/*,.pdf" onChange={handleFileChange} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-slate-500">PNG, JPG, PDF up to 5MB</p>
        </div>
      </div>
      {helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
}
