import React from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Pressable,
  Button,
  ButtonText,
} from '@/components/ui';
import { Image, Alert } from 'react-native';
import { Tables } from '@/lib/db/database.types';
import { Edit, Trash } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { router } from 'expo-router';
import { useDeleteWishlistItem } from '@/hooks/wishlists';

interface WishlistItemCardProps {
  item: Tables<'wishlist_items'>;
  wishlistId: number;
}

export default function WishlistItemCard({
  item,
  wishlistId,
}: WishlistItemCardProps) {
  const { t } = useTranslation();
  const { mutate: deleteItem } = useDeleteWishlistItem(wishlistId);

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
          onPress: () => deleteItem(item.id),
        },
      ],
    );
  };

  return (
    <Pressable
      onPress={() => router.push(`/wishlist/${wishlistId}/item/${item.id}`)}
      className="bg-background rounded-lg border border-gray-100 p-4">
      <HStack space="md" className="mb-2">
        {item.photo && (
          <Box className="h-20 w-20 overflow-hidden rounded-md">
            <Image
              source={{ uri: item.photo }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </Box>
        )}
        <VStack space="xs" className="flex-1">
          <Heading size="sm">{item.name}</Heading>
          {item.description && (
            <Text className="text-gray-600" numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <Text className="font-medium text-primary-600">
            {formatCurrency(Number(item.cost))}
          </Text>
        </VStack>
      </HStack>

      <HStack className="justify-end" space="sm">
        <Button
          variant="outline"
          size="xs"
          onPress={() =>
            router.push(`/wishlist/${wishlistId}/item/${item.id}/edit`)
          }>
          <ButtonText>
            <Edit size={16} />
          </ButtonText>
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="border-error-500 bg-error-50"
          onPress={handleDelete}>
          <ButtonText>
            <Trash size={16} color="#E53935" />
          </ButtonText>
        </Button>
      </HStack>
    </Pressable>
  );
}
