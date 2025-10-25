import { Stack } from "expo-router";

export default function Layout() {
    return(
        <Stack>
            
            <Stack.Screen name="index"  />
            <Stack.Screen name="form" options={{title: "Nova agenda"}} />
            <Stack.Screen name="editSchedule" options={{title: "Editar Agenda"}} />
            <Stack.Screen name="scheduleInfo" options={{title: "Agenda"}} />
            <Stack.Screen name="eventForm/[id]" options={{title: "Novo Evento"}} />
        </Stack>
    )
    
}