import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const TrackerInfoHeader = ({ info }: any) => {
  const getStatusStyle = () => {
    return info.status === "Online"
      ? [styles.statusTexto, styles.statusOnline]
      : [styles.statusTexto, styles.statusOffline];
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.tituloSecao}>Meu Rastreador</Text>

      

      <View style={styles.mapaContainer}>
        <MapView
          style={styles.mapa}
          
          initialRegion={{
            latitude: info.ultimaLocalizacao.latitude,
            longitude: info.ultimaLocalizacao.longitude,
            latitudeDelta: 0.01, 
            longitudeDelta: 0.01, 
          }}
        //   scrollEnabled={false}
          // zoomEnabled={false}
        >
          
          <Marker
            coordinate={info.ultimaLocalizacao}
            title={info.nome}
            description={`Bateria: ${info.bateria}%`}
          />
        </MapView>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusLinha}>
          <MaterialCommunityIcons name="car-connected" size={22} color="#333" />
          <Text style={styles.statusNome}>{info.nome}</Text>
        </View>
        <View style={styles.statusLinha}>
          <MaterialCommunityIcons
            name="signal-cellular-3"
            size={20}
            color="#333"
          />
          <Text style={getStatusStyle()}>{info.status}</Text>
        </View>
        <View style={styles.statusLinha}>
          <MaterialCommunityIcons name="battery-80" size={20} color="#333" />
          <Text style={styles.statusTexto}>{info.bateria}% Bateria</Text>
        </View>
      </View>

      <Text style={[styles.tituloSecao, { marginTop: 20 }]}>
        Viagens Programadas
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 10,
  },
  tituloSecao: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginVertical: 15,
  },
  mapaContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden", 
    backgroundColor: "#e0e0e0",
  },
  mapa: {
    ...StyleSheet.absoluteFillObject,
  },

  mapaTexto: {
    color: "#666",
    fontSize: 16,
  },
  statusCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusNome: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  statusTexto: {
    fontSize: 16,
    marginLeft: 10,
    color: "#555",
  },
  statusOnline: {
    color: "#28a745", 
    fontWeight: "bold",
  },
  statusOffline: {
    color: "#dc3545", 
    fontWeight: "bold",
  },
});

export default TrackerInfoHeader;
