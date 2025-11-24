import Button from "@/components/Button";
import { theme } from "@/theme";
import { parseHolyIOTServiceData } from "@/utils/parseHolyIOTServiceData";
import { Buffer } from "buffer";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
const NAME = "Holy-IOT";

const rssiValues: any = {}; // object for storing arrays of RSSI values

// Stop scanning if necessary

function calculateDistance(rssi: any, measure = -55, multiplier = 2) {
  return Math.pow(10, (measure - rssi) / (10 * multiplier));
}

function addRssiValueAndGetAverage(deviceId: any, newValue: any, maxSize = 3) {
  if (!rssiValues[deviceId]) {
    rssiValues[deviceId] = []; // Initialize the array if this is the first value
  }
  const values = rssiValues[deviceId];
  values.push(newValue); // Add a new value

  // Remove the oldest value if the maximum array size is exceeded
  if (values.length > maxSize) {
    values.shift();
  }

  // Calculate the average value
  const averageRssi =
    values.reduce((acc: any, value: any) => acc + value, 0) / values.length;
  return averageRssi;
}

const BleScanScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedDevice, setScannedDevice] = useState<Device | null>(null);
  const bleManager = new BleManager();

  useFocusEffect(
    useCallback(() => {
      //   startScanning();
      return () => {
        // setScannedDevice(null);
        stopScanning();
      };
    }, [])
  );

  useEffect(() => console.log(scannedDevice), [scannedDevice]);

  function stopScanning() {
    bleManager.stopDeviceScan();
  }
  // Function to start scanning BLE devices
  function startScanning() {
    // The first parameter is the UUIDs of services (null if you want to scan all devices)
    // Second parameter - scanning options
    // The third parameter is a callback called when a device is detected
    console.log("scanning...");

    bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      console.log("found device");
      if (error) {
        console.warn(error);
        return;
      }

      if (scannedDevice && scannedDevice.name === NAME) {
        //   const distance = calculateDistance(scannedDevice.rssi);
        //   const averageRssi = addRssiValueAndGetAverage(
        //     scannedDevice.id,
        //     scannedDevice.rssi
        //   );
        //   console.log(
        //     `Average RSSI value for device ${scannedDevice.name}: ${averageRssi}`
        //   );
        //   console.log("distance of " + scannedDevice.name, distance);
        const serviceData =
          scannedDevice.serviceData?.["00005242-0000-1000-8000-00805f9b34fb"];
        if (!serviceData) return;

        const info = parseHolyIOTServiceData(serviceData);

        console.log("RSSI:", scannedDevice.rssi);
        console.log("Bateria %:", info.batteryPercent);

        // Alert.alert(`Found device: ${scannedDevice.name}, ${scannedDevice.id}`);
        // setScannedDevice(scannedDevice);
        // setScanning(false);
        // stopScanning();
      }
    });
  }

  async function connectToDevice() {
    if (!scannedDevice) return;
    console.log("connecting to ", scannedDevice?.id);
    bleManager.connectToDevice(scannedDevice?.id).then(async (device) => {
      await device.discoverAllServicesAndCharacteristics();
      const services = await device.services();
      console.log(services);
      const char = await device.readCharacteristicForService(
        "00001800-0000-1000-8000-00805f9b34fb",
        "00002a00-0000-1000-8000-00805f9b34fb"
      );
      console.log(char);
      const readValueInBase64 = char.value;

      const readValueInRawBytes = Buffer.from(
        readValueInBase64 as string,
        "base64"
      );

      const heightMostSignificantByte = readValueInRawBytes[1];
      const heightLeastSignificantByte = readValueInRawBytes[0];

      const heightInCentimeters =
        (heightMostSignificantByte << 8) | heightLeastSignificantByte;

      console.log("decoded value", heightInCentimeters);
    });
  }
  return (
    <View>
      <Text>BleScanScreen</Text>
      <Button
        title={scanning ? "Stop Scanning" : "Start Scanning"}
        onPress={() => {
          setScanning((prev) => !prev);
          scanning ? stopScanning() : startScanning();
        }}
        buttonStyle={{
          backgroundColor: scanning
            ? theme.colors.dangerBtn
            : theme.colors.primary,
        }}
      />
      {scannedDevice && (
        <>
          <Button
            title="Connect to device"
            onPress={() => {
              connectToDevice();
            }}
            buttonStyle={{
              marginTop: 20,
            }}
          />
          <Button
            title="Disconnect"
            onPress={() => {
              bleManager.cancelDeviceConnection(scannedDevice?.id);
            }}
            buttonStyle={{
              marginTop: 20,
            }}
          />
        </>
      )}
    </View>
  );
};

export default BleScanScreen;
