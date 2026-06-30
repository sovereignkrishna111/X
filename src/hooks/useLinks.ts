import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Link } from '../types';

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = useCallback(async () => {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) setLinks(data as Link[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLinks();

    const channel = supabase
      .channel('links-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'links' }, () => {
        fetchLinks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLinks]);

  const addLink = useCallback(async (link: Partial<Link>) => {
    const maxOrder = links.reduce((max, l) => Math.max(max, l.sort_order), 0);
    const { error } = await supabase.from('links').insert({
      ...link,
      sort_order: maxOrder + 1,
    });
    if (!error) fetchLinks();
    return error;
  }, [links, fetchLinks]);

  const updateLink = useCallback(async (id: string, updates: Partial<Link>) => {
    const { error } = await supabase
      .from('links')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) fetchLinks();
    return error;
  }, [fetchLinks]);

  const deleteLink = useCallback(async (id: string) => {
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) fetchLinks();
    return error;
  }, [fetchLinks]);

  const reorderLinks = useCallback(async (reordered: Link[]) => {
    setLinks(reordered);
    await Promise.all(
      reordered.map((link, index) =>
        supabase.from('links').update({ sort_order: index + 1 }).eq('id', link.id)
      )
    );
  }, []);

  const incrementClick = useCallback(async (id: string) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;
    await supabase
      .from('links')
      .update({ click_count: link.click_count + 1 })
      .eq('id', id);
  }, [links]);

  return { links, loading, addLink, updateLink, deleteLink, reorderLinks, incrementClick };
}
