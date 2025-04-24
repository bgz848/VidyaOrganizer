import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ref, push, onValue } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { db } from './firebase';
import { useTranslation } from 'react-i18next';
import colors from './Style';

export default function AddGameScreen({ navigation }) {
  const { t } = useTranslation();
  const [newGame, setNewGame] = useState('');
  const [description, setDescription] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    const platformsRef = ref(db, 'platforms');
    onValue(platformsRef, snapshot => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setPlatforms(list);
    });
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: false, 
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addGame = async () => {
    if (!newGame.trim()) {
      alert(t('enterGameName')); 
      return;
    }
    if (!selectedPlatform) {
      alert(t('selectPlatform')); 
      return;
    }

    try {
      const gameData = {
        name: newGame.trim(),
        description: description.trim(),
        platform: selectedPlatform,
        imageUrl: imageUri || '',
      };

      await push(ref(db, 'games'), gameData);

      setNewGame('');
      setDescription('');
      setSelectedPlatform('');
      setImageUri('');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving game:', error);
      alert(t('failedToSave')); 
    }
  };

  const handlePlatformSelection = (platform) => {
    setSelectedPlatform(platform);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('addGameTitle')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('gameNamePlaceholder')} 
          value={newGame}
          onChangeText={setNewGame}
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
        <Button title={t('saveGame')} onPress={addGame} color={colors.buttonConfirm} />
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
    borderColor: colors.text,
    padding: 8,
    marginBottom: 10,
    backgroundColor: colors.secondaryBackground,
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
