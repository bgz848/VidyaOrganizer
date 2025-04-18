import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './locales/en.json';
import fi from './locales/fi.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en', // Default language
  lng: 'en', // Initial language
  resources: {
    en: { translation: en },
    fi: { translation: fi },
  },
  interpolation: {
    escapeValue: false, 
  },
});

export default i18n;