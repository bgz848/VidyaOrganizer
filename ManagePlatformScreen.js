import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ref, push, onValue, remove } from 'firebase/database';
import { db } from './firebase';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-native-gesture-handler';
import colors from './Style';

export default function AddPlatformScreen({ navigation }) {
  const [platformName, setPlatformName] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const platformsRef = ref(db, 'platforms');
    onValue(platformsRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setPlatforms(list);
    });
  }, []);

  const addPlatform = async () => {
    if (!platformName.trim()) {
      alert(t('platformNamePlaceholder'));
      return;
    }

    try {
      await push(ref(db, 'platforms'), { name: platformName.trim() });
      setPlatformName('');
    } catch (error) {
      console.error('Error saving platform:', error);
      alert(t('failedToSave'));
    }
  };

  const deletePlatform = (id) => {
    Alert.alert(
      t('deletePlatform'),
      t('deleteConfirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            remove(ref(db, `platforms/${id}`));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderRightActions = (item) => (
    <View style={styles.buttonGroup}>
      <Button
        title={t('delete')}
        onPress={() => deletePlatform(item.id)}
        color={colors.buttonDelete}
      />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('addPlatformTitle')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('platformNamePlaceholder')}
          value={platformName}
          onChangeText={setPlatformName}
        />
        <Button title={t('savePlatform')} onPress={addPlatform} color={colors.buttonConfirm} />

        <FlatList
          data={platforms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <View style={styles.platformItem}>
                <Text style={styles.platformText}>{item.name}</Text>
              </View>
            </Swipeable>
          )}
          style={styles.platformList}
        />
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
  platformItem: {
    backgroundColor: colors.secondaryBackground,
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  platformText: {
    color: colors.text,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: colors.tertiaryBackground,
    padding: 10,
    borderRadius: 8,
  },
  platformList: {
    marginTop: 20,
  },
});
