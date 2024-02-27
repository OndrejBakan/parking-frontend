import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'parking.rewrite',
  appName: 'parking-rewrite',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
