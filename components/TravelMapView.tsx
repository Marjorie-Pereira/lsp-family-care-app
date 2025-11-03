import { travelType } from "@/app/(main)/(home)/travels/travelDetails";
import { token } from "@/constants/mapbox.public.token";
import {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
} from "@rnmapbox/maps";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const TravelMapView = ({ travelInfo }: { travelInfo: travelType }) => {
  const { travel_start, travel_end } = travelInfo;
  const [route, setRoute] = useState(null);

  async function fetchRoute(startCoords: any[], endCoords: any[]) {
    if (!startCoords || !endCoords) return;
    const resp = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.join(
        ","
      )};${endCoords.join(
        ","
      )}?geometries=geojson&access_token=${token}`
    );
    const data = await resp.json();
    if (data.routes?.length > 0) {
      setRoute(data.routes[0].geometry);
    }
  }

  useEffect(() => {
    if (travel_start && travel_end) {
      fetchRoute(travel_start, travel_end);
    }
  }, [travelInfo]);

  const defaultCenter = [-46.6333, -23.5505];
  return (
    <View style={styles.mapaContainer}>
      <MapView style={{ flex: 1 }}>
        <Camera
          zoomLevel={10}
          centerCoordinate={
            (travel_start && travel_start.length === 2 && travel_start) ||
            (travel_end && travel_end.length === 2 && travel_end) ||
            defaultCenter
          }
        />

        {travel_start &&
          Array.isArray(travel_start) &&
          travel_start.length === 2 && (
            <PointAnnotation id="start" coordinate={travel_start}>
              <View style={styles.markerStart} />
            </PointAnnotation>
          )}

        {travel_end && Array.isArray(travel_end) && travel_end.length === 2 && (
          <PointAnnotation id="end" coordinate={travel_end}>
            <View style={styles.markerEnd} />
          </PointAnnotation>
        )}

        {route && (
          <ShapeSource
            id="routeSource"
            shape={{ type: "Feature", geometry: route, properties: {} }}
          >
            <LineLayer
              id="routeFill"
              style={{
                lineColor: "#007AFF",
                lineWidth: 4,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default TravelMapView;

const styles = StyleSheet.create({
  mapaContainer: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    elevation: 5,
  },
  markerStart: {
    width: 16,
    height: 16,
    backgroundColor: "green",
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 2,
  },
  markerEnd: {
    width: 16,
    height: 16,
    backgroundColor: "red",
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 2,
  },
});
