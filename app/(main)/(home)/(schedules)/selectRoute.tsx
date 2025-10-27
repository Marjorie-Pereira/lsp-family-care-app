import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Button, View } from "react-native";
import MapView, {
    LatLng,
    MapPressEvent,
    Marker,
    Polyline,
} from "react-native-maps";

export default function SelectRouteScreen() {
  const { id, name, date, eventType } = useLocalSearchParams();
  console.log("date from maps", date)
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
        eventType
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        onPress={handleMapPress}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {origin && (
          <Marker coordinate={origin} title="Origem" pinColor="green" />
        )}
        {destination && (
          <Marker coordinate={destination} title="Destino" pinColor="red" />
        )}

        {origin && destination && (
          <Polyline
            coordinates={[origin, destination]}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={{ position: "absolute", bottom: 40, alignSelf: "center" }}>
        <Button title="Confirmar Rota" onPress={handleConfirm} />
      </View>
    </View>
  );
}
