import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { theme } from "@/theme";
import { scheduleType } from "@/types/scheduleType.type";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput
} from "react-native";

export default function EditScheduleForm() {
    const { user } = useAuth();
  const {id, title, imageUrl} = useLocalSearchParams<scheduleType>();
  const [image, setImage] = useState('');
  const [value, setValue] = useState(title);
  const router = useRouter();
  
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão para acessar as fotos é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };



  async function uploadImageToSupabase(imageUri: string, userId: string) {
   
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    const arrayBuffer = decode(base64);

    const filePath = `${userId}/${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from("app_storage")
      .upload(filePath, arrayBuffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (error) {
      console.error("Erro ao fazer upload:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("app_storage")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  const handleEdit = async () => {
    
    const newImageUrl = image ? await uploadImageToSupabase(image, user.id) : imageUrl;

    const { data, error } = await supabase
      .from("Schedules")
      .update({ title: value, imageUrl: newImageUrl })
      .eq('id', id);

    if (error) {
      Alert.alert("Erro ao editar uma agenda", error.message);
      console.error(error);
    } else {
      Alert.alert("Alterações salvas!", "Agenda editada com sucesso");
      // @ts-ignore
      router.navigate("/(main)/(home)/(schedules)");
    }
  };


  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(value) => setValue(value)}
          placeholder="Título da agenda"
          placeholderTextColor="#999"
        />

        

        <Button
          title="Escolher Foto"
          onPress={pickImage}
          buttonStyle={[styles.button, styles.buttonSecondary]}
          textStyle={styles.buttonSecondaryText}
          hasShadow={false}
        />
        {image && <Image source={{ uri: image }} style={styles.image} />}


        <Button
          title="Editar"
          onPress={handleEdit}
          buttonStyle={[styles.button, styles.buttonPrimary]}
          textStyle={styles.buttonPrimaryText}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: theme.colors.white,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: theme.colors.lightGrey,
    color: theme.colors.textPrimary,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    backgroundColor: theme.colors.lightGrey,
    resizeMode: "cover",
  },
  button: {
    borderRadius: 10,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonPrimaryText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  buttonSecondaryText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
