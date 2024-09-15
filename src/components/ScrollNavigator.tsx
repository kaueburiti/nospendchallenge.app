import { type SelectOption } from '@/types/shared';
import { Pressable, ScrollView } from 'react-native';
import { Box, HStack, Text } from './ui';

interface ScrollNavigatorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  options: SelectOption[];
}

const ScrollNavigator = ({
  activeTab,
  setActiveTab,
  options,
}: ScrollNavigatorProps) => {
  return (
    <Box className="sticky mt-4 top-0 border-b border-outline-50 md:border-b-0 md:border-transparent">
      <Box>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="lg" className="mx-0.5 xl:gap-5 2xl:gap-6">
            {options.map(option => {
              return (
                <Pressable
                  key={option.value}
                  className={`my-0.5 py-1 ${
                    activeTab === option.value ? 'border-b-[3px]' : 'border-b-0'
                  } border-outline-900 hover:border-b-[3px] ${
                    activeTab === option.value
                      ? 'hover:border-outline-900'
                      : 'hover:border-outline-200'
                  } `}
                  onPress={() => setActiveTab(option.value)}>
                  <Text
                    size="sm"
                    className={`${
                      activeTab === option.value
                        ? 'text-typography-900'
                        : 'text-typography-600'
                    } font-medium`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default ScrollNavigator;
