import Button from "@/components/Button";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { eventCategory, eventType } from "@/types/event.type";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function EditEventForm() {
  const { eventParams } = useLocalSearchParams();
  const eventData = JSON.parse(eventParams as string) as eventType;
 
  const [name, setName] = useState(eventData.name);
  const [eventType, setEventType] = useState<eventCategory>(eventData.type);
  const [date, setDate] = useState(new Date(eventData.event_date));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const handleEditEvent = async () => {
    if (name === "") {
      Alert.alert("Por favor, insira um nome para o evento");
      return;
    }
    const { data, error } = await supabase
      .from("Events")
      .update({ name, type: eventType, event_date: date })
      .eq('id', eventData.id);

    if (error) {
      Alert.alert("Erro ao editar evento", error.message);
      console.error(error);
    } else {
      Alert.alert("Evento editado com sucesso!");
      // @ts-ignore
      router.back();
    }
  };
  const onChange = (_event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome"
          placeholderTextColor={theme.colors.placeholder}
        />

        <Button
          onPress={showDatepicker}
          title="Definir a data"
          buttonStyle={[styles.button, styles.buttonSecondary]}
          textStyle={styles.buttonSecondaryText}
          hasShadow={false}
        />
        <Button
          onPress={showTimepicker}
          title="Definir o horário"
          buttonStyle={[styles.button, styles.buttonSecondary]}
          textStyle={styles.buttonSecondaryText}
          hasShadow={false}
        />
        <Text style={styles.label}>Data e Hora Selecionadas:</Text>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateDisplayText}>{date.toLocaleString()}</Text>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode as any}
            is24Hour={true}
            onChange={onChange}
          />
        )}

        <Picker
          onValueChange={(itemValue: eventCategory) => {
            setEventType(itemValue);
          }}
          style={styles.picker}
          selectedValue={eventType}
        >
          <Picker.Item label={"Viagem"} value={"Viagem"} />
          <Picker.Item label={"Medicação"} value={"Medicacao"} />
          <Picker.Item label={"Outro"} value={"Outro"} />
        </Picker>

        <Button
          title="Editar Evento"
          onPress={handleEditEvent}
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
    color: theme.colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: theme.colors.lightGrey,
    color: theme.colors.textPrimary,
  },

  dateDisplay: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.lightGrey,
    minHeight: 48,
    justifyContent: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },

  dateDisplayText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
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
