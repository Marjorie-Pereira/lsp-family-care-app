import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { theme } from "@/theme";
import { familyMemberType } from "@/types/familyMember.type";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Family() {
  const [familyMembers, setFamilyMembers] = useState<familyMemberType[]>([]);
  const fetchFamilyMembers = async () => {
    const { data, error } = await supabase.from("FamilyMembers").select("*");

    if (error) console.error(error);
    else setFamilyMembers(data);
  };

  const router = useRouter();
  useEffect(() => {
    fetchFamilyMembers();
  }, [familyMembers]);

  return (
    <>
      <View style={styles.container}>
        <Text>Membros da família</Text>
        <Button title="Novo" onPress={() => router.push("/modal")} />
        <ScrollView>
          <View style={styles.itemsList}>
            {familyMembers.map((member, index) => {
              return (
                <Pressable
                  key={member.id}
                  onPress={() =>
                    router.push({
                      pathname: "/familyMemberInfo",
                      params: { ...member },
                    })
                   
                  }
                >
                  <View style={styles.listItem}>
                    <Text>{member.name}</Text>
                    <Text>{member.relation_type}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemsList: {
    marginTop: 10,
    flex: 1,
    gap: 10,
  },
  listItem: {
    borderRadius: 5,
    padding: 16,
    shadowColor: theme.colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
    elevation: 3,
  },
});
