import FloatingActionButton from '@/components/FloatingActionButton';
import { theme } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Schedules() {
  
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  }

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? '45deg' : '0deg';

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue)}
      ]
    };
  });

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.buttonContainer}>
          <AnimatedPressable
            onPress={handlePress}
            style={[styles.shadow, mainButtonStyles.button]}>
            <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
              +
            </Animated.Text>
          </AnimatedPressable>
          <FloatingActionButton
            isExpanded={isExpanded}
            index={1}
            buttonLetter={'M'}
          />
          <FloatingActionButton
            isExpanded={isExpanded}
            index={2}
            buttonLetter={'W'}
          />
          <FloatingActionButton
            isExpanded={isExpanded}
            index={3}
            buttonLetter={'S'}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 24,
    color: '#f8f9ff',
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
    height: 260,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});