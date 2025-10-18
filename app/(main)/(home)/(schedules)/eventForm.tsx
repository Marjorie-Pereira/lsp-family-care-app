import Button from '@/components/Button';
import { theme } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default function EventForm() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [eventType, setEventType] = useState("");

  const handleCreateEvent = () => {
    alert("Formulário criado!");
  };


  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite o nome"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Button onPress={showDatepicker} title="Show date picker!" buttonStyle={[styles.button, styles.buttonSecondary]} textStyle={styles.buttonSecondaryText} />
      <Button onPress={showTimepicker} title="Show time picker!" buttonStyle={[styles.button, styles.buttonSecondary]} textStyle={styles.buttonSecondaryText} />
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

      <Button title="Criar Evento" onPress={handleCreateEvent} buttonStyle={[styles.button, styles.buttonPrimary]} textStyle={styles.buttonPrimaryText} />
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
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
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
    justifyContent: 'center', 
  },
  
  dateDisplayText: {
    fontSize: 16,
    color: theme.colors.textPrimary, 
  },
  button: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonPrimaryText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: theme.colors.lightGrey,
  },
  buttonSecondaryText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
