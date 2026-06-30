import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export function useStorage() {
  const [state, setState] = useState<UploadState>({ uploading: false, progress: 0, error: null });

  const upload = useCallback(async (
    file: File,
    bucket: 'avatars' | 'media',
    folder = ''
  ): Promise<string | null> => {
    setState({ uploading: true, progress: 0, error: null });

    const ext = file.name.split('.').pop();
    const path = folder
      ? `${folder}/${Date.now()}.${ext}`
      : `${Date.now()}.${ext}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, cacheControl: '3600' });

      if (error) {
        setState({ uploading: false, progress: 0, error: error.message });
        return null;
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      setState({ uploading: false, progress: 100, error: null });
      return urlData.publicUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setState({ uploading: false, progress: 0, error: msg });
      return null;
    }
  }, []);

  return { ...state, upload };
}
