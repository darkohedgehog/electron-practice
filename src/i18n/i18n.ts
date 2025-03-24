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
        paragraph1About: "Biblioteka “Zaharija Orfelin“ osnovana je 18. aprila 2019. godine i nosi ime srpskog pisca i kaligrafe Zaharije Orfelina, rođenog u Vukovaru.",
        paragraph2About: "Nalazi se u zgradi Zajedničkog veća opština na adresi Eugena Kvaternika 1, a radno vreme biblioteke je svakim radnim danom od 8 do 15 časova.",
        paragraph3About: "Članarina iznosi 5€ za odrasle, a dečja i grupna članarina iznosi 3€.",
        paragraph4About: "U biblioteci možete pronaći veliki broj knjiga na srpskom jeziku i ćiriličnom pismu iz svih oblasti.",
        paragraph5About: "Očekujemo vaš dolazak!!",
        paragraph6About: "Vaš Srpski kulturni centar",
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
        saveButtonUpload: "Sačuvaj knjigu",
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
        migrationInfo: "Pošalji knjige na web aplikaciju",
        migrationButton: "Migracija",
        editBookManage: "Uredi knjigu",
        imageManage: "Naslovna slika",
        changeImageManage: "Promeni sliku",
        quitButtonManage: "Odustani",
        saveButtonManage: "Sačuvaj",
        descLatManage: "Opis (Lat)",
        descCyrManage: "Opis (Cyr)",
        noImageManage: "Nema slike",
        importDataManage: "Izvezi podatke u Excel",
        modeToggleLight: "Svetla",
        modeToggleDark: "Tamna",
        modeToggleSystem: "Sistem",
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
        paragraph1About: "Библиотека “Захарија Орфелин“ основана је 18. априла 2019. године и носи име српског писаца и калиграфа Захарије Орфелина, рођеног у Вуковару.",
        paragraph2About: "Налази се у згради Заједничког већа општина на адреси Евгена Кватерника 1, а радно време библиотеке је сваким радним даном од 8 до 15 часова.",
        paragraph3About: "Чланарина износи 5€ за одрасле, а дечја и групна чланарина износи 3€.",
        paragraph4About: "У библиотеци можете пронаћи велики број књига на српском језику и ћириличном писму из свих области.",
        paragraph5About: "Очекујемо ваш долазак!!",
        paragraph6About: "Ваш Српски културни центар",
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
        saveButtonUpload: "Сачувај књигу",
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
        migrationInfo: "Пошаљи књиге на веб апликацију",
        migrationButton: "Миграција",
        editBookManage: "Уреди књигу",
        imageManage: "Насловна слика",
        changeImageManage: "Промени слику",
        quitButtonManage: "Одустани",
        saveButtonManage: "Сачувај",
        descLatManage: "Опис (Lat)",
        descCyrManage: "Опис (Cyr)",
        noImageManage: "Нема слике",
        importDataManage: "Извези податке у Excel",
        modeToggleLight: "Светла",
        modeToggleDark: "Тамна",
        modeToggleSystem: "Систем",
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
