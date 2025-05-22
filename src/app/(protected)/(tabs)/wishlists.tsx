import React, { useState } from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, Heading, VStack } from '@/components/ui';
import { Section } from '@/components/Section';
import { useTranslation } from '@/hooks/useTranslation';
import { useGetWishlistItems } from '@/hooks/wishlists';
import { ActivityIndicator, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import EmptyWishlists from '@/components/wishlists/empty-state';
import { EditWishlistItemDrawer } from '@/components/wishlist/EditWishlistItemDrawer';
import { ListHeader } from '@/components/ui/list/header';
import PageSafeAreaView from '@/components/layout/page-safe-area-view';
import { type Tables } from '@/lib/db/database.types';
import { Grid, GridItem } from '@/components/ui/grid';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';

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
    <PageSafeAreaView>
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
              <WishlistGrid items={items} onPressItem={handleEditItem} />
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
    </PageSafeAreaView>
  );
}

function WishlistGrid({
  items,
  onPressItem,
}: {
  items: Tables<'wishlist_items'>[];
  onPressItem: (itemId: number) => void;
}) {
  return (
    <Grid className="gap-4" _extra={{ className: 'grid-cols-12' }}>
      {items.map(item => (
        <GridItem
          key={item.id}
          className="rounded-md text-center"
          _extra={{
            className: 'col-span-6',
          }}>
          <WishlistItemCard item={item} onPress={onPressItem} />
        </GridItem>
      ))}
    </Grid>
  );
}

function WishlistItemCard({
  item,
  onPress,
}: {
  item: Tables<'wishlist_items'>;
  onPress: (itemId: number) => void;
}) {
  return (
    <Pressable onPress={() => onPress(item.id)}>
      <Card className="shadow-xs relative overflow-hidden rounded-lg border border-gray-200 p-0">
        <Image
          source={{
            uri: item.photo ?? '',
          }}
          className="h-[100px] w-full bg-gray-200"
          alt="image"
        />
        <Box className="absolute right-0 top-[76px] z-10 rounded-tl-md border-l border-t border-gray-200 bg-white px-3 py-1">
          <Text className="text-sm font-bold text-success-500">
            ${item.cost}
          </Text>
        </Box>

        <VStack className="border-t border-gray-200 p-4">
          <Heading size="md">{item.name}</Heading>
          <Text className="mb-2 text-xs font-normal text-typography-500">
            {item.description}
          </Text>
        </VStack>
      </Card>
    </Pressable>
  );
}
