import React from 'react';
import { Box, Heading, Text, HStack, Pressable } from '@/components/ui';
import { Tables } from '@/lib/db/database.types';
import { router } from 'expo-router';
import { ChevronRight, Gift } from 'lucide-react-native';
import { useGetWishlistItems } from '@/hooks/wishlists';
import { useTranslation } from '@/hooks/useTranslation';

interface WishlistCardProps {
  wishlist: Tables<'wishlists'>;
}

export default function WishlistCard({ wishlist }: WishlistCardProps) {
  const { t } = useTranslation();
  const { data: items } = useGetWishlistItems(wishlist.id);

  // Calculate total cost of all items
  const totalCost = React.useMemo(() => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + Number(item.cost), 0);
  }, [items]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Pressable
      onPress={() => router.push(`/(protected)/wishlist/${wishlist.id}`)}
      className="bg-background rounded-xl border border-gray-100 p-4 shadow-sm">
      <HStack space="md" className="mb-2 items-center">
        <Box className="rounded-full bg-primary-100 p-2">
          <Gift size={20} color="#5E7CE2" />
        </Box>
        <Heading size="md" className="flex-1">
          {wishlist.title}
        </Heading>
        <ChevronRight size={20} color="#777" />
      </HStack>

      {wishlist.description && (
        <Text className="mb-2 line-clamp-2 text-gray-600" numberOfLines={2}>
          {wishlist.description}
        </Text>
      )}

      <HStack className="mt-2 justify-between">
        <Text className="text-gray-500">
          {items?.length || 0} {t('wishlists.items')}
        </Text>
        {totalCost > 0 && (
          <Text className="font-medium">{formatCurrency(totalCost)}</Text>
        )}
      </HStack>
    </Pressable>
  );
}
