import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
// Importe o decodificador
import { googleApiKey } from '@/constants/apikey';
import polyline from '@mapbox/polyline';

const TravelMapView = ({ info }: any) => {
    console.log(googleApiKey)
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
    const buscarRota = async () => {
      // Formata os pontos para a URL
      const originStr = `${origem.latitude},${origem.longitude}`;
      const destinationStr = `${destino.latitude},${destino.longitude}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${googleApiKey}`;

      try {
        const resposta = await fetch(url);
        const json = await resposta.json();

        if (json.routes.length > 0) {
          // Pega a string 'polyline encodada' da resposta
          const pontosEncodados = json.routes[0].overview_polyline.points;
          
          // Decodifica a string em um array de [lat, lng]
          const pontosDecodificados = polyline.decode(pontosEncodados);

          // Converte o array para o formato que o <Polyline> espera: [{ latitude: ..., longitude: ... }]
          const coordenadas = pontosDecodificados.map(ponto => ({
            latitude: ponto[0],
            longitude: ponto[1],
          }));

          setRota(coordenadas);

          // Ajusta o zoom do mapa para mostrar a rota inteira
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(coordenadas, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar rota:", error);
      }
    };

    if (origem) { // Boa prática: garantir que a origem existe antes de buscar
        buscarRota();
    }
  }, [origem]); // Dependa da 'origem' para refazer a busca se ela mudar

  // --- PARTE FALTANTE: O JSX DE RENDERIZAÇÃO ---
  return (
    <MapView
      ref={mapRef}
      style={styles.mapaContainer} // O MapView precisa de um 'style' para ser visível
      initialRegion={{ // Opcional, já que fitToCoordinates vai ajustar
        latitude: origem.latitude,
        longitude: origem.longitude,
        latitudeDelta: 0.1, // Zoom inicial
        longitudeDelta: 0.1,
      }}
    >
      {/* Marcador de Origem (Azul) */}
      <Marker
        coordinate={origem}
        title="Origem"
        pinColor="blue"
      />

      {/* Marcador de Destino (Vermelho) */}
      <Marker
        coordinate={destino}
        title="Destino"
        pinColor="red"
      />

      {/* AQUI ESTÁ A SOLUÇÃO:
        Renderiza o componente <Polyline> se o estado 'rota' tiver coordenadas.
      */}
      {rota.length > 0 && (
        <Polyline
          coordinates={rota}
          strokeColor="#007BFF" // Cor da linha (ex: azul)
          strokeWidth={5}       // Espessura da linha
        />
      )}
    </MapView>
  );
};

export default TravelMapView;
// ... (Resto do código: ViagemCard, ViagensScreen, Estilos)

// --- ATUALIZE OS ESTILOS ---
const styles = StyleSheet.create({
  // ... (todos os estilos anteriores)
  headerContainer: {
    padding: 15
  },
  mapaContainer: {
    height: 250, // Aumentei um pouco a altura para a rota
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    elevation: 5
  },
  mapa: {
    ...StyleSheet.absoluteFillObject,
  },
  // ... (resto dos estilos)
});