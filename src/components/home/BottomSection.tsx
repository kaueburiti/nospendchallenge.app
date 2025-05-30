import React, { useMemo } from 'react';
import { Box, Heading } from '../ui';
import { type SelectOption } from '@/types/shared';
import ScrollNavigator from '../ScrollNavigator';
import CardList from '../CardList';
import { Category, type Product } from '@/lib/db/models/Product';
import { i18n } from '@/i18n';

const BottomSection = ({ items, sectionTitle }: { items: Product[], sectionTitle: string }) => {
  const [activeTab, setActiveTab] = React.useState<Category>(
    Category.Development,
  );

  const options = useMemo<SelectOption[]>(() => {
    return Object.values(Category).map(category => ({
      label: i18n.t(`category.${category.toLowerCase().split(" ").join("_")}`),
      value: category,
    }));
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Category);
  };

  const categoryItems = items.filter(item =>
    item.categories.includes(activeTab),
  );

  return (
    <Box className="flex-1 flex flex-col pb-8 px-4 md:px-0">
      <Heading size="xl">{sectionTitle}</Heading>
      <ScrollNavigator
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        options={options}
      />
      <CardList activeTab={activeTab} products={categoryItems} />
    </Box>
  );
};
export default BottomSection;
