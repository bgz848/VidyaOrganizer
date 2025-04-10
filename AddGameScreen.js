import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ref, push, onValue } from 'firebase/database';
import { db } from './firebase';

export default function AddGameScreen({ navigation }) {
  const [newGame, setNewGame] = useState('');
  const [description, setDescription] = useState('');
  const [platforms, setPlatforms] = useState([]); 
  const [selectedPlatform, setSelectedPlatform] = useState(''); 

  useEffect(() => {
    const platformsRef = ref(db, 'platforms');
    onValue(platformsRef, snapshot => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setPlatforms(list);
    });
  }, []);

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
      await push(ref(db, 'games'), {
        name: newGame.trim(),
        description: description.trim(),
        platform: selectedPlatform, 
        imageUrl: '',
      });
      setNewGame('');
      setDescription('');
      setSelectedPlatform('');
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
      <Button title="Save Game" onPress={addGame} />
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
