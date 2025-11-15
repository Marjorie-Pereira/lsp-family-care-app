import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function _layout() {
  return (
    <AuthProvider>
      <SupabaseProvider>
        <MainLayout />
      </SupabaseProvider>
    </AuthProvider>
  );
}

const MainLayout = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  return (
    // <Stack screenOptions={{headerShown: false}} />
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="signUp" options={{ title: "Cadastre-se" }} />
    </Stack>
  );
};
