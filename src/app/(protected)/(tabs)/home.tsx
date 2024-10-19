import React from 'react';
import Banner from '../../../components/Banner';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui';
import { Text } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import WebBrowser from 'expo-web-browser';
import { Link, LinkText } from '@/components/ui';
import BottomSection from '../../../components/home/BottomSection';
import TopSection from '../../../components/home/TopSection';
import config from '../../../../config';
import { useProducts } from '@/hooks/product';
import { i18n } from '@/i18n';

const Explorepage = () => {
  const { data: products } = useProducts();

  return (
    <SafeAreaView >
      <Banner>
        <Text className="text-content-0 text-white dark:text-black" size="sm">
          {i18n.t("home.banner_text")} 
        </Text>
        <Link onPress={() => WebBrowser.openBrowserAsync(config.profilePage.contactPage)}>
          <LinkText
            className="text-content-50 font-semibold text-white dark:text-black"
            size="sm">
           {i18n.t("home.banner_link_text")} 
          </LinkText>
        </Link>
      </Banner>
      <ScrollView className="flex-1 h-[1px]">
        <Box className={'flex flex-col gap-4'}>
          <TopSection items={products ?? []} sectionTitle={i18n.t("home.top_section_title")} />
          <BottomSection items={products ?? []} sectionTitle={i18n.t("home.bottom_section_title")} />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explorepage;
