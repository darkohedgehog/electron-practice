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
        paragraphHome: "Prikupljamo i stručno obrađujemo, čuvamo i obnavljamo bibliotečku građu. Više od 20.000 naslova koje smo vredno prikupili i ljubomorno ih čuvamo za vas. Obogatite svoje znanje i upoznajte se sa našom kolekcijom...",
        titleAbout: "O nama",
        paragraph1About: "Sa preko 20.000 pažljivo prikupljenih naslova, biblioteka Zaharija Orfelin predstavlja pravo utočište za ljubitelje knjige i istraživače znanja. Naša kolekcija obuhvata bogatstvo literature – od klasičnih dela i savremene beletristike do stručnih i naučnih publikacija.",
        paragraph2About: "Posetite nas i postanite deo priče koju gradimo godinama – priče o kulturi, obrazovanju i ljubavi prema pisanoj reči. Biblioteka Zaharija Orfelin je više od zbirke knjiga – to je vaš prozor u svet znanja.",
        paragraph3About: "Zaharije Orfelin je bio jedan od najznačajnijih srpskih pisaca i prevodilaca 18. veka. Njegovo delo je ostavilo neizbrisiv trag u srpskoj kulturi i književnosti, a biblioteka koja nosi njegovo ime predstavlja pravo mesto za sve one koji žele da se upoznaju sa njegovim stvaralaštvom.",
        paragraph4About: "Naša misija je da sačuvamo kulturno nasleđe i omogućimo pristup znanju svima. Naša vrata su otvorena za sve – dođite i uverite se sami!",
        paragraph5About: "Biblioteka deluje u okviru Ustanove u oblasti kulture Srpski kulturni centar Vukovar."
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
        paragraphHome: "Прикупљамо и стручно обрађујемо, чувамо и обнављамо библиотечку грађу. Више од 20.000 наслова које смо вредно прикупили и љубоморно их чувамо за вас. Обогатите своје знање и упознајте се са нашом колекцијом...",
        titleAbout: "",
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
