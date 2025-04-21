import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Button, Image, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Swipeable } from 'react-native-gesture-handler'; 
import AddGameScreen from './AddGameScreen'; 
import EditGameScreen from './EditGameScreen'; 
import AddPlatformScreen from './AddPlatformScreen'; 
import PlatformSelectionScreen from './PlatformSelectionScreen'; 
import { db } from './firebase';
import './i18n'; 
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation(); 
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); 

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
      t('deleteGame'),
      t('deleteConfirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
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

  const renderRightActions = (item) => (
    <View style={styles.buttonGroup}>
      <Button
        title={t('edit')}
        onPress={() => navigation.navigate('EditGame', { game: item })}
      />
      <Button
        title={t('delete')}
        onPress={() => deleteGame(item.id)}
      />
    </View>
  );

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setSelectedGameId(null); 
        Keyboard.dismiss(); 
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{t('title')}</Text>
        <View style={styles.buttonRow}>
          <Button title={t('addGame')} onPress={() => navigation.navigate('AddGame')} />
          <Button title={t('addPlatform')} onPress={() => navigation.navigate('AddPlatform')} />
        </View>
        <View style={styles.buttonRow}>
          <Button title={t('switchLanguageToFinnish')} onPress={() => i18n.changeLanguage('fi')} />
          <Button title={t('switchLanguageToEnglish')} onPress={() => i18n.changeLanguage('en')} />
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder={t('searchGames')}
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredGames} // Use filteredGames instead of games
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <TouchableWithoutFeedback onPress={() => toggleDescription(item.id)}>
                <View
                  style={[
                    styles.gameItem,
                    item.id === selectedGameId && styles.selectedGameItem, 
                  ]}
                >
                  <View style={styles.gameInfoRow}> 
                    {item.imageUrl && (
                      <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                    )}
                    <View style={styles.gameDetails}> 
                      <Text style={styles.gameText}>{item.name}</Text>
                      {item.platform && (
                        <Text style={styles.platform}>{t('platforms')}: {item.platform}</Text>
                      )}
                    </View>
                  </View>
                  {selectedGameId === item.id && item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </Swipeable>
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
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    backgroundColor: '#2c2c2c',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    paddingHorizontal: 15,
    position: 'relative', 
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
    marginTop: 10, 
    alignSelf: 'top', 
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
  selectedGameItem: {
    borderColor: '#00f',
    borderWidth: 2,
    paddingHorizontal: 13, 
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, 
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
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
  gameInfoRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  gameDetails: {
    flex: 1, 
    marginLeft: 10, 
  },
  searchBar: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});


