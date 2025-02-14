import React, { ChangeEvent, useState } from 'react';
import UploadButton from '../components/ui/UploadButton';
import { Save } from 'lucide-react';

const Upload = () => {
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
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  const handleSelectFile = async () => {
    try {
      // Otvori nativni dijalog za odabir fajla
      const selectedFilePath = await window.api.openFileDialog();
      console.log("Selected file path:", selectedFilePath);
      // Kopiraj fajl u folder 'images' i vrati naziv fajla
      const copiedFileName = await window.api.copyImage(selectedFilePath);
      console.log("Slika kopirana, naziv fajla:", copiedFileName);
      setFilePath(copiedFileName);
    } catch (error) {
      console.error("Greška pri otvaranju fajla:", error);
    }
  };
  const handleGalleryChange = async () => {
    try {
      // Otvori dijalog za višestruki odabir
      const selectedFilePaths: string[] = await window.api.openFileDialog();
      console.log("Odabrane galerijske putanje:", selectedFilePaths);
      const copiedFileNames: string[] = [];
      for (let i = 0; i < selectedFilePaths.length; i++) {
        const copiedFileName = await window.api.copyGalleryImage(selectedFilePaths[i]);
        copiedFileNames.push(copiedFileName);
      }
      console.log("Kopirane galerijske slike:", copiedFileNames);
      // Ovdje možeš spremiti kopirane nazive fajlova u state ako želiš
    } catch (error) {
      console.error("Greška pri kopiranju galerijske slike:", error);
    }
  };  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!filePath) {
      alert("Morate odabrati naslovnu sliku!");
      return;
    }
    const book = {
      title_lat: titleLat,
      title_cyr: titleCyr,
      author_lat: authorLat,
      author_cyr: authorCyr,
      description_lat: descriptionLat,
      description_cyr: descriptionCyr,
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
      setGalleryFiles(null);
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
              Baza podataka
            </h1>
            <p className="flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-700 dark:from-slate-300 dark:to-slate-500 py-6 mb-12 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-3xl">
              Unesite podatke o knjizi
            </p>
          </div>
          <form className="flex flex-wrap -m-2" onSubmit={handleSubmit}>
            {/* Polja za unos teksta */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Naslov na latinici'
                    required
                    className="w-full py-10 px-6"
                    value={titleLat}
                    onChange={(e) => setTitleLat(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Naslov na ćirilici'
                    required
                    className="w-full py-10 px-6"
                    value={titleCyr}
                    onChange={(e) => setTitleCyr(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Autor na latinici'
                    required
                    className="w-full py-6 px-6"
                    value={authorLat}
                    onChange={(e) => setAuthorLat(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Autor na ćirilici'
                    required
                    className="w-full py-6 px-6"
                    value={authorCyr}
                    onChange={(e) => setAuthorCyr(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Opis na latinici'
                    required
                    className="w-full py-10 px-6"
                    value={descriptionLat}
                    onChange={(e) => setDescriptionLat(e.target.value)}
                  />
                </div>
              </div>
            </label>
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Opis na ćirilici'
                    required
                    className="w-full py-10 px-6"
                    value={descriptionCyr}
                    onChange={(e) => setDescriptionCyr(e.target.value)}
                  />
                </div>
              </div>
            </label>
            {/* Dugme za odabir slike */}
            <div className="p-2 lg:w-1/3 md:w-1/2 w-full" onClick={handleSelectFile}>
              <UploadButton />
            </div>
            {/* Galerija – input type file, multiple 
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='file'
                    multiple
                    required
                    className="w-full py-6 px-6"
                    onChange={handleGalleryChange}
                  />
                </div>
              </div>
            </label>*/}
            {/* Godina izdanja */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-accent border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Godina izdanja'
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
            Sačuvaj knjigu
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
