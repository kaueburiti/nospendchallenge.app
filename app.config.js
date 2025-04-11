const config = require('./config.js');

module.exports = {
  expo: {
    owner: config.general.owner,
    name: config.general.appName,
    slug: config.general.slug,
    version: '1.0.1',
    orientation: 'portrait',
    icon: config.general.icon,
    scheme: config.general.scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      usesAppleSignIn: true,
      bundleIdentifier: config.general.iosBundleIdentifier,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              config.general.scheme,
              config.googleOauth.iosUrlScheme,
            ],
          },
        ],
      },
      associatedDomains: ['applinks:nospendchallenge.app'],
    },
    android: {
      adaptiveIcon: {
        foregroundImage: config.general.icon,
        backgroundColor: '#ffffff',
      },
      package: config.general.androidPackageName,
      permissions: [],
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'https',
              host: 'nospendchallenge.app',
              pathPrefix: '/challenge',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    plugins: [
      'expo-font',
      ...(process.env.EXPO_PUBLIC_SENTRY_URL &&
      process.env.EXPO_PUBLIC_SENTRY_PROJECT &&
      process.env.EXPO_PUBLIC_SENTRY_ORGANIZATION
        ? [
            [
              '@sentry/react-native/expo',
              {
                url: process.env.EXPO_PUBLIC_SENTRY_URL,
                project: process.env.EXPO_PUBLIC_SENTRY_PROJECT,
                organization: process.env.EXPO_PUBLIC_SENTRY_ORGANIZATION,
              },
            ],
          ]
        : []),
      'expo-router',
      'expo-localization',
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: config.googleOauth.iosUrlScheme,
        },
      ],
      [
        'expo-splash-screen',
        {
          image: config.general.icon,
          backgroundColor: '#FF7979',
          dark: {
            image: config.general.icon,
            backgroundColor: '#FF7979',
          },
          imageWidth: 200,
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to let you share them with your friends.',
        },
      ],
      'expo-apple-authentication',
      [
        'onesignal-expo-plugin',
        {
          mode: 'development',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 24,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: config.general.easProjectId,
      },
    },
  },
};
