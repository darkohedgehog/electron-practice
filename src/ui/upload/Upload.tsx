import React, { useState } from 'react';

const Upload = () => {
  // State za unos knjige
  const [titleLat, setTitleLat] = useState('');
  const [titleCyr, setTitleCyr] = useState('');
  const [authorLat, setAuthorLat] = useState('');
  const [authorCyr, setAuthorCyr] = useState('');
  const [descriptionLat, setDescriptionLat] = useState('');
  const [descriptionCyr, setDescriptionCyr] = useState('');
  const [filePath, setFilePath] = useState('');
  const [year, setYear] = useState('');
  // State za galeriju
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  // Handler za upload fajla (npr. naslovna slika)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0] as File & { path: string };
      setFilePath(file.path);
    }
  };

  // Handler za galeriju
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(e.target.files);
    }
  };

  // Handler za form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Pripremi objekat knjige
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

    try {
      // Pozivamo IPC kanal definisan u preload-u da dodamo knjigu
      const insertedId = await window.api.addBook(book);
      console.log('Knjiga dodata sa ID:', insertedId);

      // Ako postoje galerijske slike, dodaj ih u bazu
      if (galleryFiles) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i] as File & { path: string };
          await window.api.addBookImage({
            book_id: insertedId as number,
            image_path: file.path,
            image_type: 'gallery',
            position: i,
          });
        }
      }

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
    <div className='ml-48 my-8'>
      <div className="text-gray-400">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              Baza podataka
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Unesite podatke o knjizi.
            </p>
          </div>
          <form className="flex flex-wrap -m-2" onSubmit={handleSubmit}>
            {/* Naslov na latinici */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Naslov na latinici'
                    required
                    className="w-full py-6 px-6"
                    value={titleLat}
                    onChange={(e) => setTitleLat(e.target.value)}
                  />
                </div>
              </div>
            </label>
            {/* Naslov na ćirilici */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Naslov na ćirilici'
                    required
                    className="w-full py-6 px-6"
                    value={titleCyr}
                    onChange={(e) => setTitleCyr(e.target.value)}
                  />
                </div>
              </div>
            </label>
            {/* Autor na latinici */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
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
            {/* Autor na ćirilici */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
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
            {/* Opis na latinici */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Opis na latinici'
                    required
                    className="w-full py-6 px-6"
                    value={descriptionLat}
                    onChange={(e) => setDescriptionLat(e.target.value)}
                  />
                </div>
              </div>
            </label>
            {/* Opis na ćirilici */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Opis na ćirilici'
                    required
                    className="w-full py-6 px-6"
                    value={descriptionCyr}
                    onChange={(e) => setDescriptionCyr(e.target.value)}
                  />
                </div>
              </div>
            </label>
            {/* Ubaci naslovnu sliku – input type file */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='file'
                    required
                    className="w-full py-6 px-6"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </label>
            {/* Galerija – input type file, multiple */}
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
            </label>
            {/* Godina izdanja */}
            <label className="p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg">
                <div className="flex-grow">
                  <input
                    type='text'
                    placeholder='Godina izdanja'
                    required
                    className="w-full py-6 px-6"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>
            </label>
            {/* Dugme za slanje forme */}
            <div className="p-2 w-full">
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white rounded"
              >
                Sačuvaj knjigu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
