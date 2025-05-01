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
import { useDeleteWishlistItem } from '@/hooks/wishlists';

interface WishlistItemCardProps {
  item: Tables<'wishlist_items'>;
  onEdit?: () => void;
}

export default function WishlistItemCard({
  item,
  onEdit,
}: WishlistItemCardProps) {
  const { t } = useTranslation();
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
          onPress: () => deleteItem(item.id),
        },
      ],
    );
  };

  return (
    <HStack className="bg-background items-center rounded-lg border border-gray-200 p-4">
      <HStack space="md" className="mb-2 flex-1">
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
          <Heading size="md">
            {item.name} ({formatCurrency(Number(item.cost))})
          </Heading>
          {item.description && (
            <Text className="text-gray-600" numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </VStack>
      </HStack>
      <HStack className="justify-end" space="lg">
        <Button variant="link" size="lg" onPress={onEdit}>
          <ButtonText>
            <Edit size={24} color="#171717" />
          </ButtonText>
        </Button>
        <Button variant="link" size="lg" onPress={handleDelete}>
          <ButtonText>
            <Trash size={24} color="#E53935" />
          </ButtonText>
        </Button>
      </HStack>
    </HStack>
  );
}
