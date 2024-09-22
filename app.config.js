const config = require("./config.js");

module.exports = {
  expo: {
    name: config.general.appName,
    slug: config.general.slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: config.general.icon,
    scheme: config.general.scheme,
    userInterfaceStyle: "automatic",
    splash: {
      image: config.general.splashImage.light,
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      dark: {
        image: config.general.splashImage.dark,
        resizeMode: "contain",
        backgroundColor: "#000000"
      }
    },
    ios: {
      supportsTablet: false,
      usesAppleSignIn: true,
      bundleIdentifier: config.general.iosBundleIdentifier,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              process.env.EXPO_PUBLIC_IOS_URL_SCHEME,
            ]
          }
        ]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: config.general.icon,
        backgroundColor: "#ffffff"
      },
      package: config.general.androidPackageName,
      permissions: []
    },
    plugins: [
      "expo-router",
      "expo-localization",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.EXPO_PUBLIC_IOS_URL_SCHEME 
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends."
        }
      ],
      "expo-apple-authentication",
      [
        "onesignal-expo-plugin",
        {
          mode: "development"
        }
      ],
      [
        "@sentry/react-native/expo",
        {
          url: process.env.EXPO_PUBLIC_SENTRY_URL,
          project: process.env.EXPO_PUBLIC_SENTRY_PROJECT,
          organization: process.env.EXPO_PUBLIC_SENTRY_ORGANIZATION,
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: config.general.easProjectId
      },
    }
  }
};