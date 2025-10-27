import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
        <Stack.Screen name='index' options={{title: "Viagens"}}/>
        <Stack.Screen name='travelDetails' options={{title: "Detalhes da Viagem"}}/>
       
    </Stack>
  )
}