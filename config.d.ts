declare const config: {
  general: {
    appName: string;
    owner: string;
    slug: string;
    icon: string;
    scheme: string;
    splashImage: string;
    iosBundleIdentifier: string;
    androidPackageName: string;
    easProjectId: string;
  };
  profilePage: {
    supportPage: string;
    contactPage: string;
  };
  googleOauth: {
    iosClientId: string;
    iosUrlScheme: string;
    webClientId: string;
  };
};

export = config;