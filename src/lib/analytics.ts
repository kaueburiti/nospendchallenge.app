import { trackEvent } from '@aptabase/react-native';

export const Analytics = {
  // Challenge Events
  challenge: {
    created: (challengeId: string, title: string) => {
      trackEvent('challenge_created', {
        challenge_id: challengeId,
        title,
      });
    },
    updated: (challengeId: string, title: string) => {
      trackEvent('challenge_updated', {
        challenge_id: challengeId,
        title,
      });
    },
    deleted: (challengeId: string, title: string) => {
      trackEvent('challenge_deleted', {
        challenge_id: challengeId,
        title,
      });
    },
    checkIn: (challengeId: string, date: string, message: string) => {
      trackEvent('check_in', {
        challenge_id: challengeId,
        date,
        message,
      });
    },
    invited: (challengeId: string, email: string) => {
      trackEvent('challenge_invited', {
        challenge_id: challengeId,
        email,
      });
    },
    joined: (challengeId: string) => {
      trackEvent('challenge_joined', {
        challenge_id: challengeId,
      });
    },
  },

  // Auth Events
  auth: {
    signedUp: (userId: string) => {
      trackEvent('user_signed_up', {
        user_id: userId,
      });
    },
    signedIn: (userId: string) => {
      trackEvent('user_signed_in', {
        user_id: userId,
      });
    },
    signedOut: (userId: string) => {
      trackEvent('user_signed_out', {
        user_id: userId,
      });
    },
  },

  // Navigation Events
  navigation: {
    screenView: (screenName: string) => {
      trackEvent('screen_view', {
        screen_name: screenName,
      });
    },
  },

  // Error Events
  error: {
    occurred: (error: Error, context: string) => {
      trackEvent('error_occurred', {
        error_message: error.message,
        error_stack: error.stack,
        context,
      });
    },
  },
};
