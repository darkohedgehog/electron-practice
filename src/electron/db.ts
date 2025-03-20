import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'books.db');
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_lat TEXT,
    title_cyr TEXT,
    author_lat TEXT,
    author_cyr TEXT,
    description_lat TEXT,
    description_cyr TEXT,
    file_path TEXT,
    year TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

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

export function addBook(book: { 
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
    INSERT INTO books (title_lat, title_cyr, author_lat, author_cyr, description_lat, description_cyr, file_path, year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    book.title_lat, 
    book.title_cyr, 
    book.author_lat, 
    book.author_cyr, 
    book.description_lat || null, 
    book.description_cyr || null, 
    book.file_path,
    book.year
  );
  return info.lastInsertRowid;
}

export function getBooks() {
  return db.prepare('SELECT * FROM books ORDER BY added_at DESC').all();
}

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

export function getBookImages(book_id: number) {
  return db.prepare('SELECT * FROM book_images WHERE book_id = ? ORDER BY position ASC, added_at DESC').all(book_id);
}

export function deleteBook(bookId: number) {
  const stmt = db.prepare('DELETE FROM books WHERE id = ?');
  const info = stmt.run(bookId);
  return info.changes;
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
