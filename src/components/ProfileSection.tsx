import { Settings } from 'lucide-react';
import type { Profile, Theme } from '../types';
import { SocialIconBar } from './SocialIconBar';
import { avatarShapeMap } from '../data/shapes';

interface ProfileSectionProps {
  profile: Profile;
  theme: Theme;
  adminMode: boolean;
  onAdminOpen: () => void;
}

export function ProfileSection({ profile, theme, adminMode, onAdminOpen }: ProfileSectionProps) {
  const avatarShape = avatarShapeMap[profile.avatar_shape] ?? 'rounded-full';
  const avatarSize = 110;

  return (
    <div className="flex flex-col items-center pb-6 pt-12 text-center\">
      {/* ── AVATAR ── */}
      <div className="relative group mb-6">
        {/* Soft radial glow behind avatar */}
        <div
          className="absolute opacity-20 group-hover:opacity-35 transition-opacity duration-700 pointer-events-none"
          style={{
            inset: -32,
            background: `radial-gradient(circle, ${profile.accent_color}65, transparent 65%)`,
            filter: 'blur(36px)',
            borderRadius: '50%',
          }}
        />

        {/* Avatar */}
        <div
          className={`relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.04] ${avatarShape}`}
          style={{
            width: avatarSize,
            height: avatarSize,
            boxShadow: `0 0 0 2.5px ${profile.accent_color}70, 0 0 0 5px ${
              theme.lightCard ? 'rgba(255,255,255,0.95)' : 'rgba(5,5,5,0.96)'
            }, 0 24px 64px ${profile.accent_color}28, 0 8px 28px rgba(0,0,0,0.5)`,
          }}
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold text-white"
              style={{
                fontSize: avatarSize * 0.38,
                background: `linear-gradient(135deg, ${profile.accent_color}, ${profile.accent_color}85)`,
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Admin gear */}
        {adminMode && (
          <button
            onClick={onAdminOpen}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full text-white shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
            style={{ background: profile.accent_color, boxShadow: `0 4px 16px ${profile.accent_color}60` }}
          >
            <Settings size={13} />
          </button>
        )}
      </div>

      {/* ── NAME ── */}
      <h1
        className="font-bold leading-tight mb-3.5 tracking-tight"
        style={{
          fontSize: 'clamp(26px, 7vw, 36px)',
          color: profile.accent_color,
          textShadow: `0 0 60px ${profile.accent_color}35`,
          letterSpacing: '-0.02em',
        }}
      >
        {profile.name}
      </h1>

      {/* ── BIO ── */}
      {profile.bio && (
        <p
          className={`text-[15px] leading-relaxed max-w-[330px] font-light tracking-[0.005em] ${theme.subtextClass}`}
          style={{
            color: profile.bio_color || 'currentColor',
            opacity: 0.8,
          }}
        >
          {profile.bio}
        </p>
      )}

      {/* ── SOCIAL ICONS ── */}
      <div style={{ color: profile.social_links_color || 'currentColor' }}>
        <SocialIconBar
          socialLinks={profile.social_links}
          socialIconImages={profile.social_icon_images}
          theme={theme}
          accentColor={profile.accent_color}
        />
      </div>
    </div>
  );
}
