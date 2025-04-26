import React from 'react';
import { ActivityIndicator, Alert, Image } from 'react-native';
import { Box, Button, Heading, HStack, Text, VStack } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { ScrollView } from '@/components/ui/scroll-view';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalSearchParams, router } from 'expo-router';
import { useGetWishlistItem, useDeleteWishlistItem } from '@/hooks/wishlists';
import BackButton from '@/components/navigation/back-button';
import { Edit, Trash } from 'lucide-react-native';
import { Section } from '@/components/Section';

export default function WishlistItemDetailPage() {
  const { t } = useTranslation();
  const { id, itemId } = useLocalSearchParams<{ id: string; itemId: string }>();
  const { data: item, isLoading } = useGetWishlistItem(Number(itemId));
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteWishlistItem(
    Number(id),
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDelete = () => {
    Alert.alert(
      t('wishlists.delete_item'),
      t('wishlists.delete_item_confirm'),
      [
        {
          text: t('wishlists.form.cancel_button'),
          style: 'cancel',
        },
        {
          text: t('wishlists.form.delete_button'),
          style: 'destructive',
          onPress: () => {
            if (item) {
              deleteItem(item.id);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </Box>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <BackButton />
          <Box className="mt-8 items-center">
            <Heading size="xl">Item not found</Heading>
          </Box>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Box className="p-4">
          <BackButton />
          <Section>
            <VStack space="xl" className="mt-4">
              <HStack className="items-center justify-between">
                <Heading size="2xl">{item.name}</Heading>
                <HStack space="sm">
                  <Button
                    variant="outline"
                    onPress={() =>
                      router.push(`/wishlist/${id}/item/${itemId}/edit`)
                    }
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

              {item.photo && (
                <Box className="h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    source={{ uri: item.photo }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </Box>
              )}

              <Box className="bg-background rounded-lg border border-gray-100 p-4">
                <Heading size="lg">{formatCurrency(Number(item.cost))}</Heading>
              </Box>

              {item.description && (
                <Box>
                  <Heading size="lg" className="mb-2">
                    {t('wishlists.form.item_description.label')}
                  </Heading>
                  <Text className="text-gray-600">{item.description}</Text>
                </Box>
              )}
            </VStack>
          </Section>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
