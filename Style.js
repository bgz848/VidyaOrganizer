import { Appearance } from 'react-native';

const colorScheme = Appearance.getColorScheme();

export const darkColors = {
  background: '#1e1e1e',
  text: '#fff',
  secondaryText: '#aaa',
  secondaryBackground: '#2c2c2c',
  tertiaryBackground: '#444',
  button: '#4CAF50',
  buttonConfirm: '#4CAF50',
  buttonDefault: '#2196F3',
  buttonDelete: '#f44336',
  selectedItem: '#00f'
};

const lightColors = {
  background: '#ffffff',
  text: '#000000',
  secondaryText: '#555555',
  secondaryBackground: '#f2f2f2',
  tertiaryBackground: '#e0e0e0',
  button: '#4CAF50',
  buttonConfirm: '#4CAF50',
  buttonDefault: '#2196F3',
  buttonDelete: '#f44336',
  selectedItem: '#00f'
};

export const colors = colorScheme === 'dark' ? darkColors : lightColors;

export default colors;