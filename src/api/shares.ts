import { supabase } from '@/lib/supabase';
import type { Share } from '@/lib/types';

export async function listShares(promptId: string): Promise<Share[]> {
  const { data, error } = await supabase
    .from('shares')
    .select('*')
    .eq('prompt_id', promptId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createShare(
  promptId: string,
  targetUser: string,
  permission: 'view' | 'edit'
): Promise<Share> {
  const { data, error } = await supabase
    .from('shares')
    .insert({
      prompt_id: promptId,
      target_user: targetUser,
      permission,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateShare(
  id: string,
  permission: 'view' | 'edit'
): Promise<Share> {
  const { data, error } = await supabase
    .from('shares')
    .update({ permission })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteShare(id: string): Promise<void> {
  const { error } = await supabase.from('shares').delete().eq('id', id);
  if (error) throw error;
}
