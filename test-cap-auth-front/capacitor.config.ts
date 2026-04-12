import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.spark",
  appName: "Filmograf",
  webDir: 'out',
  server: {
    // Set this during development when running `next dev` for live reload
    // Replace with your machine's LAN IP if running on device
    androidScheme: 'http',
    cleartext: true,
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "341334726956-oo7rlsn0743ot821mdqoaj5e6uk442vr.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
