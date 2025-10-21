import FloatingActionButton from "@/components/FloatingActionButton";
import { theme } from "@/constants/theme";
import { scheduleType } from "@/types/scheduleType.type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import {
  CalendarProvider,
  LocaleConfig,
  WeekCalendar,
} from "react-native-calendars";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function ScheduleInfo() {
  const router = useRouter();
  const scheduleInfo = {...useLocalSearchParams<scheduleType>()} 

  LocaleConfig.locales["pt"] = {
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNamesShort: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    dayNames: [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    today: "Hoje",
  };
  LocaleConfig.defaultLocale = "pt";

  const hoje = new Date().toISOString().split("T")[0];
  const [selected, setSelected] = useState(hoje);
  const eventos: any = {
    "2025-10-06": [{ id: 1, title: "Consulta pediatra" }],
    "2025-10-07": [{ id: 2, title: "Reunião com a escola" }],
    "2025-10-09": [{ id: 3, title: "Vacina do bebê" }],
  };

  const eventosDoDia = eventos[selected] || [];

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? "45deg" : "0deg";

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  return (
    <>
      <CalendarProvider
        date={selected}
        onDateChanged={setSelected}
        showTodayButton
        theme={{
          todayButtonTextColor: theme.colors.primary,
        }}
      >
        <View style={styles.container}>
          <WeekCalendar
            markedDates={{
              [selected]: {
                selected: true,
                selectedColor: theme.colors.primary,
              },
            }}
            firstDay={1}
            theme={{
              todayTextColor: theme.colors.primary,
            }}
          />

          <Text style={styles.titulo}>
            Eventos de {new Date(selected).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
          </Text>

          <FlatList
            data={eventosDoDia}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.evento}>
                <Text style={styles.eventoTexto}>{item.title}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.semEventos}>Nenhum evento neste dia</Text>
            }
          />
        </View>
        <View style={styles.buttonContainer}>
          <AnimatedPressable
            onPress={handlePress}
            style={[styles.shadow, mainButtonStyles.button]}
          >
            <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
              +
            </Animated.Text>
          </AnimatedPressable>
          <FloatingActionButton
            isExpanded={isExpanded}
            index={1}
            buttonLetter={"Novo evento"}
            onPress={() => router.push("/eventForm")}
          />
          <FloatingActionButton
            isExpanded={isExpanded}
            index={2}
            buttonLetter={"Editar agenda"}
            onPress={() => router.push({pathname: "/editSchedule", params: {...scheduleInfo}})}
          />
        </View>
      </CalendarProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  evento: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  eventoTexto: {
    fontSize: 16,
  },
  semEventos: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
  },
  buttonContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    right: 20,
    bottom: 20,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 24,
    color: "#f8f9ff",
  },
});
