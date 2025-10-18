import Button from '@/components/Button';
import { theme } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, ScrollView, Share, StyleSheet, Text, TextInput } from 'react-native';

export default function FormScreen() {
  const [nome, setNome] = useState('');
  const [titular, setTitular] = useState('');
  const [image, setImage] = useState("");

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão para acessar as fotos é necessária!');
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
    if (!nome && !titular && !image) {
      Alert.alert('Nada para compartilhar', 'Preencha os campos ou escolha uma imagem.');
      return;
    }
    try {
      await Share.share({
        message: `Nome: ${nome}\nTitular: ${titular}`,
        url: image,
      });
    } catch (error: any) {
      alert('Erro ao compartilhar: ' + error.message);
    }
  };

  const handleCriar = () => {
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Título da agenda"
        placeholderTextColor="#999"
      />

{/* modal de seleção do familiar */}
      <Text style={styles.label}>Familiar associado:</Text>
      <TextInput
        style={styles.input}
        value={titular}
        onChangeText={setTitular}
        placeholder="Nome do familiar"
        placeholderTextColor="#999"
      />

      <Button title="Escolher Foto" onPress={pickImage} buttonStyle={[styles.button, styles.buttonSecondary]} textStyle={styles.buttonSecondaryText} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Compartilhar com..." onPress={handleShare} buttonStyle={[styles.button, styles.buttonSecondary]} textStyle={styles.buttonSecondaryText} />

      <Button title="Criar" onPress={handleCriar} buttonStyle={[styles.button, styles.buttonPrimary]} textStyle={styles.buttonPrimaryText} />
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
    width: '100%',
    height: 250, 
    borderRadius: 10,
    backgroundColor: theme.colors.lightGrey, 
    resizeMode: 'cover', 
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
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
    borderWidth: 1
  },
  buttonSecondaryText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
