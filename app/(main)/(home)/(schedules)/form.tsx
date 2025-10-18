import Button from "@/components/Button";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { familyMemberType } from "@/types/familyMember.type";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

export default function FormScreen() {
  const titleRef = useRef("");
  const imageRef = useRef("");
  const familyMemberRef = useRef({});
  const [image, setImage] = useState("");
  const [familyMember, setFamilyMember] = useState<familyMemberType>();
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

  const handleShare = async () => {
    if (!titleRef.current && !familyMember && !image) {
      Alert.alert(
        "Nada para compartilhar",
        "Preencha os campos ou escolha uma imagem."
      );
      return;
    }
    try {
      await Share.share({
        message: `Nome: ${titleRef.current}\nTitular: ${familyMember}`,
        url: image,
      });
    } catch (error: any) {
      alert("Erro ao compartilhar: " + error.message);
    }
  };

  const handleCreate = async () => {
    let title = titleRef.current.trim();
    let image = imageRef.current.trim();
    let familyMember = familyMemberRef.current;

    const { data, error } = await supabase
      .from("Schedules")
      .insert({ title, iamgeUrl: image, familyMember });

    if (error) {
      Alert.alert("Erro ao criar uma agenda", error.message);
    } else {
      Alert.alert("Agenda criada!", "Novo agenda adicionado com sucesso");
      // @ts-ignore
      router.navigate("index", data);
    }
  };

  const [familyMembers, setFamilyMembers] = useState<familyMemberType[]>([]);
  const fetchFamilyMembers = async () => {
    const { data, error } = await supabase.from("FamilyMembers").select("*");

    if (error) console.error(error);
    else setFamilyMembers(data);
  };

  useEffect(() => {
    fetchFamilyMembers();
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={titleRef.current}
        onChangeText={(value: string) => (titleRef.current = value)}
        placeholder="Título da agenda"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Familiar associado:</Text>
      <Picker
        selectedValue={familyMember}
        onValueChange={(itemValue, itemIndex) => {
          setFamilyMember(itemValue);
        }}
      >
        {familyMembers.map((member, index) => {
          return (
            <Picker.Item label={member.name} value={member.name} key={index} />
          );
        })}
      </Picker>

      <Button
        title="Escolher Foto"
        onPress={pickImage}
        buttonStyle={[styles.button, styles.buttonSecondary]}
        textStyle={styles.buttonSecondaryText}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button
        title="Compartilhar com..."
        onPress={handleShare}
        buttonStyle={[styles.button, styles.buttonSecondary]}
        textStyle={styles.buttonSecondaryText}
      />

      <Button
        title="Criar"
        onPress={handleCreate}
        buttonStyle={[styles.button, styles.buttonPrimary]}
        textStyle={styles.buttonPrimaryText}
      />
    </ScrollView>
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
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
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
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  buttonSecondaryText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
