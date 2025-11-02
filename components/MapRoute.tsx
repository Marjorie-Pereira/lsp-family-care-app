import { mapboxPublicToken } from "@/constants/mapboxPublicKey";
import Mapbox, {
  Camera,
  LineLayer,
  MapView,
  PointAnnotation,
  ShapeSource,
} from "@rnmapbox/maps";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "./Button";

Mapbox.setAccessToken(mapboxPublicToken);

export default function MapRoute({
  onConfirmRoute,
}: {
  onConfirmRoute: (start: any[] | null, end: any[] | null) => void;
}) {
  const [start, setStart] = useState<any[] | null>(null); // [lng, lat]
  const [end, setEnd] = useState<any[] | null>(null);
  const [route, setRoute] = useState(null);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [startSuggestions, setStartSuggestions] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);
  const [isSelectingStart, setIsSelectingStart] = useState(false);

  async function getCoordinates(query: string) {
    if (!query) return null;
    const resp = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapboxPublicToken}&limit=1`
    );
    const data = await resp.json();
    if (data?.features?.length > 0) {
      return data.features[0].geometry.coordinates;
    }
    return null;
  }

  async function getSuggestions(query: string) {
    if (!query) return [];
    const resp = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?autocomplete=true&language=pt-BR&limit=5&access_token=${mapboxPublicToken}`
    );
    const data = await resp.json();
    return data.features || [];
  }

  async function fetchRoute(startCoords: any[], endCoords: any[]) {
    if (!startCoords || !endCoords) return;
    const resp = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.join(
        ","
      )};${endCoords.join(
        ","
      )}?geometries=geojson&access_token=${mapboxPublicToken}`
    );
    const data = await resp.json();
    if (data.routes?.length > 0) {
      setRoute(data.routes[0].geometry);
    }
  }

  useEffect(() => {
    if (start && end) fetchRoute(start, end);
  }, [start, end]);

  async function handleSearchStart() {
    const coords = await getCoordinates(startInput);
    if (coords) setStart(coords);
  }

  async function handleSearchEnd() {
    const coords = await getCoordinates(endInput);
    if (coords) setEnd(coords);
  }

  const defaultCenter = [-46.6333, -23.5505]; // São Paulo fallback

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Ponto de partida"
          style={styles.input}
          value={startInput}
          onFocus={() => setIsSelectingStart(true)}
          onChangeText={async (text) => {
            setStartInput(text);
            const results = await getSuggestions(text);
            setStartSuggestions(results);
          }}
        />

        <TextInput
          placeholder="Destino"
          style={styles.input}
          value={endInput}
          onFocus={() => setIsSelectingStart(false)}
          onChangeText={async (text) => {
            setEndInput(text);
            const results = await getSuggestions(text);
            setEndSuggestions(results);
          }}
        />

        {(isSelectingStart ? startSuggestions : endSuggestions).length > 0 && (
          <View style={styles.suggestionsContainer}>
            {(isSelectingStart ? startSuggestions : endSuggestions).map(
              (item) => (
                <View
                  key={item.id}
                  style={styles.suggestionItem}
                  onTouchEnd={() => {
                    const coords = item.geometry.coordinates;
                    if (isSelectingStart) {
                      setStartInput(item.place_name);
                      setStart(coords);
                      setStartSuggestions([]);
                    } else {
                      setEndInput(item.place_name);
                      setEnd(coords);
                      setEndSuggestions([]);
                    }
                  }}
                >
                  <View>
                    <Text style={styles.suggestionText}>{item.place_name}</Text>
                  </View>
                </View>
              )
            )}
          </View>
        )}
      </View>

      <MapView style={styles.map}>
        <Camera
          zoomLevel={10}
          centerCoordinate={
            (start && start.length === 2 && start) ||
            (end && end.length === 2 && end) ||
            defaultCenter
          }
        />

        {start && Array.isArray(start) && start.length === 2 && (
          <PointAnnotation id="start" coordinate={start}>
            <View style={styles.markerStart} />
          </PointAnnotation>
        )}

        {end && Array.isArray(end) && end.length === 2 && (
          <PointAnnotation id="end" coordinate={end}>
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
      <Button
        title="Salvar trajeto"
        buttonStyle={{
          position: "absolute",
          bottom: 25,
          left: 23,
          width: "90%",
        }}
        onPress={() => onConfirmRoute(start, end)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    elevation: 4,
  },
  input: {
    backgroundColor: "#f5f5f5",
    marginVertical: 4,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
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
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 6,
    marginTop: 4,
    maxHeight: 150,
    overflow: "scroll",
    elevation: 3,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    color: "#333",
    fontSize: 14,
  },
});
