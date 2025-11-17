import { supabase } from '@/lib/supabase';
import type { PromptVersion } from '@/lib/types';

export async function listPromptVersions(promptId: string): Promise<PromptVersion[]> {
  const { data, error } = await supabase
    .from('prompt_versions')
    .select('*')
    .eq('prompt_id', promptId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPromptVersion(versionId: string): Promise<PromptVersion> {
  const { data, error } = await supabase
    .from('prompt_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (error) throw error;
  return data;
}

export async function createPromptVersion(input: {
  prompt_id: string;
  title: string;
  body_md: string;
  change_note?: string;
}): Promise<PromptVersion> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('prompt_versions')
    .insert({
      prompt_id: input.prompt_id,
      created_by: user.id,
      title: input.title,
      body_md: input.body_md,
      change_note: input.change_note || null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function restorePromptVersion(
  promptId: string,
  versionId: string
): Promise<void> {
  // Get the version content
  const version = await getPromptVersion(versionId);

  // Update the prompt with the version content
  const { error } = await supabase
    .from('prompts')
    .update({
      title: version.title,
      body_md: version.body_md,
    })
    .eq('id', promptId);

  if (error) throw error;
}
