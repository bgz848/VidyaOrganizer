import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ref, update, onValue } from 'firebase/database';
import { db } from './firebase';

export default function EditGameScreen({ route, navigation }) {
  const { game } = route.params;
  const [name, setName] = useState(game.name);
  const [description, setDescription] = useState(game.description || '');
  const [selectedPlatform, setSelectedPlatform] = useState(game.platform || '');

  const handlePlatformSelection = (platform) => {
    setSelectedPlatform(platform);
  };

  const saveChanges = async () => {
    if (!name.trim()) {
      alert('Please enter a game name.');
      return;
    }
    if (!selectedPlatform) {
      alert('Please select a platform.');
      return;
    }

    try {
      const gameRef = ref(db, `games/${game.id}`);
      await update(gameRef, {
        name: name.trim(),
        description: description.trim(),
        platform: selectedPlatform,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating game:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Game</Text>
      <TextInput
        style={styles.input}
        placeholder="Game name"
        value={name}
        onChangeText={setName}
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
      <Button title="Save Changes" onPress={saveChanges} />
    </View>
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
  picker: {
    height: 50,
    color: '#fff',
    backgroundColor: '#333', 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
    zIndex: 10, 
  },
});
