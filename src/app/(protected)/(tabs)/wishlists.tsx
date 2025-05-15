import React, { useState } from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, VStack } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Section } from '@/components/Section';
import { useTranslation } from '@/hooks/useTranslation';
import { useGetWishlistItems } from '@/hooks/wishlists';
import { ActivityIndicator } from 'react-native';
import WishlistItemCard from '@/components/wishlists/item-card';
import EmptyWishlists from '@/components/wishlists/empty-state';
import { EditWishlistItemDrawer } from '@/components/wishlist/EditWishlistItemDrawer';
import { ListHeader } from '@/components/ui/list/header';

export default function WishlistsPage() {
  const { t } = useTranslation();
  const { data: items, isLoading } = useGetWishlistItems();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>();

  const handleAddItem = () => {
    setSelectedItemId(undefined);
    setIsDrawerOpen(true);
  };

  const handleEditItem = (itemId: number) => {
    setSelectedItemId(itemId);
    setIsDrawerOpen(true);
  };

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl">
            <ListHeader
              title={t('wishlists.title')}
              titleSize="3xl"
              onPress={handleAddItem}
              description={t('wishlists.description')}
            />

            {isLoading ? (
              <Box className="flex h-32 items-center justify-center">
                <ActivityIndicator size="large" />
              </Box>
            ) : items && items.length > 0 ? (
              <VStack space="md" className="mt-4">
                {items.map(item => (
                  <WishlistItemCard
                    key={item.id}
                    item={item}
                    wishlistId={null}
                    onEdit={() => handleEditItem(item.id)}
                  />
                ))}
              </VStack>
            ) : (
              <EmptyWishlists onClick={handleAddItem} />
            )}
          </VStack>
        </Section>
      </ScrollView>

      <EditWishlistItemDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        itemId={selectedItemId}
      />
    </SafeAreaView>
  );
}
