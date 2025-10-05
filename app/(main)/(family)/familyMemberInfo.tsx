import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Image, Text, View } from "react-native";

export default function FamilyMemberInfo() {
  const router = useRouter();
  const { id, name, age, phone, relation_type } = useLocalSearchParams();
    const memberInfo = {...useLocalSearchParams()}

  const deleteFamilyMember = async (id: string) => {
    const { data, error } = await supabase
      .from("FamilyMembers")
      .delete()
      .match({ id });
    if (error) console.error(error);
    else {
      Alert.alert("Familiar deletado com sucesso!");
      // @ts-ignore
      router.navigate("family", data);
    }
  };

  

  useEffect(() => {
    console.log(name);
  }, [name]);

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          gap: 10,
          margin: 10,
          paddingBottom: 30,
        }}
      >
        {/* member info */}
        <View style={{ alignItems: "center", margin: 10, gap: 8, flex: 1 }}>
          <Image
            source={{ uri: "https://picsum.photos/200" }}
            style={{ width: 200, height: 200, borderRadius: 100 }}
          />
          <Text style={{ fontSize: 20 }}>{name}</Text>
          <Text>{age}</Text>
          <Text>{phone}</Text>
          <Text>{relation_type}</Text>
        </View>

        <Button title="Editar" buttonStyle={{ width: "100%" }} 
        onPress={() => router.push({pathname: '/modal', params: {
            modalLabel: "Editar Familiar", 
            buttonTitle: "Editar",
            ...memberInfo
            }})} />
        <Button
          title="Deletar"
          buttonStyle={{ backgroundColor: "red", width: "100%" }}
          onPress={() => {
            Alert.alert("Deletar Familiar", `Deseja deletar ${name}?`, [
              {
                text: "Cancelar",
                onPress: () => {},
                style: "cancel",
              },
              { text: "Sim", onPress: () => deleteFamilyMember(id as string) },
            ]);
            
          }}
        />
      </View>
    </ScreenWrapper>
  );
}
