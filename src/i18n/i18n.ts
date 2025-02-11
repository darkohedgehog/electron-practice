import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    'sr-Latn': {
      translation: {
        welcome: "Dobrodošli u našu aplikaciju!",
        sidebarTitle: "Biblioteka",
        menu: {
          home: "Naslovna",
          about: "O nama",
          library: "Biblioteka",
          upload: "Unos",
          manage: "Podaci"
        },
      }
    },
    'sr-Cyrl': {
      translation: {
        welcome: "Добродошли у нашу апликацију!",
        sidebarTitle: "Библиотека",
        menu: {
          home: "Насловна",
          about: "О нама",
          library: "Библиотека",
          upload: "Унос",
          manage: "Подаци"
        },
      }
    }
  };

i18n
  .use(initReactI18next) // povezuje i18next sa React-om
  .init({
    resources,
    lng: localStorage.getItem('language') || 'sr-Latn', // postavlja podrazumevani jezik (latinični)
    fallbackLng: 'sr-Latn', // fallback jezik ako prevod nije pronađen
    interpolation: {
      escapeValue: false // React već obrađuje escaping
    }
  });

export default i18n;
