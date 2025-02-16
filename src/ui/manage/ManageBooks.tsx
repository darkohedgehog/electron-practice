import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import Fuse from 'fuse.js';
import { PenLine, Trash2, ArrowBigLeftDash, ArrowBigRightDash, History, Save, FolderDown, FolderUp } from 'lucide-react';
import exportBooksToExcel from '../components/exportBooksToExcel';
import ExcelJS from 'exceljs';


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
  const [importFile, setImportFile] = useState<File | null>(null);


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

  // Implementacija handleImportFileChange – postavlja odabrani fajl u state
  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImportFile(event.target.files[0]);
    }
  };
// Import podataka iz excel
  const handleImport = async () => {
    if (!importFile) {
      alert("Molimo odaberite Excel fajl.");
      return;
    }
    try {
      const buffer = await importFile.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];
      const importedBooks: Book[] = [];

      // Preskoči prvi red (zaglavlje)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Preskoči zaglavlje
      
        // Ako Excel sadrži ID u prvoj koloni, koristi ga, inače generiši novi (npr. postavi 0)
        const idCell = row.getCell(1).value;
        const id = idCell && idCell.toString().trim() !== "" ? parseInt(idCell.toString(), 10) : 0;
        
        const book: Book = {
          id, // Koristi pročitan ID ili 0 ako nije definisano
          title_lat: row.getCell(2).value?.toString() || "",
          title_cyr: row.getCell(3).value?.toString() || "",
          author_lat: row.getCell(4).value?.toString() || "",
          author_cyr: row.getCell(5).value?.toString() || "",
          year: row.getCell(6).value?.toString() || "",
          file_path: "", // Ako ne unosimo putanju do slike, ostavi prazno
          description_lat: row.getCell(7).value?.toString() || "",
          description_cyr: row.getCell(8).value?.toString() || "",
          added_at: "", // Baza će dodati timestamp
        };
        importedBooks.push(book);
      });
      

      // Ubaci svaku knjigu u bazu
      for (const book of importedBooks) {
        await window.api.addBook(book);
      }
      alert("Import podataka uspešan!");
      setImportFile(null);
      await fetchBooks();
    } catch (error) {
      console.error("Greška pri uvozu podataka:", error);
      alert("Došlo je do greške pri uvozu podataka.");
    }
  };


  const getTitle = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.title_cyr : book.title_lat;
  const getAuthor = (book: Book) =>
    i18n.language === 'sr-Cyrl' ? book.author_cyr : book.author_lat;


  return (
    <div className="p-8 ml-72 mt-24">
      <h1 className="flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-700 dark:from-slate-300 dark:to-slate-500 py-6 mb-12 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-6xl">
        {t('titleManage')}
      </h1>
      {/* Pretraga */}
      {!editingBook && (
        <div className="my-20 flex justify-center items-center mx-auto">
          <input
            type="text"
            placeholder={t('placeholderManage')}
            className="border dark:border-accentDark border-accent rounded-3xl shadow-2xl shadow-slate-400 px-4 py-2 w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Tabela knjiga i paginacija – prikazujemo samo kada modal nije aktivan */}
      {!editingBook && (
        <>
          {filteredBooks.length === 0 ? (
            <p className='text-2xl flex items-center justify-center font-semibold'>{t('availableManage')}</p>
          ) : (
            <>
              <table className="min-w-full border-collapse border border-accent dark:border-accentDark shadow-2xl shadow-slate-400 mt-28">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 border-accent dark:border-accentDark">
                      {t('idManage')}
                    </th>
                    <th className="border px-4 py-2 border-accent dark:border-accentDark">
                    {t('titleLatManage')}
                    </th>
                    <th className="border px-4 py-2 border-accent dark:border-accentDark">
                    {t('titleCyrManage')}
                    </th>
                    <th className="border px-4 py-2 border-accent dark:border-accentDark">
                    {t('authorLatManage')}
                    </th>
                    <th className="border px-4 py-2 border-accent dark:border-accentDark">
                    {t('authorCyrManage')}
                    </th>
                    <th className="border px-4 py-2 border-accent dark:border-accentDark">
                    {t('yearManage')}
                    </th>
                    <th className="border px-4 py-2 border-accent dark:border-accentDark">
                    {t('actionManage')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="border px-4 py-2 border-accent dark:border-accentDark">
                        {book.id}
                      </td>
                      <td className="border px-4 py-2 border-accent dark:border-accentDark">
                        {book.title_lat}
                      </td>
                      <td className="border px-4 py-2 border-accent dark:border-accentDark">
                        {book.title_cyr}
                      </td>
                      <td className="border px-4 py-2 border-accent dark:border-accentDark">
                        {book.author_lat}
                      </td>
                      <td className="border px-4 py-2 border-accent dark:border-accentDark">
                        {book.author_cyr}
                      </td>
                      <td className="border px-4 py-2 border-accent dark:border-accentDark">
                        {book.year}
                      </td>
                      <td className="px-4 py-2 border border-accent dark:border-accentDark flex items-center justify-center">
                        <button 
                          className="mr-2 px-2 py-1 bg-sky-800 text-white rounded" 
                          onClick={() => handleEdit(book)}
                        >
                          <PenLine />
                        </button>
                        <button 
                          className="px-2 py-1 bg-red-500 text-white rounded" 
                          onClick={() => handleDelete(book.id)}
                        >
                         <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Dugmad za export i import */}
            <div className='flex items-end justify-end flex-col my-24 gap-4'>
                {/* Dugme za izvoz baze u Excel */}
               <div className="mb-4 flex justify-center items-center gap-6 text-accent dark:text-accentDark">
                <p>
                  {t('importDataManage')}
                </p>
              <button
                onClick={() => exportBooksToExcel(books)}
                className="px-8 py-2 bg-indigo-800 text-white rounded-2xl shadow-2xl shadow-slate-400"
               >
              <FolderDown />
              </button>
              </div>
              {/* Sekcija za import podataka */}
             <div className="mb-4 flex justify-center items-center gap-6">
             <input type="file" accept=".xlsx, .xls" onChange={handleImportFileChange} className="border px-4 py-2 rounded-2xl border-accent dark:border-accentDark shadow-2xl shadow-slate-400 text-accent dark:text-accentDark" />
            <button
             onClick={handleImport}
              className="px-8 py-2 bg-green-800 text-white rounded-2xl shadow-2xl shadow-slate-400"
              >
             <FolderUp />
            </button>
              </div>
          </div>
              {/* Pagination controls */}
              <div className="my-8 flex justify-center space-x-4">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-500 rounded disabled:opacity-50"
                >
                  <ArrowBigLeftDash />
                </button>
                <span className='text-accent dark:text-accentDark'>
                  {t('pageManage')} {currentPage} {t('fromManage')} {totalPages}
                  </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-500 rounded disabled:opacity-50"
                >
                  <ArrowBigRightDash />
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal za uređivanje - prikazuje se samo kada je editingBook postavljen */}
      {editingBook && (
        <div className="inset-0 flex items-center justify-center w-lvh mt-20">
          <div className="p-6 rounded-3xl shadow-2xl shadow-slate-400 border border-accent dark:border-accentDark w-full">
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {t('editBookManage')}
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block mb-1 text-card-bg-dark dark:text-accentDark">{t('titleLatManage')}:</label>
                <input
                  type="text"
                  name="title_lat"
                  value={formData.title_lat || ''}
                  onChange={handleChange}
                  className="w-full border border-accent dark:border-accentDark rounded-lg px-2 py-1 text-neutral-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-card-bg-dark dark:text-accentDark">{t('titleCyrManage')}:</label>
                <input
                  type="text"
                  name="title_cyr"
                  value={formData.title_cyr || ''}
                  onChange={handleChange}
                  className="w-full border border-accent dark:border-accentDark rounded-lg px-2 py-1 text-neutral-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-card-bg-dark dark:text-accentDark">{t('authorLatManage')}:</label>
                <input
                  type="text"
                  name="author_lat"
                  value={formData.author_lat || ''}
                  onChange={handleChange}
                  className="w-full border border-accent dark:border-accentDark rounded-lg px-2 py-1 text-neutral-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-card-bg-dark dark:text-accentDark">{t('authorCyrManage')}:</label>
                <input
                  type="text"
                  name="author_cyr"
                  value={formData.author_cyr || ''}
                  onChange={handleChange}
                  className="w-full border border-accent dark:border-accentDark rounded-lg px-2 py-1 text-neutral-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-card-bg-dark dark:text-accentDark">{t('yearManage')}:</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year || ''}
                  onChange={handleChange}
                  className="w-full border border-accent dark:border-accentDark rounded-lg px-2 py-1 text-neutral-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-card-bg-dark dark:text-accentDark">{t('descLatManage')}:</label>
                <textarea
                  name="description_lat"
                  value={formData.description_lat || ''}
                  onChange={handleChange}
                  className="w-full border border-accent dark:border-accentDark rounded-lg px-2 py-20 text-neutral-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-card-bg-dark dark:text-accentDark">{t('descCyrManage')}:</label>
                <textarea
                  name="description_cyr"
                  value={formData.description_cyr || ''}
                  onChange={handleChange}
                  className="w-full border border-accent dark:border-accentDark rounded-lg px-2 py-20 text-neutral-500"
                />
              </div>
              {/* Sekcija za promenu slike */}
              <div className="mb-4">
                <label className="block mb-4 text-card-bg-dark dark:text-accentDark">{t('imageManage')}:</label>
                <div className="flex items-center">
                  {formData.file_path && userDataPath ? (
                    <img
                      src={encodeURI(`file:///${userDataPath.replace(/\\/g, '/')}/images/${formData.file_path}`)}
                      alt="Trenutna slika"
                      className="w-32 h-40 object-cover mx-6 rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 mr-4 flex items-center justify-center">
                      <span>{t('noImageManage')}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleChangeImage}
                    className="px-4 py-2 bg-accent text-white rounded-full shadow-2xl shadow-accent dark:shadow-accentDark"
                  >
                    {t('changeImageManage')}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="mr-4 px-4 py-2 bg-gray-400 rounded-full gap-2 flex items-center justify-center text-darkpurple uppercase text-sm font-semibold shadow-2xl shadow-accent dark:shadow-accentDark"
                >
                  <span className='text-darkpurple'><History /></span>
                  {t('quitButtonManage')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-darkpurple rounded-full gap-2 flex items-center justify-center text-accentDark uppercase text-sm font-semibold shadow-2xl shadow-accent dark:shadow-accentDark"
                >
                  <span className='text-accentDark'><Save /></span>
                  {t('saveButtonManage')}
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
