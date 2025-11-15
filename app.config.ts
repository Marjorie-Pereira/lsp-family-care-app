import { ConfigContext, ExpoConfig } from "@expo/config";
import * as dotenv from "dotenv";

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "family-care-app",
  name: "family-care-app",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.croon",
    config: {
      googleMapsApiKey: process.env.GOOGLE_CLOUD_API_KEY,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/img/logo.png",
      backgroundColor: "#FFFFFF",
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_CLOUD_API_KEY,
      },
    },
    package: "com.croon",
  },
});
