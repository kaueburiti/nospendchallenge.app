const config = require("./config.js");

module.exports = {
    expo: {
        owner: config.general.owner,
        name: config.general.appName,
        slug: config.general.slug,
        version: "1.0.0",
        orientation: "portrait",
        icon: config.general.icon,
        scheme: config.general.scheme,
        userInterfaceStyle: "automatic",
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
                            config.googleOauth.iosUrlScheme
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
            "expo-font",
            ...(process.env.EXPO_PUBLIC_SENTRY_URL &&
            process.env.EXPO_PUBLIC_SENTRY_PROJECT &&
            process.env.EXPO_PUBLIC_SENTRY_ORGANIZATION
                ? [
                    ["@sentry/react-native/expo",
                        {
                            url: process.env.EXPO_PUBLIC_SENTRY_URL,
                            project: process.env.EXPO_PUBLIC_SENTRY_PROJECT,
                            organization: process.env.EXPO_PUBLIC_SENTRY_ORGANIZATION,
                        }]
                ]
                : []),
            "expo-router",
            "expo-localization",
            [
                "@react-native-google-signin/google-signin",
                {
                    iosUrlScheme: config.googleOauth.iosUrlScheme
                }
            ],
            [
                "expo-splash-screen",
                {
                    image: config.general.icon,
                    backgroundColor: "#ffffff",
                    dark: {
                        image: config.general.icon,
                        backgroundColor: "#000000"
                    },
                    "imageWidth": 200
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
                "expo-build-properties",
                {
                    android: {
                        minSdkVersion: 24
                    }
                }
            ],
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