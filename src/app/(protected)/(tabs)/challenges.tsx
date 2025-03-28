import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  ButtonText,
} from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Section } from '@/components/Section';
import { PlusCircle, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import ChallengeList from '@/components/home/challenges';
import { useUserInvitations } from '@/hooks/invitations';

const ChallengesPage = () => {
  const { data: invitations, isLoading: isLoadingInvitations } =
    useUserInvitations();
  const hasPendingInvitations =
    !isLoadingInvitations && invitations && invitations.length > 0;

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl" className="px-2 py-8">
            <Box className="flex flex-1 flex-col overflow-auto">
              <Box className="mb-4 flex flex-row items-center justify-between">
                <Heading size="3xl">Challenges</Heading>
                <Box className="flex-row gap-2">
                  {hasPendingInvitations && (
                    <Button
                      variant="outline"
                      className="relative"
                      onPress={() => router.push('/(protected)/invitations')}>
                      <Mail size={24} color="#6366f1" />
                      <Box className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-red-500">
                        <Text className="text-xs font-bold text-white">
                          {invitations.length}
                        </Text>
                      </Box>
                    </Button>
                  )}
                  <Button
                    onPress={() =>
                      router.push('/(protected)/create-challenge')
                    }>
                    <PlusCircle size={24} color="white" />
                  </Button>
                </Box>
              </Box>

              {hasPendingInvitations && (
                <Box className="mb-6 rounded-lg bg-blue-50 p-4">
                  <Box className="flex-row items-center justify-between">
                    <Box>
                      <Text className="font-bold">Pending Invitations</Text>
                      <Text className="text-sm text-gray-600">
                        You have {invitations.length} pending invitation
                        {invitations.length > 1 ? 's' : ''}
                      </Text>
                    </Box>
                    <Button
                      size="sm"
                      onPress={() => router.push('/(protected)/invitations')}>
                      <ButtonText>View All</ButtonText>
                    </Button>
                  </Box>
                </Box>
              )}

              <ChallengeList />
            </Box>
          </VStack>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengesPage;
