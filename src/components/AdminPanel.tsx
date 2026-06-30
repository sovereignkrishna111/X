import { useState } from 'react';
import {
  X, Plus, Trash2, GripVertical, Edit2, Eye, EyeOff,
  Link as LinkIcon, User, Palette, BarChart2,
  type LucideIcon,
} from 'lucide-react';
import type { Link, Profile, AdminView } from '../types';
import { LinkEditor } from './LinkEditor';
import { ProfileEditor } from './ProfileEditor';
import { ThemeSelector } from './ThemeSelector';

interface AdminPanelProps {
  links: Link[];
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (data: Partial<Link>) => void;
  onUpdateLink: (id: string, data: Partial<Link>) => void;
  onDeleteLink: (id: string) => void;
  onReorder: (links: Link[]) => void;
  onUpdateProfile: (data: Partial<Profile>) => void;
}

export function AdminPanel({
  links, profile, isOpen, onClose,
  onAddLink, onUpdateLink, onDeleteLink, onReorder, onUpdateProfile,
}: AdminPanelProps) {
  const [view, setView] = useState<AdminView>('links');
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [addingLink, setAddingLink] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(index);
  };
  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const reordered = [...links];
    const [removed] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, removed);
    onReorder(reordered);
    setDragIndex(null);
    setDragOver(null);
  };

  const totalClicks = links.reduce((acc, l) => acc + l.click_count, 0);
  const topLink = [...links].sort((a, b) => b.click_count - a.click_count)[0];

  const navItems: { id: AdminView; icon: LucideIcon; label: string }[] = [
    { id: 'links', icon: LinkIcon, label: 'Links' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'theme', icon: Palette, label: 'Design' },
    { id: 'design', icon: BarChart2, label: 'Stats' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-40 w-full max-w-sm bg-zinc-950/95 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">Admin Panel</h2>
            <p className="mt-0.5 text-xs text-white/35">Navigate to <code className="text-white/50">?admin</code> in URL to access</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex border-b border-white/8 shrink-0 px-1 pt-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-[11px] font-medium rounded-t-lg transition-all ${
                view === id
                  ? 'text-white bg-white/5 border-b-2 border-white/50'
                  : 'text-white/35 hover:text-white/60 border-b-2 border-transparent hover:bg-white/3'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">

          {/* ── LINKS ── */}
          {view === 'links' && (
            <div className="space-y-3">
              {(addingLink || editingLink) ? (
                <LinkEditor
                  link={editingLink ?? undefined}
                  isNew={addingLink && !editingLink}
                  onSave={(data) => {
                    if (editingLink) {
                      onUpdateLink(editingLink.id, data);
                    } else {
                      onAddLink(data);
                    }
                    setEditingLink(null);
                    setAddingLink(false);
                  }}
                  onCancel={() => { setEditingLink(null); setAddingLink(false); }}
                />
              ) : (
                <>
                  <button
                    onClick={() => setAddingLink(true)}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-violet-500/20"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    <Plus size={16} />
                    Add New Link
                  </button>

                  <p className="text-xs text-white/30 text-center">Drag to reorder</p>

                  <div className="space-y-1.5">
                    {links.map((link, index) => (
                      <div
                        key={link.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={() => { setDragIndex(null); setDragOver(null); }}
                        className={`group flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                          dragOver === index
                            ? 'border-white/40 bg-white/10 scale-[1.01]'
                            : 'border-white/6 bg-white/3 hover:bg-white/6 hover:border-white/12'
                        } ${!link.active ? 'opacity-40' : ''}`}
                      >
                        <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors flex-shrink-0">
                          <GripVertical size={14} />
                        </div>

                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{ background: `linear-gradient(135deg, ${link.color_from}, ${link.color_to})` }}
                        >
                          <span className="text-white text-xs font-bold">{link.title.charAt(0)}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold truncate">{link.title}</p>
                          <p className="text-white/35 text-[10px] truncate">{link.url || link.media_url || '—'}</p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => onUpdateLink(link.id, { active: !link.active })}
                            className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/12 flex items-center justify-center text-white/40 hover:text-white transition-all"
                          >
                            {link.active ? <Eye size={11} /> : <EyeOff size={11} />}
                          </button>
                          <button
                            onClick={() => { setEditingLink(link); setAddingLink(false); }}
                            className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/12 flex items-center justify-center text-white/40 hover:text-white transition-all"
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete "${link.title}"?`)) onDeleteLink(link.id); }}
                            className="w-6 h-6 rounded-md bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/40 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {links.length === 0 && (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-2">🔗</div>
                      <p className="text-white/30 text-sm">No links yet. Add your first!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {view === 'profile' && (
            <ProfileEditor profile={profile} onSave={onUpdateProfile} />
          )}

          {/* DESIGN (Theme + Font + Shapes) */}
          {view === 'theme' && (
            <ThemeSelector
              currentTheme={profile.theme}
              currentFont={profile.font_family || 'inter'}
              currentCardRadius={profile.card_radius || 'pill'}
              currentAvatarShape={profile.avatar_shape || 'circle'}
              currentBgOverlay={profile.bg_overlay || 'none'}
              onThemeChange={(id) => onUpdateProfile({ theme: id })}
              onFontChange={(id) => onUpdateProfile({ font_family: id })}
              onCardRadiusChange={(id) => onUpdateProfile({ card_radius: id })}
              onAvatarShapeChange={(id) => onUpdateProfile({ avatar_shape: id })}
              onBgOverlayChange={(id) => onUpdateProfile({ bg_overlay: id })}
            />
          )}

          {/* ── STATS ── */}
          {view === 'design' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-3 border border-white/8">
                  <p className="text-white/40 text-xs mb-1">Total Links</p>
                  <p className="text-white text-2xl font-bold">{links.length}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/8">
                  <p className="text-white/40 text-xs mb-1">Total Clicks</p>
                  <p className="text-white text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                </div>
              </div>

              {topLink && topLink.click_count > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/8">
                  <p className="text-white/40 text-xs mb-2">Top Link</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${topLink.color_from}, ${topLink.color_to})` }} />
                    <div>
                      <p className="text-white text-sm font-semibold">{topLink.title}</p>
                      <p className="text-white/40 text-xs">{topLink.click_count} clicks</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <p className="text-xs text-white/40 font-medium uppercase tracking-wide mb-2">All Links</p>
                {[...links].sort((a, b) => b.click_count - a.click_count).map((link) => (
                  <div key={link.id} className="flex items-center gap-2 py-1.5">
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${link.color_from}, ${link.color_to})` }} />
                    <p className="flex-1 text-white/70 text-xs truncate">{link.title}</p>
                    <p className="text-white/50 text-xs font-medium">{link.click_count}</p>
                    <div
                      className="h-1.5 rounded-full min-w-[4px]"
                      style={{
                        width: `${totalClicks > 0 ? (link.click_count / totalClicks) * 80 : 4}px`,
                        background: `linear-gradient(to right, ${link.color_from}, ${link.color_to})`,
                      }}
                    />
                  </div>
                ))}
                {links.every((l) => l.click_count === 0) && (
                  <p className="text-white/25 text-xs text-center py-4">No clicks yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
