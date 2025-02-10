import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
    // Postavi userDataPath iz window.api – pretpostavljamo da je izložen kao svojstvo
    setUserDataPath(window.api.userDataPath);
  
    const fetchBookDetails = async () => {
      try {
        // Učitaj sve knjige i filtriraj po id-ju
        const books = await window.api.getBooks();
        const foundBook = books.find((b: Book) => b.id === Number(id));
        setBook(foundBook ?? null); // Ako foundBook bude undefined, postavi null
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
  

  const getTitle = (book: Book) => {
    return i18n.language === 'sr-Cyrl' ? book.title_cyr : book.title_lat;
  };

  const getAuthor = (book: Book) => {
    return i18n.language === 'sr-Cyrl' ? book.author_cyr : book.author_lat;
  };

  const getDescription = (book: Book) => {
    return i18n.language === 'sr-Cyrl' ? book.description_cyr : book.description_lat;
  };

  if (!book) {
    return <div className="p-8">Učitavanje...</div>;
  }

  // Konstruši puni URL za glavnu sliku koristeći userDataPath i folder "images"
  const mainImageUrl = userDataPath
    ? `file://${userDataPath}/images/${book.file_path}`
    : book.file_path; // fallback, ali idealno je puni URL

  return (
    <div className="p-8 ml-48">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded">
        Nazad
      </button>
      <div className="flex flex-col md:flex-row">
        {/*<div className="md:w-1/3">
          <img
            src={mainImageUrl}
            alt={getTitle(book)}
            className="w-full h-auto object-cover"
          />
         </div>*/}
        <div className="md:w-2/3 md:pl-8">
          <h1 className="text-3xl font-bold mb-2">{getTitle(book)}</h1>
          <p className="text-xl text-gray-700 mb-2">{getAuthor(book)}</p>
          <p className="text-gray-600 mb-2">
            <strong>Godina izdanja:</strong> {book.year}
          </p>
          <p className="mb-4">{getDescription(book)}</p>
          {gallery.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Galerija</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map(img => {
                  // Za galerijske slike, ako su kopirane u drugi folder (npr. "gallery"),
                  // konstruši URL slično kao za glavnu sliku:
                  const galleryImageUrl = userDataPath
                    ? `file://${userDataPath}/gallery/${img.image_path}`
                    : img.image_path;
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
