import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Text,
  VStack,
} from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { ScrollView } from '@/components/ui/scroll-view';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalSearchParams, router } from 'expo-router';
import {
  useGetWishlist,
  useGetWishlistItems,
  useDeleteWishlist,
} from '@/hooks/wishlists';
import BackButton from '@/components/navigation/back-button';
import { Edit, Plus, Trash } from 'lucide-react-native';
import { Section } from '@/components/Section';
import WishlistItemCard from '@/components/wishlists/item-card';
import EmptyWishlistItems from '@/components/wishlists/empty-items';

export default function WishlistDetailPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: wishlist, isLoading: isLoadingWishlist } = useGetWishlist(id);
  const { data: items, isLoading: isLoadingItems } = useGetWishlistItems(
    Number(id),
  );
  const { mutate: deleteWishlist, isPending: isDeleting } = useDeleteWishlist();

  // Calculate total cost
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

  const handleDelete = () => {
    Alert.alert(t('wishlists.delete_wishlist'), t('wishlists.delete_confirm'), [
      {
        text: t('wishlists.form.cancel_button'),
        style: 'cancel',
      },
      {
        text: t('wishlists.form.delete_button'),
        style: 'destructive',
        onPress: () => {
          if (wishlist) {
            deleteWishlist(wishlist.id);
          }
        },
      },
    ]);
  };

  if (isLoadingWishlist) {
    return (
      <SafeAreaView>
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </Box>
      </SafeAreaView>
    );
  }

  if (!wishlist) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <BackButton />
          <Box className="mt-8 items-center">
            <Heading size="xl">Wishlist not found</Heading>
          </Box>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Box className="p-4">
        <BackButton />
        <Section>
          <VStack space="xl" className="mt-4">
            <HStack className="items-center justify-between">
              <Heading size="2xl">{wishlist.title}</Heading>
              <HStack space="sm">
                <Button
                  variant="outline"
                  onPress={() => router.push(`/wishlist/${wishlist.id}/edit`)}
                  size="sm">
                  <Edit size={18} />
                </Button>
                <Button
                  variant="outline"
                  onPress={handleDelete}
                  isDisabled={isDeleting}
                  size="sm"
                  className="border-error-500 bg-error-50">
                  <Trash size={18} color="#E53935" />
                </Button>
              </HStack>
            </HStack>

            {wishlist.description && (
              <Text className="text-gray-600">{wishlist.description}</Text>
            )}

            <HStack className="mt-4 items-center justify-between">
              <Heading size="xl">{t('wishlists.items')}</Heading>
              <Button
                size="sm"
                onPress={() =>
                  router.push(`/wishlist/${wishlist.id}/item/create`)
                }>
                <ButtonText>
                  <Plus size={18} color="white" />
                  <Text className="ml-1 text-white">
                    {t('wishlists.add_item')}
                  </Text>
                </ButtonText>
              </Button>
            </HStack>

            {isLoadingItems ? (
              <Box className="items-center">
                <ActivityIndicator />
              </Box>
            ) : items && items.length > 0 ? (
              <ScrollView>
                <VStack space="md" className="mb-6 mt-2">
                  {items.map(item => (
                    <WishlistItemCard
                      key={item.id}
                      item={item}
                      wishlistId={Number(id)}
                    />
                  ))}
                </VStack>
                <Box className="bg-background mt-4 rounded-lg border border-gray-100 p-4">
                  <HStack className="justify-between">
                    <Text className="font-semibold">
                      {t('wishlists.total_cost')}
                    </Text>
                    <Text className="text-xl font-bold">
                      {formatCurrency(totalCost)}
                    </Text>
                  </HStack>
                </Box>
              </ScrollView>
            ) : (
              <EmptyWishlistItems />
            )}
          </VStack>
        </Section>
      </Box>
    </SafeAreaView>
  );
}
