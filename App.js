import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Button, Image, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddGameScreen from './AddGameScreen'; 
import EditGameScreen from './EditGameScreen'; 
import AddPlatformScreen from './AddPlatformScreen'; 
import PlatformSelectionScreen from './PlatformSelectionScreen'; 
import { db } from './firebase';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null); 

  useEffect(() => {
    const gamesRef = ref(db, 'games');
    onValue(gamesRef, snapshot => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setGames(list);
    });
  }, []);

  const deleteGame = (id) => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            remove(ref(db, `games/${id}`));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleDescription = (id) => {
    setSelectedGameId(selectedGameId === id ? null : id); 
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setSelectedGameId(null); 
        Keyboard.dismiss(); 
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>My Game Collection</Text>
        <View style={styles.buttonRow}>
          <Button title="Add Game" onPress={() => navigation.navigate('AddGame')} />
          <Button title="Add Platform" onPress={() => navigation.navigate('AddPlatform')} /> {/* New button */}
        </View>
        <FlatList
          data={games}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.gameItem,
                item.id === selectedGameId && styles.selectedGameItem, 
              ]}
            >
              <View style={styles.gameInfo}>
                <Text
                  style={styles.gameText}
                  onPress={() => toggleDescription(item.id)}
                >
                  {item.name}
                </Text>
                {selectedGameId === item.id && (
                  <>
                    {item.description && (
                      <Text style={styles.description}>{item.description}</Text>
                    )}
                    {item.platform && (
                      <Text style={styles.platform}>Platform: {item.platform}</Text>
                    )}
                  </>
                )}
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                )}
              </View>
              <View style={styles.buttonGroup}>
                <Button
                  title="Edit"
                  onPress={() => navigation.navigate('EditGame', { game: item })}
                />
                <Button
                  title="Remove"
                  onPress={() => deleteGame(item.id)}
                />
              </View>
            </View>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddGame" component={AddGameScreen} />
        <Stack.Screen name="EditGame" component={EditGameScreen} />
        <Stack.Screen name="AddPlatform" component={AddPlatformScreen} />
        <Stack.Screen name="PlatformSelection" component={PlatformSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    backgroundColor: '#1e1e1e',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  gameInfo: {
    flex: 1,
    marginRight: 10,
  },
  gameText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginTop: 5,
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
  selectedGameItem: {
    borderColor: '#00f',
    borderWidth: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  platform: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
});


