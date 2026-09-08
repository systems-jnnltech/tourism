import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { uploadImageFile, validateImageFile } from '../../lib/storageService';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'destinations' | 'msmes' | 'establishments' | 'events' | 'general';
  placeholder?: string;
  className?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Cover Photo',
  value,
  onChange,
  folder = 'general',
  placeholder = 'https://images.unsplash.com/... or /destinations/photo.jpg',
  className = '',
  helperText,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);
    setUploadNotice(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid image file.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImageFile(file, folder);
      onChange(result.url);
      if (result.source === 'supabase') {
        setUploadNotice('Uploaded to Supabase Cloud Storage successfully.');
      } else if (result.error) {
        setUploadNotice(result.error);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to process image file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input so same file can be re-selected if desired
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setUploadNotice(null);
    setUploadError(null);
  };

  const isSupabaseUrl = value?.includes('supabase.co/storage/v1/object/public');
  const isDataUrl = value?.startsWith('data:image/');

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all font-medium ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all font-medium ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Preview if an image is currently set */}
      {value ? (
        <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-900 group">
          <img
            src={value}
            alt={label}
            className="w-full h-44 object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            onError={(e) => {
              // fallback if broken image link
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
            }}
          />

          {/* Top Floating Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {isSupabaseUrl ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Cloud Stored (Supabase CDN)
              </span>
            ) : isDataUrl ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 backdrop-blur-xs">
                <HardDrive className="w-2.5 h-2.5" />
                Local Optimized Preview
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-slate-300 border border-slate-600/40 backdrop-blur-xs">
                <LinkIcon className="w-2.5 h-2.5" />
                Web / Local Link
              </span>
            )}
          </div>

          {/* Hover Controls */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
              <span>Change Photo</span>
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition-colors"
              title="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : activeTab === 'upload' ? (
        /* Upload Mode Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <p className="text-xs font-semibold">Processing & uploading image...</p>
              <span className="text-[10px] text-slate-500">Please wait a moment</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Click to browse photo <span className="font-normal text-slate-500">or drag and drop</span>
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                PNG, JPG, WebP, SVG up to 5MB
                {isSupabaseConfigured ? ' • Directly uploads to Supabase' : ' • Auto-optimized'}
              </p>
            </>
          )}
        </div>
      ) : (
        /* Direct URL Mode */
        <div className="space-y-1.5">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Paste an image link from the web or a local path like <code className="text-indigo-600 dark:text-indigo-400">/destinations/myphoto.jpg</code>
          </p>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Upload Notice Banner */}
      {uploadNotice && (
        <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 p-2 rounded-lg border border-indigo-200 dark:border-indigo-900">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
