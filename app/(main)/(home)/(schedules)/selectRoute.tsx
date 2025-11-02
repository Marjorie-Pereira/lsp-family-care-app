import MapRoute from "@/components/MapRoute";
import { router, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";

export default function SelectRouteScreen() {
  const { id, name, date, eventType } = useLocalSearchParams();

  const handleConfirm = (origin: any[] | null, destination: any[] | null) => {
    if (!origin || !destination) {
      Alert.alert("Selecione origem e destino no mapa primeiro");
      return;
    }

    const originJson = JSON.stringify(origin);

    console.log(JSON.parse(originJson)[0]);

    router.replace({
      pathname: "./eventForm/[id]",
      params: {
        origin: JSON.stringify(origin),
        destination: JSON.stringify(destination),
        id,
        name,
        date,
        eventType,
      },
    });
  };

  return <MapRoute onConfirmRoute={handleConfirm} />;
}
