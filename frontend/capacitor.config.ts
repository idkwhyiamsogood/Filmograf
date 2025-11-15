import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.filmograf',
  appName: 'Filmograf',
  webDir: 'out',
  server: {
    // Для разработки - укажите IP вашего компьютера в локальной сети для dev другой config
    url: 'http://192.168.0.192:3000',
    androidScheme: 'http',
    cleartext: true,
  },
  plugins: {
    LiveUpdates: {
      appId: 'com.filmograf',
      channel: 'dev',
      autoUpdateMethod: 'background',
      maxVersions: 2
    }
  }
};

export default config;