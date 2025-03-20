import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

// Putanja do SQLite fajla
const dbPath = path.join(app.getPath('userData'), 'books.db');
const db = new Database(dbPath);

// Kreiranje tabele za knjige sa podrškom za latinicu i ćirilicu, dodata kolona "year"
db.prepare(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_lat TEXT,          -- Naslov na latinici
    title_cyr TEXT,          -- Naslov na ćirilici
    author_lat TEXT,         -- Autor na latinici
    author_cyr TEXT,         -- Autor na ćirilici
    description_lat TEXT,    -- Opis na latinici
    description_cyr TEXT,    -- Opis na ćirilici
    file_path TEXT,          -- Putanja do fajla (npr. PDF ili slično)
    year TEXT,               -- Godina izdanja
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Kreiranje tabele za slike
db.prepare(`
  CREATE TABLE IF NOT EXISTS book_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    image_path TEXT,
    image_type TEXT,
    position INTEGER,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id)
  )
`).run();

// Funkcija za dodavanje knjige – prihvata podatke za oba jezika i godinu izdanja
export function addBook(book: { 
  title_lat: string; 
  title_cyr: string;
  author_lat: string;
  author_cyr: string;
  description_lat?: string | object;
  description_cyr?: string | object;
  file_path: string;
  year: string;
}) {
  // Ako je description_lat/cyr objekt, pretvori ih u string
  const descLat = typeof book.description_lat === 'object' 
    ? JSON.stringify(book.description_lat) 
    : book.description_lat;
  const descCyr = typeof book.description_cyr === 'object' 
    ? JSON.stringify(book.description_cyr) 
    : book.description_cyr;

  const stmt = db.prepare(`
    INSERT INTO books (title_lat, title_cyr, author_lat, author_cyr, description_lat, description_cyr, file_path, year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    book.title_lat, 
    book.title_cyr, 
    book.author_lat, 
    book.author_cyr, 
    descLat || null, 
    descCyr || null, 
    book.file_path,
    book.year
  );
  return info.lastInsertRowid;
}


// Funkcija za dobijanje knjiga – vraća sve podatke
export function getBooks() {
  return db.prepare('SELECT * FROM books ORDER BY added_at DESC').all();
}

// Funkcija za dodavanje slike za knjigu
export function addBookImage(image: { 
  book_id: number; 
  image_path: string; 
  image_type: string; 
  position?: number;
}) {
  const stmt = db.prepare('INSERT INTO book_images (book_id, image_path, image_type, position) VALUES (?, ?, ?, ?)');
  const info = stmt.run(image.book_id, image.image_path, image.image_type, image.position || null);
  return info.lastInsertRowid;
}

// Funkcija za dobijanje slika za određenu knjigu
export function getBookImages(book_id: number) {
  return db.prepare('SELECT * FROM book_images WHERE book_id = ? ORDER BY position ASC, added_at DESC').all(book_id);
}


export function deleteBook(bookId: number) {
  const stmt = db.prepare('DELETE FROM books WHERE id = ?');
  const info = stmt.run(bookId);
  return info.changes;  // Broj obrisanih redova
}

export function updateBook(book: { 
  id: number;
  title_lat: string; 
  title_cyr: string;
  author_lat: string;
  author_cyr: string;
  description_lat?: string;
  description_cyr?: string;
  file_path: string;
  year: string;
}) {
  const stmt = db.prepare(`
    UPDATE books
    SET title_lat = ?,
        title_cyr = ?,
        author_lat = ?,
        author_cyr = ?,
        description_lat = ?,
        description_cyr = ?,
        file_path = ?,
        year = ?
    WHERE id = ?
  `);
  const info = stmt.run(
    book.title_lat,
    book.title_cyr,
    book.author_lat,
    book.author_cyr,
    book.description_lat || null,
    book.description_cyr || null,
    book.file_path,
    book.year,
    book.id
  );
  return info.changes;
}

