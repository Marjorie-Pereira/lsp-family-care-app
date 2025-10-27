import TrackerInfoHeader from "@/components/TrackerInfoHeader";
import TravelCard from "@/components/TravelCard";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RASTREADOR_INFO = {
  id: 'rastreador-01',
  nome: 'Meu Carro',
  status: 'Online', // Pode ser 'Online', 'Offline', 'Economia'
  bateria: 85,
  ultimaLocalizacao: {
    latitude: -23.55052,
    longitude: -46.633301,
  },
};

const VIAGENS_PROGRAMADAS = [
  {
    id: 'v1',
    destino: 'São Paulo, SP',
    data: new Date('2025-10-28T08:00:00'),
    status: 'Programada',
  },
  {
    id: 'v2',
    destino: 'Rio de Janeiro, RJ',
    data: new Date('2025-11-05T10:30:00'),
    status: 'Programada',
  },
  {
    id: 'v3',
    destino: 'Visita ao Cliente (Campinas)',
    data: new Date('2025-10-24T18:00:00'),
    status: 'Concluída',
  },
];

const TravelTab = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={VIAGENS_PROGRAMADAS}
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
    backgroundColor: '#f0f2f5', // Um fundo cinza claro
  },
  listaContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
 
  listaVazia: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});

