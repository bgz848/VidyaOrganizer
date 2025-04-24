import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ref, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { db } from './firebase';
import { useTranslation } from 'react-i18next';
import colors from './Style';

export default function EditGameScreen({ route, navigation }) {
  const { game } = route.params;
  const { t } = useTranslation();
  const [name, setName] = useState(game.name);
  const [description, setDescription] = useState(game.description || '');
  const [selectedPlatform, setSelectedPlatform] = useState(game.platform || '');
  const [imageUri, setImageUri] = useState(game.imageUrl || '');

  const handlePlatformSelection = (platform) => {
    setSelectedPlatform(platform);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert(t('permissionMediaLibrary'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert(t('permissionCamera'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    if (!name.trim()) {
      alert(t('enterGameName'));
      return;
    }
    if (!selectedPlatform) {
      alert(t('selectPlatform'));
      return;
    }

    try {
      const gameRef = ref(db, `games/${game.id}`);
      await update(gameRef, {
        name: name.trim(),
        description: description.trim(),
        platform: selectedPlatform,
        imageUrl: imageUri || '',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating game:', error);
      alert(t('failedToSave'));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('editGame')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('gameNamePlaceholder')}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={t('gameDescriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Button
          title={selectedPlatform ? `${t('addPlatform')}: ${selectedPlatform}` : t('addPlatform')}
          onPress={() =>
            navigation.navigate('PlatformSelection', {
              onSelect: handlePlatformSelection,
            })
          }
          color={colors.buttonDefault}
        />
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image 
              source={{ uri: imageUri }} 
              style={styles.image} 
              resizeMode="contain" 
            />
          ) : (
            <Text style={styles.imagePlaceholder}>{t('noImageSelected')}</Text>
          )}
          <View style={styles.buttonRow}>
            <Button title={t('pickImage')} onPress={pickImage} color={colors.buttonDefault} />
            <Button title={t('takePhoto')} onPress={takePhoto} color={colors.buttonDefault} />
          </View>
        </View>
        <Button title={t('saveChanges')} onPress={saveChanges} color={colors.buttonConfirm} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#222',
    color: colors.text,
  },
  imageContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  imagePlaceholder: {
    color: colors.secondaryText,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
