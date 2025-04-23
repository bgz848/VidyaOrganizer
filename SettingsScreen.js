import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useTranslation } from 'react-i18next';
import { colors } from './Style';

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
        color={colors.button} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.background, 
    justifyContent: 'center',
  },
  title: {
    color: colors.text, 
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    color: colors.text, 
    backgroundColor: colors.secondaryBackground, 
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 20,
    height: 200,
    width: 300, 
    alignSelf: 'center', 
  },
});