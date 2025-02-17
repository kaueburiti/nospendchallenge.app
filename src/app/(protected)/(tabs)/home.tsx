import React from 'react';
import { Pressable, ScrollView, Image } from 'react-native';
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Box,
  Heading,
  VStack,
} from '@/components/ui';
import { Text } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { i18n } from '@/i18n';
import { useGetChallenges } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { Section } from '@/components/Section';
import { PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui';
import type { Tables } from '@/lib/db/database.types';
import { Progress } from '@/components/ui/progress';
import { ProgressFilledTrack } from '@/components/ui/progress';

const Explorepage = () => {
  const { user } = useSession();

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl">
            <Box className="mt-8">
              <Heading size="xl">Hello,</Heading>
              <Heading size="3xl">{user?.user_metadata.full_name} 👋</Heading>
            </Box>
            <Box className="flex flex-1 flex-col overflow-auto">
              <Box className="mb-6 flex flex-row items-center justify-between">
                <Heading size="xl">{i18n.t('home.top_section_title')}</Heading>
                <Button
                  onPress={() => router.push('/(protected)/create-challenge')}>
                  <PlusCircle size={24} color="white" />
                </Button>
              </Box>
              <ChallengeList />
            </Box>
            <Box className="">
              <Box className="bg-linear-to-r h-40 w-full rounded-lg bg-slate-200" />
            </Box>
            <Box className="flex flex-1 flex-col pb-8">
              <Heading size="xl" className="mb-4">
                {i18n.t('home.bottom_section_title')}
              </Heading>

              <VStack space="2xl">
                {Array.from({ length: 3 }).map((_, index) => (
                  <RecentActivity key={index} />
                ))}
              </VStack>
            </Box>
          </VStack>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

function RecentActivity() {
  return (
    <Box className="flex flex-row items-start justify-between gap-4">
      <Box className="flex flex-row items-center justify-between gap-4">
        <Box className="h-12 w-12 rounded-full bg-slate-300" />
        <Box className="flex flex-col">
          <Text className="text-lg font-semibold">You&apos;re rocking 🚀</Text>
          <Text className="text-content-50">Congratulations!</Text>
        </Box>
      </Box>
      <Box>
        <Text className="text-content-50">2 days ago</Text>
      </Box>
    </Box>
  );
}

function ChallengeList() {
  const { data: challenges } = useGetChallenges();
  return (
    <Box className="flex flex-col gap-8">
      {challenges?.map(challenge => (
        <ChallengeItem key={challenge.id} challenge={challenge} />
      ))}
    </Box>
  );
}

function ChallengeItem({ challenge }: { challenge: Tables<'challenges'> }) {
  return (
    <Pressable
      className="w-full"
      onPress={() => router.push(`/challenge/${challenge.id}`)}>
      <Box className="flex w-full flex-row justify-between gap-10">
        <Box className="flex flex-1 flex-row gap-4">
          <Image
            source={{
              uri: challenge.cover!,
            }}
            alt={String(challenge.title)}
            className="h-14 w-14 rounded-md"
            resizeMode="cover"
          />
          <VStack space="xs" className="flex-1">
            <Heading>{challenge.title}</Heading>
            <Progress
              value={Math.random() * 100}
              size="2xl"
              orientation="horizontal"
              className="w-full">
              <ProgressFilledTrack />
            </Progress>
          </VStack>
        </Box>
        <Box className="flex flex-row gap-4">
          <AvatarGroup>
            <Avatar size="sm" className="border-2 border-white">
              <AvatarFallbackText>John Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}
              />
            </Avatar>
            <Avatar size="sm" className="border-2 border-white">
              <AvatarFallbackText>John Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                }}
              />
            </Avatar>
            <Avatar size="sm" className="border-2 border-white">
              <AvatarFallbackText>John Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}
              />
            </Avatar>
          </AvatarGroup>
        </Box>
      </Box>
    </Pressable>
  );
}

export default Explorepage;
