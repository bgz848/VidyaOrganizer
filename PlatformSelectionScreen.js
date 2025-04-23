import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import { colors } from './Style';

export default function PlatformSelectionScreen({ route, navigation }) {
  const [platforms, setPlatforms] = useState([]);
  const { onSelect } = route.params;

  useEffect(() => {
    const platformsRef = ref(db, 'platforms');
    onValue(platformsRef, snapshot => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setPlatforms(list);
    });
  }, []);

  const handleSelect = (platform) => {
    onSelect(platform);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} >Select a Platform</Text>
      <FlatList
        data={platforms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => handleSelect(item.name)} color={colors.buttonDefault}/>
        )}
      />
    </View>
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
    color: '#fff',
    marginBottom: 10,
  },
});
