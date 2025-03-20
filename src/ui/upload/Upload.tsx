import React, { useState } from 'react';
import UploadButton from '../components/ui/UploadButton';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Upload = () => {
  const { i18n } = useTranslation();
  console.log(window.api);
  // State za unos knjige
  const [titleLat, setTitleLat] = useState('');
  const [titleCyr, setTitleCyr] = useState('');
  const [authorLat, setAuthorLat] = useState('');
  const [authorCyr, setAuthorCyr] = useState('');
  const [descriptionLat, setDescriptionLat] = useState('');
  const [descriptionCyr, setDescriptionCyr] = useState('');
  const [filePath, setFilePath] = useState('');
  const [year, setYear] = useState('');

  // Funkcija koja uklanja HTML tagove
  function stripHTML(html: string): string {
    return html.replace(/<[^>]+>/g, '').trim();
  }

  const handleSelectFile = async () => {
    try {
      console.log("handleSelectFile invoked");
      const selectedFilePath = await window.api.openFileDialog();
      console.log("Selected file path:", selectedFilePath);
      const copiedFileName = await window.api.copyImage(selectedFilePath);
      console.log("Copied file name:", copiedFileName);
      setFilePath(copiedFileName);
      alert("Slika je uspešno odabrana!");
    } catch (error) {
      console.error("Greška pri otvaranju fajla:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Izvlači plain text iz opisa, bez HTML tagova
    const plainDescriptionLat = stripHTML(descriptionLat);
    const plainDescriptionCyr = stripHTML(descriptionCyr);
    
    console.log("Current filePath:", filePath);
    if (!filePath) {
      alert("Morate odabrati naslovnu sliku!");
      return;
    }
    
    const book = {
      title_lat: titleLat,
      title_cyr: titleCyr,
      author_lat: authorLat,
      author_cyr: authorCyr,
      description_lat: plainDescriptionLat,  // sada šaljemo plain text
      description_cyr: plainDescriptionCyr,
      file_path: filePath,
      year: year,
    };
    
    console.log('Podaci koje šaljem:', book);
    try {
      if (!window.api) {
        throw new Error("window.api nije definisan. Proverite preload konfiguraciju i da li pokrećete aplikaciju u Electron-u.");
      }
      const insertedId = await window.api.addBook(book);
      console.log('Knjiga dodata sa ID:', insertedId);
      // Reset forme
      setTitleLat('');
      setTitleCyr('');
      setAuthorLat('');
      setAuthorCyr('');
      setDescriptionLat('');
      setDescriptionCyr('');
      setFilePath('');
      setYear('');
      alert('Knjiga uspešno dodata!');
    } catch (error) {
      console.error('Greška pri dodavanju knjige:', error);
      alert('Došlo je do greške pri dodavanju knjige.');
    }
  };

  return (
    <div className='ml-72 my-8'>
      <div className="text-gray-400">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-700 dark:from-slate-300 dark:to-slate-500 py-6 mb-12 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-6xl">
              {t('titleUpload')}
            </h1>
            <p className="flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-700 dark:from-slate-300 dark:to-slate-500 py-6 mb-12 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-3xl">
              {t('paragraphUpload')}
            </p>
          </div>
          <form className="grid grid-cols-2" onSubmit={handleSubmit}>
            {/* Polja za unos teksta */}
            <label className="p-2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder={t('placeholderLatTitleUpload')}
                    required
                    className="w-full py-10 px-6"
                    value={titleLat}
                    onChange={(e) => setTitleLat(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder={t('placeholderCyrTitleUpload')}
                    required
                    className="w-full py-10 px-6"
                    value={titleCyr}
                    onChange={(e) => setTitleCyr(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder={t('placeholderLatAuthorUpload')}
                    required
                    className="w-full py-6 px-6"
                    value={authorLat}
                    onChange={(e) => setAuthorLat(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder={t('placeholderCyrAuthorUpload')}
                    required
                    className="w-full py-6 px-6"
                    value={authorCyr}
                    onChange={(e) => setAuthorCyr(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 w-full h-full">
              <div className="flex flex-col border-accent border p-4 rounded-lg h-[600px]">
                <ReactQuill
                  value={descriptionLat}
                  onChange={setDescriptionLat}
                  placeholder={t('placeholderLatDescriptionUpload')}
                  className="custom-react-quill h-[500px]"
                />
              </div>
            </label>
            <label className="p-2 w-full h-full">
              <div className="flex flex-col border-accent border p-4 rounded-lg h-[600px]">
                <ReactQuill
                  value={descriptionCyr}
                  onChange={setDescriptionCyr}
                  placeholder={t('placeholderCyrDescriptionUpload')}
                  className="custom-react-quill h-[500px]"
                />
              </div>
            </label>
            {/* Dugme za odabir slike */}
            <div className="p-2 w-full mt-10" onClick={handleSelectFile}>
              <UploadButton onClick={handleSelectFile} />
            </div>
            {/* Godina izdanja */}
            <label className="p-2 w-full mt-10">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder={t('placeholderYearUpload')}
                    required
                    className="w-full py-10 px-6"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>
            </label>
            {/* Dugme za slanje forme */}
            <div className="p-2 w-full my-24 flex items-center justify-center">
              <button type='submit' className="relative mb-20 inline-flex h-12 w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-accent dark:text-accentDark backdrop-blur-3xl gap-3">
                  {t('saveButtonUpload')}
                  <Save />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
