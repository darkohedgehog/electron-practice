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
        titleHome: "Vaša riznica znanja",
        spanHome: "Biblioteka Zaharija Orfelin",
        paragraphHome: "Prikupljamo i stručno obrađujemo, čuvamo i obnavljamo bibliotečku građu. Više od 20.000 naslova koje smo vredno prikupili i ljubomorno ih čuvamo za vas. Obogatite svoje znanje i upoznajte se sa našom kolekcijom..."
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
        titleHome: "Ваша ризница знања",
        spanHome: "Библиотека Захарија Орфелин",
        paragraphHome: "Прикупљамо и стручно обрађујемо, чувамо и обнављамо библиотечку грађу. Више од 20.000 наслова које смо вредно прикупили и љубоморно их чувамо за вас. Обогатите своје знање и упознајте се са нашом колекцијом..."
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
