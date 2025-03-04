import React from 'react';
import { ScrollView } from 'react-native';
import { Box, Heading, VStack } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { i18n } from '@/i18n';
import { Section } from '@/components/Section';
import { PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui';
import ChallengeList from '@/components/home/challenges';

const ChallengesPage = () => {
  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl" className="px-2 py-8">
            <Box className="flex flex-1 flex-col overflow-auto">
              <Box className="mb-6 flex flex-row items-center justify-between">
                <Heading size="3xl">Challenges</Heading>
                <Button
                  onPress={() => router.push('/(protected)/create-challenge')}>
                  <PlusCircle size={24} color="white" />
                </Button>
              </Box>
              <ChallengeList />
            </Box>
          </VStack>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengesPage;
