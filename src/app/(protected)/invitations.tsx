import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Heading, Text, VStack } from '@/components/ui';
import { useUserInvitations } from '@/hooks/invitations';
import PendingInvitations from '@/components/home/challenges/invite/pending-invitations';
import { ScrollView } from '@/components/ui/scroll-view';

export default function InvitationsScreen() {
  const { data: invitations, isLoading } = useUserInvitations();

  return (
    <SafeAreaView>
      <ScrollView>
        <Box className="p-4">
          <Heading size="2xl" className="mb-2">
            Invitations
          </Heading>
          <Text className="mb-6 text-gray-500">
            Manage your challenge invitations
          </Text>

          {isLoading ? (
            <Text>Loading invitations...</Text>
          ) : !invitations || invitations.length === 0 ? (
            <Box className="items-center justify-center rounded-lg bg-gray-100 p-8">
              <Text className="text-center text-gray-500">
                You don&apos;t have any pending invitations
              </Text>
            </Box>
          ) : (
            <VStack space="md">
              <PendingInvitations />
            </VStack>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
