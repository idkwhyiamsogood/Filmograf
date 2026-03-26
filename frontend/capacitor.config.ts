import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.filmograf",
  appName: "Filmograf",

  server: {
    url: "http://127.0.0.1:3000",
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
