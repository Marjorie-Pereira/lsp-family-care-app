import TravelMapView from '@/components/TravelMapView';
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
const TravelDetails = () => {
  return (
    <TravelMapView info={RASTREADOR_INFO} />
  )
}

export default TravelDetails