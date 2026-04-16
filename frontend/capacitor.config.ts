import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.filmograf",
  appName: "Filmograf",
  webDir: "out",
  server: {
    url: "http://192.168.0.199:3000",
    androidScheme: "http",
    cleartext: true,
  },

  plugins: {
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
  },
};

export default config;
