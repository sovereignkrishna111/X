import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

const defaultProfile: Profile = {
  id: '',
  name: 'Your Name',
  bio: 'Creator • Developer • Dreamer',
  avatar_url: '',
  background_type: 'gradient',
  background_value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  bg_overlay: 'none',
  theme: 'dark',
  accent_color: '#818cf8',
  bio_color: '#ffffff',
  social_links_color: '#ffffff',
  social_links: {},
  social_icon_images: {},
  show_analytics: false,
  font_family: 'inter',
  card_style: 'glass',
  card_radius: 'pill',
  avatar_shape: 'circle',
  animation_style: 'smooth',
  updated_at: '',
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .maybeSingle();

    if (!error && data) setProfile(data as Profile);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();

    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, (payload) => {
        if (payload.new) setProfile(payload.new as Profile);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!profile.id) return;
    const { data, error } = await supabase
      .from('profile')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
      .select()
      .maybeSingle();
    if (!error && data) setProfile(data as Profile);
    return error;
  }, [profile.id]);

  return { profile, loading, updateProfile, refetch: fetchProfile };
}
