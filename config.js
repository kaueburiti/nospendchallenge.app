/*
 * This file contains the configuration for your app.
 * Follow our docs to set up this project: https://docs.native.express
 */

const config = {
    general: {
        // You can find more information about the general setup in our docs: https://docs.native.express/setup/introduction
        appName: 'Native Express', // TODO: replace with your app name
        slug: 'native-express', // TODO: replace with your app slug
        icon: './src/assets/images/icon.png',
        scheme: 'nativeexpress', // TODO: replace with your app scheme
        splashImage: {
            light: './src/assets/images/splash.png',
            dark: './src/assets/images/splash.dark.png'
        },
        iosBundleIdentifier: 'com.robinfaraj.nativeexpress-demo', // TODO: Enter your iOS bundle identifier
        androidPackageName: '<your-android-package-name>', // TODO: Enter your Android package name
        easProjectId: '<your-eas-project-id>', // TODO: Enter your EAS project ID
    },
    googleOauth: {
        // More information about Google OAuth in our docs: https://docs.native.express/authentication/overview
        iosClientId: '803722982306-rkomc92ir03mkedcfdshnl7e6l1cvf3c.apps.googleusercontent.com',
        iosUrlScheme: 'com.googleusercontent.apps.803722982306-rkomc92ir03mkedcfdshnl7e6l1cvf3c'
    },
    profilePage: {
        supportPage: 'https://x.com/robin_faraj',
        contactPage: 'https://x.com/robin_faraj',
    },
    sentry: {
        // More information in our docs: https://docs.native.express/monitoring
        url: 'https://sentry.io/',
        project: '<your-sentry-project>',
        organization: '<your-sentry-organization>',
    },
    oneSignalAppId: '<your-onesignal-app-id>', // Information about OneSignal in our docs: https://docs.native.express/push-notification/overview
    //  More information about posthog in our docs: https://docs.native.express/analytics
    posthogHost: 'https://us.i.posthog.com', // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
};

module.exports = config;