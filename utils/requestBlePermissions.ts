import * as ExpoDevice from "expo-device";
import * as Location from "expo-location";
import { PermissionsAndroid, Platform } from "react-native";

export async function requestBlePermissions() {
  if (Platform.OS === "android") {
    const apiLevel = ExpoDevice.platformApiLevel ?? 0;

    try {
      // Android 12+ (API 31+)
      if (apiLevel >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          (result) => result === PermissionsAndroid.RESULTS.GRANTED
        );

        return allGranted;
      }

      // Android pré-12
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      const ok = Object.values(granted).every(
        (result) => result === PermissionsAndroid.RESULTS.GRANTED
      );

      return ok;
    } catch (err) {
      console.log("Erro ao solicitar permissões BLE:", err);
      return false;
    }
  }

  // iOS
  if (Platform.OS === "ios") {
    const { status } = await Location.requestForegroundPermissionsAsync();

    return status === "granted";
  }

  return false;
}
