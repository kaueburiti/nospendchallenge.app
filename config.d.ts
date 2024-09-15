declare const config: {
  general: {
    appName: string;
    slug: string;
    icon: string;
    scheme: string;
    splashImage: string;
    iosBundleIdentifier: string;
    androidPackageName: string;
    easProjectId: string;
  };
  googleOauth: {
    iosClientId: string;
    iosUrlScheme: string;
  };
  profilePage: {
    supportPage: string;
    contactPage: string;
  };
  sentry: {
    url: string;
    project: string;
    organization: string;
  };
  supabaseUrl: string;
  oneSignalAppId: string;
  posthogHost: string;
};

export = config;