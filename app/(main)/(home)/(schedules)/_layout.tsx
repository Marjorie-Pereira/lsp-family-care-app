import { Stack } from "expo-router";

export default function Layout() {
    return(
        <Stack>
            <Stack.Screen name="form" />
            <Stack.Screen name="index" />
        </Stack>
    )
    
}