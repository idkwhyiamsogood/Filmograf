import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.filmograf",
  appName: "Filmograf",
webDir: 'out',
  server: {
    url: "http://26.254.134.172:3000",
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
  },
};

export default config;
