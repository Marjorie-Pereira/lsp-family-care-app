import TrackerInfoHeader from "@/components/TrackerInfoHeader";
import TravelCard from "@/components/TravelCard";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RASTREADOR_INFO = {
  id: "rastreador-01",
  nome: "Meu Carro",
  status: "Online", // Pode ser 'Online', 'Offline', 'Economia'
  bateria: 85,
  ultimaLocalizacao: {
    latitude: -23.55052,
    longitude: -46.633301,
  },
};

const TravelTab = () => {
  const [travels, setTravels] = useState<any[]>([]);

  async function fetchTravels() {
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .eq("type", "Viagem");

    if (error) {
      Alert.alert(error.message);
    } else {
      setTravels(data);
      console.log(data);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTravels();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={travels}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<TrackerInfoHeader info={RASTREADOR_INFO} />}
        renderItem={({ item }) => <TravelCard viagem={item} />}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>Nenhuma viagem programada.</Text>
        }
        contentContainerStyle={styles.listaContainer}
      />
    </SafeAreaView>
  );
};

export default TravelTab;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Um fundo cinza claro
  },
  listaContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  listaVazia: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#666",
  },
});
