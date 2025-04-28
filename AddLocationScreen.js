import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import { ref, push } from 'firebase/database';
import { db } from './firebase';
import { useTranslation } from 'react-i18next';
import colors from './Style';
import MapView, { Marker } from 'react-native-maps';

export default function AddLocationScreen({ navigation }) {
  const { t } = useTranslation();
  const [locationName, setLocationName] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 60.169832654,
    longitude: 24.938162914,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('permissionDenied'), t('locationPermissionRequired'));
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setCurrentLocation(coords);
    setMapRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
  };

  const handleMapPress = (e) => {
    const coords = e.nativeEvent.coordinate;
    setCurrentLocation(coords);
  };

  const saveLocation = async () => {
    if (!locationName.trim()) {
      Alert.alert(t('error'), t('enterLocationName'));
      return;
    }

    try {
      const locationData = {
        name: locationName.trim(),
        coordinates: currentLocation || null,
      };

      await push(ref(db, 'locations'), locationData);
      setLocationName('');
      setCurrentLocation(null);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert(t('error'), t('failedToSave'));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('addLocationTitle')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('locationNamePlaceholder')}
          value={locationName}
          onChangeText={setLocationName}
        />
        <Button
          title={t('getCurrentLocation')}
          onPress={getCurrentLocation}
          color={colors.buttonDefault}
        />
        <MapView
          style={styles.map}
          region={mapRegion}
          onPress={handleMapPress}
        >
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              draggable
              onDragEnd={(e) => setCurrentLocation(e.nativeEvent.coordinate)}
            />
          )}
        </MapView>
        {currentLocation && (
          <Text style={styles.locationText}>
            {t('selectedLocation')}: {currentLocation.latitude.toFixed(5)}, {currentLocation.longitude.toFixed(5)}
          </Text>
        )}
        <View style={styles.buttonRow}>
        <Button
          title={t('saveLocation')}
          onPress={saveLocation}
          color={colors.buttonConfirm}
        />
        <Button
          title={t('getCurrentLocation')}
          onPress={getCurrentLocation}
          color={colors.buttonDefault}
        />
        </View>
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
  locationText: {
    color: colors.text,
    marginVertical: 10,
  },
  map: {
    height: 250,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
});
