import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { scheduleType } from "@/types/scheduleType.type";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<scheduleType[]>([]);
  const [data, setData] = useState(schedules);
  const [inSelectionMode, setInSelectionMode] = useState(false);
  
  
  const [selectedItems, setSelectedItems] = useState(new Set());
  
 
  const handleLongPress = (id: string) => {
    setInSelectionMode(true);
  
    setSelectedItems(prevSelected => new Set(prevSelected).add(id));
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    router.push("/form");
  };

  
  const fetchSchedules = async () => {
    const { data, error } = await supabase.from("Schedules").select("*");

    if (error) console.error(error);
    else setSchedules(data);
  };

  useEffect(() => {
    fetchSchedules();
  }, [schedules]);

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
      <ScrollView>
        <SafeAreaView>
          <View style={styles.mainContainer}>
            {/* Schedules containers */}
            {schedules.map((item, index: number) => {
              const scheduleJson = JSON.stringify(item);
              return (
                <Pressable
                  key={index}
                  onPress={() =>
                    router.push({
                      pathname: "/scheduleInfo",
                      params: { scheduleJson },
                    })
                  }
                  style={{
                    marginHorizontal: 16,
                    marginBottom: 10,
                    width: "100%",
                  }}
                >
                  <View>
                    <ImageBackground
                      source={{ uri: item.imageUrl }}
                      resizeMode="cover"
                      style={styles.backgroundImage}
                      imageStyle={styles.imageStyle}
                    >
                      <Text style={styles.texto}>{item.title}</Text>
                    </ImageBackground>
                  </View>
                </Pressable>
              );
            })}

            {/* Nova agenda button */}
            <View style={styles.buttonContainer}>
              <AnimatedPressable
                onPress={handlePress}
                style={[styles.shadow, mainButtonStyles.button]}
              >
                <Animated.Text
                  style={[plusIconStyle, mainButtonStyles.content]}
                >
                  +
                </Animated.Text>
              </AnimatedPressable>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
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
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    right: 20,
    bottom: 0,
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
    padding: 20, // espaço interno para o conteúdo
    justifyContent: "flex-end",
    borderRadius: 12,
    overflow: "hidden",
    marginLeft: 18,
  },
  imageStyle: {
    borderRadius: 12, // arredondamento aplicado na imagem
  },
  texto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
