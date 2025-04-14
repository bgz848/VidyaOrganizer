import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ref, push, onValue } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { db } from './firebase';

export default function AddGameScreen({ navigation }) {
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
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addGame = async () => {
    if (!newGame.trim()) {
      alert('Please enter a game name.');
      return;
    }
    if (!selectedPlatform) {
      alert('Please select a platform.');
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
      alert('Failed to save game. Please try again.');
    }
  };

  const handlePlatformSelection = (platform) => {
    setSelectedPlatform(platform);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Add a New Game</Text>
        <TextInput
          style={styles.input}
          placeholder="Game name"
          value={newGame}
          onChangeText={setNewGame}
        />
        <TextInput
          style={styles.input}
          placeholder="Game description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Button
          title={selectedPlatform ? `Platform: ${selectedPlatform}` : 'Add platform to game'}
          onPress={() =>
            navigation.navigate('PlatformSelection', {
              onSelect: handlePlatformSelection,
            })
          }
        />
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>No image selected</Text>
          )}
          <Button title="Pick an Image" onPress={pickImage} />
          <Button title="Take a Photo" onPress={takePhoto} />
        </View>
        <Button title="Save Game" onPress={addGame} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#222',
    color: '#fff',
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
    color: '#aaa',
    marginBottom: 10,
  },
});
