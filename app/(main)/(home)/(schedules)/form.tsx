import Button from "@/components/Button";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { familyMemberType } from "@/types/familyMember.type";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
  const [image, setImage] = useState("");
   const [familyMembers, setFamilyMembers] = useState<familyMemberType[]>([]);
  const [familyMemberId, setFamilyMemberId] = useState(familyMembers[0]?.id);
  const router = useRouter();

 
  const fetchFamilyMembers = async () => {
    const { data, error } = await supabase.from("FamilyMembers").select("*");

    if (error) console.error(error);
    else setFamilyMembers(data);
  };
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
    if (!titleRef.current && !familyMemberId && !image) {
      Alert.alert(
        "Nada para compartilhar",
        "Preencha os campos ou escolha uma imagem."
      );
      return;
    }
    try {
      const scheduleOwner = familyMembers.find((m) => m.id === familyMemberId)?.name
      await Share.share({
        message: `Nome: ${titleRef.current}\nTitular: ${scheduleOwner}`,
        url: image,
      });
    } catch (error: any) {
      alert("Erro ao compartilhar: " + error.message);
    }
  };

  const handleCreate = async () => {
    let title = titleRef.current.trim();
    

    const { data, error } = await supabase
      .from("Schedules")
      .insert({ title, imageUrl: image, family_member_id: familyMemberId });

    if (error) {
      Alert.alert("Erro ao criar uma agenda", error.message);
      console.error(error)
    } else {
      Alert.alert("Agenda criada!", "Novo agenda adicionado com sucesso");
      console.log("data from form", data)
      // @ts-ignore
      router.navigate("/(main)/(home)/(schedules)", data);
    }
  };

  

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          // value={titleRef.current}
          onChangeText={(value: string) => (titleRef.current = value)}
          placeholder="Título da agenda"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Familiar associado:</Text>
        <Picker
          onValueChange={(itemValue: string) => {
            setFamilyMemberId(itemValue);
            
          }}
        >
          {familyMembers.map((member, index) => {
            return (
              <Picker.Item label={member.name} value={member.id} key={index} />
            );
          })}
        </Picker>

        <Button
          title="Escolher Foto"
          onPress={pickImage}
          buttonStyle={[styles.button, styles.buttonSecondary]}
          textStyle={styles.buttonSecondaryText}
          hasShadow={false}
        />
        {image && <Image source={{ uri: image }} style={styles.image} />}

        <Button
          title="Compartilhar com..."
          onPress={handleShare}
          buttonStyle={[styles.button, styles.buttonSecondary]}
          textStyle={styles.buttonSecondaryText}
          hasShadow={false}
        />

        <Button
          title="Criar"
          onPress={handleCreate}
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
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary
  },
  buttonSecondaryText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
