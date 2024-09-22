import * as Sentry from '@sentry/react-native';

process.env.EXPO_PUBLIC_SENTRY_DSN && Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // enableSpotlight: __DEV__,
  });