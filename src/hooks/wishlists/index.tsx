import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createWishlist,
  deleteWishlist,
  getUserWishlists,
  getWishlist,
  updateWishlist,
  createWishlistItem,
  deleteWishlistItem,
  getWishlistItem,
  getWishlistItems,
  updateWishlistItem,
} from '@/lib/db/repository/wishlist';
import { useShowNotification } from '../notifications';
import { router } from 'expo-router';

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
export const useCreateWishlistItem = (wishlistId: number) => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: createWishlistItem,
    onSuccess: () => {
      triggerToast({
        title: 'Success!',
        description: 'Item has been added to your wishlist',
        action: 'success',
      });

      void queryClient.invalidateQueries({
        queryKey: ['wishlist-items', wishlistId],
      });
    },
    onError: error => {
      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.error('Wishlist item creation failed', error);
    },
  });
};

export const useUpdateWishlistItem = (wishlistId: number) => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: updateWishlistItem,
    onSuccess: item => {
      triggerToast({
        title: 'Success!',
        description: 'Item has been updated successfully',
        action: 'success',
      });

      void queryClient.invalidateQueries({
        queryKey: ['wishlist-items', wishlistId],
      });
      void queryClient.invalidateQueries({
        queryKey: ['wishlist-item', item.id],
      });
    },
    onError: error => {
      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.error('Wishlist item update failed', error);
    },
  });
};

export const useDeleteWishlistItem = (wishlistId: number) => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: deleteWishlistItem,
    onSuccess: () => {
      triggerToast({
        title: 'Success!',
        description: 'Item has been removed from your wishlist',
        action: 'success',
      });

      void queryClient.invalidateQueries({
        queryKey: ['wishlist-items', wishlistId],
      });
    },
    onError: error => {
      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.error('Wishlist item deletion failed', error);
    },
  });
};

export const useGetWishlistItems = (wishlistId: number) => {
  return useQuery({
    queryKey: ['wishlist-items', wishlistId],
    queryFn: () => getWishlistItems(wishlistId),
    enabled: !!wishlistId,
  });
};

export const useGetWishlistItem = (id: number) => {
  return useQuery({
    queryKey: ['wishlist-item', id],
    queryFn: () => getWishlistItem(id),
    enabled: !!id,
  });
};
