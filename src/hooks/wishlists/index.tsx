import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createWishlist,
  deleteWishlist,
  getUserWishlists,
  getWishlist,
  updateWishlist,
} from '@/lib/db/repository/wishlist';
import { useShowNotification } from '../notifications';
import { router } from 'expo-router';
import { type Tables } from '@/lib/db/database.types';
import { supabase } from '@/lib/supabase';

// Wishlist hooks
export const useCreateWishlist = () => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: createWishlist,
    onSuccess: async wishlist => {
      triggerToast({
        title: 'Success!',
        description: 'Your wishlist has been created successfully',
        action: 'success',
      });

      router.push(`/(protected)/wishlist/${wishlist.id}`);
      void queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
    onError: error => {
      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.error('Wishlist creation failed', error);
    },
  });
};

export const useUpdateWishlist = () => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: updateWishlist,
    onSuccess: wishlist => {
      triggerToast({
        title: 'Success!',
        description: 'Your wishlist has been updated successfully',
        action: 'success',
      });

      void queryClient.invalidateQueries({
        queryKey: ['wishlists', wishlist.id],
      });
      void queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
    onError: error => {
      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.error('Wishlist update failed', error);
    },
  });
};

export const useDeleteWishlist = () => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: deleteWishlist,
    onSuccess: () => {
      triggerToast({
        title: 'Success!',
        description: 'Your wishlist has been deleted successfully',
        action: 'success',
      });

      router.push('/(protected)/(tabs)/wishlists');
      void queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
    onError: error => {
      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.error('Wishlist deletion failed', error);
    },
  });
};

export const useGetWishlists = () => {
  return useQuery({
    queryKey: ['wishlists'],
    queryFn: getUserWishlists,
  });
};

export const useGetWishlist = (id: string) => {
  return useQuery({
    queryKey: ['wishlists', id],
    queryFn: () => getWishlist(Number(id)),
    enabled: !!id,
  });
};

// Wishlist Item hooks
export const useCreateWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      item: Omit<Tables<'wishlist_items'>, 'id' | 'created_at' | 'updated_at'>,
    ) => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert(item)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wishlistItems'] });
    },
  });
};

export const useUpdateWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      item,
    }: {
      id: number;
      item: Partial<Tables<'wishlist_items'>>;
    }) => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['wishlistItems'] });
      void queryClient.invalidateQueries({
        queryKey: ['wishlistItem', variables.id],
      });
    },
  });
};

export const useDeleteWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wishlistItems'] });
    },
  });
};

export const useGetWishlistItems = () => {
  return useQuery({
    queryKey: ['wishlistItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as Tables<'wishlist_items'>[];
    },
  });
};

export const useGetWishlistItem = (id: number) => {
  return useQuery({
    queryKey: ['wishlistItem', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return data as Tables<'wishlist_items'>;
    },
    enabled: !!id,
  });
};
