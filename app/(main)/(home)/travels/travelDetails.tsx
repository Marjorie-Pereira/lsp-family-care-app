import Button from "@/components/Button";
import TravelMapView from "@/components/TravelMapView";
import { mapboxPublicToken } from "@/constants/mapboxPublicKey";
import { eventType } from "@/types/event.type";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const TravelDetails = () => {
  const { name, travel_start, travel_end, event_date } =
    useLocalSearchParams() as unknown as eventType;
  const travelInfo = {
    travel_start: JSON.parse(travel_start as string),
    travel_end: JSON.parse(travel_end as string),
  };
  const [startLocation, setStartLocation] = useState("Local desconhecido");
  const [endLocation, setEndLocation] = useState("");

  const travelDate = new Date(event_date);

  const getLocationFromCoordinates = async (coordinates: any[]) => {
    const [lng, lat] = coordinates;

    const resp = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxPublicToken}&language=pt-BR`
    );
    const data = await resp.json();

    if (data?.features?.length > 0) {
      // O nome completo (ex: "Av. Paulista, São Paulo, Brasil")
      const placeName = data.features[0].place_name;
      return placeName;
    }

    return "Local desconhecido";
  };

  const setRouteLocations = async () => {
    const startLocation = await getLocationFromCoordinates(
      travelInfo.travel_start
    );
    const endLocation = await getLocationFromCoordinates(travelInfo.travel_end);

    setStartLocation(startLocation);
    setEndLocation(endLocation);
  };

  useEffect(() => {
    setRouteLocations();
    console.log(startLocation, endLocation);
  }, []);

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <TravelMapView travelInfo={travelInfo} />
      <View style={styles.travelInfoContainer}>
        <Text style={styles.travelTitle}>{name}</Text>
        <Text style={styles.travelDateTime}>
          Horário programado:{" "}
          {travelDate.toLocaleString("pt-br", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <Text style={{ fontWeight: "600" }}>Local de partida:</Text>
        <Text>{startLocation}</Text>
        <Text style={{ fontWeight: "600" }}>Destino: </Text>
        <Text>{endLocation}</Text>

        <Button title="Iniciar Viagem" buttonStyle={{ marginTop: 10 }} />
      </View>
    </View>
  );
};

export default TravelDetails;

export type travelType = {
  travel_start: any[];
  travel_end: any[];
};

const styles = StyleSheet.create({
  travelInfoContainer: {
    marginVertical: 10,
  },
  travelTitle: {
    fontSize: 20,
  },
  travelDateTime: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
});
