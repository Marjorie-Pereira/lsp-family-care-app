import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { scheduleType } from "@/types/scheduleType.type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useFocusEffect, useNavigation, useRouter } from "expo-router";
import { JSX, useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState<scheduleType[]>([]);
  const [inSelectionMode, setInSelectionMode] = useState(false);

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const fetchSchedules = async () => {
    const { data, error } = await supabase.from("Schedules").select("*");

    if (error) console.error(error);
    else setSchedules(data);
  };

  const handleLongPress = (item: scheduleType) => {
    setInSelectionMode(true);

    setSelectedItems((prevSelected) => new Set(prevSelected).add(item.id));
  };

  const handlePress = (item: scheduleType) => {
    const id = item.id;
    if (inSelectionMode) {
      const newSelectedItems = new Set(selectedItems);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
      setSelectedItems(newSelectedItems);

      if (newSelectedItems.size === 0) {
        setInSelectionMode(false);
      }
    } else {
    
      router.push({
        pathname: "/scheduleInfo",
        params: {...item},
      });
    }
  };

  const exitSelectionMode = () => {
    setInSelectionMode(false);
    setSelectedItems(new Set());
  };

  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedItems);

    const { data, error } = await supabase
      .from("Schedules")
      .delete()
      .in("id", idsToDelete);

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível deletar as agendas.");
    } else {
      Alert.alert("Sucesso", `${idsToDelete.length} agenda(s) deletada(s).`);
      fetchSchedules();
      exitSelectionMode();
    }
  };

  const deleteSelectedItems = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que quer deletar ${selectedItems.size} item(ns)?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: handleBulkDelete,
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();

      exitSelectionMode();
    }, [])
  );

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const isExpanded = useSharedValue(false);

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

  const renderItem: ({ item }: { item: scheduleType }) => JSX.Element = ({
    item,
  }) => {
    const isSelected = selectedItems.has(item.id);
    return (
      <Pressable
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item)}
        style={[
          {
    
            marginBottom: 10,
            width: '100%'
          },
          isSelected && styles.itemSelected,
        ]}
      >
        <View>
          {isSelected && (
            <View style={styles.checkbox}>
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            </View>
          )}
          <ImageBackground
            source={
              item.imageUrl 
                ? { uri: item.imageUrl } 
                : require("../../../../assets/img/placeholder_schedule.png")
            }
            resizeMode="cover"
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
          >
            <Text style={styles.texto}>{item.title}</Text>
          </ImageBackground>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          // Define o título com base no modo de seleção
          title: inSelectionMode
            ? `${selectedItems.size} selecionado(s)`
            : "Minhas Agendas", // <-- Defina seu título padrão aqui

          // Define o botão da esquerda (Cancelar)
          headerLeft: () =>
            inSelectionMode ? (
              <Pressable
                onPress={exitSelectionMode}
                style={{ marginRight: 20 }}
              >
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            ) : undefined, // Some quando não está em seleção

          // Define o botão da direita (Deletar)
          headerRight: () =>
            inSelectionMode ? (
              <Pressable onPress={deleteSelectedItems}>
                <Ionicons name="trash-outline" size={24} color="black" />
              </Pressable>
            ) : undefined, // Some quando não está em seleção
        }}
      />
      <View style={styles.mainContainer}>
          <FlatList
            data={schedules}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedItems}
          />

          {/* Nova agenda button */}
          <View style={styles.buttonContainer}>
            <AnimatedPressable
              onPress={() => router.push("/form")}
              style={[styles.shadow, mainButtonStyles.button]}
            >
              <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
                +
              </Animated.Text>
            </AnimatedPressable>
          </View>
        </View>
    </>
  );
}

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

const styles = StyleSheet.create({
  mainContainer: {
    position: "relative",
    height: "100%",
    width: "100%",
    display: "flex",
    paddingTop: 10
  },
  buttonContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    right: 20,
    bottom: 10,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backgroundImage: {
    width: "100%",
    height: 120,
    padding: 20,
    justifyContent: "flex-end",
    borderRadius: 12,
    overflow: "hidden",
    marginLeft: 18,
  },
  imageStyle: {
    borderRadius: 12,
  },
  texto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  itemSelected: {
    backgroundColor: "#e0e0ff",
  },
  checkbox: {
    marginLeft: 16,
  },
});
