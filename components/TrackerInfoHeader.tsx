import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const TrackerInfoHeader = ({info}: any) => {
 
  const getStatusStyle = () => {
    return info.status === "Online"
      ? [styles.statusTexto, styles.statusOnline]
      : [styles.statusTexto, styles.statusOffline];
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.tituloSecao}>Meu Rastreador</Text>

      {/* --- Placeholder do Mapa ---
          Aqui você usaria o componente <MapView /> da biblioteca 'react-native-maps'
          Mostrando um placeholder por enquanto.
      */}
      <View style={styles.mapaPlaceholder}>
        {/*
        <MapView
          style={styles.mapa}
          initialRegion={{
            ...info.ultimaLocalizacao,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={info.ultimaLocalizacao} title={info.nome} />
        </MapView>
        */}
        <Text style={styles.mapaTexto}>
          (Aqui entraria o Mapa com a localização)
        </Text>
      </View>
      {/* --- Fim do Placeholder --- */}

      {/* Card de Status do Dispositivo */}
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

      {/* Título da próxima seção */}
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
  mapaPlaceholder: {
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilo para o mapa real (descomente ao usar)
  // mapa: {
  //   ...StyleSheet.absoluteFillObject,
  //   borderRadius: 12,
  // },
  mapaTexto: {
    color: "#666",
    fontSize: 16,
  },
  statusCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    elevation: 3, // Sombra Android
    shadowColor: "#000", // Sombra iOS
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
    color: "#28a745", // Verde
    fontWeight: "bold",
  },
  statusOffline: {
    color: "#dc3545", // Vermelho
    fontWeight: "bold",
  },
});

export default TrackerInfoHeader;
