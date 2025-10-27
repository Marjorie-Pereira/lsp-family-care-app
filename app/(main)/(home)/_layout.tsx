import { theme } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          title: "Início",
          headerLeft: () => <DrawerToggleButton />,
        }}
      />

      <Tabs.Screen
        name="(schedules)"
        options={{
          headerShown: false,
          tabBarLabel: "Agendas",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="calendar-clear-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="travels"
        options={{
          headerShown: false,
          tabBarLabel: "Viagens",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      /> 
    </Tabs>
  );
}
