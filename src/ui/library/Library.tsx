import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';

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
  added_at: string;
};

const ITEMS_PER_PAGE = 24;

const Library = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [userDataPath, setUserDataPath] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    // Učitaj userDataPath preko funkcije iz preload skripte
    window.api.getUserDataPath()
      .then((path: string) => {
        console.log("userDataPath:", path);
        setUserDataPath(path);
      })
      .catch((err: any) => console.error("Greška pri dobijanju userDataPath:", err));

    const fetchBooks = async () => {
      try {
        const booksFromDb = await window.api.getBooks();
        setBooks(booksFromDb);
        setFilteredBooks(booksFromDb);
        setCurrentPage(1);
      } catch (error) {
        console.error('Greška pri učitavanju knjiga:', error);
      }
    };
    fetchBooks();
  }, []);

  // Fuse.js pretraga – filtriraj knjige kada se searchQuery ili books promene
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
      setCurrentPage(1);
      return;
    }
    const fuse = new Fuse(books, {
      keys: ['title_lat', 'title_cyr', 'author_lat', 'author_cyr', 'year'],
      threshold: 0.3,
    });
    const results = fuse.search(searchQuery);
    setFilteredBooks(results.map(result => result.item));
    setCurrentPage(1);
  }, [searchQuery, books]);

  // Paginacija
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getTitle = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.title_cyr : book.title_lat;

  const getAuthor = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.author_cyr : book.author_lat;

  return (
    <div className="ml-72 mt-24">
      <h1 className="flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-700 dark:from-slate-300 dark:to-slate-500 py-6 mb-12 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-6xl">
        Biblioteka Zaharija Orfelin
      </h1>
      
      {/* Pretraga */}
      <div className="my-20 flex justify-center items-center mx-auto">
        <input
          type="text"
          placeholder="Pretraži knjige..."
          className="border dark:border-accentDark border-accent rounded-3xl shadow-2xl shadow-slate-400 px-4 py-2 w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Prikaz knjiga */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginatedBooks.map((book) => {
          const imageUrl = userDataPath
            ? encodeURI(`file://${userDataPath}/images/${book.file_path}`)
            : '';
          return (
            <div
              key={book.id}
              className="border border-accent dark:border-accentDark p-4 rounded-2xl cursor-pointer hover:shadow-lg shadow-slate-500"
              onClick={() => navigate(`/library/${book.id}`)}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={getTitle(book)}
                  className="w-full h-72 rounded-2xl object-cover mb-4"
                />
              ) : (
                <div className="w-full h-72 flex items-center justify-center bg-gray-300">
                  <span>Slika nije dostupna</span>
                </div>
              )}
              <h2 className="text-3xl font-semibold">{getTitle(book)}</h2>
              <p className="text-slate-400 text-xl">{getAuthor(book)}</p>
              <p className="text-slate-500">Godina: {book.year}</p>
            </div>
          );
        })}
      </div>

      {/* Dugmad za paginaciju */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-4">
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prethodna
          </button>
          <span>Strana {currentPage} od {totalPages}</span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Sledeća
          </button>
        </div>
      )}
    </div>
  );
};

export default Library;
