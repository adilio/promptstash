import { supabase } from '@/lib/supabase';
import type { Team, Membership } from '@/lib/types';

export async function listTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getTeam(id: string): Promise<Team> {
  const { data, error } = await supabase.from('teams').select('*').eq('id', id).single();

  if (error) throw error;
  return data;
}

export async function createTeam(name: string): Promise<Team> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      name,
      owner_id: user.id,
    })
    .select('*')
    .single();

  if (teamError) throw teamError;

  // Create owner membership
  const { error: membershipError } = await supabase.from('memberships').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'owner',
  });

  if (membershipError) throw membershipError;

  return team;
}

export async function updateTeam(id: string, name: string): Promise<Team> {
  const { data, error } = await supabase
    .from('teams')
    .update({ name })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await supabase.from('teams').delete().eq('id', id);
  if (error) throw error;
}

export async function listMemberships(teamId: string): Promise<Membership[]> {
  const { data, error } = await supabase
    .from('memberships')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function addMembership(
  teamId: string,
  userId: string,
  role: 'owner' | 'editor' | 'viewer'
): Promise<Membership> {
  const { data, error } = await supabase
    .from('memberships')
    .insert({
      team_id: teamId,
      user_id: userId,
      role,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateMembership(
  teamId: string,
  userId: string,
  role: 'owner' | 'editor' | 'viewer'
): Promise<Membership> {
  const { data, error } = await supabase
    .from('memberships')
    .update({ role })
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function removeMembership(teamId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('memberships')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId);

  if (error) throw error;
}
