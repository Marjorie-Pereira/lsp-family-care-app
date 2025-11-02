import MapRoute from "@/components/MapRoute";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { LatLng, MapPressEvent } from "react-native-maps";

export default function SelectRouteScreen() {
  const { id, name, date, eventType } = useLocalSearchParams();
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;

    if (!origin) {
      setOrigin(coordinate);
    } else if (!destination) {
      setDestination(coordinate);
    } else {
      // Se já tiver os dois, reinicia
      setOrigin(coordinate);
      setDestination(null);
    }
  };

  const handleConfirm = () => {
    if (!origin || !destination) {
      Alert.alert("Selecione origem e destino no mapa primeiro");
      return;
    }

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

  return <MapRoute />;
}
