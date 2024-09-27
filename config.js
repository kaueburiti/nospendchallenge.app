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
        iosBundleIdentifier: 'com.robinfaraj.nativeexpress', // TODO: Enter your iOS bundle identifier
        androidPackageName: 'com.robinfaraj.nativeexpress', // TODO: Enter your Android package name
        easProjectId: '', // TODO: Enter your EAS project ID
    },
    profilePage: {
        supportPage: 'https://x.com/robin_faraj',
        contactPage: 'https://x.com/robin_faraj',
    },   
};

module.exports = config;