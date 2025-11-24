import { trackerInfo } from "@/app/(main)/(home)/travels";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface TrackerInfoHeaderProps {
  info: trackerInfo;
}
const TrackerInfoHeader = ({ info }: TrackerInfoHeaderProps) => {
  // const getStatusStyle = () => {
  //   return info.status === "Online"
  //     ? [styles.statusTexto, styles.statusOnline]
  //     : [styles.statusTexto, styles.statusOffline];
  // };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.tituloSecao}>Meu Rastreador</Text>

      <View style={styles.statusCard}>
        <View style={styles.statusLinha}>
          <MaterialCommunityIcons name="car-connected" size={22} color="#333" />
          <Text style={styles.statusNome}>{info?.name}</Text>
        </View>
        <View style={styles.statusLinha}>
          <MaterialCommunityIcons
            name="signal-cellular-3"
            size={20}
            color="#333"
          />
          {/* <Text style={getStatusStyle()}>{info.status}</Text> */}
        </View>
        <View style={styles.statusLinha}>
          <MaterialCommunityIcons name="battery-80" size={20} color="#333" />
          <Text style={styles.statusTexto}>
            {info?.batteryPercent}% Bateria
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  tituloSecao: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginVertical: 15,
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
