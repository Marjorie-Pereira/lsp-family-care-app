import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';

export default function FormScreen() {
  const [nome, setNome] = useState('');
  const [titular, setTitular] = useState('');
  const [image, setImage] = useState("");

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissão para acessar as fotos é necessária!');
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
    // Aqui você pode processar o envio do formulário
    alert('Formulário criado!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Titular:</Text>
      <TextInput
        style={styles.input}
        value={titular}
        onChangeText={setTitular}
        placeholder="Digite o titular"
      />

      <Button title="Escolher Foto" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={styles.buttonSpacing}>
        <Button title="Compartilhar com..." onPress={handleShare} />
      </View>

      <View style={styles.buttonSpacing}>
        <Button title="Criar" onPress={handleCriar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
  buttonSpacing: {
    marginTop: 20,
  },
});
