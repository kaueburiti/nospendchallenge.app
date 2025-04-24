const config = require('./config.js');

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const IS_DEV_OR_PREVIEW = IS_DEV || IS_PREVIEW;

module.exports = {
  expo: {
    owner: config.general.owner,
    name: config.general.appName + (IS_DEV ? ' (Dev)' : ''),
    slug: config.general.slug,
    version: '1.0.1',
    orientation: 'portrait',
    icon: IS_DEV_OR_PREVIEW
      ? './src/assets/images/icon-pb.png'
      : config.general.icon,
    scheme: config.general.scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      usesAppleSignIn: true,
      bundleIdentifier:
        config.general.iosBundleIdentifier + (IS_DEV ? '.dev' : ''),
      infoPlist: {
        UIBackgroundModes: ['remote-notification'],
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
      entitlements: {
        'aps-environment': 'development',
        'com.apple.security.application-groups': [
          `group.${config.general.iosBundleIdentifier}.onesignal`,
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: IS_DEV_OR_PREVIEW
          ? './src/assets/images/icon-pb.png'
          : config.general.icon,
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
