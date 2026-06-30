import { useState, useCallback, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useProfile } from './hooks/useProfile';
import { useLinks } from './hooks/useLinks';
import { getTheme } from './data/themes';
import { getFont } from './data/fonts';
import { BackgroundEffect } from './components/BackgroundEffect';
import { ProfileSection } from './components/ProfileSection';
import { LinkCard } from './components/LinkCard';
import { MediaModal } from './components/MediaModal';
import { AdminPanel } from './components/AdminPanel';
import type { Link } from './types';

function isAdminRoute(): boolean {
  return new URLSearchParams(window.location.search).has('admin');
}

export default function App() {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { links, addLink, updateLink, deleteLink, reorderLinks, incrementClick } = useLinks();

  const [mediaLink, setMediaLink] = useState<Link | null>(null);
  const [adminOpen, setAdminOpen] = useState(() => isAdminRoute());
  const adminMode = isAdminRoute();

  // Apply font across the entire page
  useEffect(() => {
    const font = getFont(profile.font_family || 'inter');
    document.body.style.fontFamily = font.family;
  }, [profile.font_family]);

  // Sync admin panel open state with URL
  useEffect(() => {
    const onPop = () => {
      if (isAdminRoute()) setAdminOpen(true);
      else setAdminOpen(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const theme = getTheme(profile.theme);

  const handleLinkClick = useCallback((id: string) => {
    incrementClick(id);
  }, [incrementClick]);

  const visibleLinks = links.filter((l) => l.active);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#818cf8 transparent transparent transparent' }}
          />
          <p className="text-white/30 text-sm font-medium tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${theme.textClass}`}>
      {/* Background */}
      <BackgroundEffect profile={profile} themeEffect={theme.effectClass} />
      {theme.bgOverlay && (
        <div className={`fixed inset-0 pointer-events-none ${theme.bgOverlay}`} style={{ zIndex: -5 }} />
      )}

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 w-full max-w-[420px] md:max-w-[520px] lg:max-w-[650px] mx-auto px-5 md:px-6 lg:px-7 py-8 pb-24">
        {/* Profile */}
        <ProfileSection
          profile={profile}
          theme={theme}
          adminMode={adminMode}
          onAdminOpen={() => setAdminOpen(true)}
        />

        {/* Subtle divider */}
        {/* <div className="mb-8 flex items-center gap-3 px-2">
          <div className="h-px flex-1 opacity-5" style={{ background: theme.lightCard ? '#000' : '#fff' }} />
          <div
            className="h-1.5 w-1.5 rounded-full opacity-10"
            style={{ background: theme.lightCard ? '#000' : '#fff' }}
          />
          <div className="h-px flex-1 opacity-5" style={{ background: theme.lightCard ? '#000' : '#fff' }} />
        </div> */}

        {/* Link cards */}
        <div className="flex flex-col gap-4">
          {visibleLinks.map((link, i) => (
            <div
              key={link.id}
              className="link-enter"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <LinkCard
                link={link}
                theme={theme}
                cardRadius={profile.card_radius || 'pill'}
                showAnalytics={profile.show_analytics}
                onMediaOpen={setMediaLink}
                onClickTrack={handleLinkClick}
              />
            </div>
          ))}

          {visibleLinks.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="text-5xl opacity-25">🔗</div>
              <p className={`text-sm ${theme.subtextClass} opacity-50`}>No links yet</p>
              {adminMode && (
                <button
                  onClick={() => setAdminOpen(true)}
                  className="mt-2 text-xs opacity-35 underline underline-offset-2 transition-opacity hover:opacity-60"
                  style={{ color: 'inherit' }}
                >
                  Add your first link →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className={`mt-16 text-center text-[10px] tracking-[0.2em] uppercase ${theme.subtextClass} opacity-15`}>
          made with love
        </p>
      </div>

      {/* Floating admin FAB (only in admin mode, when panel closed) */}
      {adminMode && !adminOpen && (
        <button
          onClick={() => setAdminOpen(true)}
          className="fixed bottom-7 right-5 z-30 w-13 h-13 rounded-2xl text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${profile.accent_color}, ${profile.accent_color}cc)`,
            width: 52,
            height: 52,
            boxShadow: `0 8px 32px ${profile.accent_color}50`,
          }}
          title="Admin Panel"
        >
          <Settings size={20} />
        </button>
      )}

      {/* Admin panel */}
      <AdminPanel
        links={links}
        profile={profile}
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onAddLink={addLink}
        onUpdateLink={updateLink}
        onDeleteLink={deleteLink}
        onReorder={reorderLinks}
        onUpdateProfile={updateProfile}
      />

      {/* Media modal */}
      {mediaLink && (
        <MediaModal link={mediaLink} onClose={() => setMediaLink(null)} />
      )}
    </div>
  );
}
