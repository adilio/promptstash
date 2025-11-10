import { supabase } from '@/lib/supabase';
import type { Folder } from '@/lib/types';

export async function listFolders(teamId: string): Promise<Folder[]> {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('team_id', teamId)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getFolder(id: string): Promise<Folder> {
  const { data, error } = await supabase.from('folders').select('*').eq('id', id).single();

  if (error) throw error;
  return data;
}

export async function createFolder(
  teamId: string,
  name: string,
  parentId?: string
): Promise<Folder> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('folders')
    .insert({
      team_id: teamId,
      name,
      parent_id: parentId || null,
      created_by: user.id,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateFolder(id: string, name: string): Promise<Folder> {
  const { data, error } = await supabase
    .from('folders')
    .update({ name })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFolder(id: string): Promise<void> {
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) throw error;
}

export async function moveFolder(id: string, parentId: string | null): Promise<Folder> {
  const { data, error } = await supabase
    .from('folders')
    .update({ parent_id: parentId })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
