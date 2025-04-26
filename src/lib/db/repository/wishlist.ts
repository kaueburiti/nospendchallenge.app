import { supabase } from '@/lib/supabase';
import type { Tables } from '../database.types';

// Wishlist operations
export const getUserWishlists = async () => {
  const { data: user } = await supabase.auth.getUser();
  const userId = String(user.user?.id);

  const { data, error } = await supabase
    .from('wishlists')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getWishlist = async (id: number) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createWishlist = async (
  wishlist: Omit<Tables<'wishlists'>, 'id' | 'created_at' | 'updated_at'>,
) => {
  const { data, error } = await supabase
    .from('wishlists')
    .insert(wishlist)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateWishlist = async (
  wishlist: Partial<Tables<'wishlists'>> & { id: number },
) => {
  const { data, error } = await supabase
    .from('wishlists')
    .update(wishlist)
    .eq('id', wishlist.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteWishlist = async (id: number) => {
  const { error } = await supabase.from('wishlists').delete().eq('id', id);

  if (error) throw error;
  return true;
};

// Wishlist Item operations
export const getWishlistItems = async (wishlistId: number) => {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select()
    .eq('wishlist_id', wishlistId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getWishlistItem = async (id: number) => {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createWishlistItem = async (
  item: Omit<Tables<'wishlist_items'>, 'id' | 'created_at' | 'updated_at'>,
) => {
  const { data, error } = await supabase
    .from('wishlist_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateWishlistItem = async (
  item: Partial<Tables<'wishlist_items'>> & { id: number },
) => {
  const { data, error } = await supabase
    .from('wishlist_items')
    .update(item)
    .eq('id', item.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteWishlistItem = async (id: number) => {
  const { error } = await supabase.from('wishlist_items').delete().eq('id', id);

  if (error) throw error;
  return true;
};
