import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ref, push } from 'firebase/database';
import { db } from './firebase';
import { useTranslation } from 'react-i18next';

export default function AddPlatformScreen({ navigation }) {
  const [platformName, setPlatformName] = useState('');
  const { t } = useTranslation();

  const addPlatform = async () => {
    if (!platformName.trim()) {
      alert(t('platformNamePlaceholder'));
      return;
    }

    try {
      await push(ref(db, 'platforms'), { name: platformName.trim() });
      setPlatformName('');
      navigation.goBack(); 
    } catch (error) {
      console.error('Error saving platform:', error);
      alert(t('failedToSave')); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('addPlatformTitle')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('platformNamePlaceholder')} 
        value={platformName}
        onChangeText={setPlatformName}
      />
      <Button title={t('savePlatform')} onPress={addPlatform} />
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
});
