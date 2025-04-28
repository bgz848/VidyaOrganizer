import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import colors from './Style';

export default function LocationSelectionScreen({ route, navigation }) {
  const [locations, setLocations] = useState([]);
  const { onSelect } = route.params;

  useEffect(() => {
    const locationsRef = ref(db, 'locations');
    onValue(locationsRef, snapshot => {
      const data = snapshot.val();
      const list = data
        ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
        : [];
      setLocations(list);
    });
  }, []);

  const handleSelect = (location) => {
    onSelect(location);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Location</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => handleSelect(item)}
            color={colors.buttonDefault}
          />
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
    color: colors.text,
    marginBottom: 10,
  },
});
