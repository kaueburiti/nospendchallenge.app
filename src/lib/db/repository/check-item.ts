import { supabase } from '@/lib/supabase';
import type { Tables } from '../database.types';

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

// Create a single check item
export const createCheckItem = async (item: {
  check_id: number;
  title: string;
  price: number;
}) => {
  const { data, error } = await supabase
    .from('check_items')
    .insert(item)
    .select();

  if (error) {
    console.error('Error creating check item:', error);
    throw error;
  }

  return data;
};

// Create multiple check items in one batch
export const createCheckItems = async (
  items: {
    check_id: number;
    title: string;
    price: number;
  }[],
) => {
  if (items.length === 0) return [];

  const { data, error } = await supabase
    .from('check_items')
    .insert(items)
    .select();

  if (error) {
    console.error('Error creating check items in batch:', error);
    throw error;
  }

  return data;
};

// Delete a check item
export const deleteCheckItem = async (itemId: number) => {
  const { error } = await supabase
    .from('check_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting check item:', error);
    throw error;
  }

  return true;
};
