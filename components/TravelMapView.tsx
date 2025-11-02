import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapBoxView from "./Map";
// Importe o decodificador

const TravelMapView = ({ info }: any) => {
  // Estado para armazenar as coordenadas da rota
  const [rota, setRota] = useState<any[]>([]);
  // Referência para o componente MapView
  const mapRef = useRef<any>(null);

  // Ponto de origem (do rastreador)
  const origem = info.ultimaLocalizacao;
  // Ponto de destino (vamos pegar a primeira viagem programada)
  const destino = { latitude: -22.9068, longitude: -43.1729 }; // Coordenadas do Rio de Janeiro

  // useEffect para buscar a rota (SEU CÓDIGO - ESTÁ CORRETO)
  useEffect(() => {
    const buscarRota = async () => {};

    if (origem) {
      // Boa prática: garantir que a origem existe antes de buscar
      buscarRota();
    }
  }, [origem]); // Dependa da 'origem' para refazer a busca se ela mudar

  // --- PARTE FALTANTE: O JSX DE RENDERIZAÇÃO ---
  return <MapBoxView />;
};

export default TravelMapView;
// ... (Resto do código: ViagemCard, ViagensScreen, Estilos)

// --- ATUALIZE OS ESTILOS ---
const styles = StyleSheet.create({
  // ... (todos os estilos anteriores)
  headerContainer: {
    padding: 15,
  },
  mapaContainer: {
    height: 250, // Aumentei um pouco a altura para a rota
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    elevation: 5,
  },
  mapa: {
    ...StyleSheet.absoluteFillObject,
  },
  // ... (resto dos estilos)
});
