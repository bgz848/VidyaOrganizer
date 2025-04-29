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
import AddLocationScreen from './AddLocationScreen';
import LocationSelectionScreen from './LocationSelectionScreen';
import { db } from './firebase';
import './i18n'; 
import { useTranslation } from 'react-i18next';
import SettingsScreen from './SettingsScreen'; 
import { colors } from './Style';

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
        color={colors.buttonDefault}
      />
      <Button
        title={t('delete')}
        onPress={() => deleteGame(item.id)}
        color={colors.buttonDelete} 
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
        <View style={styles.buttonRow}>
          <Text style={styles.title}>{t('title')}</Text>
          <Button
            title="⚙️"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
        <View style={styles.buttonRow}>
          <Button 
            title={t('platformManagement')} 
            onPress={() => navigation.navigate('AddPlatform')} 
            color={colors.buttonDefault} 
          />
          <Button 
            title={t('addLocationTitle')} 
            onPress={() => navigation.navigate('AddLocation')} 
            color={colors.buttonDefault} 
          />
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder={t('searchGames')}
          placeholderTextColor={colors.secondaryText} 
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
                      <Image 
                        source={{ uri: item.imageUrl }} 
                        style={styles.thumb} 
                        resizeMode="contain" 
                      />
                    )}
                    <View style={styles.gameDetails}> 
                      <Text style={styles.gameText}>{item.name}</Text>
                      {item.platform && (
                        <Text style={styles.platform}>{t('platforms')}: {item.platform}</Text>
                      )}
                      {item.location?.name && (
                        <Text style={styles.platform}>
                          {t('purchaseLocation')}: {item.location.name}
                        </Text>
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
        <View style={styles.buttonAddGame}>
        <Button 
          title={t('addGame')} 
          onPress={() => navigation.navigate('AddGame')} 
          color={colors.buttonDefault} 
        />
      </View>
      </View>
    </TouchableWithoutFeedback>
    
  );
}

export default function App() {
  const { t } = useTranslation(); 

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: t('home') }} 
        />
        <Stack.Screen 
          name="AddGame" 
          component={AddGameScreen} 
          options={{ title: t('addGame') }} 
        />
        <Stack.Screen 
          name="EditGame" 
          component={EditGameScreen} 
          options={{ title: t('editGame') }} 
        />
        <Stack.Screen 
          name="AddPlatform" 
          component={AddPlatformScreen} 
          options={{ title: t('addPlatform') }} 
        />
        <Stack.Screen 
          name="PlatformSelection" 
          component={PlatformSelectionScreen} 
          options={{ title: t('platformSelection') }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: t('settings') }}
        />
        <Stack.Screen 
          name="AddLocation" 
          component={AddLocationScreen} 
          options={{ title: t('addLocationTitle') }} 
        />
        <Stack.Screen 
          name="LocationSelection" 
          component={LocationSelectionScreen} 
          options={{ title: t('addLocationTitle') }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 0,
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  gameItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    backgroundColor: colors.secondaryBackground,
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
    color: colors.text,
    fontSize: 16,
    marginBottom: 5,
  },
  thumb: {
    width: 75, 
    height: 75, 
    marginTop: 10,
    alignSelf: 'top',
  },
  description: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 5,
  },
  selectedGameItem: {
    borderColor: colors.selectedItem,
    borderWidth: 2,
    paddingHorizontal: 13, 
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, 
    backgroundColor: colors.tertiaryBackground,
    padding: 10,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonAddGame: {
    alignItems: 'center', 
    marginBottom: 10,
  },
  platform: {
    color: colors.secondaryText,
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
    backgroundColor: colors.secondaryBackground,
    color: colors.text,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});


