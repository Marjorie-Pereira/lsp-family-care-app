import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ScheduleInfo() {
    const router = useRouter()
    return (
        <View>
            <Pressable onPress={() => router.push("/edit")}>
                <Text >
                    Editar agenda
                </Text>
            </Pressable>
        </View>
    )
}