import { Stack } from "expo-router";

export default function Layout() {
    return(
        <Stack>
            
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="form" options={{title: "Nova agenda"}} />
            <Stack.Screen name="edit" options={{title: "Editar agenda"}} />
        </Stack>
    )
    
}