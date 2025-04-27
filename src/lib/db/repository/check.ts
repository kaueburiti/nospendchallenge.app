import { supabase } from '@/lib/supabase';
import type { Tables } from '../database.types';
import { CheckItem } from '@/components/home/challenges/check/item-form';

export type CheckStatus = 'success' | 'failure';

export const createCheck = async (
  check: Omit<
    Tables<'checks'>,
    'id' | 'created_at' | 'updated_at' | 'user_id'
  > & {
    status: CheckStatus;
    spent_amount?: number;
    items?: CheckItem[];
  },
) => {
  const { data: user } = await supabase.auth.getUser();
  const userId = String(user.user?.id);
  const formattedDate = new Date(check.date).toISOString().split('T')[0];

  // Extract items before inserting the check
  const items = check.items ?? [];
  const { items: _, ...checkData } = check;

  // Begin a transaction by starting with the main check
  const { data, error } = await supabase
    .from('checks')
    .insert({
      ...checkData,
      user_id: userId,
      date: formattedDate,
    })
    .select();

  if (error) {
    console.error('Error details:', error);
    throw error;
  }

  // If we have items and the check created successfully, insert the items
  if (items.length > 0 && data && data.length > 0) {
    const checkId = data[0].id;

    // Prepare items with check_id
    const itemsWithCheckId = items.map(item => ({
      check_id: checkId,
      title: item.title,
      price: item.price,
    }));

    // Insert all items
    const { error: itemsError } = await supabase
      .from('check_items')
      .insert(itemsWithCheckId);

    if (itemsError) {
      console.error('Error creating check items:', itemsError);
      // Note: We don't throw here to avoid rolling back the check
      // The trigger will ensure the spent_amount is 0 if no items
    }
  }

  return data;
};

export const getUserChecksByChallenge = async (challengeId: number) => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('checks')
    .select()
    .eq('challenge_id', challengeId)
    .eq('user_id', String(user.user?.id));

  if (error) throw error;

  return data;
};

type CheckWithProfile = Tables<'checks'> & {
  profiles: {
    id: string;
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
  } | null;
};

export const getAllChecksByChallenge = async (
  challengeId: number,
): Promise<CheckWithProfile[]> => {
  const { data, error } = await supabase
    .from('checks')
    .select(
      `
      *,
      profiles:user_id (
        id,
        display_name,
        first_name,
        last_name,
        avatar_url,
        created_at,
        updated_at
      )
    `,
    )
    .eq('challenge_id', challengeId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching checks with profiles:', error);
    throw error;
  }

  return data;
};

// Delete a check
export const deleteCheck = async (checkId: number) => {
  const { error } = await supabase.from('checks').delete().eq('id', checkId);

  if (error) throw error;

  return true;
};

// Get the total savings for a challenge
export const getChallengeTotalSavings = async (challengeId: number) => {
  const { data, error } = await supabase.rpc('get_challenge_total_savings', {
    challenge_id_param: challengeId,
  });

  if (error) {
    console.error('Error getting total savings:', error);
    throw error;
  }

  return data;
};

// Get the total spent amount for a challenge
export const getChallengeTotalSpent = async (challengeId: number) => {
  const { data, error } = await supabase.rpc('get_challenge_total_spent', {
    challenge_id_param: challengeId,
  });

  if (error) {
    console.error('Error getting total spent amount:', error);
    throw error;
  }

  return typeof data === 'number' ? data : 0;
};

// Get savings history by challenge (for chart visualization)
export const getChallengeSavingsHistory = async (challengeId: number) => {
  const { data, error } = await supabase
    .from('checks')
    .select('date, saved_amount, spent_amount, status')
    .eq('challenge_id', challengeId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching savings history:', error);
    throw error;
  }

  return data;
};

// Get all items for a specific check
export const getCheckItems = async (checkId: number) => {
  const { data, error } = await supabase
    .from('check_items')
    .select('*')
    .eq('check_id', checkId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching check items:', error);
    throw error;
  }

  return data;
};
