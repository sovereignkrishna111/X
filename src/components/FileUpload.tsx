import { useRef, useState, useCallback } from 'react';
import { Upload, X, Loader2, CheckCircle, Image, Film } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';

interface FileUploadProps {
  bucket: 'avatars' | 'media';
  accept?: string;
  onUploaded: (url: string) => void;
  currentUrl?: string;
  label?: string;
  hint?: string;
  folder?: string;
  compact?: boolean;
}

export function FileUpload({
  bucket,
  accept,
  onUploaded,
  currentUrl,
  label = 'Upload file',
  hint,
  folder,
  compact = false,
}: FileUploadProps) {
  const { upload, uploading, error } = useStorage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [done, setDone] = useState(false);

  const defaultAccept = bucket === 'avatars'
    ? 'image/jpeg,image/png,image/gif,image/webp'
    : 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm';

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    const url = await upload(file, bucket, folder);
    if (url) {
      onUploaded(url);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    }
  }, [upload, bucket, folder, onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const isVideo = currentUrl && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(currentUrl);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {currentUrl && (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
            {isVideo ? (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <Film size={16} className="text-white/60" />
              </div>
            ) : (
              <img src={currentUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 bg-white/8 hover:bg-white/12 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <><Loader2 size={12} className="animate-spin" /> Uploading...</>
          ) : done ? (
            <><CheckCircle size={12} className="text-green-400" /> Done!</>
          ) : (
            <><Upload size={12} /> {label}</>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? defaultAccept}
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
          dragOver
            ? 'border-white/50 bg-white/10'
            : 'border-white/15 hover:border-white/30 bg-white/4 hover:bg-white/8'
        } ${uploading ? 'pointer-events-none' : ''}`}
      >
        {currentUrl && !uploading ? (
          <div className="relative">
            {isVideo ? (
              <div className="h-32 flex flex-col items-center justify-center gap-2">
                <Film size={28} className="text-white/40" />
                <p className="text-white/50 text-xs truncate px-4 max-w-full">{currentUrl.split('/').pop()}</p>
              </div>
            ) : (
              <img
                src={currentUrl}
                alt="Preview"
                className="w-full h-32 object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs">
                <Upload size={12} />
                Change file
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-7 px-4 text-center">
            {uploading ? (
              <>
                <Loader2 size={24} className="text-white/60 animate-spin" />
                <p className="text-white/60 text-sm font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center">
                  {bucket === 'avatars' ? (
                    <Image size={20} className="text-white/40" />
                  ) : (
                    <Film size={20} className="text-white/40" />
                  )}
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium">{label}</p>
                  {hint && <p className="text-white/35 text-xs mt-0.5">{hint}</p>}
                  <p className="text-white/25 text-xs mt-1">Click or drag & drop</p>
                </div>
              </>
            )}
          </div>
        )}

        {done && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
            <CheckCircle size={32} className="text-green-400" />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <X size={12} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept ?? defaultAccept}
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
      />
    </div>
  );
}
