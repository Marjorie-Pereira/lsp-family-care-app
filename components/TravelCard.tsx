import { theme } from "@/theme";
import { eventType } from "@/types/event.type";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TravelCard = ({ viagem }: { viagem: eventType }) => {
  const formatarData = (data: Date) => {
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusViagemStyle = (status: string) => {
    if (status === "Programada") {
      return [styles.statusViagemPill, styles.statusProgramada];
    }
    if (status === "Concluída") {
      return [styles.statusViagemPill, styles.statusConcluida];
    }
    return [styles.statusViagemPill, styles.statusOutro];
  };

  return (
    <TouchableOpacity
      style={styles.cardViagem}
      onPress={() =>
        router.push({ pathname: "/travels/travelDetails", params: viagem })
      }
    >
      {/* Informações da Viagem */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardDestino}>{viagem.name}</Text>
        <Text style={styles.cardData}>
          {formatarData(new Date(viagem.event_date))}
        </Text>
      </View>

      {/* Status da Viagem */}
      {/* <View style={getStatusViagemStyle(viagem.status)}>
        <Text style={styles.statusViagemTexto}>{viagem.status}</Text>
      </View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardViagem: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardInfo: {
    flex: 1, // Permite que o texto quebre a linha se necessário
  },
  cardDestino: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardData: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusViagemPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 10, // Espaço entre a info e o status
  },
  statusViagemTexto: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
  },
  statusProgramada: {
    backgroundColor: theme.colors.primary, // Azul
  },
  statusConcluida: {
    backgroundColor: "#5eba75ff", // Verde
  },
  statusOutro: {
    backgroundColor: "#8E8E93", // Cinza
  },
});

export default TravelCard;
