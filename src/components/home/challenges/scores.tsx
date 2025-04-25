import React from 'react';
import { Box, Divider, Heading, Text, VStack } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import { useGetUserChecksByChallenge } from '@/hooks/checks';
import {
  differenceInDays,
  eachDayOfInterval,
  isBefore,
  isSameDay,
} from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';

function getDaysToCheck(startDate: Date, endDate: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const challengeStartToday = isSameDay(startDate, today);

  if (challengeStartToday) {
    return [];
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const daysToCheck = eachDayOfInterval({
    start: startDate,
    end: isBefore(yesterday, endDate) ? yesterday : endDate,
  });
  return daysToCheck;
}

export default function ChallengeScores() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading: isLoadingChallenge } = useChallenge(id);
  const { data: checks, isLoading: isLoadingChecks } =
    useGetUserChecksByChallenge(Number(id));

  if (isLoadingChallenge || !challenge || isLoadingChecks) {
    return null;
  }

  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate days left
  const daysLeft = Math.max(0, differenceInDays(endDate, today) + 1);

  // Calculate total checks
  const totalChecks = checks?.length ?? 0;

  const daysSkipped = getDaysToCheck(startDate, endDate).reduce(
    (skipped, date) => {
      const hasCheck = checks?.some(check => {
        const checkDate = new Date(check.date);
        checkDate.setHours(0, 0, 0, 0);
        checkDate.setDate(checkDate.getDate() + 1); // Add one day to fix timezone issue

        return isSameDay(checkDate, date);
      });

      return hasCheck ? skipped : skipped + 1;
    },
    0,
  );

  const challengeNotStarted = isBefore(today, startDate);

  return (
    <Box className="my-5 flex-row">
      <VStack className="flex-1 items-center border-r border-outline-300 py-2">
        <Heading size="4xl">{challengeNotStarted ? '-' : daysLeft}</Heading>
        <Text size="xs">{t('checks.days_left')}</Text>
      </VStack>
      <Divider
        orientation="horizontal"
        className="flex w-1 self-center bg-background-300"
      />
      <VStack className="flex-1 items-center border-r border-outline-300 py-2">
        <Heading size="4xl">{challengeNotStarted ? '-' : totalChecks}</Heading>
        <Text size="xs">{t('checks.checks')}</Text>
      </VStack>
      <Divider
        orientation="horizontal"
        className="flex w-1 self-center bg-background-300 sm:hidden"
      />
      <VStack className="flex-1 items-center pt-2">
        <Heading size="4xl">{challengeNotStarted ? '-' : daysSkipped}</Heading>
        <Text size="xs">{t('checks.days_skipped')}</Text>
      </VStack>
    </Box>
  );
}
