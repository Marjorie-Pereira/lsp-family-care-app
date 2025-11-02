import { mapboxPublicToken } from "@/constants/mapboxPublicKey";
import Mapbox from "@rnmapbox/maps";
import { StyleSheet, View } from "react-native";

Mapbox.setAccessToken(mapboxPublicToken);

export default function MapBoxView() {
  return (
    <View style={styles.page}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.Camera
          zoomLevel={12}
          centerCoordinate={[-46.6333, -23.5505]} // São Paulo
        />
        <Mapbox.PointAnnotation
          id="ponto"
          coordinate={[-46.6333, -23.5505]}
          children={<></>}
        ></Mapbox.PointAnnotation>
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
