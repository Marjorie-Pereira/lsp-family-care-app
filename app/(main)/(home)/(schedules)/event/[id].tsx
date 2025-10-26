import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { eventType } from "@/types/event.type";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Event = () => {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<eventType>();
  useEffect(() => {
    async function getEvent() {
      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .eq("id", id);
      if (error) {
        console.error(error);
        router.back();
      } else {
        setEvent(data[0]);
      }
    }

    getEvent();
  }, []);

  const formatarData = (dateTime: Date | undefined) => {
    if (!dateTime) return "Data não definida";
    const dateString = dateTime.toLocaleString().split("T")[0];

    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Evento:</Text>
          <Text style={styles.info}>{event?.name}</Text>

          <Text style={styles.label}>Data e Hora:</Text>
          <Text style={styles.info}>{formatarData(event?.event_date)}</Text>

          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.info}>{event?.type}</Text>
        </View>

        <View style={styles.botoesContainer}>
          <TouchableOpacity style={[styles.botao, styles.botaoEditar]}>
            <Text style={styles.botaoTexto}>Editar Evento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao, styles.botaoExcluir]}>
            <Text style={styles.botaoTexto}>Excluir Evento</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
    padding: 20,

    justifyContent: "space-between",
  },
  infoBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
  },
  info: {
    fontSize: 20,
    color: "#222",
    marginBottom: 10,
  },
  botoesContainer: {
    marginTop: 20,
  },
  botao: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  botaoEditar: {
    backgroundColor: theme.colors.primary,
  },
  botaoExcluir: {
    backgroundColor: theme.colors.dangerBtn,
  },
  botaoTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Event;
