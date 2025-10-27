import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function Modal() {
  const router = useRouter();
  const { modalLabel, buttonTitle, ...memberInfo } = useLocalSearchParams();

  const handleAddFamilyMember = async () => {
    console.log("Family Member Added!");
    let memberName = nameRef.current.trim();
    let memberAge = ageRef.current.trim();
    let memberPhone = phoneRef.current.trim();
    let memberRelation =
      selectedRelation === "Outro"
        ? relationRef.current.trim()
        : selectedRelation;

    const { data, error } = await supabase.from("FamilyMembers").insert({
      name: memberName,
      age: memberAge,
      phone: memberPhone,
      relation_type: memberRelation,
    });

    if (error) {
      Alert.alert("Erro ao adicionar membro", error.message);
    } else {
      Alert.alert("Novo Membro", "Novo familiar adicionado com sucesso");
      // @ts-ignore
      router.navigate("/(main)/(family)", data);
    }
  };

  const handleUpdateFamilyMember = async () => {
    let relation_type =
      selectedRelation === "Outro" ? relation : selectedRelation;
    const { error } = await supabase
      .from("FamilyMembers")
      .update({ name, age, phone, relation_type })
      .eq("id", memberInfo.id);

    if (error) console.error(error);
    else Alert.alert("Editar Familiar", "Familiar Editado com Sucesso!");
    router.navigate("/(main)/(family)");
  };

  const nameRef = useRef("");
  const ageRef = useRef("");
  const phoneRef = useRef("");
  const relationRef = useRef("");

  const [selectedRelation, setSelectedRelation] = useState("Filho(a)");
  const [name, setName] = useState(memberInfo.name ?? null);
  const [age, setAge] = useState(memberInfo.age ?? null);
  const [phone, setPhone] = useState(memberInfo.phone ?? null);
  const [relation, setRelation] = useState(memberInfo.relation_type ?? null);

  return (
    <>
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={{ fontSize: 20, color: theme.colors.textPrimary }}>
            Preencha os campos com as informações necessárias do familiar
          </Text>

          <Input
            placeholder="Nome"
            onChangeText={(value: string) =>
              memberInfo.name ? setName(value) : (nameRef.current = value)
            }
            autoCapitalize="words"
            value={name}
          />
          <Input
            placeholder="Idade"
            inputMode="numeric"
            onChangeText={(value: string) =>
              memberInfo.age ? setAge(value) : (ageRef.current = value)
            }
            value={age}
          />

          <Input
            placeholder="Número de telefone"
            // inputMode="numeric"
            keyboardType="number-pad"
            onChangeText={(value: string) =>
              memberInfo.phone ? setPhone(value) : (phoneRef.current = value)
            }
            value={phone}
          />

          <Text>Parentesco:</Text>
          <Picker
            selectedValue={selectedRelation}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedRelation(itemValue);
            }}
          >
            <Picker.Item label="Filho(a)" value="Filho(a)" />
            <Picker.Item label="Cônjuge" value="Cônjuge" />
            <Picker.Item label="Pai/Mãe" value="Pai/Mãe" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>

          <View
            style={
              selectedRelation === "Outro"
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <Input
              placeholder="Informe o parentesco..."
              onChangeText={(value: string) =>
                memberInfo.relation_type
                  ? setRelation(value)
                  : (relationRef.current = value)
              }
            />
          </View>

          <Button
            title="Adicionar"
            buttonStyle={
              buttonTitle ? { display: "none" } : { display: "flex" }
            }
            onPress={handleAddFamilyMember}
          />
          <Button
            title="Editar"
            buttonStyle={
              buttonTitle ? { display: "flex" } : { display: "none" }
            }
            onPress={handleUpdateFamilyMember}
          />
        </View>
      </ScreenWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 5,
  },
});
