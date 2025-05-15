import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import wishlistAnimation from '@/assets/animations/wishlist.json';
import EmptyList from '@/components/ui/list/empty';

interface EmptyWishlistsProps {
  onClick: () => void;
}

export default function EmptyWishlists({ onClick }: EmptyWishlistsProps) {
  const { t } = useTranslation();

  return (
    <EmptyList
      onClick={onClick}
      title={t('wishlists.no_items')}
      description={t('wishlists.no_items_description')}
      buttonText={t('wishlists.add_item')}
      animationSource={wishlistAnimation}
    />
  );
}
