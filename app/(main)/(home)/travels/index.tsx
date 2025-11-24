import Button from "@/components/Button";
import TrackerInfoHeader from "@/components/TrackerInfoHeader";
import TravelCard from "@/components/TravelCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { parseHolyIOTServiceData } from "@/utils/parseHolyIOTServiceData";
import { requestBlePermissions } from "@/utils/requestBlePermissions";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

interface deviceInfo {
  frameType: number;
  batteryPercent: number;
  mac: string;
  extra: Uint8Array<ArrayBuffer>;
}

export interface trackerInfo extends deviceInfo {
  name: string | null;
  rssi: number | null;
}

const NAME = "Holy-IOT";
const TravelTab = () => {
  const [travels, setTravels] = useState<any[]>([]);
  const [scannedDevice, setScannedDevice] = useState<Device | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<trackerInfo | null>(null);
  const [userDevice, setUserDevice] = useState();
  let bleManager: BleManager = new BleManager();
  const { user } = useAuth();

  async function fetchTravels() {
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .eq("type", "Viagem");

    if (error) {
      Alert.alert(error.message);
    } else {
      setTravels(data);
    }
  }

  async function fetchDevice() {
    const { data, error } = await supabase
      .from("Devices")
      .select("*")
      .eq("user_id", user?.id);

    if (error) {
      Alert.alert(error.message);
    } else {
      setUserDevice(data[0]);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTravels();
      fetchDevice();
    }, [])
  );

  useEffect(() => {
    bleManager = new BleManager();
    console.log(userDevice);
  }, [travels, deviceInfo, userDevice]);

  function stopScanning() {
    return bleManager.stopDeviceScan();
  }

  async function pairDevice() {
    const ok = await requestBlePermissions();

    if (!ok) {
      console.log("❌ Permissões BLE não concedidas");
      return;
    }

    const manager = new BleManager();
    manager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, scannedDevice) => {
        console.log("device detected");
        if (error) {
          console.warn(error);
          return;
        }

        if (scannedDevice && scannedDevice.name === NAME) {
          console.log(scannedDevice);
          setScannedDevice(scannedDevice);
          stopScanning().then((_res) => {
            if (scannedDevice) {
              Alert.alert(
                "Dispositivo encontrado",
                `Parear com ${scannedDevice.name}?`,
                [
                  {
                    text: "Confirmar",
                    onPress: () => {
                      const serviceData =
                        scannedDevice?.serviceData?.[
                          "00005242-0000-1000-8000-00805f9b34fb"
                        ];
                      if (!serviceData) return;

                      const info = parseHolyIOTServiceData(serviceData);
                      setDeviceInfo({
                        ...info,
                        name: scannedDevice.name,
                        rssi: scannedDevice.rssi,
                      });

                      saveDevice({
                        ...info,
                        name: scannedDevice.name,
                        rssi: scannedDevice.rssi,
                      });
                    },
                  },
                  {
                    text: "Cancelar",
                    onPress: () => null,
                  },
                ]
              );
            }
          });
        }
      }
    );

    // if (scannedDevice) Alert.alert("Encontrado", scannedDevice.name as string);
  }

  async function saveDevice(info: trackerInfo) {
    const { extra, ...rest } = info;
    console.log(rest);
    const { error } = await supabase
      .from("Devices")
      .insert({ ...rest, user_id: user?.id });
    if (error) {
      Alert.alert(error.message);
      console.error(error);
    }
    fetchDevice();
  }

  // async function updateDeviceInfo() {
  //   console.log(scannedDevice);
  //   if (!scannedDevice || !deviceInfo) return;
  //   console.log("updating device info of", scannedDevice.id);

  //   const connectedDevice = await bleManager.connectToDevice(scannedDevice.id);
  //   await connectedDevice.discoverAllServicesAndCharacteristics();
  //   const services = await connectedDevice.services();

  //   const uuids = services.map((service, index) => {
  //     if(index != 1) return service.uuid
  //   });

  //   console.log(uuids);

  //   bleManager.startDeviceScan(uuids, null, (error, scannedDevice) => {
  //     console.log("scanning");
  //     if (error) {
  //       console.warn(error);
  //       return;
  //     }

  //     if (scannedDevice && scannedDevice.name === NAME) {
  //       console.log(scannedDevice);
  //       const serviceData =
  //         scannedDevice.serviceData?.["00005242-0000-1000-8000-00805f9b34fb"];
  //       if (!serviceData) return;

  //       const info = parseHolyIOTServiceData(serviceData);

  //       setDeviceInfo({ ...deviceInfo, batteryPercent: info.batteryPercent });
  //       stopScanning();
  //     }
  //   });
  // }

  return (
    <>
      {userDevice ? (
        <TrackerInfoHeader info={userDevice as trackerInfo} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.tituloSecao}>Nenhum dispositivo encontrado</Text>
          <Button title="Parear Dispositivo" onPress={pairDevice} />
        </View>
      )}
      <FlatList
        data={travels}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={[styles.tituloSecao, { marginTop: 20 }]}>
            Viagens Programadas
          </Text>
        }
        renderItem={({ item }) => <TravelCard viagem={item} />}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>Nenhuma viagem programada.</Text>
        }
        contentContainerStyle={styles.listaContainer}
      />
    </>
  );
};

export default TravelTab;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15, // Um fundo cinza claro
  },
  listaContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  listaVazia: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#666",
  },
  tituloSecao: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginVertical: 15,
  },
});
