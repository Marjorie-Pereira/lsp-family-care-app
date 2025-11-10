import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Mail from "../assets/icons/Mail";
import ViewIcon from "../assets/icons/ViewIcon";
import ViewIconSlash from "../assets/icons/ViewIconSlash";
import Button from "../components/Button";
import Input from "../components/Input";
import ScreenWrapper from "../components/ScreenWrapper";
import { supabase } from "../lib/supabase";
import { theme } from "../theme";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [eyeIcon, setEyeIcon] = useState("hide");

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Por favor preencha todos os campos");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Login", error.message);

      return;
    }
  };
  return (
    <>
      <ScreenWrapper>
        <StatusBar barStyle={"dark-content"} />
        <View style={styles.container as StyleProp<ViewStyle>}>
          {/* title */}
          <View>
            <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
          </View>

          {/* form */}
          <View style={styles.form as StyleProp<ViewStyle>}>
            <Text style={{ fontSize: 20, color: theme.colors.textPrimary }}>
              Por favor insira suas credenciais
            </Text>

            <Input
              placeholder="Endereço de email"
              icon={<Mail />}
              onChangeText={(value: string) => (emailRef.current = value)}
            />
            <Input
              placeholder="Senha"
              icon={eyeIcon === "hide" ? <ViewIcon /> : <ViewIconSlash />}
              onChangeText={(value: string) => (passwordRef.current = value)}
              togglePassword={() => {
                setEyeIcon(eyeIcon === "hide" ? "show" : "hide");
              }}
              type="password"
              secureTextEntry={eyeIcon === "hide" ? true : false}
            />
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
            <Button title="Login" loading={loading} onPress={onSubmit} />
          </View>
          {/* footer */}
          <View style={styles.footer as StyleProp<ViewStyle>}>
            <Text style={styles.footerText as StyleProp<TextStyle>}>
              Não possui uma conta?{" "}
            </Text>
            <Pressable onPress={() => router.push("./signUp")}>
              <Text
                style={
                  [
                    styles.footerText,
                    {
                      color: theme.colors.primary,
                      fontWeight: theme.fonts.semibold,
                    },
                  ] as StyleProp<TextStyle>
                }
              >
                Cadastre-se
              </Text>
            </Pressable>
          </View>
        </View>
      </ScreenWrapper>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  form: {
    gap: 20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "600",
    color: theme.colors.textPrimary,
    fontSize: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
});
