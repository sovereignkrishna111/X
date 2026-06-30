import { useState, useRef } from 'react';
import { MoreHorizontal, Play, Globe, Image } from 'lucide-react';
import type { Link, Theme } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { cardRadiusValue } from '../data/shapes';

interface LinkCardProps {
  link: Link;
  theme: Theme;
  cardRadius: string;
  showAnalytics: boolean;
  onMediaOpen: (link: Link) => void;
  onClickTrack: (id: string) => void;
}

export function LinkCard({
  link, theme, cardRadius, onMediaOpen, onClickTrack,
}: LinkCardProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isMedia = ['image', 'video', 'youtube', 'embed'].includes(link.type);
  const isVideo = link.type === 'video';
  const isImage = link.type === 'image';
  const hasMedia = !!(link.thumbnail_url || link.media_url);
  const mediaSrc = link.thumbnail_url || link.media_url;
  const radius = cardRadiusValue[cardRadius] ?? '28px';
  const glowColor = link.color_from;

  const handleClick = () => {
    onClickTrack(link.id);
    if (isMedia) onMediaOpen(link);
    else window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const interactionProps = {
    onClick: handleClick,
    onMouseEnter: () => { setHovered(true); if (isVideo && videoRef.current) videoRef.current.play().catch(() => {}); },
    onMouseLeave: () => { setHovered(false); setPressed(false); if (isVideo && videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false),
  };

  /* ─────────────────────────────────────────
     CINEMATIC MEDIA CARD (image / video)
  ───────────────────────────────────────── */
  if (isMedia && hasMedia && mediaSrc) {
    const isVideoFile = isVideo && !link.thumbnail_url;

    return (
      <div
        className={`group relative cursor-pointer select-none overflow-hidden transition-all duration-300 ${
          pressed ? 'scale-[0.97]' : hovered ? 'scale-[1.01]' : ''
        }`}
        style={{
          borderRadius: radius,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: hovered
            ? `0 28px 80px ${glowColor}32, 0 12px 32px rgba(0,0,0,0.5)`
            : `0 8px 28px rgba(0,0,0,0.25)`,
        }}
        {...interactionProps}
      >
        {/* Media layer — clips to upper portion via the card height */}
        <div className="relative overflow-hidden" style={{ height: 220 }}>
          {isVideoFile ? (
            <video
              ref={videoRef}
              src={mediaSrc}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoLoaded(true)}
            />
          ) : (
            <img
              src={mediaSrc}
              alt={link.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          )}

          {/* Top vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

          {/* Bottom cinematic fade — the "only upper half" effect */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '55%',
              background: theme.lightCard
                ? 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.95) 80%, rgb(255,255,255) 100%)'
                : 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.88) 72%, rgba(10,10,10,0.97) 100%)',
            }}
          />

          {/* Backdrop blur on the lower portion */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '35%',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 60%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 60%)',
            }}
          />

          {/* Media type badge */}
          <div className="absolute top-3 left-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-semibold tracking-wide backdrop-blur-md border border-white/20"
              style={{ background: `${glowColor}55` }}
            >
              {isVideo ? <Play size={9} className="fill-white" /> : <Image size={9} />}
              {isVideo ? 'Video' : 'Photo'}
            </div>
          </div>

          {/* Play button overlay (video) */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-all duration-300 ${
                  hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ background: `${glowColor}70` }}
              >
                <Play size={26} className="text-white fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Title + icon row overlaid on the blur area */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-3.5 pb-3.5 pt-2">
            {/* Mini icon */}
            <div
              className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ring-2 ring-white/25 shadow-lg"
              style={
                link.icon_type !== 'image'
                  ? { background: `linear-gradient(135deg, ${link.color_from}, ${link.color_to})` }
                  : {}
              }
            >
              {link.icon_type === 'image' && link.icon_value ? (
                <img src={link.icon_value} alt={link.title} className="w-full h-full object-cover" />
              ) : link.icon_type === 'emoji' ? (
                <span className="text-xl leading-none">{link.icon_value || '🔗'}</span>
              ) : (
                <DynamicIcon name={link.icon_value || 'Link'} size={18} className="text-white drop-shadow-sm" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[15px] leading-tight text-white drop-shadow-md truncate">
                {link.title}
              </p>
              {link.description && (
                <p className="text-[11px] mt-0.5 text-white/70 truncate">{link.description}</p>
              )}
            </div>
            <div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white/60 transition-opacity"
              style={{ opacity: hovered ? 0.9 : 0.4 }}
            >
              <MoreHorizontal size={15} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     STANDARD LINK CARD
  ───────────────────────────────────────── */
  return (
    <div
      className={`group relative cursor-pointer select-none overflow-hidden transition-all duration-[250ms] ${theme.cardClass} ${theme.cardHoverClass} ${
        pressed ? 'scale-[0.96]' : ''
      }`}
      style={{
        borderRadius: radius,
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: hovered && !pressed
          ? `${theme.lightCard
              ? `0 8px 32px ${glowColor}22, 0 2px 8px rgba(0,0,0,0.1)`
              : `0 8px 32px ${glowColor}28, 0 2px 8px rgba(0,0,0,0.4)`}`
          : undefined,
      }}
      {...interactionProps}
    >
      {/* Shimmer on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `linear-gradient(105deg, transparent 35%, ${glowColor}06 50%, transparent 65%)`,
          borderRadius: 'inherit',
        }}
      />

      {/* Main row */}
      <div className="flex h-[74px] items-center pl-2.5 pr-3">
        {/* Icon */}
        <div className="flex-shrink-0 mr-3.5">
          <div
            className="w-[54px] h-[54px] rounded-full overflow-hidden flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-[1.07]"
            style={
              link.icon_type !== 'image'
                ? {
                    background: `linear-gradient(135deg, ${link.color_from}, ${link.color_to})`,
                    boxShadow: hovered ? `0 6px 20px ${link.color_from}55` : `0 2px 10px ${link.color_from}28`,
                  }
                : { boxShadow: hovered ? `0 4px 16px rgba(0,0,0,0.3)` : `0 2px 8px rgba(0,0,0,0.18)` }
            }
          >
            {link.icon_type === 'image' && link.icon_value ? (
              <img src={link.icon_value} alt={link.title} className="w-full h-full object-cover" />
            ) : link.icon_type === 'emoji' ? (
              <span className="text-2xl leading-none">{link.icon_value || '🔗'}</span>
            ) : (
              <DynamicIcon name={link.icon_value || 'Link'} size={22} className="text-white drop-shadow-sm" />
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className={`font-semibold text-[15.5px] leading-tight truncate ${theme.cardTextPrimary}`}>
            {link.title}
          </p>
          {link.description && (
            <p className={`text-xs mt-0.5 truncate ${theme.cardTextSecondary}`}>
              {link.description}
            </p>
          )}
        </div>

        {/* Three dots */}
        <div
          className={`flex-shrink-0 ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${theme.cardMuted}`}
          style={{ opacity: hovered ? 0.75 : 0.3 }}
        >
          <MoreHorizontal size={17} />
        </div>
      </div>
    </div>
  );
}
