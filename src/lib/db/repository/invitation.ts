import { supabase } from '@/lib/supabase';
import type { Tables } from '../database.types';

export type ChallengeInvitation = Tables<'challenge_invitations'>;
export type ChallengeParticipant = Tables<'challenge_participants'>;

export const inviteToChallengeByEmail = async (
  challengeId: number,
  email: string,
) => {
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('challenge_invitations')
    .insert({
      challenge_id: challengeId,
      inviter_id: user.user!.id,
      invitee_email: email.toLowerCase().trim(),
    })
    .select();

  if (error) {
    if (error.code === '23505') {
      // Unique violation
      throw new Error('This person has already been invited to this challenge');
    }
    throw error;
  }

  return data;
};

export const getInvitationsByChallenge = async (
  challengeId: number,
  status: 'pending' | 'accepted' | 'declined' = 'pending',
) => {
  const { data, error } = await supabase
    .from('challenge_invitations')
    .select(
      `
      id,
      challenge_id,
      inviter_id,
      invitee_email,
      status,
      created_at,
      updated_at
    `,
    )
    .eq('challenge_id', challengeId)
    .eq('status', status);

  if (error) throw error;
  return data;
};

export const getUserInvitations = async () => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('challenge_invitations')
    .select(
      `
      id,
      challenge_id,
      inviter_id,
      invitee_email,
      status,
      created_at,
      updated_at,
      challenges:challenge_id (
        id,
        title,
        description,
        start_date,
        end_date,
        cover,
        owner_id
      )
    `,
    )
    .eq('invitee_email', user.user!.email)
    .eq('status', 'pending');

  if (error) throw error;
  return data;
};

export const respondToInvitation = async (
  invitationId: number,
  status: 'accepted' | 'declined',
) => {
  const { data, error } = await supabase
    .from('challenge_invitations')
    .update({ status })
    .eq('id', invitationId)
    .select();

  if (error) throw error;

  // If accepted, add user as participant
  if (status === 'accepted') {
    const { data: user } = await supabase.auth.getUser();
    const invitation = data[0];

    await supabase.from('challenge_participants').insert({
      challenge_id: invitation.challenge_id,
      user_id: user.user!.id,
    });
  }

  return data;
};

export const getChallengeParticipants = async (challengeId: number) => {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select(
      `
      id,
      challenge_id,
      user_id,
      joined_at,
      users:user_id (
        id,
        display_name,
        avatar_url
      )
    `,
    )
    .eq('challenge_id', challengeId);

  if (error) throw error;
  return data;
};
