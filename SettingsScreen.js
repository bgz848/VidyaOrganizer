import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language); 
  const [tempLanguage, setTempLanguage] = useState(i18n.language);

  const confirmLanguageChange = () => {
    setSelectedLanguage(tempLanguage);
    i18n.changeLanguage(tempLanguage); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('language')}</Text>
      <Picker
        selectedValue={tempLanguage}
        onValueChange={(itemValue) => setTempLanguage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label={t('Finnish')} value="fi" />
        <Picker.Item label={t('English')} value="en" />
      </Picker>
      <Button 
        title={t('confirm')} 
        onPress={confirmLanguageChange} 
        color="#4CAF50"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 20,
    height: 200,
    width: 300, 
    alignSelf: 'center', 
  },
});