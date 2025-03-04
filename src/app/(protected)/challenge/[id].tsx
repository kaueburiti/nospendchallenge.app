import React, { useState } from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Box,
  Button,
  Divider,
  Heading,
  Text,
  Image,
  VStack,
  ButtonText,
} from '@/components/ui';
import { useLocalSearchParams, router } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import { format } from 'date-fns';
import { useCreateCheck } from '@/hooks/checks';
import { ScrollView } from 'react-native';
import { ProgressFilledTrack } from '@/components/ui/progress';
import { Progress } from '@/components/ui/progress';
import { Settings } from 'lucide-react-native';
import FormInput from '@/components/ui/form/input';
import { useForm } from 'react-hook-form';
import { ModalBody } from '@/components/ui/modal';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { ModalCloseButton, Modal } from '@/components/ui/modal';
import { ModalHeader } from '@/components/ui/modal';
import { ModalContent } from '@/components/ui/modal';
import { ModalBackdrop } from '@/components/ui/modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import DaysGrid from '@/components/home/challenges/days-grid';
import ChallengeScores from '@/components/home/challenges/scores';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <Text>Loading...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (!challenge) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <Text>Challenge not found</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Box className="px-4 pb-16 pt-10">
          {/* <Button onPress={() => router.back()} className="mb-4">
            <Text>Back</Text>
          </Button> */}

          <VStack space="md">
            <Box className="h-32 w-full overflow-hidden rounded-md bg-black">
              <Image
                source={{
                  uri: challenge.cover!,
                }}
                alt={String(challenge.title)}
                className="h-full w-full opacity-70"
              />

              <Box className="absolute left-4 top-4 flex flex-row items-center justify-between">
                <Heading size="2xl" className="text-white">
                  {challenge.title}
                </Heading>
                <Button
                  onPress={() => router.push(`/challenge/${id}/edit`)}
                  variant="outline"
                  action="secondary">
                  <Settings size={24} color="white" />
                </Button>
              </Box>

              <Box className="absolute right-4 top-1/2 aspect-square h-24 w-24 -translate-y-1/2 items-center justify-center rounded-full text-center text-4xl font-bold text-white">
                <Text className="text-center text-4xl font-bold text-white">
                  94%
                </Text>
              </Box>

              <Box className="absolute bottom-0 left-0 right-0 h-10 w-full px-4">
                <Progress
                  value={80}
                  size="2xl"
                  orientation="horizontal"
                  className="w-full">
                  <ProgressFilledTrack />
                </Progress>
              </Box>
            </Box>

            <Box className="flex flex-row items-center justify-between">
              <Box className="">
                <Heading size="lg">Challenge Crew</Heading>
                <Box className="flex flex-row gap-4 pl-4">
                  <AvatarGroup>
                    <Avatar size="md" className="border-2 border-white">
                      <AvatarFallbackText>John Doe</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                        }}
                      />
                    </Avatar>
                    <Avatar size="md" className="border-2 border-white">
                      <AvatarFallbackText>John Doe</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                        }}
                      />
                    </Avatar>
                    <Avatar size="md" className="border-2 border-white">
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
              <Box className="mt-4">
                <Button onPress={() => setIsCheckInDrawerOpen(true)} size="lg">
                  <Text className="text-white">Check In</Text>
                </Button>
              </Box>
            </Box>

            <ChallengeScores />
            <DaysGrid />
          </VStack>
        </Box>
      </ScrollView>

      <Modal
        isOpen={isCheckInDrawerOpen}
        onClose={() => setIsCheckInDrawerOpen(false)}
        size="md">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Check In
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900 group-[:hover]/modal-close-button:stroke-background-700"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <CheckInForm
              challengeId={id}
              onSubmit={() => setIsCheckInDrawerOpen(false)}
              onClose={() => setIsCheckInDrawerOpen(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}

const CheckInForm = ({
  challengeId,
  onSubmit: closeModal,
  onClose,
}: {
  challengeId: string;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      message: '',
    },
  });
  const [date, setDate] = useState(new Date());
  const { mutate: createCheck } = useCreateCheck();

  const onSubmit = async (data: { message: string }) => {
    createCheck({
      challenge_id: Number(challengeId),
      date: format(date, 'yyyy-MM-dd'),
      message: data.message,
    });
    closeModal();
  };

  return (
    <SafeAreaView>
      <Box className="mb-4 w-full flex-row items-center justify-between">
        <Text>Check In Date:</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      </Box>

      <FormInput control={control} name="message" placeholder="How was it?" />

      <Box className="mt-4 flex-row justify-end space-x-2">
        <Button variant="outline" action="secondary" onPress={onClose}>
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          <ButtonText>Create Check In</ButtonText>
        </Button>
      </Box>
    </SafeAreaView>
  );
};
