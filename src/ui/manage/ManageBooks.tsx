import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';

// Tip knjige – prilagodi prema svojoj bazi
export interface Book {
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
}

const ITEMS_PER_PAGE = 24;

const ManageBooks = () => {
  const { i18n } = useTranslation();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [userDataPath, setUserDataPath] = useState<string>('');

  // Učitaj knjige i userDataPath prilikom mountovanja
  useEffect(() => {
    window.api.getUserDataPath()
      .then((path: string) => {
        console.log("userDataPath:", path);
        setUserDataPath(path);
      })
      .catch((err: any) => console.error("Greška pri dobijanju userDataPath:", err));

    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const booksFromDb = await window.api.getBooks();
      setBooks(booksFromDb);
      setFilteredBooks(booksFromDb);
      setCurrentPage(1);
    } catch (error) {
      console.error("Greška pri učitavanju knjiga:", error);
    }
  };

  // Fuse.js pretraga
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

  // Brisanje knjige
  const handleDelete = async (bookId: number) => {
    try {
      await window.api.deleteBook(bookId);
      await fetchBooks();
    } catch (error) {
      console.error("Greška pri brisanju knjige:", error);
    }
  };

  // Uređivanje – pokretanje uređivanja
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
  };

  // Promena polja u formi
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Promena slike u modal formi
  const handleChangeImage = async () => {
    try {
      const selectedFilePathRaw = await window.api.openFileDialog();
      const selectedFilePath = Array.isArray(selectedFilePathRaw)
        ? selectedFilePathRaw[0]
        : selectedFilePathRaw;
      console.log("Odabrana nova putanja slike:", selectedFilePath);
      const copiedFileName = await window.api.copyImage(selectedFilePath);
      console.log("Nova slika kopirana, naziv fajla:", copiedFileName);
      setFormData(prev => ({ ...prev, file_path: copiedFileName }));
    } catch (error) {
      console.error("Greška pri promeni slike:", error);
    }
  };

  // Ažuriranje knjige
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBook) return;
    try {
      await window.api.updateBook(formData as Book);
      setEditingBook(null);
      setFormData({});
      await fetchBooks();
    } catch (error) {
      console.error("Greška pri ažuriranju knjige:", error);
    }
  };

  // Otkazivanje uređivanja
  const handleCancelEdit = () => {
    setEditingBook(null);
    setFormData({});
  };

  const getTitle = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.title_cyr : book.title_lat;
  const getAuthor = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.author_cyr : book.author_lat;

  return (
    <div className="p-8 ml-48">
      <h1 className="text-3xl font-bold mb-6">Upravljanje knjigama</h1>

      {/* Pretraga */}
      {!editingBook && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Pretraži knjige..."
            className="border px-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Tabela knjiga i paginacija – prikazujemo samo kada modal nije aktivan */}
      {!editingBook && (
        <>
          {filteredBooks.length === 0 ? (
            <p>Nema unetih knjiga.</p>
          ) : (
            <>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Naslov (Lat)</th>
                    <th className="border px-4 py-2">Naslov (Cyr)</th>
                    <th className="border px-4 py-2">Autor (Lat)</th>
                    <th className="border px-4 py-2">Autor (Cyr)</th>
                    <th className="border px-4 py-2">Godina</th>
                    <th className="border px-4 py-2">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="border px-4 py-2">{book.id}</td>
                      <td className="border px-4 py-2">{book.title_lat}</td>
                      <td className="border px-4 py-2">{book.title_cyr}</td>
                      <td className="border px-4 py-2">{book.author_lat}</td>
                      <td className="border px-4 py-2">{book.author_cyr}</td>
                      <td className="border px-4 py-2">{book.year}</td>
                      <td className="border px-4 py-2">
                        <button 
                          className="mr-2 px-2 py-1 bg-blue-500 text-white rounded" 
                          onClick={() => handleEdit(book)}
                        >
                          Uredi
                        </button>
                        <button 
                          className="px-2 py-1 bg-red-500 text-white rounded" 
                          onClick={() => handleDelete(book.id)}
                        >
                          Obriši
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination controls */}
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Prethodna
                </button>
                <span>Strana {currentPage} od {totalPages}</span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Sledeća
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal za uređivanje - prikazuje se samo kada je editingBook postavljen */}
      {editingBook && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="p-6 rounded shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Uredi knjigu</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block mb-1">Naslov (Lat):</label>
                <input
                  type="text"
                  name="title_lat"
                  value={formData.title_lat || ''}
                  onChange={handleChange}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Naslov (Cyr):</label>
                <input
                  type="text"
                  name="title_cyr"
                  value={formData.title_cyr || ''}
                  onChange={handleChange}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Autor (Lat):</label>
                <input
                  type="text"
                  name="author_lat"
                  value={formData.author_lat || ''}
                  onChange={handleChange}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Autor (Cyr):</label>
                <input
                  type="text"
                  name="author_cyr"
                  value={formData.author_cyr || ''}
                  onChange={handleChange}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Godina izdanja:</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year || ''}
                  onChange={handleChange}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Opis (Lat):</label>
                <textarea
                  name="description_lat"
                  value={formData.description_lat || ''}
                  onChange={handleChange}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Opis (Cyr):</label>
                <textarea
                  name="description_cyr"
                  value={formData.description_cyr || ''}
                  onChange={handleChange}
                  className="w-full border px-2 py-1"
                />
              </div>
              {/* Sekcija za promenu slike */}
              <div className="mb-4">
                <label className="block mb-1">Naslovna slika:</label>
                <div className="flex items-center">
                  {formData.file_path && userDataPath ? (
                    <img
                      src={encodeURI(`file://${userDataPath}/images/${formData.file_path}`)}
                      alt="Trenutna slika"
                      className="w-20 h-20 object-cover mr-4"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 mr-4 flex items-center justify-center">
                      <span>Ništa</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleChangeImage}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Promeni sliku
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="mr-4 px-4 py-2 bg-gray-300 rounded"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Sačuvaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
