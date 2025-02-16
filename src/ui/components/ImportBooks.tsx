import React, { useState } from 'react';
import ExcelJS from 'exceljs';

export interface Book {
  // Ne uključujemo id i added_at jer ih baza sama generiše
  title_lat: string;
  title_cyr: string;
  author_lat: string;
  author_cyr: string;
  year: string;
  file_path: string;       // Može ostati prazno ako ne unosimo sliku putem Excela
  description_lat?: string; // Opcionalno
  description_cyr?: string; // Opcionalno
}

const ImportBooks = () => {
  const [file, setFile] = useState<File | null>(null);

  // Handler za promenu inputa fajla
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Funkcija koja učitava Excel fajl, parsira podatke i poziva IPC metodu addBook za svaki red
  const handleImport = async () => {
    if (!file) {
      alert("Molimo odaberite Excel fajl.");
      return;
    }

    try {
      // Učitaj fajl kao ArrayBuffer
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // Pretpostavljamo da su podaci u prvom worksheet-u
      const worksheet = workbook.worksheets[0];
      const importedBooks: Book[] = [];

      // Preskoči zaglavlje (pretpostavljamo da je u prvom redu)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Preskoči zaglavlje

        // Podesi redosled kolona prema tvojoj strukturi Excel fajla
        const book: Book = {
          title_lat: row.getCell(1).value?.toString() || "",
          title_cyr: row.getCell(2).value?.toString() || "",
          author_lat: row.getCell(3).value?.toString() || "",
          author_cyr: row.getCell(4).value?.toString() || "",
          year: row.getCell(5).value?.toString() || "",
          file_path: "", // Ako ne unosimo putanju do slike preko Excela, ovo može ostati prazno
          description_lat: row.getCell(6).value?.toString() || "",
          description_cyr: row.getCell(7).value?.toString() || "",
        };
        importedBooks.push(book);
      });

      // Prolazi kroz svaki importovani objekat i pozovi IPC metodu addBook
      for (const book of importedBooks) {
        await window.api.addBook(book);
      }
      alert("Import podataka uspešan!");
    } catch (error) {
      console.error("Greška pri uvozu iz Excela:", error);
      alert("Došlo je do greške pri uvozu podataka.");
    }
  };

  return (
    <div className="p-8 ml-48">
      <h1 className="text-3xl font-bold mb-4">Importuj knjige iz Excel fajla</h1>
      <div className="mb-4">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </div>
      <button 
        onClick={handleImport}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Importuj podatke
      </button>
    </div>
  );
};

export default ImportBooks;
