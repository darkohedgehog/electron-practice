import { Book } from '@/global';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const exportBooksToExcel = async (books: Book[]) => {
  try {
    // Kreiraj novi workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Books');

    // Definiši zaglavlja kolona
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Naslov (Lat)', key: 'title_lat', width: 30 },
      { header: 'Naslov (Cyr)', key: 'title_cyr', width: 30 },
      { header: 'Autor (Lat)', key: 'author_lat', width: 25 },
      { header: 'Autor (Cyr)', key: 'author_cyr', width: 25 },
      { header: 'Godina', key: 'year', width: 10 },
      { header: 'Datum unosa', key: 'added_at', width: 20 },
    ];

    // Dodaj redove – mapiraj podatke knjiga
    books.forEach(book => {
      worksheet.addRow({
        id: book.id,
        title_lat: book.title_lat,
        title_cyr: book.title_cyr,
        author_lat: book.author_lat,
        author_cyr: book.author_cyr,
        year: book.year,
        added_at: book.added_at,
      });
    });

    // Opcionalno: formatiraj zaglavlja (stilovi)
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
    });

    // Generiši workbook kao binarni podatak
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'books.xlsx');
  } catch (error) {
    console.error('Greška pri izvozu u Excel:', error);
  }
};

export default exportBooksToExcel;
