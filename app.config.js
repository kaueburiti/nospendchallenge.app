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
              config.googleOauth.scheme,
              config.googleOauth.iosUrlScheme,
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
          iosUrlScheme: config.googleOauth.iosUrlScheme
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
          url: config.sentry.url,
          project: config.sentry.project,
          organization: config.sentry.organization,
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