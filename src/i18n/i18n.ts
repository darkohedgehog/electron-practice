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
        paragraph5About: "Biblioteka deluje u okviru Ustanove u oblasti kulture Srpski kulturni centar Vukovar.",
        titleLibrary: "Biblioteka Zaharija Orfelin",
        placeholderLibrary: "Pretraži knjige...",
        availableLibrary: "Slika nije dostupna",
        yearLibrary: "Godina",
        pageLibrary: "Strana",
        fromLibrary: "od",
        loadingBookDetails: "Učitavanje ...",
        availableBookDetails: "Slika nije dostupna",
        yearBookDetails: "Godina izdanja",
        buttonBookDetails: "Nazad",
        titleUpload: "Baza podataka",
        paragraphUpload: "Unesite podatke o knjizi",
        placeholderLatTitleUpload: "Naslov na latinici",
        placeholderCyrTitleUpload: "Naslov na ćirilici",
        placeholderLatAuthorUpload: "Autor na latinici",
        placeholderCyrAuthorUpload: "Autor na ćirilici",
        placeholderLatDescriptionUpload: "Opis na latinici",
        placeholderCyrDescriptionUpload: "Opis na ćirilici",
        placeholderYearUpload: "Godina izdanja",
        saveButtonUpload: "Sačuvaj sliku",
        uploadButton: "Odaberi naslovnu sliku",
        titleManage: "Upravljanje knjigama",
        placeholderManage: "Pretraži knjige...",
        availableManage: "Nema unetih knjiga",
        idManage: "ID",
        titleLatManage: "Naslov (Lat)",
        titleCyrManage: "Naslov (Cyr)",
        authorLatManage: "Autor (Lat)",
        authorCyrManage: "Autor (Cyr)",
        yearManage: "Godina",
        actionManage: "Akcije",
        pageManage: "Strana",
        fromManage: "od",
        editBookManage: "Uredi knjigu",
        imageManage: "Naslovna slika",
        changeImageManage: "Promeni sliku",
        quitButtonManage: "Odustani",
        saveButtonManage: "Sačuvaj",
        descLatManage: "Opis (Lat)",
        descCyrManage: "Opis (Cyr)",
        noImageManage: "Nema slike"
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
        titleAbout: "О нама",
        paragraph1About: "Са преко 20.000 пажљиво прикупљених наслова, библиотека Захарија Орфелин представља право уточиште за љубитеље књиге и истраживаче знања. Наша колекција обухвата богатство литературе – од класичних дела и савремене белетристике до стручних и научних публикација.",
        paragraph2About: "Посетите нас и постаните део приче коју градимо годинама – приче о култури, образовању и љубави према писаној речи. Библиотека Захарија Орфелин је више од збирке књига – то је ваш прозор у свет знања.",
        paragraph3About: "Захарије Орфелин је био један од најзначајнијих српских писаца и преводилаца 18. века. Његово дело је оставило неизбрисив траг у српској култури и књижевности, а библиотека која носи његово име представља право место за све оне који желе да се упознају са његовим стваралаштвом.",
        paragraph4About: "Наша мисија је да сачувамо културно наслеђе и омогућимо приступ знању свима. Наша врата су отворена за све – дођите и уверите се сами!",
        paragraph5About: "Библиотека делује у оквиру Установе у области културе Српски културни центар Вуковар.",
        titleLibrary: "Библиотека Захарија Орфелин",
        placeholderLibrary: "Претражи књиге...",
        availableLibrary: "Слика није доступна",
        yearLibrary: "Година",
        pageLibrary: "Страна",
        fromLibrary: "од",
        loadingBookDetails: "Учитавање ...",
        availableBookDetails: "Слика није доступна",
        yearBookDetails: "Година издања",
        buttonBookDetails: "Назад",
        titleUpload: "База података",
        paragraphUpload: "Унесите податке о књизи",
        placeholderLatTitleUpload: "Наслов на латиници",
        placeholderCyrTitleUpload: "Наслов на ћирилици",
        placeholderLatAuthorUpload: "Аутор на латиници",
        placeholderCyrAuthorUpload: "Аутор на ћирилици",
        placeholderLatDescriptionUpload: "Опис на латиници",
        placeholderCyrDescriptionUpload: "Опис на ћирилици",
        placeholderYearUpload: "Година издања",
        saveButtonUpload: "Сачувај слику",
        uploadButton: "Одабери насловну слику",
        titleManage: "Управљање књигама",
        idManage: "ИД",
        placeholderManage: "Претражи књиге...",
        availableManage: "Нема унетих књига",
        titleLatManage: "Наслов(Lat)",
        titleCyrManage: "Наслов(Cyr)",
        authorLatManage: "Аутор(Lat)",
        authorCyrManage: "Аутор(Cyr)",
        yearManage: "Година",
        actionManage: "Акције",
        pageManage: "Страна",
        fromManage: "од",
        editBookManage: "Уреди књигу",
        imageManage: "Насловна слика",
        changeImageManage: "Промени слику",
        quitButtonManage: "Одустани",
        saveButtonManage: "Сачувај",
        descLatManage: "Опис (Lat)",
        descCyrManage: "Опис (Cyr)",
        noImageManage: "Нема слике"
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
