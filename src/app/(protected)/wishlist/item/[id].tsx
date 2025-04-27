import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  ButtonText,
} from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { ScrollView } from '@/components/ui/scroll-view';
import { useTranslation } from '@/hooks/useTranslation';
import { Section } from '@/components/Section';
import { useLocalSearchParams, router } from 'expo-router';
import BackButton from '@/components/navigation/back-button';
import { useGetWishlistItem } from '@/hooks/wishlists';
import { Image, ActivityIndicator, Alert } from 'react-native';
import { Edit, Trash } from 'lucide-react-native';
import { useDeleteWishlistItem } from '@/hooks/wishlists';

export default function WishlistItemDetailPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading } = useGetWishlistItem(Number(id));
  const { mutate: deleteItem } = useDeleteWishlistItem();

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
          onPress: () => deleteItem(Number(id)),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box className="flex h-full items-center justify-center">
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
          <Section>
            <Text className="mt-4 text-center text-gray-600">
              {t('wishlists.item_not_found')}
            </Text>
          </Section>
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
              <VStack space="md">
                {item.photo && (
                  <Box className="h-40 w-full overflow-hidden rounded-lg">
                    <Image
                      source={{ uri: item.photo }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </Box>
                )}

                <Heading size="2xl">{item.name}</Heading>

                <Text className="font-medium text-primary-600">
                  {formatCurrency(Number(item.cost))}
                </Text>

                {item.description && (
                  <Text className="text-gray-600">{item.description}</Text>
                )}
              </VStack>

              <HStack space="md" className="mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() =>
                    router.push(`/(protected)/wishlist/item/${id}/edit`)
                  }>
                  <Edit size={20} />
                  <ButtonText className="ml-2">
                    {t('wishlists.form.edit_button')}
                  </ButtonText>
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-error-500 bg-error-50"
                  onPress={handleDelete}>
                  <Trash size={20} color="#E53935" />
                  <ButtonText className="ml-2 text-error-600">
                    {t('wishlists.form.delete_button')}
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Section>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
