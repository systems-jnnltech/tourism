import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface UploadResult {
  url: string;
  source: 'supabase' | 'local_fallback';
  error?: string;
}

/**
 * Validates whether a file is an acceptable image and within size limits (default 5MB)
 */
export function validateImageFile(file: File, maxSizeBytes = 5 * 1024 * 1024): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select a valid image file (JPEG, PNG, WebP, GIF, or SVG).' };
  }
  if (file.size > maxSizeBytes) {
    const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `Image file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is ${sizeMb}MB.` };
  }
  return { valid: true };
}

/**
 * Compresses an image file using an HTML5 canvas and converts it to a clean Base64 data URL
 * Ensures images uploaded offline or without bucket setup do not blow up localStorage quotas.
 */
export async function compressAndConvertToDataUrl(
  file: File,
  maxWidth = 1280,
  maxHeight = 720,
  quality = 0.85
): Promise<string> {
  // SVG or GIF: return as standard Data URL to preserve vectors/animation
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Supabase Storage ('tourism-media' bucket).
 * If Supabase is unconfigured or the bucket upload fails, falls back gracefully to a compressed Base64 Data URL.
 */
export async function uploadImageFile(
  file: File,
  folder: 'destinations' | 'msmes' | 'establishments' | 'events' | 'general' = 'general'
): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file');
  }

  // If Supabase is ready and configured, attempt cloud upload
  if (isSupabaseConfigured && supabase) {
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from('tourism-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from('tourism-media')
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            source: 'supabase',
          };
        }
      }

      console.warn('[Storage] Supabase storage upload notice:', error?.message);
    } catch (err: any) {
      console.warn('[Storage] Exception during Supabase upload:', err?.message || err);
    }
  }

  // Graceful fallback to client-side compressed Data URL
  const fallbackUrl = await compressAndConvertToDataUrl(file);
  return {
    url: fallbackUrl,
    source: 'local_fallback',
    error: isSupabaseConfigured
      ? "Uploaded locally. Ensure the 'tourism-media' public bucket is created in your Supabase dashboard for permanent cloud hosting."
      : undefined,
  };
}
