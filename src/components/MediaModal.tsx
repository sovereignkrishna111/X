import { X, ExternalLink, Download } from 'lucide-react';
import { useEffect } from 'react';
import type { Link } from '../types';

interface MediaModalProps {
  link: Link | null;
  onClose: () => void;
}

function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
  return url;
}

export function MediaModal({ link, onClose }: MediaModalProps) {
  useEffect(() => {
    if (!link) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, link]);

  if (!link) return null;

  const mediaUrl = link.media_url || link.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-lg"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden bg-zinc-900/95 shadow-2xl border border-white/8 modal-content">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{link.title}</h3>
            {link.description && <p className="text-white/40 text-xs mt-0.5 truncate">{link.description}</p>}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {mediaUrl && (
              <a
                href={mediaUrl}
                download
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                title="Download"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={15} />
              </a>
            )}
            {link.url && link.url !== '#' && (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                title="Open in new tab"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={15} />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Media content */}
        <div className="bg-black/40">
          {link.type === 'image' && (
            <img
              src={mediaUrl}
              alt={link.title}
              className="w-full max-h-[75vh] object-contain"
            />
          )}

          {link.type === 'video' && (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="w-full max-h-[75vh] bg-black"
              controlsList="nodownload"
            />
          )}

          {link.type === 'youtube' && (
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={getYoutubeEmbedUrl(link.url)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={link.title}
              />
            </div>
          )}

          {link.type === 'embed' && (
            <div className="relative" style={{ height: '65vh' }}>
              <iframe
                src={link.url}
                className="w-full h-full border-0"
                title={link.title}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
