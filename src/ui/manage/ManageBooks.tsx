import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Definiši tip za knjigu – prilagodi prema svojoj bazi
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

const ManageBooks = () => {
  const { i18n } = useTranslation();
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({});
  
  // Učitaj knjige iz baze
  const fetchBooks = async () => {
    try {
      const booksFromDb = await window.api.getBooks();
      setBooks(booksFromDb);
    } catch (error) {
      console.error('Greška pri učitavanju knjiga:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handler za brisanje knjige
  const handleDelete = async (bookId: number) => {
    try {
      await window.api.deleteBook(bookId);
      await fetchBooks();
    } catch (error) {
      console.error('Greška pri brisanju knjige:', error);
    }
  };

  // Handler za pokretanje uređivanja knjige
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
  };

  // Handler za promenu polja u formi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler za ažuriranje knjige
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBook) return;
    try {
      // Pretpostavljamo da postoji IPC metoda updateBook
      await window.api.updateBook(formData as Book);
      setEditingBook(null);
      setFormData({});
      await fetchBooks();
    } catch (error) {
      console.error('Greška pri ažuriranju knjige:', error);
    }
  };

  // Handler za otkazivanje uređivanja
  const handleCancelEdit = () => {
    setEditingBook(null);
    setFormData({});
  };

  return (
    <div className="p-8 ml-48">
      <h1 className="text-3xl font-bold mb-6">Upravljanje knjigama</h1>
      {books.length === 0 ? (
        <p>Nema unetih knjiga.</p>
      ) : (
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
            {books.map((book) => (
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
      )}

      {/* Modal za uređivanje */}
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
