import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  ButtonText,
} from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Section } from '@/components/Section';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useGetWishlistItems } from '@/hooks/wishlists';
import { ActivityIndicator } from 'react-native';
import WishlistItemCard from '@/components/wishlists/item-card';
import EmptyWishlists from '@/components/wishlists/empty-state';

export default function WishlistsPage() {
  const { t } = useTranslation();
  const { data: items, isLoading } = useGetWishlistItems();

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl">
            <Box className="mt-8 flex flex-row items-center justify-between">
              <Heading size="3xl">{t('wishlists.title')}</Heading>
              <Button
                onPress={() => router.push('/(protected)/wishlist/item/create')}
                size="sm">
                <Plus size={20} color="white" />
                <ButtonText className="ml-1">
                  {t('wishlists.add_item')}
                </ButtonText>
              </Button>
            </Box>

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
                  />
                ))}
              </VStack>
            ) : (
              <EmptyWishlists />
            )}
          </VStack>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
