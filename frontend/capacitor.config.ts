import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.filmograf",
  appName: "Filmograf",
  webDir: "dist",
  server: {
    url: "http://192.168.0.195:3000",
    androidScheme: "http",
    cleartext: true,
  },

  plugins: {
    // Сплэш показывает ОС при холодном старте; прячет приложение, когда
    // готова сессия (widgets/BootSplash/AppSplash.tsx). При перезагрузке
    // WebView он не появляется.
    SplashScreen: {
      launchAutoHide: false,
      launchFadeOutDuration: 300,
      backgroundColor: "#faf8f5",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
    LiveUpdates: {
      appId: "com.filmograf",
      channel: "dev",
      autoUpdateMethod: "background",
      maxVersions: 2,
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId:
        "341334726956-oo7rlsn0743ot821mdqoaj5e6uk442vr.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
