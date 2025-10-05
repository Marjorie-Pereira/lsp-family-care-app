import { theme } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FloatingActionButton = ({ isExpanded, index, buttonLetter }: any) => {
  const animatedStyles = useAnimatedStyle(() => {
    const moveValue = isExpanded.value ? OFFSET * index : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    const delay = index * 100;

    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });

  return (
    <AnimatedPressable style={[animatedStyles, styles.shadow, styles.button]}>
      <Animated.Text style={styles.content}>{buttonLetter}</Animated.Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  content: {
    color: theme.colors.primary,
    fontWeight: 500,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: "#82cab2",
    position: "absolute",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -2,
    flexDirection: "row",
  },
});

export default FloatingActionButton;