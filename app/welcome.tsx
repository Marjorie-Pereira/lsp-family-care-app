import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
const Welcome = () => {
  const router = useRouter();
  return (
    <>
      <ScreenWrapper>
        <StatusBar style="dark" />
        <View style={styles.container as StyleProp<ViewStyle>}>
          {/* image */}
          {/* title */}
          <View style={{ gap: 20 }}>
            <Text style={styles.title}>Family Care</Text>
            <Text style={styles.punchline}>
              Cuidar de quem você ama não precisa ser difícil...
            </Text>
          </View>

          {/* footer */}
          <View style={styles.footer}>
            <Button
              title="Começar"
              buttonStyle={{ marginHorizontal: 3 }}
              onPress={() => {
                router.push("./signUp");
              }}
            />

            <View style={styles.bottomTextContainer}>
              <Text style={styles.loginText}>Já tem uma conta?</Text>
              <Pressable onPress={() => router.push("./login")}>
                <Text
                  style={[
                    styles.loginText,
                    { color: theme.colors.primary, fontWeight: "600" },
                  ]}
                >
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    </>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 32,
    textAlign: "center",
    fontWeight: "800",
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: 10,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.textPrimary,
    fontSize: 12,
  },
});
