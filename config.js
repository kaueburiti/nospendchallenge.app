/*
 * This file contains the configuration for your app.
 * Follow our docs to set up this project: https://docs.native.express
 */

const config = {
    general: {
        // You can find more information about the general setup in our docs: https://docs.native.express/setup/introduction
        appName: 'Native Express', // TODO: replace with your app name
        owner: "your-expo-account-username", // TODO replace with owner (optional) 
        slug: 'native-express', // TODO: replace with your app slug
        icon: './src/assets/images/icon.png',
        scheme: 'nativeexpress', // TODO: replace with your app scheme
        splashImage: {
            light: './src/assets/images/splash.png',
            dark: './src/assets/images/splash.dark.png'
        },
        iosBundleIdentifier: 'com.robinfaraj.nativeexpress', // TODO: Enter your iOS bundle identifier
        androidPackageName: 'com.robinfaraj.nativeexpress', // TODO: Enter your Android package name
        easProjectId: '', // TODO: Enter your EAS project ID
    },
    googleOauth: {
        // More information about Google OAuth in our docs: https://docs.native.express/authentication/overview
        iosClientId: '437910011657-ltbp98hduh1su0lcfc7ce53a9o8u08t5.apps.googleusercontent.com', // TODO: replace with your Google OAuth iOS client ID
        iosUrlScheme: 'com.googleusercontent.apps.437910011657-ltbp98hduh1su0lcfc7ce53a9o8u08t5', // TODO: replace with your Google OAuth iOS URL scheme
        webClientId: '437910011657-uk384cpo99kv75nsv5ar4oc3g3navibk.apps.googleusercontent.com', // TODO: replace with your Google OAuth web client ID
    },
    profilePage: {
        supportPage: 'https://x.com/robin_faraj',
        contactPage: 'https://x.com/robin_faraj',
    },   
};

module.exports = config;