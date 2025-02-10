import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Book = {
  id: number;
  title_lat: string;
  title_cyr: string;
  author_lat: string;
  author_cyr: string;
  description_lat?: string;
  description_cyr?: string;
  file_path: string; // pretpostavljamo da je to putanja do naslovne slike
  year: string;
};

const Library = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksFromDb = await window.api.getBooks();
        setBooks(booksFromDb);
      } catch (error) {
        console.error('Greška pri učitavanju knjiga:', error);
      }
    };
    fetchBooks();
  }, []);

  // Funkcije za izbor naslova i autora prema jeziku
  const getTitle = (book: Book) => {
    return i18n.language === 'sr-Cyrl' ? book.title_cyr : book.title_lat;
  };

  const getAuthor = (book: Book) => {
    return i18n.language === 'sr-Cyrl' ? book.author_cyr : book.author_lat;
  };

  return (
    <div className="p-8 ml-48">
      <h1 className="text-3xl flex items-center justify-center font-bold mb-6">Knjige</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div
            key={book.id}
            className="border p-4 rounded cursor-pointer hover:shadow-lg"
            onClick={() => navigate(`/library/${book.id}`)}
          >
            <img
              src={book.file_path}
              alt={getTitle(book)}
              className="w-full h-48 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{getTitle(book)}</h2>
            <p className="text-gray-600">{getAuthor(book)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
