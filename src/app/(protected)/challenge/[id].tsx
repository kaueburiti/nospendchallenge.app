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
import { useCreateCheck, useGetUserChecksByChallenge } from '@/hooks/checks';
import { ScrollView } from 'react-native';
import classNames from 'classnames';
import { ProgressFilledTrack } from '@/components/ui/progress';
import { Progress } from '@/components/ui/progress';
import { Settings } from 'lucide-react-native';
import FormInput from '@/components/auth/FormInput';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from '@/components/ui/modal';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { ModalCloseButton, Modal } from '@/components/ui/modal';
import { ModalHeader } from '@/components/ui/modal';
import { ModalContent } from '@/components/ui/modal';
import { ModalBackdrop } from '@/components/ui/modal';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const { mutate: createCheck } = useCreateCheck();
  const { data: checks } = useGetUserChecksByChallenge(Number(id));
  const date = format(new Date(), 'yyyy-MM-dd');

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

  const handleCreateCheck = () => {
    createCheck({
      challenge_id: Number(id),
      date: date,
    });
  };

  const days = Array.from({ length: 120 }, (_, index) => index + 1);

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Box className="p-4">
          <Button onPress={() => router.back()} className="mb-4">
            <Text>Back</Text>
          </Button>

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
                <Settings size={24} color="white" />
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

            <Box className="my-5 flex-row">
              <VStack className="flex-1 items-center border-r border-outline-300 py-2">
                <Heading size="4xl">23</Heading>
                <Text size="xs">Days Left</Text>
              </VStack>
              <Divider
                orientation="horizontal"
                className="flex w-1 self-center bg-background-300"
              />
              <VStack className="flex-1 items-center border-r border-outline-300 py-2">
                <Heading size="4xl">97</Heading>
                <Text size="xs">Checks</Text>
              </VStack>
              <Divider
                orientation="horizontal"
                className="flex w-1 self-center bg-background-300 sm:hidden"
              />
              <VStack className="flex-1 items-center pt-2">
                <Heading size="4xl">3</Heading>
                <Text size="xs">Days Skipped</Text>
              </VStack>
            </Box>
            <Box className="">
              <Box className="flex flex-row flex-wrap justify-between">
                {days.map(day => (
                  <Box
                    key={day}
                    className={classNames(
                      'm-1 h-10 w-10 items-center justify-center rounded-md bg-emerald-600',
                      {
                        'bg-gray-300':
                          Math.random() < 0.5 && Math.random() > 0.4,
                      },
                    )}>
                    <Text className="text-xs font-bold text-white">{day}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
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
            <CheckInForm />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setIsCheckInDrawerOpen(false);
              }}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setIsCheckInDrawerOpen(false);
              }}>
              <ButtonText>Create Check In</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
}

const CheckInForm = () => {
  const { control } = useForm();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <SafeAreaView>
      <Box className="mb-4 w-full flex-row items-center justify-between">
        <Text>Check In Date:</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          onChange={onChange}
        />
      </Box>

      <FormInput control={control} name="log" placeholder="How was it?" />
    </SafeAreaView>
  );
};
