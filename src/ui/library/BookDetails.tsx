import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Undo2 } from 'lucide-react';
import { t } from 'i18next';

type Book = {
  id: number;
  title_lat: string;
  title_cyr: string;
  author_lat: string;
  author_cyr: string;
  description_lat?: string;
  description_cyr?: string;
  file_path: string;
  year: string;
};

type BookImage = {
  id: number;
  book_id: number;
  image_path: string;
  image_type: string;
  position: number;
};

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [gallery, setGallery] = useState<BookImage[]>([]);
  const [userDataPath, setUserDataPath] = useState<string>('');

  useEffect(() => {
    // Dobavi userDataPath pomoću funkcije iz preload skripte
    window.api.getUserDataPath()
      .then((path: string) => {
        console.log("userDataPath:", path);
        setUserDataPath(path);
      })
      .catch((err: any) => console.error("Greška pri dobijanju userDataPath:", err));

    const fetchBookDetails = async () => {
      try {
        // Učitaj sve knjige i filtriraj po id-ju
        const books = await window.api.getBooks();
        const foundBook = books.find((b: Book) => b.id === Number(id));
        setBook(foundBook ?? null); // Ako nije pronađena, postavi null
        if (foundBook) {
          const images = await window.api.getBookImages(foundBook.id);
          setGallery(images);
        }
      } catch (error) {
        console.error('Greška pri učitavanju detalja knjige:', error);
      }
    };
    fetchBookDetails();
  }, [id]);

  const getTitle = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.title_cyr : book.title_lat;

  const getAuthor = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.author_cyr : book.author_lat;

    function renderDescription(desc: string | undefined): string {
      if (!desc) return "";
      try {
        // Ako opis počinje s "{" pretpostavljamo da je JSON
        if (desc.trim().startsWith("{")) {
          const obj = JSON.parse(desc);
          if (obj && Array.isArray(obj.blocks)) {
            return obj.blocks.map((block: any) => block.data.text).join(" ");
          }
        }
        // Ako ne, vraćamo originalni tekst
        return desc;
      } catch (e) {
        console.error("Greška pri parsiranju opisa:", e);
        // Ako parsiranje ne uspije, izbaci HTML tagove
        return desc.replace(/<[^>]+>/g, '');
      }
    }    

    const getDescription = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.description_cyr : book.description_lat;
  
  if (!book) {
    return <div className="p-8">{t('loadingBookDetails')}</div>;
  }

 // Pretpostavljamo da je userDataPath dobijen iz window.api.getUserDataPath()
    const formattedUserDataPath = userDataPath.replace(/\\/g, '/');
    const mainImageUrl = userDataPath
    ? encodeURI(`file:///${formattedUserDataPath}/images/${book.file_path}`)
    : '';


  return (
    <div className="p-8 ml-48 mt-24">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3">
          {mainImageUrl ? (
            <img
              src={mainImageUrl}
              alt={getTitle(book)}
              className="md:w-2/3 sm:w-2/3 h-80 rounded-2xl object-cover mb-4"
            />
          ) : (
            <div className="w-full h-72 flex items-center justify-center bg-gray-300">
              <span>{t('availableBookDetails')}</span>
            </div>
          )}
        </div>
        <div className="md:w-2/3 md:pl-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-600 dark:text-gray-400">{getTitle(book)}</h1>
          <p className="text-2xl text-gray-500 mb-2">{getAuthor(book)}</p>
          <p className="text-gray-700 dark:text-accentDark mb-2">
            <strong>{t('yearBookDetails')}:</strong> {book.year}
          </p>
          <div
          className="mb-4 text-gray-500 text-clip text-xl"
          dangerouslySetInnerHTML={{ __html: renderDescription(getDescription(book)) }}
        />
          {/*{gallery.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Galerija</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map(img => {
                  const galleryImageUrl = userDataPath
                    ? encodeURI(`file://${userDataPath}/gallery/${img.image_path}`)
                    : '';
                  return (
                    <img
                      key={img.id}
                      src={galleryImageUrl}
                      alt={`Slika ${img.position}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  );
                })}
              </div>
            </div>
          )}*/}
        </div>
      </div>
      <div className="p-2 w-full my-24 flex items-center justify-center">
            <button onClick={() => navigate(-1)} className="relative mb-20 inline-flex h-12 w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
             <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
             <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-accent dark:text-accentDark backdrop-blur-3xl gap-4 uppercase">
             <Undo2 />
             {t('buttonBookDetails')}
            </span>
            </button>
            </div>
    </div>
  );
};

export default BookDetails;
